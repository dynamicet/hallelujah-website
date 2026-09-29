import { applyWorkflow, createWorkflow } from '../../src/content/cms-workflow.ts'
import { clinicianFixture } from './clinician-fixture.mjs'

export const clinicianDirectoryTime = new Date('2026-09-29T09:00:00Z')
export const clinicianDirectoryFixtureStates = [
  'controlled',
  'long-content',
  'failure',
  'offline',
  'empty',
]

const author = { id: 'cms:directory-author', roles: ['author'] }
const medical = { id: 'cms:directory-medical', roles: ['medical'] }
const reviewer = { id: 'cms:directory-reviewer', roles: ['reviewer'] }
const publisher = { id: 'cms:directory-publisher', roles: ['publisher'] }

const definitions = [
  ['101010101010', 'Dr Synthetic Aster', 'Synthetic family care'],
  ['111111111111', 'Dr Synthetic Bekele', 'Synthetic child care'],
  ['121212121212', 'Dr Synthetic Chala', 'Synthetic heart care'],
  ['131313131313', 'Dr Synthetic Desta', 'Synthetic family care'],
  ['141414141414', 'Dr Synthetic Eden', 'Synthetic child care'],
  ['151515151515', 'Dr Synthetic Fikru', 'Synthetic heart care'],
  ['161616161616', 'Dr Synthetic Genet', 'Synthetic family care'],
  ['171717171717', 'Dr Synthetic Hana', 'Synthetic child care'],
  ['181818181818', 'Dr Synthetic Imani', 'Synthetic heart care'],
]

export const clinicianDirectoryFilters = [
  { label: 'Synthetic family care', specialty: 'Synthetic family care', value: 'synthetic-family' },
  { label: 'Synthetic child care', specialty: 'Synthetic child care', value: 'synthetic-child' },
  { label: 'Synthetic heart care', specialty: 'Synthetic heart care', value: 'synthetic-heart' },
]

function publish(input) {
  let document = createWorkflow(input, 'general', author, clinicianDirectoryTime)
  const act = (actor, action, extra = {}) => {
    document = applyWorkflow(document, undefined, {
      action,
      expectedRevision: document.workflow.revision,
      ...extra,
    }, actor, clinicianDirectoryTime)
  }
  act(author, 'submit')
  act(medical, 'review-domain', { domain: 'medical', reference: 'Synthetic directory fixture review' })
  act(reviewer, 'approve')
  act(publisher, 'publish')
  return document
}

function sourceRecord([suffix, name, specialty], expanded) {
  const record = clinicianFixture(clinicianDirectoryTime, suffix)
  const extra = expanded
    ? ' — deliberately expanded fictional name for compact wrapping and text reflow review'
    : ''
  record.localized.en = { slug: `synthetic-clinician-${suffix}`, title: `${name}${extra}` }
  record.clinician.localized.en = {
    ...record.clinician.localized.en,
    name: `${name}${extra}`,
    specialties: [`${specialty}${expanded ? ' — extended synthetic specialty wording' : ''}`],
  }
  return record
}

export function clinicianDirectoryFixture(state = 'controlled') {
  if (!clinicianDirectoryFixtureStates.includes(state)) throw new Error('Unsupported clinician-directory review state')
  const expanded = state === 'long-content'
  const records = definitions.map((definition) => publish(sourceRecord(definition, expanded)).record)
  const retired = publish(sourceRecord(['191919191919', 'Retired Synthetic Record', 'Synthetic family care'], false))
  const withdrawn = applyWorkflow(retired, undefined, {
    action: 'withdraw',
    expectedRevision: retired.workflow.revision,
    reason: 'Synthetic retired-record exclusion specimen',
  }, publisher, clinicianDirectoryTime).record
  return {
    filters: expanded
      ? clinicianDirectoryFilters.map((filter) => ({ ...filter,
          label: `${filter.label} — extended controlled filter wording`,
          specialty: `${filter.specialty} — extended synthetic specialty wording`,
        }))
      : clinicianDirectoryFilters,
    records: state === 'empty' ? [] : [...records, withdrawn],
  }
}
