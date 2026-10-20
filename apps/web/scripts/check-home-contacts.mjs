import assert from 'node:assert/strict'
import { homeContactView } from '../src/content/home-contact-view.ts'
import { discoveryInvalidation } from '../src/content/discovery-cache.ts'
import { applyWorkflow } from '../src/content/cms-workflow.ts'
import { siteFactKeys, canonicalPhone } from '../src/content/site-settings.ts'
import { homeContactDocument, homeContactFixture, homeContactFixtureStates, homeContactTime } from './lib/home-contact-fixture.mjs'
import { homePreviewDocument } from './lib/home-preview-server.mjs'
import { renderHome } from './lib/home-renderer.mjs'

const now = homeContactTime
const doc = homeContactDocument()
const mode = 'controlled-fixture'
let cases = 0
function deny(input, locale = 'en', time = now, authority = mode) {
  assert.deepEqual(homeContactView(input, locale, time, authority), { state: 'unavailable', facts: [] })
  cases++
}
const mutated = (change) => { const result = structuredClone(doc); change(result); return [result] }
const view = homeContactView([doc], 'en', now, mode)
assert.equal(view.state, 'controlled-fixture')
assert.equal(view.facts.length, siteFactKeys.length)
for (const fact of view.facts) {
  assert.equal(fact.value, doc.record.siteSettings[fact.key].value)
  assert.equal(fact.label, doc.record.siteSettings[fact.key].label.en)
  if (fact.key.endsWith('Phone')) assert.equal(fact.target, `tel:${canonicalPhone(fact.value)}`)
}
assert.equal(view.facts.find((fact) => fact.key === 'publicPhone').target, 'tel:+12025550101')
assert.equal(view.facts.find((fact) => fact.key === 'email').target, 'mailto:contact@hospital.invalid')
cases++
assert.deepEqual(homeContactView([doc], 'en', now), { state: 'unavailable', facts: [] })
cases++
deny([doc], 'en', now, 'public')
deny([], 'en')
deny([null])
deny(null)
deny([doc], 'unsupported')
deny([doc], 'en', new Date('invalid'))
deny([doc], 'en', new Date(now.getTime() - 60000))
deny(mutated((d) => { d.record.synthetic = false }))
deny([doc, doc])
deny([doc, homeContactDocument(now, (record) => { record.publicId = 'pub_030303030304'; return record })])
for (const status of ['draft', 'in-review', 'approved', 'scheduled', 'expired', 'withdrawn']) {
  deny(mutated((d) => { d.record.status = status }))
}
for (const key of siteFactKeys) {
  for (const change of [
    { state: 'unverified' }, { state: 'conflict', note: 'Synthetic unresolved conflict' },
    { state: 'withheld', value: null, note: 'Synthetic withholding' },
    { reviewAt: now.toISOString().replace('.000Z', 'Z') },
    { expiresAt: now.toISOString().replace('.000Z', 'Z') },
    { checkedAt: new Date(now.getTime() + 1000).toISOString().replace('.000Z', 'Z') },
    { label: { en: doc.record.siteSettings[key].label.en } },
  ]) {
    deny(mutated((d) => { Object.assign(d.record.siteSettings[key], change) }),
      'label' in change ? 'am' : 'en')
  }
}
for (const field of ['reviewAt', 'expiresAt']) {
  deny([doc], 'en', new Date(doc.record[field]))
  assert.equal(homeContactView([doc], 'en', new Date(Date.parse(doc.record[field]) - 1), mode).state,
    'unavailable', 'Fact review expires before the enclosing record')
  cases++
}
assert.equal(homeContactView([doc], 'en', new Date(now.getTime() + 7 * 86400000 - 1), mode).state,
  'controlled-fixture')
deny([doc], 'en', new Date(now.getTime() + 7 * 86400000))
for (const change of [
  (d) => { d.workflow = null },
  (d) => { d.workflow.contentClass = 'general' },
  (d) => { d.workflow.revision = 0 },
  (d) => { d.workflow.author = d.record.approval.actor },
  (d) => { d.workflow.reviews.operations = null },
  (d) => { d.workflow.reviews.operations.actor = d.workflow.author },
  (d) => { d.workflow.reviews.operations.actor = d.record.approval.actor },
  (d) => { d.workflow.reviews.operations.reference = '' },
  (d) => { d.workflow.verification = null },
  (d) => { d.workflow.verification.actor = d.workflow.author },
  (d) => { d.workflow.verification.at = new Date(now.getTime() - 60000).toISOString().replace('.000Z', 'Z') },
  (d) => { d.workflow.verification.at = new Date(now.getTime() + 1000).toISOString().replace('.000Z', 'Z') },
  (d) => { d.record.publishAt = new Date(now.getTime() + 1000).toISOString().replace('.000Z', 'Z') },
  (d) => { delete d.record.localized.am },
]) deny(mutated(change), change.toString().includes('localized.am') ? 'am' : 'en')

