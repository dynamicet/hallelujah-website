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
  const pending = new Map()
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data)
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
  for (const width of [1440, 360]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width === 360 })
    await navigate()
    await evaluate('sessionStorage.clear()')
    // Freeze only the six logo animations to inspect exact choreography frames.
    const hook = await send('Page.addScriptToEvaluateOnNewDocument', { source: `const original = Element.prototype.animate; Element.prototype.animate = function(...args) { const a = original.apply(this, args); if (this.hasAttribute('data-logo-part')) a.pause(); return a }` })
    await navigate()
    await until('document.querySelector("[data-logo-reveal]").dataset.logoState === "revealing"')
    for (const time of [0, 450, 900, 1240]) {
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
