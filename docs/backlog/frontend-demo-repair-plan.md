# Frontend demo repair plan

- **Prepared:** 20 October 2026
- **Reviewed implementation:** `f91649d`, connected local demo
- **Scope:** Home, Doctors directory, Doctor profile, Services directory, Emergency, Appointment, and their shared UI
- **Status:** FD-01–FD-08 local implementation and internal visual review complete; client visual acceptance pending
- **Client-demo acceptance:** All six page types require correction and visual review

**Plan refinement:** The 20 October revision added benchmark-to-repair traceability, section art direction, component review requirements, delivery gates, and a demo rehearsal. The FD-01–FD-07 records below document subsequent 21 October implementation; they do not claim whole-site or client visual acceptance.

## Client presentation objective

Present one coherent, carefully finished hospital website. Within the first view, the client should recognize the approved identity, understand how to find care, and see a confident visual hierarchy. As the demonstration proceeds, the quality should hold through directories, detailed content, forms, mobile layouts, and recovery states.

The presentation must establish three things:

1. **Design quality:** distinctive Calm Wayfinding expression, complete editorial composition, refined typography, intentional media, and consistent components.
2. **Journey quality:** a visitor can move from a need to a service or doctor, inspect useful information, and complete a simulated appointment request without losing context.
3. **Execution quality:** the same design remains composed on mobile, with keyboard use, during client navigation, and when content or an interaction fails.

The six existing page types are the complete repair scope. New page types, live integrations, and extra features do not substitute for finishing them.

## Governing demo rule

The client directed that missing verified hospital facts or future backend implementation must not excuse missing intended frontend/UI implementation. The first demo demonstrates visual design, frontend execution, and UI/UX.

Accordingly:

- Render representative demonstration content across the full intended composition.
- Simulate unavailable backend-dependent interactions locally so the intended states and transitions can be reviewed.
- Demonstrate normal, partial, and unavailable states separately. Do not use the unavailable state as the only presentation of an implemented page.
- Preserve disabled real collection, calls, provider requests, and publication. Simulated success is a demo outcome, never a real request or confirmed booking.
- Keep demo explanation concise and outside the primary visual hierarchy; do not fill every component with development disclaimers. Do not remove necessary consequence or safety copy.
- Missing assets require deliberate art direction or a composed alternative, not blank rectangles.
- Passing technical checks does not establish visual or client acceptance.

This is a repair overlay on existing work, not a new release scope or a replacement for the execution board. Historical controlled-development outcomes remain recorded. The repair identifiers below are checklist identifiers, not new `Bxx` backlog tickets; this document does not promote, reopen, or close those tickets automatically.

## Source map and precedence

| Source | Use during repair |
| --- | --- |
| [Approved brand](../brand/README.md) | Existing identity and interface rules; reconcile its estimated logo colors with the client's newly supplied palette before implementing FD-02 |
| [Calm Wayfinding](../visual-design/direction/visual-directions.md) | Experience character, hierarchy, restrained geometry and wayfinding |
| [Foundations](../design-system/foundations.md) | Typography, spacing, sizing, surfaces, responsive layout and focus |
| [Component specifications](../visual-design/components/component-specifications.md) | Anatomy, states, interactions, cards, fields, menus, filters |
| [Critical-journey composition](../visual-design/pages/critical-journeys/critical-journey-specifications.md) | Home H0–H9, Emergency E0–E8, Appointment A0–A8 |
| [Care-discovery composition](../visual-design/pages/care-discovery/care-discovery-specifications.md) | Doctors D0–D6, Profile P0–P7, Services S0–S7 |
| [Motion/media amendment](../visual-design/motion/high-end-motion-and-interactive-media-amendment.md) | Premium authored expression; supersedes original prototype motion ceiling |
| [Responsive refinement](../visual-design/pages/responsive/responsive-bilingual-refinement.md) | Narrow screens, long labels, language geometry and reflow |
| [Prototype interaction contract](../visual-design/prototype/prototype-specification.md) | Simulated flows, focus recovery, search and appointment states |
| [Later appointment contract](b03-012-014-controlled-appointment-contract.md) | Required name/phone, optional preferred date, conditional selectors and acknowledgment |
| [Earlier visual corrections](visual-direction-baseline.md) | Historical fixes and known drift; not evidence that current routes pass visual review |

Resolve historical differences explicitly: approved brand values supersede provisional prototype colors/text-only-logo restrictions; the motion amendment supersedes the original Level 2 ceiling; the later appointment contract supersedes unresolved prototype field rules. Preserve established checkbox filter semantics rather than copying older radio illustrations. Current client instructions govern the first-demo presentation boundary.

### Client palette reconciliation (21 October 2026)

The client supplied a logo-derived palette after the existing project brand foundation was prepared. Its bright blue and orange are the primary **identity** colors for the demo. A distinct accessible interface palette serves text, navigation and actions. FD-02 reconciled the brand record and canonical tokens; the existing logo artwork remains unaltered.

| Client swatch | Existing closest role | Demo repair decision |
| --- | --- | --- |
| Hallelujah Blue `#17AEE5` | Brand cyan `#1EAEE2` | Current token for small identity accents, rules and illustration details. Do not use it with white text for links or primary buttons: contrast is about 2.55:1. |
| Warm Orange `#F26522` | Brand orange `#EF5C28` | Current token for restrained warm accents. Do not make it the default white-label appointment button: contrast is about 3.15:1. |
| Deep Teal Blue `#0B86B0` | Current action teal `#006A73` | Consider it part of the identity palette, but do not substitute it directly for routine white-label actions; white contrast is about 4.16:1. Retain or tune a darker accessible action shade with visible hover/active states. |
| Navy `#0A3D5C` (derived) | Primary text/inverse surface `#17323A` | Test as a heading, footer or inverse-surface candidate in actual desktop/mobile compositions; verify contrast and hierarchy before replacing the current mineral role. |
| Sunshine Yellow `#F5B820`; Magenta Pink `#E6197D` | Small details within the logo artwork | Keep within the existing mark or very sparing decorative illustration. Do not promote either to a general UI, status or action role for this demo. |

Preserve the existing logo artwork without recoloring it. FD-02 updated the brand record and canonical tokens with the client identity values, kept UI roles separate, and reviewed the Home opening, Appointment opening and footer together. FD-08 still owns the final comparison board and client visual decision.

The HTML studies below are composition references, not code to import wholesale or a ceiling on polish. Some contain obsolete branding and instructional prototype copy.

## Benchmark review translated into repair decisions

Use the existing [benchmark inspiration matrix](../visual-design/direction/benchmark-inspiration-matrix.md) and [approved traceability register](../benchmarks/benchmark-traceability.md) as the research baseline. Their captured observations are historical evidence, not a fresh audit of external websites. Before implementation, inspect the relevant available captures alongside the local HTML studies and actual routes; record unavailable captures rather than inferring their appearance.

