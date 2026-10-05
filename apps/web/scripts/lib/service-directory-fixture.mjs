import { applyWorkflow, createWorkflow } from '../../src/content/cms-workflow.ts'
import { serviceFixture } from './service-fixture.mjs'

export const serviceDirectoryTime = new Date('2026-10-01T09:00:00Z')
export const serviceDirectoryFixtureStates = [
  'controlled',
  'long-content',
  'loading',
  'failure',
  'offline',
  'empty',
]
export const serviceDirectoryUrgentTerms = ['synthetic urgent review']

const author = { id: 'cms:101', roles: ['author'] }
const clinical = { id: 'cms:102', roles: ['clinical'] }
const reviewer = { id: 'cms:103', roles: ['reviewer'] }
const publisher = { id: 'cms:104', roles: ['publisher'] }

const groups = {
  access: ['grp_101010101010', 'Synthetic access and hospital care', 'synthetic-access'],
  medicine: ['grp_202020202020', 'Synthetic medicine', 'synthetic-medicine'],
  rehabilitation: ['grp_303030303030', 'Synthetic specialty and rehabilitation', 'synthetic-rehabilitation'],
}

const definitions = [
  ['111111111111', 'Synthetic admission guidance', 'access', 'synthetic admission term'],
  ['121212121212', 'Synthetic inpatient navigation', 'access', 'synthetic inpatient term'],
  ['131313131313', 'Synthetic day care navigation', 'access', 'synthetic day term'],
  ['141414141414', 'Synthetic general medicine', 'medicine', 'synthetic medicine term'],
  ['151515151515', 'Synthetic heart medicine', 'medicine', 'synthetic heart term'],
  ['161616161616', 'Synthetic breathing medicine', 'medicine', 'synthetic breathing term'],
  ['171717171717', 'Synthetic rehabilitation care', 'rehabilitation', 'synthetic mobility term'],
  ['181818181818', 'Synthetic speech support', 'rehabilitation', 'synthetic communication term'],
  ['191919191919', 'Synthetic therapy navigation', 'rehabilitation', 'synthetic therapy term'],
  ['212121212121', 'Synthetic follow-up support', 'rehabilitation', 'synthetic follow-up term'],
]

export const serviceDirectoryFilters = Object.entries(groups).map(([, [publicId, label, value]]) => ({
  label,
  publicId,
  value,
}))

function publish(input) {
  let document = createWorkflow(input, 'general', author, serviceDirectoryTime)
  const act = (actor, action, extra = {}) => {
    document = applyWorkflow(document, undefined, {
      action,
      expectedRevision: document.workflow.revision,
      ...extra,
    }, actor, serviceDirectoryTime)
  }
  act(author, 'submit')
  act(clinical, 'review-domain', { domain: 'clinical', reference: 'Synthetic service-directory fixture review' })
  act(reviewer, 'approve')
  act(publisher, 'publish')
  return document
}

function sourceRecord([suffix, name, groupKey, synonym], expanded, withheld = false) {
  const record = serviceFixture(serviceDirectoryTime, suffix)
  const [publicId, groupName] = groups[groupKey]
  const extra = expanded
    ? ' — deliberately expanded fictional wording for compact wrapping and text reflow review'
    : ''
  record.localized.en = { slug: `synthetic-service-${suffix}`, title: `${name}${extra}` }
  record.service.group = { publicId, localized: { en: `${groupName}${expanded ? ' — extended group wording' : ''}` } }
  record.service.localized.en = {
    name: `${name}${extra}`,
    synonyms: [`${synonym}${expanded ? ' — extended recognition wording' : ''}`],
  }
  record.service.claims[0].localized.en = `Synthetic scope ${suffix}${extra}. No hospital capability or patient eligibility is represented.`
  if (withheld) {
    delete record.service.omittedSections['tests-treatments']
    record.service.claims.push({
      claimId: `clm_${suffix}x`,
      section: 'tests-treatments',
      state: 'withheld',
      localized: { en: 'Synthetic high-consequence statement that must never render.' },
      evidence: null,
      withholdingReason: 'CARE-05 remains unresolved',
    })
  }
  return record
}

export function serviceDirectoryFixture(state = 'controlled') {
  if (!serviceDirectoryFixtureStates.includes(state)) throw new Error('Unsupported service-directory review state')
  const expanded = state === 'long-content'
  const records = definitions.map((definition, index) => publish(sourceRecord(definition, expanded, index === 4)).record)
  const retired = publish(sourceRecord(
    ['232323232323', 'Retired Synthetic Service', 'medicine', 'retired synthetic term'],
    false,
  ))
  const withdrawn = applyWorkflow(retired, undefined, {
    action: 'withdraw',
    expectedRevision: retired.workflow.revision,
    reason: 'Synthetic retired-service exclusion specimen',
  }, publisher, serviceDirectoryTime).record
  return {
    filters: expanded
      ? serviceDirectoryFilters.map((filter) => ({ ...filter, label: `${filter.label} — extended controlled label` }))
      : serviceDirectoryFilters,
    records: state === 'empty' ? [] : [...records, withdrawn],
    urgentTerms: serviceDirectoryUrgentTerms,
  }
}
