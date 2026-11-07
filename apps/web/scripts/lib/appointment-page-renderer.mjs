// Loopback review adapter: execute the actual server template and CSS Modules without
// mounting a Next route. No application module may import this file.
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
    if (['next/link', 'next/image', 'next/form', 'next/navigation'].includes(specifier)) return nextResolve(specifier + '.js', context)
    if (context.parentURL?.startsWith(pathToFileURL(sourceRoot).href) && (specifier.startsWith('.') || specifier.startsWith('@/'))) {
      const base = specifier.startsWith('@/') ? path.join(sourceRoot, specifier.slice(2)) : fileURLToPath(new URL(specifier, context.parentURL))
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
          .map((match) => [match[1], `appointment_${match[1]}_${suffix}`]))
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

const { AppointmentTemplate, EmergencyAction, LanguageSwitcher } = {
  ...await import('../../src/design-system/templates/index.ts'),
  ...await import('../../src/design-system/components/index.ts'),
}

export function renderAppointmentPage(props) {
  const header = {
    ...props.shell.header,
    languageSwitcher: createElement(LanguageSwitcher, {
      alternate: {
        available: false,
        label: 'አማርኛ',
        lang: 'am',
        reason: 'This page is unavailable in Amharic.',
      },
      currentLabel: 'English',
      currentLang: 'en',
      label: 'Language',
    }),
    emergencyAction: createElement(EmergencyAction, { compact: true,
      href: '#appointment-warning-title',
      label: 'Controlled emergency warning',
    }),
  }
  return renderToStaticMarkup(createElement(AppointmentTemplate, {
    ...props,
    privacyDisclosure: createElement('p', null, props.privacyDisclosure),
    shell: { ...props.shell, header },
  }))
}

export function appointmentPageStyles() {
  const tokens = readFileSync(path.join(appRoot, 'src/design-system/tokens/generated/tokens.css'), 'utf8')
  const global = readFileSync(path.join(appRoot, 'src/app/styles.css'), 'utf8').replace(/^@import[^\n]+\n/u, '')
  return [tokens, global, ...stylesheets.values()].join('\n')
}
