# Hospital feedback recovery — 21 November 2026

The original `feedback/hospital-revisions` branch remains preserved at `11580c5`.
It started at staging revision `df1de96`, missing later changes in main. Its
historical audits and visual passes do not establish preservation of the deployed
design. No existing branch was reset or rewritten.

`feedback/hospital-revisions-recovery` starts from refreshed `main` / `origin/main`
revision `6dbdc3c416ee48c8fd6444c4ee3b18c2a1e284c2`. The public Vercel homepage was
fetched and captured afresh. Its founder introduction, six featured clinicians,
concise health-topic invitation, equipment introduction, visit checklist,
stories and organization disclosures correspond to this newer source. This
comparison does not establish an exact deployed Git SHA.

## Reconciled feedback

| Area | Recovery decision |
| --- | --- |
| Navigation | About Us is a configured primary menu item with inherited effects and nested current state. Retain main's full hospital identity, contact-page routing and enabled language support. |
| Footer | Shared styles and configuration, full home / compact interior variants, clear group headings, social icons including pending TikTok and Telegram. Retain main's emblem, tagline and all newer footer destinations. |
| Public pages | All public pages, including main's Careers, Contact, FAQ, Privacy and Patient Rights pages, inherit one public layout. Templates also support standalone review shells. |
| Page patterns | Optional shared frame, introduction, content and action patterns. Retain page variants, care artwork, preparation/story/assistance contexts and bespoke designs. |
| Homepage | One WebsiteHome in every environment. Remove obsolete homepage-selection aliases. Retain main's section designs and six-clinician browsing; add the approved statistics between doctors and visit guidance. |
| Appointment | Restore truthful preview-only copy, sample-data guidance and outcome messaging. Preserve main's explicit relationships, joint doctor/service selection, editable care summary, language behavior and frontend payload preparation. No backend delivery/storage was added. |
| Call and chatbot | Remove the chatbot, guide triggers and old Help widget. Share shortcode 9975 between header and ringing corner call action, distinguish reception numbers, honor reduced motion. Emergency retains its dedicated fixed call action and suppresses the general corner button. |
| Services | Reuse approved image-led cards and ten bundled illustrations. Preserve main's twelve care options, grouping/order, search feedback, pagination and care-context navigation. Echocardiography reuses heart artwork; Pediatrics reuses general consultation artwork. Preparation guides remain separate. |
| Structure and style | Retain newer content; move component-library presentation into the template layer, extract care-team presentation, use explicit public style hooks, fix archive heading hierarchy and preserve newer metadata descriptions. |
| Existing guards | Retain main's preview-route guards; no new demo-route restriction policy or deployment changes. |

`pnpm visual:navigation` now checks the newer homepage section contracts as well
as shared-shell behavior, legacy home URLs and the Emergency call exception.

## Verification

The complete `pnpm test` chain passed with the existing font-tools Python
interpreter (`ASSET_FORMAT_PYTHON=/tmp/hh-boundary-python/bin/python`). TypeScript,
ESLint and architecture/URL boundary checks passed during reconciliation.
Browser checks passed for service imagery, keyboard focus/activation, desktop
hover and reduced motion; shared navigation and client persistence; directory
pending/search/filter/history/no-JavaScript behavior; appointment validation,
preview outcomes and recovery; bidirectional care selection; language control
availability; story playback; equipment destinations; and visit disclosures.

Responsive checks cover thirteen route/query cases at 390, 768 and 1440 pixels.
Fresh images were opened separately from the automated assertions. Evidence and
inspection notes live in the unique run directories under `artifacts/visual-checks/`:

- `2026-11-21T18-46-39.446Z-homepage-recovery-XmNG0M`: matching public/local homepage section captures, with public on the left of comparison sheets.
- `2026-11-21T18-55-22.957Z-responsive-ImSqI3`: 39 responsive cases and three-width review sheets.
- `2026-11-21T19-10-23.087Z-responsive-oYcJps`: final post-configuration captures of home, services and Emergency; all nine images inspected.
- `2026-11-21T19-05-54.906Z-responsive-gWgDs2`: subsequent homepage, services and Emergency captures after correcting service artwork and the Emergency call exception.

The final optimized build passed (including compilation, TypeScript and prerendering). Earlier invocations reported an installed Next.js dependency security advisory before a successful retry. The advisory remains a dependency-upgrade follow-up; the recovery does not fix it.

## Four gaps identified in the follow-up audit

The follow-up comparison with the original feedback commits found four omissions
that the initial recovery summary overstated. They are now corrected:

- Emergency precedes the enabled language selector at every viewport.
- Dynamic appointment controls say Review sample details, Check sample details
  and Checking sample details, with corresponding Amharic interface messages.
- Eight static page descriptions and dynamic doctor/service descriptions now
  replace inherited generic metadata. Emergency copy describes the current
  contact page from main, rather than the old mock-contact description.
- All three preparation guides use PageActionLink for checklist, services and
  appointment guidance actions. Their current content and context colors remain.

`pnpm visual:feedback` passed header ordering, three-guide focus/style contracts
and eleven distinct rendered descriptions. `pnpm visual:appointment` passed
including dynamic-label assertions, and `appointment-page:check` passed twenty
controlled cases. TypeScript, lint and boundary checks passed. Fresh responsive
checks passed nine cases; all nine captures were opened and reviewed in
`2026-11-21T19-34-21.630Z-responsive-kuRMVz`. These corrections remain uncommitted
with the staged recovery for review.
