# Carrying the homepage direction into care pages

The established teal, cyan, Clash Grotesk and Lato direction continues across the
site. No new visual direction or random composition draw: this is an extension
of the approved homepage, using its existing assets and presentation tokens.

The organising idea: the route from a concern to a clinician to a prepared visit
becomes the page structure. Search, service links, selected doctor identity and
visit preparation remain the useful interactions.

## Page families

- Doctor directory: consultation image opening, immediately available search,
  filters and generous portrait entries. Keep query, pagination and recovery states.
- Service directory: open care overview, visible search and grouped service rows.
- Doctor profiles: large portrait and readable identity, followed by professional
  detail and appointment guidance. Preserve portrait-to-record assignments.
- Service details and visit information: image-led introductions, open editorial
  sections, alternating pale preparation chapters and accessible anchor navigation.
- Health topics: an open finder with full preparation content and care links.
- News: lead story followed by compact reading links; wide article imagery and
  a readable body with practical next steps.
- Appointment, feedback and emergency: clear type and measured spacing; all
  consequential instructions, disabled states and request semantics remain intact.

## Assets

Reuse local homepage specialty and arrival AVIF/WebP derivatives; do not add
reference-site imagery. Provenance and replacement limitations are recorded in
`apps/web/public/editorial/HOME-ENHANCEMENT.txt`. Clinician portraits continue to
use explicit record identifiers. No new hospital claims or stock statistics.

## Verification and visual review

Evidence and final review will be recorded alongside the implementation.

## Review record

Baseline: `evidence/inner-pages/before/` (12 routes at 1440, 768, 390 and
320 CSS pixels; screenshots at the first three widths). Final responsive matrix:
`evidence/inner-pages/after/checks.json` (13 routes, including a topic detail,
52 checks). No missing titles, broken loaded images or horizontal overflow.
The opening compositions and full-page inspector sheets were visually reviewed.

### ROUND 1

Seen in one second: care directories are recognisable, but the old teal panels
and tiny portraits do not carry the homepage's open image language.
Idea (one sentence): the concern-to-care-to-visit journey becomes the page structure.
Live thing: search, filters, profile handoffs and a printable visit checklist.
Layout words by section: directory=panel/search/compact rows; visit=text/paired
columns; news=repeated contained rows.
Scores: design 6 · usability 7.5 · creativity 5 · content 6.5 → overall 6.3.
Caps applied: familiar category composition; existing concept content.
Top three problems:
1. `before/doctors-1440.jpg`: empty right side of the introduction; add an existing
   consultation scene and open the typography.
2. `before/doctors-768.jpg`: portraits are recognition thumbnails; give identity
   a meaningful share of each result while preserving record assignments.
3. `before/patients-visitors-1440.jpg`: repeated text columns; introduce arrival
   imagery and separate preparation chapters with tone and scale.

### ROUND 2

Seen in one second: the same hospital, with clearer care pathways and warm imagery.
Idea (one sentence): care search and visit preparation carry the shared visual system.
Live thing: unchanged native directory forms and checklist, with enhanced entrances.
Layout words by section: directory=image pair/open search/portrait rows; visit=
arrival pair/open chapters/pale checklist; news=lead feature/two-column reading.
Scores: design 7 · usability 8 · creativity 6 · content 7 → overall 7.1.
Caps applied: concept imagery and a familiar care-site composition.
Top three problems:
1. Visitor guide's supporting chapters still lack visual variation; use existing
   specialty scenes at preparation, consultation and going home, loaded lazily.
2. Long doctor names repeat in every action; shorten visible labels, retaining
   doctor-specific accessible names beginning with the visible label text.
3. Intro copy is small beside the display title; introduce the central 18px
   `--site-page-intro` role.

### ROUND 3

Seen in one second: clear titles, accessible actions and an intentional sequence
of imagery, open lists and practical information.
Idea (one sentence): care choices and preparation become the organising structure.
Live thing: search and filter, select a clinician, prepare and print a visit checklist.
Layout words by section: directory=editorial opening/search/portrait list/compact help;
profile=portrait/identity/editorial details/request rail; visit=illustrated arrival/
preparation image/checklist/consultation/access/going home; news=lead feature/
reading grid/wide article/body/next step.
Scores: design 7.5 · usability 8 · creativity 6 · content 7 → overall 7.3.
Caps applied: creativity limited by familiar category language and reused imagery.
Top three remaining limitations:
1. Existing concept photographs and illustrations repeat across pages. Authentic
   approved hospital imagery would make the design more distinctive.
2. Directory controls and the shared shell retain multiple established text sizes;
   preserve their hierarchy in this pass instead of changing every control.
3. Physical-phone and Safari testing remains outstanding.

Final inspector reports: `evidence/inner-pages/inspection/`. All three reviewed
families have zero FAILs. The no-footage warning is intentional: the hospital film
belongs to the homepage; directory and visit tasks do not need another autoplay
video. News has 11 measured moving elements; additional animation would not aid
reading. Directory font-size count reflects the existing shell/control hierarchy.
An initial measured margin warning disappeared after tightening the help section;
actual directory frames also have equal left and right gutters.

The last screenshot pass caught a broad support selector also matching the child
`ds-support-actions` class. Restricting it to section elements removed that excess
padding and preserved compact actions.

## Checks run

- Production Next.js build, including TypeScript; focused ESLint; `git diff --check`.
- Clinician directory (18 cases), service directory (22), clinician profile (30),
  appointment page (20), emergency (52), shell and patient-guide contracts.
- Care-journey, health-finder and homepage-enhancement contracts.
- Existing Chromium care-journey smoke: 12 topic routes, missing route, three
  widths, aliases, missing relationships, home-to-topic-to-appointment handoff,
  follow-up review, checklist, printing, reduced motion and no-JavaScript reading.
- Built asset budgets: all ten templates pass; homepage initial JavaScript remains
  153,450 compressed bytes. Added imagery uses existing local AVIF/WebP derivatives.

No dependencies, API, database, CMS or publishing changes.

Additional final checks are in `evidence/inner-pages/after/final-checks.json`:
1024px layouts, short 390×568 phone screens, equal directory gutters, six routes
at a 720×450 CSS viewport (the reflow equivalent of 200% zoom on a 1440px
screen), reduced-motion visibility, and a forced portrait-load failure with the
initials fallback. The failure test waits for hydration and triggers an actual
missing-image request; an earlier network-blocking attempt did not reliably
exercise the lazy-loaded portrait. No application fallback change was needed.

Final browser inspection score is 7.3/10 by the critique above. This pass makes
the pages consistent and usable; authentic imagery and reviewed content remain
the main route to a more distinctive final presentation.
