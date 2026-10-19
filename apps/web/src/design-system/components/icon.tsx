import styles from './essential-actions.module.css'

export const iconNames = ['arrow-right', 'emergency', 'phone', 'person', 'care', 'calendar', 'directions'] as const

export type IconName = (typeof iconNames)[number]

export interface IconProps {
  readonly name: IconName
}

export function Icon({ name }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={styles.icon}
      data-icon={name}
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {name === 'arrow-right' ? (
        <>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </>
      ) : null}
      {name === 'emergency' ? (
        <>
          <path d="M8 17h8" />
          <path d="M9 17V9a3 3 0 0 1 6 0v8" />
          <path d="M6 21h12" />
          <path d="M5 9H3" />
          <path d="m7 4-1.5-1.5" />
          <path d="M19 9h2" />
          <path d="m17 4 1.5-1.5" />
        </>
      ) : null}
      {name === 'person' ? (
        <><circle cx="12" cy="7" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>
      ) : null}
      {name === 'care' ? (
        <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6Z" />
      ) : null}
      {name === 'calendar' ? (
        <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 11h18m-13 5h3" /></>
      ) : null}
      {name === 'directions' ? (
        <><path d="m12 2 10 10-10 10L2 12Z" /><path d="M8 15v-4h8m-3-3 3 3-3 3" /></>
      ) : null}
      {name === 'phone' ? (
        <path d="M7.2 3.5 9.5 7l-1.8 1.8a14.5 14.5 0 0 0 7.5 7.5l1.8-1.8 3.5 2.3-.8 3.2a2 2 0 0 1-2 1.5A15.2 15.2 0 0 1 2.5 6.3a2 2 0 0 1 1.5-2Z" />
      ) : null}
    </svg>
  )
}
