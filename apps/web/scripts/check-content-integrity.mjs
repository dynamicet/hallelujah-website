import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { applyWorkflow, createWorkflow, requiredDomains } from '../src/content/cms-workflow.ts'
import { governedKinds, publicEligibility, validateGovernedRecord, validateRecordSet } from '../src/content/governed-record.ts'
import { validateStoredRecordChange } from '../src/content/governed-collection.ts'
import { canonicalContactView } from '../src/content/canonical-contact-view.ts'
import { controlledDiscovery, governedPath, discoveryLanguageTarget, serializeStructuredData } from '../src/content/governed-discovery.ts'
import { controlledDiscoveryResponse } from '../src/content/discovery-response.ts'
import { ControlledDiscoveryCache, discoveryInvalidation } from '../src/content/discovery-cache.ts'
import { applyCareCommand, createCareRelationship, careEndpointSnapshot } from '../src/content/care-relationships.ts'
import { controlledCareGraph, controlledCareHandoff } from '../src/content/care-relationship-view.ts'
import { controlledStatementView, controlledCollectionContract, ControlledStatementDetails } from '../src/content/utility-statement-view.ts'
import { assetCurrent, assetHash, applyAssetCommand, requireAssetInput } from '../src/content/asset-record.ts'
import { clinicianFixture } from './lib/clinician-fixture.mjs'
import { serviceFixture } from './lib/service-fixture.mjs'
import { siteSettingsFixture } from './lib/site-settings-fixture.mjs'
import { utilityStatementFixture } from './lib/utility-statement-fixture.mjs'
import { visitorTopicFixture } from './lib/visitor-topic-fixture.mjs'
import { institutionalBlockFixture } from './lib/institutional-block-fixture.mjs'
import { careFixtures } from './lib/care-relationship-fixture.mjs'
import { assetFixture } from './lib/asset-fixture.mjs'

// Every clock is fixed; neither CI date nor test ordering changes lifecycle expectations.
const at = new Date('2026-09-18T12:00:00Z')
const now = new Date('2026-09-18T12:02:00Z')
const origin = 'http://127.0.0.1:43114'
const mode = 'controlled-fixture'
const author = { id: 'cms:1', roles: ['author'] }
const reviewer = { id: 'cms:2', roles: ['reviewer'] }
const domain = { id: 'cms:3', roles: ['medical', 'clinical', 'operations', 'content', 'privacy', 'legal', 'brand', 'accessibility', 'human-resources'] }
const publisher = { id: 'cms:4', roles: ['publisher'] }
const results = []
async function check(id, run) { await run(); results.push({ id, passed: true }) }
function command(doc, actor, action, extra = {}, clock = now) {
  return applyWorkflow(doc, undefined, { action, expectedRevision: doc.workflow.revision, ...extra }, actor, clock)
}
function publish(input, contentClass = 'general') {
  let doc = createWorkflow(input, contentClass, author, at)
  doc = command(doc, author, 'submit', {}, at)
  for (const name of requiredDomains(doc.record, contentClass)) doc = command(doc, domain, 'review-domain',
    { domain: name, reference: 'Synthetic integrity independent review' }, at)
  doc = command(command(doc, reviewer, 'approve', {}, at), publisher, 'publish', {}, at)
  return ['contact', 'emergency'].includes(contentClass) ? command(doc, domain, 'verify-publication',
    { reference: 'Synthetic integrity verification' }, at) : doc
}
function page(kind, suffix, slug) {
  const input = clinicianFixture(at, suffix)
  delete input.clinician
  return { ...input, kind, localized: { en: { slug, title: `Synthetic integrity ${slug}` } } }
}
const fixtures = [clinicianFixture(at), serviceFixture(at), page('location', '141414141414', 'synthetic-location'),
  page('vacancy', '151515151515', 'synthetic-vacancy'), page('page', '161616161616', 'home'),
  siteSettingsFixture(at), visitorTopicFixture(at), institutionalBlockFixture(at), utilityStatementFixture(at)]
