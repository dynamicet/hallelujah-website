# Order 11 Design and Motion QA Record

**Decision:** Complete for performed non-public prototype QA  
**Date:** 12 September 2026  
**Primary environment:** Chromium 152.0.7977.64, headless Linux, DevTools Protocol  
**Secondary-browser attempt:** Firefox 153.0.4 headless; rendering evidence could not be produced in this environment

## 1. Scope and guardrails

The pass consumed the Order 9 refined page set, Order 10 connected prototype, foundation and component tokens, motion contracts, accepted wireframes, requirements matrix, and validation gates. It covers the 12 page studies, three state boards, and the connected journey map.

The work does not activate any hospital contact, dialer, map, appointment operation, search service, analytics, recruitment provider, personal-data flow, third party, clinical fact, translation, or public record. Controlled fixtures and the persistent non-public identity remain mandatory.

The `ui-ux-pro-max` accessibility and interaction priorities informed the audit order: accessibility and touch first, then performance, responsive layout, typography/color, motion, forms, and navigation. Project requirements and safety gates remained authoritative.

## 2. Performed methods

| Area | Performed method | Result |
| --- | --- | --- |
| Semantics | DOM checks for one main/H1, title/language, skip target, duplicate IDs, broken ID references, heading jumps, accessible control/image names, positive tabindex, prohibited URL schemes, prototype identity, and external resources | 16/16 artifacts passed |
| Screen-reader structure | Chromium accessibility-tree inspection for named root, main landmark, headings, navigation, and named controls | 16/16 passed; not a human screen-reader session |
| Contrast | Computed foreground versus nearest solid background for visible direct text, with 4.5:1 normal and 3:1 large-text thresholds | 16/16 passed; lowest sample 5.1:1 |
| Keyboard and focus | Trusted CDP `Tab`, `Enter`, and `Escape` events; skip-link focus/activation on every artifact; compact menu/filter focus return; appointment error-summary and linked-field correction | All assertions passed |
| States | Loading, no-match, failure, offline, and unavailable simulations on Doctor, Services, and Search | 15/15 passed |
| Bilingual stress | Amharic geometry, mixed script, long content, and unavailable-translation fixtures | 60/60 passed at 320 CSS px; meaning not assessed |
| Forced colors | Chromium `forced-colors: active` emulation at 320 and 1280 CSS px with focus and border checks | 6/6 passed |
| Touch and emergency safety | Emulated deliberate tap and moved scroll gesture on an inert Emergency action; checked for navigation and `tel:`/`mailto:` activation | Passed; no physical device/dialer |
| Zoom/reflow | 640 CSS px at device scale 2 and 320 CSS px at device scale 4, all 16 artifacts | 32/32 passed; not manual browser UI zoom |
| No JavaScript | Script execution disabled; essential main content retained; all prototype forms inert and visibly fail closed | 16/16 passed |
| Motion | Standard Home timing/property review, zero Emergency motion, forced reduced motion, and Save-Data override | Passed |
| Constrained profile | Local HTTP, cache disabled, 6× CPU throttle, 400 ms latency, 400 kbps throughput, 360 CSS px | Usable; CLS 0; no >50 ms long task; menu round trip 66 ms |
| Budgets | Initial Home document and dependency file count/sizes | 9 requests; 120,920 bytes total and 41,515 JavaScript bytes, uncompressed |

## 3. Findings and corrections

