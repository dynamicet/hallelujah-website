import { useId } from 'react'

import styles from './logo-reveal.module.css'

// These windows isolate existing pixels; they do not redraw the artwork.
const regions = [
  ['left', '0,0 109,0 109,79 86,111 96,134 125,161 140,181 140,252 0,252'],
  ['right', '174,0 280,0 280,252 145,252 145,173 183,129 202,114 174,65'],
  ['center', '138,25 171,25 171,81 155,116 146,162 128,111 133,67'],
  ['gold', '109,36 132,36 137,58 134,100 143,156 109,114'],
  ['pink', '172,72 192,72 194,111 163,141 148,162 152,119'],
  ['cyan', '92,87 109,87 111,107 124,126 133,157 111,139 93,120'],
] as const

export function LogoReveal() {
  const id = useId().replaceAll(':', '')
  return (
    <div className={styles.frame} data-logo-reveal>
      <svg aria-label="Hallelujah Hospital — people united in care" role="img" viewBox="0 0 280 252" className={styles.logo}>
        <defs>
          {regions.map(([name, points]) => (
            <clipPath id={`${id}-${name}`} key={name}><polygon points={points} /></clipPath>
          ))}
        </defs>
        <image data-logo-complete href="/brand/hallelujah-emblem.png" width="280" height="252" />
        <g data-logo-parts visibility="hidden" aria-hidden="true">
          {regions.map(([name]) => (
            <g data-logo-part={name} key={name}>
              <image clipPath={`url(#${id}-${name})`} href="/brand/hallelujah-emblem.png" width="280" height="252" />
            </g>
          ))}
        </g>
      </svg>
      <p className={styles.identity}>Hallelujah Hospital<span>People united in care</span></p>
      <script defer src="/logo-reveal.js" />
    </div>
  )
}
