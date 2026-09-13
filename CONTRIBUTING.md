# Contributing

All changes must follow the authority order and scope controls in [the implementation backlog](docs/backlog/README.md). A coding change needs a backlog ID, an allowed file boundary, exact verification commands, and sanitized evidence.

## Development flow

1. Confirm the ticket is `Ready` or `In progress` on the execution board.
2. Create the smallest scoped change from a clean branch.
3. Run `pnpm verify`; run `pnpm audit:dependencies` and `pnpm secrets:check --history` for the full local equivalent of the hosted security gate.
4. Complete the pull-request template, including gates that remain closed.
5. Confirm that the successful `quality-and-security` result belongs to the current pull-request head
   commit, then merge. Do not merge a pending, skipped, cancelled, stale, or failed result.
6. Keep restricted security, privacy, incident, approval, credential, and personal-data evidence outside the repository.

## Private GitHub Free merge control

The repository must remain private and the approved project boundary does not include a paid GitHub
plan. GitHub therefore cannot technically enforce protected branches or required status checks for
this repository. Until `B00-012` introduces an available technical enforcement mechanism:

1. Make changes through a pull request; do not intentionally push directly to `main`.
2. Merge only after `quality-and-security` succeeds for the pull request's current head commit.
3. Treat a direct push, a bypassed check, or a failing `main` run as a control failure: stop dependent
   work, preserve the non-sensitive run link, and correct or revert through a new checked pull request.

This is an explicit procedural control, not a claim that GitHub blocks an authorized administrator.
Branch protection, review enforcement, deployment provenance, and rollback remain in `B00-012`.

Do not introduce hospital facts, translations, brand assets, providers, personal-data collection, public routes, legacy WordPress state, or prototype runtime imports without the corresponding approved ticket and decision evidence.

Temporary development routing uses the Delivery and Security roles recorded on the execution board. Named production ownership and acceptance remain mandatory before production approval.

Dependency or toolchain changes must update [`toolchain-versions.json`](toolchain-versions.json), exact manifests, the lockfile, checks, and dated evidence together. Run `pnpm rebuild:verify` after any such change. The policy review date fails closed when overdue; do not bypass it by weakening the checker.
