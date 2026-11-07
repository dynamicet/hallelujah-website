/** Opt in only documents that actually render the care directory or a profile.
 * Native anchors remain the no-JS fallback; enhanced links reuse the app shell.
 */
export function ClinicianTransition() {
  // React hoists this stylesheet to the head, before the incoming page is revealed.
  return <style data-clinician-transition href="care-identity-transitions" precedence="default">{`
    [data-care-transition-name] { view-transition-class: care-name; }
    :root[data-care-profile-transition] { overflow-anchor: none; scroll-behavior: auto; }
    :root[data-care-profile-transition] [data-clinician-public-id]:not([data-selected-care-transition])
      :is([data-clinician-portrait], [data-clinician-monogram], [data-care-transition-name]) {
      view-transition-name: none !important;
    }
    @media (prefers-reduced-motion: no-preference) {
      @view-transition { navigation: auto; }

      ::view-transition-group(*) {
        animation-duration: 380ms;
        animation-timing-function: cubic-bezier(.16, 1, .3, 1);
      }
      ::view-transition-old(*), ::view-transition-new(*) {
        animation-duration: 380ms;
        block-size: 100%;
        inline-size: 100%;
        object-fit: contain;
        object-position: center bottom;
        mix-blend-mode: normal;
      }
      ::view-transition-image-pair(*) { overflow: clip; }
      /* A single crisp name avoids double lettering while the directory's
         sans-serif title becomes the profile's editorial heading. */
      ::view-transition-old(.care-name) { display: none; }
      ::view-transition-new(.care-name) {
        animation: none;
        object-position: left center;
      }
      /* Only identities present on both pages travel. Unrelated cards and the
         page shell change immediately rather than fading or flying away. */
      ::view-transition-old(*):only-child,
      ::view-transition-old(root) { display: none; }
      ::view-transition-new(*):only-child,
      ::view-transition-new(root) { animation: none; }
      ::view-transition-group(root) { animation: none; }
    }
    @media (prefers-reduced-motion: reduce) {
      ::view-transition-group(*), ::view-transition-old(*),
      ::view-transition-new(*) { animation: none !important; }
    }
  `}</style>
}

/** Encode the complete ID to keep CSS identifiers valid and collision-free. */
export function clinicianTransitionName(id: string, part: 'portrait' | 'name') {
  return `care-${part}-${Array.from(id, character => character.codePointAt(0)!.toString(16)).join('-')}`
}
