import { requestAppointmentLabel } from '@/appointment/copy'
import type { SiteFooterProps } from '@/design-system/components/global-shell'
import { hospitalContact } from './hospital-contact'

export const hospitalCollaborationLink = { href: '/partnerships', label: 'Work with us' } as const

// One footer configuration for the public site, including fallback home states.
export const hospitalFooter = {
  variant: 'full',
  brandName: 'Hallelujah Hospital',
  contact: hospitalContact,
  navigationLabel: 'Footer navigation',
  groups: [
    { label: 'Find care', links: [
      { href: '/doctors', label: 'Find a doctor' },
      { href: '/services', label: 'Care & services' },
      { href: '/appointment', label: requestAppointmentLabel },
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
      { href: '/about', label: 'About Us' },
      hospitalCollaborationLink,
      { href: '/news-resources', label: 'News & resources' },
      { href: '/health-topics', label: 'Health & care topics' },
      { href: '/feedback', label: 'Patient feedback' },
      { href: '/careers', label: 'Careers' },
    ] },
  ],
  // Destinations published by the hospital's LinkedIn account; provenance:
  // docs/brand/footer-social-links.md. No third-party embeds or tracking scripts.
  socialLinks: [
    { platform: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/hallelujah.hospital' },
    { platform: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/official_hallelujahospital/' },
    { platform: 'tiktok', label: 'TikTok' },
    { platform: 'telegram', label: 'Telegram' },
    { platform: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/hallelujah-general-hospital/' },
  ],
} as const satisfies SiteFooterProps
