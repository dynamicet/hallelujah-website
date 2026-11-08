---
target: Help button and both functionality paths
total_score: 28
max_score: 40
na_heuristics:
p0_count: 0
p1_count: 1
target_identity: "file:/home/befikadusata/Devs/dynamik/halleluja-hospital/website/hallelujah/apps/web/src/design-system/components/help-widget.tsx"
target_fingerprint: "sha256:88d79989d7513066c368aec7e7c6670febd7d23e5fc54b1e7b9c2fd4b12040b8"
target_path: /home/befikadusata/Devs/dynamik/halleluja-hospital/website/hallelujah/apps/web/src/design-system/components/help-widget.tsx
timestamp: 2026-11-08T12-59-36Z
slug: design-system-components-help-widget-tsx-f4947aae
closed: true
---
# Help widget review

Independent UI Designer, UX Architect and Frontend Developer (requested Frontend Engineer) assessments coordinated with Impeccable. Preserve the two-option Help hub and general bottom-right placement. Review only; no UI edits.

## Design specificity and strengths
The hospital palette and typography tie the surface to the site, while the question-mark launcher and chat treatment remain generic. Preserve direct appointment and prepared-guide paths, progressive disclosure, large controls, readable replies, privacy hint and separate emergency link. The compact two-choice menu has low cognitive load. The guide has six equally weighted topics and substantial fixed chrome, creating more scanning and scrolling. Its modal expansion raises expectations beyond the compact menu.

## Priority issues
1. P1: Collision placement hides Help at phone/tablet starting views. Keep its corner, limit movement and provide dependable visible access; retain sensible suppression during typing/navigation. Suggested harden/adapt.
2. P2: Set expectations before entry. Proposed guide label: Ask the Patient Guide; supporting text: Prepared answers to website questions. Current appointment simulation should be clear before visitors enter details. Copy is proposed, not changed. Suggested clarify.
3. P2: Normalize option layout using leading icon, title, brief purpose, consistent padding. Current guide subtitle wraps while appointment has none. Keep dark teal launcher/light frame; use existing yellow highlight for appointments and information-blue for guide. Test a modest visible Help label at larger widths. Suggested layout/colorize/typeset.
4. P2: Reduce guide initial topic/chrome density and expose contact/directions sooner; use grouping or responsive compact columns. Preserve fixed composer and reading space. Carry valid doctor/service context into appointment route instead of always generic /appointment. Suggested adapt/distill.
5. P2: Prioritize substantive question over greeting. Tested visiting hours matches, while hello visiting hours only greets. Keep fallback suggestions and prepared answers. Suggested harden.

## Heuristic scores
System status 3; real-world match 2; user control 3; consistency 3; error prevention 3; recognition 2; efficiency 3; minimalism 3; error recovery 3; help/documentation 3. Total 28/40. Subjective design assessment, not accessibility certification.

## Personas
First-time visitor: Chat may overpromise understanding. Distracted mobile visitor: hidden Help and buried contact topics slow recovery. Keyboard visitor: native controls are a good foundation but hidden launcher access needs correction.

## Evidence
Fresh root responsive check / and /doctors passed at 390/768/1440; all six images opened separately. Focused Help screenshots opened at all three widths. Open panels used programmatic setup where launcher was hidden and do not prove manual access. Focused measurements confirm initial visibility hidden/lift144 at390/768 and visible/lift0 at1440 at900px height. Prepared hours/fallback responses, input focus, conversation retention on reopen and no browser errors were recorded under reduced motion. Detector returned zero findings; this does not establish design quality or engine correctness. Screen reader behavior was not verified.
Responsive evidence: artifacts/visual-checks/2026-11-08T12-56-06.317Z-responsive-k4kfpD.
Focused evidence: artifacts/visual-checks/2026-11-08T12-57-35.752Z-help-review-KzUiC0.

## Questions
Color: navy launcher with colorful options (recommended), or yellow launcher with restrained options?
Scope: complete Help flow including guide first screen and matching (recommended), or launcher/menu appearance only?

## Additional engineering findings and limits
P2: Lazy guide has no local error boundary; loading fallback renders outside the closed panel in normal document flow. Provide anchored loading/retry feedback. P3: Repeated identical replies may not update the live-region announcement (source concern only). Focused keyboard Escape/focus return and reopen persistence passed after visibility preparation. Focused visual inspection failed for disappearing Help. Detector script injection succeeded headlessly but no reliable user-visible overlay or informational console report was obtained. Browser closed; temporary live server stopped/no server reported. No normal-motion comparison or assistive-technology verification.
