# Homepage collections — 1 November 2026

Implemented the browser-reviewed composition priorities, retaining all existing copy,
profiles, stories, disclosures, article destinations and native story expansion.
Existing One motif direction, seed 238462439, retained. No redraw or new assets.

- Doctors: section introduction above a three-column/two-row portrait collection;
  two columns below 900px and one below 600px. Pale surfaces group each profile.
- Stories: two equal editorial columns on desktop. Each uses image above quote to
  preserve a comfortable reading measure in the 1280px content frame. Tablet
  retains image/text pairs, mobile stacks. No carousel needed for two stories.
- News: equal three-column desktop collection, two columns on tablet and one on
  mobile. Image crops and actions align; homepage no longer marks the first entry
  as featured. Shared archive/card API remains intact.

No text removed or truncated. Other homepage compositions retained.

## Visual critique

ROUND 1 — final implementation
Seen in one second: human care conversation and appointment access, unchanged.
Idea (one sentence): care discovery and human stories form distinct, readable collections.
Live thing: existing searches, service choices and expandable story accounts.
Layout words by section: hero=cinematic / navigator=choice / health=lookup /
care=showcase / doctors=portrait-grid / visit=FAQ-contact / partners=logo-row /
statistics=band / stories=paired-editorial / consultation=split / news=editorial-grid /
footer=brand-navigation.
Scores: design 7 · usability 8 · creativity 6 · content 5 → overall 6.9.
Caps applied: category-level concept and illustrative proof remain limitations.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. after/desktop-page-02.jpg: stories are now a collection but still rely on fictional
   preview proof. Approved content remains separate work; keep disclosures visible.
2. after/tablet-page-02.jpg: three news items create a second row with one item.
   Preserve readable two-column cards rather than squeeze three into tablet width.
3. after/mobile-page-01.jpg: doctor profiles naturally remain a long single column.
   This pass prioritizes desktop collection design and readable mobile content.

Opened every final inspector sheet and fold at 1440, 768 and 390px, plus detailed
captures at 320px. Inspector: 0 FAIL, 4 WARN. Collection/card repetition is deliberate
for the requested comparison sections, separated by different compositions; the
other warnings concern inherited font-size variety, no inline authentic footage,
and the existing controlled partner row. Source lint: no failures, one inherited
Read More warning (accessible links are named by full article titles).

## Verification

TypeScript, focused ESLint, home contracts (14 cases), patient-story contracts and
git diff whitespace checks passed. Browser checks are reproduced by verify.mjs.
Measurements and focused section captures are reproduced by capture.mjs.

Page heights (same 1000px-high capture viewport):

| Width | Before | After |
| --- | ---: | ---: |
| 1440 | 9818 | 9446 |
| 768 | 10792 | 10910 |
| 390 | 12743 | 12702 |

The 1440px story section changes from 1603 to 1253px, news from 1141 to 983px,
and doctors from 708 to 845px. Larger portraits and a heading above the collection
intentionally give the doctors more space. Height alone is not the design criterion.

Existing bundled photographs remain illustrative. No new assets, source credits,
clinical claims or proof were introduced. Unrelated working-tree edits left intact.
