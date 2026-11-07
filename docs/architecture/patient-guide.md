# Patient Guide

The local website now includes a complete guided chatbot through **bottom-right Help → Chat with our guide**. It runs in the existing Next.js application, without an LLM, API key, chat backend, database or new dependency.

## Delivered behavior

- Six opening topics: doctors, services, appointments, visit preparation, common questions, and contact/directions.
- Typed questions matched to prepared answers using normalized whole words and phrases. Matching ignores case, spacing and punctuation. Unknown questions receive useful navigation choices.
- Twelve draft FAQs covering appointments, preparation, contact, directions, hours, costs, language, accessibility, results, appointment changes, privacy and the guide itself.
- Doctor lookup by name and the preview's three specialties, with common specialty aliases, profile links and doctor-specific appointment handoffs.
- Service lookup by name or distinctive keyword, service summaries and service-specific appointment handoffs. Ambiguous care terms offer a doctor/service choice.
- Fixed emergency guidance and a visible emergency link. Medical questions receive a prepared boundary response rather than medical advice. Phrase matching cannot assess urgency or exhaustively recognize emergencies.
- Scrollable conversation, suggested follow-ups, empty-input handling, a 240-character question limit, a 20-turn memory limit, and Start over.
- Responsive dialog: a floating panel on larger screens and a bottom sheet on phones; native focus containment, Escape dismissal and focus return, screen-reader answer announcements, reduced-motion and forced-color styles.
- The Help menu still offers its appointment link without JavaScript, with a text fallback for doctor/service navigation.
- Help is a compact 48px question-mark icon in the bottom-right corner. Its 280px menu offers the guide and appointment link, with no unavailable phone action or page-dimming backdrop. The explicit close button works without JavaScript; Escape and light dismissal remain available. Closing with the button returns focus to Help when JavaScript is available.
- With JavaScript, the launcher moves upward by at most 144px to clear nearby reading content and controls. If that corner remains occupied, it temporarily collapses until space clears. It also hides while a mobile page field is active or the visual viewport indicates an open keyboard. A footer spacer and bottom scroll padding let the last page content scroll clear. Without JavaScript, the launcher keeps its fixed position and native menu behavior; collision avoidance requires JavaScript.

## Content and data

| File | Responsibility |
| --- | --- |
| `apps/web/src/patient-guide/types.ts` | Public catalog, FAQ, answer, card and action contracts |
| `apps/web/src/patient-guide/content.ts` | Opening topics and draft FAQ copy/aliases |
| `apps/web/src/patient-guide/engine.ts` | Deterministic matching and conversation responses |
| `apps/web/src/demo/patient-guide.ts` | Adapts the existing fictional directory snapshot |
| `apps/web/src/design-system/components/patient-guide.tsx` | Chat interface and transient conversation state |
| `apps/web/src/design-system/components/patient-guide.module.css` | Responsive visual design |

`demoShell()` passes the catalog into `SiteShell.patientGuide`, which passes it to the Help widget. This makes the demo available across home, doctor profiles, directories, appointments and emergency information. Shells without a catalog keep chat unavailable; the production publication boundary remains in place.

The adapter reads the same `demo/data.json` as the directories. It projects only display names, specialties, profile paths, service names, descriptions and public IDs. CMS review fields are not passed to the browser. Appointment links use the existing `doctor` and `service` parameters; they do not create a booking.

No phone numbers, opening hours, prices, insurance acceptance, accessibility arrangements or clinical availability have been invented. Draft answers explain when those facts are unavailable. Preview status appears in the chat toolbar.

### Editing an answer

Add or edit an entry in `previewFaqs`:

```ts
{
  id: 'hours',
  question: 'What are the opening and visiting hours?',
  aliases: ['hours', 'opening', 'visiting', 'weekend'],
  answer: 'Hospital-reviewed answer goes here.',
  actions: [{ label: 'Contact information', href: '/#home-call' }],
}
```

An action either has `query` (continue the conversation) or `href` (navigate). Use internal, existing site destinations. Exact question matches rank ahead of shorter aliases. The generic word “appointment” has reduced weight so “cancel my appointment” reaches the change/cancellation answer.

Run the guide checks after changing answers, aliases or directory mappings. Every FAQ's canonical question is tested against its answer. Do not add symptom-to-treatment mappings to the website guide.

### Later content integration

The replacement point is the server-side catalog adapter, not the chat UI. A later CMS integration can select published, reviewed doctor/service records and localized FAQs, then pass that projection as `SiteShell.patientGuide`. Keep unpublished/private CMS fields out of this contract. Update the specialty vocabulary if the roster gains new specialties. Replace preview-specific copy and add reviewed translations before enabling another language.

This implementation has no FAQ editor screen, staff chat, actual scheduling, patient-record access, Amharic answer pack, analytics or transcript storage. Those are independent extensions, not dependencies for the current guide.

## Conversation privacy

Question matching happens in the browser. Question text is never added to URLs, sent to a chat endpoint, logged by the guide, or stored in cookies/localStorage/sessionStorage. Navigation sends only existing public record IDs where appropriate. React renders typed text as text, never HTML. Closing and reopening retains the conversation while the component remains mounted; Start over, page reload, or unmount clears it. Only the latest 20 turns are retained.

## Design decisions

The interface answers one question: “Where do I go next?” Its content comes from the hospital's own navigation: Hallelujah identity, the existing Help entry point, doctor specialties, named sample clinicians, governed service summaries, public record IDs, appointment request semantics, visit guide, contact and arrival sections, and emergency information.

The selected design direction is a framed white sheet on the site's pale blue ground, using the existing navy ink, body font and display font. The small header names the hospital and identifies the guide as automated. Six compact topic choices make the common jobs immediately available; record cards give a concrete next step inside the conversation. Brand styling is retained rather than adding another visual system. No imagery or generated assets are required for this interface.

The sheet has an 8px inset, 16px corners, equal inner gutters and a fixed composer. Mobile turns the same interface into a viewport-aware bottom sheet. A single scroll region keeps questions, answers and the composer usable on shorter screens.

## Verification

```sh
pnpm --dir apps/web patient-guide:check
pnpm --dir apps/web typecheck
pnpm --dir apps/web build

# With pnpm dev running and Chromium installed:
pnpm --dir apps/web patient-guide:smoke

# Include C3 scrolling/focus checks across the main patient journeys:
pnpm --dir apps/web patient-guide:smoke --help-clearance
```

The engine check is included in the application's `test` script. Browser checks cover 320, 390, 768 and 1440px widths, a short viewport, focus return, typed answers, script-like input, missing answers, emergency navigation, reset, no transcript storage, and doctor/service appointment links. Screenshots default to `artifacts/patient-guide/`; set `GUIDE_EVIDENCE_DIR` to save them elsewhere.

The optional `--help-clearance` sweep checks normal and validation-state appointments as well as the homepage, directories, sample details, visitor information, emergency, feedback, referrals, health topics and news. It reviews scrolling and focused controls at 1440 × 900, 768 × 1024 and 390 × 844, compact launcher/menu dimensions, collision repositioning and collapse/recovery, mobile field focus, explicit/Escape dismissal, and native opening/closing without JavaScript. `GUIDE_ORIGIN` can select another local development-server origin. A physical mobile keyboard check is still required by the independent assessment; viewport emulation does not establish device behavior.

The implementation was visually reviewed at phone and desktop widths. Source design lint, focused ESLint, TypeScript, engine checks, browser journeys and the production build passed. The repository-wide format and boundary scripts also report existing issues outside these changes (older evidence files/font-license formatting and external URL references in the existing profile/header components).
