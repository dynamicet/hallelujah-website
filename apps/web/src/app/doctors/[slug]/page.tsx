import { demoClinicianPortraits } from '@/demo/clinician-portraits'
import { notFound } from 'next/navigation'
import { ClinicianProfileTemplate } from '@/design-system/templates'
import { clinicianDirectoryFromViews, clinicianDirectoryUrl } from '@/content/clinician-directory'
import { clinicianBiographies, clinicians, data, demoShell, requireLocalDemo, services, type DemoSearchParams } from '@/demo/site'
import { demoScenario } from '@/demo/scenarios'
import { relatedServiceIds } from '@/demo/service-details'
import { doctorSearchTerms } from '@/demo/care-discovery'
import { healthTopics } from '@/demo/health-topics'

async function resolveClinician(params: Promise<{ slug: string }>) {
  requireLocalDemo()
  const { slug } = await params
  const clinician = clinicians.find((entry) => entry.canonicalPath === `/doctors/${slug}/`)
  if (!clinician) notFound()
  return clinician
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const clinician = await resolveClinician(params)
  return { title: `${clinician.details.name} | Hallelujah Hospital` }
}

export default async function DoctorProfilePage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: DemoSearchParams }) {
  const clinician = await resolveClinician(params)
  const parameters = await searchParams
  const scenario = demoScenario(parameters.demo,
    ['ready', 'partial', 'failure', 'gone', 'unavailable', 'appointment-unavailable'] as const, 'ready')
  const partial = scenario === 'partial' || (scenario === 'ready' && clinician.details.interests.length === 0)
  const displayedClinician = partial ? { ...clinician, details: {
    ...clinician.details, credentials: [], interests: [], languages: [], availabilityGuidance: null,
  } } : clinician
  const related = services.filter((service) => relatedServiceIds(clinician.details.specialties).includes(service.publicId))
  const selectedService = related.find((service) => service.publicId === parameters.service)
  const topics = healthTopics.filter((topic) => related.some((service) => topic.servicePublicId === service.publicId))
  let directoryHref = '/doctors'
  if (typeof parameters.from === 'string' && parameters.from.startsWith('/doctors')) {
    const source = new URL(parameters.from, 'https://local.invalid')
    if (source.origin === 'https://local.invalid' && source.pathname === '/doctors') {
      const directory = clinicianDirectoryFromViews({ entries: clinicians, filters: data.clinicianFilters, locale: 'en',
        searchTerms: doctorSearchTerms(source.searchParams.get('q') ?? '', clinicians, services),
        pageSize: 12, searchParameters: source.searchParams })
      directoryHref = clinicianDirectoryUrl('/doctors', directory.state, data.clinicianFilters.map((filter) => filter.value))
    }
  }
  return <ClinicianProfileTemplate portraitSrc={demoClinicianPortraits[clinician.publicId]} appointmentHref={`/appointment?doctor=${encodeURIComponent(clinician.publicId)}${selectedService ? `&service=${encodeURIComponent(selectedService.publicId)}` : ''}`}
    serviceContext={selectedService ? { name: selectedService.name, href: selectedService.canonicalPath } : undefined}
    biography={partial ? undefined : clinicianBiographies.get(clinician.publicId)}
    directoryHref={directoryHref}
    relatedTopics={partial ? [] : topics.map((topic) => ({ name: topic.name, href: `/health-topics/${topic.id}` }))}
    profile={{ clinician: displayedClinician, canonicalPath: clinician.canonicalPath,
      locations: partial ? [] : [{ publicId: 'demo-care-desk', title: 'Outpatient care desk' }],
      relatedServices: partial ? [] : related.map((service) => ({
        canonicalPath: service.canonicalPath, name: service.name, publicId: service.publicId,
      })), outcome: 'profile' }}
    shell={{ ...demoShell('/doctors'), breadcrumbs: { label: 'Breadcrumb', items: [
      { href: '/', label: 'Home' }, { href: '/doctors', label: 'Doctors' },
      { href: clinician.canonicalPath, label: clinician.details.name, current: true },
    ] } }} state={partial ? 'ready' : scenario} />
}
