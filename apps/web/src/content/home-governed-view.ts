import { controlledCareGraph } from './care-relationship-view.ts'
import type { WorkflowDocument } from './cms-workflow.ts'
import { type GovernedLocale, type GovernedRecord, validateGovernedRecord } from './governed-record.ts'
import { controlledInstitutionalView } from './institutional-block-view.ts'

export type HomeFeatureSelection = Readonly<{
  doctorPublicIds: readonly string[]
  institutionalPublicIds: readonly string[]
  servicePublicIds: readonly string[]
}>

export type HomeGovernedView = Readonly<{
  doctors: readonly Readonly<{
    canonicalPath: string
    credentials?: string
    name: string
    publicId: string
    record: GovernedRecord
    specialty: string
  }>[]
  institutions: readonly Readonly<{
    asOf: string
    body: string
    limitations: string
    publicId: string
    title: string
    type: string
  }>[]
  services: readonly Readonly<{
    canonicalPath: string
    group: string
    name: string
    publicId: string
    record: GovernedRecord
    summary: string
  }>[]
}>

const empty = (): HomeGovernedView => ({ doctors: [], institutions: [], services: [] })

function validSelection(values: unknown): values is readonly string[] {
  return Array.isArray(values) && values.length <= 3 && new Set(values).size === values.length
    && values.every((value) => typeof value === 'string' && /^pub_[a-zA-Z0-9_-]{12,64}$/u.test(value))
}

/**
 * Builds Home H4/H5/H8 from the same governed projections as their canonical consumers.
 * Feature order is explicit; no record is inferred, ranked, or substituted. The public default
 * remains empty until authentic care and institutional gates have their own approved adapter.
 */
export function controlledHomeGovernedView(
  records: readonly unknown[], relationships: readonly unknown[],
  institutionalDocuments: readonly WorkflowDocument[], selectionInput: unknown,
  locale: GovernedLocale, now: Date, mode?: 'controlled-fixture',
): HomeGovernedView {
  if (mode !== 'controlled-fixture' || !Number.isFinite(now.getTime())) return empty()
  const selection = selectionInput && typeof selectionInput === 'object' && !Array.isArray(selectionInput)
    ? selectionInput as Partial<HomeFeatureSelection> : {}

  const parsed = records.map(validateGovernedRecord)
  if (parsed.some((result) => !result.ok)) return empty()
  const checked = parsed.flatMap((result) => result.ok ? [result.record] : [])
  const byId = new Map(checked.map((record) => [record.publicId, record]))
  const graph = controlledCareGraph(checked, relationships, locale, now, mode)
  const institutional = controlledInstitutionalView(institutionalDocuments, locale, now, mode)

  const doctors = validSelection(selection.doctorPublicIds)
    ? selection.doctorPublicIds.flatMap((publicId) => {
      const entry = graph.doctors.find((candidate) => candidate.doctor.publicId === publicId)
      const record = byId.get(publicId)
      const specialty = entry?.doctor.details.specialties[0]
      if (!entry || !record || !entry.relationships.length || !specialty) return []
      return [{
        canonicalPath: entry.doctor.canonicalPath,
        credentials: entry.doctor.details.credentials.length
          ? entry.doctor.details.credentials.join(', ') : undefined,
        name: entry.doctor.details.name,
        publicId,
        record,
        specialty,
      }]
    }) : []

  const services = validSelection(selection.servicePublicIds)
    ? selection.servicePublicIds.flatMap((publicId) => {
      const entry = graph.services.find((candidate) => candidate.service.publicId === publicId)
      const record = byId.get(publicId)
      const summary = entry?.service.sections.scope?.[0]
      if (!entry || !record || !entry.relationships.length || !summary) return []
      return [{
        canonicalPath: entry.service.canonicalPath,
        group: entry.service.group.name,
        name: entry.service.name,
        publicId,
        record,
        summary,
      }]
    }) : []

  const institutions = validSelection(selection.institutionalPublicIds)
    ? selection.institutionalPublicIds.flatMap((publicId) => {
      const entry = institutional.blocks.find((candidate) => candidate.publicId === publicId)
      if (!entry?.block.evidence) return []
      return [{
        asOf: entry.block.evidence.asOf,
        body: entry.body,
        limitations: entry.block.evidence.limitations,
        publicId,
        title: entry.title,
        type: entry.block.type,
      }]
    }) : []

  return { doctors, institutions, services }
}
