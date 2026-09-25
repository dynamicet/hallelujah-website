\if :{?appointment_runtime_role}
\else
  \echo 'appointment_runtime_role is required'
  \quit 2
\endif

BEGIN;

CREATE TABLE appointment.request_intents (
  intent_key_hash text PRIMARY KEY CHECK (intent_key_hash ~ '^[a-f0-9]{64}$'),
  payload_fingerprint text NOT NULL CHECK (payload_fingerprint ~ '^[a-f0-9]{64}$'),
  request_id uuid NOT NULL UNIQUE REFERENCES appointment.requests(id)
    ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

ALTER TABLE appointment.audit_events
  DROP CONSTRAINT audit_events_event_type_check,
  ADD CONSTRAINT audit_events_event_type_check CHECK (event_type IN (
    'appointment.request.accepted',
    'appointment.request.reconciled',
    'appointment.request.rejected'
  )),
  DROP CONSTRAINT audit_events_outcome_class_check,
  ADD CONSTRAINT audit_events_outcome_class_check CHECK (outcome_class IN (
    'accepted',
    'reconciled',
    'idempotency_conflict',
    'invalid_selector',
    'rate_limited'
  ));

SELECT format(
  'REVOKE EXECUTE ON FUNCTION appointment.submit_request(text,text,text,text,text,date,text,boolean,text,uuid,boolean) FROM %I',
  :'appointment_runtime_role'
) \gexec

DROP FUNCTION appointment.submit_request(
  text, text, text, text, text, date, text, boolean, text, uuid, boolean
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
  p_synthetic boolean,
  p_intent_key_hash text,
  p_payload_fingerprint text
)
RETURNS TABLE (outcome text, public_reference uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, appointment
AS $function$
DECLARE
  v_now timestamptz := clock_timestamp();
  v_attempt_count integer;
  v_existing_fingerprint text;
  v_existing_reference uuid;
  v_intent_created boolean := false;
  v_reference uuid;
  v_request_id uuid := gen_random_uuid();
  v_selector_valid boolean;
BEGIN
  IF NOT p_synthetic THEN
    RAISE EXCEPTION 'personal-data activation is not authorized';
  END IF;
  IF p_intent_key_hash !~ '^[a-f0-9]{64}$'
    OR p_payload_fingerprint !~ '^[a-f0-9]{64}$'
  THEN
    RAISE EXCEPTION 'appointment request failed the database contract';
  END IF;

  SELECT intents.payload_fingerprint, requests.public_reference
  INTO v_existing_fingerprint, v_existing_reference
  FROM appointment.request_intents AS intents
  JOIN appointment.requests AS requests ON requests.id = intents.request_id
  WHERE intents.intent_key_hash = p_intent_key_hash;

  IF FOUND THEN
    IF v_existing_fingerprint <> p_payload_fingerprint THEN
      INSERT INTO appointment.audit_events (event_type, outcome_class, correlation_id)
      VALUES ('appointment.request.rejected', 'idempotency_conflict', p_correlation_id);
      RETURN QUERY SELECT 'idempotency_conflict'::text, NULL::uuid;
    ELSE
      INSERT INTO appointment.audit_events (event_type, outcome_class, correlation_id)
      VALUES ('appointment.request.reconciled', 'reconciled', p_correlation_id);
      RETURN QUERY SELECT 'reconciled'::text, v_existing_reference;
    END IF;
    RETURN;
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

  INSERT INTO appointment.request_intents (
    intent_key_hash, payload_fingerprint, request_id
  ) VALUES (
    p_intent_key_hash, p_payload_fingerprint, v_request_id
  )
  ON CONFLICT (intent_key_hash) DO NOTHING
  RETURNING true INTO v_intent_created;

  IF NOT COALESCE(v_intent_created, false) THEN
    SELECT intents.payload_fingerprint, requests.public_reference
    INTO v_existing_fingerprint, v_existing_reference
    FROM appointment.request_intents AS intents
    JOIN appointment.requests AS requests ON requests.id = intents.request_id
    WHERE intents.intent_key_hash = p_intent_key_hash;

    IF v_existing_fingerprint <> p_payload_fingerprint THEN
      INSERT INTO appointment.audit_events (event_type, outcome_class, correlation_id)
      VALUES ('appointment.request.rejected', 'idempotency_conflict', p_correlation_id);
      RETURN QUERY SELECT 'idempotency_conflict'::text, NULL::uuid;
    ELSE
      INSERT INTO appointment.audit_events (event_type, outcome_class, correlation_id)
      VALUES ('appointment.request.reconciled', 'reconciled', p_correlation_id);
      RETURN QUERY SELECT 'reconciled'::text, v_existing_reference;
    END IF;
    RETURN;
  END IF;

  INSERT INTO appointment.requests (
    id,
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
    v_request_id,
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

REVOKE ALL ON TABLE appointment.request_intents FROM PUBLIC;
REVOKE ALL ON FUNCTION appointment.submit_request(
  text, text, text, text, text, date, text, boolean, text, uuid, boolean, text, text
) FROM PUBLIC;

SELECT format(
  'GRANT EXECUTE ON FUNCTION appointment.submit_request(text,text,text,text,text,date,text,boolean,text,uuid,boolean,text,text) TO %I',
  :'appointment_runtime_role'
) \gexec

INSERT INTO appointment.schema_migrations (version) VALUES ('0002_b03_016_idempotency');

COMMIT;
