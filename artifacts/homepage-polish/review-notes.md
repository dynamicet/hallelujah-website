# Homepage polish — 2026-11-01

Scope: patient stories, homepage news, optical partner-logo balance, section transitions and tablet composition. Preserve the approved compact doctors section, content, routes and manual partner controls.

Existing direction: One motif, seed 238462439. No redraw or new imagery. The hospital's open-arms identity carries through its welcoming portraits and shared frame; existing care navigation remains the live interaction.

## Round 1

Seen in one second: a clear hospital homepage, with a restrained portrait collection and large editorial photographs below.

Idea (one sentence): familiar faces and everyday care conversations give the hospital's open-arms identity a human expression.

Live thing: choose a care route; browse all partners; open a patient's written story.

Layout words by section: hero=photographic introduction / care=choice strip / services=selected split feature / doctors=portrait-and-name pairs / visit=questions and arrival / partners=manual logo rail / statistics=dark band / stories=paired editorial columns / consultation=image and prompts / news=three articles / footer=utility close.

Scores: design 6.5 · usability 8.0 · creativity 6.0 · content 5.0 → overall 6.7.

Caps applied: design capped at 6.5 because approved photographs of the hospital are absent; creativity capped at 6 because the identity remains transferable to another hospital. These are whole-page authenticity limits, separate from this polish pass.

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. `before/news-resources-900.jpg`: three articles fill two columns and strand the last article over a blank half-width. Use a wide leading article followed by a balanced pair at tablet widths. Align heading, category, summary and footer tracks across desktop columns using intrinsic shared grid rows, without clipping titles or hardcoded text heights.
2. `before/patient-testimonials-1440.jpg` and `before/patient-testimonials-768.jpg`: tall photographs outweigh the quotations; the tablet family photograph crops its two-person scene. Use landscape editorial crops with portrait-aware focus, keep the paired collection through tablet, and allow text and expanded stories to determine each article's height.
3. `before/partners-all-1440.jpg`: dense rectangular marks outweigh some open wordmarks; TotalEnergies appears small. Adjust a few source-specific optical scales while retaining artwork, colours, names and generous clear space.

Section transitions: retain the established white → pale visit guide → white partners → dark statistics → light stories → pale consultation → white news sequence. It gives navigation, evidence and editorial content distinct roles. Shared outer margins and left-aligned headings already connect it. Additional coloured fields or page-wide spacing reductions would not improve this pass.

No new assets or external reference material used. Existing AI-generated patient scenes and clinician portraits remain illustrative; approved photographs, identities and editorial content remain launch prerequisites.

## Round 2 — final

Seen in one second: faces lead; practical care choices remain clear, and the lower-page collections have distinct compositions.

Idea (one sentence): familiar faces and everyday care conversations give the hospital's open-arms identity a human expression.

Live thing: existing care navigation, written story disclosure and manual partner browsing remain usable.

Layout words by section: hero=photographic introduction / care=choice strip / services=selected split feature / doctors=portrait-and-name pairs / visit=questions and arrival / partners=manual logo rail / statistics=dark band / stories=paired editorial columns / consultation=image and prompts / news=three desktop columns, tablet lead-and-pair, phone stack / footer=utility close.

Scores: design 6.5 · usability 8.2 · creativity 6.0 · content 5.0 → overall 6.8.

Caps applied: same authenticity and transferable-concept caps as round 1. The preview's composition improves, but more styling cannot supply hospital-specific evidence.

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. `after/desktop-page-02.jpg`: patient and staff photographs are illustrative. Replace with approved hospital material in the content milestone; no new generated imagery added here.
2. `after/desktop-fold.jpg`, `after/desktop-page-02.jpg`, `after/desktop-page-03.jpg`: the same consultation scene appears in the hero, consultation guidance and first news article. Resolve with an approved editorial image set, rather than more crops of the same image.
3. `after/mobile-page-01.jpg`: several disclosure notes and missing contact details still identify this as a preview. Supply verified content before launch; retain the disclosures until then.

Visual fixes verified:

- Landscape 3:2 story photographs give the family scene its full width. Portraits use a higher focal point, preserving the subject's hair and face. Two columns continue through 600px; phones stack. No text cut, line clamp, fixed story height or equal-height quotation panel.
- Opening the first story increases only that article's height; the neighbouring article retains its own height. Shared collection rows naturally move later content down.
- Desktop news shares intrinsic title, metadata, summary and footer rows; all text remains present. At 1024px the section grows by 25px to accommodate aligned wrapping. At 600–1023px, the first article spans the collection, with a balanced pair beneath.
- Ten partner marks receive modest optical scaling based on source margins, ink density and browser review. No image file, colour or lettering changed. All 19 names remain visible in the expanded view.
- The doctors section and the established section background sequence remain unchanged after review.

### Measurements (section heights, pixels)

These record composition effects, not acceptance targets for shortening the page.

| Width | Stories before → after | News before → after |
|---|---|---|
| 1440 | 1253 → 1149 | 983 → 983 |
| 1024 | 1112 → 1039 | 917 → 942 |
| 768 | 1370 → 1015 | 1432 → 1193 |
| 600 | 1227 → 1067 | 1480 → 1306 |
| 390 | 1771 → 1654 | 1885 → 1885 |
| 320 | 1786 → 1693 | 1904 → 1904 |

### Validation

- TypeScript and targeted ESLint passed.
- Existing patient-testimonials and partners checks passed.
- Design lint: 0 FAIL, 0 WARN on the five changed source files.
- Final full-page inspector: 0 FAIL, 5 WARN at 1440, 768 and 390px. All ten listed screenshots opened after the final source change; section captures also reviewed at 600 and 320px.
- Browser measurements at 1440, 1200, 1024, 900, 768, 700, 600, 390 and 320px: no page overflow; all three news articles retained; shared title/metadata/footer tracks aligned; tablet lead spans both columns and the other articles share a row.
- At 1440, 768 and 390px: written-story expansion leaves the second article's height unchanged, news links have visible keyboard focus, partner navigation reaches the end and disables correctly, and View all exposes all 19 partners.
- News directory and all three article destinations return HTTP 200. Without JavaScript, both stories, three articles and all 19 partner records remain rendered, and the unsupported partner-toggle button is hidden.
- `git diff --check` passed. No production build run.

Inspector warnings reviewed:

- Repeated cards: retained for the requested desktop editorial collection and selectable care controls; tablet news now has a distinct leading composition.
- Size count: inherited page typography; global type-system changes are outside this pass.
- No footage: no authentic hospital video is available; adding unrelated footage would reduce trust.
- Side scroll: intentional manual partner rail, with previous/next controls, keyboard scrolling and an expanded all-partners view.
- Tablet text anchors: the additional internal anchors come from the two story columns and inset lead-article body; outer section margins remain shared and equal. This deliberate nested composition replaces an orphaned article and an empty half-width.
