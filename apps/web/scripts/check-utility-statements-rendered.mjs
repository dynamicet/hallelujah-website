import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { applyWorkflow, createWorkflow, requiredDomains } from '../src/content/cms-workflow.ts'
import { ControlledStatementDetails } from '../src/content/utility-statement-view.ts'
import { utilityStatementFixture } from './lib/utility-statement-fixture.mjs'

const now = new Date('2026-09-17T12:01:00Z')
const at = new Date('2026-09-17T12:00:00Z')
const author = { id: 'cms:1', roles: ['author'] }
const reviewer = { id: 'cms:2', roles: ['reviewer'] }
const publisher = { id: 'cms:3', roles: ['publisher'] }
function published(type) {
  const fixture = utilityStatementFixture(at, type === 'privacy' ? '909090909090' : '919191919191', type)
  fixture.localized.am = { slug: `synthetic-${type}-am`, title: 'የቁጥጥር ምሳሌ' }
  fixture.utilityStatement.localized.am = { title: fixture.localized.am.title,
    sections: [{ key: 'scope', heading: 'የቁጥጥር ምሳሌ', body: 'የቁጥጥር ጽሑፍ ምሳሌ' },
      { key: 'limitations', heading: 'የቁጥጥር ምሳሌ', body: 'የቁጥጥር ጽሑፍ ምሳሌ' }] }
  const contentClass = type === 'privacy' ? 'privacy' : 'general'
  let doc = createWorkflow(fixture, contentClass, author, at)
  const action = (actor, type, extra = {}) => {
    doc = applyWorkflow(doc, undefined, { action: type, expectedRevision: doc.workflow.revision, ...extra }, actor, at)
  }
  action(author, 'submit')
  for (const [index, domain] of requiredDomains(fixture, contentClass).entries()) action(
    { id: `cms:${index + 4}`, roles: [domain] }, 'review-domain', { domain, reference: 'Synthetic specimen review' })
  action(reviewer, 'approve')
  action(publisher, 'publish')
  return doc
}
const documents = { privacy: published('privacy'), accessibility: published('accessibility') }
const css = 'body{font:1rem/1.6 system-ui,sans-serif;margin:0;color:#18282b;background:#fff}main{max-width:48rem;margin:auto;padding:1rem}h1{font-size:2rem;line-height:1.2}h2{font-size:1.4rem}nav{display:flex;flex-wrap:wrap;gap:1rem}a{color:#07565d}a:focus-visible{outline:3px solid #07565d;outline-offset:3px}p,dd,li{overflow-wrap:anywhere}dd{margin-left:1rem}section{margin-block:1.5rem}@media print{body{font-size:11pt}main{max-width:none;padding:0}h1,h2,h3{break-after:avoid}}'
const server = createServer((req, res) => {
  res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'self'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'")
  res.setHeader('X-Robots-Tag', 'noindex, nofollow')
  if (req.url === '/specimen.css') { res.writeHead(200, { 'Content-Type': 'text/css' }); res.end(css); return }
  const [, type, locale, state] = (req.url ?? '').split('/')
  if (!['privacy', 'accessibility'].includes(type) || !['en', 'am'].includes(locale)) { res.writeHead(404); res.end(); return }
  const doc = structuredClone(documents[type])
  if (state === 'expired') {
    doc.record.status = 'expired'
    doc.record.withdrawal = { reason: 'Synthetic expiry', successorPublicId: null }
  }
  const body = renderToStaticMarkup(createElement(ControlledStatementDetails,
    { documents: state === 'unavailable' ? [] : [doc], type, locale, now, mode: 'controlled-fixture' }))
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(`<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Synthetic statement review</title><link rel="stylesheet" href="/specimen.css"></head><body><main>${body}</main></body></html>`)
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const origin = `http://127.0.0.1:${server.address().port}`
const profile = await mkdtemp(path.join(tmpdir(), 'hallelujah-b02-009-browser-'))
const port = 20000 + randomBytes(2).readUInt16BE(0) % 30000
function findBrowser() {
  for (const candidate of ['google-chrome-stable', 'google-chrome',
    '/snap/chromium/current/usr/lib/chromium-browser/chrome', 'chromium', 'chromium-browser']) {
    if (spawnSync(candidate, ['--version'], { encoding: 'utf8' }).status === 0) return candidate
  }
  throw new Error('A Chromium browser is required')
}
const browser = spawn(findBrowser(), ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  '--no-first-run', '--no-default-browser-check', '--remote-debugging-address=127.0.0.1',
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] })
let browserOutput = ''
browser.stderr.on('data', (chunk) => { browserOutput += chunk.toString() })
const captures = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../../docs/backlog/evidence/b02-009-rendered')
await mkdir(captures, { recursive: true })
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
let client
try {
  let endpoint
  for (let attempt = 0; attempt < 100; attempt++) {
    try { endpoint = (await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()).webSocketDebuggerUrl; break }
    catch { if (browser.exitCode !== null || browser.signalCode !== null) throw new Error('Browser failed: '+browserOutput); await pause(100) }
  }
  assert.ok(endpoint, 'browser did not start')
  const socket = new WebSocket(endpoint)
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }) })
  const pending = new Map()
  const requests = []
  let nextId = 0
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    if (message.method === 'Network.requestWillBeSent') requests.push(message.params.request.url)
    const operation = pending.get(message.id)
    if (operation) {
      pending.delete(message.id)
      if (message.error) operation.reject(new Error(message.error.message))
      else operation.resolve(message.result)
    }
  })
  client = { send(method, params = {}, sessionId) {
    const id = ++nextId
    return new Promise((resolve, reject) => { pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) })) })
  }, close: () => socket.close() }
  const { targetId } = await client.send('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await client.send('Target.attachToTarget', { flatten: true, targetId })
  const send = (method, params = {}) => client.send(method, params, sessionId)
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true })
    if (result.exceptionDetails) throw new Error('Specimen evaluation failed')
    return result.result.value
  }
  await send('Page.enable')
  await send('Network.enable')
  const cases = []
  for (const type of ['privacy', 'accessibility']) for (const locale of ['en', 'am'])
    for (const width of [320, 360, 768, 1440]) for (const capability of ['no-js', 'forced-colors', 'print']) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false })
      await send('Emulation.setScriptExecutionDisabled', { value: capability === 'no-js' })
      await send('Emulation.setEmulatedMedia', { media: capability === 'print' ? 'print' : '',
        features: capability === 'forced-colors' ? [{ name: 'forced-colors', value: 'active' }] : [] })
      await send('Page.navigate', { url: `${origin}/${type}/${locale}/current` })
      for (let attempt = 0; attempt < 50; attempt++) {
        if (await evaluate("document.readyState === 'complete' && document.querySelector('article') !== null")) break
        await pause(50)
      }
      const result = await evaluate(`({
        locale: document.documentElement.lang,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        heading: document.querySelectorAll('h1').length,
        links: [...document.querySelectorAll('a')].every(a => a.getAttribute('href').startsWith('#') && document.getElementById(a.hash.slice(1))),
        text: document.body.innerText, controls: document.querySelectorAll('form,input,button,script,img').length
      })`)
      assert.equal(result.locale, locale)
      assert.equal(result.overflow, false, `${type}/${locale}/${width}/${capability}`)
      assert.equal(result.heading, 1)
      assert.equal(result.links, true)
      assert.equal(result.controls, 0)
      assert.match(result.text, /Synthetic statement fixture/)
      assert.match(result.text, /Contact unavailable/)
      assert.match(result.text, /Effective:/)
      assert.match(result.text, type === 'privacy' ? /collection.*disabled/i : /no conformance certification/)
      if (locale === 'am') assert.match(result.text, /Unreviewed Amharic/)
      // Native keyboard fragment navigation remains functional with document scripting disabled.
      await evaluate("document.querySelector('nav a').focus()")
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
      for (let attempt = 0; attempt < 20 && !(await evaluate("location.hash.includes('-scope')")); attempt++) await pause(25)
      assert.equal(await evaluate("location.hash.includes('-scope')"), true)
      if (width === 320 && capability === 'no-js') {
        const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
        await writeFile(path.join(captures, `${type}-${locale}-320-no-js.png`), Buffer.from(shot.data, 'base64'))
      }
      if (width === 768 && locale === 'en' && capability === 'print') {
        const pdf = await send('Page.printToPDF', { printBackground: true })
        await writeFile(path.join(captures, `${type}-en-print.pdf`), Buffer.from(pdf.data, 'base64'))
      }
      cases.push({ type, locale, width, capability, passed: true })
    }
  await send('Emulation.setScriptExecutionDisabled', { value: true })
  for (const type of ['privacy', 'accessibility']) for (const state of ['unavailable', 'expired']) {
    await send('Page.navigate', { url: `${origin}/${type}/en/${state}` })
    for (let attempt = 0; attempt < 50; attempt++) {
      if (await evaluate("document.readyState === 'complete' && document.body.innerText.includes('Statement unavailable')")) break
      await pause(50)
    }
    assert.equal(await evaluate("document.querySelector('article') === null && document.body.innerText.includes('Statement unavailable')"), true)
    cases.push({ type, state, capability: 'no-js', passed: true })
  }
  assert.equal(requests.every((url) => url.startsWith(origin)), true, 'specimen requested an external resource')
  await writeFile(path.join(captures, 'verification.json'), JSON.stringify({ synthetic: true, cases,
    externalRequests: 0, collectionControls: 0, humanScreenReaderAcceptance: 'not performed' }, null, 2) + '\n')
  process.stdout.write(`Internal statements: ${cases.length} bilingual viewport/no-JS/forced-colors/print/unavailable cases, native keyboard links and zero external requests passed.\n`)
} finally {
  client?.close()
  browser.kill('SIGTERM')
  await new Promise((resolve) => browser.exitCode !== null || browser.signalCode !== null ? resolve() : browser.once('exit', resolve))
  await new Promise((resolve) => server.close(resolve))
  await rm(profile, { recursive: true, force: true })
}
