# `B01-008` Governed-Content Cards — Local Evidence

**Recorded:** 16 September 2026, Africa/Addis_Ababa

**Environment:** Local Next.js build, pinned Node.js 24.21.0 and pnpm 10.27.0, headless Chromium
**Result:** Local `T0` passed; hosted `T1` and named production acceptance pending

The exported `GovernedCard` uses the validated `B02-001` record as its identity and lifecycle
boundary. Four kind-specific typed display contracts supply only explicitly provided fields.
The public default uses `publicEligibility`, rejects synthetic records, and omits records lacking
required display fields or a safe first-party destination. Fixture mode displays only visibly
synthetic records. Retired, draft, or incomplete specimens carry explicit state words and no links.

The fixture covers doctor, service, location/contact, and vacancy anatomy; missing credentials,
synonyms, and other optional values leave no empty labels. No portrait binary ships, and the neutral
fallback makes no likeness claim. Authorized review metadata has a separate typed input; its
fixture text says “Synthetic review specimen.” A vacancy describes an inert synthetic application
process and contains no Apply route, form, provider, candidate data, or real privacy notice. The
public vacancy contract requires explicit privacy and application approvals before rendering.

| Local check | Observed result |
| --- | --- |
| Full `pnpm verify` | Passed, including pinned toolchain, format, CI/policy negatives, links, current secrets, backlog/brand gates, lint, typecheck, existing tests, build, semantic/asset/runtime smoke, foundation smoke, and the new card smoke. |
| Browser card matrix | Passed at 320, 360, 375, 667 landscape, 768, 1280, and 1440 CSS px, plus existing enlarged-text/reflow checks. Four current fixture kinds, three unavailable/retired variants, no action on those variants, no optional placeholders, 44 px links, and no detected card overflow. |
| Resilience | Server HTML retains synthetic cards without JavaScript; print keeps borders and transparent surfaces; forced colors keeps the retired boundary and visible link focus. |
| Security and dependency | Reachable-history scan passed; dependency audit returned 650 dependencies and zero moderate, high, or critical known vulnerabilities. |
| Built budget | 145,350 compressed JavaScript bytes, 178,289 compressed initial bytes, 14 requests, zero external origins. |
| Visual review | [320 px](b01-008-rendered/b01-008-governed-cards-320.png) and [1440 px](b01-008-rendered/b01-008-governed-cards-1440.png) screenshots show readable stacked/column layouts, visible synthetic labels, neutral media, and distinct retired wording. |

The default shell exposed Node.js 25.2.1 and correctly failed the engine guard. Accepted checks
used the installed 24.21.0 pin. The restricted sandbox prevented localhost binding and returned
an incomplete registry audit; approved reruns succeeded. These checks are local implementation
evidence, not hosted `T1`, real content approval, professional Amharic review, physical-device or
assistive-technology acceptance, or publication authority.
