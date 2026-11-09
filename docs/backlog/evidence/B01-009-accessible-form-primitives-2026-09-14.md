# `B01-009` Accessible Form Primitives — Local Evidence

> Evidence availability (8 November 2026): some historical captures referenced below are absent from this checkout. Their filenames are retained as archive references, not current verification evidence. Rerun the documented checks for fresh evidence.

**Recorded:** 14 September 2026, Africa/Addis_Ababa

**Result:** Done for controlled development; full local `T0` and hosted implementation `T1` pass

## Evidence summary

| Area | Result |
| --- | --- |
| Public APIs | Native form, text field, textarea, select, radio/checkbox group, linked error summary, pending, authoritative receipt, accepted-delivery warning, known failure, action group, and submit APIs are exported through the production component boundary. |
| Canonical contract | The manifest generates 347 primitive, semantic, and component tokens. Generated parity and all registered component/template consumer checks pass without raw component colors. |
| Labels and relationships | Persistent labels and visible required/optional copy precede controls. Stable hint and error identifiers compose through `aria-describedby`; `aria-invalid` appears only while the corresponding message is visible. |
| Validation and focus | Invalid controlled input reveals linked summary and field errors, moves focus to the summary, and retains the synthetic select and note values. Summary links target the corresponding input or fieldset. |
| Outcomes | Pending exposes busy and disabled state. The receipt API requires explicit authoritative acceptance and a reference. Warning preserves an accepted reference, while known failure remains visually and textually distinct from success. |
| Progressive behavior | Server HTML keeps submit disabled. The first-party enhancement installs request prevention before enabling it, performs local validation only, and makes no network or persistent-storage call. Valid fixture input ends in explicit non-acceptance, never a receipt. |
| Responsive and resilience | 320, 360, 375, 667 × 375 landscape, 768, 1280, 1440, 200%/400% reflow equivalents, and 200% root-text enlargement pass without detected clipping or page overflow. No-JavaScript, reduced-motion, forced-colors, and print assertions pass. Visible actionable controls and choice labels meet the 44 × 44 CSS px target. |
| Built and runtime gates | Request-rendered accessibility, asset-budget, and runtime checks pass. The final local run measured 139,428 compressed JavaScript bytes, 161,014 initial compressed bytes, 13 requests, and zero external origins. |
| Visual review | 320px (unavailable archive: `b01-009-rendered/b01-009-form-primitives-320.png`) and 1440px (unavailable archive: `b01-009-rendered/b01-009-form-primitives-1440.png`) captures were inspected for hierarchy, label/help association, wrapping, target size, disabled state, and distinct receipt/warning/failure presentation. |
| External boundary | Synthetic fixture text only; no hospital content, personal data, appointment route, server action, provider, analytics, storage, authoritative outcome, deployment, or publication capability was introduced. |
| Hosted implementation gate | [`quality-and-security`](https://github.com/dynamicet/hallelujah-website/actions/runs/34892559476) passed in 2m25s on implementation commit `a921e61`, including frozen install, reachable-history secret scan, dependency audit, full verification, and clean rebuild. |

## Performed commands

```sh
pnpm tokens:generate
pnpm tokens:check
pnpm form-primitives:check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm form-primitives:smoke -- --capture-dir /tmp/b01-009-rendered
pnpm backlog:check
pnpm verify
pnpm secrets:check --history
```

Accepted checks use the pinned Node.js `24.21.0` and pnpm `10.27.0`. The bounded browser run used
the approved local server and headless Chromium path. An initial target-size assertion measured the
native 16 px radio glyph instead of its 44 px interactive label; the check was corrected to measure
the actual label target, and the complete rendered matrix then passed. The two sanitized captures
were copied from that passing run without modification.

The full local repository verification and reachable-history secret scan pass. `B01-009` changes
neither `pnpm-lock.yaml` nor any dependency declaration, so the zero-vulnerability dependency audit
recorded for the same graph under `B01-007` remained applicable during implementation. A fresh local
registry refresh returned an incomplete JSON response in the restricted environment; its approved
external retry was stopped after the registry call stalled. This is recorded as an unavailable
local refresh, not as a local pass. Hosted `T1` subsequently audited the unchanged complete graph:
650 dependencies with zero moderate, high, or critical known vulnerabilities.

## Evidence boundary and residual gates

- Screenshots contain controlled-development fixture wording and synthetic identifiers only. They
  contain no personal, clinical, operational, credential, contact, or restricted evidence.
- The browser run is implementation smoke, not final physical-device, browser, screen-reader,
  switch-control, comprehension, or professional Amharic review.
- GitHub [issue `#14`](https://github.com/dynamicet/hallelujah-website/issues/14), [pull request
  `#15`](https://github.com/dynamicet/hallelujah-website/pull/15), and hosted run
  `34892559476` carry the scoped repository review and passing implementation evidence. This
  documentation-closeout head must repeat the exact-head gate before merge.
- Appointment use remains gated by `APPT-01`–`APPT-04` and the later backend, privacy, security,
  operations, language, and release tickets.
- Personal-data collection, deployment, DNS, production, publication, and release authority remain
  unchanged.
