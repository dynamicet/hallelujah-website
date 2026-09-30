import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'

import {
  clinicianProfileFixture,
  clinicianProfileTime,
} from './lib/clinician-profile-fixture.mjs'
import {
  renderClinicianProfile,
  resolveClinicianProfile,
} from './lib/clinician-profile-renderer.mjs'
import {
  clinicianProfilePreviewDocument,
  createClinicianProfilePreviewServer,
} from './lib/clinician-profile-preview-server.mjs'

const { controlledClinicianIndex } = await import('../src/content/clinician-view.ts')

let cases = 0

const fixture = clinicianProfileFixture()
const profile = resolveClinicianProfile(fixture)
assert.equal(profile.outcome, 'profile')
assert.equal(profile.clinician?.publicId, fixture.publicId)
assert.equal(profile.canonicalPath, '/doctors/synthetic-clinician-profile/')
assert.ok(profile.clinician?.details.name)
assert.ok(profile.clinician?.details.specialties.length)
assert.match(profile.clinician?.reviewAt ?? '', /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/u)
assert.equal(profile.clinician?.portrait, null)
assert.equal(profile.clinician?.schedule, null)
assert.deepEqual(profile.clinician?.appointment, {
  doctorPublicId: fixture.publicId,
  state: 'withheld',
})
assert.equal(new Set(profile.locations.map((entry) => entry.publicId)).size, profile.locations.length)
assert.equal(new Set(profile.relatedServices.map((entry) => entry.publicId)).size, profile.relatedServices.length)
cases++

const partialHtml = clinicianProfilePreviewDocument('partial')
assert.doesNotMatch(partialHtml, /<h[1-6][^>]*>\s*<\/h[1-6]>/u)
assert.doesNotMatch(partialHtml, /<li[^>]*>\s*<\/li>/u)
assert.doesNotMatch(partialHtml, /Synthetic areas of care|About this synthetic record|Related synthetic services|Controlled location/u)
cases++

const portraitFixture = clinicianProfileFixture('portrait-omitted')
const portraitProfile = resolveClinicianProfile(portraitFixture)
const portraitHtml = renderClinicianProfile({ profile: portraitProfile })
assert.ok(portraitFixture.records.some((record) => record.kind === 'doctor' && record.clinician?.portrait))
assert.equal(portraitProfile.clinician?.portrait, null)
assert.equal((portraitHtml.match(/data-portrait-omitted/gu) ?? []).length, 1)
assert.doesNotMatch(portraitHtml, /<img\b|Synthetic portrait metadata only|Synthetic rights fixture/u)
cases++

const multilingual = resolveClinicianProfile(clinicianProfileFixture('long-multilingual-name'))
assert.match(multilingual.clinician?.details.name ?? '', /\p{Script=Ethiopic}/u)
assert.match(renderClinicianProfile({ profile: multilingual }), /controlled multilingual-name shaping specimen/u)
cases++

const withdrawnRelationshipFixture = clinicianProfileFixture()
const currentLink = withdrawnRelationshipFixture.links[0]
const withdrawnRelationship = {
  ...currentLink,
  audit: [...currentLink.audit, {
    actor: 'cms:106',
    at: '2026-09-29T12:00:06Z',
    change: 'withdraw: synthetic validation removal',
  }],
  revision: currentLink.revision + 1,
  state: 'withdrawn',
}
const withoutWithdrawnRelationship = resolveClinicianProfile({
  ...withdrawnRelationshipFixture,
  links: [withdrawnRelationship],
})
assert.equal(withoutWithdrawnRelationship.outcome, 'profile')
assert.deepEqual(withoutWithdrawnRelationship.locations, [])
assert.deepEqual(withoutWithdrawnRelationship.relatedServices, [])
cases++

const expiredRelationship = {
  ...currentLink,
  definition: {
    ...currentLink.definition,
    reviewAt: '2026-09-29T12:00:30Z',
  },
}
const withoutExpiredRelationship = resolveClinicianProfile({
  ...withdrawnRelationshipFixture,
  links: [expiredRelationship],
})
assert.equal(withoutExpiredRelationship.outcome, 'profile')
assert.deepEqual(withoutExpiredRelationship.locations, [])
assert.deepEqual(withoutExpiredRelationship.relatedServices, [])
cases++

const reviewBoundary = new Date(clinicianProfileTime.getTime() + 30 * 86_400_000)
const beforeReviewBoundary = new Date(reviewBoundary.getTime() - 1)
assert.equal(resolveClinicianProfile(fixture, beforeReviewBoundary).outcome, 'profile')
assert.equal(resolveClinicianProfile(fixture, reviewBoundary).outcome, 'unavailable')
assert.equal(controlledClinicianIndex(
  fixture.records,
  'en',
  beforeReviewBoundary,
  'controlled-fixture',
).length, 1)
assert.equal(controlledClinicianIndex(
  fixture.records,
  'en',
  reviewBoundary,
  'controlled-fixture',
).length, 0)
cases++

const expiryBoundary = new Date(clinicianProfileTime.getTime() + 60 * 86_400_000)
assert.equal(resolveClinicianProfile(fixture, expiryBoundary).outcome, 'unavailable')
assert.equal(controlledClinicianIndex(
  fixture.records,
  'en',
  expiryBoundary,
  'controlled-fixture',
).length, 0)
cases++

const gone = resolveClinicianProfile(clinicianProfileFixture('gone'))
const successor = resolveClinicianProfile(clinicianProfileFixture('redirect'))
assert.deepEqual({ outcome: gone.outcome, path: gone.canonicalPath }, { outcome: 'gone', path: null })
assert.deepEqual(
  { outcome: successor.outcome, path: successor.canonicalPath },
  { outcome: 'redirect', path: '/doctors/synthetic-successor-profile/' },
)
cases++

const unavailableAppointment = clinicianProfilePreviewDocument('appointment-unavailable')
assert.match(unavailableAppointment, /role="status"[^>]*>The controlled appointment route is unavailable/u)
assert.doesNotMatch(unavailableAppointment, /href="[^"]*appointments|<form\b|<input\b/u)
assert.match(unavailableAppointment, /data-appointment-doctor-public-id="pub_09090909090901"/u)
cases++

const appRoot = new URL('../src/app/', import.meta.url)
assert.equal(existsSync(new URL('doctors/', appRoot)), false)
cases++

const server = await createClinicianProfilePreviewServer()
try {
  const expected = new Map([
    ['/', 200],
    ['/partial', 200],
    ['/portrait-omitted', 200],
    ['/long-multilingual-name', 200],
    ['/appointment-unavailable', 200],
    ['/unapproved', 404],
    ['/gone', 410],
    ['/failure', 503],
  ])
  for (const [pathname, status] of expected) {
    const response = await fetch(`${server.origin}${pathname}`)
    assert.equal(response.status, status, pathname)
    assert.equal(response.headers.get('cache-control'), 'no-store', pathname)
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow, noarchive', pathname)
    assert.match(await response.text(), /<meta name="robots" content="noindex,nofollow">/u, pathname)
    cases++
  }
  const head = await fetch(server.origin, { method: 'HEAD' })
  assert.equal(head.status, 200)
  assert.equal(await head.text(), '')
  cases++
} finally {
  await server.close()
}

console.log(`Clinician-profile validation passed: ${cases} completeness, omission, lifecycle, relationship, withdrawal and isolation cases.`)
