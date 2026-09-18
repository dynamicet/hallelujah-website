# B02-014 Sanitized Reports

`integrity-report.json` records fixed-time synthetic cross-model case IDs and pass results.
`build-report.json` records source/output counts, deliberately invalid policy controls and
sanitized findings. Neither contains hospital contacts, real identities, signed approvals or
malware clearance. Generate with:

```sh
pnpm --dir apps/web exec node scripts/check-content-integrity.mjs --capture
node scripts/check-content-build.mjs --capture
```

Reports inherit the B00-015 repository working evidence baseline. Build counts describe the
local artifact; CI separately checks its reviewed commit. The authorized bootstrap surface
is not a hospital publication approval. See the
[execution evidence](../B02-014-content-integrity-lifecycle-2026-09-18.md).