await check('INT-001-all-governed-kinds', () => {
  assert.deepEqual(new Set(fixtures.map((fixture) => fixture.kind)), new Set(governedKinds))
  for (const fixture of fixtures) {
    assert.equal(validateGovernedRecord(fixture).ok, true, fixture.kind)
    assert.equal(publicEligibility(fixture, now).eligible, false)
  }
})
const doctor = publish(fixtures[0])
for (const key of ['owner', 'reviewer', 'approval', 'domainApproval', 'source', 'publishAt', 'reviewAt', 'expiresAt', 'audit']) {
  await check(`INT-governance-${key}`, () => {
    const invalid = structuredClone(doctor.record)
    delete invalid[key]
    assert.equal(validateGovernedRecord(invalid).ok, false)
    assert.equal(controlledDiscovery([{ ...doctor, record: invalid }], origin, now, mode).entries.length, 0)
  })
}
await check('INT-002-canonical-uniqueness', () => {
  assert.ok(validateRecordSet([doctor.record, doctor.record]).includes('duplicate publicId'))
  const other = clinicianFixture(at, '171717171717')
  other.localized.en.slug = doctor.record.localized.en.slug
  assert.ok(validateRecordSet([doctor.record, other]).includes('duplicate canonical slug'))
  assert.equal(controlledDiscovery([doctor, publish(other)], origin, now, mode).state, 'withheld')
})
await check('INT-003-broken-relationships', () => {
  const broken = { ...doctor.record, relationships: ['pub_ffffffffffff'] }
  assert.ok(validateRecordSet([broken]).includes('relationship has no matching public record'))
  assert.equal(controlledDiscovery([{ ...doctor, record: broken }], origin, now, mode).entries.length, 0)
})

const settings = publish(siteSettingsFixture(at), 'contact')
const contact = publish(page('page', '191919191919', 'contact'), 'contact')
const policyInput = utilityStatementFixture(at)
policyInput.relationships = [settings.record.publicId]
policyInput.utilityStatement.contact = { state: 'bound', settingsPublicId: settings.record.publicId,
  fact: 'email', purpose: 'Synthetic privacy contact', operationsReference: 'Synthetic operations binding' }
const policy = publish(policyInput, 'privacy')
const contacts = [settings, contact, policy]
await check('INT-004-contact-policy-baseline', () => {
  assert.equal(controlledDiscovery(contacts, origin, now, mode).entries.length, 2)
  assert.equal(controlledStatementView(contacts, 'privacy', 'en', now, mode).contact.value, 'contact@hospital.invalid')
  assert.equal(canonicalContactView(settings.record, 'en', now, mode).state, 'controlled-fixture')
})
await check('INT-005-contact-conflict', () => {
  const conflicted = structuredClone(settings)
  conflicted.record.siteSettings.email.state = 'conflict'
  conflicted.record.siteSettings.email.note = 'Synthetic conflicting source awaiting reconciliation'
  const documents = [conflicted, contact, policy]
  assert.equal(canonicalContactView(conflicted.record, 'en', now, mode).state, 'unavailable')
  assert.equal(controlledDiscovery(documents, origin, now, mode).entries.length, 0)
})
await check('INT-006-contact-expiry-preserves-notice-withholds-values', () => {
  const due = new Date(settings.record.siteSettings.email.reviewAt)
  assert.equal(controlledDiscovery(contacts, origin, due, mode).entries.length, 0)
  const view = controlledStatementView(contacts, 'privacy', 'en', due, mode)
  assert.equal(view.state, 'controlled-fixture')
  assert.equal(view.contact.value, null)
  const html = renderToStaticMarkup(createElement(ControlledStatementDetails,
    { documents: contacts, type: 'privacy', locale: 'en', now: due, mode }))
  assert.match(html, /Synthetic statement fixture/)
  assert.doesNotMatch(html, /contact@hospital.invalid/)
})
await check('INT-007-unverified-safety-discovery', () => {
  const unverified = { ...settings, workflow: { ...settings.workflow, verification: null } }
  assert.equal(controlledDiscovery([unverified, contact, policy], origin, now, mode).entries.length, 0)
})
await check('INT-008-conflicting-canonical-contacts', () => {
  const duplicate = { ...settings, record: { ...settings.record, publicId: 'pub_202020202020' } }
  assert.equal(controlledDiscovery([...contacts, duplicate], origin, now, mode).state, 'withheld')
})
await check('INT-009-contact-invalidation-reaches-policy-and-pages', () => {
  const records = contacts.map((doc) => doc.record)
  const plan = discoveryInvalidation(records, records, settings.record.publicId)
  assert.ok(plan.publicIds.includes(policy.record.publicId))
  for (const route of ['/contact/', '/privacy/', '/emergency/', '/am/emergency/', '/sitemap.xml']) assert.ok(plan.paths.includes(route))
})
await check('INT-010-collection-stays-disabled', () => {
  for (const documents of [contacts, [policy], []]) assert.equal(controlledCollectionContract(documents,
    policy.record.publicId, 'appointment', policy.record.utilityStatement.inventory, now, mode).enabled, false)
})

