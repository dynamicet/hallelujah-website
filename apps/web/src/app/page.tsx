import { EssentialActionsFixtureTemplate } from '@/design-system/templates'

const statuses = [
  { description: 'Disabled', term: 'Personal-data collection' },
  { description: 'Disabled', term: 'External providers' },
  { description: 'Not mounted', term: 'CMS routes and content models' },
] as const

interface BootstrapPageProps {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function BootstrapPage({ searchParams }: BootstrapPageProps) {
  return (
    <EssentialActionsFixtureTemplate
      searchParameters={await searchParams}
      statuses={statuses}
    />
  )
}
