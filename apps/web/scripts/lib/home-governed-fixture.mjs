import { applyWorkflow, createWorkflow } from '../../src/content/cms-workflow.ts'
import { applyCareCommand, createCareRelationship } from '../../src/content/care-relationships.ts'
import { careFixtures } from './care-relationship-fixture.mjs'
import { homeContactDocument, homeContactTime } from './home-contact-fixture.mjs'
import { homeFixture } from './home-fixture.mjs'
import { institutionalBlockFixture } from './institutional-block-fixture.mjs'

const homeGovernedActionTime = new Date('2026-09-19T12:00:00Z')
export const homeGovernedTime = new Date('2026-09-19T12:01:00Z')
export const homeGovernedFixtureStates = [
  'governed-current',
  'governed-empty',
  'governed-doctor-only',
  'governed-service-only',
  'governed-institution-only',
  'governed-expired',
  'governed-unreviewed',
  'governed-missing-language',
  'governed-invalid-selection',
]

const author = { id: 'cms:1', roles: ['author'] }
const medical = { id: 'cms:2', roles: ['medical'] }
const clinical = { id: 'cms:3', roles: ['clinical'] }
const operations = { id: 'cms:4', roles: ['operations'] }
const reviewer = { id: 'cms:5', roles: ['reviewer'] }
const publisher = { id: 'cms:6', roles: ['publisher'] }
const content = { id: 'cms:7', roles: ['content'] }
const brand = { id: 'cms:8', roles: ['brand'] }
const legal = { id: 'cms:9', roles: ['legal'] }

function workflow(input, domains, publish = true) {
  let document = createWorkflow(input, 'general', author, homeGovernedActionTime)
  const act = (actor, action, extra = {}) => {
    document = applyWorkflow(document, undefined, {
      action,
      expectedRevision: document.workflow.revision,
      ...extra,
    }, actor, homeGovernedActionTime)
  }
  if (!publish) return document
  act(author, 'submit')
  for (const [domain, actor] of domains) {
    act(actor, 'review-domain', { domain, reference: 'Synthetic Home feature review' })
  }
  act(reviewer, 'approve')
  act(publisher, 'publish')
  return document
}

function careSet(publish = true) {
  const fixture = careFixtures(homeGovernedActionTime, '303030303030', false)
  const locationDocument = workflow(fixture.location, [['operations', operations]], publish)
  const doctorDocument = workflow(fixture.doctor, [['medical', medical]], publish)
  const serviceDocument = workflow(fixture.service, [['clinical', clinical]], publish)
  const records = [locationDocument.record, doctorDocument.record, serviceDocument.record]

  let relationship = null
  if (publish) {
    relationship = createCareRelationship(fixture.definition, records, author, homeGovernedActionTime)
    const act = (actor, action, extra = {}) => {
      relationship = applyCareCommand(relationship, undefined, {
        action,
        expectedRevision: relationship.revision,
        ...extra,
      }, records, actor, homeGovernedActionTime)
    }
    act(author, 'submit')
    for (const [domain, actor] of [['medical', medical], ['clinical', clinical], ['operations', operations]]) {
      act(actor, 'review-domain', { domain, reference: 'Synthetic Home relationship review' })
    }
    act(reviewer, 'approve', { reference: 'Synthetic Home relationship approval' })
  }
  return { fixture, records, relationship }
}

function institutional(publish = true) {
  const input = institutionalBlockFixture(homeGovernedActionTime, '313131313131', 'fact')
  return workflow(input, [['content', content], ['brand', brand], ['legal', legal]], publish)
}

export function homeGovernedFixture(state = 'governed-current') {
  if (!homeGovernedFixtureStates.includes(state)) throw new Error('Unsupported Home governed-content review state')
  const published = state !== 'governed-unreviewed'
  const care = careSet(published)
  const institution = institutional(published)
  const selection = {
    doctorPublicIds: [care.fixture.doctor.publicId],
    servicePublicIds: [care.fixture.service.publicId],
    institutionalPublicIds: [institution.record.publicId],
  }
  if (state === 'governed-empty') {
    selection.doctorPublicIds = []
    selection.servicePublicIds = []
    selection.institutionalPublicIds = []
  }
  if (state === 'governed-doctor-only') {
    selection.servicePublicIds = []
    selection.institutionalPublicIds = []
  }
  if (state === 'governed-service-only') {
    selection.doctorPublicIds = []
    selection.institutionalPublicIds = []
  }
  if (state === 'governed-institution-only') {
    selection.doctorPublicIds = []
    selection.servicePublicIds = []
  }
  if (state === 'governed-invalid-selection') {
    selection.doctorPublicIds = [care.fixture.doctor.publicId, care.fixture.doctor.publicId]
    selection.servicePublicIds = ['not-a-public-id']
    selection.institutionalPublicIds = [institution.record.publicId, institution.record.publicId]
  }
  return {
    ...homeFixture(),
    eyebrow: 'Controlled Home preview — synthetic governed omissions',
    documents: [homeContactDocument(homeContactTime)],
    governed: {
      institutionalDocuments: [institution],
      locale: state === 'governed-missing-language' ? 'am' : 'en',
      mode: 'controlled-fixture',
      now: state === 'governed-expired' ? new Date('2026-12-01T12:00:00Z') : homeGovernedTime,
      records: care.records,
      relationships: care.relationship ? [care.relationship] : [],
      selection,
    },
    locale: 'en',
    mode: 'controlled-fixture',
    now: homeContactTime,
  }
}