const care = careFixtures(at, '212121212121', true)
const careDocs = [publish(care.location), publish(care.doctor), publish(care.service)]
const careRecords = careDocs.map((doc) => doc.record)
const careAt = new Date(at.getTime() + 60000)
let link = createCareRelationship(care.definition, careRecords, author, careAt)
let tick = 1
function careCommand(actor, action, extra = {}) {
  link = applyCareCommand(link, undefined, { action, expectedRevision: link.revision, ...extra },
    careRecords, actor, new Date(careAt.getTime() + tick++ * 1000))
}
careCommand(author, 'submit')
for (const name of ['medical', 'clinical', 'operations']) careCommand(domain, 'review-domain', { domain: name, reference: 'Synthetic affiliation review' })
careCommand(reviewer, 'approve', { reference: 'Synthetic affiliation approval' })
const candidate = { doctorPublicId: care.doctor.publicId, servicePublicId: care.service.publicId, locationPublicId: care.location.publicId }
for (const locale of ['en', 'am']) await check(`INT-011-bidirectional-care-${locale}`, () => {
  const graph = controlledCareGraph(careRecords, [link], locale, now, mode)
  assert.deepEqual(graph.handoffs, [candidate])
  assert.deepEqual(graph.doctors[0].relationships, graph.services[0].relationships)
  assert.deepEqual(controlledCareHandoff(careRecords, [link], candidate, locale, now, mode), candidate)
})
for (const endpoint of careRecords) for (const date of ['reviewAt', 'expiresAt']) {
  await check(`INT-care-${endpoint.kind}-${date}`, () => {
    const due = new Date(now.getTime() + 1000)
    const documents = structuredClone(careDocs)
    const selected = documents.find((doc) => doc.record.publicId === endpoint.publicId)
    selected.record[date] = due.toISOString().replace('.000Z', 'Z')
    const records = documents.map((doc) => doc.record)
    const refreshedLink = { ...link, endpointSnapshot: careEndpointSnapshot(link.definition, records, now, true) }
    assert.equal(controlledCareGraph(records, [refreshedLink], 'en', now, mode).handoffs.length, 1)
    assert.equal(controlledCareGraph(records, [refreshedLink], 'en', due, mode).handoffs.length, 0)
    assert.equal(controlledCareHandoff(records, [refreshedLink], candidate, 'en', due, mode), null)
    assert.ok(!controlledDiscovery(documents, origin, due, mode).entries.some((entry) => entry.publicId === endpoint.publicId))
  })
}
await check('INT-012-service-claim-expiry-cascades-to-affiliation', () => {
  const changedDocs = structuredClone(careDocs)
  const service = changedDocs.find((doc) => doc.record.kind === 'service')
  const expiry = new Date(now.getTime() + 1000)
  service.record.service.claims[0].evidence.expiresAt = expiry.toISOString().replace('.000Z', 'Z')
  const records = changedDocs.map((doc) => doc.record)
  const refreshedLink = { ...link, endpointSnapshot: careEndpointSnapshot(link.definition, records, now, true) }
  assert.equal(controlledCareGraph(records, [refreshedLink], 'en', now, mode).handoffs.length, 1)
  assert.equal(controlledCareGraph(records, [refreshedLink], 'en', expiry, mode).handoffs.length, 0)
  const snapshot = controlledDiscovery(changedDocs, origin, expiry, mode)
  assert.ok(!snapshot.entries.some((entry) => entry.publicId === service.record.publicId))
})
await check('INT-013-withdrawn-affiliation-removes-both-handoffs', () => {
  const withdrawn = applyCareCommand(link, undefined, { action: 'withdraw', expectedRevision: link.revision,
    reason: 'Synthetic affiliation retirement' }, careRecords, publisher, now)
  const graph = controlledCareGraph(careRecords, [withdrawn], 'en', now, mode)
  assert.equal(graph.handoffs.length, 0)
  assert.equal(graph.doctors[0].relationships.length, 0)
  assert.equal(graph.services[0].relationships.length, 0)
})
await check('INT-014-wrong-kind-care-endpoint', () => {
  assert.throws(() => createCareRelationship({ ...care.definition, locationPublicId: doctor.record.publicId },
    [...careRecords, doctor.record], author, now), /matching records/)
})

