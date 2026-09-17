import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { once } from 'node:events'
import { spawnSync } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { applyWorkflow, createWorkflow, requiredDomains } from '../src/content/cms-workflow.ts'
import { controlledDiscovery, governedPath, discoveryLanguageTarget, serializeStructuredData } from '../src/content/governed-discovery.ts'
import { controlledDiscoveryResponse } from '../src/content/discovery-response.ts'
import { ControlledDiscoveryCache, discoveryInvalidation, controlledDiscoveryCache } from '../src/content/discovery-cache.ts'
import { validateStoredRecordChange, governedRecordsCollection } from '../src/content/governed-collection.ts'
import { clinicianFixture } from './lib/clinician-fixture.mjs'
import { serviceFixture } from './lib/service-fixture.mjs'
import { utilityStatementFixture } from './lib/utility-statement-fixture.mjs'
import { siteSettingsFixture } from './lib/site-settings-fixture.mjs'

const at = new Date('2026-09-17T12:00:00Z')
const now = new Date(at.getTime() + 60000)
const origin = 'http://127.0.0.1:43101'
const mode = 'controlled-fixture'
const author = { id: 'cms:1', roles: ['author'] }
const reviewer = { id: 'cms:2', roles: ['reviewer'] }
const domain = { id: 'cms:3', roles: ['medical', 'clinical', 'content', 'operations', 'privacy', 'legal', 'accessibility', 'brand'] }
const publisher = { id: 'cms:4', roles: ['publisher'] }
function action(doc, actor, action, extra = {}) {
  return applyWorkflow(doc, undefined, { action, expectedRevision: doc.workflow.revision, ...extra }, actor, at)
}
function published(input, contentClass = 'general') {
  let doc = action(createWorkflow(input, contentClass, author, at), author, 'submit')
  for (const name of requiredDomains(doc.record, contentClass)) doc = action(doc, domain, 'review-domain', { domain: name, reference: 'Synthetic discovery review' })
  doc = action(action(doc, reviewer, 'approve'), publisher, 'publish')
  return ['contact', 'emergency'].includes(contentClass) ? action(doc, domain, 'verify-publication', { reference: 'Synthetic post-publication verification' }) : doc
}
const doctorInput = clinicianFixture(at)
doctorInput.localized.am = { slug: 'synthetic-am-clinician', title: 'የቁጥጥር ምሳሌ' }
doctorInput.clinician.localized.am = { ...doctorInput.clinician.localized.en, name: doctorInput.localized.am.title }
const doctor = published(doctorInput)
const service = published(serviceFixture(at))
const policy = published(utilityStatementFixture(at), 'privacy')
const settings = published(siteSettingsFixture(at), 'contact')
const docs = [doctor, service, policy, settings]
const snapshot = controlledDiscovery(docs, origin, now, mode)
assert.equal(snapshot.state, 'controlled-fixture')
assert.equal(snapshot.entries.length, 4)
assert.equal(controlledDiscovery(docs, origin, now).entries.length, 0)
for (const badOrigin of ['https://hospital.invalid', 'http://localhost.evil.invalid', 'http://user@localhost', `${origin}/other`, `${origin}/?q=private`, 'file:///tmp/fixture']) assert.equal(controlledDiscovery(docs, badOrigin, now, mode).state, 'withheld')
assert.equal(controlledDiscovery(docs, origin, new Date('invalid'), mode).state, 'withheld')
assert.equal(controlledDiscovery([...docs, doctor], origin, now, mode).state, 'withheld')
assert.equal(controlledDiscovery([{ ...doctor, record: { ...doctor.record, publicId: 'private-id' } }], origin, now, mode).state, 'withheld')
assert.equal(controlledDiscovery([{ ...doctor, record: { ...doctor.record, synthetic: false } }], origin, now, mode).entries.length, 0)
assert.equal(discoveryLanguageTarget(snapshot, doctor.record.publicId, 'am'), '/am/doctors/synthetic-am-clinician/')
assert.equal(discoveryLanguageTarget(snapshot, service.record.publicId, 'am'), null)
assert.equal(governedPath(settings.record, 'en'), null)
for (const entry of snapshot.entries) {
  assert.equal(entry.metadata.robots.index, false)
  assert.equal(entry.metadata.alternates.canonical, entry.url)
  assert.equal(entry.structuredData['@type'], 'WebPage')
  assert.ok(snapshot.sitemap.includes(`<loc>${entry.url}</loc>`))
  assert.equal(entry.structuredData.inLanguage, entry.locale)
  assert.ok(!('telephone' in entry.structuredData))
}
assert.equal(snapshot.robots, 'User-agent: *\nDisallow: /\n')
const xml = spawnSync('python3', ['-c', 'import sys, xml.etree.ElementTree as E; root=E.fromstring(sys.stdin.read()); assert root.tag == "{http://www.sitemaps.org/schemas/sitemap/0.9}urlset"; assert len(root) == 4'], { input: snapshot.sitemap, encoding: 'utf8' })
assert.equal(xml.status, 0, xml.stderr)
const pageInput = structuredClone(doctorInput)
delete pageInput.clinician
pageInput.kind = 'page'
pageInput.publicId = 'pub_ffffffffffff'
pageInput.localized = { en: { slug: 'home', title: 'Synthetic Home' }, am: { slug: 'shaping-home', title: 'የቁጥጥር ምሳሌ' } }
const home = published(pageInput)
const homeSnapshot = controlledDiscovery([home], origin, now, mode)
assert.deepEqual(homeSnapshot.entries.map((entry) => entry.path).sort(), ['/', '/am/'])
assert.equal(discoveryLanguageTarget(homeSnapshot, home.record.publicId, 'am'), '/am/')
for (const slug of ['contact', 'emergency', 'about', 'patient-information', 'appointments', 'search', 'invented']) {
  const candidate = published({ ...pageInput, localized: { en: { slug, title: 'Synthetic inventory page' } } })
  assert.equal(controlledDiscovery([candidate], origin, now, mode).entries.length, 0, slug)
}
const contact = published({ ...pageInput, localized: { en: { slug: 'contact', title: 'Synthetic Contact' } } }, 'contact')
assert.ok(controlledDiscovery([contact, settings], origin, now, mode).entries.some((entry) => entry.path === '/contact/'))
assert.equal(controlledDiscovery([contact, { ...settings, workflow: { ...settings.workflow, contentClass: 'general' } }], origin, now, mode).entries.length, 0)
assert.equal(controlledDiscovery([{ ...contact, workflow: { ...contact.workflow, contentClass: 'general' } }, settings], origin, now, mode).entries.length, 0)
assert.equal(controlledDiscovery([contact, { ...settings, workflow: { ...settings.workflow, verification: null } }], origin, now, mode).entries.length, 0)
const path = governedPath(doctor.record, 'en')
for (const change of [
  { workflow: { ...doctor.workflow, reviews: {} } },
  { workflow: { ...doctor.workflow, author: reviewer.id } },
  { record: { ...doctor.record, publishAt: '2026-09-18T12:00:00Z' } },
  { record: { ...doctor.record, reviewAt: now.toISOString().replace('.000Z', 'Z') } },
  { record: { ...doctor.record, expiresAt: now.toISOString().replace('.000Z', 'Z') } },
]) assert.equal(controlledDiscovery([{ ...doctor, ...change }], origin, now, mode).entries.length, 0)
const draft = createWorkflow(clinicianFixture(at, 'aaaaaaaaaaaa'), 'general', author, at)
assert.equal(controlledDiscoveryResponse([draft], origin, now, governedPath(draft.record, 'en'), mode).status, 404)
assert.equal(controlledDiscoveryResponse(docs, origin, now, path).status, 404)
assert.equal(controlledDiscoveryResponse(docs, origin, now, '/missing/', mode).status, 404)
assert.equal(controlledDiscoveryResponse(docs, origin, now, path, mode, 'POST').status, 405)
assert.equal(controlledDiscoveryResponse(docs, origin, now, path, mode, 'HEAD').body, null)
const reviewDue = new Date(Date.parse(doctor.record.reviewAt))
assert.equal(controlledDiscoveryResponse([doctor], origin, reviewDue, path, mode).status, 503)
assert.equal(controlledDiscoveryResponse([doctor], origin, new Date(Date.parse(doctor.record.expiresAt)), path, mode).status, 410)
const successor = published(clinicianFixture(at, 'bbbbbbbbbbbb'))
const retired = action(doctor, publisher, 'withdraw', { reason: 'Synthetic genuine successor', successorPublicId: successor.record.publicId })
const redirectDocs = [retired, successor]
assert.equal(controlledDiscoveryResponse(redirectDocs, origin, now, path, mode).status, 308)
assert.equal(controlledDiscoveryResponse(redirectDocs, origin, now, path, mode).headers.get('location'), governedPath(successor.record, 'en'))
assert.equal(controlledDiscoveryResponse(redirectDocs, origin, now, governedPath(retired.record, 'am'), mode).status, 410)
const gone = action(doctor, publisher, 'withdraw', { reason: 'Synthetic removal' })
assert.equal(controlledDiscoveryResponse([gone], origin, now, path, mode).status, 410)
assert.equal(controlledDiscovery([gone], origin, now, mode).entries.length, 0)
const neverPublished = action(draft, publisher, 'withdraw', { reason: 'Synthetic unpublished removal' })
assert.equal(controlledDiscoveryResponse([neverPublished], origin, now, governedPath(draft.record, 'en'), mode).status, 404)
for (const unsafe of ['//evil.invalid/', '/doctors/%2e%2e/', `${path}?name=private`, `${path}#private`, '/DOCTORS/', '/a//b/']) assert.equal(controlledDiscoveryResponse(docs, origin, now, unsafe, mode).status, 404)
const changedSlug = structuredClone(retired.record)
changedSlug.localized.en.slug = 'changed-canonical'
assert.throws(() => validateStoredRecordChange(changedSlug, doctor.record, [successor.record]), /canonical slugs/)
const hostileInput = clinicianFixture(at, 'cccccccccccc')
hostileInput.localized.en.title = '</script><img src=x onerror=alert(1)> & "fixture"'
hostileInput.clinician.localized.en.name = hostileInput.localized.en.title
const hostile = published(hostileInput)
const hostileHtml = await controlledDiscoveryResponse([hostile], origin, now, governedPath(hostile.record, 'en'), mode).text()
assert.ok(hostileHtml.includes('&lt;/script&gt;'))
assert.ok(!hostileHtml.includes('<img'))
assert.ok(!serializeStructuredData({ name: hostileInput.localized.en.title }).includes('</script>'))

