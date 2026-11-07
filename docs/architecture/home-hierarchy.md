# Home Hierarchy

**Authority:** B03-004, H-001/H-002 and the approved motion/media amendment.
**Boundary:** Controlled development; hospital publication and collection remain disabled.

`HomeTemplate` is a server composition exported from the template public API. It receives
presentation copy, seven task links, shell props and an optional media presentation with
hero/story placement. The consuming adapter owns approved content, destinations and availability;
the template fetches no records and makes no approval or publication decision.

The source order is H1 introduction, native Appointment/Doctor actions and a separately styled
Emergency action; H2 Doctor/Service/Appointment/Call/Directions links; H3 search entry;
then optional H8 media. Hero media, when supplied, follows H1's complete text and actions.
Missing media creates no empty H8 section. B03-005 supplies separately governed contact content.
B03-006 adds H4 services, H5 clinicians and H8 institutional evidence only when explicit feature
IDs resolve through existing current, approved governed projections. No ranking, inference or
fallback selection occurs; an ineligible or empty result removes the whole optional section and
its spacing.

One decorative Level 3 accent has its own `ExperienceRegion`; no task or unavailable meaning
is a child of that region. The existing first-party motion script supplies once-only enhancement,
reduced-motion/Save-Data selection and restored-page cleanup. `OptInMedia` supplies the reserved
written-still plane, explicit playback controls, deferred source/captions and failure fallback.
No runtime or authentic asset is selected by this composition.

Home's colocated media rule reserves Stop's hidden footprint. The focused mobile test initially
found a 52 px activation shift; after the correction, both frame height and H2 task position
remain identical between poster and playing. The no-JavaScript media variant retains a complete
written still/transcript and an explicit playback-availability explanation.

| Motion / media area | Trigger / level | Properties / fallback / cleanup |
| --- | --- | --- |
| Task actions, emergency and unavailable meaning | Native activation / Level 0 | Immediate navigation/focus; never inside an expressive region |
| Isolated hero accent | First usable paint / Level 3 | Tokenized cinematic duration/easing/distance, transform/opacity only, once; static under reduced-motion/Save-Data/no-JS; restored/hidden-page suppression |
| Optional hero/story test film | Explicit Play / Level 4 | Deferred first-party video/caption source; reserved written still; Play/Pause/Stop/end/failure; source/caption cleanup and poster on route exit |

`apps/web/scripts/lib/home-preview-server.mjs` owns an isolated loopback HTTP specimen. It renders
the real React template using a review-only TypeScript/CSS Module adapter, the generated token
stylesheet, global document rules and actual component styles. It serves only allowlisted local
scripts/test media and rejects query state, non-loopback hosts and write methods. Its draft links
lead to local withheld-state sections. A restrictive CSP, no-store and noindex headers retain
the review boundary. No application import can reach that tool or its synthetic fixture data;
the existing content-build checks inspect deployment imports, traces and payloads independently.

The adapter's class names differ from Next's generated class names; style declarations and
React component implementations are the same source. Browser results therefore establish
composition behavior in isolated T0, not deployed Home performance, real destination availability,
physical-device/assistive-technology acceptance or professional language approval. Those return
at their route, DEL-01 and production gates.

## Canonical contact integration — B03-005

`HomeContactTemplate` composes `HomeTemplate` with H9 contact information. Its `documents`,
`locale`, `now` and optional `controlled-fixture` mode feed `homeContactView`; the template
fetches no records or providers and mounts no application route. A validated complete document
set must contain exactly one non-retired settings record. Its synthetic publication must retain
independent operations review, approval and post-publication verification; record and individual
fact dates are checked on every render. Real/default, ambiguous, missing, partially translated,
unverified, stale and retired input produces only withheld explanations.

Emergency contact, enquiry contact and arrival text have distinct stable local section IDs.
Each displayed purpose/value pair comes from canonical settings; `publicPhone` retains its
enquiry purpose and is never replaced by an emergency, switchboard or ambulance value.
The internal projection checks canonical phone/email targets, but the controlled preview emits
only local anchors and synthetic text. All sections remain Level 0 without a client runtime.
English headings/explanations are marked explicitly; Amharic data is a labeled shaping fixture.

