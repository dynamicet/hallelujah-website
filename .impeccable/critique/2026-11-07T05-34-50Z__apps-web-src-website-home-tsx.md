---
target: current homepage and connected care journeys
total_score: 29
max_score: 40
na_heuristics:
p0_count: 0
p1_count: 2
target_identity: "file:/home/befikadusata/Devs/dynamik/halleluja-hospital/website/hallelujah/apps/web/src/website/home.tsx"
target_fingerprint: "sha256:ee954c14a1dc1c30d360d72140abac66e5e9f80ed156c6e71833ebac04871a07"
target_path: /home/befikadusata/Devs/dynamik/halleluja-hospital/website/hallelujah/apps/web/src/website/home.tsx
timestamp: 2026-11-07T05-34-50Z
slug: apps-web-src-website-home-tsx
---
Method: dual-agent (A: /root/design_review · B: /root/detector_review)

Target: `apps/web/src/website/home.tsx`, with live doctor, appointment, service and visit-planning journeys sampled. Current implementation at commit `7285b09`.

## Design specificity and overall impression

The site has a coherent, humane hospital identity: the emblem, Addis Ababa location, teal/peach palette, editorial typography, care discovery and practical visit advice belong together. Preserve that direction. The biggest opportunity is making its promises and proof as precise as its visual presentation.

## Design health: 29/40 — Good

| Heuristic | Score /4 | Evidence |
|---|---:|---|
| System status | 3 | Useful result counts and form progress; homepage omits booking capability boundary. |
| Real-world language | 3 | Familiar care/visit language; choosing-help label overstates destination. |
| User control | 3 | Result return, reset and contact exits. |
| Consistency | 3 | Cohesive shell and hierarchy; doctor/clinician terminology varies. |
| Error prevention | 2 | Appointment limitation appears after the initiating action. |
| Recognition | 3 | Visible care summaries, languages and related services. |
| Efficiency | 3 | Search, browse and contact alternatives; duplicate entry routes add load. |
| Minimalism | 3 | Strong composition; lengthy institutional sequence dilutes focus. |
| Error recovery | 3 | Useful empty-result recovery; full form-error journey not exercised. |
| Help | 3 | Practical visit advice; consequential booking limitation arrives late. |

All ten apply because this homepage connects functional care journeys. Scores are expert judgments, not user-research measurements.

## What works

- Responsive composition stays legible at 390, 768 and 1440px.
- Preparation, directions and emergency separation answer practical visitor needs.
- Consistent typography, color and visible skip-link focus provide strong foundations.

## Priority issues

1. **P1 — Appointment promise exceeds current capability.** “Request an appointment” leads to a preview that sends and saves nothing. Make the limitation visible beside the initiating action and give real contact appropriate prominence. Suggested command: `$impeccable clarify`.
2. **P1 — Institutional proof appears more verified than it is.** Statistics, clinician presentation and relationship logos carry factual visual authority despite fixture/unapproved provenance. The statistics component drops the fixture's preview flag. Label preview material where encountered or withhold it pending approval; replace claims and media together. Suggested command: `$impeccable harden`.
3. **P2 — Choosing-help action leads into a request form.** “Help me choose a doctor” links to `/appointment`, whose category selection does not provide actual doctor guidance. Route to an orientation aid or relabel the destination literally. Suggested command: `$impeccable clarify`.
4. **P2 — Reused portraits weaken clinician recognition.** The directory repeats portraits for Dr Aster/Dr Eden and Dr Bekele/Dr Desta. Use distinct approved portraits or clearly illustrative placeholders/initials. Suggested command: `$impeccable harden`.
5. **P2 — The mobile hospital narrative needs tighter editing.** After directions come health topics, equipment, film, numbers, stories, resources and two logo collections. Preserve the hospital showcase goal, but shorten the overview, link to detail, consolidate repeated relationships and finish with a useful care/visit action. Suggested command: `$impeccable distill`.

## Cognitive load and emotional journey

Three of eight checklist items failed: single focus, chunking and minimal choices. Grouping, hierarchy, sequential task focus, memory support and progressive disclosure passed. Nine desktop utility actions and overlapping hero/search routes create decision pressure. Item counts are review prompts, not proof every useful list must shrink to four.

The opening feels reassuring; care search and visit questions sustain that feeling. The appointment-preview disclosure creates the main emotional valley. Later statistics and relationship presentation create a confidence peak beyond their verified evidence.

## Persona red flags

- First-time visitor: choosing-help and appointment labels imply outcomes the destination does not deliver.
- Distracted mobile visitor: useful call/search actions arrive early, but the institutional narrative requires substantial scrolling; preparation selections clear on leaving.
- Methodical evaluator: duplicate portraits and insufficiently qualified statistics/relationships undermine trust.

## Detector synthesis

The source scan of `home.tsx` returned zero findings. Rendered scans returned 17 occurrences over three desktop pages: italic-serif-display 2, overused-font 3, nested-cards 10, side-tab 2. These are pattern signals, not 17 verified usability defects. Preserve the established Lato/serif typography; warning/selection accents have meaningful functions. Directory nesting is one repeated pattern worth reviewing for complexity. The detector did not identify the principal expectation/provenance issues.

## Minor observations

Services repeats area browsing and checkbox filtering; the distinction could be clearer. A–Z topic browsing assumes visitors know a medical term. Appointment “illustrative contact details” wording conflicts tonally with actionable shell contacts.

## Questions to consider

- Which outcome should an uncertain patient complete today: reception contact, care discovery, or exploring the appointment demonstration?
- Which approved institutional evidence deserves the strongest visual emphasis?
- What should equipment, film, numbers and relationships teach that helps a visitor's next care decision?

## Evidence and limits

Fresh automated responsive checks passed six route/width cases. Independent visual inspection found the issues above and recorded a failed visual review separately. Six responsive and ten supplementary captures were opened by A; three overlay captures by B. Initial keyboard skip-link focus was checked; disclosure activation was programmatic. Captures used reduced motion. No full keyboard, screen-reader, normal-motion, real-device, medical-content or operational verification was performed.

Design evidence: `artifacts/visual-checks/2026-11-07T05-31-12.515Z-responsive-pPaZD0/visual-findings.md`. Detector evidence: `artifacts/impeccable-assessment-b-20261107/assessment-b.md`.
