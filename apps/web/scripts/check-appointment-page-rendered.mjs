import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { appointmentPageFixtureStates } from './lib/appointment-page-fixture.mjs'
import { createAppointmentPagePreviewServer } from './lib/appointment-page-preview-server.mjs'

const server = await createAppointmentPagePreviewServer()
const profile = await mkdtemp(path.join(tmpdir(), 'hallelujah-appointment-page-browser-'))
const port = 20000 + randomBytes(2).readUInt16BE(0) % 30000
const capture = process.argv.includes('--capture')
const captureRoot = path.resolve(new URL('../../../docs/backlog/evidence/b03-017-artifacts/', import.meta.url).pathname)
if (capture) await mkdir(captureRoot, { recursive: true })

const browserPath = [
  'google-chrome-stable',
  'google-chrome',
  '/snap/chromium/current/usr/lib/chromium-browser/chrome',
  'chromium',
  'chromium-browser',
].find((candidate) => spawnSync(candidate, ['--version'], { encoding: 'utf8' }).status === 0)
assert.ok(browserPath, 'A Chromium browser is required')

const browser = spawn(browserPath, [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--disable-dev-shm-usage',
  '--no-first-run',
  '--no-default-browser-check',
  '--remote-debugging-address=127.0.0.1',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  'about:blank',
], { stdio: 'ignore' })

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
    if (result.exceptionDetails) throw new Error(`Appointment browser evaluation failed: ${expression}`)
    return result.result.value
  }
  const until = async (expression) => {
    for (let attempt = 0; attempt < 120; attempt++) {
      if (await evaluate(expression)) return
      await pause(30)
    }
    throw new Error(`Appointment condition timed out: ${expression}`)
  }
  const key = async (name = 'Enter', code = 13) => {
    const details = { code: name, key: name, nativeVirtualKeyCode: code, windowsVirtualKeyCode: code }
    await send('Input.dispatchKeyEvent', {
      type: 'keyDown',
      ...details,
      ...(name === 'Enter' ? { text: '\r', unmodifiedText: '\r' } : {}),
    })
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
    await send('Network.setBlockedURLs', { urls: capability === 'no-css' ? ['*/appointment.css'] : [] })
    const requestStart = requests.length
    await send('Page.navigate', { url: state === 'controlled' ? server.origin : `${server.origin}/${state}` })
    await until(`document.readyState === 'complete' && !!document.querySelector('[data-appointment-template]')`)
    await evaluate(`document.documentElement.style.fontSize = ${capability === '200%-text' ? "'200%'" : "''"}; document.activeElement?.blur()`)
    await pause(50)
    return requestStart
  }

  for (const state of appointmentPageFixtureStates) {
    const unavailable = state === 'workflow-unavailable'
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
          sections: [...document.querySelectorAll('[data-appointment-section]')].map(el => el.dataset.appointmentSection),
          headingOrder: [...document.querySelectorAll('main h1, main h2, main h3')].filter(el => !el.closest('[hidden]')).map(el => Number(el.tagName[1])),
          targets: [...document.querySelectorAll('a[href],button,label:has(input)')].filter(el => !el.closest('[hidden]')).every(el => {
            const r = el.getBoundingClientRect(); return (r.width === 0 && r.height === 0) || (r.width >= 43.5 && r.height >= 43.5);
          }),
          anchors: [...document.querySelectorAll('a[href]')].every(a => {
            const href = a.getAttribute('href');
            // An empty fragment navigates to the top; named fragments need a target.
            return href === '#' || (href.startsWith('#') && !!document.getElementById(a.hash.slice(1)));
          }),
          currentAppointment: !!document.querySelector('[data-primary-navigation] [aria-current="page"]'),
          activeContacts: document.querySelectorAll('a[href^="tel:"],a[href^="mailto:"],a[href^="http"]').length,
          externalElements: document.querySelectorAll('iframe,img,video,textarea').length,
          formCount: document.querySelectorAll('form').length,
          controlCount: document.querySelectorAll('input,select,textarea').length,
          state: document.querySelector('[data-appointment-template]').dataset.appointmentState,
          level: document.querySelector('[data-appointment-template]').dataset.experienceLevel,
          submitDisabled: document.querySelector('[data-form-submit]')?.disabled,
          visibleStates: [...document.querySelectorAll('[data-form-status]:not([hidden])')].map(el => el.dataset.formStatus),
          text: document.body.innerText,
          languageReason: (() => {
            const unavailable = document.querySelector('[data-language-switcher] [aria-disabled="true"]');
            return document.getElementById(unavailable?.getAttribute('aria-describedby'))?.textContent.trim();
          })(),
        })`)
        const label = `${state}/${width}/${capability}`
        assert.equal(result.overflow, false, `${label}: ${JSON.stringify({ viewport: result.viewport, elements: result.overflowElements })}`)
        assert.equal(result.mainCount, 1, label)
        assert.equal(result.h1Count, 1, label)
        assert.deepEqual(result.sections, unavailable
          ? ['A1', 'A2', 'A3', 'A7']
          : ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'], label)
        assert.equal(result.headingOrder[0], 1, label)
        assert.ok(result.headingOrder.slice(1).every((level, index) => level <= result.headingOrder[index] + 1), label)
        // Printed controls are not interactive touch targets.
        if (!['no-css', 'print'].includes(capability)) assert.equal(result.targets, true, `${label}: ${JSON.stringify(await evaluate(`
          [...document.querySelectorAll('a[href],button,label:has(input)')].filter(el => !el.closest('[hidden]')).map(el => {
            const r = el.getBoundingClientRect(); return { text: el.textContent?.trim().slice(0, 80), width: r.width, height: r.height };
          }).filter(r => (r.width || r.height) && (r.width < 43.5 || r.height < 43.5))
        `))}`)
        assert.equal(result.anchors, true, label)
        assert.equal(result.currentAppointment, true, label)
        assert.equal(result.activeContacts, 0, label)
        assert.equal(result.externalElements, 0, label)
        assert.equal(result.formCount, unavailable ? 0 : 1, label)
        assert.equal(result.controlCount, unavailable ? 0 : 9, label)
        assert.equal(result.level, '0', label)
        assert.doesNotMatch(result.text, /Controlled preview only/u, label)
        assert.match(result.text, /Patient Experience Team/u, label)
        assert.match(result.languageReason, /This page is unavailable in Amharic/u, label)
        assert.doesNotMatch(result.text, /WhatsApp|Telegram|response within|we will call/iu, label)
        assert.ok(!requests.slice(requestStart).some((url) => !url.startsWith(server.origin) && !url.startsWith('data:')), label)
        if (capability === 'no-js' && !unavailable) assert.equal(result.submitDisabled, true, label)
        if (state === 'receipt') {
          assert.deepEqual(result.visibleStates, ['warning'], label)
          assert.match(result.text, /No appointment request was sent/u, label)
          assert.doesNotMatch(result.text, /CONTROLLED-REQUEST-001/u, label)
        }
        if (state === 'delivery-warning') assert.deepEqual(result.visibleStates, ['warning'], label)
        if (state === 'pending') assert.deepEqual(result.visibleStates, ['pending'], label)
        if (state === 'known-failure') assert.deepEqual(result.visibleStates, ['failure'], label)
        if (state === 'unknown' || state === 'duplicate') assert.deepEqual(result.visibleStates, ['warning'], label)

        if (capability !== 'print') {
          await evaluate("document.querySelector('[data-skip-link]').focus()")
          await key()
          assert.equal(await evaluate("document.activeElement.id === 'main-content'"), true, label)
        }

        if (capture && capability === 'default' && [360, 1440].includes(width)
          && ['controlled', 'validation', 'receipt', 'workflow-unavailable'].includes(state)) {
          await pause(100)
          const { cssContentSize } = await send('Page.getLayoutMetrics')
          const shot = await send('Page.captureScreenshot', {
            format: 'png',
            captureBeyondViewport: true,
            clip: { x: 0, y: 0, width: cssContentSize.width, height: cssContentSize.height, scale: 1 },
          })
          await writeFile(path.join(captureRoot, `${state}-${width}.png`), Buffer.from(shot.data, 'base64'))
        }
        cases.push({ capability, passed: true, state, width })
      }
    }
  }

  await navigate('controlled', 'default', 360)
  const interactionRequestStart = requests.length
  assert.equal(await evaluate(`(() => {
    const form = document.querySelector('#appointment-request-form');
    form.requestSubmit();
    return true;
  })()`), true)
  await until("document.activeElement?.id === 'appointment-error-summary'")
  assert.equal(await evaluate("document.querySelectorAll('#appointment-error-summary li:not([hidden])').length"), 4)
  assert.equal(await evaluate(`(() => {
    document.querySelector('#care-route-not_sure').click();
    const name = document.querySelector('#full-name'); name.value = 'TEST PATIENT';
    const phone = document.querySelector('#phone'); phone.value = '+0 000 000 0000';
    document.querySelector('#privacy-acknowledged').click();
    document.querySelector('#appointment-request-form').requestSubmit();
    return true;
  })()`), true)
  await until("document.querySelector('#appointment-known-failure:not([hidden])') && document.activeElement?.id === 'appointment-known-failure'")
  assert.equal(requests.length, interactionRequestStart)
  assert.equal(await evaluate("document.querySelector('#full-name').value"), 'TEST PATIENT')
  assert.equal(await evaluate("document.querySelector('#phone').value"), '+0 000 000 0000')
  assert.equal(await evaluate("document.querySelector('#privacy-acknowledged').checked"), true)
  cases.push({ capability: 'interactive-validation-retention-no-request', passed: true, state: 'controlled', width: 360 })

  await navigate('controlled', 'default', 360)
  assert.equal(await evaluate(`(() => {
    document.querySelector('#care-route-doctor').click();
    const doctorVisible = !document.querySelector('[data-care-selector="doctor"]').hidden;
    const serviceHidden = document.querySelector('[data-care-selector="service"]').hidden;
    document.querySelector('#care-route-service').click();
    return doctorVisible && serviceHidden
      && document.querySelector('[data-care-selector="doctor"]').hidden
      && !document.querySelector('[data-care-selector="service"]').hidden;
  })()`), true)
  cases.push({ capability: 'exclusive-conditional-selectors', passed: true, state: 'controlled', width: 360 })

  const tree = await send('Accessibility.getFullAXTree')
  const nodes = tree.nodes.filter((node) => !node.ignored)
  for (const heading of ['Request an appointment', 'Do not use this form for emergency help',
    'Request details', 'Your privacy', 'Review your details']) {
    assert.ok(nodes.some((node) => node.role?.value === 'heading' && node.name?.value === heading), heading)
  }
  cases.push({ capability: 'accessibility-tree-form-structure', passed: true, state: 'controlled', width: 360 })

  const response = await fetch(server.origin)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/u)
  assert.match(response.headers.get('content-security-policy') ?? '', /connect-src 'none'/u)
  assert.match(response.headers.get('content-security-policy') ?? '', /form-action 'none'/u)
  assert.equal((await fetch(`${server.origin}/?query=blocked`)).status, 400)
  assert.equal((await fetch(`${server.origin}/unknown-state`)).status, 404)
  assert.equal((await fetch(server.origin, { method: 'POST' })).status, 405)
  cases.push({ capability: 'loopback-response-policy', passed: true, state: 'controlled' })

  console.log(`Appointment rendered smoke passed: ${cases.length} responsive, capability, interaction, accessibility and isolation cases.`)
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
