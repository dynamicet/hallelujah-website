# Accessibility and Validation Checklist

This checklist turns the [cross-template test matrix](../../ux/page-specifications.md#cross-template-test-matrix), design-system contracts, and Order 11 findings into implementation evidence. Checkmarks below describe required work, not work already performed on future production code. The [Order 11 record](../qa/order-11-design-motion-qa.md) is the prototype regression baseline.

## Every pull request

- [ ] Requirement IDs, applicable `BM-*` IDs/dispositions, page/section IDs, supported states, languages, and evidence destination are named.
- [ ] Semantic HTML exposes one main region, sensible landmarks, a logical heading hierarchy, descriptive link/button names, and valid labels/descriptions.
- [ ] DOM order is meaningful without CSS and remains the reading/focus order at every breakpoint.
- [ ] All behavior is keyboard operable; focus is visible, unobscured, and restored after compact menu/filter dismissal.
- [ ] New controls have at least a 44 × 44 CSS px target and adequate separation at 320 CSS px.
- [ ] Text meets 4.5:1 and large text/meaningful boundaries/focus meet 3:1 in every applicable state; meaning never depends on color alone.
- [ ] English, Amharic, mixed-script, long-content, and unavailable-equivalent fixtures wrap without truncating consequential text.
- [ ] The page has no two-dimensional scrolling at 320 CSS px or the tested 400% reflow equivalent.
- [ ] Reduced motion preserves content, focus, status, and outcome through an intentional static/direct composition; Level 3/4 ambience never starts implicitly.
- [ ] Every motion treatment records its purpose, level, trigger, duration, animated properties, fallback, cleanup, and eligible/protected contexts; content is never stranded invisible before JavaScript or an observer.
- [ ] Essential content and recovery remain usable without JavaScript, images, custom fonts, optional embeds, analytics, or a failed third party.
- [ ] Loading, empty, error, offline, unavailable/expired, validation, and success states use accurate words and an appropriate next action.
- [ ] No controlled fixture, unapproved record, personal data, secret, internal ID, or consequential state enters a URL, log, snapshot, or analytics event.

## Forms and asynchronous behavior

- [ ] Instructions, required/optional status, format hints, and privacy purpose appear before collection.
- [ ] Client validation improves feedback but the server remains authoritative and returns field-linked errors.
- [ ] Error summary receives focus after a failed submit, links to each invalid field, and valid values remain intact.
- [ ] `aria-invalid`, descriptions, status announcements, and busy state are used only while true; announcements are concise and not duplicated.
- [ ] Pending prevents duplicate activation without hiding status or navigation; refresh and Back/Forward behavior are defined.
- [ ] Idempotency and reconciliation distinguish known failure from unknown outcome. Retry is offered only when safe.
- [ ] Only an authoritative accepted response is styled/announced as success. Delivery warning preserves the accepted reference and does not invite resubmission.
- [ ] With JavaScript disabled or the workflow unavailable, collection fails closed before personal data is submitted to an unapproved destination.

## Emergency, search, records, and third parties

- [ ] Emergency/public route distinction is understood before the first deliberate call choice; the entire page remains Level 0 motion.
- [ ] Call targets are purpose-labeled and use only the approved canonical record; moved touch/scroll cannot activate a call.
- [ ] Text directions remain complete without the map. Map/provider failure does not block arrival information.
- [ ] Search labels its navigational scope, warns against sensitive input, preserves explicit wording/corrections, and never diagnoses or estimates urgency.
- [ ] Directories and detail pages expose only approved current canonical records; retirement/expiry removes them from related lists, search, and sitemaps.
- [ ] Every optional third party is blocked by default, user-initiated where appropriate, privacy/security reviewed, and tested unavailable.
- [ ] Interactive video starts from a complete poster, makes zero media request before activation, retains focus on persistent Play/Pause/Stop/Close controls, and preserves stable geometry/contrast in playing, paused, ended, failure, reduced-motion, and compact states.
- [ ] Background/ambient media is silent and carries no unique meaning; informative media has approved captions/transcript and a recorded audio-description decision.

## CI evidence

- [ ] HTML/DOM validation and local-reference checks pass.
- [ ] Automated accessibility rules run against every template and key state with no untriaged serious/critical defect.
- [ ] Keyboard tests cover skip link, header/menu, language, search/filter/pagination, disclosure, form validation, recovery, and focus return.
- [ ] Visual/geometry tests cover 320, 360, representative tablet, 1280, 1440, 200% and 400% reflow-equivalent conditions.
- [ ] Contrast tests sample text, boundaries, icons, focus, hover, pressed, disabled, error, warning, and success states; manual review covers gradients/images/anti-aliasing exclusions.
- [ ] No-JavaScript, blocked-image/font, offline/timeout, Save-Data, reduced-motion, forced-color, and optional-provider-failure cases pass.
- [ ] Production asset/report checks enforce the approved compressed transfer, first-party JavaScript, and request budgets.
- [ ] Performance evidence reports poster, motion/runtime, and activated-media bytes/requests separately and traces selected Level 2–4 treatments for long tasks, cleanup, layout shift, and off-screen work.
- [ ] Security tests cover validation/encoding, CSRF, authorization, rate/abuse controls, headers/CSP, caching/referrers, secrets, dependency/configuration risks, and logging redaction.

## Human and device evidence before release

- [ ] Named professional Amharic and clinical reviewers approve meaning and parity for the included route/string inventory.
- [ ] Human screen-reader journeys pass using the `DEL-01` browser/OS/AT pairings.
- [ ] Manual 200% and 400% browser zoom passes without lost content, focus obstruction, or two-dimensional page scrolling.
- [ ] Windows High Contrast/forced-colors review passes on the agreed environment.
- [ ] Physical touch devices confirm target accuracy, OS gestures, emergency deliberate activation, and dialer behavior.
- [ ] Firefox and WebKit/Safari parity passes for complete critical journeys and important failure states.
- [ ] Agreed low-end hardware and constrained network pass compressed production budgets; field monitoring captures template-level Core Web Vitals.
- [ ] Patient/visitor participants, including low-health-literacy and relevant disability perspectives, complete the scenario walkthroughs with recorded comprehension evidence.
- [ ] Clinical, operations, privacy/security, content, language, and delivery owners sign their applicable decision/evidence records.

## Evidence record format

For each result record: requirement ID; decision ID if gated; applicable benchmark ID/disposition and implementation state; route/template; section/state; build/commit; environment; browser/OS/AT/device; viewport/zoom/language/motion/network; method; expected and actual result; pass/fail; tester; date; durable artifact link; defect/exception; retest status. Use the [implementation acceptance matrix](../../validation/implementation-acceptance-matrix.md#9-benchmark-incorporation-and-implementation-evidence) for benchmark evidence and platform/test-tier rules.

A screenshot alone does not prove keyboard, announcement, comprehension, timing, touch, operational accuracy, or security. Keep machine output for automation and a signed narrative for human/owner decisions.