| Benchmark quality and recorded reference | Concrete local decision | Repair / proof |
| --- | --- | --- |
| Task separation — Charité; `BM-01`, `BM-03` | Make doctor and service discovery immediately distinguishable; retain the five Home tasks and a real labeled search interaction | FD-03: first-view capture and completed search-to-discovery journey |
| Plain-language clarity — NHS; `BM-02`, `BM-10` | Strong headings, readable prose, visible links, clear urgency separation, and understandable errors | FD-02/06/07: keyboard walkthrough and emergency/form comparison |
| Visible essential actions — Singapore General Hospital; `BM-01` | Give the hero an authored media plane while keeping care actions immediately usable and Emergency independent | FD-03: desktop/mobile first view, static and reduced-motion variants |
| Explicit language and clear care panels — Cleveland Clinic Abu Dhabi / Sidra; `BM-09` | Keep language labels visible and long-label layouts composed; unavailable translation retains the current context | FD-02: language-control outcome and expanded-label capture; no claim of approved bilingual content |
| Human and regional relevance — Aga Khan University Hospital Nairobi; `BM-12` | Prioritize appropriate authentic place imagery if available; otherwise use original abstract wayfinding artwork with complete adjacent copy | FD-01/03/04: asset decision and no-media comparison |
| Search prominence — Mediclinic; `BM-03` | Search has a visible label, useful hint, clear submit action, retained query, and useful zero-results recovery | FD-03/04/05: normal, zero-results, reset and Back/Forward |
| Context across care records — `BM-04` | Use consistent names, relationships and actions from directory to profile to request | FD-04/07: matching record and visible request context |
| Truthful requests — `BM-05` | Explain the request outcome, validate clearly, prevent duplicate outcomes, and make recovery demonstrable | FD-07: successful simulation plus recoverable and uncertain outcomes |
| Supported access and practical arrival — `BM-06`–`BM-08` | Use one support-band family and useful text-first guidance; local help reveals actual next steps | FD-02/03/06: every support/arrival action exercised |

Adopt the useful pattern, then express it through Hallelujah's approved identity. Do not import benchmark branding, copy, imagery, capabilities or operating claims. Keep existing Test/Defer dispositions unchanged. The failed Mayo capture is not visual evidence.

## Art direction and section refinement contract

### Shared visual grammar

- **Identity:** approved logo treatment on a quiet field; the client-supplied bright blue and orange as restrained identity accents; mineral surfaces and accessible dark actions. Evaluate client navy for headings/footer. Reserve red for urgent/error meaning.
- **Typography:** use the approved Noto families and actual token scale. Establish a clear H1 → section heading → card title → supporting-text hierarchy. Keep body text at least 16 px, introductory copy around 18 px, and prose approximately 45–75 characters wide where space permits.
- **Grid and rhythm:** start from the foundation's 1120 px standard container, 720 px reading measure, 16 px compact gutters, 32/64 px mobile/desktop section rhythm, and 24 px component padding. Resolve these through the current token manifest; document intentional deviations rather than introducing page-specific magic numbers.
- **Surfaces:** alternate surfaces to group related content, not at every section boundary. Use open editorial layouts for continuous prose, restrained cards for choices, and one broad support treatment. Avoid heavy borders around ordinary information.
- **Actions:** one visually leading routine action per region, with quieter alternatives. Align repeated card actions without clipping names or summaries. Labels describe the next step.
- **Media:** every media region needs a subject/purpose, crop, aspect ratio and fallback decision. An original abstract composition may balance Home; missing profile photography should produce a compact identity treatment or cleanly omit media, not repeat large empty portraits.
- **Motion:** finish the static composition first. Use functional feedback in controls, selective composed movement in Home/discovery, and only the amendment's permitted decorative/story treatments. Emergency stays Level 0; Appointment stays Level 1 with stable consequence and receipt content.

These are review targets grounded in the existing sources, not a replacement token system.

### Page-specific visual decisions

| Page / section | Required design refinement | Visible review question |
| --- | --- | --- |
| Home H1 | Asymmetric text/media balance on desktop; concise useful headline, supporting copy, primary action and quieter alternative; compact text-first mobile | Does the opening feel complete without pushing practical tasks behind a promotional screen? |
| Home H2–H3 | Five task choices with consistent icon/label anatomy; distinct search region with a useful hint | Can the client identify each route and demonstrate search without explanation? |
| Home H4–H5 | Curated service and doctor collections with meaningful differences in copy; shared card anatomy and clear directory exits | Do these sections help choose care rather than repeat decorative tiles? |
| Home H6–H8 | Three-stage guidance, text-first arrival, then a distinct editorial story/media composition | Does each section have its own purpose and rhythm while belonging to the same system? |
| Doctors D1–D4 | Strong introductory hierarchy; tidy filter rail, toolbar and chips; informative result cards with restrained media | Can names, care areas, counts and next actions be scanned without excessive vertical space? |
| Profile P1–P6 | Balanced identity area; readable editorial column; clearly related request rail; quieter related-service and review metadata | Is the profile substantial, and does it collapse gracefully when content is partial? |
| Services S1–S6 | Orientation followed by group navigation, coherent result groups, useful summaries and clear handoffs | Can a visitor compare services and understand what each action will do? |
| Emergency E1–E7 | Stable route distinction, clearly purpose-labeled choices, compact warning, ordered practical information | Is the important information immediate without repetitive alarm panels or circular recovery? |
| Appointment A1–A8 | Focused opening, compact warning, readable field groups, clear selected context, quiet privacy copy, decisive action area | Can the client complete and understand the simulated request without developer narration? |
| All support/footer regions | Broad support band with purposeful alternatives, then a consistent dark footer with orderly link groups | Does the page finish with useful next steps and the same visual quality as its opening? |

### Component finish checklist

Review these components in their actual page context as well as the component reference. Each needs default, keyboard-focus and relevant interaction/state evidence.

| Component family | Required finish | Failure to reject |
| --- | --- | --- |
| Header/navigation/menu | Consistent labels, legible logo, current route, content-fit compact breakpoint, Escape/focus return | Crowded tablet header, clipped language label, inconsistent Home navigation |
| Section heading | Consistent heading/intro/action relationship, sensible line breaks and reading width | Detached action, excessive opening whitespace, empty subtitle slot |
| Buttons/links/icons | Shared height/padding, 44 px targets, visible focus, consistent outline icons and explicit labels | Unlabeled icon, decorative button shape for unavailable text, competing primary actions |
| Search/filter/chips | Aligned labels and counts, clear Apply/Reset, retained selection, clear-chip accessible names | Detached count lines, tiny removal targets, reset that silently leaves active filters |
| Doctor/service/task cards | Useful information hierarchy, deliberate media variants, stable action placement | Repeated blank media, name-only cards, entire cards with conflicting nested interactions |
| Profile request rail | Visible matching context, concise next-step explanation, useful action; natural mobile source order | Empty adjacent column, sticky rail covering content or focus |
| Fields/choice groups/date | Visible labels, useful hints, required/optional clarity, conditional choices and usable mobile date entry | Placeholder-only label, ambiguous disabled action, custom date widget chosen only for appearance |
| Validation/status/receipt | Error summary linked to fields, focus recovery, stable busy action, clear request-not-booking meaning | Lost valid values, duplicate outcomes, success-colored confirmed-booking implication |
| Disclosure/help/arrival | Substantive revealed content, correct expanded state, announced feedback where needed | Fragment jump to another unavailable message, hidden essential directions |
| Media/fallback | Reserved geometry when useful, responsive crop, meaningful alt decision, composed failure state | Blank rectangle, stretched asset, fallback maintaining a vacant column |
| Support band/footer | Shared spacing/surface system, descriptive alternatives, intentional local outcomes | Heavy isolated box, dead utility links, generic Home-only recovery |

