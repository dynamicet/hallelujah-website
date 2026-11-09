import { isLocalDemo } from '@/server/environment'
import { notFound } from 'next/navigation'
import { EmergencyAction, LanguageSwitcher, type SiteShellProps } from '@/design-system/components'
import type { ClinicianView } from '@/content/clinician-view'
import type { ServiceView } from '@/content/service-view'
import data from './data.json'
import { demoPatientGuide } from './patient-guide'
import { specialtyServiceExamples, additionalExamples } from './specialties'
import { careEntry, doctorSpecialties } from './care-model'
import { hospitalContact } from '@/website/hospital-contact'

// Frozen, fictional presentation data. No credentials, workflow documents, or runtime fixture imports.
export const clinicians = data.clinicians.map((entry): ClinicianView => ({
  ...entry, locale: 'en', portrait: null, schedule: null,
  details: {
    ...entry.details,
    specialties: doctorSpecialties(entry.publicId),
    availabilityGuidance: 'The team will discuss available appointment times with you.',
    languages: entry.publicId === 'pub_101010101010'
      ? [...entry.details.languages, 'French']
      : entry.details.languages,
  },
  appointment: { state: 'withheld', doctorPublicId: entry.publicId },
}))
export const clinicianBiographies = new Map(data.clinicians.map((entry) => [entry.publicId, entry.biography]))
export const services = [...data.services, ...specialtyServiceExamples, ...additionalExamples].map((entry): ServiceView => ({
  ...entry, locale: 'en',
  name: careEntry(entry.publicId)?.name ?? entry.name,
  synonyms: [...new Set([...entry.synonyms, ...(careEntry(entry.publicId)?.synonyms ?? [])])],
  sections: { ...entry.sections, scope: [careEntry(entry.publicId)?.scope ?? 'Discuss your care needs and prepare your questions before visiting.'] },
  appointment: { state: 'withheld', servicePublicId: entry.publicId },
}))
export { data }
export type DemoSearchParams = Promise<Record<string, string | string[] | undefined>>

export function requireLocalDemo() {
  if (!isLocalDemo()) notFound()
}

export function demoShell(current: string): Omit<SiteShellProps, 'children'> {
  const navigationItems = [
    { href: '/', label: 'Home' },
    { href: '/doctors', label: 'Doctors' },
    { href: '/services', label: 'Services' },
    { href: '/appointment', label: 'Appointment' },
    { href: '/patients-visitors', label: 'Patients & Visitors' },
  ].map((item) => ({ ...item, current: item.href === current || (item.href === '/services' && current.startsWith('/services/')) }))
  return {
    patientGuide: demoPatientGuide,
    skipLinkLabel: 'Skip to main content',
    header: {
      contactTargets: { call: hospitalContact.phoneHref },
      contactHref: current === '/' ? '#home-directions' : '/contact',
      contactCurrent: current === '/contact',
      brandMark: <HospitalBrandMark />,
      brandName: 'Hallelujah Hospital', homeHref: '/', homeLabel: 'Hallelujah Hospital home',
      identityLanguage: 'en', menuLabel: 'Menu', navigationMode: 'responsive',
      primaryNavigationLabel: 'Primary navigation', navigationItems,
      searchItem: { href: '/doctors#directory-search-title', label: 'Search doctors' },
      emergencyAction: <EmergencyAction compact href="/emergency" label="Emergency information" />,
      languageSwitcher: <LanguageSwitcher alternate={{ available: false, label: 'አማርኛ', lang: 'am', reason: 'This page is unavailable in Amharic.' }} currentLabel="English" currentLang="en" label="Language" />,
    },
    footer: {
      contact: hospitalContact,
      variant: current === '/' ? 'full' : 'compact',
      brandName: 'Hallelujah Hospital',
      navigationLabel: 'Footer navigation', groups: [
        { label: 'Find care', links: [
          { href: '/doctors', label: 'Find a doctor' },
          { href: '/services', label: 'Specialties & services' },
          { href: '/appointment', label: 'Request an appointment' },
          { href: '/referrals', label: 'Refer a patient' },
          { href: '/emergency', label: 'Emergency information' },
        ] },
        { label: 'Plan your visit', links: [
          { href: '/patients-visitors', label: 'Patients & visitors' },
          { href: '/contact', label: 'Contact & directions' },
          { href: '/faq', label: 'Frequently asked questions' },
          { href: '/patient-rights', label: 'Patient rights & responsibilities' },
          { href: '/privacy', label: 'Privacy notice' },
        ] },
        { label: 'Our hospital', links: [
          { href: '/about', label: 'About Hallelujah' },
          { href: '/news-resources', label: 'News & resources' },
          { href: '/health-topics', label: 'Health & care topics' },
          { href: '/feedback', label: 'Patient feedback' },
          { href: '/careers', label: 'Careers' },
        ] },
      ],
    },
  }
}

function HospitalBrandMark() {
  // Bundled hospital identity; portraits are never inferred from this asset.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/brand/hallelujah-emblem.png" width="50" height="45" alt="" />
}
