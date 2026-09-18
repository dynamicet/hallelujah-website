# B02-013 synthetic transfer specimens

The [report specimens](synthetic-reports.json) contain fixed-time synthetic create, repeat,
update, explicit merge, forward/cyclic reference reports and a metadata-preserving export snapshot.
They contain no authentic hospital content or approval. SHA-256 fingerprints bind only these
synthetic fixture inputs, simulated actor/workflow and record set; they are not production grants.

Regenerate after reviewed contract changes with `pnpm content-transfer:check --capture`.
The [execution evidence](../B02-013-controlled-content-transfer-2026-09-18.md) retains the real
disposable PostgreSQL/CLI result separately; these pure specimens do not claim database persistence.
