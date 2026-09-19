import assert from 'node:assert/strict'
import { applyWorkflow } from '../src/content/cms-workflow.ts'
import { controlledHomeGovernedView } from '../src/content/home-governed-view.ts'
import {
  homeGovernedFixture,
  homeGovernedFixtureStates,
  homeGovernedTime,
} from './lib/home-governed-fixture.mjs'
import { renderHome } from './lib/home-renderer.mjs'

const current = homeGovernedFixture()
const props = current.governed
const view = controlledHomeGovernedView(props.records, props.relationships,
  props.institutionalDocuments, props.selection, 'en', props.now, 'controlled-fixture')
assert.equal(view.doctors.length, 1)
assert.equal(view.services.length, 1)
assert.equal(view.institutions.length, 1)
assert.match(view.doctors[0].canonicalPath, /^\/doctors\/synthetic-clinician-/u)
assert.match(view.services[0].canonicalPath, /^\/services\/synthetic-service-/u)
assert.equal(controlledHomeGovernedView(props.records, props.relationships,
  props.institutionalDocuments, props.selection, 'en', props.now).doctors.length, 0)
assert.equal(controlledHomeGovernedView(props.records, props.relationships,
  props.institutionalDocuments, props.selection, 'en', new Date('invalid'), 'controlled-fixture').services.length, 0)
assert.deepEqual(controlledHomeGovernedView(props.records, props.relationships,
  props.institutionalDocuments, null, 'en', props.now, 'controlled-fixture'),
{ doctors: [], institutions: [], services: [] })
const unrelated = controlledHomeGovernedView(props.records, [], props.institutionalDocuments,
  props.selection, 'en', props.now, 'controlled-fixture')
assert.equal(unrelated.doctors.length, 0)
assert.equal(unrelated.services.length, 0)
assert.equal(unrelated.institutions.length, 1)

for (const state of homeGovernedFixtureStates) {
  const html = renderHome(homeGovernedFixture(state))
  const sections = [...html.matchAll(/data-home-governed-section="([^"]+)"/gu)].map((match) => match[1])
  const expected = {
    'governed-current': ['services', 'doctors', 'institutional'],
    'governed-doctor-only': ['doctors'],
    'governed-service-only': ['services'],
    'governed-institution-only': ['institutional'],
  }[state] ?? []
  assert.deepEqual(sections, expected, state)
  assert.doesNotMatch(html, /<h2[^>]*>\s*<\/h2>|<h3[^>]*>\s*<\/h3>/u, state)
  if (state === 'governed-current') {
    assert.match(html, /href="\/services\/synthetic-service-/u)
    assert.match(html, /href="\/doctors\/synthetic-clinician-/u)
    assert.match(html, /Synthetic institutional fact/u)
    assert.match(html, /data-card-state="current"/u)
    assert.doesNotMatch(html, /Synthetic person|Synthetic organization|accepted insurance|first in/u)
  } else if (!expected.length) {
    assert.doesNotMatch(html, /Browse care by need|Synthetic featured clinicians|About the hospital/u, state)
  }
}

for (const [field, selection] of [
  ['doctors', { ...props.selection, doctorPublicIds: [props.selection.doctorPublicIds[0], props.selection.doctorPublicIds[0]] }],
  ['services', { ...props.selection, servicePublicIds: ['not-a-public-id'] }],
  ['institutions', { ...props.selection, institutionalPublicIds: Array.from({ length: 4 }, (_, index) => `pub_${index}aaaaaaaaaaa`) }],
]) {
  const invalid = controlledHomeGovernedView(props.records, props.relationships,
    props.institutionalDocuments, selection, 'en', props.now, 'controlled-fixture')
  assert.equal(invalid[field].length, 0)
}

const hostile = homeGovernedFixture()
const institution = hostile.governed.institutionalDocuments[0]
const returned = applyWorkflow(institution, undefined, {
  action: 'withdraw', expectedRevision: institution.workflow.revision, reason: 'Synthetic correction',
}, { id: 'cms:6', roles: ['publisher'] }, homeGovernedTime)
hostile.governed.institutionalDocuments = [returned]
assert.doesNotMatch(renderHome(hostile), /data-home-governed-section="institutional"/u)

console.log(`Home governed-content contract passed: ${homeGovernedFixtureStates.length} SSR states, canonical selections, lifecycle and whole-section omissions.`)
