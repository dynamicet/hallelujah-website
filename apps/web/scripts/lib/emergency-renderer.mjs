// Loopback review adapter: execute the actual server template and CSS Modules without
// mounting a Next route. No application module may import this file.
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { registerHooks } from 'node:module'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createElement, Fragment } from 'react'
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
          .map((match) => [match[1], `emergency_${match[1]}_${suffix}`]))
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

const { ActionLink, EmergencyAction, EmergencyTemplate, LanguageSwitcher } = {
  ...await import('../../src/design-system/templates/index.ts'),
  ...await import('../../src/design-system/components/index.ts'),
}

export function renderEmergency(props) {
  const header = {
    ...props.shell.header,
    languageSwitcher: createElement(LanguageSwitcher, {
      alternate: { available: false, label: 'አማርኛ', lang: 'am',
        reason: 'Approved Amharic emergency guidance is unavailable. English test copy remains visible.' },
      currentLabel: 'English', currentLang: 'en', label: 'Language',
    }),
    emergencyAction: createElement(EmergencyAction, {
      href: '#emergency-title', label: 'Controlled Emergency preview',
    }),
    routineAction: createElement(ActionLink, {
      href: '#non-emergency-support', label: 'Non-emergency support', variant: 'secondary',
    }),
  }
  const mapStatus = createElement('p', null, props.mapStatus)
  const support = createElement(Fragment, null,
    createElement('p', null, props.support),
    createElement('a', { className: 'ds-touch-target', href: '#emergency-title' },
      'Return to Emergency choices'),
  )
  return renderToStaticMarkup(createElement(EmergencyTemplate, {
    ...props, mapStatus, support, shell: { ...props.shell, header },
  }))
}

export function emergencyStyles() {
  const tokens = readFileSync(path.join(appRoot, 'src/design-system/tokens/generated/tokens.css'), 'utf8')
  const global = readFileSync(path.join(appRoot, 'src/app/styles.css'), 'utf8').replace(/^@import[^\n]+\n/u, '')
  return [tokens, global, ...stylesheets.values()].join('\n')
}
