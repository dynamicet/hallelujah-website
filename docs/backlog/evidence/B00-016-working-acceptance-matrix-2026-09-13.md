# `B00-016` Working Acceptance Matrix Record

**Recorded:** 13 September 2026, Africa/Addis_Ababa  
**Ticket:** `B00-016`  
**Decision:** `DEL-01`  
**Development outcome:** Working baseline completed and accepted  
**Ticket status:** Deferred at the formal production-acceptance boundary  
**Publication authority:** Not granted

## Decision

The client directed the project to proceed with `B00-016`. The [implementation acceptance matrix](../../validation/implementation-acceptance-matrix.md) is the binding minimum for controlled implementation. It supplies:

- five evidence tiers from isolated local work through non-destructive production verification;
- rolling browser, OS, screen-reader, real-device, viewport, zoom, forced-color, input, and preference coverage;
- a constrained network/low-end hardware profile and the existing transfer, JavaScript, request, LCP, INP, and CLS budgets;
- professional English/Amharic review and formative comprehension thresholds for critical journeys;
- staged security/privacy coverage, defect severity and release thresholds, approver roles, and a bounded exception process;
- split sanitized/restricted evidence rules using the deferred `B00-015` development baseline; and
- mandatory `BM-*` implementation ledgers linking each incorporated benchmark pattern to its local behavior, implementation location, requirement/gate, test, and evidence.

The matrix follows the approved `B00-017` benchmark boundary, the existing requirements and page/component contracts, WCAG 2.2 Level AA, and the relevant OWASP Web Security Testing Guide areas. Project-specific rules remain stricter where stated.

## Authority and scope

| Field | Record |
| --- | --- |
| Responsible roles | TBD — External QA / Accessibility Lead + External Project / Delivery Lead |
| Working acceptance authority | Client direction in the project workspace |
| Required production authorities | Named Product, QA/Accessibility, Security, Delivery, Executive, and applicable Clinical, Operations, Content/Language, and Privacy/Legal owners |
| Target environments now allowed | Isolated local, clean PR CI, and controlled production-like staging within existing data/provider/content gates |
| Status change | `B00-016`: Proposed → Deferred after completion of the development baseline; `DEL-01` stays formally unresolved for production |
| Downstream effect | The matrix dependency for `B00-003`, `B00-004`, `B00-006`, and implementation-ticket preparation is satisfied; their other readiness conditions still apply |

## Production return conditions

Reopen `B00-016` before formal production acceptance to record:

1. named people and confirmed acceptance/release authority;
2. the actual physical-device inventory and exact browser/OS/AT versions;
3. the selected restricted evidence repository, access, retention, redaction, backup, and durable-link policy;
4. executed release-candidate results for the frozen build/config/content versions; and
5. the exact go/no-go decision and release window under `B07-016`.

Reopen sooner if a supported platform, risk model, requirement, benchmark disposition, data flow, or critical journey materially changes.

## Verification performed

- the matrix was checked against all acceptance fields in the `B00-016` epic row;
- `G-003`–`G-013`, `G-016`, `S-002`, `S-003`, `E-005`, `A-004`, and `A-007` were carried into measurable coverage;
- the cross-template and benchmark-derived validation measures were incorporated;
- the ticket template and shared evidence checklist now require per-implementation `BM-*` traceability;
- formal production approval, actual human/device execution, restricted storage selection, and release authority remain explicitly unclaimed; and
- post-change backlog integrity audit passed 8/8 assertions across 137 tickets and 231 local links; and
- post-change Order 12 handoff audit passed 9/9 assertions.
