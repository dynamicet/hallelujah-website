\if :{?appointment_runtime_role}
\else
  \echo 'appointment_runtime_role is required'
  \quit 2
\endif

BEGIN;

CREATE SCHEMA appointment;
REVOKE ALL ON SCHEMA appointment FROM PUBLIC;

CREATE TABLE appointment.schema_migrations (
  version text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE appointment.privacy_notices (
  version text PRIMARY KEY CHECK (version ~ '^[a-z0-9][a-z0-9._-]{2,63}$'),
  enabled boolean NOT NULL DEFAULT false,
  synthetic boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE appointment.care_catalog (
  public_id text PRIMARY KEY CHECK (public_id ~ '^(doc|svc)_[a-z0-9][a-z0-9_-]{15,63}$'),
  kind text NOT NULL CHECK (kind IN ('doctor', 'service')),
  active boolean NOT NULL DEFAULT false,
  synthetic boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  CHECK (
    (kind = 'doctor' AND public_id LIKE 'doc_%')
    OR (kind = 'service' AND public_id LIKE 'svc_%')
  )
);

CREATE TABLE appointment.requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_reference uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  care_route text NOT NULL CHECK (care_route IN ('doctor', 'service', 'not_sure')),
  doctor_id text REFERENCES appointment.care_catalog(public_id),
  service_id text REFERENCES appointment.care_catalog(public_id),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 32),
  preferred_date date,
  privacy_notice_version text NOT NULL REFERENCES appointment.privacy_notices(version),
  privacy_acknowledged_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'closed', 'cancelled')),
  delivery_status text NOT NULL DEFAULT 'not_attempted'
    CHECK (delivery_status IN ('not_attempted', 'pending', 'sent', 'failed')),
  synthetic boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  closed_at timestamptz,
  CHECK (
    (care_route = 'doctor' AND doctor_id IS NOT NULL AND service_id IS NULL)
    OR (care_route = 'service' AND doctor_id IS NULL AND service_id IS NOT NULL)
    OR (care_route = 'not_sure' AND doctor_id IS NULL AND service_id IS NULL)
  ),
  CHECK (preferred_date IS NULL OR preferred_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 365),
  CHECK ((status IN ('closed', 'cancelled')) = (closed_at IS NOT NULL))
);

CREATE TABLE appointment.abuse_windows (
  abuse_key text PRIMARY KEY CHECK (abuse_key ~ '^[a-f0-9]{64}$'),
  window_started_at timestamptz NOT NULL,
  attempt_count integer NOT NULL CHECK (attempt_count > 0),
  expires_at timestamptz NOT NULL
);

CREATE INDEX abuse_windows_expiry_idx ON appointment.abuse_windows (expires_at);

CREATE TABLE appointment.audit_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_type text NOT NULL CHECK (event_type IN (
    'appointment.request.accepted',
    'appointment.request.rejected'
  )),
  outcome_class text NOT NULL CHECK (outcome_class IN (
    'accepted',
    'invalid_selector',
    'rate_limited'
  )),
  correlation_id uuid NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

