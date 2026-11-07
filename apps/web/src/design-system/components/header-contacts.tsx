import { Icon } from './icon'
import styles from './hospital-shell.module.css'

export interface HeaderContactTargets {
  readonly call?: `tel:+${string}`
  readonly previewNumber?: string
  readonly whatsapp?: `https://wa.me/${string}`
  readonly telegram?: `https://t.me/${string}`
}

const channels = [
  { key: 'call', label: 'Call us', detail: '', description: 'Call reception', unavailable: 'Reception number' },
  { key: 'whatsapp', label: 'WhatsApp', detail: '', description: 'Message the hospital on WhatsApp', unavailable: 'WhatsApp conversation' },
  { key: 'telegram', label: 'Telegram', detail: '', description: 'Message the hospital on Telegram', unavailable: 'Telegram conversation' },
] as const

export function HeaderContacts({ targets = {} }: { readonly targets?: HeaderContactTargets }) {
  const receptionNumber = targets.call?.slice(4).replace(/^(\+251)(\d{2})(\d{3})(\d{4})$/, '$1 $2 $3 $4') ?? targets.previewNumber
  return (
    <div aria-label="Contact the hospital" className={styles.contactActions} data-header-contacts role="group">
      {channels.map(({ key, label, detail, description, unavailable }) => {
        const content = <>
          <span aria-hidden="true" className={styles.contactIcon}>
            {key === 'call' ? <Icon name="phone" /> : (
              // Official, locally bundled brand assets; each control has an accessible name.
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="" height="22" src={`/brand/contact/${key}.svg`} width="22" />
            )}
          </span>
          <span className={styles.contactLabel}>
            {label}{detail ? <span className={styles.contactDetail}>{detail}</span> : null}
          </span>
        </>
        return targets[key] ? (
          <a aria-label={key === 'call' ? `${description}: ${receptionNumber}` : description} className={styles.contactAction} data-contact-channel={key} href={targets[key]} key={key} title={description}>
            {content}
          </a>
        ) : (
          <button
            aria-disabled="true"
            aria-label={`${description}. Preview only; not connected.`}
            className={styles.contactAction}
            data-contact-channel={key}
            key={key}
            title={`Preview only. ${unavailable} is not connected.`}
            type="button"
          >
            {content}
          </button>
        )
      })}
    </div>
  )
}
