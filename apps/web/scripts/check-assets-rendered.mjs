import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ControlledAssetMedia } from '../src/content/asset-view.ts'
import { ControlledAssetStore } from '../src/content/asset-intake.ts'
import { assetHash } from '../src/content/asset-record.ts'
import { assetFixture, assetPixels, fixtureAssetScanner } from './lib/asset-fixture.mjs'
import { assetFont, assetPdf, assetSvg, assetVideo, assetVtt } from './lib/asset-format-fixture.mjs'

const fixtureRoot = await mkdtemp(path.join(tmpdir(), 'hallelujah-asset-browser-fixtures-'))
const store = await ControlledAssetStore.create(process.env.ASSET_TEST_TEMP_PARENT ?? '/tmp', { python: process.env.ASSET_FORMAT_PYTHON ?? 'python3' })
const localize = (input) => {
  input.localized.am = { ...input.localized.en, alt: 'የቁጥጥር ምሳሌ',
    ...(input.kind === 'video' ? { caption: 'WEBVTT\n\n00:00:00.000 --> 00:00:00.900\nየቁጥጥር ምሳሌ\n', transcript: 'የቁጥጥር ምሳሌ' } : {}) }
  return input
}
const pixels = await store.intake(localize(assetFixture()), await assetPixels(), 'image/png', 'cms:1', fixtureAssetScanner)
const videoInput = assetFixture('asset_111111111112', 'video')
videoInput.localized.en.caption = assetVtt
const video = await store.intake(localize(videoInput), await assetVideo(fixtureRoot), 'video/mp4', 'cms:1', fixtureAssetScanner)
const docInput = assetFixture('asset_111111111113', 'document')
docInput.localized.en.transcript = 'Synthetic complete readable document'
const document = await store.intake(localize(docInput), assetPdf(), 'application/pdf', 'cms:1', fixtureAssetScanner)
const vector = await store.intake(localize(assetFixture('asset_111111111114', 'icon')), assetSvg, 'image/svg+xml', 'cms:1', fixtureAssetScanner)
const fontInput = assetFixture('asset_111111111115', 'font')
fontInput.localized.am = { ...fontInput.localized.en, alt: 'ምሳሌ' }
const font = await store.intake(fontInput, await assetFont(fixtureRoot), 'font/woff2', 'cms:1', fixtureAssetScanner)
const outputMap = new Map([pixels, video, document, vector, font].flatMap((record) => record.outputs.map((output) => [`/fixture-output/${output.key}`, output])))
const source = (output) => `/fixture-output/${output.key}`
const requestLog = []
const css = `body{margin:0;font:1rem/1.6 system-ui,sans-serif;color:#18282b;background:white}main{padding:1rem;max-width:48rem;margin:auto}figure{margin:1rem 0}img,video{max-width:100%;height:auto;aspect-ratio:attr(width number)/attr(height number)}p,figcaption{overflow-wrap:anywhere}a,summary{color:#07565d}summary{cursor:pointer}a:focus-visible,summary:focus-visible{outline:3px solid #07565d;outline-offset:3px}h1{font-size:1.5rem}@media print{details{display:none}img{max-height:12rem;object-fit:contain}body{font-size:11pt}}`
const server = createServer(async (req, res) => {
  requestLog.push({ url: req.url, saveData: req.headers['save-data'] ?? null })
  res.setHeader('Cache-Control', 'private, no-store')
  res.setHeader('X-Robots-Tag', 'noindex, nofollow')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  if (req.url === '/specimen.css') { res.writeHead(200, { 'Content-Type': 'text/css' }); res.end(css); return }
  if (/^\/fixture-font-(en|am)\.css$/.test(req.url ?? '')) {
    const locale = req.url.includes('-am.') ? 'am' : 'en'
    const face = font.outputs.find((output) => output.locale === locale)
    res.writeHead(200, { 'Content-Type': 'text/css' })
    res.end(`@font-face{font-family:SyntheticAsset;src:url('${source(face)}') format('woff2');font-weight:400;font-display:swap}#font-specimen{font-family:SyntheticAsset,system-ui;font-synthesis:none}`); return
  }
  const output = outputMap.get(req.url)
  if (output) {
    try {
      const bytes = await store.read(output.key)
      assert.equal(assetHash(bytes), output.sha256)
      res.writeHead(200, { 'Content-Type': output.mime }); res.end(bytes)
    } catch { res.writeHead(410); res.end() }
    return
  }
  const [, kind, locale, state] = (req.url ?? '').split('/')
  if (!['raster', 'video', 'document', 'icon', 'font'].includes(kind) || !['en', 'am'].includes(locale)) { res.writeHead(404); res.end(); return }
  res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'self'; img-src 'self'; media-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'")
  const saveData = req.headers['save-data'] === 'on'
  let master = pixels
  if (kind === 'video') master = video
  if (kind === 'document') master = document
  if (kind === 'icon') master = vector
  const images = master.outputs.filter((output) => output.mime === 'image/png' && output.ratio === null)
  const poster = images[0]
  const movie = master.outputs.find((output) => output.purpose === 'video')
  const caption = master.outputs.find((output) => output.purpose === 'captions' && output.locale === locale)
  const readable = master.outputs.find((output) => output.purpose === 'document-text' && output.locale === locale)
  const alternative = master.input.localized[locale]
  const presentation = { synthetic: true, locale, alternative, image: poster ? { src: source(poster), srcSet: images.map((output) => `${source(output)} ${output.width}w`).join(', '),
    width: poster.width, height: poster.height } : null, video: movie ? { src: source(movie), captions: caption ? source(caption) : null } : null,
    document: readable ? source(readable) : null }
  const figure = renderToStaticMarkup(createElement(ControlledAssetMedia, { presentation: ['unavailable', 'expired'].includes(state) ? null : presentation,
    locale, saveData, mode: 'controlled-fixture' }))
  const fontCss = kind === 'font'
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(`<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Synthetic asset review</title><link rel="stylesheet" href="/specimen.css">${fontCss ? `<link rel="stylesheet" href="/fixture-font-${locale}.css">` : ''}</head><body><main><h1>Synthetic asset fixture</h1>${locale === 'am' ? '<p>Unreviewed Amharic shaping fixture</p>' : ''}<p>The complete text content stays available without media.</p>${kind === 'font' ? `<p id="font-specimen">${locale === 'am' ? 'ምሳሌ' : 'Synthetic font geometry'}</p>` : figure}</main></body></html>`)
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const origin = `http://127.0.0.1:${server.address().port}`
const profile = await mkdtemp(path.join(tmpdir(), 'hallelujah-b02-011-browser-'))
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
const captures = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../../docs/backlog/evidence/b02-011-artifacts/browser')
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
  for (const kind of ['raster', 'video', 'document', 'icon', 'font']) for (const locale of ['en', 'am'])
    for (const width of [320, 360, 768, 1440]) for (const capability of ['no-js', 'save-data', 'print', 'failed-image']) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false })
      await send('Emulation.setScriptExecutionDisabled', { value: true })
      await send('Emulation.setEmulatedMedia', { media: capability === 'print' ? 'print' : '', features: [] })
      await send('Network.setExtraHTTPHeaders', { headers: capability === 'save-data' ? { 'Save-Data': 'on' } : {} })
      await send('Network.setBlockedURLs', { urls: capability === 'failed-image' ? ['*fixture-output/*.png'] : [] })
      const beforeRequests = requests.length
      await send('Page.navigate', { url: `${origin}/${kind}/${locale}/current` })
      for (let attempt = 0; attempt < 60; attempt++) {
        if (await evaluate("document.readyState === 'complete' && document.querySelector('h1') !== null")) break
        await pause(50)
      }
      const result = await evaluate(`({ locale: document.documentElement.lang,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        text: document.body.innerText,
        dimensions: [...document.querySelectorAll('img')].every(image => image.width > 0 && image.height > 0 && image.hasAttribute('width') && image.hasAttribute('height')),
        loaded: [...document.querySelectorAll('img')].every(image => image.complete && image.naturalWidth > 0),
        videos: document.querySelectorAll('video').length,
        preloads: [...document.querySelectorAll('video')].every(video => video.preload === 'none' && video.paused),
        font: document.fonts.check('16px SyntheticAsset')
      })`)
      assert.equal(result.locale, locale); assert.equal(result.overflow, false, `${kind}/${locale}/${width}/${capability}`)
      assert.match(result.text, /complete text content stays available/)
      assert.equal(result.dimensions, true)
      if (capability !== 'failed-image') assert.equal(result.loaded, true)
      assert.equal(result.preloads, true)
      if (kind === 'video' && capability === 'save-data') assert.equal(result.videos, 0)
      assert.ok(!requests.slice(beforeRequests).some((url) => url.endsWith('.mp4')), 'video bytes must not transfer before user activation')
      if (kind === 'font' && capability !== 'failed-image') assert.equal(result.font, true, 'synthetic subset must load in Chromium')
      if (locale === 'am') assert.match(result.text, /Unreviewed Amharic/)
      if (kind === 'video' && capability !== 'save-data') assert.equal(await evaluate(`document.querySelector('track').src.endsWith('captions-${locale}.vtt')`), true, 'caption output must match requested fixture locale')
      if (width === 320 && capability === 'no-js') {
        const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
        await writeFile(path.join(captures, `${kind}-${locale}-320-no-js.png`), Buffer.from(shot.data, 'base64'))
      }
      cases.push({ kind, locale, width, capability, passed: true })
    }
  await send('Network.setBlockedURLs', { urls: [] })
  await send('Network.setExtraHTTPHeaders', { headers: {} })
  await send('Emulation.setEmulatedMedia', { media: '', features: [] })
  await send('Page.navigate', { url: `${origin}/video/en/current` })
  for (let attempt = 0; attempt < 50 && !(await evaluate("document.querySelector('summary') !== null")); attempt++) await pause(50)
  await evaluate("document.querySelector('summary').focus()")
  for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, ...(type === 'keyDown' ? { text: '\r' } : {}) })
  for (let attempt = 0; attempt < 20 && !(await evaluate("document.querySelector('details').open")); attempt++) await pause(25)
  assert.equal(await evaluate("document.querySelector('details').open"), true)
  // Enable only DevTools evaluation for native player verification; the page ships no scripts.
  await send('Emulation.setScriptExecutionDisabled', { value: false })
  const play = await send('Runtime.evaluate', { expression: "document.querySelector('video').play().then(() => true)", awaitPromise: true, returnByValue: true })
  assert.equal(play.result.value, true)
  assert.equal(await evaluate("document.querySelector('video').paused"), false)
  await evaluate("document.querySelector('video').pause()")
  assert.equal(await evaluate("document.querySelector('video').paused"), true)
  assert.ok(requests.some((url) => url.endsWith('.mp4')))
  cases.push({ kind: 'video', capability: 'native-keyboard-open-play-pause', passed: true })
  for (const state of ['unavailable', 'expired']) {
    await send('Page.navigate', { url: `${origin}/raster/en/${state}` })
    for (let attempt = 0; attempt < 50 && !(await evaluate("document.body.innerText.includes('Media unavailable')")); attempt++) await pause(50)
    assert.equal(await evaluate("document.querySelectorAll('img,video').length === 0 && document.body.innerText.includes('complete text content')"), true)
    cases.push({ kind: 'raster', state, passed: true })
  }
  const networkRequests = requests.filter((url) => /^https?:/.test(url))
  assert.equal(networkRequests.every((url) => url.startsWith(origin)), true, 'asset fixture requested an external resource: ' + networkRequests.filter((url) => !url.startsWith(origin)).join(', '))
  await store.removeOutputs(pixels)
  const gone = await fetch(origin + source(pixels.outputs[0]))
  assert.equal(gone.status, 410)
  assert.equal(gone.headers.get('Cache-Control'), 'private, no-store')
  await writeFile(path.join(captures, 'verification.json'), JSON.stringify({ synthetic: true, fixtureOnlyScan: true, cases,
    externalRequests: 0, initialVideoRequests: 0, removedDerivativeStatus: 410, humanScreenReaderAcceptance: 'not performed',
    rasterBytes: pixels.outputs.reduce((sum, output) => sum + output.bytes, 0),
    activatedVideoBytes: video.outputs.find((output) => output.purpose === 'video').bytes,
    saveDataObserved: requestLog.some((request) => request.saveData === 'on') }, null, 2) + '\n')
  process.stdout.write(`Internal assets: ${cases.length} bilingual responsive/no-JS/Save-Data/print/failed-image cases, native video keyboard/play/pause, subset fonts, 410 cleanup and zero external requests passed.\n`)
} finally {
  client?.close()
  browser.kill('SIGTERM')
  await new Promise((resolve) => browser.exitCode !== null || browser.signalCode !== null ? resolve() : browser.once('exit', resolve))
  await new Promise((resolve) => server.close(resolve))
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
  await store.destroy()
  await rm(fixtureRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
}
