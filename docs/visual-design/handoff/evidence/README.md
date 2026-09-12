# Order 12 Evidence

**Generated:** 12 September 2026  
**Publication status:** Not approved

## Machine-readable result

[Order 12 audit results](order-12-audit-results.json) record the local documentation-integrity checks for:

- required handoff and canonical source files;
- local links in the six handoff documents;
- all 32 formal decision IDs;
- all 12 page contracts and accepted section ranges;
- canonical route agreement for Appointment, Patient Information, and Contact, with obsolete aliases rejected;
- Phase 1 Privacy, Accessibility, and 404/410/unavailable utility-contract coverage;
- both JSON token manifests and the foundation-to-component CSS dependency;
- machine-readable Order 9, 10, and 11 result summaries;
- explicit production/publication boundaries in the principal handoff documents.

## Reproduce

From the workspace root:

```sh
node hallelujah/docs/visual-design/handoff/audit-order-12.mjs
```

The runner uses only local Node file APIs and writes `order-12-audit-results.json` in this directory. It makes no network or browser request.

## Evidence limit

A passing result proves internal presence, route, utility-contract, link, identifier, and JSON consistency at the time of the run. It does not judge clinical or operational accuracy, stakeholder approval, translation quality, usability, accessibility with assistive technology, visual quality, security, browser/device behavior, production performance, or publication readiness. Those remain governed by the [gate ledger](../remaining-assumptions-and-gates.md) and [accessibility and validation checklist](../accessibility-and-validation-checklist.md).