const dependentInput = clinicianFixture(at, 'dddddddddddd')
dependentInput.relationships = [service.record.publicId]
const dependent = published(dependentInput)
const secondInput = clinicianFixture(at, 'eeeeeeeeeeee')
secondInput.relationships = [dependent.record.publicId]
const second = published(secondInput)
const linked = [service, dependent, second]
assert.equal(controlledDiscovery(linked, origin, now, mode).entries.length, 3)
const revokedService = { ...service, workflow: { ...service.workflow, reviews: {} } }
assert.equal(controlledDiscovery([revokedService, dependent, second], origin, now, mode).entries.length, 0)
const evidenceBoundary = new Date(now.getTime() + 1000)
const evidenceExpired = structuredClone(service)
evidenceExpired.record.service.claims[0].evidence.expiresAt = evidenceBoundary.toISOString().replace('.000Z', 'Z')
assert.equal(controlledDiscovery([evidenceExpired, dependent, second], origin, now, mode).entries.length, 3)
assert.equal(controlledDiscovery([evidenceExpired, dependent, second], origin, evidenceBoundary, mode).entries.length, 0)
const cycleFirst = { ...dependent, record: { ...dependent.record, relationships: [second.record.publicId] } }
const cycleSecond = { ...second, record: { ...second.record, relationships: [dependent.record.publicId] } }
assert.equal(controlledDiscovery([cycleFirst, cycleSecond], origin, now, mode).entries.length, 2)
assert.equal(controlledDiscovery([cycleFirst, { ...cycleSecond, workflow: { ...cycleSecond.workflow, reviews: {} } }], origin, now, mode).entries.length, 0)
const plan = discoveryInvalidation(linked.map((doc) => doc.record), linked.map((doc) => doc.record), service.record.publicId)
assert.deepEqual(new Set(plan.publicIds), new Set(linked.map((doc) => doc.record.publicId)))
assert.ok(plan.paths.includes(governedPath(second.record, 'en')))
const safetyPlan = discoveryInvalidation([settings.record, doctor.record], [settings.record, doctor.record], settings.record.publicId)
for (const route of ['/', '/contact/', '/emergency/', '/am/emergency/', '/privacy/']) assert.ok(safetyPlan.paths.includes(route))
assert.ok(safetyPlan.tags.includes('canonical-contacts'))
assert.ok(safetyPlan.paths.includes(path))
assert.ok(safetyPlan.paths.includes('/about/'))
const cache = new ControlledDiscoveryCache()
const cached = cache.read([doctor], origin, now, mode)
cached.entries[0].title = 'Caller mutation'
assert.notEqual(cache.read([doctor], origin, now, mode).entries[0].title, 'Caller mutation')
assert.equal(cache.read([doctor], origin, reviewDue, mode).entries.length, 0)
assert.equal(cache.read([doctor], origin, now, mode).entries.length, 2)
assert.equal(cache.read([doctor], origin, new Date(Date.parse(doctor.record.expiresAt)), mode).entries.length, 0)
const future = { ...doctor, record: { ...doctor.record, publishAt: new Date(at.getTime() + 120000).toISOString().replace('.000Z', 'Z') } }
assert.equal(cache.read([future], origin, now, mode).entries.length, 0)
assert.equal(cache.read([future], origin, new Date(at.getTime() + 120000), mode).entries.length, 2)
const renamed = { ...doctor.record, localized: { ...doctor.record.localized, en: { ...doctor.record.localized.en, slug: 'renamed' } } }
const renamePlan = discoveryInvalidation([doctor.record], [renamed], doctor.record.publicId)
assert.ok(renamePlan.paths.includes(path))
assert.ok(renamePlan.paths.includes(governedPath(renamed, 'en')))
controlledDiscoveryCache.read(docs, origin, now, mode)
assert.equal(governedRecordsCollection.hooks.afterChange[0]({ doc: { publicId: doctor.record.publicId } }).publicId, doctor.record.publicId)

