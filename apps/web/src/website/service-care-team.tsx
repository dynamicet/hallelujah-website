import Link from 'next/link'
import { ClinicianPortrait } from '@/design-system/components'
import styles from './service-page.module.css'

export function ServiceCareTeam({ doctors }: {
  readonly doctors: readonly { readonly publicId: string; readonly name: string; readonly specialties: readonly string[]; readonly href: string; readonly portraitSrc?: string }[]
}) {
  return <ul className={styles.careTeam}>{doctors.map((doctor) => <li className={styles.careTeamMember} key={doctor.publicId}>
    <Link href={doctor.href} aria-label={`View profile for ${doctor.name}`}>
      <ClinicianPortrait name={doctor.name} src={doctor.portraitSrc} />
      <span className={styles.doctorDetails}><strong>{doctor.name}</strong><span>{doctor.specialties.join(' · ')}</span><span data-ui-part="profile-action" className={styles.profileAction}>View profile <span aria-hidden="true">→</span></span></span>
    </Link>
  </li>)}</ul>
}
