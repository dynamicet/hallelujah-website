import { demoClinicianPortraits } from '@/demo/clinician-portraits'
import { notFound } from 'next/navigation'
import { ClinicianProfileTemplate } from '@/design-system/templates'
import { clinicianDirectoryFromViews, clinicianDirectoryUrl } from '@/content/clinician-directory'
import { clinicianBiographies, clinicians, requireLocalDemo, services, type DemoSearchParams } from '@/demo/site'
import { demoScenario } from '@/demo/scenarios'
import { relatedCareIds, carePathWithDoctor, appointmentHref, clinicianFilters, isRequestableCare, careEntry } from '@/demo/care-model'
import { doctorSearchTerms } from '@/demo/care-discovery'
import { serviceDirectorySource } from '@/demo/service-directory-return'

async function resolveClinician(params: Promise<{ slug: string }>) {
  requireLocalDemo()
  const { slug } = await params
  const clinician = clinicians.find((entry) => entry.canonicalPath === `/doctors/${slug}/`)
  if (!clinician) notFound()
  return clinician
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const clinician = await resolveClinician(params)
  return { title: `${clinician.details.name} | Hallelujah Hospital`,
    description: `Explore ${clinician.details.name}’s profile${clinician.details.specialties.length ? ` and areas of care: ${clinician.details.specialties.join(', ')}` : ', and prepare for your visit to Hallelujah Hospital'}.` }
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
  const related = services.filter((service) => relatedCareIds(clinician.publicId).includes(service.publicId))
  const selectedService = related.find((service) => service.publicId === parameters.service && isRequestableCare(service.publicId))
  const serviceResultsHref = serviceDirectorySource(parameters.from)
  let directoryHref: string | undefined
  if (typeof parameters.from === 'string' && parameters.from.startsWith('/doctors')) {
    const source = new URL(parameters.from, 'https://local.invalid')
    if (source.origin === 'https://local.invalid' && source.pathname === '/doctors') {
      const directory = clinicianDirectoryFromViews({ entries: clinicians, filters: clinicianFilters, locale: 'en',
        searchTerms: doctorSearchTerms(source.searchParams.get('q') ?? '', clinicians, services),
        pageSize: 12, searchParameters: source.searchParams })
      directoryHref = clinicianDirectoryUrl('/doctors', directory.state, clinicianFilters.map((filter) => filter.value))
    }
  }
  return <ClinicianProfileTemplate relatedSpecialtyIds={related.filter((service) => careEntry(service.publicId)?.kind === 'specialty').map((service) => service.publicId)}
    selectionNotice={parameters.service && !selectedService ? 'Your previous care choice is not available with this doctor. You can request this doctor or choose from the related care below.' : undefined} portraitSrc={demoClinicianPortraits[clinician.publicId]} appointmentHref={appointmentHref({ doctorId: clinician.publicId, serviceId: selectedService?.publicId }, serviceResultsHref)}
    serviceContext={selectedService ? { name: selectedService.name, href: carePathWithDoctor(selectedService, clinician.publicId, serviceResultsHref) } : undefined}
    biography={partial ? undefined : clinicianBiographies.get(clinician.publicId)}
    directoryHref={directoryHref}
    profile={{ clinician: displayedClinician, canonicalPath: clinician.canonicalPath,
      locations: partial ? [] : [{ publicId: 'demo-care-desk', title: 'Outpatient care desk' }],
      relatedServices: partial ? [] : related.map((service) => ({
        canonicalPath: carePathWithDoctor(service, clinician.publicId, serviceResultsHref), name: service.name, publicId: service.publicId,
      })), outcome: 'profile' }}
    breadcrumbs={{ label: 'Breadcrumb', items: [
      { href: '/', label: 'Home' }, { href: '/doctors', label: 'Doctors' },
      { href: clinician.canonicalPath, label: clinician.details.name, current: true },
    ] }} state={partial ? 'ready' : scenario} />
}
