import { checkAssetsDb } from './check-assets-db.mjs'
import { checkContentTransferDb, installTransferFailureFixture } from './check-content-transfer-db.mjs'
import { checkDiscoveryDb } from './check-discovery-db.mjs'
import { checkUtilityStatementsDb } from './check-utility-statements-db.mjs'
import { checkInstitutionalBlocksDb } from './check-institutional-blocks-db.mjs'
import assert from 'node:assert/strict'
import { checkVisitorTopicsDb } from './check-visitor-topics-db.mjs'
import { checkCareRelationshipsDb } from './check-care-relationships-db.mjs'
import { randomBytes } from 'node:crypto'
import { getPayload } from 'payload'
import { publicEligibility } from '../src/content/governed-record.ts'
import { canonicalContactView } from '../src/content/canonical-contact-view.ts'
import { serviceFixture } from './lib/service-fixture.mjs'
import { controlledServiceIndex, controlledServiceResolution, controlledServiceTaxonomy } from '../src/content/service-view.ts'
import { clinicianFixture } from './lib/clinician-fixture.mjs'
import { controlledClinicianIndex, controlledClinicianResolution } from '../src/content/clinician-view.ts'
import { siteSettingsFixture } from './lib/site-settings-fixture.mjs'

const host = process.env.B02_001_PGHOST
const port = process.env.B02_001_PGPORT
if (!/^\/(?:var\/)?tmp\/hallelujah-b02-001-pg\.[a-zA-Z0-9]+$/.test(host ?? '') || !/^\d{2,5}$/.test(port ?? '')
  || process.env.LOCAL_DATABASE_URL || process.env.PGPASSWORD) {
  throw new Error('Use a disposable B02-001 Unix socket without supplied database credentials')
}

process.env.APP_ENVIRONMENT = 'local'
process.env.PERSONAL_DATA_COLLECTION = 'disabled'
process.env.EXTERNAL_SERVICES = 'disabled'
process.env.LOCAL_PAYLOAD_SECRET = 'controlled-local-cms-fixture-secret-only'
process.env.LOCAL_DATABASE_URL = `postgresql://hallelujah_content_local:synthetic-placeholder@localhost:${port}/hallelujah_content_local?host=${encodeURIComponent(host)}`

const { default: config } = await import('../src/payload.config.ts')
installTransferFailureFixture(await config)
const payload = await getPayload({ config })
process.stdout.write('Disposable Payload initialized.\n')

const fixtureSuffix = randomBytes(6).toString('hex')

const { cmsPreview } = await import('../src/content/cms-preview.ts')
const { advanceDueCmsRecords } = await import('../src/content/cms-lifecycle.ts')
const instant = (offset) => new Date(Date.now() + offset).toISOString().replace(/\.\d{3}Z$/, 'Z')
const fixture = {
  publicId: `pub_${fixtureSuffix}`,
  kind: 'page', status: 'draft', synthetic: true,
  localized: { en: { slug: `controlled-cms-${fixtureSuffix}`, title: 'Synthetic CMS workflow fixture' } },
  source: { reference: 'synthetic-cms-smoke', recordedAt: instant(-86400000) },
  owner: null, reviewer: null, approval: null, domainApproval: null, relationships: [],
  publishAt: instant(-3600000), reviewAt: instant(86400000 * 30), expiresAt: instant(86400000 * 60),
  withdrawal: null, audit: [],
}

async function identity(label, roles) {
  const email = `fixture-${label}-${fixtureSuffix}@cms.invalid`
  const password = randomBytes(24).toString('hex')
  const user = await payload.create({ collection: 'users', overrideAccess: true,
    data: { email, password, roles, synthetic: true, active: true },
  })
  const login = await payload.login({ collection: 'users', data: { email, password } })
  assert.equal(login.user.id, user.id)
  assert.ok(login.token)
  return { ...login.user, collection: 'users' }
}
async function command(doc, user, action, extra = {}, data = {}) {
  return payload.update({ collection: 'governed-records', id: doc.id, user, overrideAccess: false,
    data: { ...data, command: { action, expectedRevision: doc.workflow.revision, ...extra } },
  })
}
async function denied(operation, pattern) {
  await assert.rejects(operation, pattern)
}

