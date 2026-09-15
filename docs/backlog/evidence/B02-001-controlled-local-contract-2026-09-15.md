# `B02-001` Controlled Local Contract Evidence — 15 September 2026

| Field | Record |
| --- | --- |
| Ticket / change | `B02-001` remains Proposed with controlled technical preparation; `B00-008` remains Blocked |
| Direction / temporary responsible and acceptance | Client workspace identity `befikadusata` directed the local sequencing boundary; Codex implemented and checked it in temporary Backend/QA roles. Named production Backend, DevOps, Content, Security, and hospital acceptance owners remain due. |
| Target | Isolated local `T0`, PostgreSQL 18.6 disposable cluster with synthetic rows only; repository source under controlled development |
| Build | Controlled implementation prepared on branch `b02-001-controlled-governed-records` from `main` after merge of pull request `#19`; no hosted `T1` acceptance claim |
| Method | Pure TypeScript schema/negative fixture checks and local PostgreSQL own-role/cross-role denial queries over a Unix socket with `listen_addresses` empty |
| Expected / actual | Synthetic record remains ineligible for public use; invalid governance/relationships/status/dates fail; each local role reads its own fixture and receives permission denial on the other database. All targeted checks passed. |
| Evidence handling | No credentials, real hospital records, patient data, or restricted database output captured. Temporary cluster directory remained outside the repository. |
| Defect / retest | Initial own-table read failed because setup SQL created tables as the local administrator without granting own-role table privileges. SQL grants were added and the isolation checker passed on retest. |
| Repository verification | Pinned Node.js 24.21.0 `pnpm verify` passed after the local server bind check was rerun outside the sandbox; toolchain, format, CI policy, links, secrets, backlog, brand, lint, types, tests, build, accessibility, budgets, runtime, and rendered foundation gates passed. |
| Final targeted retest / dependency audit | After public-eligibility validation was tightened, governed-record checks, typecheck, backlog audit, link check, reachable-history secret scan, and `git diff --check` passed. A fresh escalated package-registry audit reported 650 dependencies and zero low, moderate, high, or critical advisories. |
| Remaining | Review/hosted implementation `T1`, integration with governed CMS records, production owner approval, and VPS-specific `B00-008` tests. The GitHub CLI token succeeds outside the sandbox on 16 September 2026. |

The targeted check used the pinned Node.js 24.21.0 binary and the installed PostgreSQL 18.6 binaries. Local container access was unavailable; the Unix-socket startup required command escalation because the sandbox disallowed socket binding. The initial sandboxed registry audit stalled, then returned a complete clean report after escalation. Passing local SQL permissions does not authorize remote provisioning, collection, or publication.
