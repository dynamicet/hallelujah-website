# Hallelujah hero composition

**Current usage authority:** [Final website guide](usage-guide.md). This earlier document retains editorial context; current palette roles and composition are consolidated there.

Decision: 3 November 2026. Supersedes the split hero in the earlier whole-life
presentation. Scope: homepage hero and its responsive behavior, not a site-wide
brand redesign.

## Argument

The first screen must establish that this is Hallelujah General Hospital, convey
attentive care, and give someone a clear route to an appointment, a doctor, or
visit information. The existing conversation image provides the human context;
the hospital name in the supporting copy establishes the institution; the three
real destination links provide the next step. Emergency access remains in the
shared header.

On this page, the whole-life care conversation becomes one continuous opening
scene. The imagery, navy, regular editorial serif, and plain patient language
carry HH's chosen direction together. The interaction is practical care discovery,
which remains directly beneath the hero. The composition is deliberately familiar;
authentic institutional photography is still needed to make its content uniquely HH.

The user explicitly rejected adjacent copy and image columns. Neither Next.js nor
the design skill requires them. The offending rule was the two-column grid in
`intentional.css`; this revision removes it and consolidates hero ownership there.
No new direction draw was needed for this scoped section revision.

## Reference review

Supplied measurements are interpreted references, not binding implementation
specifications. Seven supplied websites were opened in Chromium; desktop captures
are in `.taste-skill/hero-references`. Apple is assessed from the supplied reference,
not treated as proof of a current foldable product. Current pages often differ
from their supplied descriptions.

