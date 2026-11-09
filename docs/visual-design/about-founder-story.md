# Founder story and leadership composition

Implemented locally on 8 November 2026, within the existing hospital visual system.
This is a design preview; publication controls are unchanged.

## Content hierarchy

The homepage introduces the hospital story and Mrs. Yetnayet Eshetu alongside the
existing opt-in film. Its links land on the institutional story or founder chapter
of About. The patient-facing homepage opening and care journeys stay intact.

About follows: hospital introduction, chapter navigation, institutional history,
founder feature, film, values, mission and vision, current leadership, and visit information. Founding
contribution and current responsibility are separate editorial purposes. Yetnayet
appears as founder in her own feature and as CEO in the management list. No founder
status has been inferred for another member of management. Add other founders with
their respective contributions once the hospital supplies that information.

The founder feature uses a dominant portrait, personal identification, and a distinct
pale-blue field. Management uses four consistent portrait entries, without making
the CEO entry visually larger than her colleagues. Chapter links provide direct
access on mobile and desktop. Native video controls keep About's player independent
of the homepage's muted montage controller.

## Replaceable material

Founder narrative is provisional editorial copy based only on client-supplied
founder status and the published institutional timeline. It contains no invented
personal history, achievements, or attributed quotation. Replace it with her
interview-derived account before launch. The four management titles are historical
published records and need current confirmation.

The actual founder interview does not yet exist. Both pages retain the 18-second
silent concept montage; neither labels it as her interview. The future main film
can tell her story through her voice and hospital b-roll, with captions, transcript,
and a suitable poster. Update duration, labels, and media sources together. Consider
a short homepage edit drawn from that same production.

## Portrait provenance

Original photographs downloaded from the hospital homepage on 8 November 2026:

| Person | Published role | Source |
| --- | --- | --- |
| Mrs. Yetnayet Eshetu | CEO | https://hallelujahhospital.com/wp-content/uploads/2025/09/Frame-41.jpg |
| Professor Getachew Aderaye | CCO | https://hallelujahhospital.com/wp-content/uploads/2025/08/Frame-32-1.webp |
| Mr. Gebeyehu Seyoum | Deputy CEO | https://hallelujahhospital.com/wp-content/uploads/2025/08/Frame-32-3.webp |
| Dr. Abdi Ketema | Medical Director | https://hallelujahhospital.com/wp-content/uploads/2025/08/Frame-31-1.webp |

Original files are retained unchanged under `apps/web/public/editorial/leadership/`.
The founder now uses `yetnayet-eshetu-enhanced.webp`, a 1254px square AI-restored
derivative produced with the built-in imagegen tool. Restoration reconstructs fine
detail and extends the original circular photograph into the square corners; it
is a preview enhancement rather than recovered original camera detail. The other
portraits retain their original files. Responsive founder image sizes account for
the 1.36× CSS crop, including on the homepage.
The final photography should provide uncropped originals with adequate headroom.
Confirm portrait rights and current roles during launch review.

Historical narrative source: https://hallelujahhospital.com/about/.
The 2010 milestone restores the published clinic name change to the short timeline.

## Visual authority

This is an extension of the incumbent system: existing display face, body face,
ink, blue accent, pale ground, page frame, shell, and care actions. No global token
or design-system change was needed.

## Composition polish

The homepage introduction and founder invitation share the film's 1120px maximum
width. The founder portrait has more presence within that frame, while the story
remains the main invitation. The redundant About link over the film was removed;
its control now serves playback, and both story links stay outside the player.

Tablet founder copy uses a tighter measure and spacing to balance the portrait.
Leadership retains equal frames with individual focal settings for the circular
legacy source images. Phone names and roles reserve consistent caption space;
below 360px the list becomes horizontal portrait-and-caption entries to preserve
readability. Photographs remain replaceable without changing the hierarchy.

## Founder restoration prompt

Built-in imagegen edit, using the original portrait as the sole reference:

> Restore clarity and reduce compression artifacts while strictly preserving her
> identity, age, facial geometry, expression, pose, makeup, hair, lavender jacket,
> scarf, lighting, and office setting. Recover natural hair, fabric, and subtle
> skin detail. Extend the existing photo into the circular mask’s white corners.
> Avoid beautification, de-aging, facial reshaping, waxy skin, stylization, text,
> and watermarks.

Requested output was 2048px square; the tool returned 1254px square. The selected
output is encoded as WebP at quality 92. Inspect likeness against the original
when replacing provisional launch media.

## Mission and vision

Added below the values and before current leadership, with a direct chapter link.
Both statements are lightly edited from the hospital’s published About page
(https://hallelujahhospital.com/about/, checked 8 November 2026). The mission
preserves patient choice, specialist diagnosis and treatment, competitive cost,
research and training, and support for government preventive healthcare. The vision
retains the aspiration to regional leadership, strong organization, advanced
technology, clinical standards, hospitality, compassion and patient satisfaction.
They are institutional statements, separate from the founder’s personal chapter.
Two text columns at tablet and desktop widths become a single column below 700px.
The earlier abbreviated mission sentence in the values intro now introduces values
to avoid duplicating the new statement. No extra motion or imagery was added for
this content addition.
