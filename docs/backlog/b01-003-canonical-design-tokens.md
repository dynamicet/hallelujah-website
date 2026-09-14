# `B01-003` — Canonical Generated Design Tokens

**Status:** Done for controlled development; local and hosted implementation gates pass

**Execution date:** 14 September 2026, Africa/Addis_Ababa

**Publication, provider activation, production, deployment, final-brand, and personal-data authority:** Not granted

## Execution contract

| Field | Controlled execution value |
| --- | --- |
| Epic / lane / priority | Epic 01 / `DELIVERY` / `P0` |
| Phase / milestone | Phase 1 / `M1` |
| Old / new status | Proposed → Ready → In progress → In review → Done for controlled development |
| Responsible owner | Client workspace identity `befikadusata` directing Codex in the temporary Frontend Lead and Designer roles |
| Acceptance owner | Same client identity for controlled-development acceptance; named Delivery, Frontend, Design, QA, Accessibility, Brand, and Language people return at their production gates |
| Target environment | `T0` isolated local validation and private-repository `T1` GitHub Actions execution |
| Requirements / decisions | `G-004`, `G-010`, `G-012`; `BRAND-01` remains open for final values |
| Dependencies | Completed `B01-001`; working `B00-015` and `B00-016` development baselines |
| Allowed repository scope | Canonical production token source, generator and outputs, token/consumer tests, controlled bootstrap style migration, architecture/backlog documentation, and sanitized evidence |
| Issue tracker | [GitHub issue `#4`](https://github.com/dynamicet/hallelujah-website/issues/4) |
| Evidence destination | [Sanitized completion record](evidence/B01-003-canonical-design-tokens-2026-09-14.md) |

The client's 14 September 2026 direction to proceed authorizes readiness promotion, the scoped
branch and implementation, local and hosted verification, and the repository pull-request flow. It
does not authorize final brand values, logo/tagline, font or asset licensing, public routes,
hospital facts or translations, a motion/media runtime, external providers, CMS capability,
personal-data collection, deployment, DNS, production, or publication.

## Outcome and acceptance

1. One provisional JSON manifest is the production source for primitive, semantic, and component
   tokens; CSS and typed TypeScript artifacts are generated deterministically.
2. Validation rejects missing or wrong-direction aliases, type and CSS-name collisions, raw palette
   values in consumers, stale outputs, and template bypasses of component aliases.
3. Token-level contrast checks include paths, usage, minimum ratios, and calculated results without
   claiming rendered-interface conformance.
4. Functional, composed, cinematic, immersive, and static roles carry levels and testable
   reduced-motion equivalents; generated CSS applies the static equivalents for reduced motion.
5. Every permanent protected context is bound to Level 0, and a synthetic cinematic inheritance
   fails closed.
6. The controlled bootstrap consumes the generated semantic/component aliases without changing its
   route, content, data, provider, or publication boundary.

## State applicability

- **Default:** generated aliases style the existing server-rendered controlled bootstrap.
- **Invalid/failure:** malformed aliases, unsafe layer references, stale outputs, failed contrast
  metadata, missing reduced equivalents, or expressive protected-context bindings fail the test.
- **Reduced motion:** enhanced semantic roles resolve to their declared Level 0 equivalents in CSS.
- **Forced colors:** the existing native forced-color border treatment remains intact.
- **Loading, empty, timeout/offline, unavailable/expired, language switching, history, and success
  receipt:** no new route or runtime state is introduced by this token infrastructure ticket.

## Verification plan

| Method | Exact command | Expected result |
| --- | --- | --- |
| Generation and parity | `pnpm tokens:generate`; `pnpm tokens:check` | Deterministic outputs match; alias, contrast, motion, consumer, and synthetic negative controls pass |
| Application checks | `pnpm lint`; `pnpm typecheck`; `pnpm test`; `pnpm build` | Zero warnings/errors; bootstrap builds with generated tokens |
| UI regression smoke | `pnpm accessibility:smoke`; `pnpm budgets:smoke` | Existing bounded semantics and request/asset budgets remain within baseline |
| Full local gate | `pnpm verify` | All repository quality/security checks pass |
| History credential scan | `pnpm secrets:check --history` | Reachable history passes with redacted failure behavior |
| Dependency audit | `pnpm audit:dependencies` | No moderate-or-higher known advisory; registry failure is not a pass |
| Hosted `T1` | Pull-request `quality-and-security` run | Green result belongs to the current pull-request head before merge |

## Completion boundary

- [x] Canonical source, generated CSS, typed platform output, and stable public API are present.
- [x] Layer/reference/type, drift, contrast-metadata, reduced-equivalent, protected-context, and
  consumer negative controls pass.
- [x] The controlled bootstrap consumes aliases and retains its existing safety and accessibility
  behavior.
- [x] Full local, history-secret, dependency-audit, and hosted implementation checks pass with
  sanitized evidence.
- [ ] Named production roles approve final brand/language values and production acceptance.

The final checkbox is a production gate and cannot be closed by controlled-development
implementation. `B01-002` owns authentic identity, typography, media policy, licensing, and final
value approval. `B01-004` owns full global foundations and rendered responsive/contrast evidence;
`B01-012`–`B01-013` own motion/media runtime implementation and capability evidence.

## References

- [Canonical token system](../architecture/canonical-design-token-system.md)
- [Design-system overview](../design-system/README.md#three-layer-token-contract)
- [Developer handoff](../visual-design/handoff/developer-handoff.md#4-token-and-style-integration)
- [Motion/media amendment](../visual-design/motion/high-end-motion-and-interactive-media-amendment.md)
