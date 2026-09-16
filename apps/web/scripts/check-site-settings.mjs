import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { applyWorkflow, createWorkflow } from '../src/content/cms-workflow.ts'
import { publicEligibility, validateGovernedRecord, validateRecordSet } from '../src/content/governed-record.ts'
import { canonicalPhone, siteFactKeys, validateSiteSettings } from '../src/content/site-settings.ts'
import { canonicalContactView, CanonicalContactDetails } from '../src/content/canonical-contact-view.ts'
import { siteSettingsFixture } from './lib/site-settings-fixture.mjs'

const now = new Date('2026-09-16T12:00:00Z')
const fixture = siteSettingsFixture(now)
const author = { id: 'cms:1', roles: ['author', 'operations', 'reviewer'] }
const operations = { id: 'cms:2', roles: ['operations', 'reviewer'] }
const reviewer = { id: 'cms:3', roles: ['reviewer'] }
const publisher = { id: 'cms:4', roles: ['publisher'] }
const fact = (key, change) => ({ ...fixture, siteSettings: { ...fixture.siteSettings,
  [key]: { ...fixture.siteSettings[key], ...change } } })
const action = (doc, actor, name, extra = {}, input, time = now) => applyWorkflow(doc, input,
  { action: name, expectedRevision: doc.workflow.revision, ...extra }, actor, time)
const submitted = (record) => action(createWorkflow(record, 'contact', author, now), author, 'submit')
const reviewed = (record) => action(submitted(record), operations, 'review-domain',
  { domain: 'operations', reference: 'synthetic independent operations review' })

assert.equal(validateGovernedRecord(fixture).ok, true)
assert.equal(validateSiteSettings({ ...fixture.siteSettings, mystery: {} }).ok, false)
for (const key of siteFactKeys) {
  const missing = { ...fixture.siteSettings }
  delete missing[key]
  assert.equal(validateSiteSettings(missing).ok, false)
  for (const change of [{ value: '' }, { label: { am: 'የቁጥጥር ምሳሌ' } },
    { verifier: null }, { source: '' }, { checkedAt: '2026-02-30T12:00:00Z' },
    { checkedAt: '2026-09-16T12:00:00+03:00' }, { reviewAt: fixture.siteSettings[key].checkedAt }]) {
    assert.equal(validateGovernedRecord(fact(key, change)).ok, false, `${key}: ${JSON.stringify(change)}`)
  }
  for (const change of [{ state: 'conflict', note: 'Synthetic conflict awaiting reconciliation' },
    { state: 'unverified' }, { state: 'withheld', value: null, note: 'Synthetic omission decision' },
    { reviewAt: '2026-09-16T11:00:00Z' }, { expiresAt: '2026-09-16T11:00:00Z' },
    { checkedAt: '2026-09-16T13:00:00Z' }]) {
    const unresolved = fact(key, change)
    assert.throws(() => action(reviewed(unresolved), reviewer, 'approve'), /unresolved|current/)
    assert.equal(canonicalContactView(unresolved, 'en', now, 'controlled-fixture').state, 'unavailable')
  }
}
assert.equal(validateGovernedRecord({ ...fixture, kind: 'location' }).ok, false)
assert.equal(validateGovernedRecord(fact('ambulancePhone', {
  label: fixture.siteSettings.emergencyPhone.label })).ok, false)
assert.equal(validateGovernedRecord(fact('email', { value: 'test@hospital.invalid?subject=secret' })).ok, false)
assert.equal(validateGovernedRecord(fact('emergencyPhone', { value: 'javascript:alert(1)' })).ok, false)
for (const value of ['.contact@hospital.invalid', 'contact..desk@hospital.invalid',
  'contact@-hospital.invalid', 'contact@hospital-.invalid']) {
  assert.equal(validateGovernedRecord(fact('email', { value })).ok, false)
}
assert.equal(canonicalPhone('12345'), null)
assert.equal(validateGovernedRecord(fact('address', { value: 'Synthetic\naddress' })).ok, false)
assert.throws(() => createWorkflow(fixture, 'general', author, now), /contact safety class/)
assert.throws(() => action(submitted(fixture), author, 'approve'), /self-approve/)
assert.throws(() => action(submitted(fixture), reviewer, 'approve'), /domain reviews/)
assert.throws(() => action(reviewed(fixture), operations, 'approve'), /two distinct/)

