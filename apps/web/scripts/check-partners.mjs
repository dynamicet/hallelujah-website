import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { registerHooks } from 'node:module'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import sharp from 'sharp'
import ts from 'typescript'

// Compile only these two isolated modules, without importing the application shell.
registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith('/website/partners.tsx') || url.endsWith('/demo/partners.ts')) {
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

const { Partners } = await import('../src/website/partners.tsx')
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
const sharedHtml = renderToStaticMarkup(createElement(Partners, { partners: partners.slice(0, 10), billingPartners: partners }))
assert.ok(sharedHtml.includes('Corporate healthcare agreements'))
assert.ok(sharedHtml.includes('>Our partners</h2>'))
assert.equal((sharedHtml.match(/data-partner="safaricom"/gu) ?? []).length, 2, 'Shared identities must appear in both sections')
assert.equal((sharedHtml.match(/<li\b/gu) ?? []).length, 29)
const html = render(partners)
assert.equal((html.match(/<li\b/gu) ?? []).length, partners.length)
assert.ok(html.includes('>Our partners</h2>'))
assert.ok(html.includes('aria-labelledby="partners-title"'))
assert.ok(!html.includes('https://'), 'Partner logos must be served locally')
for (const partner of partners) {
  const original = source.partners.find((record) => record.id === partner.id)
  assert.equal(original?.name, partner.name, 'Names must retain their source mapping')
  assert.equal(original?.localAsset, partner.logo.src)
  assert.ok(html.includes(`alt="${partner.name}"`), 'Each logo must retain its organization name as alternative text')
  const asset = await sharp(new URL(`../public${partner.logo.src}`, import.meta.url).pathname).metadata()
  assert.equal(asset.format, 'webp')
  assert.equal(asset.width, partner.logo.width)
  assert.equal(asset.height, partner.logo.height)
}
console.log('Partners passed: 19 source-mapped local logos, dimensions, text alternatives, escaping, and empty/incomplete omission.')
