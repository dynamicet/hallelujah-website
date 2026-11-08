# Contact & directions

## Dedicated Contact page — 8 November 2026

The connected local demo now includes `/contact`, linked from the homepage contact
section, desktop utility navigation, mobile menu, footer and About page. The home
section retains its direct telephone and directions actions and existing fragment
targets. The page uses the same `hospitalContact` facts and shared static map;
it adds visit-confirmation and access-planning guidance without asserting opening
hours or facilities. It remains behind `requireLocalDemo()`.

The composition borrows the clarity of a destination guide: Gotera's published
hospital pin becomes the visual anchor, beside reception telephone and email rows.
Arrival advice follows in two quiet bands, with a separate emergency link. Existing
brand typography and colours are retained. Decorative photography, footage and
entrance animation were omitted to keep this utility page focused on contacting
the hospital and finding it. No new contact facts, external embed, message form,
or delivery service was introduced.

Current validation: TypeScript, changed-file ESLint, home-contact contracts (134
cases), shell contracts and diff whitespace checks pass. Fresh repository responsive
checks pass for `/contact`, `/` and `/about` at 390/768/1440px. Those screenshots
were opened and inspected; the new homepage link was also inspected in focused
captures at each width. Evidence is in
`artifacts/visual-checks/2026-11-08T20-19-15.726Z-responsive-X54Z8P/`.

Focused Chromium checks pass at 320/390/768/1440px for the homepage-to-contact
keyboard journey, skip-link focus, visible phone-link focus, native action targets,
44px link heights, reduced motion, mobile menu availability and browser errors.
Phone and directions anchors also pass without JavaScript. Evidence is in
`artifacts/visual-checks/2026-11-08T20-21-19.602Z-contact-journey-WHK9KU/`;
the local reproduction script is `.taste-skill/check-contact-page.mjs`.
No telephone call or email was sent.

The design source lint has zero failures and one warning for the forced-colours
border. The whole-page design inspector is not a pass: it flags the existing Help
button shadow, the single content image and limited motion, alongside warnings
about shared typography, palette, footer and sizing. Its output is retained at
`.taste-skill/contact-page/`. This utility-page review does not certify broader
accessibility, physical telephone handoff or production release readiness.

The client authorized sourcing hospital contact and location facts from the old website
and Google on 4 November 2026, with newly written supporting content. This applies to
the connected local demo. It does not publish the site or activate appointment submission.

## Sources checked on 4 November 2026

- https://hallelujahhospital.com/contact/ publishes +251-114-704242,
  +251-114-704244, +251-965-407886, +251-945-211206, info@hallelujahhospital.com,
  and “Around Gotera Condominium, Addis Ababa, Ethiopia”. The section uses the two
  landlines, formatted for readability. These are source-checked, not test-called.
- The same page links https://maps.app.goo.gl/VQMCJFfeZX1MtXUN7. Its redirect resolves
  to Hallelujah General Hospital, Google feature 0x164b84476b889cf5:0x7e35d2461e5f4332,
  pin 8.9861882,38.7590401. Directions use this pin with the documented Google Maps
  URLs API: https://developers.google.com/maps/documentation/urls/get-started.
- The old website header’s +251 912 345 678 is excluded because it conflicts with
  the explicit contact list and appears to be sample data.

## Composition and copy

One pale blue section leads with the address and directions action, followed by a
static map of the Gotera neighborhood. A compact contact column sits beside it on
desktop and follows it on mobile. The call action remains above the map on mobile.
Arrival guidance and the emergency route share a quiet supporting row. Visit
preparation remains in the preceding accordion section.

The map is served locally as `/maps/gotera-location.webp`; it does not load an
external map or capture scrolling. Visible attribution links to OpenStreetMap.
The marker identifies the published location pin, not a particular entrance.
See [the map asset record](../visual-design/gotera-map-asset.md) for sources and geometry.