const docs = [doctor, publish(serviceFixture(at)), policy, settings]
const snapshot = controlledDiscovery(docs, origin, now, mode)
await check('INT-015-discovery-metadata-sitemap-agreement', () => {
  assert.equal(snapshot.entries.length, 3)
  for (const entry of snapshot.entries) {
    assert.equal(entry.url, origin + entry.path)
    assert.equal(entry.metadata.alternates.canonical, entry.structuredData['@id'])
    assert.equal(entry.structuredData.url, entry.url)
    assert.equal(entry.structuredData.inLanguage, entry.locale)
    assert.equal(entry.metadata.robots.index, false)
    assert.ok(snapshot.sitemap.includes(`<loc>${entry.url}</loc>`))
    for (const [locale, url] of Object.entries(entry.alternates)) assert.ok(snapshot.entries.some((peer) => peer.publicId === entry.publicId && peer.locale === locale && peer.url === url))
  }
})
await check('INT-016-missing-translation-has-no-alternate', () => {
  assert.equal(discoveryLanguageTarget(snapshot, doctor.record.publicId, 'am'), null)
  assert.deepEqual(snapshot.entries.find((entry) => entry.publicId === doctor.record.publicId).alternates,
    { en: origin + governedPath(doctor.record, 'en') })
  assert.equal(controlledDiscoveryResponse(docs, origin, now, '/am' + governedPath(doctor.record, 'en'), mode).status, 404)
})
await check('INT-017-cache-exact-time-boundary', () => {
  const cache = new ControlledDiscoveryCache()
  const due = new Date(settings.record.siteSettings.email.reviewAt)
  assert.equal(cache.read(contacts, origin, new Date(due.getTime() - 1), mode).entries.length, 2)
  assert.equal(cache.read(contacts, origin, due, mode).entries.length, 0)
  assert.equal(cache.read(contacts, origin, now, mode).entries.length, 2)
  assert.equal(cache.read(contacts, origin, now).entries.length, 0)
})
const doctorPath = governedPath(doctor.record, 'en')
const successor = publish(clinicianFixture(at, '222222222222'))
const retired = command(doctor, publisher, 'withdraw', { reason: 'Synthetic genuine successor', successorPublicId: successor.record.publicId })
await check('INT-018-valid-successor-redirect', () => {
  const response = controlledDiscoveryResponse([retired, successor], origin, now, doctorPath, mode)
  assert.equal(response.status, 308)
  assert.equal(response.headers.get('location'), governedPath(successor.record, 'en'))
  assert.equal(controlledDiscovery([retired, successor], origin, now, mode).entries.length, 1)
})
await check('INT-025-unapproved-successor-cannot-redirect', () => {
  const draft = createWorkflow(clinicianFixture(at, '222222222222'), 'general', author, at)
  assert.equal(controlledDiscoveryResponse([retired, draft], origin, now, doctorPath, mode).headers.get('location'), null)
  assert.throws(() => validateStoredRecordChange(retired.record, doctor.record, [draft.record]), /successor must be approved/)
})
for (const [name, peers] of [['missing', []], ['wrong-kind', [docs[1]]], ['retired', [command(successor, publisher, 'withdraw', { reason: 'Synthetic removal' })]]]) {
  await check(`INT-redirect-${name}`, () => {
    const invalid = { ...retired.record, withdrawal: { ...retired.record.withdrawal, successorPublicId: peers[0]?.record.publicId ?? successor.record.publicId } }
    assert.ok(validateRecordSet([invalid, ...peers.map((doc) => doc.record)]).includes('redirect successor must be a current record of the same kind'))
    assert.equal(controlledDiscoveryResponse([{ ...retired, record: invalid }, ...peers], origin, now, doctorPath, mode).headers.get('location'), null)
  })
}
await check('INT-019-retired-and-review-due-http-semantics', () => {
  assert.equal(controlledDiscoveryResponse([doctor], origin, new Date(doctor.record.reviewAt), doctorPath, mode).status, 503)
  assert.equal(controlledDiscoveryResponse([doctor], origin, new Date(doctor.record.expiresAt), doctorPath, mode).status, 410)
  assert.throws(() => validateStoredRecordChange({ ...retired.record, localized: { en: { ...retired.record.localized.en, slug: 'rewritten' } } },
    doctor.record, [successor.record]), /canonical slugs/)
})
await check('INT-020-structured-data-and-http-escaping', async () => {
  const input = clinicianFixture(at, '232323232323')
  input.localized.en.title = '</script><img src=x onerror=alert(1)>&\u2028Synthetic'
  input.clinician.localized.en.name = input.localized.en.title
  const hostile = publish(input)
  const entry = controlledDiscovery([hostile], origin, now, mode).entries[0]
  const serialized = serializeStructuredData(entry.structuredData)
  assert.deepEqual(JSON.parse(serialized), entry.structuredData)
  assert.doesNotMatch(serialized, /<|>|&|\u2028/)
  const html = await controlledDiscoveryResponse([hostile], origin, now, entry.path, mode).text()
  assert.doesNotMatch(html, /<img/)
  assert.match(html, /&lt;\/script&gt;/)
})

