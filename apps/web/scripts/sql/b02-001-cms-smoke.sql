-- Fresh disposable local cluster, synthetic Payload integration only.
CREATE ROLE hallelujah_content_local LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION;
CREATE ROLE hallelujah_appointment_local LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION;
CREATE DATABASE hallelujah_content_local OWNER hallelujah_content_local;
CREATE DATABASE hallelujah_appointment_local OWNER hallelujah_appointment_local;
REVOKE ALL ON DATABASE hallelujah_content_local FROM PUBLIC;
REVOKE ALL ON DATABASE hallelujah_appointment_local FROM PUBLIC;
GRANT CONNECT ON DATABASE hallelujah_content_local TO hallelujah_content_local;
GRANT CONNECT ON DATABASE hallelujah_appointment_local TO hallelujah_appointment_local;