try {
  if (process.argv.includes('--transfer-only')) {
    await checkContentTransferDb(payload, { identity, denied, fixtureSuffix })
    await new Promise((resolve) => process.stdout.write('Disposable transfer CMS smoke passed.\n', resolve))
    process.exit(0)
  }
  if (process.argv.includes('--assets-only')) {
    await checkAssetsDb(payload, { identity, denied, fixtureSuffix })
    await new Promise((resolve) => process.stdout.write('Disposable asset CMS smoke passed.\n', resolve))
    process.exit(0)
  }
  await checkContentTransferDb(payload, { identity, denied, fixtureSuffix })
  const author = await identity('author', ['author', 'reviewer', 'content', 'operations', 'publisher'])
  const otherAuthor = await identity('other-author', ['author'])
  const reviewer = await identity('reviewer', ['reviewer'])
  const domain = await identity('domain', ['content', 'operations', 'reviewer'])
  const publisher = await identity('publisher', ['publisher'])
  const manager = await identity('manager', ['identity-manager'])
  process.stdout.write('Synthetic CMS identities authenticated.\n')
  await denied(() => payload.create({ collection: 'users', user: author, overrideAccess: false,
    data: { email: `fixture-unapproved-${fixtureSuffix}@cms.invalid`, password: randomBytes(24).toString('hex'),
      roles: ['publisher'], synthetic: true, active: true },
  }), /not allowed|Forbidden/i)
  await denied(() => payload.create({ collection: 'governed-records', overrideAccess: true,
    data: { publicId: fixture.publicId, record: fixture, contentClass: 'contact' },
  }), /persisted CMS identity/)
  let doc = await payload.create({ collection: 'governed-records', user: author, overrideAccess: false,
    data: { publicId: fixture.publicId, record: fixture, contentClass: 'contact' },
  })
  process.stdout.write('Synthetic governed draft persisted.\n')
  assert.equal(doc.record.status, 'draft')
  assert.equal(doc.record.owner, `cms:${author.id}`)
  await denied(() => cmsPreview(payload, undefined, doc.id), /not allowed|Forbidden|Not Found/i)
  await denied(() => cmsPreview(payload, otherAuthor, doc.id), /not allowed|Forbidden|Not Found/i)
  assert.equal((await cmsPreview(payload, author, doc.id)).headers['Cache-Control'], 'private, no-store')
  await denied(() => command(doc, otherAuthor, 'submit'), /owning author/)
  await denied(() => payload.update({ collection: 'users', id: author.id, user: author,
    overrideAccess: true, data: { roles: ['publisher'] },
  }), /separate identity manager/)
  await denied(() => payload.update({ collection: 'users', id: manager.id, user: manager,
    overrideAccess: false, data: { roles: ['publisher'] },
  }), /separate identity manager/)
  await denied(() => command(doc, author, 'edit', {}, { authorId: `cms:${otherAuthor.id}`, record: doc.record }),
    /Workflow metadata/)
  await denied(() => command(doc, author, 'edit', {}, { contentClass: 'general', record: doc.record }),
    /Workflow metadata/)

  // Both writers start with the same revision; only one transaction may commit.
  const concurrent = await Promise.allSettled([
    command(doc, author, 'edit', {}, { record: { ...doc.record,
      localized: { en: { ...doc.record.localized.en, title: 'Synthetic concurrent edit A' } } } }),
    command(doc, author, 'edit', {}, { record: { ...doc.record,
      localized: { en: { ...doc.record.localized.en, title: 'Synthetic concurrent edit B' } } } }),
  ])
  assert.equal(concurrent.filter((result) => result.status === 'fulfilled').length, 1)
  assert.match(concurrent.find((result) => result.status === 'rejected').reason.message, /Stale/)
  doc = concurrent.find((result) => result.status === 'fulfilled').value
  process.stdout.write('Concurrent stale-write denial passed.\n')

  doc = await command(doc, author, 'submit')
  await denied(() => command(doc, author, 'approve'), /self-approve/)
  await denied(() => command(doc, reviewer, 'review-domain', { domain: 'content', reference: 'synthetic review' }),
    /content role/)
  await denied(() => command(doc, { ...reviewer, roles: ['content'] }, 'review-domain',
    { domain: 'content', reference: 'synthetic forged-role review' }), /content role/)
  await denied(() => command(doc, reviewer, 'approve'), /domain reviews/)
  doc = await command(doc, domain, 'review-domain', { domain: 'content', reference: 'synthetic content review' })
  doc = await command(doc, domain, 'review-domain', { domain: 'operations', reference: 'synthetic safety review' })
  await denied(() => command(doc, domain, 'approve'), /two distinct approval/)
  doc = await command(doc, reviewer, 'approve')
  assert.equal(doc.record.approval.actor, `cms:${reviewer.id}`)
  await denied(() => command(doc, publisher, 'publish', {}, { record: {
    ...doc.record, localized: { en: { ...doc.record.localized.en, title: 'Synthetic changed claim' } },
  } }), /Content cannot change/)
  await payload.update({ collection: 'users', id: domain.id, user: manager,
    overrideAccess: false, data: { active: false },
  })
  await denied(() => command(doc, publisher, 'publish'), /Domain approval identity is inactive/)
  await denied(() => cmsPreview(payload, domain, doc.id), /not allowed|Forbidden|Not Found/i)
  await payload.update({ collection: 'users', id: domain.id, user: manager,
    overrideAccess: false, data: { active: true },
  })
  await payload.update({ collection: 'users', id: reviewer.id, user: manager,
    overrideAccess: false, data: { roles: ['author'] },
  })
  await denied(() => command(doc, publisher, 'publish'), /Approval identity is inactive/)
  await payload.update({ collection: 'users', id: reviewer.id, user: manager,
    overrideAccess: false, data: { roles: ['reviewer'] },
  })
  doc = await command(doc, publisher, 'publish')
  assert.equal(doc.record.status, 'published')
  assert.equal(doc.workflow.verification, null)
  doc = await command(doc, domain, 'verify-publication', { reference: 'synthetic post-publish verification' })
  assert.equal(doc.workflow.verification.actor, `cms:${domain.id}`)
  assert.equal(publicEligibility(doc.record, new Date()).eligible, false)
  await denied(() => payload.delete({ collection: 'governed-records', id: doc.id, overrideAccess: true }), /withdrawn/)
  const priorAudit = doc.record.audit
  doc = await command(doc, publisher, 'withdraw', { reason: 'synthetic retirement' })
  assert.equal(doc.record.status, 'withdrawn')
  assert.deepEqual(doc.record.audit.slice(0, -1), priorAudit)
  assert.equal(doc.record.audit.at(-1).actor, `cms:${publisher.id}`)
  assert.equal(doc.publicId, fixture.publicId)
  await denied(() => command(doc, publisher, 'publish'), /approved content/)
  const publishInstant = instant(12000)
  const expiryInstant = instant(17000)
  let timed = await payload.create({ collection: 'governed-records', user: author, overrideAccess: false,
    data: { publicId: `pub_${fixtureSuffix}ff`, contentClass: 'general', record: {
      ...fixture, publicId: `pub_${fixtureSuffix}ff`,
      localized: { en: { slug: `timed-cms-${fixtureSuffix}`, title: 'Synthetic timed CMS fixture' } },
      publishAt: publishInstant, expiresAt: expiryInstant,
    } },
  })
  timed = await command(timed, author, 'submit')
  timed = await command(timed, domain, 'review-domain', { domain: 'content', reference: 'synthetic timed review' })
  timed = await command(timed, reviewer, 'approve')
  timed = await command(timed, publisher, 'schedule')
  assert.equal(timed.record.status, 'scheduled')
  await denied(() => command(timed, publisher, 'publish'), /not effective/)
  await new Promise((resolve) => setTimeout(resolve, Math.max(0, Date.parse(publishInstant) - Date.now() + 200)))
  const duePublication = await advanceDueCmsRecords(payload, publisher)
  assert.ok(duePublication.some((change) => change.id === timed.id && change.action === 'publish'))
  await new Promise((resolve) => setTimeout(resolve, Math.max(0, Date.parse(expiryInstant) - Date.now() + 200)))
  const dueExpiry = await advanceDueCmsRecords(payload, publisher)
  assert.ok(dueExpiry.some((change) => change.id === timed.id && change.action === 'expire'))
  const timedExpired = await payload.findByID({ collection: 'governed-records', id: timed.id,
    user: publisher, overrideAccess: false,
  })
  assert.equal(timedExpired.record.status, 'expired')
  assert.equal(timedExpired.record.withdrawal.reason, 'Controlled expiry instant reached')
  // B02-003: facts persist within the same locked safety workflow, without new routes.
  const settingsFixture = siteSettingsFixture(new Date())
  settingsFixture.publicId = `pub_${fixtureSuffix}cc`
  settingsFixture.localized.en.slug = `synthetic-settings-${fixtureSuffix}`
  settingsFixture.localized.am.slug = `synthetic-settings-am-${fixtureSuffix}`
  await denied(() => payload.create({ collection: 'governed-records', user: author, overrideAccess: false,
    data: { record: settingsFixture, contentClass: 'general' },
  }), /contact safety class/)
  let settings = await payload.create({ collection: 'governed-records', user: author, overrideAccess: false,
    data: { record: { ...settingsFixture, siteSettings: { ...settingsFixture.siteSettings,
      emergencyPhone: { ...settingsFixture.siteSettings.emergencyPhone, state: 'conflict',
        note: 'Synthetic emergency-number conflict awaiting reconciliation' } } }, contentClass: 'contact' },
  })
  const duplicate = { ...settingsFixture, publicId: `pub_${fixtureSuffix}dd`,
    localized: { en: { slug: `duplicate-settings-${fixtureSuffix}`, title: 'Synthetic duplicate settings' } } }
  await denied(() => payload.create({ collection: 'governed-records', user: otherAuthor, overrideAccess: false,
    data: { record: duplicate, contentClass: 'contact' },
  }), /only one current canonical/)
  settings = await command(settings, author, 'submit')
  settings = await command(settings, domain, 'review-domain',
    { domain: 'operations', reference: 'synthetic settings operations review' })
  await denied(() => command(settings, reviewer, 'approve'), /unresolved|current/)
  settings = await command(settings, reviewer, 'request-changes', { reason: 'Synthetic reconcile conflict' })
  settings = await command(settings, author, 'edit', {}, { record: { ...settings.record,
    siteSettings: settingsFixture.siteSettings } })
  assert.deepEqual(settings.workflow.reviews, {})
  settings = await command(settings, author, 'submit')
  settings = await command(settings, domain, 'review-domain',
    { domain: 'operations', reference: 'synthetic reconciled settings operations review' })
  await denied(() => command(settings, domain, 'approve'), /two distinct approval/)
  settings = await command(settings, reviewer, 'approve')
  await denied(() => command(settings, publisher, 'publish', {}, { record: { ...settings.record,
    siteSettings: { ...settings.record.siteSettings, publicPhone: {
      ...settings.record.siteSettings.publicPhone, value: '+1 202 555 0199' } } } }), /Content cannot change/)
  settings = await command(settings, publisher, 'publish')
  settings = await command(settings, domain, 'verify-publication',
    { reference: 'Synthetic settings post-publication verification' })
  const persistedSettings = await payload.findByID({ collection: 'governed-records', id: settings.id,
    user: domain, overrideAccess: false })
  assert.deepEqual(persistedSettings.record.siteSettings, settingsFixture.siteSettings)
  assert.equal(persistedSettings.publicId, settingsFixture.publicId)
  const view = canonicalContactView(persistedSettings.record, 'en', new Date(), 'controlled-fixture')
  assert.equal(view.facts.find((entry) => entry.key === 'emergencyPhone').target, 'tel:+12025550100')
  assert.equal(view.facts.find((entry) => entry.key === 'ambulancePhone').target, 'tel:+12025550100')
  assert.equal(canonicalContactView(persistedSettings.record, 'en', new Date()).state, 'unavailable')
  assert.equal(publicEligibility(persistedSettings.record, new Date()).eligible, false)
  settings = await command(settings, publisher, 'withdraw', { reason: 'Synthetic settings retirement' })
  assert.equal(canonicalContactView(settings.record, 'en', new Date(), 'controlled-fixture').state, 'unavailable')
  process.stdout.write('Canonical settings persistence, conflict/duplicate denials, safety approval, inert consumer and retirement passed.\n')
  // B02-004: clinician contracts use the same persisted medical permission boundary.
  const medical = await identity('medical', ['medical'])
  const clinicianInput = clinicianFixture(new Date(), `${fixtureSuffix}04`)
  let clinician = await payload.create({ collection: 'governed-records', user: author, overrideAccess: false,
    data: { record: clinicianInput, contentClass: 'general' },
  })
  const readClinician = await payload.findByID({ collection: 'governed-records', id: clinician.id,
    user: author, overrideAccess: false })
  assert.deepEqual(readClinician.record.clinician, clinicianInput.clinician)
  assert.equal(controlledClinicianIndex([readClinician.record], 'en', new Date(), 'controlled-fixture').length, 0)
  const duplicateClinician = clinicianFixture(new Date(), `${fixtureSuffix}05`)
  duplicateClinician.clinician.identityKey = clinicianInput.clinician.identityKey
  await denied(() => payload.create({ collection: 'governed-records', user: otherAuthor, overrideAccess: false,
    data: { record: duplicateClinician, contentClass: 'general' },
  }), /duplicate clinician roster identity/)
  await denied(() => command(clinician, author, 'edit', {}, { record: { ...clinician.record,
    clinician: { ...clinician.record.clinician, identityKey: `clin_${fixtureSuffix}06` } } }), /roster identity cannot change/)
  await denied(() => command(clinician, author, 'edit', {}, { record: { ...clinician.record,
    clinician: { ...clinician.record.clinician, schedule: { state: 'enabled', reason: 'synthetic fake schedule', entries: [] } } } }),
  /schedule remains withheld/)
  clinician = await command(clinician, author, 'submit')
  await denied(() => command(clinician, domain, 'review-domain', { domain: 'medical', reference: 'wrong clinical role' }), /medical role/)
  await denied(() => command(clinician, reviewer, 'approve'), /domain reviews/)
  clinician = await command(clinician, medical, 'review-domain', { domain: 'medical', reference: 'Synthetic persisted medical review' })
  clinician = await command(clinician, reviewer, 'approve')
  await denied(() => command(clinician, publisher, 'publish', {}, { record: { ...clinician.record,
    clinician: { ...clinician.record.clinician, localized: { en: { ...clinician.record.clinician.localized.en,
      credentials: ['Synthetic changed credential'] } } } } }), /Content cannot change/)
  await payload.update({ collection: 'users', id: medical.id, user: manager, overrideAccess: false, data: { roles: ['clinical'] } })
  await denied(() => command(clinician, publisher, 'publish'), /Domain approval identity is inactive/)
  await payload.update({ collection: 'users', id: medical.id, user: manager, overrideAccess: false, data: { roles: ['medical'] } })
  clinician = await command(clinician, publisher, 'publish')
  assert.equal(clinician.record.domainApproval.actor, `cms:${medical.id}`)
  assert.equal(publicEligibility(clinician.record, new Date()).eligible, false)
  assert.equal(controlledClinicianIndex([clinician.record], 'en', new Date()).length, 0)
  assert.equal(controlledClinicianIndex([clinician.record], 'en', new Date(), 'controlled-fixture')[0].appointment.doctorPublicId, clinician.publicId)
  let successor = await payload.create({ collection: 'governed-records', user: author, overrideAccess: false,
    data: { record: clinicianFixture(new Date(), `${fixtureSuffix}07`), contentClass: 'general' },
  })
  await denied(() => command(clinician, publisher, 'withdraw', { reason: 'Synthetic successor pending',
    successorPublicId: successor.publicId }), /successor must be approved/)
  successor = await command(successor, author, 'submit')
  successor = await command(successor, medical, 'review-domain', { domain: 'medical', reference: 'Synthetic successor medical review' })
  successor = await command(successor, reviewer, 'approve')
  successor = await command(successor, publisher, 'publish')
  const clinicianAudit = clinician.record.audit
  clinician = await command(clinician, publisher, 'withdraw', { reason: 'Synthetic genuine successor',
    successorPublicId: successor.publicId })
  const retiredClinician = await payload.findByID({ collection: 'governed-records', id: clinician.id,
    user: medical, overrideAccess: false })
  assert.equal(retiredClinician.publicId, clinicianInput.publicId)
  assert.equal(retiredClinician.record.clinician.identityKey, clinicianInput.clinician.identityKey)
  assert.deepEqual(retiredClinician.record.audit.slice(0, -1), clinicianAudit)
  const clinicianSet = [retiredClinician.record, successor.record]
  assert.deepEqual(controlledClinicianIndex(clinicianSet, 'en', new Date(), 'controlled-fixture').map((entry) => entry.publicId), [successor.publicId])
  assert.equal(controlledClinicianResolution(clinicianSet, clinician.publicId, 'en', new Date(), 'controlled-fixture').state, 'redirect')
  await denied(() => payload.delete({ collection: 'governed-records', id: clinician.id, overrideAccess: true }), /withdrawn/)
  process.stdout.write('Clinician PostgreSQL persistence, immutable/duplicate identity, medical role revocation, withheld schedule, canonical projection and successor retirement passed.\n')
  // B02-005: claim approval belongs to the persisted clinical reviewer, never the author.
  const clinical = await identity('service-clinical', ['clinical'])
  const serviceInput = serviceFixture(new Date(), `${fixtureSuffix}08`)
  let service = await payload.create({ collection: 'governed-records', user: author, overrideAccess: false,
    data: { record: serviceInput, contentClass: 'general' } })
  const persistedService = await payload.findByID({ collection: 'governed-records', id: service.id,
    user: author, overrideAccess: false })
  assert.deepEqual(persistedService.record.service, serviceInput.service)
  assert.equal(controlledServiceIndex([persistedService.record], 'en', new Date(), 'controlled-fixture').length, 0)
  const duplicateService = serviceFixture(new Date(), `${fixtureSuffix}09`)
  duplicateService.service.identityKey = serviceInput.service.identityKey
  await denied(() => payload.create({ collection: 'governed-records', user: otherAuthor, overrideAccess: false,
    data: { record: duplicateService, contentClass: 'general' } }), /duplicate service identity/)
  const copiedService = serviceFixture(new Date(), `${fixtureSuffix}10`)
  copiedService.service.claims[0].localized = serviceInput.service.claims[0].localized
  await denied(() => payload.create({ collection: 'governed-records', user: otherAuthor, overrideAccess: false,
    data: { record: copiedService, contentClass: 'general' } }), /copied cross-service/)
  await denied(() => command(service, author, 'edit', {}, { record: { ...service.record,
    service: { ...service.record.service, identityKey: `svc_${fixtureSuffix}11` } } }), /service identity cannot change/)
  const preapproved = structuredClone(serviceInput)
  preapproved.publicId = `pub_${fixtureSuffix}12`
  preapproved.service.identityKey = `svc_${fixtureSuffix}12`
  preapproved.service.claims[0].state = 'approved'
  preapproved.service.claims[0].evidence.reviewer = `cms:${clinical.id}`
  preapproved.service.claims[0].evidence.reviewedAt = instant(-3600000)
  await denied(() => payload.create({ collection: 'governed-records', user: author, overrideAccess: false,
    data: { record: preapproved, contentClass: 'general' } }), /cannot supply clinical approval/)
  service = await command(service, author, 'submit')
  await denied(() => command(service, medical, 'review-domain', { domain: 'clinical', reference: 'wrong medical role' }), /clinical role/)
  await denied(() => command(service, reviewer, 'approve'), /claim approval evidence|domain reviews/)
  service = await command(service, clinical, 'review-domain', { domain: 'clinical', reference: 'Synthetic persisted clinical review' })
  assert.equal(service.record.service.claims[0].evidence.reviewer, `cms:${clinical.id}`)
  service = await command(service, reviewer, 'approve')
  await denied(() => command(service, publisher, 'publish', {}, { record: { ...service.record,
    service: { ...service.record.service, dispositionReason: 'Changed after approval' } } }), /Content cannot change/)
  await payload.update({ collection: 'users', id: clinical.id, user: manager, overrideAccess: false, data: { roles: ['medical'] } })
  await denied(() => command(service, publisher, 'publish'), /Domain approval identity is inactive/)
  await payload.update({ collection: 'users', id: clinical.id, user: manager, overrideAccess: false, data: { roles: ['clinical'] } })
  service = await command(service, publisher, 'publish')
  assert.equal(publicEligibility({ ...service.record, synthetic: false }, new Date()).reason, 'care-gated')
  assert.deepEqual(controlledServiceIndex([service.record], 'en', new Date()), [])
  assert.equal(controlledServiceIndex([service.record], 'en', new Date(), 'controlled-fixture')[0].appointment.servicePublicId, service.publicId)
  assert.deepEqual(controlledServiceTaxonomy([service.record], 'en', new Date(), 'controlled-fixture')[0].services[0].vocabulary,
    [serviceInput.service.localized.en.name, ...serviceInput.service.localized.en.synonyms])
  let serviceSuccessor = await payload.create({ collection: 'governed-records', user: author, overrideAccess: false,
    data: { record: serviceFixture(new Date(), `${fixtureSuffix}13`), contentClass: 'general' } })
  await denied(() => command(service, publisher, 'withdraw', { reason: 'Synthetic successor not approved',
    successorPublicId: serviceSuccessor.publicId }), /successor must be approved/)
  serviceSuccessor = await command(serviceSuccessor, author, 'submit')
  serviceSuccessor = await command(serviceSuccessor, clinical, 'review-domain', { domain: 'clinical', reference: 'Synthetic successor clinical review' })
  serviceSuccessor = await command(serviceSuccessor, reviewer, 'approve')
  serviceSuccessor = await command(serviceSuccessor, publisher, 'publish')
  const serviceAudit = service.record.audit
  service = await command(service, publisher, 'withdraw', { reason: 'Synthetic service successor',
    successorPublicId: serviceSuccessor.publicId })
  const retiredService = await payload.findByID({ collection: 'governed-records', id: service.id,
    user: clinical, overrideAccess: false })
  assert.equal(retiredService.publicId, serviceInput.publicId)
  assert.equal(retiredService.record.service.identityKey, serviceInput.service.identityKey)
  assert.deepEqual(retiredService.record.audit.slice(0, -1), serviceAudit)
  const serviceSet = [retiredService.record, serviceSuccessor.record]
  assert.deepEqual(controlledServiceIndex(serviceSet, 'en', new Date(), 'controlled-fixture').map((view) => view.publicId), [serviceSuccessor.publicId])
  assert.equal(controlledServiceResolution(serviceSet, service.publicId, 'en', new Date(), 'controlled-fixture').state, 'redirect')
  await denied(() => payload.delete({ collection: 'governed-records', id: service.id, overrideAccess: true }), /withdrawn/)
  process.stdout.write('Service PostgreSQL persistence, duplicate/copy/immutable identity denials, clinical claim stamping and role revocation, taxonomy and successor retirement passed.\n')
  await checkCareRelationshipsDb(payload, { identity, command, denied, fixtureSuffix })
  await checkVisitorTopicsDb(payload, { identity, command, denied, fixtureSuffix })
  await checkInstitutionalBlocksDb(payload, { identity, command, denied, fixtureSuffix })
  await checkUtilityStatementsDb(payload, { identity, command, denied, fixtureSuffix, serviceSuccessor })
  await checkDiscoveryDb(payload, { identity, command, denied, fixtureSuffix })
  await checkAssetsDb(payload, { identity, denied, fixtureSuffix })
  process.stdout.write('Disposable Payload/PostgreSQL authenticated workflow, timed lifecycle and retirement integration passed.\n')
} catch (error) {
  process.stderr.write(`Disposable CMS smoke failed: ${error.message}\n`)
  process.exitCode = 1
}

// The installed Payload PostgreSQL adapter retains one reconnect client. This
// one-shot smoke command ends the process after the assertions finish.
await new Promise((resolve) => process.stdout.write('Disposable CMS smoke finished.\n', resolve))
process.exit(process.exitCode ?? 0)
