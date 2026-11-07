# FD-08 connected frontend demo review and handoff

- **Review date and reviewer:** 21 October 2026, Codex internal visual review
- **Reviewed implementation:** `dc323f6` plus the FD-08 evidence-capture change to `scripts/check-demo-routes.mjs`
- **Scope:** Home H0–H9, Doctors D0–D6, Profile P0–P7, Services S0–S7, Emergency E0–E8, Appointment A0–A8, shared shell, support and footer
- **Implementation verification:** passed locally
- **Internal visual readiness:** passed this review at the 4/5 threshold for all six page types on desktop and mobile
- **Client visual acceptance:** pending client review; no approval is inferred from this record

## Evidence and method

Open the [comparison board](frontend-demo-fd08-artifacts/index.html) locally. It includes a 20 October connected-route before capture, the fresh connected route, and the desktop design study for each page type. Fresh full-page captures cover **320, 360, 768, 1280 and 1440 CSS px** for all six types. The board also links partial Profile, failed Doctors, empty Services, unavailable Emergency, Appointment validation and receipt states. The studies precede the client palette amendment; compare structure and task purpose rather than old color values or prototype copy.

The review inspected the full desktop and mobile compositions, plus the 320 px reflow captures. At 1440 px the Home has a balanced abstract media plane and complete H1–H9 flow; the two directories have usable search, groups and cards; Profile has a substantive column and matching request rail; Emergency separates routes and arrival information; Appointment presents the simulated form and consequence clearly. At 360/320 px, content stacks in a readable order, the compact shell remains usable, and the reviewed captures do not show blank portrait/media rectangles, vacant partial-profile columns or horizontal clipping. The before captures make the FD-01–FD-07 changes visible without treating the old studies as production architecture.

The connected Chromium regression passed **17 route/journey groups** from a fresh browser profile. It checked direct and client navigation, Home search, doctor/profile/request context, service filtering and reset, browser Back/Forward, mobile menu and Escape focus return, language disclosure, conditional appointment fields, validation focus and value retention, local receipt, known/unknown/duplicate recovery, emergency copy/map feedback, no-JavaScript behavior, no unexpected console exceptions, no real `POST`, and the disabled appointment API. It also checked no horizontal overflow at 390/768/1440 for all six page types, plus selected 320/360/1280 checks. Lint, TypeScript, local links and the production build passed. The capture run repeated the same regression while producing the fresh image set. `pnpm format:check` still fails on 20 pre-existing, ignored files in `artifacts/visual/client-page-review-2026-10-20/` that lack final newlines; it reported no FD-08 files. These historical captures were not rewritten.

The board is a visual review aid, not a pixel-diff test. The local development browser rendered Noto Sans from its installed fonts. Approved self-hosted Noto binaries are still absent, so typography on a different presentation machine needs a quick check. No authentic clinician, service, address, telephone, clinical scope, booking or translation is implied.

## Scorecard

Score order: **composition/hierarchy (25%), typography/spacing (20%), component finish (20%), content/media (15%), responsive composition (10%), interaction/motion (10%)**. The internal rubric requires every dimension to score at least 4. Each row below scores `4 / 4 / 4 / 4 / 4 / 4`, for a weighted **4.0/5**. A 4 means presentation-ready for this controlled demo, not exceptional or approved for publication. The score reflects the screenshots and connected journey above; it is not a substitute for the client's own visual decision.

