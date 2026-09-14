import { EssentialActionsFixtureTemplate } from '@/design-system/templates'

const statuses = [
  { description: 'Disabled', term: 'Personal-data collection' },
  { description: 'Disabled', term: 'External providers' },
  { description: 'Not mounted', term: 'CMS routes and content models' },
] as const

export default function BootstrapPage() {
  return <EssentialActionsFixtureTemplate statuses={statuses} />
}
