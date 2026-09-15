# `B02-001` Controlled CMS Integration Evidence — 16 September 2026

| Field | Record |
| --- | --- |
| Ticket / state | `B02-001` Proposed → Ready → In progress → In review for controlled development; Done awaits exact-head hosted implementation `T1` |
| Direction / temporary responsible and acceptance | Client workspace identity `befikadusata` directed completion on 16 September 2026, Africa/Addis_Ababa; Codex implemented and checked in temporary Backend, Content, and QA roles. Named production owners remain due. |
| Target | Isolated local `T0`; disposable PostgreSQL 18.6 Unix-socket clusters; private-repository `T1` still pending |
| Build and issue | Branch `b02-001-controlled-governed-records` after pull request `#19` merged; [issue `#20`](https://github.com/dynamicet/hallelujah-website/issues/20) and [pull request `#21`](https://github.com/dynamicet/hallelujah-website/pull/21) |
| Method | Payload collection write hook over pure governed-record validator; synthetic create and retirement through Payload Local API; separate negative role/database checks over `psql`; no TCP listener or real records |
| Expected / actual | Synthetic record saved and retired but remained public-ineligible; unauthenticated collection access and endpoints disabled by config; stable public ID and append-only audit enforced; cross-role database connections/read/mutations denied. Local checks passed. |
| Defect / retest | First CMS schema push proposed deleting the role-isolation fixture table and was declined. A fresh cluster kept the role evidence intact. PostgreSQL JSON key reordering exposed an audit comparison defect; field-wise comparison passed on retest. Payload's PostgreSQL adapter retains one reconnect client, so the one-shot smoke exits after its assertions. |
| Evidence handling | Repository contains only synthetic source/test data and this sanitized record. Temporary clusters remain under `/tmp`; no credentials, appointment data, authentic content, or restricted output captured. |
| Full repository verification | Pinned Node.js 24.21.0 `pnpm verify` passed on 16 September 2026 after rerunning local loopback checks outside the sandbox: toolchain, formatting, CI controls, links, secrets, backlog, brand, introduction gates, lint, types, application tests/build, accessibility, asset budgets, runtime, and rendered foundations. |
| Security/dependency check | Reachable-history `pnpm secrets:check --history` passed. Escalated package-registry advisory check covered 650 dependencies with zero moderate, high, or critical known vulnerabilities. |
| Remaining | Hosted exact-head CI, issue/backlog Done promotion, and production gates for real owners, workflow, VPS provisioning, authentic content, and publication. |

The local role checker passed again on 16 September 2026 against the original isolated fixture cluster. The CMS persistence smoke passed against a second clean cluster after Payload created its own tables. The installed adapter warns that no email adapter is configured; the controlled smoke sends no email and external services remain disabled.
