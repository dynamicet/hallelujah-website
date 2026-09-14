import { ControlledBootstrapTemplate } from '@/design-system/templates'

const statuses = [
  { description: 'Disabled', term: 'Personal-data collection' },
  { description: 'Disabled', term: 'External providers' },
  { description: 'Not mounted', term: 'CMS routes and content models' },
] as const

export default function BootstrapPage() {
  return (
    <ControlledBootstrapTemplate
      description="The clean Next.js, Payload CMS, and TypeScript foundation is running. No hospital content is published from this build."
      eyebrow="Local development only"
      statuses={statuses}
      title="Controlled application bootstrap"
    />
  )
}
