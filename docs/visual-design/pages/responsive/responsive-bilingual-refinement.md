# Responsive and Bilingual Refinement Record

**Order:** 9  
**Decision:** Complete for non-public prototype use  
**Date:** 12 September 2026

## 1. Inputs and guardrails

The review consumed the complete Order 6–8 page and state studies, Order 4 foundation tokens, Order 5 component contracts, source wireframes, and the validation gates. Section IDs, page hierarchy, emergency route distinction, data-minimized appointment behavior, governed doctor/service relationships, text-first arrival, search boundaries, institutional evidence gates, and Careers fail-closed behavior remain unchanged.

The fixtures do not approve a brand, translation, contact, record, clinical statement, vacancy, privacy text, or operation. No network request, analytics, storage, cookie, live call, map, search, submission, upload, or third-party dependency was added.

## 2. Test matrix

| Condition | CSS viewport | Purpose |
| --- | ---: | --- |
| Compact minimum | 320 × 900 | Minimum supported one-axis layout and 400% reflow equivalent from 1280 CSS px |
| Compact reference | 360 × 900 | Common narrow mobile composition |
| Tablet reference | 768 × 1024 | Intermediate shell, directory, and split-layout behavior |
| Desktop reference | 1280 × 900 | Primary desktop composition |
| Wide desktop | 1440 × 900 | Maximum content/container behavior |
| 200% reflow equivalent | 640 × 900 | 1280 CSS px divided by 200%, without relying on device pixels |
| 400% reflow equivalent | 320 × 900 | 1280 CSS px divided by 400%, recorded separately from the compact pass |

Every condition ran against English, controlled Amharic geometry, mixed English/Ethiopic, deliberately expanded content, and unavailable-translation fixtures. The run covered 12 page studies plus the Appointment, care-discovery, and practical/institutional state boards: 525 render cases in total.

Reduced motion was forced through browser media emulation. The checks measured the root and visible element geometry for horizontal overflow and audited buttons, form controls, disclosures, choice labels, pagination, and navigation targets against a 44 × 44 px minimum. Native radio/checkbox indicators were evaluated through their padded `.choice` labels rather than as standalone targets.

## 3. Findings and corrections

| ID | Finding | Affected condition | Correction | Status |
| --- | --- | --- | --- | --- |
| `R9-01` | The 640 px boundary retained two-column card collections with too little margin for expanded copy. | 200% equivalent, long content | Collapse task, card, and record grids at the safer 48 rem boundary. | Resolved |
| `R9-02` | A long Search action could consume the tablet search grid and compress its field below a usable width. | Tablet and 200% equivalent | Stack search field and action through the 64 rem compact/tablet range. | Resolved |
| `R9-03` | `width: max-content` on the result-type label allowed an Ethiopic fixture to establish an oversized intrinsic result column. | Search Results, Amharic, 320–768 px | Use `fit-content`, cap the label and result chain at 100%, and use a zero-minimum compact directory track. | Resolved |
| `R9-04` | The About story media combined a 4:3 aspect ratio with a 15 rem minimum height, forcing a 320 px box inside a 296 px content area. | About, 320 px / 400% equivalent | Remove the aspect-ratio constraint at the minimum compact range while retaining the deliberate media height. | Resolved |
| `R9-05` | Short breadcrumb/navigation labels could render 40 px wide despite meeting the 44 px height. | About, Careers, strict target audit | Apply the shared 44 px inline minimum to primary, compact, and breadcrumb navigation targets. | Resolved |
| `R9-06` | Long and Ethiopic navigation could avoid overflow yet crowd the identity and create an excessively tall desktop header. | Amharic and expanded-content visual review | Use the compact menu shell for Amharic and configured long-navigation modes; stack its menu control below the identity at narrow widths. | Resolved |
| `R9-07` | Latin uppercase/tracking and compact label line-height were unsuitable defaults for Ethiopic text. | Amharic and mixed-script | Remove uppercase/tracking from Ethiopic eyebrow/step labels and apply a 1.6 interactive-label line height. | Resolved |
| `R9-08` | Long labels needed stronger shared wrapping protection across shell, status, form, and record surfaces. | All long-content conditions | Add text-size adjustment, intrinsic-size caps, safe wrapping, media max-width, and manipulation touch behavior in one inherited layer. | Resolved |

The source reading order remains header → breadcrumb where present → main sections in accepted section-ID order → support → footer. The refinements change grid tracks and shell presentation only; they do not use CSS to create a contradictory content order. The fixture script changes test copy and labels its state but does not move content nodes.

## 4. Result

- 525 of 525 final Chromium render cases passed the automated geometry checks.
- No final case produced page-level horizontal scrolling.
- No audited interactive target was below 44 × 44 px.
- Nine representative full-page captures were inspected after the final corrections.
- English, Ethiopic, mixed-script, long-content, and unavailable-translation states remain visibly distinguishable from approved content.
- Emergency content remains immediate and motion-independent; all evidence was captured with reduced motion forced.

## 5. Evidence boundary

This is performed local Chromium layout testing, not a claim of comprehensive accessibility or translation validation. The CSS-pixel 640/320 reflow method is equivalent to the available layout space at 200%/400% from a 1280 CSS px reference, but browser UI zoom controls were not operated manually. The automated check does not establish text meaning, visible focus quality through an entire journey, screen-reader announcements, keyboard sequence, forced-color fidelity, touch accuracy on hardware, low-end-device performance, cross-browser parity, or human comprehension.

Professional Amharic review and hospital approval remain required. The generated Amharic text intentionally repeats neutral layout language and must not enter a content system. Order 10 must preserve fixture identity and controlled operations; Order 11 must perform the remaining interaction, assistive-technology, browser, and device checks.

## 6. Reproduction

Start a local headless Chromium debugging target, then run:

```text
node hallelujah/docs/visual-design/pages/responsive/audit-order-9.mjs
```

The runner expects port `9222` by default; set `ORDER9_DEBUG_PORT` to use another local debugging port. It replaces the JSON report and the named representative PNG captures in `responsive/evidence/`.