| Reference | Useful lesson for HH | Boundary / current observation |
| --- | --- | --- |
| [Sonos](https://www.sonos.com/) | One uninterrupted lived-in scene; large regular-weight type; one visually dominant action. | Current page has centered white text over video and a green promotion strip. HH uses left alignment and a static care scene; it does not inherit retail promotions or an achromatic brand. |
| [Partiful](https://partiful.com/) | A brief, memorable headline and unambiguous primary action. | Current page uses a black split hero with an invitation visual. Its split, party tone, and floating notifications do not fit this brief. |
| Apple, supplied style reference | Typography and image should read as one carefully sequenced opening; essential controls stay quiet and clear. | Product-showroom composition is a useful alternative, but HH needs an interpersonal care encounter rather than an object reveal. Do not import tiny purchase controls. |
| [Mollie](https://www.mollie.com/) | Broad media, low-weight type, real-world context, and distinct action hierarchy. | Current opening has a heading and a separate explanation block above wide media. HH avoids dividing attention between competing text groups. |
| [Superpower](https://superpower.com/) | A full photographic scene can carry left-aligned copy and a high-contrast light CTA. | Current page has a white header and left-aligned copy over atmospheric imagery; it differs from the supplied dark-nav/centered description. HH avoids membership, performance, and longevity framing. |
| [Finn](https://petfinn.com/) | Immediate warmth and an obvious relationship between the people/subjects in the image. | Current page's pastel split and commerce language are not the HH composition. Preserve care warmth without borrowing the pet-brand tone. |
| [1X](https://www.1x.tech/) | A single large photographic stage creates focus without small card fragments. | Current view shows three robots with sparse overlaid identifiers. Borrow scale, not product ordering or tiny utility labels. |
| [Biofarma](https://biofarma.com.ar/) | Healthcare context and a restrained institutional tone. | The browser displays a professional-audience declaration over the page. No declaration was made; review is limited to the visible backdrop and public text. HH is patient-facing and should not inherit that gate. |

## Detail decisions

- **Frame:** edge-to-edge picture, no image card, no column gutter. Desktop content
  aligns with the existing 1280px page frame. The shared header remains readable
  and separate from the photograph.
- **Headline:** retain “Care for your whole life.” Regular editorial type, one
  color, 1.02 leading, −.035em tracking; 64–88px desktop and 44–58px phone.
  Scale provides emphasis. No animated letters or rotating claims.
- **Copy:** retain the hospital's name and practical next-step language. No new
  statistics, accreditation, availability, or outcome claims.
- **Action:** white pill with navy text on the dark scene, minimum 56px tall,
  regular 17px/24px Lato label, 16px/28px padding. “Request an appointment”
  describes the actual destination. The label and 20px arrow are centered as
  one group with a 12px gap, including on the full-width mobile button.
  Doctor and visit links form a matching pair underneath with 44px targets,
  regular 16px labels, and 8px icon gaps. Hover/focus underlines only the label;
  only the arrow moves. The header appointment control is quieter at 44px tall
  with a regular 14px label and no hover lift.
- **Contrast:** a local neutral scrim on desktop, fading into the scene's navy
  on mobile. This is a readability treatment, not a decorative gradient. White
  copy stays readable against the navy fallback when the image cannot load.
- **Crop:** desktop retains the calm left image area and both faces on the right.
  Mobile places the encounter above the copy and uses the lower image area as
  the transition. Text never sits on either face. There is no separate white
  text panel or rounded photo on mobile.
- **Motion:** retain the short, one-time type settle and photo scale already
  implemented. Actions are usable immediately; reduced motion shows the final
  composition. No scroll pinning, parallax, looping CTA motion, or background video.
- **Loading:** keep the responsive AVIF/WebP picture in server-rendered HTML,
  explicit image dimensions and `fetchPriority="high"`. No new image, video,
  font, or dependency is added.
- **Fallbacks:** no-JavaScript actions, image failure, forced colors, and print
  remain usable. The hero grows with content rather than clipping to 100vh.

The clarity and task hierarchy follow [NN/g's homepage principles](https://www.nngroup.com/articles/homepage-design-principles/).
Early image discovery and priority follow [web.dev's LCP guidance](https://web.dev/articles/optimize-lcp).
These are implementation choices; they are not a claim of measured field LCP.

## Validation and critique

Before: 0 inspector failures / 4 warnings; hero media occupied 25% of the measured
desktop first screen. First revised inspection: 0 failures / the same 4 warnings;
hero media occupied 72%. Final inspection retains 0 failures / 4 warnings. The warnings concern the existing wordmark font exception,
warm canvas, page-wide type-size count, and controlled partner carousel.

ROUND 1
Seen in one second: Hallelujah hospital, a care conversation, a clear appointment route.
Idea (one sentence): the whole-life conversation forms one uninterrupted opening scene.
Live thing: appointment, doctor and visit routes; native care discovery directly below.
Layout words by section: hero=photographic scene / discovery=utility strip / remaining page=unchanged.
Scores: design 8 · usability 8 · creativity 7 · content 7 → overall 7.7.
Caps applied: creativity capped at 7 because the composition can serve another hospital; existing illustrative imagery is not authentic institutional proof.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. At 320px, “Plan your visit” wraps because the arrow consumes too much space (`hero-resolution-after/hero-320.jpg`). Reduce secondary-link icon gaps to 12px.
2. Short phones would place the primary action too low. Add a short-viewport crop and reduce the image lead-in by 60px.
3. Prior documentation and multiple CSS layers still prescribed conflicting hero layouts. Remove the competing enhanced rules and record a single composition contract.

ROUND 2
Seen in one second: a human hospital welcome with a direct care action.
Idea (one sentence): the whole-life conversation forms one uninterrupted opening scene.
Live thing: the same existing patient routes and search.
Layout words by section: hero=continuous scene at every width / discovery=utility strip.
Scores: design 8 · usability 8.5 · creativity 7 · content 7 → overall 7.9.
Caps applied: creativity remains capped at 7; photography is an existing generated concept.
Top three remaining limitations:
1. Replace the existing illustrative image with consented HH photography before presenting it as an authentic care encounter; preserve left negative space and deliver a phone crop.
2. This browser verification is Chromium, not evidence of Safari/Firefox or real-device parity.
3. The hero improves entry and orientation; it does not change the existing demonstration/appointment release boundaries.

Regression command: `node scripts/check-home-hero.mjs`. It uses the existing
Chromium harness; `TASTE_SKILL_ROOT` and `HH_PREVIEW_URL` can override its locations.
Evidence belongs in `.taste-skill/hero-contract` and is excluded from commits.

Verified after the final landscape-tablet adjustment: hero regression at
320×640, 390×844, 768×1024, 1024×768, 1100×900, 1440×900, and 1920×1080.
The primary action is visible in the first screen at all seven sizes. Short
tablets use a 280px image lead-in with copy starting at 240px. Typecheck, ESLint,
home enhancement checks, care journey checks, and existing motion checks pass.
Final inspector screenshots were visually reviewed across desktop, tablet and phone.

### CTA detail refinement

The next visual pass reduced the hero button's heavy label, centered its mobile
label–arrow group, unified the two secondary links, and reduced the header CTA's
visual weight. This applies the references' restrained action hierarchy to HH's
existing navy/white palette and patient destinations.

Desktop, tablet, phone, 320px keyboard-focus, and desktop hover screenshots were
reviewed in `.taste-skill/hero-detail-refinement`. The inspector retains 0 failures
and the same 4 page warnings. Typecheck, ESLint, hero regression, and motion checks
pass. Additional browser checks at 320, 390 and 1440px confirm centered primary
contents, a 56px target, and label-only hover/focus underlines.
