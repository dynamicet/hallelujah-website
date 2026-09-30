import { applyCareCommand, createCareRelationship } from '../../src/content/care-relationships.ts'
import { applyWorkflow, createWorkflow } from '../../src/content/cms-workflow.ts'
import { careFixtures } from './care-relationship-fixture.mjs'
import { clinicianFixture } from './clinician-fixture.mjs'

export const clinicianProfileTime = new Date('2026-09-29T12:00:00Z')
export const clinicianProfileFixtureStates = [
  'controlled',
  'partial',
  'portrait-omitted',
  'long-content',
  'long-multilingual-name',
  'missing-related',
  'appointment-unavailable',
  'failure',
  'unapproved',
  'gone',
  'redirect',
]

const author = { id: 'cms:101', roles: ['author'] }
const medical = { id: 'cms:102', roles: ['medical'] }
const clinical = { id: 'cms:103', roles: ['clinical'] }
const operations = { id: 'cms:104', roles: ['operations'] }
const reviewer = { id: 'cms:105', roles: ['reviewer'] }
const publisher = { id: 'cms:106', roles: ['publisher'] }

function publish(input, domain) {
  let document = createWorkflow(input, 'general', author, clinicianProfileTime)
  const act = (actor, action, extra = {}) => {
    document = applyWorkflow(document, undefined, {
      action,
      expectedRevision: document.workflow.revision,
      ...extra,
    }, actor, clinicianProfileTime)
  }
  act(author, 'submit')
  act(domain, 'review-domain', { domain: domain.roles[0], reference: 'Synthetic profile fixture review' })
  act(reviewer, 'approve')
  act(publisher, 'publish')
  return document
}

function approvedLink(definition, records) {
  let link = createCareRelationship(definition, records, author, clinicianProfileTime)
  const act = (actor, action, extra = {}) => {
    link = applyCareCommand(link, undefined, {
      action,
      expectedRevision: link.revision,
      ...extra,
    }, records, actor, clinicianProfileTime)
  }
  act(author, 'submit')
  for (const actor of [medical, clinical, operations]) {
    act(actor, 'review-domain', {
      domain: actor.roles[0],
      reference: 'Explicit fictional profile relationship review',
    })
  }
  act(reviewer, 'approve', { reference: 'Synthetic profile association approval' })
  return link
}

function customize(fixtures, state) {
  fixtures.doctor.localized.en = {
    slug: 'synthetic-clinician-profile',
    title: 'Dr Synthetic Meron',
  }
  fixtures.doctor.clinician.localized.en = {
    name: 'Dr Synthetic Meron',
    professionalTitle: 'Controlled clinician title',
    credentials: ['Synthetic credential A', 'Synthetic credential B'],
    specialties: ['Synthetic adult care'],
    interests: ['Synthetic care interest one', 'Synthetic care interest two'],
    languages: ['Fixture English', 'Fixture language two'],
    availabilityGuidance: null,
  }
  fixtures.service.localized.en = { slug: 'synthetic-service-profile', title: 'Synthetic support service' }
  fixtures.service.service.localized.en = { name: 'Synthetic support service', synonyms: [] }
  fixtures.location.localized.en = { slug: 'synthetic-profile-location', title: 'Synthetic location — no arrival facts' }

  if (state === 'partial') {
    fixtures.doctor.clinician.localized.en = {
      ...fixtures.doctor.clinician.localized.en,
      professionalTitle: null,
      credentials: [],
      interests: [],
      languages: [],
    }
  }
  if (state === 'long-content') {
    const extension = ' — deliberately extended fictional wording for compact viewport and text reflow review'
    fixtures.doctor.localized.en.title += extension
    fixtures.doctor.clinician.localized.en = {
      ...fixtures.doctor.clinician.localized.en,
      name: fixtures.doctor.localized.en.title,
      professionalTitle: `Controlled clinician title${extension}`,
      credentials: [`Synthetic credential${extension}`],
      specialties: [`Synthetic adult care${extension}`],
      interests: [`Synthetic care interest${extension}`],
      languages: [`Fixture language${extension}`],
    }
  }
  if (state === 'long-multilingual-name') {
    const name = 'Dr Synthetic መሮን የረጅም ስም ምሳሌ — controlled multilingual-name shaping specimen'
    fixtures.doctor.localized.en.title = name
    fixtures.doctor.clinician.localized.en = {
      ...fixtures.doctor.clinician.localized.en,
      name,
      professionalTitle: 'Synthetic multilingual-name layout fixture — not reviewed hospital wording',
    }
  }
  if (state === 'portrait-omitted') {
    fixtures.doctor.clinician.portrait = {
      assetPublicId: 'asset_909090909090',
      source: 'Synthetic portrait metadata only',
      rightsReference: 'Synthetic rights fixture',
      consentReference: 'Synthetic consent fixture',
      reviewedAt: '2026-09-29T11:00:00Z',
      expiresAt: '2026-10-29T11:00:00Z',
    }
  }
}

export function clinicianProfileFixture(state = 'controlled') {
  if (!clinicianProfileFixtureStates.includes(state)) throw new Error('Unsupported clinician-profile review state')
  const fixtures = careFixtures(clinicianProfileTime, '090909090909', false)
  customize(fixtures, state)

  const location = publish(fixtures.location, operations)
  const service = publish(fixtures.service, clinical)

  if (state === 'unapproved') {
    const doctor = createWorkflow(fixtures.doctor, 'general', author, clinicianProfileTime).record
    return { links: [], publicId: doctor.publicId, records: [location.record, doctor, service.record] }
  }

  const doctor = publish(fixtures.doctor, medical)
  const records = [location.record, doctor.record, service.record]
  const link = approvedLink(fixtures.definition, records)

  if (state === 'gone' || state === 'redirect') {
    let successor = null
    if (state === 'redirect') {
      const input = clinicianFixture(clinicianProfileTime, '919191919191')
      input.localized.en = { slug: 'synthetic-successor-profile', title: 'Dr Synthetic Successor' }
      input.clinician.localized.en = {
        ...input.clinician.localized.en,
        name: 'Dr Synthetic Successor',
        specialties: ['Synthetic successor care'],
      }
      successor = publish(input, medical).record
    }
    const withdrawn = applyWorkflow(doctor, undefined, {
      action: 'withdraw',
      expectedRevision: doctor.workflow.revision,
      reason: 'Synthetic clinician profile retirement',
      successorPublicId: successor?.publicId,
    }, publisher, clinicianProfileTime).record
    return {
      links: [],
      publicId: withdrawn.publicId,
      records: successor ? [location.record, withdrawn, successor] : [location.record, withdrawn],
    }
  }

  return {
    links: ['partial', 'missing-related'].includes(state) ? [] : [link],
    publicId: doctor.record.publicId,
    records,
  }
}
