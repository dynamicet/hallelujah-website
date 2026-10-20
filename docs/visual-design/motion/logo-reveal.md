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
| Left wing | 0 ms | 5 px inward, 12 px down → original position | 1420 ms |
| Right wing | 80 ms | 5 px inward, 12 px down → original position | 1420 ms |
| Central orange person | 180 ms | 9 px up | 800 ms |
| Gold person | 320 ms | 2 px outward, 7 px up | 760 ms |
| Pink person | 440 ms | 2 px outward, 7 px up | 720 ms |
| Cyan person | 560 ms | 2 px outward, 6 px up | 680 ms |

All regions use opacity and translation. Figures use `cubic-bezier(.22, 1, .36, 1)`;
wings use `cubic-bezier(.3, 0, .2, 1)` so their opening gesture settles after the
last figure arrives at 1240 ms. Assembly finishes at 1500 ms; the composition holds until 1800 ms, then hands off
to the full static raster in the same reserved space. There is no zoom, bounce,
rotation, sound, color filter, or movement of page content.

## Implementation

- `apps/web/src/design-system/components/logo-reveal.tsx`: server-rendered accessible
  SVG, unique clip IDs, exact source image, and external enhancement script.
- `apps/web/src/design-system/components/logo-reveal.module.css`: reserved responsive
  compact mobile identity row, bounded desktop identity panel, and immediate reduced-motion override.
- `apps/web/public/logo-entry.js`: small pre-render session decision, with an independent
  two-second fail-open timer. Loaded in the root layout using `defer blocking="render"`.
- `apps/web/public/logo-reveal.js`: native Web Animations choreography, no dependency.
- `apps/web/src/design-system/templates/home-template.tsx`: actual homepage integration.

The identity precedes hero copy on mobile, with an 80px emblem beside the hospital
name; on desktop it sits alongside the copy in a bounded panel. The settled identity
stays in the same position, linking the welcoming motion to the care actions without
an extra transition screen. The hero emergency action uses the compact single label,
retaining its descriptive accessible name.

The small external entry script runs before rendering in supporting browsers using
`blocking="render"`, under the existing same-origin CSP. Its fetch is on the initial
render path; it has no dependencies. Deferred execution preserves ordering with the
animation script. If a browser has already painted (including when render blocking
is unsupported), entry remains static rather than hiding a visible mark.
`sessionStorage` key `hallelujah-logo-entry-v1` records first entry; a window guard
also prevents replay. Reloads and later navigation retain the completed mark.
Browser sessions follow sessionStorage/tab semantics (duplicated tabs can inherit
the flag). The root hydration warning is suppressed because the entry script may
add its temporary data attribute before hydration.

Only a confirmed first entry temporarily hides the complete image. Both a CSS
fallback and an independent entry-script timer restore it within two seconds if
the animation script fails to load. Once playback starts, its own 1800ms timer
restores the full image. No page content or controls are hidden.

Reduced motion skips animation. Changing that preference during playback completes
it immediately. Unsupported animation APIs, unavailable session storage, image decode
failure, background entry, or decoding taking over 500 ms leave the static artwork.
Page exit cancels playback. Without JavaScript the complete logo is server-rendered.
An exception during setup or cancellation restores it.

## Verification

Run `pnpm dev`, then `node scripts/check-logo-reveal.mjs` (Chromium required).
Use `LOGO_TEST_ORIGIN` to select another running local origin. Screenshots are generated
under ignored `artifacts/visual/logo-reveal/`.

The browser check captures 0, 450, 900, 1500, and final frames at desktop 1440×1000 and
mobile 360×640 and 390×844, checks session reload, in-page navigation, visible content, horizontal
overflow, real-clock completion, reduced motion on entry and during playback,
unavailable storage, and JavaScript-disabled rendering. The frozen-frame captures
pause only logo animations; a separate pass runs normal timing. The whole identity
must fit in each initial viewport. Cold, warm, and throttled (4× CPU, 150ms network
latency) unmodified loads generate filmstrips and animation-frame visibility logs;
these assert that a completed visible mark never disappears to restart the reveal.
Both entry-script and animation-script request failures are tested separately.

Visual comparison found and corrected a narrow gold-figure clip boundary. The settled
assembly has no material colored-edge loss compared with the untouched final raster;
minor raster antialiasing differences exist at clip edges. Type checking, focused
ESLint, and repository formatting checks also cover the implementation.

Limitations: this is a raster-backed SVG, not a resolution-independent vector master.
The supplied raster limits high-density sharpness. Native browser tests cover Chromium;
Safari/Firefox and physical-device performance remain unverified. Current live homepage
links are existing in-page destinations, so navigation verification uses those routes.

The component is exported through the component library public API and included in
the motion/media review inventory as a completed-identity specimen. Local preview
servers serve the original PNG and enhancement script explicitly. The identity row
wraps under enlarged text instead of squeezing its name into a zero-width column;
the review matrix covers 200% text, forced colors, blocked images, and both language
stress modes. Full entrance timing remains verified on the actual homepage.
