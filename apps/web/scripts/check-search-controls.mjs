import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const applicationRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const [controls, state, styles, enhancement, fixture, preview, configuration] = await Promise.all([
  read('src/design-system/components/search-controls.tsx'),
  read('src/design-system/components/search-state.ts'),
  read('src/design-system/components/search-controls.module.css'),
  read('public/search-controls.js'),
  read('src/design-system/templates/search-controls-fixture-template.tsx'),
  read('scripts/lib/foundations-preview-server.mjs'),
  read('next.config.ts'),
])
const failures = []

const requiredControlContracts = [
  ['native GET search form', /<form[\s\S]*method="get"[\s\S]*role="search"/u],
  ['persistent search label', /<label[\s\S]*htmlFor=\{inputId\}/u],
  ['native search input', /name="q"[\s\S]*type="search"/u],
  ['bounded input length', /maxLength=\{maximumLength\}/u],
  ['search hint relationship', /aria-describedby=\{hintId\}/u],
  ['native filter fieldset', /<fieldset[\s\S]*<legend>\{legend\}<\/legend>/u],
  ['native filter inputs', /name=\{name\}[\s\S]*type="checkbox"[\s\S]*value=\{option\.value\}/u],
  ['native compact disclosure', /<details[\s\S]*data-filter-disclosure[\s\S]*<summary>[\s\S]*\{label\}[\s\S]*<\/summary>/u],
  ['removable active filter', /aria-label=\{filter\.removeLabel\}[\s\S]*href=\{filter\.removeHref\}/u],
  ['atomic polite count', /aria-atomic="true"[\s\S]*aria-live="polite"[\s\S]*role="status"/u],
  ['pagination landmark', /<nav aria-label=\{label\}[\s\S]*data-pagination/u],
  ['current page semantics', /<span aria-current="page"/u],
  ['real pagination links', /href=\{page\.href\}[\s\S]*rel=\{rel\}/u],
]

for (const [label, pattern] of requiredControlContracts) {
  if (!pattern.test(controls)) failures.push(`component source: missing ${label}`)
}

const requiredStateContracts = [
  ['bounded key allowlist', /searchStateKeys = \['q', 'type', 'page'\]/u],
  ['bounded default query length', /defaultSearchQueryMaximum = 80/u],
  ['approved type allowlist', /new Set\(policy\.allowedTypes\)/u],
  ['unknown filter rejection', /filter\(\(value\) => allowedTypes\.has\(value\)\)/u],
  ['page integer validation', /\^\\d\+\$/u],
  ['page upper bound', /Math\.min\(Math\.max\(page, 1\), maximumPage\)/u],
  ['query normalization', /normalize\('NFC'\)[\s\S]*replaceAll\(\/\\s\+\/gu, ' '\)[\s\S]*slice/u],
  ['canonical URL builder', /new URLSearchParams\(\)[\s\S]*parameters\.set\('q'[\s\S]*parameters\.append\('type'[\s\S]*parameters\.set\('page'/u],
]

for (const [label, pattern] of requiredStateContracts) {
  if (!pattern.test(state)) failures.push(`URL-state adapter: missing ${label}`)
}

if (/\b(?:email|phone|patient|internalId|draftId|recordId)\b/iu.test(searchStateKeysOnly(state))) {
  failures.push('URL-state adapter: non-navigational or sensitive state key detected')
}

const requiredStyleContracts = [
  ['44 px token targets', /min-block-size:\s*var\(--component-search-controls-target-minimum\)/u],
  ['wrapping search row', /\.searchRow[\s\S]*flex-wrap:\s*wrap/u],
  ['compact disclosure', /\.filterDisclosure > summary[\s\S]*min-block-size/u],
  ['wide persistent filter panel', /@media \(min-width: 64rem\)[\s\S]*\.filterDisclosure > summary[\s\S]*display:\s*none[\s\S]*\.filterPanel[\s\S]*display:\s*grid/u],
  ['non-color current page', /\[aria-current='page'\][\s\S]*border/u],
  ['reduced-motion override', /@media \(prefers-reduced-motion: reduce\)[\s\S]*static-duration/u],
  ['forced-colors boundaries', /@media \(forced-colors: active\)[\s\S]*border-color:\s*ButtonText/u],
  ['print controls', /@media print[\s\S]*border-color:\s*CanvasText/u],
]

for (const [label, pattern] of requiredStyleContracts) {
  if (!pattern.test(styles)) failures.push(`component styles: missing ${label}`)
}

if (/(?:#[\da-f]{3,8}\b|\brgba?\()/iu.test(styles)) {
  failures.push('component styles: raw color values are prohibited')
}
if (/overflow-x:\s*hidden/u.test(styles)) {
  failures.push('component styles: horizontal overflow must be fixed, not hidden')
}

for (const [label, pattern] of [
  ['server-state restoration', /restoreServerState[\s\S]*searchParams[\s\S]*selectedTypes\.has\(filter\.value\)[\s\S]*addEventListener\('pageshow'/u],
  ['responsive disclosure state', /matchMedia\('\(max-width: 63\.999rem\)'\)[\s\S]*hasSelection[\s\S]*!compactFilters\.matches \|\| hasSelection[\s\S]*addEventListener\('change'/u],
  ['Escape close', /event\.key !== 'Escape'[\s\S]*disclosure\.open = false/u],
  ['summary focus restoration', /summary\.focus\(\)/u],
  ['enhancement marker', /dataset\.searchControlsEnhanced = 'true'/u],
]) {
  if (!pattern.test(enhancement)) failures.push(`enhancement: missing ${label}`)
}

if (/\b(?:fetch|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage)\b/u.test(enhancement)) {
  failures.push('enhancement: network requests and persistent storage are prohibited')
}

for (const marker of [
  'data-search-controls-fixture',
  'five synthetic records',
  'Do not enter a name, contact detail, medical history, or care narrative',
  '<SearchControlsForm',
  '<FilterDisclosure',
  '<ActiveFilterList',
  '<ResultCount',
  '<Pagination',
  'do not mount a public search',
]) {
  if (!fixture.includes(marker)) failures.push(`controlled fixture: missing ${marker}`)
}

if (!/url\.searchParams\.getAll\(key\)/u.test(preview)
  || !/createElement\(EssentialActionsFixtureTemplate, \{ searchParameters, statuses \}\)/u.test(preview)) {
  failures.push('controlled preview: repeated server search parameters must reach the template API')
}
if (!/form-action 'self'/u.test(configuration) || /form-action 'none'/u.test(configuration)) {
  failures.push('application configuration: same-origin GET form submissions must be permitted')
}

if (failures.length > 0) {
  console.error('Search/filter primitive contract check failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log(
    'Search/filter primitive contract check passed (GET baseline, labels, allowlisted URL state, native filters/disclosure, chips, count, pagination, focus recovery, modes, and controlled fixture).',
  )
}

function searchStateKeysOnly(source) {
  return source.match(/searchStateKeys = \[[^\]]+\]/u)?.[0] ?? ''
}

function read(relativePath) {
  return readFile(path.join(applicationRoot, relativePath), 'utf8')
}