### Demonstration content requirements

Create a fixture inventory before styling so the design is exercised by meaningful content:

- Enough distinct doctor and service records to demonstrate every displayed filter group and more than one results page at the configured page size.
- At least one complete doctor profile, one deliberately partial profile, one long-name/long-copy case, and valid doctor/service/request relationships.
- Home collections that refer to those same records; substantive visit, arrival and institutional demonstration copy without fabricated proof metrics.
- Full Emergency and Appointment fixtures, with separate deterministic recovery scenarios.
- An asset inventory identifying approved local assets, original neutral artwork, intentional media omissions, and required fallback treatments.

Keep representative content clearly within the demo boundary. Use one concise persistent demo statement and contextual notices only where the action's consequence needs clarification. Do not repeat development instructions inside every card.

## Review evidence and limits

The 20 October review inspected the six actual Next development routes, captured each at 360, 768 and 1440 CSS pixels, compared all six desktop design references, and inspected source.

Verified working: the existing 10-group connected-demo regression; actual doctor-search and service-group submissions; pagination and doctor/profile/appointment handoff; mobile navigation; no horizontal overflow on all six routes at 320 px.

Verified gap: React reports that script tags rendered in components do not execute during client rendering. The existing regression filters console errors mainly for hydration patterns, so this warning does not fail it.

Local evidence is in `artifacts/visual/client-page-review-2026-10-20/`: `review.html`, 18 current screenshots, six reference copies, DOM summaries, and `interaction-results.json`. These ignored local files are not guaranteed in a fresh checkout. The tracked design studies remain available; capture new route evidence for each repair instead of relying on old screenshots.

This review did not certify production, database integration, full accessibility, security, all browsers, or all motion timings.

## Repair sequence

| Order | Repair | Depends on | Completion evidence |
| --- | --- | --- | --- |
| 1 | FD-01: representative demo content and scenarios | Source reconciliation above | Each page has a full default composition and separately selectable partial/failure scenarios |
| 2 | FD-02: shared visual system and frontend lifecycle | FD-01 | Shared shell/components reviewed across six actual routes; direct-load/client-navigation parity |
| 3 | FD-03: Home | FD-01, FD-02 | H0–H9 comparison, useful task outcomes, responsive and motion review |
| 4 | FD-04: Doctors directory and Profile | FD-01, FD-02 | D0–D6/P0–P7 comparisons and complete directory/profile/appointment journey |
| 5 | FD-05: Services directory | FD-01, FD-02 | S0–S7 comparison, grouped discovery and meaningful next actions |
| 6 | FD-06: Emergency | FD-01, FD-02 | Full normal composition plus separate unavailable/resilience scenarios |
| 7 | FD-07: Appointment | FD-01, FD-02, working doctor/service contexts | Complete non-persistent simulated interaction lifecycle |
| 8 | FD-08: integrated client-demo acceptance | FD-03–FD-07 | Fresh screenshot set, scenario results and explicit client visual acceptance |

This sequence prioritizes common causes and avoids polishing each page with a different system. It does not authorize building additional page types. Existing-page links whose eventual destinations are outside these six must have a deliberate local demonstration outcome; neither silent dead ends nor invented completion of later backlog items is acceptable.

### Delivery gates and priority

| Gate | Work to finish | Exit condition |
| --- | --- | --- |
| 1 — Reference and content baseline | Inspect available benchmark captures, six local studies, current route evidence, tokens and fixture export path | Annotated section inventory and content/asset decisions; each gap assigned to FD-01–FD-08 |
| 2 — Shared design proof | FD-01/02; compose the Home opening and one directory/profile sample using shared components | Desktop/mobile visual review agrees the shared system is strong enough to propagate; runtime lifecycle defect resolved |
| 3 — Complete six-page pass | FD-03–FD-07 including normal and relevant alternate states | No missing intended section, blank media box, accidental empty column or dead action; main journey completes |
| 4 — Refinement and resilience | Cross-page typography/spacing/action audit; long content, partial states, responsive and motion checks | Per-page scorecard passes; scenario results and intentional deviations recorded |
| 5 — Rehearsal and client handoff | FD-08, technical checks and fresh evidence | Scripted demo succeeds from a clean reset; client acceptance remains a separate recorded decision |

**Fix first:** missing composition, broken journey, inaccessible action, misleading outcome, unexpected runtime errors, and inconsistent shared shell. **Then refine:** typography, alignment, whitespace, card density, copy and media. **Finish last:** optional decorative choreography and opt-in media. Optional enhancement can be omitted if its complete static alternative passes; required sections and journeys cannot be omitted to meet a presentation date.

For each repair, identify an implementation owner and visual reviewer when work is scheduled. Do not invent a delivery date before the scope, fixtures and current route evidence have been assessed.

## FD-01 — Representative demo content and scenarios

**20 October baseline finding:** Home received empty documents, doctor records omitted most detail fields, profiles received empty locations/relationships, Emergency was forced unavailable, and Appointment was forced into disabled editing. These route inputs concealed implemented composition and state capability. The later repair tables retain this baseline and must be rechecked against the current route before further work.

**Primary files:** `apps/web/src/demo/data.json`, `apps/web/src/demo/site.tsx`, `apps/web/src/app/page.tsx`, `apps/web/src/app/doctors/[slug]/page.tsx`, `apps/web/src/app/emergency/page.tsx`, `apps/web/src/app/appointment/page.tsx`; inspect the snapshot export path before changing generated data.

**Required changes**

- Provide coherent representative names, summaries, biographies, areas of care, languages, service relationships, visit guidance and institutional copy for presentation review.
- Make the normal scenario visually complete. Include long-copy, missing-media and partial-content alternatives that deliberately exercise composition.
- Provide a local review mechanism for normal, loading, empty, error and unavailable states as applicable. Keep review controls outside normal patient-task UI.
- Preserve a reproducible data source so regeneration does not erase the presentation.
- Use existing assets appropriately or designed neutral media. Do not represent generated or unrelated people/place imagery as authentic hospital evidence.

