# D4 — Component interaction continuity

Implemented using ui-ux-pro-max and the repository motion amendment. Taste was not used.

## Direction

Make state changes feel connected to the control that caused them. D3 supplies the larger editorial scenes; D4 supplies short, direct responses with stable hit targets. Native CSS transitions and the Web Animations API cover this work without a new runtime.

| Component | Trigger and purpose | Motion | Static fallback |
| --- | --- | --- | --- |
| Care mode | Radio selection connects Doctors and Services | Selection underline travels between options in 240ms; surface/border follow | Checked radio, label and search destination update immediately; typed query and focus survive |
| Partner list | Explicit expand/collapse preserves logo identity | Visible items move from their current painted positions into the new layout in 360ms; newly visible items enter 12px/.6 opacity | Grid updates immediately; same toggle and names remain available |
| Partner toggle | Communicate expansion | Plus rotates into a close mark in 240ms | Text and aria-expanded identify state |
| Mobile/tablet navigation | Connect menu control to its open state | Three strokes become a close mark; ordinary links settle 6px in 240ms; exit 160ms | Native popover, Escape, outside dismissal and focus return |
| Service cards | Indicate destination and readiness | Background transition, directional arrow and a growing action underline | Text, visible focus and selected surface |
| Routine links/search | Confirm hover/focus/press | Arrows move 4px, returning toward their resting position on press | Target geometry and activation remain immediate |

Emergency quick-access actions are excluded from the new directional motion. Emergency menu content does not inherit the ordinary navigation-link movement. No stagger delays interactive access.

## Interruption and implementation

Partner layout reads are batched before animation writes and only viewport-visible destinations animate. Repeated toggles capture current painted positions before cancelling the previous animation. Resize, live reduced-motion changes and unmount cancel active movements. Container height resolves immediately rather than animating the length of the page. Native horizontal scrolling remains available in the collapsed strip.

CSS motion is gated by prefers-reduced-motion. Native radio and popover behavior remains authoritative. Unsupported discrete transitions fall back to immediate menu closure. Without JavaScript, the existing service search fallback, scrollable partner strip and native menu remain usable.

## Validation — 6 November 2026

- TypeScript, targeted ESLint and diff whitespace checks passed.
- Component browser checks passed at 390/768/1440px: native radio keyboard switching, retained query/destination, partner intermediate animation, rapid reversals, stable toggle position/focus, menu Escape/focus return, live reduced motion, no overflow/errors.
- No-JavaScript checks passed for service search fallback, partner availability and native menu.
- Fresh responsive checks passed for / and /doctors at all three widths.
- Visual review separately inspected all 11 component-state captures and all six responsive captures. Focus rings, selected states, menu spacing and partner grids were coherent; a doubled radio focus ring found during review was corrected before the final captures.
- Current preview process resolved to this worktree's apps/web, and the browser asserted the newly added header marker.

Evidence:
- artifacts/visual-checks/2026-11-06T12-13-42.662Z-component-interactions-2Bi1Yc
- artifacts/visual-checks/2026-11-06T12-14-07.190Z-responsive-1nDeJA

Run `pnpm visual:interactions` and `pnpm visual:check / /doctors` against a current preview. These are Chromium checks; cross-browser/device performance and assistive-technology review remain D7. D5 reader/detail continuity and D6 media activation are separate remaining deliverables.
