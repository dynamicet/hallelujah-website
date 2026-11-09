import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const applicationRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const [components, styles, fixture, exports, templates, tokens] = await Promise.all([
  read('src/design-system/components/system-states.tsx'),
  read('src/design-system/components/system-states.module.css'),
  read('src/design-system/templates/system-states-fixture-template.tsx'),
  read('src/design-system/components/index.ts'),
  read('src/design-system/templates/index.ts'),
  read('src/design-system/tokens/tokens.json'),
])
const failures = []

for (const [label, pattern] of [
  ['alert variants', /'emergency'[\s\S]*'error'[\s\S]*'warning'[\s\S]*'information'[\s\S]*'success'/u],
  ['distinct collection states', /'empty'[\s\S]*'error'[\s\S]*'offline'[\s\S]*'unavailable'[\s\S]*'expired'/u],
  ['explicit announcement timing', /announcement === 'static' \? undefined : announcement/u],
  ['assertive blocking role', /live === 'assertive' \? 'alert'/u],
  ['polite status role', /live === 'polite' \? 'status'/u],
  ['authoritative success contract', /readonly authoritative: true[\s\S]*readonly kind: 'success'/u],
  ['authoritative success marker', /data-authoritative-completion=\{authoritative \? 'true' : undefined\}/u],
  ['specific labeled structure', /aria-labelledby=\{headingId\}[\s\S]*<h3 id=\{headingId\}>\{heading\}<\/h3>/u],
  ['required state recovery', /readonly recovery: ReactNode/u],
  ['temporary effective metadata', /<dt>Effective<\/dt>[\s\S]*<time dateTime=\{effective\.dateTime\}>/u],
  ['temporary expiry metadata', /<dt>Expires or review due<\/dt>[\s\S]*<time dateTime=\{expires\.dateTime\}>/u],
  ['temporary owner metadata', /<dt>Information owner<\/dt>[\s\S]*<dd>\{owner\}<\/dd>/u],
  ['temporary affected scope', /<dt>Affected scope<\/dt>[\s\S]*<dd>\{scope\}<\/dd>/u],
  ['loading busy semantics', /data-loading-status[\s\S]*role="status"/u],
  ['critical fact preservation', /data-preserved-critical-facts/u],
  ['bounded skeleton API', /data-loading-boundary="non-critical-records"/u],
  ['skeleton hidden from accessibility tree', /aria-hidden="true"[\s\S]*data-skeleton-placeholder/u],
  ['protected-state marker', /data-experience-level=\{isProtectedState\(kind\) \? '0' : '1'\}/u],
]) {
  if (!pattern.test(components)) failures.push(`component source: missing ${label}`)
}

const expectedPrecedence = [
  'unavailable',
  'expired',
  'error',
  'invalid',
  'disabled',
  'loading',
  'pending',
  'pressed',
  'focus-visible',
  'hover',
  'default',
]
const precedenceSource = components.match(
  /export const componentStatePrecedence = \[([\s\S]*?)\] as const/u,
)?.[1]
const actualPrecedence = [...(precedenceSource ?? '').matchAll(/'([^']+)'/gu)].map(
  (match) => match[1],
)
if (JSON.stringify(actualPrecedence) !== JSON.stringify(expectedPrecedence)) {
  failures.push(`component source: state precedence is ${actualPrecedence.join(' -> ')}`)
}
if (!/componentStatePrecedence\.find\(\(state\) => activeStates\[state\]\) \?\? 'default'/u.test(components)) {
  failures.push('component source: dominant-state resolver does not use canonical precedence')
}

for (const name of [
  'componentStatePrecedence',
  'LoadingStatus',
  'NonCriticalSkeleton',
  'resolveDominantComponentState',
  'SystemAlert',
  'SystemState',
  'TemporaryNotice',
]) {
  if (!exports.includes(name)) failures.push(`component boundary: missing ${name} export`)
}
if (!templates.includes('SystemStatesFixtureTemplate')) {
  failures.push('template boundary: missing SystemStatesFixtureTemplate export')
}

for (const [label, pattern] of [
  ['intrinsic containment', /\.panel[\s\S]*max-inline-size:[\s\S]*min-inline-size:\s*0/u],
  ['non-color boundary', /border:\s*var\(--component-system-state-border-width\) solid currentColor/u],
  ['distinct semantic treatments', /\.information,[\s\S]*\.success[\s\S]*\.warning,[\s\S]*\.emergency,/u],
  ['minimum recovery target', /min-block-size:\s*var\(--component-system-state-target-minimum\)/u],
  ['focus target visibility', /\.panel:focus-visible/u],
  ['reduced loading motion', /@media \(prefers-reduced-motion: reduce\)[\s\S]*animation:\s*none/u],
  ['forced-colors boundaries', /@media \(forced-colors: active\)[\s\S]*border-color:\s*CanvasText/u],
  ['print treatment', /@media print[\s\S]*background:\s*transparent/u],
]) {
  if (!pattern.test(styles)) failures.push(`component styles: missing ${label}`)
}
if (/(?:#[\da-f]{3,8}\b|\brgba?\()/iu.test(styles)) {
  failures.push('component styles: raw color values are prohibited')
}
if (/overflow-x:\s*hidden/u.test(styles)) {
  failures.push('component styles: horizontal overflow must be fixed, not hidden')
}

for (const marker of [
  'data-system-states-fixture',
  '<SystemAlert',
  '<TemporaryNotice',
  '<SystemState',
  '<LoadingStatus',
  '<NonCriticalSkeleton',
  'synthetic wording only',
  'unreviewed shaping specimen',
  'performs no retry and makes no network request',
]) {
  if (!fixture.includes(marker)) failures.push(`controlled fixture: missing ${marker}`)
}
for (const kind of [...systemKindsFrom('systemAlertKinds'), ...systemKindsFrom('systemStateKinds')]) {
  if (!fixture.includes(`kind="${kind}"`)) failures.push(`controlled fixture: missing ${kind} specimen`)
}
if (/\b(?:fetch|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage)\b/u.test(fixture)) {
  failures.push('controlled fixture: requests and persistent storage are prohibited')
}
if (/dismiss|close/i.test(components)) {
  failures.push('component source: no dismissal API is allowed in the controlled baseline')
}

const manifest = JSON.parse(tokens)
if (!manifest.component?.['system-state']) {
  failures.push('token source: component.system-state aliases are missing')
}

if (failures.length > 0) {
  console.error('System state contract check failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log(
    'System state contract check passed (alerts, dated notices, distinct recovery states, loading boundaries, state precedence, protected motion, and controlled fixture).',
  )
}

function systemKindsFrom(exportName) {
  const source = components.match(new RegExp(`export const ${exportName} = \\[([\\s\\S]*?)\\] as const`, 'u'))?.[1] ?? ''
  return [...source.matchAll(/'([^']+)'/gu)].map((match) => match[1])
}

function read(relativePath) {
  return readFile(path.join(applicationRoot, relativePath), 'utf8')
}
