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
          .map((match) => [match[1], `directory_${match[1]}_${suffix}`]))
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

const [{ ClinicianDirectoryTemplate }, { controlledClinicianDirectory }, components] = await Promise.all([
  import('../../src/design-system/templates/index.ts'),
  import('../../src/content/clinician-directory.ts'),
  import('../../src/design-system/components/index.ts'),
])

export function resolveClinicianDirectory(
  fixture,
  searchParameters = new URLSearchParams(),
  now = new Date('2026-09-29T09:01:00Z'),
) {
  return controlledClinicianDirectory({
    filters: fixture.filters,
    locale: 'en',
    mode: 'controlled-fixture',
    now,
    pageSize: 4,
    records: fixture.records,
    searchParameters,
  })
}

export function renderClinicianDirectory({ directory, pathname = '/', state = 'ready' }) {
  const { EmergencyAction, LanguageSwitcher } = components
  const links = {
    directory: { current: true, href: '#clinician-directory-title', label: 'Synthetic clinicians' },
    filters: { href: '#directory-search-title', label: 'Search and filters' },
    results: { href: '#directory-results-title', label: 'Synthetic results' },
    support: { href: '#directory-support', label: 'Controlled support boundary' },
  }
  const shell = {
    notice: 'Local preview · Hospital content, contacts and services are not published.',
    skipLinkLabel: 'Skip to main content',
    header: {
      brandName: 'Hallelujah Hospital',
      emergencyAction: createElement(EmergencyAction, { compact: true, href: '#directory-support', label: 'Emergency route unavailable' }),
      homeHref: '#clinician-directory-title',
      homeLabel: 'Hallelujah Hospital controlled clinician directory',
      identityLanguage: 'en',
      languageSwitcher: createElement(LanguageSwitcher, {
        alternate: { available: false, label: 'አማርኛ', lang: 'am',
          reason: 'Approved Amharic directory wording is unavailable. English controlled copy remains visible.' },
        currentLabel: 'English', currentLang: 'en', label: 'Language',
      }),
      menuLabel: 'Menu',
      navigationItems: [{ ...links.directory, label: 'Clinicians' }, { ...links.filters, label: 'Search and filters' }, { ...links.results, label: 'Results' }, { ...links.support, label: 'Support' }],
      navigationMode: 'responsive',
      primaryNavigationLabel: 'Primary',
      searchItem: links.filters,
    },
    footer: {
      brandName: 'Hallelujah Hospital — controlled identity',
      description: 'Loopback-only clinician-directory preview. Authentic roster and publication remain disabled.',
      groups: [
        { label: 'Controlled directory review', links: [links.filters, links.results] },
        { label: 'Access and governance', links: [links.support, links.directory] },
      ],
      navigationLabel: 'Footer',
    },
  }
  return renderToStaticMarkup(createElement(ClinicianDirectoryTemplate, { directory, pathname, shell, state }))
}

export function clinicianDirectoryStyles() {
  const tokens = readFileSync(path.join(appRoot, 'src/design-system/tokens/generated/tokens.css'), 'utf8')
  const global = readFileSync(path.join(appRoot, 'src/app/styles.css'), 'utf8').replace(/^@import[^\n]+\n/u, '')
  return [tokens, global, ...stylesheets.values()].join('\n')
}
