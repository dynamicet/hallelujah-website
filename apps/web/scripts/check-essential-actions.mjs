import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const applicationRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const [actions, icons, styles, fixture] = await Promise.all([
  read('src/design-system/components/essential-actions.tsx'),
  read('src/design-system/components/icon.tsx'),
  read('src/design-system/components/essential-actions.module.css'),
  read('src/design-system/templates/essential-actions-fixture-template.tsx'),
])
const failures = []

const requiredActionContracts = [
  ['native link semantics', /export function ActionLink[\s\S]*<a[\s\S]*href=\{href\}/u],
  ['native button semantics', /export function ActionButton[\s\S]*<button/u],
  ['native disabled behavior', /<button[\s\S]*disabled=\{disabled\}/u],
  ['adjacent disabled explanation', /disabledReason[\s\S]*styles\.disabledReason/u],
  ['generated telephone href', /href=\{`tel:\$\{telephoneValue\}`\}/u],
  ['visible-number normalization', /displayNumber\.replace/u],
  ['bounded international number', /\^\\\+\[1-9\]\\d\{6,14\}\$/u],
  ['explicit emergency word', />Emergency<\/span>/u],
  ['protected emergency level', /data-experience-level="0"/u],
  ['purpose-labeled call', /className=\{styles\.purpose\}>\{purpose\}<\/span>/u],
]

for (const [label, pattern] of requiredActionContracts) {
  if (!pattern.test(actions)) failures.push(`component source: missing ${label}`)
}

if (/on(?:Pointer|Touch|Mouse)Down|onTouchStart/iu.test(actions)) {
  failures.push('component source: activation cannot run on pointer-down or touch-start')
}
if (/role=["']button["']/u.test(actions)) {
  failures.push('component source: native links and buttons must not be replaced with role=button')
}

const requiredIconContracts = [
  ['decorative semantics', /aria-hidden="true"/u],
  ['removed focus', /focusable="false"/u],
  ['current-color stroke', /stroke="currentColor"/u],
  ['24 px coordinate system', /viewBox="0 0 24 24"/u],
  ['two-pixel rounded stroke', /strokeLinecap="round"[\s\S]*strokeWidth="2"/u],
]

for (const [label, pattern] of requiredIconContracts) {
  if (!pattern.test(icons)) failures.push(`icon source: missing ${label}`)
}

const requiredStyleContracts = [
  ['44 px token target', /min-block-size:\s*var\(--component-action-target-minimum\)/u],
  ['44 px token width', /min-inline-size:\s*var\(--component-action-target-minimum\)/u],
  ['eight-plus-pixel group token', /gap:\s*var\(--component-action-group-gap\)/u],
  ['persistent tertiary affordance', /\.tertiary[\s\S]*text-decoration-line:\s*underline/u],
  ['non-color emergency divider', /\.emergencyWord[\s\S]*border-inline-end/u],
  ['forced-colors control boundary', /@media \(forced-colors: active\)[\s\S]*border-color:\s*ButtonText/u],
  ['reduced-motion override', /@media \(prefers-reduced-motion: reduce\)[\s\S]*emergency-motion-duration/u],
  ['print action boundary', /@media print[\s\S]*border-color:\s*CanvasText/u],
]

for (const [label, pattern] of requiredStyleContracts) {
  if (!pattern.test(styles)) failures.push(`component styles: missing ${label}`)
}

if (/(?:#[\da-f]{3,8}\b|\brgba?\()/iu.test(styles)) {
  failures.push('component styles: raw color values are prohibited')
}
if (/\.emergency[^{]*\{[^}]*\b(?:animation|transform):/u.test(styles)) {
  failures.push('component styles: emergency actions must remain motion Level 0')
}

for (const marker of [
  'data-essential-actions-fixture',
  'Controlled fixture — not a staffed number',
  'Real emergency, ambulance, switchboard, appointment, and hours data remain withheld',
  '<ActionButton',
  '<CallAction',
  '<EmergencyAction',
]) {
  if (!fixture.includes(marker)) failures.push(`controlled fixture: missing ${marker}`)
}

if (failures.length > 0) {
  console.error('Essential action contract check failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log(
    'Essential action contract check passed (semantics, names, phone invariant, targets, icons, protected emergency treatment, modes, and controlled fixture).',
  )
}

function read(relativePath) {
  return readFile(path.join(applicationRoot, relativePath), 'utf8')
}
