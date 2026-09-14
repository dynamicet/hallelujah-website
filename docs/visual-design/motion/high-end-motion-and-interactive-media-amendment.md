# High-End Motion and Interactive-Media Amendment

**Directed:** 14 September 2026, Africa/Addis_Ababa
**Authority for this controlled-design boundary:** Client workspace identity `befikadusata` directing Codex; named Product, Brand, Accessibility, Content, Privacy, and Delivery acceptance remains required before production
**Status:** Approved direction for production planning; implementation, authentic assets, and performed validation remain open
**Amends:** `VD-05`, `VD-17`, `G-012`, `H-002`, the Order 3 prototype motion ceiling, and the Home `H1` media treatment
**Does not change:** route or section order, emergency separation, appointment semantics, publication/collection authority, content approval, or third-party activation

## 1. Senior UI/UX architecture review

The client requirement for a high-end, motion-rich experience is compatible with Calm Wayfinding when motion is choreographed as a progressive layer rather than used to conceal, reorder, or delay the service interface.

The review accepts these recommendations:

- pursue a premium visual and interaction standard across the site rather than treating constrained connectivity as the default aesthetic;
- concentrate expressive motion in a small number of authored moments instead of applying identical reveal effects to every section;
- keep safety, form truth, clinical/operational facts, focus, and recovery stable while allowing richer storytelling around them;
- allow authentic medical, staff-at-work, facility, and Addis Ababa wayfinding imagery as foreground or background atmosphere after rights, consent, authenticity, crop, and claim review;
- allow a static-first, user-initiated video in the Home hero when footage and testing justify that placement, with a prominent institutional-story placement after essential tasks as the preferred alternative when the footage competes with care access;
- make reduced-motion, Save-Data, no-JavaScript, media-failure, and constrained-device treatments intentional compositions, not broken copies of the premium mode.

The review rejects these interpretations of “high-end”:

- autoplaying video or audio, endless decorative loops without a nearby stop control, or downloading cinematic media before user intent;
- hiding headings, actions, facts, or recovery behind a timeline, observer, preloader, media request, or animation library;
- page transitions that delay navigation, scroll-jacking, mandatory pinned stories, large-field rotation/zoom, generic reveal effects on every section, custom cursors, or pointer-only affordances;
- moving Emergency, urgent guidance, errors, privacy/consent, appointment outcome meaning, schedules, availability, clinical claims, or review/expiry status into view as spectacle;
- generic stock or synthetic medical scenes that imply real staff, facilities, capability, availability, technology, or outcomes.

High-end design comes from choreography and restraint: clear staging, spatial continuity, strong art direction, precise timing, and a composed resting state.

## 2. Progressive experience model

Every page has one semantic source and up to three presentation layers:

| Layer | Entry condition | Experience | Required fallback |
| --- | --- | --- | --- |
| Foundation | Always | Complete server-rendered content, actions, focus, state, and recovery; approved static imagery or neutral media fallback | None; this is the usable product |
| Enhanced | JavaScript and CSS capability available; no reduced-motion request; treatment passes local capability checks | Composed entrances, spatial continuity, responsive media, hover/focus/press detail, and limited section choreography | Direct state or restrained opacity/color transition |
| Immersive opt-in | Visitor explicitly activates a labeled control; asset/provider gates are closed | Hero/institutional video, richer guided media, or other sustained motion | Poster/still, transcript/captions where informative, and immediate pause/stop/close |

Save-Data and the agreed constrained profile do not ban visual quality. They prevent automatic transfer or activation of non-essential media. A visitor may deliberately request an approved video; the interface must explain any material download before a large transfer where practical.

## 3. Motion intensity system

| Level | Name | Timing and behavior | Eligible use |
| ---: | --- | --- | --- |
| 0 | Stable | No expressive entrance or ambient movement; immediate native focus, press, progress, and state feedback remain | Emergency; urgent guidance; errors; privacy/consent; unavailable, expired, or unknown-outcome states; appointment receipt meaning |
| 1 | Functional | Usually 80–250 ms and 4–8 px or opacity/color change | Controls, menus, disclosures, search/filter continuity, form field reveal, copy/status feedback |
| 2 | Composed | Usually 250–500 ms with a bounded sequence and no delayed access | Page orientation, task groups, governed-card media, section entry, before/during/after wayfinding |
| 3 | Cinematic | Usually 500–1200 ms on decorative/media layers; content and actions are already present and usable | Selected Home, About, Patient Information, arrival, and institutional-story sections only |
| 4 | User-controlled media | Duration follows the approved media; begins only after explicit activation and always exposes pause/stop/close as applicable | Hero or institutional film, guided facility/arrival media, approved interviews or explainers |

