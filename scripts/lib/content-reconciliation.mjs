import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { repositoryRoot } from './repository-files.mjs'

export const reconciliationRoot = path.join(repositoryRoot, 'docs/content-reconciliation')
export const fingerprint = (value) => createHash('sha256').update(value).digest('hex')
const recordFingerprint = (value) => fingerprint(JSON.stringify(value))
const escapePointer = (value) => value.replace(/~/gu, '~0').replace(/\//gu, '~1')
export const sourceKey = (file, pointer) => `${file}#${pointer}`

export function indexSources(sources) {
  const records = []
  const add = (file, pointer, value, kind) => records.push({
    sourceKey: sourceKey(file, pointer), file, pointer, kind,
    fingerprint: recordFingerprint(value), value,
  })
  for (const [file, kind] of [
    ['data/doctors.json', 'clinician'], ['data/services.json', 'service'],
    ['data/site-pages.json', 'page'], ['data/media-manifest.json', 'media'],
  ]) {
    assert(Array.isArray(sources[file]), `Missing source array: ${file}`)
    sources[file].forEach((value, index) => {
      add(file, `/${index}`, value, kind)
      if (kind === 'clinician') {
        for (const [aliasIndex, url] of (value.duplicate_source_urls ?? []).entries()) {
          add(file, `/${index}/duplicate_source_urls/${aliasIndex}`, url, 'clinician-alias')
        }
      }
    })
  }
  // Each profile array item and nested object field has its own disposition.
  // Nested non-array values (e.g. map coordinates) remain one indivisible source unit.
  for (const [field, value] of Object.entries(sources['hospital-profile.json'])) {
    const pointer = `/${escapePointer(field)}`
    if (Array.isArray(value)) {
      value.forEach((item, index) => add('hospital-profile.json', `${pointer}/${index}`, item, 'profile'))
    } else if (value && typeof value === 'object') {
      for (const [nestedField, nestedValue] of Object.entries(value)) {
        const nestedPointer = `${pointer}/${escapePointer(nestedField)}`
        if (Array.isArray(nestedValue)) {
          nestedValue.forEach((item, index) => add('hospital-profile.json', `${nestedPointer}/${index}`, item, 'profile'))
        } else add('hospital-profile.json', nestedPointer, nestedValue, 'profile')
      }
    } else add('hospital-profile.json', pointer, value, 'profile')
  }
  return records
}

export async function loadReconciliation(root = reconciliationRoot) {
  const manifest = JSON.parse(await readFile(path.join(root, 'source-manifest.json'), 'utf8'))
  assert.equal(manifest.authority, 'unverified-extracted-evidence')
  assert.equal(manifest.rawSnapshotAvailable, false)
  assert.deepEqual(manifest.files.map((file) => file.path).sort(), [
    'hospital-profile.json', 'data/doctors.json', 'data/services.json',
    'data/site-pages.json', 'data/media-manifest.json', 'data/metadata.json',
    'source-readme.txt', 'content-inventory.txt', 'content-review.txt',
  ].sort(), 'Source manifest must preserve the entire available bundle')
  const sources = {}
  for (const file of manifest.files) {
    assert(/^(?:hospital-profile\.json|data\/[a-z-]+\.json|[a-z-]+\.txt)$/u.test(file.path), 'Unsafe source path')
    const bytes = await readFile(path.join(root, 'sources', file.path))
    assert.equal(bytes.length, file.bytes, `Source byte count changed: ${file.path}`)
    assert.equal(fingerprint(bytes), file.sha256, `Source fingerprint changed: ${file.path}`)
    if (file.path.endsWith('.json')) sources[file.path] = JSON.parse(bytes.toString('utf8'))
  }
  const register = JSON.parse(await readFile(path.join(root, 'dispositions.json'), 'utf8'))
  return { manifest, sources, register }
}

function exactKeys(value, keys, label) {
  assert.deepEqual(Object.keys(value).sort(), [...keys].sort(), `Unexpected fields: ${label}`)
}

export function reconcile(sources, register) {
  exactKeys(register, ['schemaVersion', 'boundary', 'responsible', 'hospitalApproval', 'entries', 'issues', 'limitations'], 'register')
  assert.equal(register.schemaVersion, 1)
  assert.equal(register.boundary, 'controlled-draft-no-migration')
  assert.equal(register.responsible, 'befikadusata')
  assert.equal(register.hospitalApproval, null)
  const records = indexSources(sources)
  const byKey = new Map(records.map((record) => [record.sourceKey, record]))
  assert.equal(byKey.size, records.length, 'Duplicate source identities')
  const entries = new Map()
  const dispositions = Object.fromEntries(['approve', 'correct', 'merge', 'omit', 'defer', 'reject'].map((name) => [name, 0]))
  const kinds = {}
  for (const entry of register.entries) {
    exactKeys(entry, ['sourceKey', 'fingerprint', 'disposition', 'canonicalId', 'mergeInto', 'reason', 'ownerRole', 'namedOwner', 'reviewState', 'gates', 'issues'], entry.sourceKey)
    const record = byKey.get(entry.sourceKey)
    assert(record, `Unknown source record: ${entry.sourceKey}`)
    assert(!entries.has(entry.sourceKey), `Duplicate disposition: ${entry.sourceKey}`)
    assert.equal(entry.fingerprint, record.fingerprint, `Stale disposition: ${entry.sourceKey}`)
    assert(Object.hasOwn(dispositions, entry.disposition), 'Unknown disposition')
    assert.notEqual(entry.disposition, 'approve', 'Hospital approval cannot be authored in this controlled draft')
    assert.equal(entry.canonicalId, null, 'No canonical identity is approved by this draft')
    assert.equal(entry.namedOwner, null, 'Hospital owners remain unassigned')
    assert.equal(entry.reviewState, 'proposed-awaiting-hospital-review')
    assert.equal(typeof entry.reason, 'string')
    assert(entry.reason.trim().length >= 20, 'Disposition requires a substantive reason')
    assert(['Medical Staff owner', 'Clinical owner', 'Operations owner', 'Executive/Content owner', 'Brand/Privacy owner', 'Privacy/Operations owner', 'Content Manager'].includes(entry.ownerRole), 'Unknown owner role')
    assert(Array.isArray(entry.gates) && entry.gates.includes('GOV-01') && entry.gates.includes('SEC-01'), 'Source/owner gates are required')
    assert(entry.gates.every((gate) => /^(?:GOV-01|SEC-01|BRAND-01|LANG-0[12]|SAFE-0[1-4]|CARE-0[1-6]|ACCESS-01|INST-0[1-3]|APPT-0[1-4])$/u.test(gate)), 'Unknown approval gate')
    assert(Array.isArray(entry.issues), 'Issue references must be an array')
    dispositions[entry.disposition] += 1
    kinds[record.kind] = (kinds[record.kind] ?? 0) + 1
    entries.set(entry.sourceKey, entry)
  }
  assert.equal(entries.size, records.length, 'Every source unit needs one disposition')
  for (const entry of entries.values()) {
    if (entry.disposition === 'merge') {
      const target = entries.get(entry.mergeInto)
      assert(target && target !== entry, 'Merge target must exist and differ from source')
      assert.notEqual(target.disposition, 'merge', 'Merge chains/cycles are forbidden')
      assert(!['omit', 'reject'].includes(target.disposition), 'Cannot merge into an excluded record')
      assert.equal(byKey.get(entry.sourceKey).kind, 'clinician-alias', 'Only the extracted duplicate profile is proposed for merge')
      assert.equal(byKey.get(entry.mergeInto).kind, 'clinician', 'Alias must target a clinician')
      const alias = byKey.get(entry.sourceKey)
      assert.equal(entry.mergeInto, sourceKey(alias.file, alias.pointer.split('/duplicate_source_urls/')[0]), 'Alias must target its extraction parent')
    } else assert.equal(entry.mergeInto, null, 'Only merge dispositions may name a target')
    const record = byKey.get(entry.sourceKey)
    if (record.kind === 'clinician' && !record.value.listed_in_current_directory) assert.equal(entry.disposition, 'defer', 'Profile-only clinicians require hospital confirmation')
    if (record.kind === 'media') assert.equal(entry.disposition, 'defer', 'Media references are not cleared binaries')
    for (const flag of record.value?.quality_flags ?? []) {
      assert(entry.issues.includes(flag), `Missing extracted defect: ${flag}`)
    }
  }
  const issues = new Map()
  for (const issue of register.issues) {
    exactKeys(issue, ['id', 'summary', 'ownerRole', 'namedOwner', 'state', 'sourceKeys', 'evidence', 'requiredDecision'], issue.id)
    assert(!issues.has(issue.id), 'Duplicate review issue')
    assert.equal(issue.state, 'open')
    assert.equal(issue.namedOwner, null)
    assert(issue.sourceKeys.length > 0 && issue.sourceKeys.every((key) => entries.has(key)), 'Issue must map to available evidence')
    assert(issue.requiredDecision.trim().length >= 20, 'Issue requires an explicit owner decision')
    assert(issue.evidence.every((reference) => ['source-readme.txt', 'content-review.txt', 'content-inventory.txt', ...Object.keys(sources)].includes(reference)), 'Unknown evidence reference')
    issues.set(issue.id, issue)
  }
  for (const entry of entries.values()) {
    for (const id of entry.issues) assert(issues.get(id)?.sourceKeys.includes(entry.sourceKey), `Missing bidirectional issue link: ${id}`)
  }
  for (const issue of issues.values()) {
    for (const key of issue.sourceKeys) assert(entries.get(key).issues.includes(issue.id), 'Issue missing from disposition')
  }
  for (const id of ['contact-conflicts', 'home-mission-conflict', 'directory-duplicate-card', 'ophthalmology-copied-copy', 'absent-dermatology-source', 'raw-snapshot-unavailable', 'missing-launch-content']) {
    assert(issues.has(id), `Required review gap missing: ${id}`)
  }
  assert.deepEqual(register.limitations, [
    'The 99-page raw WordPress snapshot is absent; available-bundle coverage is not raw-page coverage.',
    'Extracted text, links, forms and media URLs are inert evidence, never verified facts or executable configuration.',
    'No hospital approval, named hospital owner, canonical ID, corrected copy, translation, redirect or production migration is supplied.',
  ])
  const metadata = sources['data/metadata.json']
  assert.equal(sources['data/doctors.json'].length, metadata.doctor_record_count, 'Doctor inventory mismatch')
  assert.equal(sources['data/doctors.json'].filter((record) => record.listed_in_current_directory).length, metadata.current_directory_doctor_count, 'Directory inventory mismatch')
  assert.equal(sources['data/services.json'].length, metadata.service_record_count, 'Service inventory mismatch')
  assert.equal(metadata.source_page_count, 99)
  return {
    schemaVersion: 1, boundary: register.boundary, sourceExtractionDate: metadata.extracted_at,
    availableSourceUnits: records.length, dispositionedSourceUnits: entries.size,
    unaccountedSourceUnits: records.length - entries.size,
    kinds, dispositions, openReviewIssues: issues.size,
    currentDirectoryClinicians: metadata.current_directory_doctor_count,
    profileOnlyClinicians: metadata.doctor_record_count - metadata.current_directory_doctor_count,
    rawSnapshotPageCount: metadata.source_page_count, rawSnapshotAvailable: false,
    rawPageCoverage: 'unverifiable-without-original-snapshot',
    approvedCanonicalRecords: 0, approvedFacts: 0, migrationMutations: 0,
    limitations: register.limitations,
  }
}

export function renderReviewQueue(register) {
  const lines = [
    '# Hospital Content Review Queue', '',
    `**Status:** ${register.issues.length} open decisions; named hospital owners unassigned. All dispositions remain proposals.`, '',
    'The [register](dispositions.json) contains complete bidirectional source links; [source manifest](source-manifest.json) identifies the captured evidence. Counts below can overlap because one source unit can need several decisions. This queue supplies role assignments for review, not approval or verified replacement wording.', '',
  ]
  for (const issue of register.issues) {
    lines.push(
      `## ${issue.id}`, '', `${issue.summary}.`, '',
      `**Owner role:** ${issue.ownerRole}`, '',
      '**Named owner:** Unassigned', '', '**State:** Open', '',
      `**Affected source units:** ${issue.sourceKeys.length}`, '',
      `Required decision: ${issue.requiredDecision}`, '',
      `Evidence: ${issue.evidence.map((reference) => `\`${reference}\``).join(', ')}.`, '',
    )
  }
  return lines.join('\n')
}
