import { requestAppointmentLabel } from '@/appointment/copy'
import { servicePresentation } from '@/website/service-presentation'
import { directoryServices } from '@/demo/service-directory-return'
import { ServiceDirectoryTemplate } from '@/design-system/templates'
import { serviceDirectoryFromViews } from '@/content/service-directory'
import { data, requireLocalDemo, type DemoSearchParams } from '@/demo/site'
import { demoScenario } from '@/demo/scenarios'
import { appointmentHref, careEntry } from '@/demo/care-model'

export const metadata = { title: 'Specialties & services | Hallelujah Hospital',
  description: 'Explore specialties, tests and treatments, meet related care teams, and prepare for your visit to Hallelujah Hospital.'
}

export default async function ServicesPage({ searchParams }: { searchParams: DemoSearchParams }) {
  requireLocalDemo()
  const parameters = await searchParams
  const state = demoScenario(parameters.demo, ['ready', 'loading', 'empty', 'failure', 'offline'] as const, 'ready')
  const directory = serviceDirectoryFromViews({ entries: directoryServices, filters: data.serviceFilters,
    groupOrder: ['grp_202020202020', 'grp_303030303030', 'grp_101010101010'],
    locale: 'en', pageSize: 6, searchParameters: parameters, urgentTerms: ['emergency', 'urgent'] })
  const serviceActions = Object.fromEntries(directoryServices.map((service) => {
    const access = careEntry(service.publicId)?.access
    const action = access === 'appointment' ? { href: appointmentHref({ serviceId: service.publicId }), label: requestAppointmentLabel }
      : access === 'referral' ? { href: service.canonicalPath, label: 'Admission guidance' }
      : access === 'emergency' ? { href: '/emergency', label: 'Emergency information' }
      : { href: '/contact#contact-reception', label: 'Contact reception' }
    return [service.publicId, action]
  }))
  return <ServiceDirectoryTemplate directory={directory} servicePresentations={Object.fromEntries(directoryServices.map(service => [service.publicId, servicePresentation(service.publicId)]))} pathname="/services" serviceActions={serviceActions} serviceDetailLinks state={state} />
}