Timing ranges describe choreography, not mandatory delay. Interactive feedback remains brief even inside a Level 3 composition. No navigation, emergency action, form action, or content access waits for an expressive sequence.

## 4. Page and section allocation

| Area | Maximum | Direction |
| --- | ---: | --- |
| Shared shell | 2 | Precise menu, navigation-indicator, and language/context continuity; no animated obstruction or delayed route change |
| Home `H1` | 4 | Static-first authored media plane; optional user-initiated video; one composed opening treatment; care and Emergency actions remain stable and visually independent |
| Home `H2` | 2 | Short task choreography and refined hover/focus/press response; no motion pressure on Emergency |
| Home `H4`–`H5` | 2 | Approved imagery may reveal within reserved media geometry; names, scope, and availability never depend on motion |
| Home `H6` | 3 | A restrained wayfinding sequence may connect Before, During, and After while every stage remains readable in source order |
| Home `H7`–`H8` | 3/4 | Arrival imagery and institutional story are the preferred locations for immersive media when hero video would compete with care access |
| About `AB1`–`AB9` | 4 | Editorial imagery, evidence-led narrative, and user-controlled institutional media; claims, dates, owners, and relationships stay static |
| Patient Information | 3 | Composed stage continuity around stable guidance; no health instruction is revealed only through motion |
| Locations & Contact | 2 | Approved place/arrival imagery and deliberate map activation; addresses, landmarks, and call actions remain static and text-first |
| Doctor/service directories and detail | 2 | Premium typography, crop transitions, focus/hover feedback, and bounded relationship continuity; identity, scope, schedule, availability, and errors stay stable |
| Appointment | 1 | High-end finish through typography, spacing, focus, field continuity, and precise status feedback—not cinematic movement |
| Emergency and safety exceptions | 0 | Immediate, sober, motion-independent presentation throughout |
| Privacy, Accessibility, 404/410, failures | 0/1 | Static meaning and recovery; only functional control feedback |

## 5. Home hero and video placement decision

The production architecture must support both of these art-directed outcomes without changing the `H0`–`H9` order:

1. **Conditional hero media:** `H1` pairs its stable task content with an approved static poster or image. A labeled Play control may replace the poster with a muted video after direct activation. The media stays within a reserved visual plane by default. A large-screen background treatment is permitted only when every frame retains tested text/control contrast, the controls sit on a stable surface or scrim, and Emergency remains independent.
2. **Institutional-story media:** when footage is too narrative, visually busy, long, or claim-bearing for `H1`, the hero remains a strong static composition and the playable film appears in `H8` or the About introduction after essential care tasks.

The choice is made from the approved footage, not from a requirement to fill a slot. Weak, generic, unapproved, or misleading footage is omitted.

### Video contract

- The poster/still is the initial and failure state and must be art-directed as a complete composition.
- Use a real button with a visible, contextual name such as “Play hospital film”; an unlabeled play triangle is insufficient.
- Do not request the video before activation: use `preload="none"` or an equivalent verified delivery strategy. Third-party players remain default-deny under `SEC-02`.
- Background/ambient video is muted and carries no unique information. If speech, sequence, or visuals convey meaning, use a foreground player with captions, transcript, and audio-description decision.
- After activation, expose persistent Play/Pause and Stop/Close behavior without replacing the focused control. Stop playback when the media is removed or its route unmounts; off-screen pause is preferred.
- Prefer finite playback. Repetition after explicit activation requires a nearby pause control and an editorial reason; endless ambience is not the default.
- Reduced-motion and no-JavaScript render the poster. An explicit foreground Play action may remain available when the visitor deliberately requests the media; it may not silently enable ambient background movement.
- Save-Data and compact/mobile render the poster first. Mobile may open a dedicated inline or modal player after activation instead of playing behind controls.
- Reserve media dimensions, preserve the focal point at every crop, and never allow a poster-to-video swap to change page geometry.
- Text over moving imagery must meet contrast on every representative frame and state, not only against the poster.

## 6. Imagery and background art direction

