import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'

import {
  clinicianProfileFixture,
  clinicianProfileFixtureStates,
} from './lib/clinician-profile-fixture.mjs'
import {
  clinicianProfileStyles,
  renderClinicianProfile,
  resolveClinicianProfile,
} from './lib/clinician-profile-renderer.mjs'
import {
  clinicianProfilePreviewDocument,
  createClinicianProfilePreviewServer,
} from './lib/clinician-profile-preview-server.mjs'

let cases = 0

const controlled = resolveClinicianProfile(clinicianProfileFixture())
assert.equal(controlled.outcome, 'profile')
assert.equal(controlled.clinician?.details.name, 'Dr Synthetic Meron')
assert.equal(controlled.locations.length, 1)
assert.equal(controlled.relatedServices.length, 1)
assert.equal(controlled.clinician?.portrait, null)
assert.equal(controlled.clinician?.schedule, null)
assert.equal(controlled.clinician?.appointment.state, 'withheld')
assert.match(controlled.canonicalPath ?? '', /^\/doctors\/synthetic-clinician-profile\/$/u)
cases++

const partial = resolveClinicianProfile(clinicianProfileFixture('partial'))
assert.equal(partial.outcome, 'profile')
assert.equal(partial.locations.length, 0)
assert.equal(partial.relatedServices.length, 0)
assert.deepEqual(partial.clinician?.details.credentials, [])
assert.deepEqual(partial.clinician?.details.interests, [])
assert.deepEqual(partial.clinician?.details.languages, [])
cases++

const missing = resolveClinicianProfile(clinicianProfileFixture('missing-related'))
assert.equal(missing.outcome, 'profile')
assert.deepEqual(missing.locations, [])
assert.deepEqual(missing.relatedServices, [])
cases++

assert.equal(resolveClinicianProfile(clinicianProfileFixture('unapproved')).outcome, 'unavailable')
assert.equal(resolveClinicianProfile(clinicianProfileFixture('gone')).outcome, 'gone')
const redirect = resolveClinicianProfile(clinicianProfileFixture('redirect'))
assert.equal(redirect.outcome, 'redirect')
assert.equal(redirect.canonicalPath, '/doctors/synthetic-successor-profile/')
cases += 3

for (const state of clinicianProfileFixtureStates.filter((value) => value !== 'redirect')) {
  const html = clinicianProfilePreviewDocument(state)
  const unavailable = ['failure', 'gone', 'unapproved'].includes(state)
  assert.equal((html.match(/<main\b/gu) ?? []).length, 1, state)
  assert.equal((html.match(/<h1\b/gu) ?? []).length, 1, state)
  assert.match(html, /<main id="main-content" tabindex="-1">/u, state)
  assert.match(html, /noindex,nofollow/u, state)
  assert.match(html, /synthetic-inert-b04-009/u, state)
  assert.match(html, /Approved Amharic clinician-profile wording is unavailable/u, state)
  assert.doesNotMatch(html, /href="(?:tel:|mailto:|https?:)|<iframe\b|<video\b|<img\b|<form\b|<input\b|<textarea\b/iu, state)
  assert.doesNotMatch(html, /book now|available today|accepting patients|schedule with/iu, state)
  assert.equal((html.match(/data-site-header/gu) ?? []).length, 1, state)
  assert.equal((html.match(/data-profile-section="P0"/gu) ?? []).length, 1, state)
  if (unavailable) {
    assert.equal((html.match(/data-profile-section="P1"/gu) ?? []).length, 1, state)
    assert.equal((html.match(/data-profile-section="P7"/gu) ?? []).length, 1, state)
    assert.doesNotMatch(html, /data-appointment-doctor-public-id/u, state)
  } else {
    assert.match(html, /data-appointment-doctor-public-id="pub_09090909090901"/u, state)
    assert.match(html, /Portrait withheld/u, state)
    assert.doesNotMatch(html, /availabilityGuidance|Synthetic portrait metadata only/u, state)
  }
  cases++
}

const partialHtml = clinicianProfilePreviewDocument('partial')
assert.doesNotMatch(partialHtml, /About this synthetic record|Synthetic areas of care|Related synthetic services|Controlled location/u)
assert.doesNotMatch(partialHtml, /location relationship/u)
cases++

const missingHtml = clinicianProfilePreviewDocument('missing-related')
assert.doesNotMatch(missingHtml, /Related synthetic services|Synthetic support service/u)
cases++

const hostile = {
  ...controlled,
  clinician: {
    ...controlled.clinician,
    details: {
      ...controlled.clinician.details,
      name: '<script>profile-hostile</script>',
      specialties: ['<img src=x onerror=hostile>'],
    },
  },
}
const escaped = renderClinicianProfile({ profile: hostile, state: 'ready' })
assert.match(escaped, /&lt;script&gt;profile-hostile&lt;\/script&gt;/u)
assert.doesNotMatch(escaped, /<script>profile-hostile|<img src=x/u)
cases++

const css = clinicianProfileStyles()
const declarations = new Set([...css.matchAll(/(--[\w-]+)\s*:/gu)].map((match) => match[1]))
for (const match of css.matchAll(/var\((--[\w-]+)\)/gu)) {
  assert.ok(declarations.has(match[1]), `Undefined token ${match[1]}`)
}
const templateCss = await readFile(new URL('../src/design-system/templates/clinician-profile-template.module.css', import.meta.url), 'utf8')
assert.doesNotMatch(templateCss, /(?:#[\da-f]{3,8}\b|\brgba?\()/iu)
assert.doesNotMatch(templateCss, /@keyframes|animation\s*:/u)
cases++

const appRoot = new URL('../src/app/', import.meta.url)
assert.equal(existsSync(new URL('doctors/', appRoot)), false, 'Deployable clinician-profile route must remain absent')
const appSources = await collectSources(appRoot)
for (const file of appSources) {
  const content = await readFile(file, 'utf8')
  assert.doesNotMatch(content, /clinician-profile-(?:fixture|renderer|preview-server)/u, file.pathname)
}
cases++

const server = await createClinicianProfilePreviewServer()
try {
  const response = await fetch(server.origin)
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow, noarchive')
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.match(response.headers.get('content-security-policy') ?? '', /connect-src 'none'/u)
  assert.match(await response.text(), /Dr Synthetic Meron/u)
  assert.equal((await fetch(`${server.origin}/unapproved`)).status, 404)
  assert.equal((await fetch(`${server.origin}/gone`)).status, 410)
  assert.equal((await fetch(`${server.origin}/failure`)).status, 503)
  const redirectResponse = await fetch(`${server.origin}/redirect`, { redirect: 'manual' })
  assert.equal(redirectResponse.status, 302)
  assert.equal(redirectResponse.headers.get('location'), '/')
  assert.equal((await fetch(`${server.origin}/?unexpected=value`)).status, 400)
  assert.equal((await fetch(server.origin, { method: 'POST' })).status, 405)
  assert.equal((await fetch(`${server.origin}/missing`)).status, 404)
  cases += 9
} finally {
  await server.close()
}

console.log(`Clinician-profile contract passed: ${cases} projection, omission, lifecycle, SSR, isolation, escaping and header cases.`)

async function collectSources(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory)
    if (entry.isDirectory()) files.push(...await collectSources(child))
    else if (/\.(?:ts|tsx)$/u.test(entry.name)) files.push(child)
  }
  return files
}
