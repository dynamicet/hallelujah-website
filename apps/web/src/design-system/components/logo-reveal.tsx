import { useId } from 'react'

import styles from './logo-reveal.module.css'

// Extract the existing artwork's boundaries without tracing or changing its geometry.
export function LogoReveal({ overlay = false }: { readonly overlay?: boolean }) {
  const id = `outline-${useId().replaceAll(':', '')}`
  return (
    <div className={overlay ? styles.overlay : styles.frame} data-logo-reveal data-logo-overlay={overlay || undefined}>
      <svg aria-label="Hallelujah Hospital" role="img" viewBox="0 0 280 252" className={styles.logo}>
        <defs>
          <filter id={id} x="-2%" y="-2%" width="104%" height="104%" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3 -3 -3 8.4 0" />
            <feMorphology operator="dilate" radius="0.65" result="outer" />
            <feMorphology in="outer" operator="erode" radius="1.25" result="inner" />
            <feComposite in="outer" in2="inner" operator="out" />
          </filter>
        </defs>
        <image data-logo-outline href="/brand/hallelujah-emblem.png" width="280" height="252" filter={`url(#${id})`} />
      </svg>
      {overlay ? <script defer src="/logo-reveal.js" /> : null}
    </div>
  )
}
