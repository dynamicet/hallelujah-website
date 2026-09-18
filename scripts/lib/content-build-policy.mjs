import path from 'node:path'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import { repositoryRoot } from './repository-files.mjs'

const require = createRequire(path.join(repositoryRoot, 'apps/web/package.json'))
const ts = require('typescript')
const forbiddenRoots = [
  'apps/web/scripts', 'scripts', 'docs', 'resources', '.agents', '.codex',
].map((root) => path.join(repositoryRoot, root))
// The extracted source inventory is outside this repository and has no runtime authority.
forbiddenRoots.push(path.resolve(repositoryRoot, '../resources'))

export const fixtureMarkers = [
  'synthetic-clinician-fixture', 'synthetic-service-fixture', 'synthetic-site-settings-fixture',
  'synthetic-statement-fixture', 'synthetic-visitor-fixture',
  'synthetic-institution-fixture', 'synthetic-transfer-specimen', 'fixture-only-no-malware-clearance',
  'contact@hospital.invalid', 'Synthetic address — no real location',
]

export function forbiddenContentPath(file) {
  const normalized = path.resolve(file)
  return forbiddenRoots.some((root) => normalized === root || normalized.startsWith(root + path.sep))
}

export function contentImportFailures(file, source) {
  const failures = []
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true)
  function inspect(specifier) {
    if (!specifier || !ts.isStringLiteralLike(specifier)) return
    const value = specifier.text
    const target = value.startsWith('@/') ? path.join(repositoryRoot, 'apps/web/src', value.slice(2))
      : value.startsWith('.') ? path.resolve(path.dirname(file), value)
        : path.isAbsolute(value) ? value : null
    if (target && forbiddenContentPath(target)) failures.push('test/review content dependency')
  }
  function visit(node) {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) inspect(node.moduleSpecifier)
    if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) inspect(node.moduleReference.expression)
    if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword
      || ts.isIdentifier(node.expression) && node.expression.text === 'require')) inspect(node.arguments[0])
    ts.forEachChild(node, visit)
  }
  visit(tree)
  return failures
}

export function contentTraceFailures(traceFile, input) {
  if (!input || input.version !== 1 || !Array.isArray(input.files)
    || input.files.some((file) => typeof file !== 'string' || !file)) return ['invalid output trace']
  return input.files.filter((file) => forbiddenContentPath(path.resolve(path.dirname(traceFile), file)))
    .map(() => 'test/review content in deployment trace')
}

export const contentFingerprint = (payload) => createHash('sha256').update(payload).digest('hex')

export function contentPayloadFailures(payload, fixtureFingerprints = new Set()) {
  // Report labels only; never print the payload or a potentially sensitive value.
  const text = typeof payload === 'string' ? payload : payload.toString('utf8')
  return [
    ...fixtureMarkers.filter((marker) => text.includes(marker)).map(() => 'authored content fixture payload'),
    ...(fixtureFingerprints.has(contentFingerprint(payload)) ? ['copied synthetic evidence asset'] : []),
  ]
}