// Pure receipt specimen, not intake or malware clearance. Actual byte/store/reference cleanup
// is independently exercised by the existing disposable PostgreSQL asset integration suite.
const assetInput = assetFixture('asset_242424242424', 'image', at)
assetInput.rights.expiresAt = new Date(now.getTime() + 60000).toISOString()
const bytes = Buffer.from('Synthetic asset receipt specimen; not an image')
const hash = assetHash(bytes)
let asset = { input: requireAssetInput(assetInput), revision: 1, author: author.id, state: 'review',
  original: { key: 'synthetic/original', sha256: hash, mime: 'image/png', bytes: bytes.length },
  scan: { sha256: hash, engine: 'fixture-only-no-malware-clearance', signatures: 'fixture-only', at: at.toISOString(), fixtureOnly: true },
  outputs: [{ key: 'synthetic/native-320.png', sha256: hash, mime: 'image/png', bytes: bytes.length, width: 320, height: 160, ratio: null, colorProfile: 'sRGB', metadata: 'stripped' }],
  reviews: {}, audit: [{ actor: author.id, at: at.toISOString(), action: 'intake', reason: 'Synthetic pure receipt' }] }
for (const role of ['brand', 'privacy', 'accessibility']) asset = applyAssetCommand(asset,
  { action: 'review', expectedRevision: asset.revision, role, reference: 'Synthetic independent asset review' }, domain, now)
