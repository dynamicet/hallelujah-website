import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const applicationRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const [shell, enhancement, styles, fixture, pageFrame, homeFixture, emergencyFixture, appointmentFixture] = await Promise.all([
  read('src/design-system/components/global-shell.tsx'),
  read('src/demo/interactions.tsx'),
  read('src/design-system/components/global-shell.module.css'),
  read('src/design-system/templates/essential-actions-fixture-template.tsx'),
  read('src/design-system/primitives/page-frame.tsx'),
  read('scripts/lib/home-fixture.mjs'),
  read('scripts/lib/emergency-fixture.mjs'),
  read('scripts/lib/appointment-page-fixture.mjs'),
])
const failures = []

const requiredShellContracts = [
  ['semantic banner', /<header[\s\S]*data-site-header/u],
  ['governed optional brand mark', /brandMark \?[\s\S]*aria-hidden="true"[\s\S]*\{brandMark\}/u],
  ['governed localized identity name', /aria-label=\{homeLabel\}[\s\S]*lang=\{identityLanguage\}/u],
  ['non-empty identity contract', /if \(!homeLabel\.trim\(\)\) throw new Error/u],
  ['explicit navigation mode', /data-navigation-mode=\{navigationMode\}/u],
  ['single labeled primary navigation', /<nav aria-label=\{label\}[\s\S]*data-primary-navigation/u],
  ['navigation list', /data-primary-navigation[\s\S]*<ul>[\s\S]*<li/u],
  ['current page semantics', /aria-current=\{item\.current \? 'page'/u],
  ['localized internal navigation', /import \{[^}]*InterfaceLink as Link[^}]*\} from '@\/website\/interface-language'/u],
  ['skip link target', /href=\{`#\$\{targetId\}`\}/u],
  ['breadcrumb navigation list', /data-breadcrumbs[\s\S]*<ol>/u],
  ['breadcrumb current page', /<span aria-current="page">/u],
  ['language names carry language metadata', /lang=\{currentLang\}[\s\S]*lang=\{alternate\.lang\}/u],
  ['native language disclosure', /<details[\s\S]*data-language-switcher[\s\S]*<summary/u],
  ['unavailable language explanation', /aria-describedby=\{reasonId\}[\s\S]*alternate\.reason/u],
  ['semantic footer', /<footer[\s\S]*data-site-footer/u],
  ['focusable main target', /<main[^>]*id=\{mainId\}[^>]*tabIndex=\{-1\}/u],
  ['native popover trigger', /<button[\s\S]*popoverTarget="primary-navigation-panel"/u],
  ['native popover panel', /id="primary-navigation-panel"[\s\S]*popover="auto"/u],
  ['emergency independent of disclosure', /data-navigation-panel[\s\S]*<\/div>[\s\S]*<div className=\{styles.headerEmergency\} data-shell-emergency/u],
  ['complete compact disclosure', /data-navigation-panel[\s\S]*<PrimaryNavigation[\s\S]*data-shell-utilities[\s\S]*data-shell-routine/u],
  ['script-independent shell', /<SiteFooter \{\.\.\.footer\} \/>/u],
]

for (const [label, pattern] of requiredShellContracts) {
  if (!pattern.test(shell)) failures.push(`shell source: missing ${label}`)
}

if (/\b(?:flag|emoji)\b/iu.test(shell)) {
  failures.push('shell source: language choices cannot use flags or emoji')
}
if (/\$\{brandName\}\s+home/u.test(shell)) {
  failures.push('shell source: identity naming cannot append a hard-coded English home token')
}

const requiredEnhancementContracts = [
  ['expanded-state reflection', /setAttribute\('aria-expanded', String\(open\)\)/u],
  ['close focus restoration', /restoreMenuFocus[\s\S]*trigger\?\.focus\(\)/u],
  ['navigation close', /closest\('a\[href\]'\)[\s\S]*hidePopover\(\)/u],
  ['effect cleanup', /return \(\) => controller\.abort\(\)/u],
  ['same-route rebind', /\[pathname, search\]/u],
]

