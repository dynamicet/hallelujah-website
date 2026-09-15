# Progressive motion and opt-in media

**Scope:** `B01-012` controlled development. No hospital media, provider, public route, or release is approved.

## Production boundary

`ExperienceRegion` resolves each requested expressive level against a named page-area ceiling. A protected context always resolves to Level 0, including when nested inside a Level 3 region. Its server-rendered children are complete before motion enhancement. Level 4 is separate: `OptInMedia` presents a neutral still plane, written description, and native buttons before a video source exists.

The current strict same-origin CSP blocks Next client hydration, so a deferred first-party `/motion-media.js` script enhances decorative accents and media controls. The script neither hides essential content nor waits to navigate. It selects a static accent for reduced motion, Save-Data, hidden documents, and restored pages. It does not observe scroll, preload video, load a motion library, or contact a provider.

## Motion inventory

| Treatment | Trigger / level | Duration / property | Fallback and cleanup |
| --- | --- | --- | --- |
| Decorative accent in eligible composed areas | First visible page load / Level 2 | 500 ms, opacity and transform | Static accent before script, reduced motion, Save-Data, hidden document, restored page; one bounded run |
| Decorative accent in eligible cinematic areas | First visible page load / Level 3 | 800 ms, opacity and transform | Same static fallback; no text, target, or safety movement |
| Protected or consequence-clamped region | Always / Level 0 or 1 | No expressive animation | Native focus and functional feedback remain; protected descendants cannot inherit an ancestor entrance |
| Controlled opt-in video | Labeled Play intent / Level 4 | Duration follows the approved media | First-party source attached only on Play; Pause/Stop/failure/end/pagehide preserve or restore the written still; Stop clears source and restores focus |

The eligible accents are intentionally a controlled architecture specimen rather than a generic reveal applied to every page section. Page tickets must name the exact authored moment and test content, framing, geometry, and confidence before using it.

## Media contract and gates

`OptInMedia` accepts an explicit authority marker and a first-party absolute path. The path rejects protocol-relative/external sources, query strings, fragments, and backslashes. Informative media requires captions and a transcript link at the typed boundary, shows the caption track after Play, and exposes native video controls whose Play/Pause state stays synchronized with the external labeled control; decorative media is muted and ignored by assistive technology. The video and caption track have no `src` before intent and use `preload="none"` for the video. A reserved 16:9 plane prevents poster/playback geometry change. The fixture WebM and caption file depict only abstract color and shapes and are labeled as controlled specimens.

Native CSS and the small first-party script were selected over a motion library: there is no new package or library license, the existing same-origin CSP remains enforceable, the built asset budget passes, and `pagehide`/Stop/failure clear media sources. The no-library implementation keeps expressive motion limited to one decorative accent per authored specimen, with no observer, layout animation, scroll handler, or cleanup-intensive runtime. A route-specific runtime proposal would need fresh license, security, bundle, cleanup, reduced-mode, and device evidence before selection.

The `production-approved` marker is an implementation input, not an approval record. `B02-011` must provide authentic asset provenance, rights/consent, claim and crop review, alternative text, owner, review/expiry, derivatives, and removal. `B00-014`/`SEC-02` must close before any provider-specific request. Meaningful footage also needs approved captions/transcript and the audio-description decision. The final hero versus institutional-story placement is chosen from the approved footage and route acceptance evidence.

## Validation boundary

`pnpm motion-media:smoke` runs the controlled fixture through Chromium at 320/360/375/667/768/1280/1440 CSS px, zoom-equivalent and enlarged text, keyboard Play/Pause/Stop, source request timing, Save-Data, blocked-media recovery, no-JavaScript HTML, reduced motion, print, and forced colors. It proves a local technical contract. Physical-device, assistive-technology, bilingual comprehension, real media frame contrast, activated-media budget, LCP/INP/CLS/long-task, and named production acceptance remain open under `B01-013`, `B02-011`, applicable route tickets, and `DEL-01`.