There is no contact projection cache. Changing the supplied settings document replaces rendered
facts immediately, and the existing `discoveryInvalidation` safety path includes `/`, `/am/`
and `canonical-contacts` for the future route consumer. Loopback responses use `no-store`.
This establishes controlled invalidation coverage, not a deployed Home cache or live call flow.
The [execution brief](../backlog/b03-005-home-canonical-contacts.md) and
[evidence](../backlog/evidence/B03-005-home-canonical-contacts-2026-09-19.md) retain the remaining
hospital, physical-device/AT, language, production and publication boundaries.

## Governed optional content — B03-006

`controlledHomeGovernedView` accepts bounded explicit feature IDs, governed care records,
approved care relationships and institutional workflow documents. It consumes
`controlledCareGraph` and `controlledInstitutionalView` rather than recreating their approval,
relationship or lifecycle logic. Its default/public mode is empty; only the visibly synthetic
controlled-fixture mode can render during this execution stage.

H4 and H5 use the shared `GovernedCard` with canonical paths produced by the clinician/service
projections. The review-only card mode permits these same-origin canonical paths but the loopback
server does not mount them. Each care card requires an approved relationship, so a generic record
relationship or an independently valid but unassociated record cannot become a Home feature.
H8 exposes only the already-reviewed body, evidence date and limitations; it does not infer a
statistic, partner meaning, leadership identity, technology claim or superlative.

Selections contain at most three unique stable public IDs per section and retain their explicit
order. Invalid selection metadata empties only the affected section. Draft, not-yet-effective,
review-due, expired, withdrawn, missing-language, invalid-set, stale-relationship and missing
selection outcomes emit no optional heading, placeholder or layout container. Projection occurs
on every server render; no Home-specific record cache is introduced. The
[execution brief](../backlog/b03-006-home-governed-omissions.md) and
[evidence](../backlog/evidence/B03-006-home-governed-omissions-2026-09-19.md) retain the authentic
care/institutional, language, route, production and publication gates.

## Public local-preview composition — November 2026

The ready local preview uses `src/website/home.tsx`; the governed template and its
omission contracts above remain independent. The preview now follows this order:
opening and unified care search → health-topic finder → specialty explorer → three
featured clinician identities → human-care image, figures and two native story
disclosures → visit preparation and arrival → partners → editorial lead and two
links → shared teal footer. There is no separate navigator or homepage film trigger.

`CareSearch` defaults to the doctor directory, retains one query when changing the
Doctor/Service select, and submits native GET `q` requests. Its no-JavaScript
fallback also supplies a service GET form. Help choosing care opens the existing
patient guide and returns keyboard focus to its original launcher. Guide code is
loaded on request; appointment simulation code belongs to the appointment route.
The controller's request/state behavior is unchanged.

`CareSpotlight` owns only internal specialty presentation records: stable image ID,
label, short explanation and existing service-query destination. Selection updates
copy, destination and `aria-pressed` immediately; overlapping, dimension-reserved
pictures crossfade for 350ms. No-JavaScript links expose all three destinations.
Clinician IDs, portrait assignments, canonical profiles and appointment IDs are
unchanged. Only the first three portraits are featured on the homepage.

`HomeScenes` scopes its scroll listener and animation-frame cleanup to the mounted
homepage. Hero image scale follows its exit from 1 to 1.06. On desktop, the human-care
image scales from .9 to 1 in a sticky 180vh section filled by the image throughout
its hold. Smaller screens, reduced motion and no JavaScript use the settled image.
Entrances use IntersectionObserver and CSS animations controlled and cancelled
through the Web Animations API: 16px text/24px image travel, 700ms, 80ms stagger.
Preference changes and route unmounts cancel active effects. Essential actions
have no entrance gate. Native story/visit disclosures remain usable without script.

Homepage geometry is scoped under `.enhanced-home` in `home-enhancement.css`; it
uses the shared palette/font tokens and 64/32/20px gutters. Shared header changes
keep a solid main navigation visible while the measured utility row scrolls out.
Native mobile popover behavior, emergency information and language availability
remain intact. The footer's principal care action now uses the appointment route
when the supplied navigation includes it.

Run `pnpm home-enhancement:check` for the new SSR/search/asset contract, alongside
existing home, contact, governed, search, shell, care-journey and patient-guide checks.
See [visual review and asset notes](../visual-design/home-enhancement.md) for evidence,
asset provenance and remaining limitations.
