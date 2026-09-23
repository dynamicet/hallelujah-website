import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { createEmergencyPreviewServer } from './lib/emergency-preview-server.mjs'
import { emergencyFixtureStates } from './lib/emergency-fixture.mjs'

const server = await createEmergencyPreviewServer()
const profile = await mkdtemp(path.join(tmpdir(), 'hallelujah-emergency-browser-'))
const port = 20000 + randomBytes(2).readUInt16BE(0) % 30000
const capture = process.argv.includes('--capture')
const captureRoot = path.resolve(new URL('../../../docs/backlog/evidence/b03-008-artifacts/', import.meta.url).pathname)
if (capture) await mkdir(captureRoot, { recursive: true })

const browserPath = ['google-chrome-stable', 'google-chrome',
  '/snap/chromium/current/usr/lib/chromium-browser/chrome', 'chromium', 'chromium-browser']
  .find((candidate) => spawnSync(candidate, ['--version'], { encoding: 'utf8' }).status === 0)
assert.ok(browserPath, 'A Chromium browser is required')

const browser = spawn(browserPath, ['--headless=new', '--no-sandbox', '--disable-gpu',
  '--disable-dev-shm-usage', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-address=127.0.0.1', `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' })

const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))
const cases = []
const requests = []
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
      const timer = setTimeout(() => {
        pending.delete(id)
        reject(new Error(`${method} timed out`))
      }, 10000)
      pending.set(id, { resolve, reject, timer })
      socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
    })
  }
  const { targetId } = await sendRaw('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await sendRaw('Target.attachToTarget', { targetId, flatten: true })
  const send = (method, params = {}) => sendRaw(method, params, sessionId)
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true })
    if (result.exceptionDetails) throw new Error(`Emergency browser evaluation failed: ${expression}`)
    return result.result.value
  }
  const until = async (expression) => {
    for (let attempt = 0; attempt < 100; attempt++) {
      if (await evaluate(expression)) return
      await pause(30)
    }
    throw new Error(`Emergency condition timed out: ${expression}`)
  }
  const key = async (name = 'Enter', code = 13) => {
    const details = { code: name, key: name, nativeVirtualKeyCode: code, windowsVirtualKeyCode: code }
    await send('Input.dispatchKeyEvent', { type: 'keyDown', ...details,
      ...(name === 'Enter' ? { text: '\r', unmodifiedText: '\r' } : {}) })
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
      features: capability === 'forced-colors'
        ? [{ name: 'forced-colors', value: 'active' }]
        : capability === 'reduced-motion'
          ? [{ name: 'prefers-reduced-motion', value: 'reduce' }]
          : [],
    })
    await send('Network.setBlockedURLs', { urls: capability === 'no-css' ? ['*/emergency.css'] : [] })
    const requestStart = requests.length
    await send('Page.navigate', { url: state === 'controlled' ? server.origin : `${server.origin}/${state}` })
    await until(`document.readyState === 'complete' && !!document.querySelector('[data-emergency-template]')`)
    await evaluate(`document.documentElement.style.fontSize = ${capability === '200%-text' ? "'200%'" : "''"}; document.activeElement?.blur()`)
    await pause(50)
    return requestStart
  }

  for (const state of emergencyFixtureStates) {
    for (const width of [320, 360, 768, 1440]) {
      for (const capability of ['default', 'no-js', 'reduced-motion', 'forced-colors', 'print', '200%-text', 'no-css']) {
        const requestStart = await navigate(state, capability, width)
        const result = await evaluate(`({
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          viewport: {innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth},
          overflowElements: [...document.querySelectorAll('body *')].filter(el => {
            const r = el.getBoundingClientRect(); return r.right > innerWidth + 1 || r.left < -1 || el.scrollWidth > el.clientWidth + 1;
          }).slice(0, 8).map(el => ({tag: el.tagName, cls: el.className, text: el.textContent?.slice(0, 80),
            left: el.getBoundingClientRect().left, right: el.getBoundingClientRect().right,
            scroll: el.scrollWidth, client: el.clientWidth})),
          mainCount: document.querySelectorAll('main').length,
          h1Count: document.querySelectorAll('h1').length,
          sections: [...document.querySelectorAll('[data-emergency-section]')].map(el => el.dataset.emergencySection),
          headingOrder: [...document.querySelectorAll('main h1, main h2, main h3')].map(el => Number(el.tagName[1])),
          interactiveTargets: [...document.querySelectorAll('a[href],button')].every(el => {
            const r = el.getBoundingClientRect();
            return (r.width === 0 && r.height === 0) || (r.width >= 43.5 && r.height >= 43.5);
          }),
          currentEmergency: !!document.querySelector('[data-primary-navigation] [aria-current="page"]'),
          inertChoices: document.querySelectorAll('[data-inert-call-choice]').length,
          activeCalls: document.querySelectorAll('a[href^="tel:"],a[href^="mailto:"]').length,
          fieldsProvidersMedia: document.querySelectorAll('form,input,textarea,select,iframe,img,video,a[href^="http"]').length,
          level: document.querySelector('[data-emergency-template]').dataset.experienceLevel,
          moving: [...document.querySelectorAll('[data-emergency-template] *')].some(el => {
            const style = getComputedStyle(el);
            return style.animationName !== 'none' || style.transitionDuration.split(',').some(value => parseFloat(value) > 0);
          }),
          text: document.body.innerText,
        })`)
        const label = `${state}/${width}/${capability}`
        assert.equal(result.overflow, false, `${label}: ${JSON.stringify({viewport: result.viewport, elements: result.overflowElements})}`)
        assert.equal(result.mainCount, 1, label)
        assert.equal(result.h1Count, 1, label)
        assert.deepEqual(result.sections, ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8'], label)
        assert.equal(result.headingOrder[0], 1, label)
        assert.ok(result.headingOrder.slice(1).every((level, index) => level <= result.headingOrder[index] + 1), label)
        if (capability !== 'no-css') assert.equal(result.interactiveTargets, true, label)
        assert.equal(result.currentEmergency, true, label)
        assert.equal(result.inertChoices, 2, label)
        assert.equal(result.activeCalls, 0, label)
        assert.equal(result.fieldsProvidersMedia, 0, label)
        assert.equal(result.level, '0', label)
        if (capability !== 'no-css') assert.equal(result.moving, false, label)
        assert.match(result.text, /Controlled preview only/u, label)
        assert.match(result.text, /INVALID TEST VALUE/u, label)
        assert.match(result.text, /provides no emergency advice/u, label)
        assert.match(result.text, /No map, coordinates, geolocation/u, label)
        assert.ok(!requests.slice(requestStart).some((url) => !url.startsWith(server.origin)), label)

        if (capability !== 'print') {
          await evaluate("document.querySelector('[data-skip-link]').focus()")
          await key()
          assert.equal(await evaluate("document.activeElement.id === 'main-content'"), true, label)
        }
        const hashBefore = await evaluate('location.hash')
        await evaluate("document.querySelector('[data-inert-call-choice]').click()")
        assert.equal(await evaluate('location.hash'), hashBefore, label)

        if (capture && capability === 'no-js' && [320, 1440].includes(width)) {
          await pause(100)
          const { cssContentSize } = await send('Page.getLayoutMetrics')
          const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
            clip: { x: 0, y: 0, width: cssContentSize.width, height: cssContentSize.height, scale: 1 } })
          await writeFile(path.join(captureRoot, `${state}-${width}-no-js.png`), Buffer.from(shot.data, 'base64'))
        }
        cases.push({ capability, passed: true, state, width })
      }
    }
  }

  await navigate('controlled', 'default', 360)
  const tree = await send('Accessibility.getFullAXTree')
  const nodes = tree.nodes.filter((node) => !node.ignored)
  for (const heading of ['Emergency help', 'How the routes differ',
    'Do not use online contact for emergencies', 'Where to go', 'Arriving safely']) {
    assert.ok(nodes.some((node) => node.role?.value === 'heading' && node.name?.value === heading), heading)
  }
  assert.ok(!nodes.some((node) => node.role?.value === 'link' && /INVALID TEST VALUE/u.test(node.name?.value ?? '')))
  cases.push({ capability: 'accessibility-tree-inert-call-boundary', passed: true, state: 'controlled', width: 360 })

  const response = await fetch(server.origin)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/u)
  assert.match(response.headers.get('content-security-policy') ?? '', /connect-src 'none'/u)
  assert.equal((await fetch(`${server.origin}/?query=blocked`)).status, 400)
  assert.equal((await fetch(`${server.origin}/unknown`)).status, 404)
  assert.equal((await fetch(server.origin, { method: 'POST' })).status, 405)
  cases.push({ capability: 'loopback-response-policy', passed: true, state: 'controlled' })

  console.log(`Emergency rendered smoke passed: ${cases.length} responsive, capability, accessibility and isolation cases.`)
  console.log(JSON.stringify({ cases, samples: server.samples }, null, 2))
} finally {
  socket?.close()
  browser.kill('SIGTERM')
  await server.close()
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await rm(profile, { recursive: true, force: true })
      break
    } catch (error) {
      if (attempt === 4) throw error
      await pause(100)
    }
  }
}
