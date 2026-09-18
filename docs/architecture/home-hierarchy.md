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
Missing media creates no empty H8 section. B03-005/006 will supply separately governed contact
and optional record modules; this ticket does not turn raw records into claims.

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