const approved = action(reviewed(fixture), reviewer, 'approve')
assert.throws(() => action(approved, publisher, 'publish', {}, undefined,
  new Date('2026-09-24T12:00:00Z')), /unresolved|current/)
assert.throws(() => action(approved, publisher, 'publish', {}, fact('emergencyPhone', { value: '+1 202 555 0199' })),
  /Content cannot change/)
const published = action(approved, publisher, 'publish')
assert.equal(publicEligibility(published.record, now).eligible, false)
assert.equal(publicEligibility({ ...published.record, synthetic: false }, now).reason, 'safety-gated')
assert.equal(canonicalContactView(published.record, 'en', now).state, 'unavailable')
assert.equal(canonicalContactView({ ...published.record, synthetic: false }, 'en', now, 'controlled-fixture').state,
  'unavailable')
assert.ok(validateRecordSet([published.record, { ...fixture, publicId: 'pub_040404040404',
  localized: { en: { slug: 'another-settings', title: 'Another synthetic settings record' } } }])
  .includes('only one current canonical site-settings record is allowed'))
const retired = action(published, publisher, 'withdraw', { reason: 'Synthetic retirement' })
assert.equal(canonicalContactView(retired.record, 'en', now, 'controlled-fixture').state, 'unavailable')
assert.equal(validateRecordSet([retired.record, fixture]).includes('only one current canonical site-settings record is allowed'),
  false)

for (const locale of ['en', 'am']) {
  const view = canonicalContactView(published.record, locale, now, 'controlled-fixture')
  assert.equal(view.facts.length, siteFactKeys.length)
  for (const entry of view.facts) {
    assert.equal(entry.value, fixture.siteSettings[entry.key].value)
    if (entry.key.endsWith('Phone')) assert.equal(entry.target, `tel:${canonicalPhone(entry.value)}`)
    if (entry.key === 'email') assert.equal(entry.target, `mailto:${entry.value}`)
  }
  const html = renderToStaticMarkup(createElement(CanonicalContactDetails,
    { record: published.record, locale, now, mode: 'controlled-fixture' }))
  assert.match(html, /Synthetic contact fixture/)
  assert.match(html, /<dl>/)
  assert.doesNotMatch(html, /<a\b|<script\b|href=|<input\b/)
  for (const key of siteFactKeys) assert.ok(html.includes(`data-contact-fact="${key}"`))
  if (locale === 'am') assert.match(html, /<p lang="en">Unreviewed Amharic/)
}
const changed = fact('publicPhone', { value: '+1 202 555 0199' })
assert.equal(canonicalContactView(changed, 'en', now, 'controlled-fixture').facts
  .find((entry) => entry.key === 'publicPhone').target, 'tel:+12025550199')
const withheld = renderToStaticMarkup(createElement(CanonicalContactDetails, { record: published.record,
  locale: 'en', now }))
assert.doesNotMatch(withheld, /555|hospital.invalid|Synthetic hospital identity/)
assert.equal(canonicalContactView(null, 'en', now, 'controlled-fixture').state, 'unavailable')
assert.equal(canonicalContactView(fixture, 'unsupported', now, 'controlled-fixture').state, 'unavailable')
const escaped = renderToStaticMarkup(createElement(CanonicalContactDetails, { record: fact('address',
  { value: '<script>alert("synthetic")</script>' }), locale: 'en', now, mode: 'controlled-fixture' }))
assert.doesNotMatch(escaped, /<script>/)
assert.match(escaped, /&lt;script&gt;/)
assert.equal(canonicalContactView(fixture, 'en', new Date('invalid'), 'controlled-fixture').state, 'unavailable')
const noAmharic = fact('address', { label: { en: 'Address' } })
assert.equal(canonicalContactView(noAmharic, 'am', now, 'controlled-fixture').facts
  .some((entry) => entry.key === 'address'), false)
process.stdout.write('Canonical site-settings schema, conflict/safety/lifecycle negatives and bilingual inert-render consistency passed.\n')