for (const [label, pattern] of requiredEnhancementContracts) {
  if (!pattern.test(enhancement)) failures.push(`shell enhancement: missing ${label}`)
}

if (/\b(?:fetch|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage)\b/u.test(enhancement)) {
  failures.push('shell enhancement: network requests and persistent storage are prohibited')
}

const requiredStyleContracts = [
  ['44 px token target', /min-block-size:\s*var\(--component-shell-target-minimum\)/u],
  ['compact popover baseline', /\.navigationPanel[\s\S]*overflow-y:\s*auto/u],
  ['single wide navigation tree', /@media \(min-width: 80rem\)[\s\S]*\.navigationPanel\[popover\][\s\S]*display:\s*grid/u],
  ['explicit responsive wide mode', /\.header\[data-navigation-mode='responsive'\] \.navigationPanel\[popover\]/u],
  ['wrapping primary navigation', /\.primaryNavigation ul[\s\S]*flex-wrap:\s*wrap/u],
  ['non-color current marker', /\[aria-current='page'\][\s\S]*border-/u],
  ['wrapping breadcrumb', /\.breadcrumbs ol[\s\S]*flex-wrap:\s*wrap/u],
  ['reduced-motion override', /@media \(prefers-reduced-motion: reduce\)[\s\S]*--component-shell-static-duration/u],
  ['forced-colors current marker', /@media \(forced-colors: active\)[\s\S]*border-color:\s*Highlight/u],
  ['print navigation availability', /@media print[\s\S]*navigationPanel[\s\S]*display:\s*block/u],
]

for (const [label, pattern] of requiredStyleContracts) {
  if (!pattern.test(styles)) failures.push(`shell styles: missing ${label}`)
}

if (/(?:#[\da-f]{3,8}\b|\brgba?\()/iu.test(styles)) {
  failures.push('shell styles: raw color values are prohibited')
}
if (/overflow-x:\s*hidden/u.test(styles)) {
  failures.push('shell styles: horizontal overflow must be fixed, not hidden')
}
if (/\.headerUtilities\s*\{[^}]*grid-row:\s*1/gu.test(styles)) {
  failures.push('shell styles: utilities cannot be visually reordered ahead of navigation')
}

for (const marker of [
  'data-global-shell-fixture',
  'Hallelujah Hospital — controlled identity',
  'Approved Amharic shell labels are not available',
  'They do not mount or publish the proposed routes',
  '<SiteShell',
  '<LanguageSwitcher',
  'homeLabel:',
  'identityLanguage:',
  'navigationMode:',
  "searchParameters['shell-review']",
]) {
  if (!fixture.includes(marker)) failures.push(`controlled fixture: missing ${marker}`)
}

for (const [label, source] of [
  ['Home', homeFixture],
  ['Emergency', emergencyFixture],
  ['Appointment', appointmentFixture],
]) {
  for (const marker of ['homeLabel:', 'identityLanguage:', 'navigationMode:']) {
    if (!source.includes(marker)) failures.push(`${label} fixture: missing ${marker}`)
  }
  if (!/navigationMode:[^\n]+\? 'compact' : 'responsive'/u.test(source)) {
    failures.push(`${label} fixture: expanded labels do not force compact navigation`)
  }
}

if (!/tabIndex=\{-1\}/u.test(pageFrame)) {
  failures.push('page frame: skip-link target must accept programmatic focus')
}

if (failures.length > 0) {
  console.error('Global shell contract check failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log(
    'Global shell contract check passed (governed identity, semantic order, navigation, disclosure, current state, breadcrumbs, language availability, targets, modes, and controlled fixture).',
  )
}

function read(relativePath) {
  return readFile(path.join(applicationRoot, relativePath), 'utf8')
}
