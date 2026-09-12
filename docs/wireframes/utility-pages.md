# Utility Page Low-Fidelity Wireframes

**Status:** Implementation-planning structure; not approved policy, legal advice, conformance certification, or public copy  
**Routes:** `/privacy/`, `/accessibility/`, and server-driven 404/410/unavailable responses  
**Source:** [Utility page specifications](../ux/utility-page-specifications.md)

## Scope and guardrails

These structures close the Phase 1 utility-page contract without inventing privacy terms, accessibility claims, support availability, legal wording, contacts, or response times. Cookie details remain within `/privacy/` unless an approved legal/technical decision requires a separate maintained route. A separate Terms / Legal Notice route is deferred unless legal review makes it applicable.

All utility pages inherit the shared shell, responsive, language, accessibility, motion, security, privacy, and content-governance contracts in this wireframe package. Policy and error content is Level 0 motion.

## Shared compact structure

```text
┌──────────────────────────────────┐
│ [Skip to main content]           │
│ [Approved identity → /]          │
│ [Emergency → /emergency/] [Menu] │
├──────────────────────────────────┤
│ MAIN                             │
│ [Status/page identity]           │
│ [Task-ordered content]           │
│ [Verified recovery/support]      │
├──────────────────────────────────┤
│ Footer: tasks | privacy | access │
└──────────────────────────────────┘
```

Desktop uses the shared horizontal header and a reading-width main column. Content order is identical; no sidebar may place essential policy, limitation, or recovery content out of reading order.

<a id="privacy-notice"></a>

## Privacy Notice — `/privacy/`

```text
{PV0} Shared shell / breadcrumb
{PV1} Privacy notice
      [Effective date] [Last reviewed] [Accountable owner]
{PV2} What this website handles
      [Task/data-flow summaries]
{PV3} How each data flow is handled
      [Purpose] [Data] [Recipients/access] [Retention] [Choices/rights]
{PV4} Cookies, logs and third parties
      [APPROVED CURRENT INVENTORY ONLY]
{PV5} Privacy contact / rights route
      [VERIFY: route, handling, escalation] [Related policies] [Footer]
```

| Section | Behavior and state contract | Requirements / gates |
| --- | --- | --- |
| `PV0` | Secondary utility route; shared navigation and language behavior remain available. | `G-001`–`G-007`, `S-008` |
| `PV1` | Show approved scope, dates, and owner; stale or ownerless notice blocks affected collection. | `G-014`, `S-004`, `GOV-01` |
| `PV2`–`PV3` | Organize by real production data flow, not generic legal boilerplate. Form-specific disclosure remains local to its form. | `S-003`–`S-005`, `APPT-03`, `HR-02`, `SEARCH-02` |
| `PV4` | Reflect the approved inventory. No provider is implied by the prototype or benchmark. | `S-005`, `SEC-02` |
| `PV5` | Link only to a tested approved contact/rights route. If required handling is unavailable, disable the affected collection. | `S-004`, `SAFE-01`, `SEC-02` |

<a id="accessibility-statement"></a>

## Accessibility Statement — `/accessibility/`

```text
{AX0} Shared shell / breadcrumb
{AX1} Accessibility statement
      [Scope] [Last reviewed] [Accountable owner]
{AX2} Ways to use the site
      [APPROVED TESTED FEATURES AND ALTERNATIVES]
{AX3} Known limitations
      [Truthful limitation] [Verified workaround if one exists]
{AX4} Report a barrier / request access support
      [VERIFY: route, required data, handling expectation]
      [Routine support — not emergency help]
{AX5} Testing and conformance basis
      [PERFORMED EVIDENCE ONLY] [Escalation if applicable] [Footer]
```

| Section | Behavior and state contract | Requirements / gates |
| --- | --- | --- |
| `AX0` | Shared semantic, language, keyboard, reflow, and no-JavaScript behavior. | `G-001`–`G-007`, `S-008` |
| `AX1` | Names current scope, review date, and owner without unsupported legal/conformance wording. | `G-010`, `G-014`, `GOV-01` |
| `AX2`–`AX3` | State only tested features, limitations, and verified alternatives. | `G-003`–`G-012`, `DEL-01` |
| `AX4` | Routine support is separated from Emergency. Personal-data collection requires approved privacy/security handling. | `S-003`, `S-004`, `SAFE-01`, `DEL-01` |
| `AX5` | Links evidence and records its limits; prototype automation is not certification. | `G-003`–`G-013`, `DEL-01` |

<a id="not-found-unavailable"></a>

## 404 / 410 / unavailable response

```text
{NF0} Minimal shared shell
{NF1} Page not found / Content no longer available / Temporarily unavailable
      [Concise non-blaming explanation]
{NF2} Continue with a task
      [Home] [Doctors] [Services] [Appointments]
      [Patient information] [Contact] [Search when available]
{NF3} Need urgent help or staffed support?
      [VERIFY: distinct approved actions]
{NF4} [Language-equivalent status when relevant] [Footer]
```

| Section | Behavior and state contract | Requirements / gates |
| --- | --- | --- |
| `NF0`–`NF1` | Preserve genuine HTTP status; no stack trace, internal identifier, unpublished title, or false-success shell. | `G-011`, `G-013`, `S-003` |
| `NF2` | Use canonical task routes. Search is optional; its failure never removes static recovery. | `G-001`, `G-007`, `H-005` |
| `NF3` | Emergency and staffed contacts appear only from approved canonical records and remain distinct. | `E-001`–`E-004`, `C-001`, `SAFE-01`–`SAFE-04` |
| `NF4` | Missing equivalents explain the gap in place and preserve safe context. | `S-006`–`S-008`, `LANG-01`, `LANG-02` |

## Review checklist

- [ ] `/privacy/`, `/accessibility/`, and the generic 404 render with the canonical route and section IDs above.
- [ ] Cookie information stays within Privacy unless a named legal/technical decision creates a maintained separate route.
- [ ] Terms / Legal Notice remains deferred unless legal review explicitly makes it applicable.
- [ ] Privacy content matches the production data-flow and third-party inventory.
- [ ] Accessibility claims match performed human and machine evidence and disclose material limitations.
- [ ] Support/reporting routes are approved, tested, privacy-reviewed where needed, and separated from Emergency.
- [ ] Unknown, retired, expired, unavailable, and missing-language destinations return the approved HTTP/redirect behavior.
- [ ] No soft 404, blanket Home redirect, unpublished-content leak, or search-only recovery exists.
- [ ] All three structures pass keyboard, screen-reader, 320/360/reflow, language, print where applicable, and no-JavaScript review.
