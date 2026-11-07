import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const applicationRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const [components, styles, enhancement, fixture, exports, templates] = await Promise.all([
  read('src/design-system/components/form-primitives.tsx'),
  read('src/design-system/components/form-primitives.module.css'),
  read('public/form-primitives.js'),
  read('src/design-system/templates/form-primitives-fixture-template.tsx'),
  read('src/design-system/components/index.ts'),
  read('src/design-system/templates/index.ts'),
])
const failures = []

for (const [label, pattern] of [
  ['labeled form', /<form[\s\S]*aria-label=\{label\}[\s\S]*method=\{method\}/u],
  ['persistent field label', /<label[\s\S]*htmlFor=\{id\}/u],
  ['visible requirement copy', /required \? 'Required' : optionalLabel/u],
  ['hint relationship', /aria-describedby=\{describedBy\}/u],
  ['invalid state only while visible', /aria-invalid=\{error\?\.visible \? true : undefined\}/u],
  ['native text input', /<input[\s\S]*data-form-control[\s\S]*required=\{required\}/u],
  ['native textarea', /<textarea[\s\S]*data-form-control[\s\S]*rows=\{rows\}/u],
  ['native select', /<select[\s\S]*data-form-control[\s\S]*<option/u],
  ['native choice fieldset', /<fieldset[\s\S]*data-choice-group[\s\S]*<legend>/u],
  ['native radio and checkbox API', /readonly type: 'checkbox' \| 'radio'/u],
  ['field-linked summary', /href=\{`#\$\{item\.fieldId\}`\}/u],
  ['focusable error summary', /data-error-summary[\s\S]*role="alert"[\s\S]*tabIndex=\{-1\}/u],
  ['atomic live status', /aria-atomic=\{role === 'group' \? undefined : true\}[\s\S]*aria-live=/u],
  ['authoritative receipt contract', /readonly authoritative: true[\s\S]*readonly kind: 'receipt'/u],
  ['pending disabled submit', /disabled=\{disabled \|\| pending\}/u],
]) {
  if (!pattern.test(components)) failures.push(`component source: missing ${label}`)
}

for (const name of [
  'ChoiceGroup',
  'ErrorSummary',
  'FormPrimitiveForm',
  'FormStatus',
  'FormSubmitButton',
  'SelectField',
  'TextAreaField',
  'TextField',
]) {
  if (!exports.includes(name)) failures.push(`component boundary: missing ${name} export`)
}
if (!templates.includes('FormPrimitivesFixtureTemplate')) {
  failures.push('template boundary: missing FormPrimitivesFixtureTemplate export')
}

for (const [label, pattern] of [
  ['full-width intrinsic containment', /\.control[\s\S]*max-inline-size:[\s\S]*min-inline-size:\s*0/u],
  ['44 px target aliases', /min-block-size:\s*var\(--component-form-target-minimum\)/u],
  ['non-color invalid boundary', /\[aria-invalid='true'\][\s\S]*border/u],
  ['error summary treatment', /\.errorSummary[\s\S]*surface-error[\s\S]*text-error/u],
  ['distinct status treatments', /\.pending[\s\S]*\.receipt[\s\S]*\.warning[\s\S]*\.failure/u],
  ['disabled action treatment', /\.submit:disabled[\s\S]*cursor:\s*not-allowed[\s\S]*opacity:\s*1/u],
  ['reduced-motion override', /@media \(prefers-reduced-motion: reduce\)[\s\S]*protected-duration/u],
  ['forced-colors boundaries', /@media \(forced-colors: active\)[\s\S]*border-color:\s*ButtonText/u],
  ['print treatment', /@media print[\s\S]*border-color:\s*CanvasText/u],
]) {
  if (!pattern.test(styles)) failures.push(`component styles: missing ${label}`)
}
if (/(?:#[\da-f]{3,8}\b|\brgba?\()/iu.test(styles)) {
  failures.push('component styles: raw color values are prohibited')
}
if (/overflow-x:\s*hidden/u.test(styles)) {
  failures.push('component styles: horizontal overflow must be fixed, not hidden')
}

for (const [label, pattern] of [
  ['no-JS disabled baseline', /data-form-submit[\s\S]*disabled=\{disabled \|\| pending\}/u],
  ['enhancement enables controlled submit', /form\.noValidate = true[\s\S]*submit\.disabled = false/u],
  ['request prevention', /addEventListener\('submit'[\s\S]*event\.preventDefault\(\)/u],
  ['truthful pending semantics', /setAttribute\('aria-busy', 'true'\)[\s\S]*pending\.hidden = false/u],
  ['field-linked invalid semantics', /setAttribute\('aria-invalid', 'true'\)/u],
  ['first invalid focus', /summary\.hidden = false[\s\S]*summary\.focus\(\)/u],
  ['known failure rather than false success', /failure\.hidden = false/u],
  ['enhancement marker', /dataset\.formPrimitivesEnhanced = 'true'/u],
]) {
  const source = label === 'no-JS disabled baseline' ? components : enhancement
  if (!pattern.test(source)) failures.push(`enhancement: missing ${label}`)
}
if (/\b(?:fetch|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage)\b/u.test(enhancement)) {
  failures.push('enhancement: network requests and persistent storage are prohibited')
}
if (/\.reset\(\)/u.test(enhancement)) {
  failures.push('enhancement: valid values must not be reset after validation')
}

for (const marker of [
  'data-form-primitives-fixture',
  'Do not enter a name',
  '<FormPrimitiveForm',
  '<ErrorSummary',
  '<TextField',
  '<SelectField',
  '<ChoiceGroup',
  '<TextAreaField',
  '<FormStatus',
  'cannot create an appointment or authoritative receipt',
  'No request was sent',
  'submission stays',
]) {
  if (!fixture.includes(marker)) failures.push(`controlled fixture: missing ${marker}`)
}

if (failures.length > 0) {
  console.error('Form primitive contract check failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log(
    'Form primitive contract check passed (labels, help/errors, choices, summary focus, pending/receipt/warning/failure semantics, value retention, no-JS fail-closed behavior, and controlled fixture).',
  )
}

function read(relativePath) {
  return readFile(path.join(applicationRoot, relativePath), 'utf8')
}