**Acceptance**

- Every planned section can be reviewed with representative content without requiring live CMS or backend activation.
- Empty/partial scenarios recompose cleanly; no empty heading, vacant rail or image-shaped gap remains.
- Full presentation and safe local behavior coexist; real actions remain inactive.
- Scenario switching and reset are deterministic and do not persist entered contact values.

### FD-01 implementation record — 21 October 2026

**Implementation owner:** Codex. **Visual reviewer:** pending assignment for the integrated FD-08 review.

**Implementation:** A local-only presentation snapshot now supplies nine distinct clinician records and ten service records across every displayed filter group; both directories exceed their four-result page size. The controlled export path adds representative biographies, areas of care, languages and service summaries without changing governed source records. The export checks the fixture count and source-name order before writing `apps/web/src/demo/data.json`; a repeated export produced the same SHA-256 digest. Dr Aster demonstrates a full profile and matching doctor request context, Dr Hana supplies a naturally partial profile, and Dr Imani Alemu Tesfaye-Mekonnen exercises long-name and long-copy wrapping. Family-care and heart-care examples have related service records; unrelated child-care services are not inferred.

Home now receives local featured service and clinician collections, an institutional story, illustrative contact and arrival content, and original static wayfinding artwork. The default Emergency route shows two inert, unmistakably invalid contact examples, scope and arrival content; separate unavailable and expired states remain reviewable. Appointment exposes its existing review states through a URL parameter. Its action remains disabled and sends no request; the complete simulated lifecycle is FD-07 work. Missing clinician portraits are omitted, and a partial profile drops its empty editorial column and related-content section.

These fixtures are visible only in local development. One concise preview notice identifies unverified people, services and contacts. No contact value is a dialer link; no request, provider call, or personal value is transmitted or stored by scenario selection.

**Changed areas:** presentation source and export (`apps/web/scripts/lib/demo-presentation-content.mjs`, `apps/web/scripts/export-demo-data.mjs`, generated `apps/web/src/demo/data.json`); local scenario/content adapters (`apps/web/src/demo/`); the six connected routes; Home, clinician directory and profile templates; and their focused contract/browser checks. Governed record source fixtures and production publication gates were not changed.

| Route | Review scenarios through `?demo=` | Default and reset |
| --- | --- | --- |
| `/` | `partial`, `empty`, `unavailable` | `/` restores full featured content and illustrative contact/arrival |
| `/doctors` | `empty`, `failure`, `offline`; use `?q=no-matching-name` for zero results | `/doctors` restores nine searchable records |
| `/doctors/synthetic-clinician-101010101010/` | `partial`, `failure`, `gone`, `unavailable`, `appointment-unavailable` | Base URL restores the full Dr Aster profile; `/doctors/synthetic-clinician-171717171717/` is naturally partial |
| `/services` | `loading`, `empty`, `failure`, `offline`; use `?q=no-matching-service` for zero results | `/services` restores ten grouped services |
| `/emergency` | `unavailable`, `expired`, `map-failed`, `map-blocked`, `call-handoff-unsupported` | `/emergency` restores the complete inert example |
| `/appointment` | `validation`, `pending`, `known-failure`, `unknown`, `duplicate`, `receipt`, `delivery-warning`, `workflow-unavailable` | `/appointment` restores the non-submitting editing view; `?doctor=pub_101010101010` retains the matching handoff |

The URL parameter is a local review mechanism, not a patient-facing switch. Unsupported values fall back to the default. Removing `?demo=` resets a scenario without cookies, storage, or retained contact fields. The Appointment variants are static review specimens; FD-07 must connect them into one usable local interaction.

| Asset | Decision for FD-01 |
| --- | --- |
| Existing local emblem PNG | Available brand reference; the current shell still uses its accessible text identity. Authentic master/quality review remains a later brand decision. |
| Original Home artwork | Code-native abstract wayfinding shapes; decorative and hidden from assistive technology, with no photograph or hospital-place claim. |
| Clinician portraits | No approved portraits available. Omit the image area instead of repeating empty portrait boxes. |
| Motion fixture WebM | Remains confined to component review; not presented as hospital footage. |
| Emergency map | No provider or real location is connected. Text directions and map status are illustrative and inert. |

**Verification:** `pnpm --dir apps/web typecheck`, lint, production build, Home, clinician-profile, Emergency, service-directory and Appointment template contracts passed. The production build kept Home static and did not render local preview content. The connected browser regression passed 11 route/journey groups, including normal Emergency, Home H4/H5/H8, partial/failure states, reset, no `tel:` links, and long-name overflow at 320 px. Desktop opening captures of Home, Profile and Emergency were inspected locally; they are preliminary observations, not the fresh comparison board or client approval required by FD-08.

**Remaining gate:** FD-02–FD-07 must refine the shared system, complete page composition and action outcomes, and build the Appointment simulation. FD-08 must capture durable before/after evidence and obtain client visual acceptance. FD-01 closes the reproducible content/scenario prerequisite only; it does not certify any whole page for presentation.

## FD-02 — Shared visual system and frontend lifecycle

**Finding:** Compact headers and dark footers exist, but support treatments vary between white bands, blue panels and narrow heavy-bordered boxes. Home and inner-page navigation labels differ. Client-navigation script behavior is not clean.

**Primary files:** `apps/web/src/design-system/components/global-shell.tsx`, `global-shell.module.css`, `governed-cards.tsx`, `governed-cards.module.css`, `search-controls.tsx`, `search-controls.module.css`, `apps/web/src/demo/interactions.tsx`, `apps/web/src/app/layout.tsx`, page-template styles, and `scripts/check-demo-routes.mjs`.

**Required changes**

- Establish one deliberate header, identity treatment, navigation vocabulary, footer and support-band family.
- Reconcile the client palette above into brand documentation and canonical design tokens. Keep bright blue/orange decorative, retain an accessible darker action family, and review the navy candidate in the actual Home, Appointment and footer compositions.
- Apply the approved type scale and fonts where available; verify actual rendered font rather than merely declaring a family name.
- Normalize section alignment, surface hierarchy, card padding, corner radii, action placement and icon treatment.
- Keep ordinary information quiet; reserve heavy/red boundaries for meaningful emphasis.
- Make menu, language, disclosure and motion enhancements work on direct entry and client navigation without duplicate listeners or script execution assumptions.
- Capture unexpected console errors broadly; any allowance must name the exact known message and reason.

**Acceptance**

- The six routes look like one designed product at mobile, tablet and desktop sizes.
- The client identity colors are recognizable without reducing text, action, focus or urgent-state contrast; palette decisions and any retained darker UI shades are documented.
- Navigation, focus return, Escape behavior, current-route indication and browser history work after repeated route changes.
- No unexpected console errors, hydration errors, invisible controls, blocking entrances or duplicated handlers.
- Support actions produce a useful next step; checking an HTTP 200 response or existing fragment alone is insufficient.

