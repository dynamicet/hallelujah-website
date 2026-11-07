import { visitGuides } from '@/demo/visit-guides'
import { ServiceDirectoryTemplate } from '@/design-system/templates'
import { serviceDirectoryFromViews } from '@/content/service-directory'
import { services, data, demoShell, requireLocalDemo, type DemoSearchParams } from '@/demo/site'
import { demoScenario } from '@/demo/scenarios'

export const metadata = { title: 'Services | Hallelujah Hospital' }

export default async function ServicesPage({ searchParams }: { searchParams: DemoSearchParams }) {
  requireLocalDemo()
  const parameters = await searchParams
  const state = demoScenario(parameters.demo, ['ready', 'loading', 'empty', 'failure', 'offline'] as const, 'ready')
  const directory = serviceDirectoryFromViews({ entries: services.filter((service) => !visitGuides[service.publicId]), filters: data.serviceFilters,
    locale: 'en', pageSize: 6, searchParameters: parameters, urgentTerms: ['emergency', 'urgent'] })
  return <ServiceDirectoryTemplate directory={directory} pathname="/services" serviceRequestLinks serviceDetailLinks preparationGuides={services.filter((service) => visitGuides[service.publicId]).map((service) => ({ href: service.canonicalPath, ...visitGuides[service.publicId] }))} shell={demoShell('/services')} state={state} />
}
