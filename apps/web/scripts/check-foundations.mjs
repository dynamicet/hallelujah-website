import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const applicationRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const globalStyles = await readFile(path.join(applicationRoot, 'src/app/styles.css'), 'utf8')
const fixture = await readFile(
  path.join(
    applicationRoot,
    'src/design-system/templates/essential-actions-fixture-template.tsx',
  ),
  'utf8',
)
const templateStyles = await readFile(
  path.join(applicationRoot, 'src/design-system/templates/controlled-bootstrap-template.module.css'),
  'utf8',
)
const failures = []

const requiredGlobalContracts = [
  ['Amharic font context', /\[lang="am"\][\s\S]*--semantic-font-family-ethiopic/u],
  ['visible focus indicator', /:focus-visible[\s\S]*--semantic-border-focus[\s\S]*--semantic-color-focus/u],
  ['minimum control target', /min-block-size:\s*var\(--semantic-size-touch\)/u],
  ['responsive media boundary', /max-inline-size:\s*var\(--semantic-size-full\)/u],
  ['compact container gutter', /\.ds-container[\s\S]*padding-inline:\s*var\(--semantic-space-page\)/u],
  ['regular container gutter', /@media \(min-width: 48rem\)[\s\S]*--semantic-space-gutter-regular/u],
  ['wide container gutter', /@media \(min-width: 64rem\)[\s\S]*--semantic-space-gutter-wide/u],
  ['forced-colors treatment', /@media \(forced-colors: active\)[\s\S]*outline-color:\s*Highlight/u],
  ['print treatment', /@media print[\s\S]*\.ds-no-print[\s\S]*display:\s*none/u],
]

for (const [label, pattern] of requiredGlobalContracts) {
  if (!pattern.test(globalStyles)) failures.push(`global styles: missing ${label}`)
}

if (/overflow-x:\s*hidden/u.test(globalStyles)) {
  failures.push('global styles: horizontal overflow must be fixed, not hidden')
}
if (/outline:\s*(?:0|none)/u.test(globalStyles)) {
  failures.push('global styles: focus outlines cannot be removed')
}

for (const marker of [
  'data-foundation-fixture',
  'data-foundation-control',
  'data-long-content',
  'lang="am"',
]) {
  if (!fixture.includes(marker)) failures.push(`foundation fixture: missing ${marker}`)
}

if (!/@media \(forced-colors: active\)[\s\S]*box-shadow:\s*none/u.test(templateStyles)) {
  failures.push('template styles: forced-colors mode must remove the surface shadow')
}
if (!/@media print[\s\S]*box-shadow:\s*none/u.test(templateStyles)) {
  failures.push('template styles: print mode must remove the surface shadow')
}
if (!/\.statusSummary\s*>\s*dl\s*>\s*div/u.test(templateStyles)) {
  failures.push('template styles: status rows must match the rendered definition-list structure')
}
if (!/\.statusSummary\s+:where\(dt, dd\)[\s\S]*overflow-wrap:\s*anywhere/u.test(templateStyles)) {
  failures.push('template styles: status terms and values must wrap at enlarged text sizes')
}

if (failures.length > 0) {
  console.error('Foundation contract check failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log(
    'Foundation contract check passed (type, focus, targets, layout, media, forced-colors, print, and bilingual fixture).',
  )
}