### FD-02 implementation record — 21 October 2026

The six connected page types now share the same five primary navigation labels, current-route treatment, responsive breakpoint, broad support-band treatment and navy footer. The support regions on Home, directories, profile, Emergency and Appointment provide a route to relevant care discovery or illustrative contact details. The single connected-shell effect owns menu, language and filter disclosure handlers; it rebinds on pathname and query changes and aborts old listeners. Home media and motion also use a route-aware client effect. Standalone controlled previews load their own scripts from the preview document, so Next client navigation does not insert script tags into React-rendered page content.

The [brand record](../brand/README.md) and generated [token source](../../apps/web/src/design-system/tokens/tokens.json) use the client blue `#17AEE5`, orange `#F26522`, deep teal blue `#0B86B0`, navy `#0A3D5C`, and artwork-only yellow/magenta. Navy is used for headings and the inverse footer; dark action teal `#006A73`, focus blue `#075EA8`, and urgent red remain separate. Measured against white, navy is 11.44:1, action teal 6.35:1, focus blue 6.61:1, client blue 2.55:1, client orange 3.15:1 and deep teal blue 4.16:1. Footer muted text `#C7DAD7` on navy is 7.87:1. Bright identity colors are not white-label action colors. The raster emblem is unchanged.

**Review:** The connected Chromium check passed 12 route/journey groups. It captured every route at 390, 768 and 1440 CSS pixels without horizontal overflow; checked mobile Escape and focus return, language disclosure, current-route state, repeated client navigation, Back, support handoffs and every console error; and reported Noto Sans as the actual rendered Home heading font in this local environment. The Home, Doctors, Profile, Services, Emergency and Appointment desktop openings, selected mobile openings, and Home/Appointment support-to-footer views were visually inspected. `pnpm --dir apps/web build`, typecheck, lint, token check, Home controlled browser smoke (165 cases) and Emergency controlled browser smoke (255 cases) passed. The broader `pnpm --dir apps/web test` sequence passed through asset governance but stopped at `assets:formats:check` because this environment lacks Python `fontTools`; no asset-format result is claimed.

**Limits:** Approved self-hosted Noto binaries are absent from the repository. The local browser used its installed Noto Sans; other devices use the specified system fallback until approved files are ingested. The repository `format:check` also reports missing final newlines in existing `artifacts/visual/client-page-review-2026-10-20` files; those historical captures were not rewritten as part of FD-02. FD-03–FD-07 still own the page-specific compositions and interactions seen in these captures, including directory and Appointment detail. FD-08 must make durable comparison captures and record client visual acceptance.

## FD-03 — Home H0–H9

**References:** [Home study](../visual-design/pages/critical-journeys/home.html), critical-journey composition.

**Primary files:** `apps/web/src/app/page.tsx`; `home-page-template.tsx`, `home-template.tsx`, `home-template.module.css`, `home-contact-template.tsx`, `home-contact-template.module.css`, `home-governed-content.tsx`, `home-governed-content.module.css` under `apps/web/src/design-system/templates/`.

| Sections | Observed gap | Required repair |
| --- | --- | --- |
| H0/H9 | Vocabulary and support treatment differ from inner pages | Apply shared shell and support system |
| H1 | One-sided introduction lacks the balancing media plane | Restore asymmetric desktop composition, strong type/actions and designed media/abstract treatment; text-first mobile |
| H2 | Task cards exist but call/directions lead to unavailable text | Preserve polished five-card anatomy and give each a meaningful local demonstration outcome |
| H3 | Search is reduced to a directory link | Render intended labeled field, hint and submit interaction; demonstrate bounded local results/recovery without requiring production site search |
| H4/H5 | Featured services and doctors absent | Render representative collections with summaries, media treatment and working existing-route handoffs |
| H6 | Generic before/during/after cards have no destination | Supply substantive demonstration guidance and an intentional local reveal or navigation outcome |
| H7 | Contact/arrival panel contains unavailable messages beside geometry | Demonstrate full practical-access composition with inert illustrative contact actions and text-first arrival |
| H8 | Institutional composition absent | Restore editorial story/media treatment with representative copy; avoid invented proof metrics |
| H9 | Staffed-help promise leads to unavailable content | Give the support action a deliberate demonstration outcome |

**Acceptance:** All H sections are visibly reviewable in the full demo; no generic filler or dead task cards; wide hero is balanced; mobile avoids excessive empty space; motion enhances an already complete static composition; partial states are reviewed separately.

### FD-03 implementation record — 21 October 2026

The connected Home route now renders H1–H9 with a balanced static hero, five task destinations, a labeled GET search into the local doctor directory, curated service and clinician cards, three visit guidance links, practical contact/arrival information, a composed arrival illustration, an editorial story, and the shared support band. The search retains the query in the directory; a zero-result query exposes its recovery state. Arrival directions can be copied with visible feedback, while all displayed contact values remain inert and illustrative. The story copy describes the visitor journey without repeating implementation notes.

The `partial` review scenario shows one service and one clinician card; `empty` omits both collections and the story. The `unavailable` contact scenario omits the arrival illustration rather than leaving an art-shaped gap. The Home component template retains its controlled production path; the connected search and illustrative artwork are local-development presentation only.

**Changed areas:** Home route and template, Home demonstration content and styles, the local presentation snapshot source/export, and the connected browser regression. The H3 search uses the existing bounded doctor-directory results; this is not a general site-search index.

**Verification:** Home controlled SSR, contact and governed-content contracts, TypeScript, lint and the production build passed. The connected Chromium regression passed 13 route/journey groups, including Home section presence, GET search to a matching result, zero-result recovery, copy feedback, responsive overflow and runtime-console checks. Desktop and mobile full-page captures at 1440 and 390 CSS pixels were inspected locally (`/tmp/hallelujah-demo-home-full.png` and `/tmp/hallelujah-demo-home-mobile-full.png`); these temporary captures are not durable FD-08 comparison evidence or client visual acceptance.

**Remaining gate:** FD-08 must compare fresh connected-route captures with the Home study at the specified widths and record client visual review. FD-04–FD-07 still own the other page-specific repairs.

## FD-04 — Doctors D0–D6 and Profile P0–P7

**References:** [Directory study](../visual-design/pages/care-discovery/doctor-directory.html), [Profile study](../visual-design/pages/care-discovery/doctor-profile.html), care-discovery composition.

**Primary files:** Doctor route files, demo records, `clinician-directory-template.tsx` and CSS, `clinician-profile-template.tsx` and CSS under `apps/web/src/design-system/templates/`; shared cards/search controls.