High-end sections may use approved still imagery, softly graded photographic backgrounds, cropped foreground media, masks, restrained depth, and locally meaningful medical/wayfinding detail. Preferred subjects remain the actual entrance, reception, clinicians and staff at work, non-sensitive environments, real equipment whose capability is approved, and recognizable local arrival context.

Every background treatment must:

- remain supplementary to adjacent HTML text and actions;
- use an art-directed focal point and responsive crop rather than one desktop crop stretched everywhere;
- provide a stable solid-color or still fallback and preserve section contrast when blocked or expired;
- avoid identifiable patients, distress, procedures, or vulnerable people without specific consent and review;
- avoid generic stock or AI-generated people/facilities presented as authentic;
- stop or remove all derivatives when rights, consent, claim approval, or review status expires.

## 7. Choreography rules

- Author one or two focal motion moments per viewport, with quieter supporting micro-interactions.
- Animate relationships: origin, destination, hierarchy, continuity, and direct response. Do not animate merely because a section entered the viewport.
- Keep base CSS content visible. Enhancement may animate from a subtly offset painted state only after the usable state exists; no observer or script may strand content invisible.
- Prefer `transform`, `opacity`, and carefully scoped color/border effects. Larger masks, clips, filters, and layered movement require measured device evidence and a static reduced equivalent.
- Scroll-linked treatments may affect decorative layers inside a bounded section, never body text, controls, safety content, or native scrolling. No mandatory pinning or scroll-jacking is permitted.
- Route transitions may visually connect one bounded media element or section context, but navigation starts immediately and Back/Forward restoration does not replay a disruptive entrance.
- Pointer-responsive effects are optional decoration. They never move the actual hit target, never replace hover/focus styles, and disappear for touch, reduced-motion, or coarse-pointer contexts.

## 8. Performance and implementation boundary

- `G-008` and `G-009` continue to govern the initial usable view. User-initiated video bytes are measured separately as an activated-media budget and do not excuse a slow poster or base page.
- Do not preload decorative video. Optimize and prioritize the actual poster only when it is the measured LCP candidate.
- Prefer CSS and platform capabilities for functional motion. A motion runtime or library may be proposed for Level 2/3 choreography only with a license, security, bundle, cleanup, reduced-mode, and no-library comparison.
- Non-essential motion code may load after the usable view or with its eligible section; it must not block rendering or interaction.
- Animation must not cause CLS, horizontal overflow, focus loss, duplicate activation, or task latency. A long main-thread task over 50 ms attributable to motion is a defect.
- Profile default, reduced-motion, Save-Data, compact/mobile, low-end Android, restored-page, hidden-document, media-failure, and slow-network cases. Capability failure selects a lower layer without a broken intermediate state.

## 9. Acceptance before production

- [ ] The static/no-JavaScript page is complete and visually intentional.
- [ ] Motion inventory identifies each trigger, level, purpose, duration, affected property, fallback, and cleanup behavior.
- [ ] Only permitted sections use Levels 3–4; Level 0 content never inherits a parent entrance.
- [ ] Fresh navigation, deep links, Back/Forward, focus, browser zoom, language switching, and restored state behave correctly.
- [ ] Reduced-motion, Save-Data, media failure, offline, and constrained-device variants are designed and tested—not merely disabled in code.
- [ ] Video performs zero media request before activation and exposes keyboard-, touch-, screen-reader-, and voice-operable controls.
- [ ] Informative media has approved captions/transcript and an audio-description decision; decorative media is silent and semantically ignored.
- [ ] Text and controls retain required contrast throughout every moving-media frame and focus/hover/pressed state.
- [ ] Poster, video, motion runtime, and activated-media bytes/requests are reported separately; LCP, INP, CLS, and long-task thresholds pass.
- [ ] Every image/video has the required provenance, rights/consent, authenticity/claim, crop, alternative, owner, review, expiry, and removal records.
- [ ] Human accessibility, bilingual, mobile, and task-recognition review confirms that choreography strengthens confidence without obscuring care access.

## 10. Historical evidence and next implementation boundary

Orders 3–11 remain truthful evidence of the restrained non-public prototype that was actually built and tested. They are not retroactively described as high-motion evidence. This amendment controls future production planning and requires new implementation evidence under `B01-012`, `B01-013`, `B02-011`, and applicable route tickets.

No production video asset, motion library, provider, or hero placement is approved by this direction alone. `BRAND-01`, `SEC-02`, `DEL-01`, content/claim decisions, and the implementation acceptance matrix remain binding.
