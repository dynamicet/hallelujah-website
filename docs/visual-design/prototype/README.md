# Order 10 — Connected Interactive Prototype

**Status:** Complete for non-public browser review  
**Completed:** 12 September 2026  
**Scope:** 12 refined page studies, 3 state boards, and one prototype journey map  
**Publication status:** Not approved for public use

Order 10 connects the Order 6–9 studies into one local, dependency-free prototype. It demonstrates navigation and safe state continuity without activating hospital contacts, appointment operations, personal-data collection, search services, maps, analytics, recruitment providers, or any third party.

## Start here

- [Open the connected journey map](index.html)
- [Open Home directly](../pages/critical-journeys/home.html)
- [Read the interaction specification](prototype-specification.md)
- [Review performed browser evidence](evidence/README.md)

Every page retains its persistent non-public label. The Order 10 review toolbar is explicitly outside the proposed hospital interface and can switch among the existing English, Amharic-geometry, mixed-script, long-content, and unavailable-translation fixtures. It can also force reduced motion and, on directory/search pages, select mutually exclusive loading, no-match, failure, offline, and unavailable states.

## Implemented connections

- Home routes to the complete Doctor, Services, Appointment, Patient Information, Locations & Contact, Search, About, and Emergency studies.
- Doctor and service cards open canonical controlled detail records; detail actions pass only an allow-listed public fixture ID to Appointment.
- Appointment resolves allow-listed doctor, service, and Not sure context without placing visitor data in the URL.
- Appointment demonstrates conditional-field validation, linked error focus, pending/duplicate protection, known failure, unknown-outcome reconciliation, authoritative receipt, and receipt-with-delivery-warning states.
- Search and directory forms accept only three visibly controlled prototype terms, encode safe local state in the URL, restore allow-listed filters, and provide real Back/Forward-compatible page navigation.
- Compact filter panels close on Escape and return focus to their trigger.
- Language/content fixture and reduced-motion settings remain on the same route and preserve safe query/filter/public-ID context.
- Emergency, contact, map, vacancy Apply, privacy, and other gated operational actions remain inert and continue to explain why.
- Source forms fail closed when JavaScript is unavailable, Save-Data suppresses expressive motion, and the shared layer loads in parser order to avoid late reviewer-toolbar layout shift.

## Files

| Artifact | Purpose |
| --- | --- |
| [`index.html`](index.html) | Prototype entry and route map. |
| [`prototype.js`](prototype.js) | Shared progressive-enhancement behavior loaded by all Order 6–8 page/state studies. |
| [`prototype.css`](prototype.css) | Token-only review controls, state presentation, motion, hidden-state, forced-color, and print rules. |
| [`prototype-specification.md`](prototype-specification.md) | Interaction, state, safety, accessibility, and traceability contract. |
| [`audit-order-10.mjs`](audit-order-10.mjs) | Repeatable local Chromium interaction and geometry runner. |
| [`evidence/`](evidence/README.md) | Machine-readable assertions and representative captures. |

## Run the performed audit

Start local Chromium with a debugging port, then run the audit against that port:

```sh
chromium --headless --no-sandbox --disable-gpu \
  --remote-debugging-port=9333 \
  --user-data-dir=/tmp/hallelujah-order10-chromium \
  about:blank

ORDER10_DEBUG_PORT=9333 node audit-order-10.mjs
```

The final run passed all 19 scripted interaction assertions and all 45 page/viewport geometry cases.

## Evidence limits

Order 11 subsequently added automated Chromium accessibility-tree, keyboard, contrast, forced-color, emulated-touch, reflow, no-JavaScript, motion, constrained-profile, and budget evidence. See the [Order 11 QA package](../qa/README.md). Professional Amharic meaning, human screen-reader output, physical touch or dialer behavior, real browser zoom controls, Firefox/WebKit parity, low-end Android hardware, field Core Web Vitals, human comprehension, clinical accuracy, hospital approval, production security, and publication readiness remain unproven.