| Sections | Observed gap | Required repair |
| --- | --- | --- |
| D1 | Sparse opening and ineffective help note | Restore introductory guidance, service alternative and purposeful uncertainty treatment |
| D2/D3 | Filters/counts need polish; counts occupy detached lines | Align labels/counts, Apply/Reset, active chips and result toolbar as one system |
| D4 | Repeated large placeholders dominate minimal records | Use informative card content, deliberate portrait/no-portrait variants and obvious profile destination |
| D5/D6 | Recovery/support returns visitors to search without helping | Preserve search context and provide meaningful alternative discovery paths |
| P1 | Empty portrait rectangle and weak identity/action balance | Compose a full identity section; use intentional fallback or remove media cleanly |
| P2/P3 | Areas of care and professional detail absent | Show representative editorial content with clear hierarchy and readable measure |
| P4 | Empty left column survives beside an isolated request rail | Restore editorial/rail relationship; collapse the layout when editorial content is absent |
| P5/P6 | Related services/review treatment not demonstrated | Show representative relationships and appropriate quiet metadata; provide intentional local outcomes |
| P7 | Heavy support box only returns Home | Use shared support band with Doctors, Services and appropriate request/help exits |

**Acceptance:** Directory → matching profile → matching appointment context works; search/filter/reset/history preserve context; full profile feels complete; partial profile has no empty column or portrait gap; card and rail hierarchy match the reference intent on desktop and collapse naturally on mobile.

### FD-04 implementation record — 21 October 2026

**Implementation owner:** Codex. **Visual review:** local connected-route inspection; integrated client visual review remains FD-08 work. Reviewed source: `3623ce5` plus the FD-04 working-tree changes.

The Doctors opening now explains discovery and gives direct service/contact alternatives. Its specialty counts align with labels; Apply, Reset, result range, active filters and pagination share the same search state. Text-first cards use distinct areas of care and available language fields, with explicit profile links. No approved clinician portraits exist, so the cards and profiles intentionally omit portrait media rather than reserve empty boxes. A profile link carries the bounded directory query/filter/page context, and Back to doctor results restores it. Failure retry retains the search while removing the failure scenario; no-match recovery offers reset and Services.

The full profile now presents areas of care, visitor-facing biography, language details, a selected-doctor request panel, related-service links into the existing Services directory, quiet review metadata and the shared support band. The naturally partial Dr Hana profile has no empty editorial column, media gap or unrelated-service section. The long Dr Imani name and copy reflow at 320 px. The request handoff selects the matching doctor in Appointment; the non-submitting Appointment lifecycle remains FD-07 work. Profile failure has a local retry and discovery exits. The connected route keeps the single global preview statement, with a contextual note that profile information is unreviewed and request continuation is not a booking.

**Changed areas:** Doctors profile route; clinician directory/profile templates and styles; shared filter count alignment; reproducible presentation biographies and generated snapshot; connected-route regression. Governed fixture records and publication gates were not changed.

**Evidence:** Local ignored folder `artifacts/visual/frontend-demo-fd04-2026-10-21/` holds connected full-page after captures for directory at 1440/390, full profile at 1440/390, partial profile at 390, long profile at 320, mobile no-match/failure states, and copies of the 20 October before and design-reference captures. These are local review files, not the integrated FD-08 comparison board. The directory and full/partial/long profile layouts were inspected visually; no empty media box, vacant partial-profile column or horizontal overflow was found in those captures.

**Verification:** Directory and profile SSR contracts passed (18 and 30 cases); directory rendered matrix passed 142 cases; profile rendered matrix passed 142 cases; profile accessibility/reflow/withdrawal validation passed 10 cases. The connected browser regression passed 14 route/journey groups, including retained directory context, related-service handoff, failure retry, Back/Forward and matching Appointment doctor selection. TypeScript, lint and the production build passed. Client visual acceptance and the six-page scorecard remain pending FD-08.

## FD-05 — Services directory S0–S7

**Reference:** [Services study](../visual-design/pages/care-discovery/services-directory.html).

**Primary files:** `apps/web/src/app/services/page.tsx`, demo service records, `service-directory-template.tsx` and CSS under `apps/web/src/design-system/templates/`.

| Sections | Observed gap | Required repair |
| --- | --- | --- |
| S1/S2 | Bare title; designed introduction/urgent treatment not represented | Restore useful orientation and a separately testable applicable urgent-guidance scenario |
| S3/S4 | Shared filter polish incomplete | Apply shared search, group rail, chips, counts and reset behavior |
| S5 | Name-only cards repeat button-shaped unavailable labels; pagination fragments groups | Supply concise representative summaries and meaningful next actions; choose page composition deliberately around groups |
| S6 | State mechanics do not establish useful recovery | Demonstrate zero/failure/offline scenarios retaining query/group context and alternative routes |
| S7 | Narrow heavy-bordered support box touches discovery region | Restore broad, deliberately spaced support band and useful Doctors/Not sure handoffs |

**Scope boundary:** Service detail remains a later page. Review its card affordance through an explicit local demonstration treatment or handoff to existing Appointment/Doctors routes; do not present a dead button or silently claim service-detail completion.

**Acceptance:** Visitors can understand and compare the represented services, use groups/search, and take a meaningful next step. Default cards are not dominated by unavailable labels. Grouping, summaries, pagination and support form a coherent desktop and mobile composition.

### FD-05 implementation record — 21 October 2026

**Implementation owner:** Codex. **Visual review:** local connected-route inspection; integrated comparison and client decision remain FD-08 work. Reviewed source: `7a3b35f` plus the FD-05 working-tree changes.

The Services opening now explains how to browse and offers Doctors and Appointment alternatives. The local demo shows ten distinct service summaries across three groups. Its six-result page size keeps the three Access and three Medicine cards together on page one, with all four Specialty and rehabilitation cards on page two. Search, group counts, Apply/Reset, active chips, result range and pagination share the same bounded URL state. Exact `urgent` and `emergency` searches reveal a separate, static Emergency route notice. Empty and failure states offer useful alternate routes; retry removes the failure scenario while retaining the query and group.

Default cards hand off to Appointment with the matching service selected. The route does not claim a service-detail page. Appointment submission remains disabled until FD-07 provides the local simulation, so this handoff demonstrates selected context only. The controlled service-directory preview retains its withheld service-detail affordance. The broad support band offers Doctors, Appointment and illustrative contact options.

**Changed areas:** Services route; Appointment selected-service handoff; local service presentation summaries; service-directory template and styles; connected browser regression. Governed service fixtures and real request boundaries were not changed.

**Evidence:** Ignored local folder `artifacts/visual/frontend-demo-fd05-2026-10-21/` contains connected full-page after captures at 1440 and 390 CSS pixels, plus the 20 October before and reference desktop captures. The default desktop and mobile pages were inspected visually; the cards, support band and footer compose without blank media, blocked actions or horizontal overflow. Focused 320 px reflow and 390/768/1440 px overflow were checked in Chromium. The integrated FD-08 comparison board and scorecard remain pending.

