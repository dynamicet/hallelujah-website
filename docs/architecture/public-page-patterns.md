# Public layouts and page patterns

All hospital pages live under `apps/web/src/app/(public)/`. The route group does
not appear in URLs. Its layout supplies one header, main landmark, skip link,
footer and patient guide. Client pathname changes update active navigation
(including nested pages) and choose the full home or compact interior footer.
Page bodies remain server components; only the shared chrome reads the pathname.
Internal component-library/composition previews and API routes remain outside it.

## Add a page

Create `(public)/careers/page.tsx` (or another route) and export metadata and a
page body. The public layout is inherited automatically. Do not add `SiteShell`,
`demoShell`, another `main`, or a duplicate header/footer. Add a menu entry only
when needed, in `hospitalShellConfig` in `website/site-shell.tsx`.

Choose composition based on the content:

- Information/visit guide: `PatientPage` with `PatientSection` supplies the
  established introduction, breadcrumb trail, content width and readable sections.
  Existing visitors, referrals, feedback, services and health guides use it.
- Directory/profile/form: the existing design-system directory, clinician profile,
  appointment and emergency templates preserve their specialized interactions.
  Omit `shell` in public routes; profile breadcrumbs have their own prop.
- Custom composition: render any body markup, as the homepage does. Use
  `PageContent` for optional breadcrumbs, `PageFrame` for the standard width,
  `PageIntro` for a standard introduction, or `ContentSection` for a titled
  section when useful. About Us keeps its custom hero and uses PageFrame.

These are composition tools, not a mandatory section order or visual template.
Custom heroes, grids, editorial layouts and page-specific CSS are supported.
Use shared tokens and controls wherever their behavior is the same. A page has
one h1; each ContentSection takes a unique id. PageIntro is a page-level heading
and should appear once. Breadcrumb labels belong to the page, not an automatic
conversion of URL slugs into titles.

Templates retain optional standalone shell support for isolated review fixtures.
Application routes must omit it to avoid duplicate shell landmarks.

## Verification

Run typecheck, shell checks, and `pnpm visual:navigation` for shared changes.
The navigation check covers unique shell landmarks, nested active states and
client navigation persistence. Capture changed page patterns at mobile, tablet
and desktop widths using `pnpm visual:check`, and inspect fresh screenshots.

This structure does not change the existing content sources or demo-mode route
restrictions. Careers remains a future page; no placeholder route is published.

## Styling contracts and content semantics

CSS Module class names are private implementation details. Public website skins
must not select substrings of rendered classes: filenames also appear in generated
class names, which previously made a grid selector affect unrelated card text.
The boundary check now rejects class-attribute selectors in global app CSS.

Components that support a public skin expose literal `data-ui-part` tokens. A
part can have a category and a specific role, such as `section section-heading`.
These are intentional public styling hooks, independent of CSS class names:

- Header: `wordmark`, `utility-bar`, `navigation-link`, `appointment-link`, `menu-glyph`.
- Care templates: `introduction-copy`, `directory-heading`, `search-panel`,
  `filter-rail`, `card-content`, `card-photo`, `request-rail`, `state-actions`.
- Homepage sections: `introduction`, `grid`, `specialty`, `description`, `image`,
  `audiences`, `plus`, `footer`; health discovery also exposes `title-block`,
  `search-box`, `topic` and `topic-title`.

Keep selectors scoped to the owning feature/root. Component CSS still owns its
base anatomy and relationships; a part is not permission to style every section
on the site. Add or change parts deliberately alongside their consumer styles.
Do not derive part values from CSS Module names or expose every private element.
Custom page composition remains supported without adopting a public skin.

Use `PageActionLink` for standalone next steps in information guides; it inherits
the shared text-action target size, hover and focus behavior. Normal links within
sentences remain inline. EditorialCard accepts `headingLevel={2}` in an archive;
its default h3 belongs beneath the homepage's h2 section. The `cardTitle` class
owns its appearance independently of heading level.

Every public route supplies a meaningful description. Dynamic descriptions use
that record's available content and preserve its preview/review status; generic
root descriptions are only a fallback. Do not imply approved services or a live
submission workflow from preview metadata. `visual:quality` checks descriptions,
editorial heading context and guide action targets with the existing keyboard
and reduced-motion contracts.
