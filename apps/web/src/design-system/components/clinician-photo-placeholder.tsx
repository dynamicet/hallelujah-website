import styles from './clinician-photo-placeholder.module.css'

export function ClinicianPhotoPlaceholder({ profile = false }: { readonly profile?: boolean }) {
  return <div className={`${styles.placeholder} ${profile ? styles.profile : styles.card}`}
    data-clinician-photo-placeholder role="img" aria-label="Clinician photo pending">
    <span aria-hidden="true">Photo pending</span>
  </div>
}
