import { demoClinicianPortraits } from '@/demo/clinician-portraits'
import { ClinicianDirectoryTemplate } from '@/design-system/templates'
import { clinicianDirectoryFromViews } from '@/content/clinician-directory'
import { clinicians, requireLocalDemo, services, type DemoSearchParams } from '@/demo/site'
import { doctorSearchTerms } from '@/demo/care-discovery'
import { clinicianFilters } from '@/demo/care-model'
import { demoScenario } from '@/demo/scenarios'

export const metadata = { title: 'Find a doctor | Hallelujah Hospital',
  description: 'Browse sample doctor profiles by name or area of care and explore your next step at Hallelujah Hospital.'
}

export default async function DoctorsPage({ searchParams }: { searchParams: DemoSearchParams }) {
  requireLocalDemo()
  const parameters = await searchParams
  const state = demoScenario(parameters.demo, ['ready', 'empty', 'failure', 'offline'] as const, 'ready')
  const rawQuery = Array.isArray(parameters.q) ? parameters.q[0] : parameters.q
  const directory = clinicianDirectoryFromViews({ entries: clinicians, searchTerms: doctorSearchTerms(rawQuery ?? '', clinicians, services), filters: clinicianFilters,
    locale: 'en', pageSize: 12, searchParameters: parameters })
  return <ClinicianDirectoryTemplate portraits={demoClinicianPortraits} expandedSearch directory={directory} pathname="/doctors" profileLinks state={state} />
}