**Verification:** Service-directory contract passed 22 cases; service-directory validation passed 20 cases; Appointment page contract passed 20 cases. TypeScript, lint and the production build passed. The connected Chromium regression passed 15 route/journey groups, including service search, group reset, browser Back/Forward, whole-group pagination, selected-service Appointment context, urgent guidance, retained failure search and runtime-console checks. Client visual acceptance remains pending FD-08.

## FD-06 — Emergency E0–E8

**Reference:** [Emergency study](../visual-design/pages/critical-journeys/emergency.html).

**Primary files:** `apps/web/src/app/emergency/page.tsx`, `emergency-template.tsx` and CSS under `apps/web/src/design-system/templates/`.

**20 October finding:** The connected route forced `unavailable`. FD-01 now supplies a normal inert route and separate failure scenarios. FD-06 still owns the complete Emergency composition, useful contact/arrival outcomes and recovery design.

**Required changes**

- Render the full demonstration: route distinction, paired route-choice cards, comparison, compact warning, scope, entrance/text directions, transport/access, optional map treatment, and support.
- Use unmistakably illustrative contact values and local simulation; no actual dialer/provider connection is required.
- Demonstrate copy-direction feedback and optional-map loading/failure locally where applicable.
- Keep unavailable/expired/unsupported-call states separately reviewable, with useful exits.
- Preserve stable urgent content and restrained emphasis; no expressive entrance, pulsing control or blocking animation.

**Acceptance:** The default demo visibly demonstrates E0–E8 and the intended information hierarchy. Contact choices have clear purpose, values and actions. Missing-data scenarios are compact and do not loop between equivalent messages. All essential information remains usable without motion or media.

### FD-06 implementation record — 21 October 2026

The connected Emergency route now presents E1–E8 with distinct illustrative hospital and public choices, concise safety guidance, scope status and review metadata, written arrival steps, transport/access detail, an optional map example, and non-emergency support. Each contact choice produces local feedback without opening a dialer. Directions copy with announced success or a selectable-text fallback. The map example moves from idle through loading to a deterministic failure with retry; blocked and failed scenarios remain separately reviewable. No map provider or location request is made. Unavailable and expired emergency states remove the example contact values and lead to the separate Home contact area rather than another unavailable message.

The presentation source and exported local snapshot use distinct route purposes and fictional arrival values. The controlled Emergency preview keeps its fail-closed behavior. No hospital emergency capability, staffed hours, public number, real entrance, or provider is asserted.

**Changed areas:** Emergency route; local contact/map actions and presentation snapshot; Emergency template and styles; connected browser regression. **Verification:** Emergency controlled contract passed 52 cases and rendered smoke passed 255 cases. TypeScript, lint and production build passed. The connected Chromium regression passed 16 route/journey groups, including contact feedback, directions copy, map loading/failure, unavailable/expired/blocked/unsupported scenarios, no `tel:` links, runtime console checks and Emergency reflow at 320, 360, 390, 768, 1280 and 1440 CSS pixels. The 1440 and 390 CSS pixel full-page captures were visually inspected at `/tmp/hallelujah-demo-emergency-full.png` and `/tmp/hallelujah-demo-emergency-mobile-full.png`; these temporary files are not durable FD-08 comparison evidence or client visual acceptance.

**Remaining gate:** FD-08 must compare the connected page with the design study and record the final visual decision. FD-07 still owns the Appointment simulation.

## FD-07 — Appointment A0–A8

**References:** [Appointment study](../visual-design/pages/critical-journeys/appointment.html), [state board](../visual-design/pages/critical-journeys/appointment-states.html), later appointment contract.

**Primary files:** `apps/web/src/app/appointment/page.tsx`, `appointment-template.tsx` and CSS under `apps/web/src/design-system/templates/`, `apps/web/src/demo/interactions.tsx`; existing form/state components.

**20 October finding:** The basic white form composition existed, but repeated warnings and test instructions dominated. FD-01 now exposes static review variants, while editable fields still terminate at disabled Check details. FD-07 must implement the safe local validation/review/receipt journey.

**Required changes**

- Refine opening, compact emergency warning with route link, form grouping, privacy treatment, consequence/action area and support.
- Replace repeated implementation/test instructions with concise presentation copy and a clear demo boundary.
- Provide a deterministic non-persistent simulation: editing → validation or pending → receipt, known failure, unknown/reconciliation, duplicate or delivery warning.
- Preserve entered demonstration values when recovery calls for it; never log, transmit or persist personal values.
- Retain conditional doctor/service choice, matching handoff, required name/phone, optional date and initially unchecked acknowledgment.
- Make date entry helpful and usable on mobile. A specific widget choice must be judged by usability rather than screenshot similarity alone.
- Show workflow-unavailable as a separate coherent informational state, not editable fields ending in a permanently disabled action.

**Acceptance:** A client can complete a simulated request and inspect recovery branches. Errors are linked and focused correctly; valid answers survive recoverable errors; repeated activation does not create a second simulated outcome; receipt states clearly remain requests rather than bookings. No live API/provider is needed for this frontend demonstration.

### FD-07 implementation record — 21 October 2026

The connected Appointment page now has a browser-only request example. The default form validates the care route, its conditional doctor or service choice, required sample name and phone, optional native date within 365 days, and initially unchecked acknowledgment. Invalid submission focuses a linked error summary; choosing a summary link focuses its field. Valid submission shows a brief pending state, disables repeated activation, and ends with a clearly local receipt. Contact values are cleared on terminal states and page exit. No request body is sent or stored. The controlled preview and the `/api/appointment-requests` fail-closed boundary remain separate.

The opening and emergency warning are compact, the form retains a single reading column, and the privacy and action sections have a clear order. A native date field supplies the mobile platform picker. The no-JavaScript connected form remains inert. Static `?demo=` review states remain available; adding `&start=editing` to `known-failure`, `unknown`, `duplicate` or `delivery-warning` starts that scenario from an editable form. Known failure retains values for retry. Unknown requires local reconciliation before retry. Duplicate leads back to the same example receipt. Delivery warning keeps its example reference and offers no new submit action. `/appointment` resets the example.

**Changed areas:** Connected Appointment route, browser interaction controller, Appointment template and styles, native date primitive, controlled-browser data-URL allowance, and connected browser regression. **Reviewed source:** `0d8b7f1` plus FD-07 working-tree changes. **Verification:** Appointment controlled contract passed 20 cases; rendered smoke passed 284 responsive, capability, interaction, accessibility and isolation cases. TypeScript, lint and the production build passed. The connected Chromium regression passed 17 route/journey groups, including validation, linked-field focus, selected-care handoff, receipt, repeated activation, failure retry, unknown reconciliation, duplicate recovery, delivery warning, no-JavaScript inert form, no POST and disabled API boundary. Full-page desktop and 390 px captures were inspected at `/tmp/hallelujah-demo-appointment-full.png` and `/tmp/hallelujah-demo-appointment-mobile-full.png`; these temporary files are not durable FD-08 evidence or client visual acceptance.