| ID | Finding | Correction | Final status |
| --- | --- | --- | --- |
| `Q11-F01` | With JavaScript disabled, local prototype search and appointment forms could still attempt native navigation/submission despite the inert-prototype boundary. | Added the HTML `inert` baseline to every `.demo-form`, removed it only from the existing local study enhancement, and exposed a visible no-JavaScript fail-closed message. | Resolved; 16/16 no-JavaScript cases passed |
| `Q11-F02` | The Home orientation/card treatment respected reduced motion but did not consume the documented Save-Data conservation signal. | Added one `data-prototype-conserve` state for Save-Data, initially hidden documents, hidden transitions, and bfcache restoration; disabled both orientation and connected-card motion in that state. | Resolved; Save-Data produced zero animations |
| `Q11-F03` | Loading `prototype.js` after the window `load` event inserted the reviewer toolbar late and produced CLS 0.323 in the first constrained run. | Loaded the shared prototype layer directly after the fixture layer in parser order on all 15 page/state artifacts; removed the late loader from the three study scripts. | Resolved; final constrained CLS was 0 |
| `Q11-F04` | The initial broad target-size query counted native radio/checkbox indicators separately from their 44 × 44 `.choice` labels. | Aligned the runner with the component contract and Order 9/10 method: audit the padded choice label rather than the native indicator. | Harness corrected; 32/32 reflow cases passed |

No final automated contrast, semantics, target, overflow, focus, state, reduced-motion, or emergency-activation defect remained in the performed Chromium scope.

## 4. Motion result

Home exposed the already-sized 240 ms orientation rule and five 200 ms task-card translations with 4 px travel and a maximum 120 ms stagger. This remains inside the 300 ms duration, 12 px travel, six-item sequence, and 150 ms sequence-delay limits. Emergency exposed no animation. Forced reduced motion changed all observed durations to 0 ms. Save-Data removed the orientation and task-card animations entirely.

The animation API reports the resolved effect easing as linear because the CSS easing is applied at keyframe-animation level; the authored token remains `cubic-bezier(0.2, 0.8, 0.2, 1)` in the source. No layout property, scroll listener, animation library, or delayed navigation was introduced.

## 5. Performance interpretation

The constrained local-HTTP run deliberately served uncompressed files at 400 kbps and recorded LCP at 3.508 s, so it does **not** close the production or field `G-008` LCP ≤2.5 s gate. It does show that the page remained usable, incurred zero CLS after `Q11-F03`, produced no long task over 50 ms, used no third party, and responded to the tested menu interaction in 66 ms.

The asset budget is comfortably inside `G-009` even when measured uncompressed, but production handoff must bundle/compress delivery, agree the device/network profile under `DEL-01`, test representative templates in the release architecture, and collect field data before claiming the LCP/INP/CLS requirement.

## 6. Cross-browser and human/device limitations

- Firefox 153.0.4 was present. Three headless screenshot attempts, including an isolated profile and software-rendering retry, failed with `RenderCompositorSWGL failed mapping default framebuffer`; no Firefox visual evidence was generated. Firefox and WebKit parity remain unproven.
- The Chromium accessibility tree was inspected, but NVDA, JAWS, VoiceOver, TalkBack, and a human screen-reader walkthrough were not available. Announcement wording and reading experience remain unproven.
- Forced colors were emulated; a Windows High Contrast user session was not performed.
- Touch events were emulated; physical target accuracy, OS gesture behavior, and a dialer were not tested. Live numbers remain gated and no `tel:` URL exists.
- CSS viewport/device-scale equivalents were tested; browser UI zoom controls were not operated manually.
- Amharic fixtures tested geometry only. Professional meaning, tone, emergency comprehension, pronunciation, and hospital approval remain open.
- The 6× CPU profile is an indicative desktop emulation, not low-end Android hardware evidence.
- No human comprehension, low-health-literacy, clinical, operational, privacy, or content-owner session was performed.

These limitations are not prototype regressions. They are explicit inputs to Order 12 handoff, the four formal stakeholder sessions, and release-environment validation.

## 7. Regression result

- Order 11: 17/17 automated assertions passed.
- Order 10: 19/19 interaction assertions and 45/45 geometry cases passed after the fixes.
- Order 9: 525/525 responsive/bilingual cases passed after the fixes.

The prototype remains suitable for non-public stakeholder review and Order 12 developer handoff preparation. It is not publication-ready.