// The same Web Response adapter is sent over a real loopback socket: no public route is installed.
let httpDocs = docs
const server = createServer(async (request, response) => {
  const result = controlledDiscoveryResponse(httpDocs, origin, now, new URL(request.url, origin).pathname, mode, request.method)
  response.writeHead(result.status, Object.fromEntries(result.headers))
  response.end(Buffer.from(await result.arrayBuffer()))
})
server.listen(0, '127.0.0.1')
await once(server, 'listening')
const base = `http://127.0.0.1:${server.address().port}`
try {
  let result = await fetch(base + path, { redirect: 'manual' })
  assert.equal(result.status, 200)
  assert.equal(result.headers.get('cache-control'), 'private, no-store')
  assert.ok(result.headers.get('x-robots-tag').includes('noindex'))
  assert.ok((await result.text()).includes('<link rel="canonical"'))
  assert.equal((await fetch(base + '/missing/')).status, 404)
  result = await fetch(base + path.slice(0, -1), { redirect: 'manual' })
  assert.equal(result.status, 308)
  assert.equal(result.headers.get('location'), path)
  result = await fetch(base + '/sitemap.xml')
  assert.equal(result.status, 200)
  assert.ok(result.headers.get('content-type').startsWith('application/xml'))
  assert.ok((await result.text()).includes('<urlset'))
  assert.equal(await (await fetch(base + '/robots.txt')).text(), snapshot.robots)
  httpDocs = [gone]
  assert.equal((await fetch(base + path)).status, 410)
  httpDocs = [{ ...doctor, workflow: { ...doctor.workflow, reviews: {} } }]
  assert.equal((await fetch(base + path)).status, 503)
  httpDocs = redirectDocs
  result = await fetch(base + path + '?name=private', { redirect: 'manual' })
  assert.equal(result.status, 308)
  assert.equal(result.headers.get('location'), governedPath(successor.record, 'en'))
} finally { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)) }
if (process.argv.includes('--capture')) {
  const directory = fileURLToPath(new URL('../../../docs/backlog/evidence/b02-010-artifacts/', import.meta.url))
  await mkdir(directory, { recursive: true })
  await writeFile(directory + 'sitemap.xml', snapshot.sitemap + '\n')
  await writeFile(directory + 'robots.txt', snapshot.robots)
  await writeFile(directory + 'metadata.json', JSON.stringify(snapshot.entries, null, 2) + '\n')
  for (const locale of ['en', 'am']) {
    const candidate = snapshot.entries.find((entry) => entry.publicId === doctor.record.publicId && entry.locale === locale)
    await writeFile(directory + locale + '.html', await controlledDiscoveryResponse(docs, origin, now, candidate.path, mode).text() + '\n')
  }
}
process.stdout.write('Governed discovery metadata, lifecycle, cache and loopback HTTP checks passed.\n')