**Remaining gate:** FD-08 must create the integrated comparison board, score all six pages at desktop and mobile, rehearse from a clean reset, and record the client visual decision.

## FD-08 — Acceptance evidence and handoff

For every repair, record:

| Field | Required evidence |
| --- | --- |
| Scope | Repair ID, affected sections, files and source revision |
| Before/after | Actual connected-route captures and matching design reference |
| Visual review | Composition, hierarchy, spacing, typography, surface roles, media, component finish |
| Responsive | 320, 360, representative tablet, 1280 and 1440 px; long content and reflow |
| Interaction | Default plus relevant focus/hover/pressed/loading/empty/error/partial/recovery states |
| Motion | Direct entry and client navigation, reduced motion, media failure; no blocked task access |
| Functional | Useful destination/outcome, browser Back/Forward, menu/focus, conditional form behavior |
| Runtime | No unexpected console errors; real submission/provider boundaries retained |
| Decision | Remaining deviations and rationale; implementation verification distinct from client visual acceptance |

Run focused existing page/component checks and the connected-route regression after relevant changes. Run lint, type checking and build checks appropriate to the final implementation. Expand testing when changed behavior or a new failure justifies it. Do not replace visual review with additional counts of structural assertions.

### Visual quality scorecard

Score every page separately at desktop and mobile after repairs. This is a proposed internal review rubric, not a measured current score or an external benchmark rating.

| Dimension | Weight | Evidence |
| --- | ---: | --- |
| Composition and hierarchy | 25% | Complete section structure, first-view clarity, balanced media/editorial regions |
| Typography, spacing and alignment | 20% | Readable measure, consistent rhythm, deliberate wrapping and shared edges |
| Component finish and consistency | 20% | Shared anatomy, action priority, focus and state polish across pages |
| Content and media quality | 15% | Useful representative copy, coherent records, deliberate imagery/fallbacks |
| Responsive composition | 10% | Content-fit layouts, natural stacking, long content and no accidental gaps |
| Interaction and motion quality | 10% | Useful outcomes, preserved context, precise feedback and stable reduced-motion view |

Use 1 = broken/incomplete, 2 = visibly rough, 3 = functional but needs refinement, 4 = presentation-ready, and 5 = exceptionally resolved. Calculate the weighted score on the 1–5 scale. Internal readiness requires **at least 4 in every dimension on every page and viewport reviewed**, with no unresolved critical journey or runtime defect. A strong Home score cannot compensate for a weak Profile or Appointment page.

Record the reviewer, date, evidence links, scores and remaining deviations. A score cannot replace an actual screenshot review or the client's acceptance.

### Client-demo rehearsal

Prepare a repeatable 8–10 minute walkthrough; duration is a rehearsal target, not a claim about patient task completion.

| Step | Demonstrate | Expected result |
| --- | --- | --- |
| 1. Home and identity | Open the clean default Home; show the opening, task choices and search | Complete composition, clear brand and immediate routes into care |
| 2. Discover care | Search/filter Doctors, inspect results and open a matching profile | Useful cards, retained discovery context, substantive profile |
| 3. Request | Continue from the profile; show validation, correct it and complete the simulation | Correct context, focused errors, preserved valid values, request receipt |
| 4. Alternative discovery | Open Services, select a group and follow a meaningful existing-route handoff | Useful summaries and clear next action without pretending service detail exists |
| 5. Urgent access and arrival | Open Emergency; show route choices and illustrative direction feedback | Stable complete information and purposeful local outcomes |
| 6. Mobile and recovery | Repeat a key navigation at 360 px; select one partial-content and one failure/recovery scenario | Composed mobile UI, working menu/focus and credible recovery |
| 7. Reset | Restore the full default scenario | No entered contact values retained and no failure fixture left as the next opening view |

Before the presentation: verify the documented startup command and local route availability, confirm the intended source revision, reset fixtures, use fictional form values, and run the journey from a clean browser session. Keep fresh local screenshots available if the presentation environment fails; label them as captured evidence rather than a live interaction. Do not rely on internet access for essential demo assets or actions.

### Handoff package

- Repair ledger containing FD ID, section IDs, changed files/revision, validation results, evidence links and open deviations.
- Fresh route/reference comparison board for all six page types at the required widths; include focused component/state crops where full-page captures conceal defects.
- Scenario index with exact entry/reset instructions and expected outcomes for default, partial and failure demonstrations.
- Concise presenter script following the rehearsal above, including the one-sentence demo boundary.
- Explicit status separating implementation verification, internal visual readiness and client acceptance.

### Final checklist

- [x] All six default pages present their intended complete composition.
- [x] Shared components and navigation are visually consistent.
- [x] Representative content has enough depth to evaluate real layout.
- [x] No unexplained blank media boxes, accidental vacant columns or empty section headings.
- [x] Every visible action has a meaningful local outcome or a clearly explained deliberate limitation.
- [x] Normal and failure states are both demonstrable; unavailable is not the only page.
- [x] Mobile layouts are composed, not merely free of horizontal overflow.
- [x] Appointment lifecycle can be demonstrated without a backend.
- [x] Direct navigation and client navigation behave consistently without unexpected console errors.
- [x] Fresh side-by-side visual review is complete and remaining differences are explicit.
- [x] Benchmark-derived decisions are traceable to concrete local refinements and evidence.
- [x] Every page passes the visual quality scorecard on desktop and mobile.
- [x] The scripted client-demo journey succeeds from a clean browser profile and resets to Home.
- [x] The handoff package identifies the reviewed revision and reproducible scenarios.
- [ ] The client has accepted the visual/frontend result; technical test success alone does not check this box.

### FD-08 internal review record — 21 October 2026

The [FD-08 handoff and scorecard](evidence/frontend-demo-fd08-2026-10-21.md) records the reviewed revision, fresh before/after/reference board for all six page types, 320/360/768/1280/1440 px captures, focused states, scenario index, repair ledger and presenter script. Codex reviewed the complete desktop and mobile compositions; all six pass the internal 4/5 minimum in every dimension. The fresh-profile connected Chromium run passed 17 route/journey groups twice, with no unexpected browser exceptions or real request submission. Lint, TypeScript, local-link and production-build checks passed. The only format-check failures are the 20 pre-existing ignored historical review files identified under FD-02; those captures were not rewritten. Client visual acceptance is a separate outstanding decision.

FD-01–FD-08 local implementation and internal review are complete. **Client visual acceptance remains pending.**

**Client-preview adjustment, 21 October 2026:** At the user's request, Home doctor cards, Doctors results, and doctor profiles now show labeled photo placeholders. These intentionally empty image slots make the planned portrait placement visible to the client. No clinician photos or portrait asset claims were added. The updated desktop/mobile browser review passed 17 route/journey groups with no unexpected console or network errors; `/tmp/hallelujah-photo-review/` contains fresh full-page captures. Client visual acceptance remains pending.
