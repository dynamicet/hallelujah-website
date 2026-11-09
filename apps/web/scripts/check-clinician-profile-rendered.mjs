import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { clinicianProfileFixtureStates } from './lib/clinician-profile-fixture.mjs'
import { createClinicianProfilePreviewServer } from './lib/clinician-profile-preview-server.mjs'

const server = await createClinicianProfilePreviewServer()
const browserProfile = await mkdtemp(path.join(tmpdir(), 'hallelujah-clinician-profile-browser-'))
const port = 20000 + randomBytes(2).readUInt16BE(0) % 30000
const browserPath = [
  'google-chrome-stable',
  'google-chrome',
  '/snap/chromium/current/usr/lib/chromium-browser/chrome',
  'chromium',
  'chromium-browser',
].find((candidate) => spawnSync(candidate, ['--version'], { encoding: 'utf8' }).status === 0)
assert.ok(browserPath, 'A Chromium browser is required')

const browser = spawn(browserPath, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--no-first-run',
  '--no-default-browser-check', '--remote-debugging-address=127.0.0.1', `--remote-debugging-port=${port}`,
  `--user-data-dir=${browserProfile}`, 'about:blank',
], { stdio: 'ignore' })
const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))
const requests = []
const cases = []
let socket

try {
  let endpoint
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      endpoint = (await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()).webSocketDebuggerUrl
      break
    } catch {
      if (browser.exitCode !== null || browser.signalCode !== null) throw new Error('Browser failed to start')
      await pause(100)
    }
  }
  assert.ok(endpoint, 'DevTools startup timed out')
  socket = new WebSocket(endpoint)
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })
  let nextId = 0
  const pending = new Map()
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    if (message.method === 'Network.requestWillBeSent') requests.push(message.params.request.url)
    const operation = pending.get(message.id)
    if (operation) {
      pending.delete(message.id)
      clearTimeout(operation.timer)
      if (message.error) operation.reject(new Error(message.error.message))
      else operation.resolve(message.result)
    }
  })
  const sendRaw = (method, params = {}, sessionId) => {
    const id = ++nextId
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`${method} timed out`)) }, 10000)
      pending.set(id, { resolve, reject, timer })
      socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
    })
  }
  const { targetId } = await sendRaw('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await sendRaw('Target.attachToTarget', { targetId, flatten: true })
  const send = (method, params = {}) => sendRaw(method, params, sessionId)
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true })
    if (result.exceptionDetails) throw new Error(`Clinician-profile browser evaluation failed: ${expression}`)
    return result.result.value
  }
  const until = async (expression) => {
    for (let attempt = 0; attempt < 120; attempt++) {
      if (await evaluate(expression)) return
      await pause(30)
    }
    throw new Error(`Clinician-profile condition timed out: ${expression}`)
  }
  const enter = async () => {
    const details = { code: 'Enter', key: 'Enter', nativeVirtualKeyCode: 13, windowsVirtualKeyCode: 13,
      text: '\r', unmodifiedText: '\r' }
    await send('Input.dispatchKeyEvent', { type: 'keyDown', ...details })
    await send('Input.dispatchKeyEvent', { type: 'keyUp', ...details })
  }

  await send('Page.enable')
  await send('Runtime.enable')
  await send('Network.enable')
  await send('Network.setCacheDisabled', { cacheDisabled: true })

  const navigate = async (state, capability, width) => {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false })
    await send('Emulation.setScriptExecutionDisabled', { value: capability === 'no-js' })
    await send('Emulation.setEmulatedMedia', {
      media: capability === 'print' ? 'print' : '',
      features: capability === 'forced-colors' ? [{ name: 'forced-colors', value: 'active' }]
        : capability === 'reduced-motion' ? [{ name: 'prefers-reduced-motion', value: 'reduce' }] : [],
    })
    await send('Network.setBlockedURLs', { urls: capability === 'no-css' ? ['*/clinician-profile.css'] : [] })
    const requestStart = requests.length
    const pathname = state === 'controlled' ? '/' : `/${state}`
    await send('Page.navigate', { url: `${server.origin}${pathname}` })
    await until(`document.readyState === 'complete' && !!document.querySelector('[data-clinician-profile-template]')`)
    await evaluate(`document.documentElement.style.fontSize = ${capability === '200%-text' ? "'200%'" : "''"}`)
    await pause(40)
    return requestStart
  }

  const states = clinicianProfileFixtureStates.filter((state) => state !== 'redirect')
  for (const state of states) {
    const unavailable = ['failure', 'gone', 'unapproved'].includes(state)
    for (const width of [320, 360]) {
      for (const capability of ['default', 'no-js', 'reduced-motion', 'forced-colors', 'print', '200%-text', 'no-css']) {
        const requestStart = await navigate(state, capability, width)
        const result = await evaluate(`({
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          overflowing: [...document.querySelectorAll('body *')].filter(el => {
            const r = el.getBoundingClientRect(); return r.right > innerWidth + 1 || r.left < -1
          }).map(el => [el.tagName, el.className, el.textContent.trim().slice(0, 60), el.getBoundingClientRect().right]),
          mainCount: document.querySelectorAll('main').length,
          h1Count: document.querySelectorAll('h1').length,
          emptyHeadings: [...document.querySelectorAll('h1,h2,h3')].some(el => !el.textContent.trim()),
          targets: [...document.querySelectorAll('a[href],button')].filter(el => !el.closest('[hidden]')).every(el => {
            const r = el.getBoundingClientRect(); return (r.width === 0 && r.height === 0) || (r.width >= 43.5 && r.height >= 43.5)
          }),
          smallTargets: [...document.querySelectorAll('a[href],button')].filter(el => {
            if (el.closest('[hidden]')) return false
            const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.width < 43.5 || r.height < 43.5)
          }).map(el => { const r = el.getBoundingClientRect(); return [el.textContent.trim(), r.width, r.height] }),
          anchors: [...document.querySelectorAll('a[href^="#"]')].every(a => !!document.getElementById(a.hash.slice(1))),
          external: document.querySelectorAll('a[href^="http"],a[href^="tel:"],a[href^="mailto:"],iframe,img,video,form,input,textarea').length,
          profileId: document.querySelectorAll('[data-appointment-doctor-public-id]').length,
          portrait: document.querySelectorAll('[data-clinician-monogram]').length,
          text: document.body.innerText,
        })`)
        const label = `${state}/${width}/${capability}`
        assert.equal(result.overflow, false, `${label}: ${JSON.stringify(result.overflowing)}`)
        assert.equal(result.mainCount, 1, label)
        assert.equal(result.h1Count, 1, label)
        assert.equal(result.emptyHeadings, false, label)
        if (capability !== 'no-css') assert.equal(result.targets, true, `${label}: ${JSON.stringify(result.smallTargets)}`)
        assert.equal(result.anchors, true, label)
        assert.equal(result.external, 0, label)
        assert.equal(result.profileId, unavailable ? 0 : 1, label)
        assert.equal(result.portrait, unavailable ? 0 : 1, label)
        assert.doesNotMatch(result.text, /available today|accepting patients|book now|schedule with/iu, label)
        assert.ok(!requests.slice(requestStart).some((url) => !url.startsWith(server.origin)), label)
        if (capability !== 'print') {
          await evaluate("document.querySelector('[data-skip-link]').focus()")
          await enter()
          assert.equal(await evaluate("document.activeElement.id === 'main-content'"), true, label)
        }
        cases.push({ capability, state, width })
      }
    }
  }

  await navigate('partial', 'default', 360)
  assert.equal(await evaluate("document.querySelectorAll('[data-profile-section=P2],[data-profile-section=P3],[data-profile-section=P5]').length"), 0)
  assert.doesNotMatch(await evaluate('document.body.innerText'), /location relationship/u)
  cases.push({ capability: 'default', state: 'partial-omission', width: 360 })

  await navigate('appointment-unavailable', 'no-js', 360)
  assert.match(await evaluate('document.body.innerText'), /No request was started/u)
  assert.equal(await evaluate("document.querySelectorAll('a[href*=" + JSON.stringify('appointments') + "]').length"), 0)
  cases.push({ capability: 'no-js', state: 'appointment-unavailable', width: 360 })

  assert.ok(requests.every((url) => url.startsWith(server.origin)), 'Every browser request must remain loopback-only')
  console.log(`Clinician-profile browser matrix passed: ${cases.length} responsive, capability, omission and isolation cases.`)
} finally {
  try { socket?.close() } catch {}
  const waitForExit = () => browser.exitCode !== null || browser.signalCode !== null
    ? Promise.resolve()
    : new Promise((resolve) => browser.once('exit', resolve))
  if (browser.exitCode === null && browser.signalCode === null) browser.kill('SIGTERM')
  await Promise.race([waitForExit(), pause(1500)])
  if (browser.exitCode === null && browser.signalCode === null) {
    browser.kill('SIGKILL')
    await waitForExit()
  }
  await server.close()
  await rm(browserProfile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
}
