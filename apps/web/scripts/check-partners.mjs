import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { registerHooks } from 'node:module'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import sharp from 'sharp'
import ts from 'typescript'

// Render the partner ribbon and credit directory without importing the application shell.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === './corporate-agreements-rail' && context.parentURL?.endsWith('/website/partners.tsx')) {
      return nextResolve(specifier + '.tsx', context)
    }
    if (specifier === './browse-card-row' && context.parentURL?.endsWith('/website/corporate-agreements-rail.tsx')) {
      return nextResolve(specifier + '.ts', context)
    }
    return nextResolve(specifier, context)
  },
  load(url, context, nextLoad) {
    if (url.endsWith('/website/partners.tsx') || url.endsWith('/website/corporate-agreements-rail.tsx') || url.endsWith('/demo/partners.ts')) {
      const file = new URL(url)
      return {
        format: 'module', shortCircuit: true,
        source: ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: {
          target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX,
        } }).outputText,
      }
    }
    return nextLoad(url, context)
  },
})

const { Partners, CorporateAgreements } = await import('../src/website/partners.tsx')
const { partners } = await import('../src/demo/partners.ts')
const source = JSON.parse(await readFile(new URL('../src/demo/partner-sources.json', import.meta.url)))
const render = (records) => renderToStaticMarkup(createElement(Partners, { partners: records }))

assert.equal(render([]), '', 'An empty list must omit the whole section')
assert.equal(render([{ ...partners[0], name: ' ' }]), '')
assert.equal(render([{ ...partners[0], logo: { ...partners[0].logo, src: '' } }]), '')
assert.equal(render([{ ...partners[0], logo: { ...partners[0].logo, width: 0 } }]), '')
assert.ok(render([{ ...partners[0], name: '<script>unsafe</script>' }]).includes('&lt;script&gt;'))

assert.equal(partners.length, 19)
assert.equal(new Set(partners.map((partner) => partner.id)).size, partners.length)
const directory = renderToStaticMarkup(createElement(CorporateAgreements, { organizations: partners }))
assert.ok(directory.includes('agreements for corporate healthcare'))
assert.equal((directory.match(/<li\b/gu) ?? []).length, partners.length)
const html = render(partners)
assert.equal((html.match(/<li\b/gu) ?? []).length, partners.length * 2)
assert.ok(html.includes('>Our partners</h2>'))
assert.ok(html.includes('aria-hidden="true"'))
assert.equal((render(partners.slice(0, 1)).match(/<li\b/gu) ?? []).length, 1)
assert.ok(!html.includes('https://'), 'Partner logos must be served locally')
for (const partner of partners) {
  const original = source.partners.find((record) => record.id === partner.id)
  assert.equal(original?.name, partner.name, 'Names must retain their source mapping')
  assert.equal(original?.localAsset, partner.logo.src)
  assert.ok(html.includes(`alt="${partner.name}"`), 'Each partner logo must expose its organization name')
  assert.ok(directory.includes(`<span>${partner.name}</span>`), 'Each decorative logo must have a visible organization name')
  const asset = await sharp(new URL(`../public${partner.logo.src}`, import.meta.url).pathname).metadata()
  assert.equal(asset.format, 'webp')
  assert.equal(asset.width, partner.logo.width)
  assert.equal(asset.height, partner.logo.height)
}
console.log('Partners passed: 19 source-mapped local logos, dimensions, text alternatives, escaping, and empty/incomplete omission.')
