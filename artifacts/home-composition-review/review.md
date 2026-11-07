# Browser verification of homepage composition recommendations

Reviewed 1 November 2026 against the local homepage, without changing application code.
Fresh Chromium inspection: 1440×900, 768×1024 and 390×844. Additional section
captures and geometry: 1920, 1440, 768 and 390px wide with 1000px-high viewports.
Full screenshot sheets, folds and selected section captures were opened and reviewed.
The extra 1920px check confirms the content frame stays at 1280px rather than growing
with the screen; composition choices must fit that frame.

## Verified assessment

| Area | Browser observation | Revised direction |
| --- | --- | --- |
| Hero/search | At 1440 the welcome photograph, headline and two side-by-side searches already read as one composition. Tablet stacks the image below the message. | Keep the desktop composition. Review the tablet transition and mobile sequence. Combining search modes is optional interaction redesign, not a demonstrated visual necessity. |
| Care navigator | Three choices already share a horizontal strip and one result area on desktop. | Refine selected-state connection and result hierarchy; retain the basic structure. |
| Health finder | Desktop already balances text and search with a single alphabet row below. Mobile alphabet wraps to four rows. | Keep desktop lookup composition. Optional mobile disclosure should be evaluated for browsing discoverability, not imposed for height alone. |
| Care in focus | Desktop has one image/copy feature paired with three service choices; mobile already uses a three-choice selector. | Retain the distinctive showcase composition and strengthen its image/copy relationship. Do not convert every section to cards. |
| Doctors | 1280px frame: introduction at left, six profiles in two columns/three rows at right; 104px-wide portraits. Section 708px tall at both desktop widths. | Put introduction/link above a full-width three-column/two-row collection with larger portraits and aligned specialty/language information. It is a presentation improvement; larger cards might preserve or increase height. Use two columns when three would squeeze names and languages. |
| Visit planning | Already FAQ left and arrival/contact right on desktop. Tablet stacks the two. Emergency information has its own emphasis. | Retain functional two-column composition; unify type and panel hierarchy. No evidence warrants a wholesale new layout. |
| Partners | Already a controlled horizontal logo row with View all. Uneven logo weight remains. | Improve optical logo sizing and grouping; no new slider needed. |
| Statistics | Four aligned desktop columns, two-by-two mobile. Contrasting teal field is an effective visual break. | Retain composition, align label/link hierarchy. Figures remain preview content. |
| Stories | Two alternating full-width image/quote rows, each about 553px high, produce a 1603px desktop section. | Highest priority: two stories beside one another as a coordinated collection. At the 1280px frame each gets about 628px: test image/text split at readable sizes; use image-above-text within each card if the split is cramped. No carousel necessary for the current two stories. More stories can justify manual navigation. Preserve expandable accounts and disclosures. |
| Consultation | A coherent desktop split already exists, but its encounter image repeats the mobile hero and featured news image. | Differentiate the section with a text-led editorial treatment and supporting image, preserving prompts. Image repetition is a more concrete issue than merely its dimensions. |
| News | Already a mosaic: one 672×667px feature next to two 584px-wide articles stacked vertically. Section 1141px tall. Tablet uses a wide feature over two articles. | High priority: three equal desktop editorial columns with shared crops, metadata order and aligned actions. Existing short titles/summaries are suitable for an equal-weight collection. No new filtering or carousel needed for three entries. Preserve mobile reading and links. |
| Footer | Already grouped desktop navigation and a deliberate large closing wordmark. | Retain desktop closing composition. Refine mobile hierarchy if needed; shrinking the brand is not required by this review. |

## Priorities

1. Stories: replace consecutive full-width presentations with a paired collection.
2. News: replace unequal mosaic with equal editorial columns.
3. Doctors: replace sidebar-plus-small-profile rows with a full-width portrait collection.

These are proposals, not browser-tested redesigns. No height reduction is promised
before rendering the alternatives. Preserve content, readable type and different
section purposes. Avoid applying the same card treatment to every section.

## Critique

ROUND 1 — existing page, review only
Seen in one second: a human care conversation with a clear appointment action.
Idea (one sentence): a whole-life welcome leads to care discovery and practical preparation.
Live thing: directory searches, navigator, health lookup and service selector.
Layout words by section: hero=cinematic / navigator=choice-strip / health=lookup /
care=showcase / doctors=sidebar-and-profile-grid / visit=FAQ-and-contact /
partners=logo-row / statistics=band / stories=alternating-features /
consultation=split / news=mosaic / footer=brand-and-navigation.
Scores: design 6.5 · usability 8 · creativity 6 · content 5 → overall 6.7.
Caps applied: category-level idea limits creativity; illustrative assets and preview
proof limit content credibility. This is a subjective design critique, not a usability study.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. browser/desktop-page-02.jpg: each story occupies a full-width presentation;
   compose both as one paired story collection.
2. news-1440.jpg: feature and supporting stories have inconsistent visual weight;
   use equal editorial columns for the current peer-level entries.
3. doctors-1440.jpg: small portraits and sidebar allocation weaken the team showcase;
   use a full-width portrait collection with shared heading above.

## Checks and limits

- Inspector: 0 FAIL, 3 WARN (type-size variety, no inline footage, partner side-scroll).
  These measurements do not certify design quality. The partner row has explicit controls;
  no authentic hospital footage was introduced. No source changes made for a review.
- Clicked doctor navigator, heart-care selection, visit FAQ and story expansion;
  each updated/opened as expected. This is a focused review, not a full regression suite.
- Measurements include section padding, headings, notices and content; item geometry
  is separately recorded in measurements.json. Whole page: 9818px at 1440, 9832px at
  1920, 10792px at 768, 12743px at 390 (capture height 1000).
- Existing direction retained (One motif, prior seed 238462439); no redraw or new assets.
  Reused preview photographs are illustrative; approved hospital imagery and claims remain pending.
