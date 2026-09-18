import assert from 'node:assert/strict'
import path from 'node:path'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { contentFingerprint, contentImportFailures, contentPayloadFailures, contentTraceFailures, fixtureMarkers } from './lib/content-build-policy.mjs'
import { collectFilesUnder, repositoryRoot, repositoryRelative } from './lib/repository-files.mjs'

const app = path.join(repositoryRoot, 'apps/web')
const sourceFile = path.join(app, 'src/content/control.ts')
const traceFile = path.join(app, '.next/server/app/page.js.nft.json')
const controls = []
function control(id, check) { check(); controls.push({ id, passed: true }) }
for (const [id, source] of Object.entries({
  import: "import { clinicianFixture } from '../../scripts/lib/clinician-fixture.mjs'",
  reexport: "export { clinicianFixture } from '../../scripts/lib/clinician-fixture.mjs'",
  dynamic: "const fixture = import('../../scripts/lib/clinician-fixture.mjs')",
  require: "const fixture = require('../../scripts/lib/clinician-fixture.mjs')",
  alias: "import data from '@/../scripts/lib/site-settings-fixture.mjs'",
  multiline: "import {\n fixture\n} from '../../../../docs/review.mjs'",
  importEquals: "import fixture = require('../../scripts/lib/clinician-fixture.mjs')",
})) control(`build-negative-${id}`, () => assert.ok(contentImportFailures(sourceFile, source).length, id))
control('build-positive-runtime', () => assert.deepEqual(contentImportFailures(sourceFile,
  "import { validateGovernedRecord } from './governed-record.ts'; const text = 'scripts are internal'"), []))
control('build-positive-comment', () => assert.deepEqual(contentImportFailures(sourceFile,
  "// import data from '../../scripts/lib/fixture.mjs'"), []))
control('build-negative-traced-fixture', () => assert.ok(contentTraceFailures(traceFile,
  { version: 1, files: [path.relative(path.dirname(traceFile), path.join(app, 'scripts/lib/clinician-fixture.mjs'))] }).length))
control('build-negative-traced-docs', () => assert.ok(contentTraceFailures(traceFile,
  { version: 1, files: [path.join(repositoryRoot, 'docs/review.json')] }).length))
control('build-negative-malformed-trace', () => assert.ok(contentTraceFailures(traceFile, { files: [] }).length))
control('build-positive-trace', () => assert.deepEqual(contentTraceFailures(traceFile,
  { version: 1, files: ['../../../src/content/governed-record.ts'] }), []))
for (const [index, marker] of fixtureMarkers.entries()) control(`build-negative-payload-${index + 1}`,
  () => assert.ok(contentPayloadFailures(`compiled:${marker}:end`).length))
control('build-positive-bootstrap', () => assert.deepEqual(contentPayloadFailures('Controlled implementation workspace; Synthetic component fixture'), []))
const syntheticBinary = Buffer.from([0, 255, 0, 128, 1])
control('build-negative-copied-binary', () => assert.ok(contentPayloadFailures(syntheticBinary,
  new Set([contentFingerprint(syntheticBinary)])).length))
control('build-positive-distinct-binary', () => assert.deepEqual(contentPayloadFailures(Buffer.from([1, 2, 3]),
  new Set([contentFingerprint(syntheticBinary)])), []))

const sourceFiles = (await collectFilesUnder(path.join(app, 'src'), (file) => /\.[cm]?[jt]sx?$/.test(file)))
sourceFiles.push(path.join(app, 'next.config.ts'))
const failures = []
for (const file of sourceFiles) {
  for (const issue of contentImportFailures(file, await readFile(file, 'utf8'))) failures.push(`${repositoryRelative(file)}: ${issue}`)
}

let traces = 0
let payloads = 0
let evidenceAssets = 0
if (!process.argv.includes('--policy-only')) {
  // Missing output/manifests are errors: this cannot pass against an absent build.
  const routes = JSON.parse(await readFile(path.join(app, '.next/server/app-paths-manifest.json'), 'utf8'))
  assert.ok(Object.keys(routes).length > 0, 'build must contain an application entry')
  await readFile(path.join(app, '.next/BUILD_ID'), 'utf8')
  const outputs = await collectFilesUnder(path.join(app, '.next/server'))
  outputs.push(...await collectFilesUnder(path.join(app, '.next/static')))
  outputs.push(...await collectFilesUnder(path.join(app, 'public')))
  const serverTrace = path.join(app, '.next/next-server.js.nft.json')
  outputs.push(serverTrace)
  const evidenceFiles = await collectFilesUnder(path.join(repositoryRoot, 'docs/backlog/evidence'),
    (file) => /\.(?:png|jpe?g|webp|avif|svg|woff2?|pdf|mp4|vtt)$/.test(file))
  evidenceAssets = evidenceFiles.length
  const fingerprints = new Set(await Promise.all(evidenceFiles.map(async (file) => contentFingerprint(await readFile(file)))))
  for (const file of outputs) {
    if (file.endsWith('.nft.json')) {
      traces += 1
      for (const issue of contentTraceFailures(file, JSON.parse(await readFile(file, 'utf8')))) failures.push(`${repositoryRelative(file)}: ${issue}`)
    } else {
      payloads += 1
      for (const issue of contentPayloadFailures(await readFile(file), fingerprints)) failures.push(`${repositoryRelative(file)}: ${issue}`)
    }
  }
  assert.ok(traces > 1 && payloads > 0, 'route traces and build payloads must be inspected')
}
const report = { scope: 'Controlled build isolation; bootstrap is not publication approval',
  sourceFiles: sourceFiles.length, traces, payloads, evidenceAssets, controls, failures }
if (process.argv.includes('--capture')) {
  const root = path.join(repositoryRoot, 'docs/backlog/evidence/b02-014-artifacts')
  await mkdir(root, { recursive: true })
  await writeFile(path.join(root, 'build-report.json'), JSON.stringify(report, null, 2) + '\n')
}
if (failures.length) {
  console.error('Content build isolation failed:\n' + failures.join('\n'))
  process.exitCode = 1
} else console.log(`Content build isolation passed: ${controls.length} controls; ${sourceFiles.length} source files; ${traces} traces; ${payloads} payloads.`)
