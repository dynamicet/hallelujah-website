import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { designTokenValues } from '../src/design-system/tokens/generated/tokens.ts'

const applicationRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const [component, styles, enhancement, fixture, exports, templates] = await Promise.all([
  read('src/design-system/components/optional-map.tsx'),
  read('src/design-system/components/optional-map.module.css'),
  read('public/optional-map.js'),
  read('src/design-system/templates/optional-map-fixture-template.tsx'),
  read('src/design-system/components/index.ts'),
  read('src/design-system/templates/index.ts'),
])
const failures = []

for (const [label, pattern] of [
  ['bounded states', /'idle', 'blocked', 'loading', 'failure'/u],
  ['no provider-approved authority', /readonly authority: 'not-approved'[\s\S]*readonly authority: 'controlled-fixture'/u],
  ['text directions precede map panel', /data-text-directions[\s\S]*data-map-panel/u],
  ['required address', /<dt>Address<\/dt>[\s\S]*<dd>\{address\}<\/dd>/u],
  ['required landmark', /<dt>Landmark<\/dt>[\s\S]*<dd>\{landmark\}<\/dd>/u],
  ['required entrance', /<dt>Entrance<\/dt>[\s\S]*<dd>\{entrance\}<\/dd>/u],
  ['ordered text route', /<ol>[\s\S]*directions\.map/u],
  ['provider request prohibition', /data-provider-request="prohibited"/u],
  ['no-JavaScript activation lock', /data-map-activate[\s\S]*disabled/u],
  ['unchecked inert local acknowledgement', /data-map-acknowledgement disabled[\s\S]*type="checkbox"/u],
  ['loading busy state', /aria-busy=\{state === 'loading' \? true : undefined\}/u],
  ['explicit failure recovery', /data-map-failure[\s\S]*complete written directions above/u],
  ['polite controlled status', /aria-live="polite"[\s\S]*data-map-live/u],
  ['pre-existing empty accessible live region', /className=\{`\$\{styles\.liveStatus\} ds-visually-hidden`\}[\s\S]*data-map-live\s*\/>/u],
  ['removal action', /data-map-remove/u],
]) {
  if (!pattern.test(component)) failures.push(`component source: missing ${label}`)
}

for (const prohibited of [/<iframe/iu, /\b(?:src|href)=\{?['"]https?:/iu, /production-approved/u]) {
  if (prohibited.test(component)) failures.push(`component source: prohibited provider surface ${prohibited}`)
}

for (const name of ['OptionalMap', 'optionalMapStates']) {
  if (!exports.includes(name)) failures.push(`component boundary: missing ${name} export`)
}
if (!templates.includes('OptionalMapFixtureTemplate')) {
  failures.push('template boundary: missing OptionalMapFixtureTemplate export')
}

for (const [label, pattern] of [
  ['intrinsic containment', /\.wrapper[\s\S]*max-inline-size:[\s\S]*min-inline-size:\s*0/u],
  ['responsive split', /@media \(min-width: 48rem\)[\s\S]*grid-template-columns/u],
  ['minimum target', /min-block-size:\s*var\(--semantic-size-touch\)/u],
  ['non-color state boundary', /border-inline-start-width:\s*var\(--semantic-border-emphasis\)/u],
  ['reduced loading motion', /@media \(prefers-reduced-motion: reduce\)[\s\S]*animation:\s*none/u],
  ['forced-color treatment', /@media \(forced-colors: active\)[\s\S]*border-color:\s*CanvasText/u],
  ['print keeps text only', /@media print[\s\S]*\.mapPanel[\s\S]*display:\s*none/u],
]) {
  if (!pattern.test(styles)) failures.push(`component styles: missing ${label}`)
}
if (/(?:#[\da-f]{3,8}\b|\brgba?\()/iu.test(styles)) {
  failures.push('component styles: raw color values are prohibited')
}
if (/overflow-x:\s*hidden/u.test(styles)) {
  failures.push('component styles: horizontal overflow must be fixed, not hidden')
}
const availableTokens = new Set(Object.keys(designTokenValues).map((name) => `--${name.replaceAll('.', '-')}`))
for (const match of styles.matchAll(/var\((--[\w-]+)/gu)) {
  if (!match[1].startsWith('--semantic-') || !availableTokens.has(match[1])) {
    failures.push(`component styles: unknown/non-semantic token ${match[1]}`)
  }
}
for (const state of ['idle', 'blocked', 'loading', 'failure']) {
  if (!new RegExp(`\\.${state}\\b`, 'u').test(styles)) {
    failures.push(`component styles: missing ${state} treatment`)
  }
}

for (const [label, pattern] of [
  ['controlled-only enhancement', /mapAuthority !== 'controlled-fixture'[\s\S]*mapState !== 'idle'/u],
  ['explicit intent activation', /activate\.addEventListener\('click'/u],
  ['acknowledgement before activation', /if \(!acknowledgement\.checked\) return/u],
  ['placeholder-only activation', /dataset\.mapState = 'active'[\s\S]*surface\.hidden = false/u],
  ['remove and focus restoration', /remove\.addEventListener\('click'[\s\S]*restoreFocus: true/u],
  ['route-exit choice cleanup', /addEventListener\('pagehide'[\s\S]*clearChoice: true/u],
  ['enhancement marker', /dataset\.optionalMapEnhanced = 'true'/u],
]) {
  if (!pattern.test(enhancement)) failures.push(`enhancement: missing ${label}`)
}
if (/\b(?:fetch|XMLHttpRequest|sendBeacon|WebSocket|EventSource|localStorage|sessionStorage)\b/u.test(enhancement)) {
  failures.push('enhancement: requests, sockets, and persistent storage are prohibited')
}
if (/\.(?:src|href)\s*=|setAttribute\(['"](?:src|href)/u.test(enhancement)) {
  failures.push('enhancement: resource and navigation destinations are prohibited')
}

for (const marker of [
  'data-optional-map-fixture',
  '<OptionalMap',
  'authority="controlled-fixture"',
  "authority: 'not-approved'",
  "state: 'loading'",
  "state: 'failure'",
  'complete text-first arrival information',
  'No coordinates, provider, external link, tile, iframe',
  'not an approved translation',
]) {
  if (!fixture.replace(/\s+/gu, ' ').includes(marker)) failures.push(`controlled fixture: missing ${marker}`)
}

if (failures.length > 0) {
  console.error('Optional-map contract check failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log(
    'Optional-map contract check passed (text-first route, provider-disabled boundary, explicit local activation, loading/failure resilience, removal, and controlled fixture).',
  )
}

function read(relativePath) {
  return readFile(path.join(applicationRoot, relativePath), 'utf8')
}
