# Environment and Secrets Runbook

**Status:** Controlled-development baseline under `B00-006`

**Applies to:** Local, staging/acceptance, and production configuration

**Production, provider, publication, and personal-data authority:** Not granted

## Configuration contract

`APP_ENVIRONMENT` selects exactly one environment: `local`, `staging`, or `production`.
Only the matching credential pair may be present:

| Selected environment | Required credential names | Required content database |
| --- | --- | --- |
| `local` | `LOCAL_DATABASE_URL`, `LOCAL_PAYLOAD_SECRET` | `hallelujah_content_local` |
| `staging` | `STAGING_DATABASE_URL`, `STAGING_PAYLOAD_SECRET` | `hallelujah_content_staging` |
| `production` | `PRODUCTION_DATABASE_URL`, `PRODUCTION_PAYLOAD_SECRET` | `hallelujah_content_production` |

`PERSONAL_DATA_COLLECTION` and `EXTERNAL_SERVICES` are also required and their only accepted
value is `disabled`. Changing the schema is not authority to enable either capability: reopen
the controlling privacy, security, appointment, provider, and release decisions first.

The application rejects a missing or unknown environment, missing selected credentials,
credentials from another environment, non-PostgreSQL or environment-mismatched database URLs,
Payload secrets shorter than 32 bytes, and either gated capability set to anything other than
`disabled`. Errors identify variable names and requirements only. They must never include a URL,
username, password, token, secret value, or database response.

The production-mode application build does not need live runtime credentials. `dev` and `start`
run the configuration check before serving. Loading the Payload configuration repeats the same
validation; it never substitutes an empty or default credential.

## Supplying values

- The committed [`apps/web/.env.example`](../../apps/web/.env.example) is an inventory only. Keep
  every assignment blank in source control.
- Local development may use an ignored `apps/web/.env.local`, readable only by its developer.
  Use synthetic local data only. Never copy a legacy, staging, or production value into it.
- Staging and production values must be injected at runtime by the separately approved hosting
  or secret-delivery mechanism. Do not bake them into an image, build output, source file,
  workflow, command history, ticket, screenshot, log, or CI artifact.
- A staging process receives only `STAGING_*`; a production process receives only `PRODUCTION_*`.
  Supplying any non-selected credential scope fails closed.
- Generate each Payload secret independently with a cryptographically secure generator. Do not
  reuse a secret between environments or reuse a credential from the legacy WordPress system.

Validate a configured environment without contacting the database:

```sh
pnpm --dir apps/web config:check
```

The successful output contains only the selected environment and the two disabled gate states.
Do not capture the process environment or use shell tracing while handling real values.

## Rotation procedure

Rotate on suspected exposure, staff or access change, material environment change, provider or
host migration, cryptographic concern, or the cadence later approved by the named Security owner.
The ticket may record the credential identifier/version, environment, owner, start/finish time,
reason, validation result, and revocation result—but never the value.

1. Confirm the target environment and authorized responsible and acceptance people. Stop if the
   request would cross environments or if no approved secret-delivery path exists.
2. Create a new environment-specific credential through the approved generator/store. Grant only
   the access required by its current service role; database-role design remains `B00-008`.
3. For a database credential, make the new credential valid alongside the old one where the
   approved database mechanism permits. For the Payload secret, plan for existing sessions to be
   invalidated and communicate the maintenance impact before replacement.
4. Update only the target environment, run `config:check`, deploy through the applicable controlled
   process, and perform non-sensitive readiness/authentication checks.
5. Revoke the previous credential promptly after validation. Confirm it no longer authenticates;
   do not print either credential during the test.
6. Record a sanitized evidence pointer and any failure/rollback. If validation fails, restore the
   previously approved credential reference, remove the failed credential, and keep the target
   environment unavailable until the boundary is understood.

Rotation of production credentials and production validation remain approval-controlled and are
not authorized by this development baseline.

## Emergency access

Emergency access is exceptional, named, least-privilege, time-limited, and independently reviewed.
It must use an approved access system with MFA and audit records; a shared permanent “break-glass”
secret in this repository is prohibited.

1. Record the incident/change reference, target environment, reason, requested privilege, named
   requester, named approver, and automatic expiry outside the repository if the record is restricted.
2. Grant only the minimum temporary access. Do not export secrets or production data to a local or
   staging environment.
3. Perform the bounded recovery action with command tracing and environment dumps disabled.
4. Revoke the access at expiry or immediately after recovery, review the audit record, rotate any
   credential that may have been exposed, and verify ordinary service access.
5. Store only a sanitized pointer and outcome in repository evidence. Security detail, identities,
   contact information, logs, and credentials remain in the authorized restricted system.

If an approved identity/access mechanism, named approver, restricted evidence location, or safe
recovery path does not exist, emergency access fails closed. It is not replaced with a local copy,
shared password, untracked account, or repository secret.

## Boundary ownership and review

Temporary controlled-development responsibility remains with the client workspace identity
directing Codex. Named DevOps and Security people must review the actual delivery mechanisms,
permissions, rotation cadence, recovery access, and production evidence before production
acceptance. Revisit this contract when `B00-007`, `B00-008`, `B00-011`, `B00-012`, `B00-014`,
`B00-015`, or any personal-data/provider gate changes its assumptions.
