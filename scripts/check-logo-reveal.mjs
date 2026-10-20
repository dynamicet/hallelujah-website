import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

const origin = process.env.LOGO_TEST_ORIGIN || 'http://localhost:3000'
const output = path.resolve('artifacts/visual/logo-reveal')
await mkdir(output, { recursive: true })
const profile = await mkdtemp(path.join(tmpdir(), 'logo-browser-'))
const browser = spawn('chromium', ['--headless', '--no-sandbox', '--disable-dev-shm-usage', '--remote-debugging-port=9334', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' })
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
let socket
try {
  let endpoint
  for (let i = 0; i < 100; i++) {
    try { endpoint = (await (await fetch('http://127.0.0.1:9334/json/version')).json()).webSocketDebuggerUrl; break }
    catch { await pause(100) }
  }
  assert.ok(endpoint, 'Chromium must start')
  socket = new WebSocket(endpoint)
  await new Promise((resolve) => socket.addEventListener('open', resolve, { once: true }))
  let id = 0
  let sessionId
  let filmstrip
  const pending = new Map()
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data)
    if (message.method === 'Page.screencastFrame') {
      filmstrip?.push(message.params)
      void send('Page.screencastFrameAck', { sessionId: message.params.sessionId })
      return
    }
    if (!pending.has(message.id)) return
    const { resolve, reject } = pending.get(message.id)
    pending.delete(message.id)
    if (message.error) reject(new Error(message.error.message))
    else resolve(message.result)
  })
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    pending.set(++id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params, sessionId }))
  })
  const target = await send('Target.createTarget', { url: 'about:blank' })
  sessionId = (await send('Target.attachToTarget', { targetId: target.targetId, flatten: true })).sessionId
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails))
    return result.result.value
  }
  const until = async (expression) => {
    for (let i = 0; i < 300; i++) {
      if (await evaluate(expression)) return
      await pause(20)
    }
    throw new Error(`Timed out: ${expression}`)
  }
  const navigate = async () => {
    await send('Page.navigate', { url: origin })
    await until('document.querySelector("[data-logo-reveal]") && document.readyState === "complete"')
  }
  const capture = async (name) => {
    const { data } = await send('Page.captureScreenshot', { format: 'png' })
    await writeFile(path.join(output, `${name}.png`), Buffer.from(data, 'base64'))
  }
  await send('Page.enable')
  for (const [width, height] of [[1440, 1000], [360, 640], [390, 844]]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 500 })
    await navigate()
    await evaluate('sessionStorage.clear()')
    // Freeze only the six logo animations to inspect exact choreography frames.
    const hook = await send('Page.addScriptToEvaluateOnNewDocument', { source: `const original = Element.prototype.animate; Element.prototype.animate = function(...args) { const a = original.apply(this, args); if (this.hasAttribute('data-logo-part')) a.pause(); return a }` })
    await navigate()
    await until('document.querySelector("[data-logo-reveal]").dataset.logoState === "revealing"')
    for (const time of [0, 450, 900, 1500]) {
      await evaluate(`document.getAnimations().forEach(a => { if (a.effect.target.hasAttribute('data-logo-part')) a.currentTime = ${time} })`)
      await capture(`${width}-${time}`)
      if (width === 1440 && time === 450) {
        await evaluate('document.querySelector("[data-logo-reveal] svg").style.filter = "grayscale(1)"')
        await capture('monochrome-study')
        await evaluate('document.querySelector("[data-logo-reveal] svg").style.filter = ""')
      }
    }
    await until('document.querySelector("[data-logo-reveal]").dataset.logoState === "complete"')
    await capture(`${width}-final`)
    assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true)
    assert.equal(await evaluate('document.querySelector("[data-logo-reveal]").getBoundingClientRect().bottom < innerHeight'), true, 'Entire identity must be in the initial viewport')
    assert.equal(await evaluate('getComputedStyle(document.querySelector("h1")).visibility'), 'visible')
    await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: hook.identifier })
    await navigate()
    assert.equal(await evaluate('document.querySelector("[data-logo-reveal]").dataset.logoState ?? "static"'), 'static')
    await evaluate(`document.querySelector('a[href="#home-appointment"]').click()`)
    assert.equal(await evaluate('location.hash'), '#home-appointment')
  }
  // Exercise the real clock as well as the deterministic storyboard above.
  await evaluate('sessionStorage.clear()')
  await navigate()
  await until('document.querySelector("[data-logo-reveal]").dataset.logoState === "revealing"')
  const liveStart = Date.now()
  await until('document.querySelector("[data-logo-reveal]").dataset.logoState === "complete"')
  assert.ok(Date.now() - liveStart < 2200, 'Reveal must finish without prolonging entry')
  await evaluate('sessionStorage.clear()')
  await navigate()
  await until('document.querySelector("[data-logo-reveal]").dataset.logoState === "revealing"')
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await until('document.querySelector("[data-logo-reveal]").dataset.logoState === "complete"')

  await evaluate('sessionStorage.clear()')
  await navigate()
  assert.equal(await evaluate('document.getAnimations().filter(a => a.effect.target.hasAttribute("data-logo-part")).length'), 0)
  assert.equal(await evaluate('getComputedStyle(document.querySelector("[data-logo-complete]")).visibility'), 'visible')
  await capture('reduced-motion')
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
  // Unmodified playback, including actual render opportunities before enhancement.
  const paintHook = await send('Page.addScriptToEvaluateOnNewDocument', { source: `
    window.logoPaints = [];
    function sample(time) {
      const image = document.querySelector('[data-logo-complete]');
      if (image) window.logoPaints.push({ time, visible: getComputedStyle(image).visibility === 'visible' });
      if (time < 3500) requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  ` })
  await send('Network.enable')
  for (const mode of ['cold', 'warm', 'throttled']) {
    await evaluate('sessionStorage.clear()')
    await send('Network.setCacheDisabled', { cacheDisabled: mode !== 'warm' })
    await send('Emulation.setCPUThrottlingRate', { rate: mode === 'throttled' ? 4 : 1 })
    await send('Network.emulateNetworkConditions', { offline: false, latency: mode === 'throttled' ? 150 : 0, downloadThroughput: -1, uploadThroughput: -1 })
    filmstrip = []
    await send('Page.startScreencast', { format: 'png', everyNthFrame: 1 })
    await navigate()
    await pause(2500)
    await send('Page.stopScreencast')
    const paints = await evaluate('window.logoPaints')
    const firstVisible = paints.findIndex((paint) => paint.visible)
    assert.ok(firstVisible >= 0, `${mode}: complete image must become visible`)
    assert.ok(paints.slice(firstVisible).every((paint) => paint.visible), `${mode}: completed logo must never disappear after a rendered frame`)
    await writeFile(path.join(output, `${mode}-paint-log.json`), `${JSON.stringify(paints, null, 2)}\n`)
    for (const [index, frame] of filmstrip.entries()) {
      await writeFile(path.join(output, `${mode}-film-${String(index).padStart(3, '0')}.png`), Buffer.from(frame.data, 'base64'))
    }
    filmstrip = undefined
  }
  await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: paintHook.identifier })
  await send('Emulation.setCPUThrottlingRate', { rate: 1 })
  await send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 })
  for (const script of ['logo-reveal.js', 'logo-entry.js']) {
    await evaluate('sessionStorage.clear()')
    await send('Network.setBlockedURLs', { urls: [`*${script}`] })
    await navigate()
    await pause(2200)
    assert.equal(await evaluate('getComputedStyle(document.querySelector("[data-logo-complete]")).visibility'), 'visible', `${script} failure must restore identity`)
  }
  await send('Network.setBlockedURLs', { urls: [] })
  await evaluate('sessionStorage.clear()')
  const storageHook = await send('Page.addScriptToEvaluateOnNewDocument', { source: "Storage.prototype.getItem = () => { throw new Error('Storage unavailable') }" })
  await navigate()
  assert.equal(await evaluate('document.querySelector("[data-logo-reveal]").dataset.logoState ?? "static"'), 'static')
  await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: storageHook.identifier })
  await send('Emulation.setScriptExecutionDisabled', { value: true })
  await send('Page.navigate', { url: origin })
  await pause(1000)
  await capture('no-javascript')
  await send('Emulation.setScriptExecutionDisabled', { value: false })
  assert.equal(await evaluate('getComputedStyle(document.querySelector("[data-logo-complete]")).visibility'), 'visible')
  console.log('Logo reveal passed: desktop/mobile frames, session reload, navigation, reduced motion, no JavaScript, overflow, and visible content.')
} finally {
  socket?.close()
  browser.kill('SIGTERM')
  await pause(300)
  await rm(profile, { force: true, recursive: true })
}