Supporting prose is newly written. It asks visitors to confirm their department,
entrance, parking, drop-off and access needs. It does not claim that a particular
entrance, facility, opening schedule, response time, or parking arrangement exists.
Emergency information remains a separate route; see the 8 November refinement below.
The shared header now links to that route instead of showing the mock 1234 hotline.

## Emergency refinement — 8 November 2026

Following the client's approval of the emergency comparison, the connected local demo's
default `/emergency` page now uses `WebsiteEmergencyPage`. It leads with one telephone
link for emergency and ambulance enquiries, followed immediately by the published
hospital location and directions. A native disclosure holds call-preparation questions;
reception is clearly separate. A fixed mobile call link reserves space through the footer.
The floating Help control and its header launchers are omitted on this page.

The legacy emergency page, https://hallelujahhospital.com/emergency/, was checked again
on 8 November. Its ambulance, emergency and footer sections consistently list
`+251-940-105692`, normalized to `tel:+251940105692` and displayed as
`+251 940 105 692`. This is a source-checked published contact, not a test-called or
hospital-approved dispatch record. The conflicting sample-like header number remains
excluded. The page makes no promise about staffing, hours, response times, transport
equipment or accessible facilities. Directions identify the existing published hospital
pin; visitors are asked to confirm the emergency entrance and access arrangements.
No public-service number or unreviewed emergency translation has been introduced.

The route still requires `requireLocalDemo()`. Explicit unavailable, expired, map-failure
and unsupported-handoff scenarios retain the controlled `EmergencyTemplate` and its
synthetic boundaries. This refinement does not change the governed template, its
fixtures, lifecycle validation or public-release approval requirements.

Refinement validation: TypeScript, changed-file ESLint, emergency template contracts
(52 cases), shell contracts and diff whitespace checks pass. Fresh responsive captures
for default/unavailable routes pass at 390/768/1440px and were visually inspected.
Focused Chromium checks also pass at 320/390/768/1440px for phone parity, first-screen
call visibility, keyboard disclosure/focus, reduced motion and mobile footer clearance.
Phone links, directions and native disclosure are available without JavaScript.
This is not a physical dialer test or a screen-reader accessibility certification.

## Validation

TypeScript, changed-file ESLint, patient-guide checks, homepage enhancement checks,
design source lint and diff whitespace checks pass. Focused Chromium checks pass at
1440, 768, 390 and 320px: no horizontal overflow, at most two lines per section
heading, 44px link targets, one target per anchor, correct call/email/Maps links,
visible keyboard focus, working visit accordions, and no Google resource requests
on page load. Contact facts and actions remain available without JavaScript.
Visitor and emergency routes respond successfully. Captures are in
`.taste-skill/contact-final/`; the reproduction script is
`.taste-skill/contact-review-focused.mjs`.

The whole-page design inspector also ran. Its failures concern the existing story
eyebrows and the page-wide motion count, outside this section. This is not a claim
that the whole site passes that rubric. No phone call or email was sent.

```text
ROUND 2 — contact section only
Seen in one second: contact number on the left, destination on the right.
Idea (one sentence): Hallelujah’s published Gotera location becomes a practical arrival destination.
Live thing: direct calling and Google Maps directions.
Layout words by section: contact=open columns / preparation=FAQ split.
Scores: design 7.5 · usability 8 · creativity 6 · content 8 → overall 7.4
Caps applied: section review; page-wide photography and motion criteria do not apply to this utility section.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. First-pass tablet was unnecessarily tall (contact-after/768-contact.jpg). Retain two columns at 768px.
2. Default h4 margins inflated the arrival advice block (contact-after/1440-contact.jpg). Reset margins.
3. Contact information had excess vertical gaps on mobile (contact-after/390-contact.jpg). Tighten phone and secondary-contact spacing.
Final screenshots: contact-final/{1440,768,390,320}-section.jpg, all visually reviewed.
Remaining limitation: written turn-by-turn arrival instructions and access facilities await reliable source information.
```