const updated = homeContactDocument(now, (record) => {
  record.siteSettings.publicPhone.value = '+1 (202) 555-0199'
  record.siteSettings.publicPhone.label.en = 'General enquiries — synthetic purpose'
  return record
})
const changed = homeContactView([updated], 'en', now, mode)
assert.equal(changed.facts.find((fact) => fact.key === 'publicPhone').target, 'tel:+12025550199')
assert.equal(changed.facts.find((fact) => fact.key === 'publicPhone').label, 'General enquiries — synthetic purpose')
assert.ok(!JSON.stringify(changed).includes('555-0101'))
cases++
const retired = applyWorkflow(doc, undefined,
  { action: 'withdraw', expectedRevision: doc.workflow.revision, reason: 'Synthetic Home withdrawal' },
  { id: 'cms:4', roles: ['publisher'] }, now)
deny([retired])
const invalidation = discoveryInvalidation([doc.record], [updated.record], doc.record.publicId)
for (const path of ['/', '/am/']) assert.ok(invalidation.paths.includes(path))
assert.ok(invalidation.tags.includes('canonical-contacts'))
const withdrawal = discoveryInvalidation([doc.record], [retired.record], doc.record.publicId)
assert.ok(withdrawal.paths.includes('/'))
assert.ok(withdrawal.paths.includes('/am/'))
cases++

for (const state of homeContactFixtureStates) {
  const html = homePreviewDocument(state)
  assert.match(html, /data-home-section="H9"/u)
  const targets = [...html.matchAll(/\bid="([^"]+)"/gu)].map((match) => match[1])
  assert.equal(new Set(targets).size, targets.length, 'No duplicate destinations/heading IDs')
  for (const match of html.matchAll(/\bhref="#([^"]+)"/gu)) assert.ok(targets.includes(match[1]))
  for (const id of ['emergency', 'call', 'directions']) assert.ok(targets.includes(`home-${id}`))
  assert.doesNotMatch(html, /href="(?:tel:|mailto:|https?:)|<form\b|<iframe\b/u)
  if (['contacts-current', 'contacts-updated'].includes(state)) {
    assert.match(html, /data-home-contact-state="controlled-fixture"/u)
    assert.match(html, /Do not use these contact or arrival details for care/u)
    assert.match(html, /data-home-contact-fact="publicPhone"><dt>Public enquiry phone<\/dt>/u)
  } else {
    assert.match(html, /data-home-contact-state="unavailable"/u)
    assert.doesNotMatch(html, /555|hospital\.invalid|Synthetic address/u)
  }
  cases++
}
const props = homeContactFixture()
props.documents = [updated]
const html = renderHome(props)
assert.match(html, /General enquiries — synthetic purpose/u)
assert.match(html, /555-0199/u)
assert.doesNotMatch(html, /555-0101/u)
const hostile = homeContactDocument(now, (record) => {
  record.siteSettings.address.value = '<script>synthetic-hostile-contact</script>'
  return record
})
props.documents = [hostile]
assert.match(renderHome(props), /&lt;script&gt;synthetic-hostile-contact&lt;\/script&gt;/u)
assert.doesNotMatch(renderHome(props), /<script>synthetic-hostile-contact/u)
cases++
const am = homeContactView([doc], 'am', now, mode)
assert.equal(am.facts.length, siteFactKeys.length)
props.documents = [doc]
props.locale = 'am'
assert.doesNotMatch(renderHome(props), /Unreviewed Amharic shaping fixture/u)
assert.match(renderHome(props), /<dl[^>]* lang="am">/u)
cases++
console.log(`Home canonical contacts passed: ${cases} projection, independent workflow, purpose/target, omission, lifecycle, invalidation, bilingual and escaped SSR cases.`)
