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
    if (message.method === 'Page.screencastFrame') {
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
  await send('Network.enable')
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `
    window.entryPaints = [];
    function sample() {
      const content = document.querySelector('[data-home-entry-content]');
      if (content) window.entryPaints.push(getComputedStyle(content).visibility);
      if (performance.now() < 3000) requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  ` })
  const visible = 'getComputedStyle(document.querySelector("[data-home-entry-content]")).visibility === "visible"'
  for (const [width, height] of [[1440, 1000], [360, 640], [390, 844]]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 500 })
    await navigate()
    await evaluate('sessionStorage.clear()')
    await navigate()
    await until('document.querySelector("[data-logo-overlay]").dataset.logoState === "revealing"')
    assert.equal(await evaluate(visible), false, 'Home must be hidden during the entrance')
    assert.equal(await evaluate('!!document.querySelector("[data-home-section=H1] [data-logo-reveal]")'), false)
    await pause(500)
    await capture(`${width}-outline`)
    await until(visible)
    await capture(`${width}-home`)
    const paints = await evaluate('window.entryPaints')
    assert.equal(paints[0], 'hidden', 'First content frame must be behind the overlay')
    const firstVisible = paints.indexOf('visible')
    assert.ok(paints.slice(firstVisible).every((value) => value === 'visible'), 'Home must not flash before entry')
    assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true)
    await navigate()
    assert.equal(await evaluate(visible), true, 'Session reload must skip entrance')
    assert.equal(await evaluate('document.documentElement.dataset.logoEntry'), undefined)
  }
  await evaluate('sessionStorage.clear()')
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await navigate()
  await until('document.querySelector("[data-logo-overlay]").dataset.logoState === "static"')
  assert.equal(await evaluate('document.querySelector("[data-logo-overlay] svg").getAnimations().length'), 0)
  await capture('reduced-motion')
  await until(visible)
  await send('Emulation.setEmulatedMedia', { features: [] })
  for (const script of ['logo-reveal.js', 'logo-entry.js']) {
    await evaluate('sessionStorage.clear()')
    await send('Network.setBlockedURLs', { urls: [`*${script}`] })
    await navigate()
    await pause(1900)
    assert.equal(await evaluate(visible), true, `${script} failure must release content`)
  }
  await send('Network.setBlockedURLs', { urls: [] })
  await evaluate('sessionStorage.clear()')
  const failureHook = await send('Page.addScriptToEvaluateOnNewDocument', { source: "Element.prototype.animate = () => { throw new Error('Animation unavailable') }" })
  await navigate()
  await until(visible)
  await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: failureHook.identifier })
  await evaluate('history.pushState({}, "", "/services"); history.pushState({}, "", "/")')
  await evaluate('new Promise(resolve => { const script = document.createElement("script"); script.src = "/logo-reveal.js"; script.onload = resolve; document.body.append(script) })')
  assert.equal(await evaluate(visible), true, 'Route updates and script remounts must not replay')
  await evaluate('sessionStorage.clear()')
  const storageHook = await send('Page.addScriptToEvaluateOnNewDocument', { source: "Storage.prototype.getItem = () => { throw new Error('Storage unavailable') }" })
  await navigate()
  assert.equal(await evaluate(visible), true)
  await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: storageHook.identifier })
  await send('Emulation.setScriptExecutionDisabled', { value: true })
  await send('Page.navigate', { url: origin })
  await pause(1000)
  await capture('no-javascript')
  await send('Emulation.setScriptExecutionDisabled', { value: false })
  assert.equal(await evaluate(visible), true)
  console.log('Passed: pre-home overlay, mobile/desktop, session reload, reduced motion, failed scripts, unavailable storage, and no JavaScript.')
} finally {
  socket?.close()
  browser.kill('SIGTERM')
  await pause(300)
  await rm(profile, { force: true, recursive: true })
}
