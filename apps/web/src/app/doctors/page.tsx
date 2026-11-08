import { demoClinicianPortraits } from '@/demo/clinician-portraits'
import { ClinicianDirectoryTemplate } from '@/design-system/templates'
import { clinicianDirectoryFromViews } from '@/content/clinician-directory'
import { clinicians, demoShell, requireLocalDemo, type DemoSearchParams } from '@/demo/site'
import { doctorSearchTerms } from '@/demo/care-discovery'
import { healthTopics } from '@/demo/health-topics'
import { searchHealthTopics } from '@/website/health-search'
import { services } from '@/demo/site'
import { clinicianFilters } from '@/demo/care-model'
import { demoScenario } from '@/demo/scenarios'

export const metadata = { title: 'Find a doctor | Hallelujah Hospital' }

export default async function DoctorsPage({ searchParams }: { searchParams: DemoSearchParams }) {
  requireLocalDemo()
  const parameters = await searchParams
  const state = demoScenario(parameters.demo, ['ready', 'empty', 'failure', 'offline'] as const, 'ready')
  const rawQuery = Array.isArray(parameters.q) ? parameters.q[0] : parameters.q
  const query = (rawQuery ?? '').normalize('NFC').replaceAll(/[\u0000-\u001f\u007f]/gu, '').replaceAll(/\s+/gu, ' ').trim().slice(0, 80)
  const relatedTopics = searchHealthTopics(healthTopics, query).map(({ topic }) => ({ name: topic.name, href: `/health-topics/${topic.id}` }))
  const directory = clinicianDirectoryFromViews({ entries: clinicians, searchTerms: doctorSearchTerms(query, clinicians, services), filters: clinicianFilters,
    locale: 'en', pageSize: 12, searchParameters: parameters })
  return <ClinicianDirectoryTemplate portraits={demoClinicianPortraits} expandedSearch relatedTopics={relatedTopics} directory={directory} pathname="/doctors" profileLinks shell={demoShell('/doctors')} state={state} />
}