| Page | Desktop 1440 | Mobile 360 | Reviewed evidence and remaining deviation |
| --- | ---: | ---: | --- |
| Home | 4.0 | 4.0 | [Captures](frontend-demo-fd08-artifacts/index.html#home); abstract artwork intentionally substitutes for unavailable authentic photography. |
| Doctors directory | 4.0 | 4.0 | [Captures](frontend-demo-fd08-artifacts/index.html#doctors); cards omit unapproved portraits. |
| Doctor profile | 4.0 | 4.0 | [Captures](frontend-demo-fd08-artifacts/index.html#profile); partial profile deliberately compresses when facts are absent. |
| Services directory | 4.0 | 4.0 | [Captures](frontend-demo-fd08-artifacts/index.html#services); service detail is outside this demo, with an existing-route request handoff. |
| Emergency | 4.0 | 4.0 | [Captures](frontend-demo-fd08-artifacts/index.html#emergency); example numbers and location cannot place a call or guide real arrival. |
| Appointment | 4.0 | 4.0 | [Captures](frontend-demo-fd08-artifacts/index.html#appointment); the local receipt is a simulation and confirms no booking. |

## Repair ledger

| Repair | Sections / changed area | Verification and evidence | Open deviation |
| --- | --- | --- | --- |
| FD-01 | Shared demonstration data, six page fixtures and scenario states | [Implementation record](../frontend-demo-repair-plan.md#fd-01--representative-demo-content-and-scenarios); [current comparisons](frontend-demo-fd08-artifacts/index.html) | Authentic facts and approved media remain gated. |
| FD-02 | Shared shell, navigation, token palette, support/footer and lifecycle | [Implementation record](../frontend-demo-repair-plan.md#fd-02--shared-visual-system-and-frontend-lifecycle); 17-group connected regression | Self-hosted Noto binaries absent. |
| FD-03 | Home H0–H9 | [Implementation record](../frontend-demo-repair-plan.md#fd-03--home-h0h9); [comparison](frontend-demo-fd08-artifacts/index.html#home) | Abstract rather than authentic place imagery. |
| FD-04 | Doctors D0–D6 and Profile P0–P7 | [Implementation record](../frontend-demo-repair-plan.md#fd-04--doctors-d0d6-and-profile-p0p7); [comparisons](frontend-demo-fd08-artifacts/index.html#doctors) | No verified roster or portraits. |
| FD-05 | Services S0–S7 | [Implementation record](../frontend-demo-repair-plan.md#fd-05--services-directory-s0s7); [comparison](frontend-demo-fd08-artifacts/index.html#services) | No public service-detail page. |
| FD-06 | Emergency E0–E8 | [Implementation record](../frontend-demo-repair-plan.md#fd-06--emergency-e0e8); [comparison](frontend-demo-fd08-artifacts/index.html#emergency) | Real emergency contact/arrival facts remain withheld. |
| FD-07 | Appointment A0–A8 | [Implementation record](../frontend-demo-repair-plan.md#fd-07--appointment-a0a8); [comparison](frontend-demo-fd08-artifacts/index.html#appointment) | No request is sent or saved. |
| FD-08 | Integrated six-page review, responsive board, rehearsal contract and handoff | This record; [comparison board](frontend-demo-fd08-artifacts/index.html); 17-group browser run; lint and types | Client visual decision pending. |

## Reproducible scenarios

Start with `pnpm dev` at the repository root. Open `http://localhost:3000/` in a **new browser profile**. All URLs below are local and use fictional presentation data. Reset by navigating to `/`, then use a new tab/profile before another form demonstration so no sample contact values carry over. There is no server-side request or saved appointment to clear.

| Scenario | Entry and action | Expected result |
| --- | --- | --- |
| Default six pages | `/`, `/doctors`, `/doctors/synthetic-clinician-101010101010`, `/services`, `/emergency`, `/appointment` | Complete normal composition, shared shell and footer. |
| Doctor journey | Home search `Aster`; open Dr Aster; continue to Appointment | One matching result, substantive profile, selected doctor in the form. |
| Services journey | `/services?group=synthetic-medicine`; remove the active group; select Heart medicine | Group selection and reset work; the request form carries the selected service. |
| Appointment validation and receipt | From `/appointment`, press **Check details** empty; select a route, use `TEST PATIENT` and `+0 000 000 0000`, acknowledge the local example, then check details | Linked error summary focuses; valid values remain; one local receipt states that no booking is confirmed. |
| Partial and empty | `/doctors/synthetic-clinician-101010101010?demo=partial`; `/services?q=no-such-demo-service` | Profile omits absent media/content cleanly; Services gives a useful reset route. |
| Failure and recovery | `/doctors?demo=failure&q=Aster`; `/appointment?demo=known-failure&start=editing` | Directory retry retains search; Appointment retains sample values and supports retry. |
| Uncertain and unavailable | `/appointment?demo=unknown&start=editing`; `/emergency?demo=unavailable` | Appointment requires reconciliation before another outcome; Emergency gives safe alternatives. |
| Mobile and motion | Repeat Home → Doctors at 360 px; open/close Menu with Escape; enable reduced motion | Menu returns focus, content stays ordered, essential actions remain available. |

## Presenter script (8–10 minutes)

1. **0:00–1:15 — Home:** open the clean default page. Point out the identity, five task choices and labeled doctor search. Say: “This is an illustrative frontend preview; people, services and contact details are not verified, and requests stay in the browser.”
2. **1:15–2:45 — Discover care:** search `Aster`, show the result and open Dr Aster. Show the areas of care, languages, related service and matching request rail.
3. **2:45–4:45 — Request:** continue with the selected doctor. Submit empty to show linked validation, then use only the fictional values above and show the local receipt. State that no booking was made.
4. **4:45–5:45 — Services:** open Services, select Medicine, reset it and follow Heart medicine into the existing Appointment route.
5. **5:45–7:00 — Urgent access:** open Emergency. Distinguish hospital and public routes, then show written arrival guidance and illustrative copy feedback. State that the displayed values must not be used for real care.
6. **7:00–8:30 — Mobile and recovery:** resize to 360 px, open the menu and return focus with Escape. Show the partial profile and one failure/retry scenario.
7. **8:30–9:00 — Reset:** return to `/` in a fresh tab/profile at full width; confirm the normal Home is the next opening view.

Before presenting, run `node scripts/check-demo-routes.mjs` against the local server and confirm the intended revision. The checked-in board remains available if live browser interaction fails. Do not present screenshots as live behavior.

## Decision

The implementation and this internal visual review meet the FD-08 local handoff requirements. **Client visual acceptance is pending.** The client should review the comparison board or live walkthrough and record approval or specific changes against the six page types. Public release and real hospital-data decisions remain governed by their separate gates.