const scope = { route: '/about/', channel: 'controlled-review', territory: 'local-fixture', locale: 'en', consumer: 'pub_161616161616' }
await check('INT-021-current-asset-attachment', () => {
  assert.equal(assetCurrent(asset, now), true)
  assert.equal(applyAssetCommand(asset, { action: 'attach', expectedRevision: asset.revision, reference: 'Synthetic reference', scope }, publisher, now).references.length, 1)
})
for (const key of ['license', 'consent', 'restrictions']) await check(`INT-asset-rights-${key}`, () => {
  assert.throws(() => requireAssetInput({ ...assetInput, rights: { ...assetInput.rights, [key]: '' } }), /rights|permitted use/)
})
for (const [key, date] of [['review', assetInput.reviewAt], ['content-expiry', assetInput.expiresAt], ['rights-expiry', assetInput.rights.expiresAt]]) {
  await check(`INT-asset-${key}-denies-reference`, () => {
    const due = new Date(date)
    assert.equal(assetCurrent(asset, due), false)
    assert.throws(() => applyAssetCommand(asset, { action: 'attach', expectedRevision: asset.revision, reference: 'Synthetic expired reference', scope }, publisher, due), /unavailable/)
  })
}
await check('INT-022-unlicensed-scope-and-missing-language', () => {
  for (const change of [{ route: '/contact/' }, { locale: 'am' }, { channel: 'public' }]) assert.throws(() => applyAssetCommand(asset,
    { action: 'attach', expectedRevision: asset.revision, reference: 'Synthetic unauthorized reference', scope: { ...scope, ...change } }, publisher, now), /scope/)
})
await check('INT-023-consent-withdrawal-clears-references', () => {
  const attached = applyAssetCommand(asset, { action: 'attach', expectedRevision: asset.revision, reference: 'Synthetic reference', scope }, publisher, now)
  const withdrawn = applyAssetCommand(attached, { action: 'withdraw', expectedRevision: attached.revision, reference: 'Synthetic consent withdrawal' }, publisher, now)
  assert.equal(assetCurrent(withdrawn, now), false)
  assert.equal(withdrawn.references.length, 0)
  assert.deepEqual(withdrawn.audit.slice(0, -1), attached.audit)
})
await check('INT-024-default-consumers-withhold-fixtures', () => {
  assert.equal(controlledDiscovery(docs, origin, now).entries.length, 0)
  assert.equal(controlledCareGraph(careRecords, [link], 'en', now).handoffs.length, 0)
  assert.equal(canonicalContactView(settings.record, 'en', now).facts.length, 0)
  assert.equal(controlledStatementView(contacts, 'privacy', 'en', now).statement, null)
  for (const doc of [...docs, ...careDocs]) assert.equal(publicEligibility(doc.record, now).eligible, false)
})
if (process.argv.includes('--capture')) {
  const root = new URL('../../../docs/backlog/evidence/b02-014-artifacts/', import.meta.url)
  await mkdir(root, { recursive: true })
  await writeFile(new URL('integrity-report.json', root), JSON.stringify({
    scope: 'Fixed-time synthetic evidence only; no hospital approval or malware clearance',
    at: at.toISOString(), now: now.toISOString(), assertions: results.length, results,
  }, null, 2) + '\n')
}
console.log(`Content integrity and lifecycle checks passed: ${results.length} fixed-time cross-model cases.`)
