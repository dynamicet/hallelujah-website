# Deliverable 5 — inner page composition

**Current usage authority:** [Final brand and composition guide — deliverable 6](../usage-guide.md).

4 November 2026. Extends the [revised homepage composition](composition-implementation.md)
across the existing local website routes. This implements the page rollout; hospital content
approval and publication remain separate.

## Review the pages

| Page family | Live preview | Refinement |
| --- | --- | --- |
| Doctor discovery | [Doctors](http://localhost:3000/doctors) | White results workspace, distinct mist filter rail, blue headings, warm and expressive card edges, two-column comparison on wide screens |
| Service discovery | [Services](http://localhost:3000/services) | Search and results hierarchy, readable service titles, pale-blue reading planes, left-aligned appointment links, separate preparation guides |
| Clinician profiles | Open a profile from Doctors | Warm-edged portrait, blue care actions, compact section headings, independently framed request information |
| Service details and preparation | Open a service or preparation guide from Services | Shared reading columns, blue heading rules, supporting accents at preparation moments, white reading insets within mist grounds |
| Appointment | [Request an appointment](http://localhost:3000/appointment) | Clear field boundaries, selected-choice edge, blue progress states, separate white form and summary surfaces, expressive summary marker |
| Visit planning | [Patients & visitors](http://localhost:3000/patients-visitors) | Consistent section spacing and heading scale, clearer checklist rows and checked states, practical content grouped within blue structure |
| Referrals | [Refer a patient](http://localhost:3000/referrals) | Same reading hierarchy and independently composed next-step panel |
| Feedback | [Patient feedback](http://localhost:3000/feedback) | Blue labels, defined controls, expressive review edge, clear action hierarchy |
| Health topics | [Topic finder](http://localhost:3000/health-topics) | Distinct page and finder headings, white search plane, magenta search edge, blue selection and care handoffs |
| Topic guides | Open a topic from the finder | Blue reading structure, separate care-options panel, consistent linked-doctor rows |
| News and resources | [Archive](http://localhost:3000/news-resources) | Strong lead story, consistent image crops, supporting editorial rules, blue category selection and framed reading cues |
| Articles and events | Open a story from the archive | Blue heading hierarchy, restrained metadata detail, comfortable reading width and a warm-edged next-step sidebar |
| Emergency | [Emergency information](http://localhost:3000/emergency) | Blue orientation and arrival structure, white practical information planes; explicit urgency retains red and written warnings |

The work keeps the existing palette, fonts, imagery, route behavior and preview disclosures.
It adds no new library or dependency. Photography is the existing repository artwork; no new
image is represented as a verified photograph of the hospital. The homepage, component study
and publication gates are not changed by this rollout.

## Visual decisions

Blue carries headings, destinations, selection and recurring structural edges. Orange helps
frame arrival, preparation and next steps. Magenta appears in editorial metadata and a few
human details. White supplies a reading or working plane inside mist and paper surroundings.
No specialty or page is assigned exclusive ownership of an accent family.

Page layouts follow their task: directories compare, guides read, appointment controls work,
and editorial pages lead with a story. A wide doctor directory uses two columns; phones retain
a single comparable list. Directory opening images remain hidden on phones so search appears
earlier. Supporting panels have their own contrast and hierarchy rather than repeating one
color across every element.

The new finder title is an optional component prop, retaining the existing homepage default.
Appointment guidance now uses the measured sticky-header height. Print and forced-color
treatments accompany the new field, selection and reading-plane details.
Reading columns stack below 900px; article sidebars move below the reading column below
1024px. The floating Help launcher now treats list items, labels, quotations and definition
text as obstacles, preventing it from covering content the earlier obstacle list missed.

## Evidence and validation

The [baseline captures](../evidence/route-rollout/before/checks.json) record the committed
composition before this rollout. [Revised captures](../evidence/route-rollout/after/checks.json)
cover the same 14 representative routes at 1440, 768 and 390px; layout checks additionally
cover 320px. Full captures use route names and widths as filenames in those directories.
The representative set covers all nine main pages plus clinician, service, topic and article
details. The shared preparation-guide template is also included in the broader route audit.

The [route audit](../evidence/route-rollout/routes.json) checks 44 reachable routes at desktop
and phone widths for a single H1, duplicate IDs and horizontal overflow. The
[interaction checks](../evidence/route-rollout/interactions.json) exercise feedback review and
return focus, visit checkboxes, appointment next/back controls, topic reading and return focus,
and empty/failure/validation/unavailable layouts at four widths. Flat-background rendered
text samples meet their applicable contrast thresholds; minimum sampled contrast is 4.956:1.
Photographic text, all control permutations and assistive technology are outside that sample.
The [Help collision check](../evidence/route-rollout/help.json) passed at 48 sampled scroll
positions across four widths on referral, visitor and appointment pages.

Production build, TypeScript, token validation, changed-source lint, brand assets, local links,
care journeys, appointment page, doctor directory/profile, service directory, emergency and
patient guide checks passed. The hospital readiness gates and local-only routes remain intact.

The [directory](../evidence/route-rollout/directory-inspection.json) and
[appointment](../evidence/route-rollout/appointment-inspection.json) visual inspectors report
zero failures with explicit allowances for `hairline`, `eyebrow`, `few-pictures` and
`focal-point`. The first two retain the requested linework and meaningful labels; the latter
two keep these practical pages focused on search and form controls instead of adding four
large pictures or enlarging the title to marketing-hero scale. Before those latter allowances,
both pages reported two style failures. These are design-scope decisions, not accessibility
exceptions or evidence that every visual test passed without qualification.

Remaining warnings: original logo typography, approved paper ground, existing secondary
metadata color and type-scale variety, absence of video on working pages, a thin summary
outline, and the inspector measuring an inner form inset as an outer margin. The actual
page frames align; form insets deliberately separate the controls. Native form boundaries,
legible metadata and the existing brand assets remain appropriate here.

## Visual review

ROUND 2

Seen in one second: the page's care task, carried by blue headings and a clear reading surface.

Idea (one sentence): the homepage's blue care identity becomes a consistent guide through
search, preparation, conversation and the next practical step.

Live thing: directory search/filtering, appointment progression, visit checklist, feedback
review and topic discovery retain their existing interactions.

Layout words by family: discovery=search/comparison / profile=portrait/reading/rail /
appointment=summary/workspace / visitor=guide/checklist / topics=index/reader /
editorial=lead/spread/article / emergency=routes/written-arrival.

Scores: design 7.4 · usability 8 · creativity 6.5 · content 7 → overall 7.36.
These are local review judgments, not an expert-panel agreement or external rating.
Caps applied: creativity stays below 7 because the editorial approach can also serve another
hospital. Marketing picture-count and display-scale rules are waived for practical task pages;
client-requested linework and established brand assets are retained. Further work can develop
a more distinctive hospital motif and consolidate the inherited typography scale.

Top three problems addressed:

1. The baseline directory made all results one long desktop sequence. The revised wide
   composition adds a comparison grid, independent filter plane and consistent card hierarchy.
2. The baseline appointment controls had weak visible boundaries. The revised working surface
   separates controls, selected choices, progress, and the care summary.
3. The topics opening repeated its page title, while guidance and article hierarchy varied.
   The finder now says “Find a topic”; shared guide headings and article subheadings use a
   consistent scale and spacing.

This remains a practical hospital preview. Illustrative identities, service content and contact
details still require the existing hospital confirmation process before public release.
