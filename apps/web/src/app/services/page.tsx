import { visitGuides } from '@/demo/visit-guides'
import { ServiceDirectoryTemplate } from '@/design-system/templates'
import { serviceDirectoryFromViews } from '@/content/service-directory'
import { services, data, demoShell, requireLocalDemo, type DemoSearchParams } from '@/demo/site'
import { demoScenario } from '@/demo/scenarios'
import { appointmentHref, careEntry } from '@/demo/care-model'

export const metadata = { title: 'Specialties & services | Hallelujah Hospital' }

export default async function ServicesPage({ searchParams }: { searchParams: DemoSearchParams }) {
  requireLocalDemo()
  const parameters = await searchParams
  const state = demoScenario(parameters.demo, ['ready', 'loading', 'empty', 'failure', 'offline'] as const, 'ready')
  const directory = serviceDirectoryFromViews({ entries: services.filter((service) => !visitGuides[service.publicId]), filters: data.serviceFilters,
    groupOrder: ['grp_202020202020', 'grp_303030303030', 'grp_101010101010'],
    locale: 'en', pageSize: 6, searchParameters: parameters, urgentTerms: ['emergency', 'urgent'] })
  const serviceActions = Object.fromEntries(services.map((service) => {
    const access = careEntry(service.publicId)?.access
    const action = access === 'appointment' ? { href: appointmentHref({ serviceId: service.publicId }), label: 'Request an appointment' }
      : access === 'referral' ? { href: '/referrals', label: 'Referral & admission guidance' }
      : access === 'emergency' ? { href: '/emergency', label: 'Emergency information' }
      : { href: '/#home-call', label: 'Contact reception' }
    return [service.publicId, action]
  }))
  return <ServiceDirectoryTemplate directory={directory} pathname="/services" serviceActions={serviceActions} serviceDetailLinks preparationGuides={services.filter((service) => visitGuides[service.publicId]).map((service) => ({ href: service.canonicalPath, ...visitGuides[service.publicId] }))} shell={demoShell('/services')} state={state} />
}
