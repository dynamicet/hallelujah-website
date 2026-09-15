-- Disposable local controlled fixture only. No hospital or appointment data.
CREATE ROLE hallelujah_content_local LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION;
CREATE ROLE hallelujah_appointment_local LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION;

CREATE DATABASE hallelujah_content_local OWNER hallelujah_content_local;
CREATE DATABASE hallelujah_appointment_local OWNER hallelujah_appointment_local;

REVOKE ALL ON DATABASE hallelujah_content_local FROM PUBLIC;
REVOKE ALL ON DATABASE hallelujah_appointment_local FROM PUBLIC;
GRANT CONNECT ON DATABASE hallelujah_content_local TO hallelujah_content_local;
GRANT CONNECT ON DATABASE hallelujah_appointment_local TO hallelujah_appointment_local;

\connect hallelujah_content_local
CREATE TABLE controlled_content_fixture (id integer PRIMARY KEY, label text NOT NULL);
INSERT INTO controlled_content_fixture VALUES (1, 'synthetic-content');
GRANT SELECT, INSERT, UPDATE, DELETE ON controlled_content_fixture TO hallelujah_content_local;

\connect hallelujah_appointment_local
CREATE TABLE controlled_appointment_fixture (id integer PRIMARY KEY, label text NOT NULL);
INSERT INTO controlled_appointment_fixture VALUES (1, 'synthetic-appointment');
GRANT SELECT, INSERT, UPDATE, DELETE ON controlled_appointment_fixture TO hallelujah_appointment_local;