CREATE FUNCTION appointment.submit_request(
  p_full_name text,
  p_phone text,
  p_care_route text,
  p_doctor_id text,
  p_service_id text,
  p_preferred_date date,
  p_notice_version text,
  p_privacy_acknowledged boolean,
  p_abuse_key text,
  p_correlation_id uuid,
  p_synthetic boolean
)
RETURNS TABLE (outcome text, public_reference uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, appointment
AS $function$
DECLARE
  v_now timestamptz := clock_timestamp();
  v_attempt_count integer;
  v_reference uuid;
  v_selector_valid boolean;
BEGIN
  IF NOT p_synthetic THEN
    RAISE EXCEPTION 'personal-data activation is not authorized';
  END IF;
  IF p_full_name NOT LIKE 'Synthetic %' OR p_phone !~ '^[+]?0{7,15}$' THEN
    RAISE EXCEPTION 'controlled submissions must use visibly synthetic values';
  END IF;
  IF p_privacy_acknowledged IS DISTINCT FROM true
    OR p_abuse_key !~ '^[a-f0-9]{64}$'
    OR char_length(p_full_name) NOT BETWEEN 2 AND 120
    OR p_full_name ~ '[[:cntrl:]]'
    OR char_length(p_phone) NOT BETWEEN 7 AND 32
    OR p_preferred_date IS NOT NULL
      AND p_preferred_date NOT BETWEEN CURRENT_DATE AND CURRENT_DATE + 365
  THEN
    RAISE EXCEPTION 'appointment request failed the database contract';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM appointment.privacy_notices
    WHERE version = p_notice_version AND enabled AND synthetic
  ) THEN
    RAISE EXCEPTION 'appointment privacy notice is unavailable';
  END IF;

  DELETE FROM appointment.abuse_windows WHERE expires_at <= v_now;
  INSERT INTO appointment.abuse_windows (
    abuse_key, window_started_at, attempt_count, expires_at
  ) VALUES (
    p_abuse_key, v_now, 1, v_now + interval '10 minutes'
  )
  ON CONFLICT (abuse_key) DO UPDATE SET
    window_started_at = CASE
      WHEN appointment.abuse_windows.expires_at <= v_now THEN v_now
      ELSE appointment.abuse_windows.window_started_at
    END,
    attempt_count = CASE
      WHEN appointment.abuse_windows.expires_at <= v_now THEN 1
      ELSE appointment.abuse_windows.attempt_count + 1
    END,
    expires_at = CASE
      WHEN appointment.abuse_windows.expires_at <= v_now THEN v_now + interval '10 minutes'
      ELSE appointment.abuse_windows.expires_at
    END
  RETURNING attempt_count INTO v_attempt_count;

  IF v_attempt_count > 5 THEN
    INSERT INTO appointment.audit_events (event_type, outcome_class, correlation_id)
    VALUES ('appointment.request.rejected', 'rate_limited', p_correlation_id);
    RETURN QUERY SELECT 'rate_limited'::text, NULL::uuid;
    RETURN;
  END IF;

  v_selector_valid := CASE p_care_route
    WHEN 'doctor' THEN p_service_id IS NULL AND EXISTS (
      SELECT 1 FROM appointment.care_catalog
      WHERE public_id = p_doctor_id AND kind = 'doctor' AND active AND synthetic
    )
    WHEN 'service' THEN p_doctor_id IS NULL AND EXISTS (
      SELECT 1 FROM appointment.care_catalog
      WHERE public_id = p_service_id AND kind = 'service' AND active AND synthetic
    )
    WHEN 'not_sure' THEN p_doctor_id IS NULL AND p_service_id IS NULL
    ELSE false
  END;

  IF NOT v_selector_valid THEN
    INSERT INTO appointment.audit_events (event_type, outcome_class, correlation_id)
    VALUES ('appointment.request.rejected', 'invalid_selector', p_correlation_id);
    RETURN QUERY SELECT 'invalid_selector'::text, NULL::uuid;
    RETURN;
  END IF;

  INSERT INTO appointment.requests (
    care_route,
    doctor_id,
    service_id,
    full_name,
    phone,
    preferred_date,
    privacy_notice_version,
    privacy_acknowledged_at,
    synthetic
  ) VALUES (
    p_care_route,
    p_doctor_id,
    p_service_id,
    p_full_name,
    p_phone,
    p_preferred_date,
    p_notice_version,
    v_now,
    p_synthetic
  ) RETURNING requests.public_reference INTO v_reference;

  INSERT INTO appointment.audit_events (event_type, outcome_class, correlation_id)
  VALUES ('appointment.request.accepted', 'accepted', p_correlation_id);
  RETURN QUERY SELECT 'accepted'::text, v_reference;
END;
$function$;

REVOKE ALL ON ALL TABLES IN SCHEMA appointment FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA appointment FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA appointment FROM PUBLIC;
SELECT format('GRANT USAGE ON SCHEMA appointment TO %I', :'appointment_runtime_role') \gexec
SELECT format(
  'GRANT EXECUTE ON FUNCTION appointment.submit_request(text,text,text,text,text,date,text,boolean,text,uuid,boolean) TO %I',
  :'appointment_runtime_role'
) \gexec

INSERT INTO appointment.schema_migrations (version) VALUES ('0001_b03_015_foundation');

COMMIT;
