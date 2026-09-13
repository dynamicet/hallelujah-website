# Contributing

All changes must follow the authority order and scope controls in [the implementation backlog](docs/backlog/README.md). A coding change needs a backlog ID, an allowed file boundary, exact verification commands, and sanitized evidence.

## Development flow

1. Confirm the ticket is `Ready` or `In progress` on the execution board.
2. Create the smallest scoped change from a clean branch.
3. Run `pnpm verify` and `node docs/backlog/audit-backlog.mjs` when application and documentation are affected.
4. Complete the pull-request template, including gates that remain closed.
5. Keep restricted security, privacy, incident, approval, credential, and personal-data evidence outside the repository.

Do not introduce hospital facts, translations, brand assets, providers, personal-data collection, public routes, legacy WordPress state, or prototype runtime imports without the corresponding approved ticket and decision evidence.

Temporary development routing uses the Delivery and Security roles recorded on the execution board. Named production ownership and acceptance remain mandatory before production approval.
