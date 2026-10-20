# First-entry logo reveal

Implemented on `feat/first-entry-logo-reveal`. The homepage places the emblem in its
introductory section, replacing the abstract decorative panel. Content, care actions,
and navigation remain visible and usable throughout; there is no loading overlay.

## Artwork and direction

The user-supplied 280 × 252 PNG is the source of truth, copied byte-for-byte to
`apps/web/public/brand/hallelujah-emblem.png`. SHA-256:
`51492fccc19a30bc0f321f5ada4d8afb050893e8695470362eb7c30b8fb887f5`.
No original vector was present in the repository. SVG clip windows isolate the
source pixels into two wings and four people, each keeping its head and body together.
These windows are not replacement silhouettes or a newly traced logo. The final
frame uses the entire untouched PNG. The mark stays at or below native CSS size.

The supplied emblem and its requested motion are a task-specific addition to the
older brand foundation, which previously had only public wordmark references.
This does not replace the wordmarks or change the site's UI palette.

Original colors are retained throughout. A neutral-to-color treatment was inspected in a browser-only grayscale study
but not adopted: the small colorful figures carry the connection/unity idea, and
fading their original colors in gives a clearer, less processed reveal.

## Choreography

| Region | Delay | Travel | Duration |
| --- | ---: | --- | ---: |
| Left wing | 0 ms | 5 px inward, 12 px down → original position | 1080 ms |
| Right wing | 80 ms | 5 px inward, 12 px down → original position | 1080 ms |
| Central orange person | 180 ms | 9 px up | 800 ms |
| Gold person | 320 ms | 2 px outward, 7 px up | 760 ms |
| Pink person | 440 ms | 2 px outward, 7 px up | 720 ms |
| Cyan person | 560 ms | 2 px outward, 6 px up | 680 ms |

All regions use opacity and translation with `cubic-bezier(.22, 1, .36, 1)`.
Assembly finishes at 1240 ms; the composition holds until 1800 ms, then hands off
to the full static raster in the same reserved space. There is no zoom, bounce,
rotation, sound, color filter, or movement of page content.

## Implementation

- `apps/web/src/design-system/components/logo-reveal.tsx`: server-rendered accessible
  SVG, unique clip IDs, exact source image, and external enhancement script.
- `apps/web/src/design-system/components/logo-reveal.module.css`: reserved responsive
  white logo field and immediate reduced-motion override.
- `apps/web/public/logo-reveal.js`: native Web Animations choreography, no dependency.
- `apps/web/src/design-system/templates/home-template.tsx`: actual homepage integration.

The external deferred script follows the project's existing script pattern and
same-origin CSP. `sessionStorage` key `hallelujah-logo-entry-v1` records first entry;
a window guard also prevents replay if the script executes again. Reloads and later
navigation retain the completed mark. Browser sessions follow sessionStorage/tab
semantics (duplicated tabs can inherit the flag).

Reduced motion skips animation. Changing that preference during playback completes
it immediately. Unsupported animation APIs, unavailable session storage, image decode
failure, background entry, decoding taking over 500 ms, or enhancement arriving more than 150 ms after first
contentful paint leave the static artwork. This avoids hiding an already established logo.
Page exit cancels playback. Without JavaScript the complete logo is server-rendered.
An exception during setup or cancellation restores it; a bounded timer finishes the
sequence independently of animation completion events.

## Verification

Run `pnpm dev`, then `node scripts/check-logo-reveal.mjs` (Chromium required).
Use `LOGO_TEST_ORIGIN` to select another running local origin. Screenshots are generated
under ignored `artifacts/visual/logo-reveal/`.

The browser check captures 0, 450, 900, 1240, and final frames at desktop 1440 px and
mobile 360 px, checks session reload, in-page navigation, visible content, horizontal
overflow, real-clock completion, reduced motion on entry and during playback,
unavailable storage, and JavaScript-disabled rendering. The frozen-frame captures
pause only logo animations; a separate pass runs normal timing.

Visual comparison found and corrected a narrow gold-figure clip boundary. The settled
assembly has no material colored-edge loss compared with the untouched final raster;
minor raster antialiasing differences exist at clip edges. Type checking, focused
ESLint, and repository formatting checks also cover the implementation.

Limitations: this is a raster-backed SVG, not a resolution-independent vector master.
The supplied raster limits high-density sharpness. Native browser tests cover Chromium;
Safari/Firefox and physical-device performance remain unverified. Current live homepage
links are existing in-page destinations, so navigation verification uses those routes.
