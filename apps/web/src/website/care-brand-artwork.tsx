import styles from './care-brand-artwork.module.css'

/** Decorative geometry inspired by the emblem's open, embracing composition.
 * This is supporting artwork, not a replacement or reconstruction of the logo.
 */
export function CareBrandArtwork({ className = '' }: { className?: string }) {
  return (
    <svg className={`${styles.artwork} ${className}`} data-care-artwork aria-hidden="true" focusable="false" width="360" height="200" viewBox="0 0 360 200" fill="none">
      <path className={styles.cyan} d="M38 38v40c0 56 46 102 102 102M322 38v40c0 56-46 102-102 102" strokeWidth="28" />
      <path className={styles.orange} d="M112 98a68 68 0 0 1 136 0" strokeWidth="14" />
      <path className={styles.magenta} d="M132 98a48 48 0 0 1 96 0" strokeWidth="14" />
      <circle className={styles.yellow} cx="180" cy="98" r="26" />
    </svg>
  )
}
