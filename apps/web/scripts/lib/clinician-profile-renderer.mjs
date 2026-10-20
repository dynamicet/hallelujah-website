import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { registerHooks } from 'node:module'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'

const appRoot = fileURLToPath(new URL('../../', import.meta.url))
const sourceRoot = path.join(appRoot, 'src') + path.sep
const stylesheets = new Map()

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (['next/link', 'next/image'].includes(specifier)) return nextResolve(specifier + '.js', context)
    if (context.parentURL?.startsWith(pathToFileURL(sourceRoot).href) && specifier.startsWith('.')) {
      const base = fileURLToPath(new URL(specifier, context.parentURL))
      for (const candidate of [base, base + '.ts', base + '.tsx', path.join(base, 'index.ts')]) {
        if (existsSync(candidate) && /\.(?:tsx?|css)$/u.test(candidate)) {
          return { url: pathToFileURL(candidate).href, shortCircuit: true }
        }
      }
    }
    return nextResolve(specifier, context)
  },
  load(url, context, nextLoad) {
    if (url.startsWith(pathToFileURL(sourceRoot).href) && /\.(?:tsx?|css)$/u.test(url)) {
      const file = fileURLToPath(url)
      const source = readFileSync(file, 'utf8')
      if (file.endsWith('.css')) {
        const suffix = createHash('sha256').update(path.relative(appRoot, file)).digest('hex').slice(0, 8)
        const names = Object.fromEntries([...source.matchAll(/\.([a-zA-Z_][\w-]*)/gu)]
          .map((match) => [match[1], `profile_${match[1]}_${suffix}`]))
        stylesheets.set(file, source.replace(/\.([a-zA-Z_][\w-]*)/gu, (_, name) => `.${names[name]}`))
        return { format: 'module', source: `export default ${JSON.stringify(names)}`, shortCircuit: true }
      }
      const result = ts.transpileModule(source, { fileName: file, compilerOptions: {
        target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX,
      } })
      return { format: 'module', source: result.outputText, shortCircuit: true }
    }
    return nextLoad(url, context)
  },
})

const [{ ClinicianProfileTemplate }, { controlledClinicianProfile }, components] = await Promise.all([
  import('../../src/design-system/templates/index.ts'),
  import('../../src/content/clinician-profile.ts'),
  import('../../src/design-system/components/index.ts'),
])

export function resolveClinicianProfile(fixture, now = new Date('2026-09-29T12:01:00Z')) {
  return controlledClinicianProfile({
    links: fixture.links,
    locale: 'en',
    mode: 'controlled-fixture',
    now,
    publicId: fixture.publicId,
    records: fixture.records,
  })
}

export function renderClinicianProfile({ profile, state = 'ready' }) {
  const { EmergencyAction, LanguageSwitcher } = components
  const name = profile.clinician?.details.name ?? 'Unavailable synthetic clinician'
  const renderable = profile.clinician && !['failure', 'gone', 'unavailable'].includes(state)
  const profileTarget = renderable ? '#clinician-profile-title' : '#clinician-profile-state-title'
  const detailTarget = renderable ? '#clinician-profile-request-title' : '#profile-support'
  const reviewTarget = profileTarget
  const links = {
    identity: { current: true, href: profileTarget, label: 'Clinician profile' },
    request: { href: detailTarget, label: 'Appointment information' },
    review: { href: reviewTarget, label: 'Profile information' },
    support: { href: '#profile-support', label: 'Support' },
  }
  const shell = {
    breadcrumbs: { items: [
      { current: true, href: profileTarget, label: name },
    ], label: 'Breadcrumb' },
    skipLinkLabel: 'Skip to main content',
    header: {
      brandName: 'Hallelujah Hospital',
      emergencyAction: createElement(EmergencyAction, { compact: true, href: '#profile-support', label: 'Emergency route unavailable' }),
      homeHref: profileTarget,
      homeLabel: 'Hallelujah Hospital clinician profile',
      identityLanguage: 'en',
      languageSwitcher: createElement(LanguageSwitcher, {
        alternate: { available: false, label: 'አማርኛ', lang: 'am',
          reason: 'This page is unavailable in Amharic.' },
        currentLabel: 'English', currentLang: 'en', label: 'Language',
      }),
      menuLabel: 'Menu',
      navigationItems: [{ ...links.identity, label: 'Profile' }, { ...links.request, label: 'Request information' }, { ...links.review, label: 'Review' }, { ...links.support, label: 'Support' }],
      navigationMode: 'responsive',
      primaryNavigationLabel: 'Primary',
      searchItem: { href: '#profile-support', label: 'Search unavailable' },
    },
    footer: {
      brandName: 'Hallelujah Hospital',
      description: 'Find information for your care and visit.',
      groups: [
        { label: 'Profile', links: [links.identity, links.review] },
        { label: 'Information', links: [links.request, links.support] },
      ],
      navigationLabel: 'Footer',
    },
  }
  return renderToStaticMarkup(createElement(ClinicianProfileTemplate, { profile, shell, state }))
}

export function clinicianProfileStyles() {
  const tokens = readFileSync(path.join(appRoot, 'src/design-system/tokens/generated/tokens.css'), 'utf8')
  const global = readFileSync(path.join(appRoot, 'src/app/styles.css'), 'utf8').replace(/^@import[^\n]+\n/u, '')
  return [tokens, global, ...stylesheets.values()].join('\n')
}
