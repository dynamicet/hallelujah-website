# Hospital background video

The homepage has a dedicated “About our hospital” section using the supplied silent,
18-second background loop from `../media/exports`. Both desktop (1920 × 1080)
and mobile (540 × 960) MP4/WebM files and matching WebP posters are copied
unchanged into `apps/web/public/editorial`. Original delivery notes are retained
in `evidence/care-background-film/export-delivery-notes.txt`.

The film controller loads near the chapter and attaches a source only while
the video is visible. It chooses WebM where supported, otherwise MP4. A native
button pauses/resumes playback; user pauses persist through scrolling. Playback
stops offscreen, in hidden tabs, and on unmount. Reduced motion and data saving
show the poster without downloading a video. Preference changes are observed.
Playback errors also reveal the poster. Without JavaScript, the poster and all
care content remain available, with no inactive playback button shown.

“Beyond the consultation” retains its original corridor image and scroll expansion.
The film is independent of that scene, between “Care in focus” and the doctors.
The introduction sits above the film, with a larger “Care in every detail” heading
and one supporting sentence. The film is framed by the existing page gutters;
there is no scrim or promotional text over the footage. A footer places the
hospital name beside the services and visit links, stacking these on mobile.
The frame reserves its native 16:9 or 9:16 ratio, so it adds no crop or zoom.
A fixed-width native playback button uses SVG play/pause icons and text, retaining
a stable target when its state changes. It sits left to clear Help.
The controller explicitly sets both muted and defaultMuted DOM properties before
requesting playback, so it does not rely on server-rendered muted markup.
The opening hero remains a still.

Validation: production build (including TypeScript), focused ESLint, homepage
enhancement contracts and built asset budgets pass. Initial homepage JavaScript
is 153,450 compressed bytes against the existing 153,600-byte limit; the playback
controller is deferred. Video transfer is separate from that initial budget:
desktop WebM is 2,743,404 bytes; mobile WebM is 1,123,590 bytes.
Desktop MP4 is 7,489,653 bytes; mobile MP4 is 2,117,353 bytes.

Original browser evidence is in `evidence/care-background-film/`; the revised
layout, playback checks and short-viewport evidence are in
`evidence/hospital-film-design/`.
The designed homepage is currently enabled by the existing development-only
route condition, so its browser checks run against the local development server.
The production build and budgets are checked separately. This change does not
alter that existing route condition or publish the site.

Visual limitation: the supplied exports use soft macro footage of an IV drip
and a gloved clinician writing, rather than the people-and-entrance scenes
originally recommended. No additional footage was generated or substituted.

Revision review: verified advancing, visible muted video at 1440, 1024, 768, 390 and
320 pixels, and asserted that the consultation scene contains its original image
and no video. The full-page inspector reports zero failures at desktop, tablet
and mobile widths. Four existing style warnings remain elsewhere in the page:
mixed heading typography, font-size variety, secondary text contrast and the
partner carousel. These were left within the existing design scope. The supplied
macro footage remains visually subdued, especially during the opening drip shot.

Corrected exports: all six files were independently probed and fully decoded
with FFmpeg, then copied byte-for-byte. Browser checks additionally assert native
video dimensions and matching rendered aspect ratios to prevent accidental zoom.
The updated delivery notes and exporter validation are retained with the evidence.
