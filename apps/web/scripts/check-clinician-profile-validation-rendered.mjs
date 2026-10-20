import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { createClinicianProfilePreviewServer } from './lib/clinician-profile-preview-server.mjs'

const server = await createClinicianProfilePreviewServer()
const profile = await mkdtemp(path.join(tmpdir(), 'hallelujah-clinician-profile-validation-browser-'))
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
  `--user-data-dir=${profile}`, 'about:blank',
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
    if (result.exceptionDetails) throw new Error(`Clinician-profile validation evaluation failed: ${expression}`)
    return result.result.value
  }
  const until = async (expression) => {
    for (let attempt = 0; attempt < 120; attempt++) {
      if (await evaluate(expression)) return
      await pause(30)
    }
    throw new Error(`Clinician-profile validation condition timed out: ${expression}`)
  }
  const navigate = async (pathname, { media = '', scripts = true, width = 360, zoom = false } = {}) => {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    })
    await send('Emulation.setScriptExecutionDisabled', { value: !scripts })
    await send('Emulation.setEmulatedMedia', { media, features: [] })
    const requestStart = requests.length
    await send('Page.navigate', { url: `${server.origin}${pathname}` })
    await until(`document.readyState === 'complete' && !!document.querySelector('[data-clinician-profile-template]')`)
    await evaluate(`document.documentElement.style.fontSize = ${zoom ? "'200%'" : "''"}`)
    await pause(40)
    assert.ok(!requests.slice(requestStart).some((url) => !url.startsWith(server.origin)), pathname)
  }

  await send('Page.enable')
  await send('Runtime.enable')
  await send('Network.enable')
  await send('Accessibility.enable')
  await send('Network.setCacheDisabled', { cacheDisabled: true })

  await navigate('/')
  const semantics = await evaluate(`({
    mainCount: document.querySelectorAll('main').length,
    h1Count: document.querySelectorAll('h1').length,
    brokenLabels: [...document.querySelectorAll('section[aria-labelledby]')]
      .filter(section => !document.getElementById(section.getAttribute('aria-labelledby'))).length,
    duplicateIds: [...document.querySelectorAll('[id]')]
      .filter((node, index, nodes) => nodes.findIndex(peer => peer.id === node.id) !== index).length,
    emptyHeadings: [...document.querySelectorAll('h1,h2,h3')].filter(node => !node.textContent.trim()).length,
    portraitImages: document.querySelectorAll('img,picture,source').length,
    forms: document.querySelectorAll('form,input,textarea,select').length,
    disabledActions: [...document.querySelectorAll('[aria-disabled=true]')]
      .map(node => node.textContent.trim()).sort(),
  })`)
  assert.deepEqual(semantics, {
    brokenLabels: 0,
    disabledActions: [
      'Appointment requests unavailable',
      'Appointment requests unavailable',
      'አማርኛ',
    ].sort(),
    duplicateIds: 0,
    emptyHeadings: 0,
    forms: 0,
    h1Count: 1,
    mainCount: 1,
    portraitImages: 0,
  })
  const readyTree = await send('Accessibility.getFullAXTree')
  const headingNames = readyTree.nodes
    .filter((node) => node.role?.value === 'heading')
    .map((node) => node.name?.value)
  assert.ok(headingNames.includes('Dr Synthetic Meron'))
  assert.ok(headingNames.includes('Where and how to request care'))
  assert.ok(!headingNames.includes('Controlled review metadata'))
  cases.push('semantic and accessibility-tree completeness')

  await navigate('/appointment-unavailable', { scripts: false })
  const unavailableTree = await send('Accessibility.getFullAXTree')
  assert.equal(unavailableTree.nodes.filter((node) => node.role?.value === 'status').length, 1)
  assert.equal(await evaluate("document.querySelectorAll('[role=status]').length"), 1)
  assert.equal(await evaluate("document.querySelectorAll('a[href*=appointments],form').length"), 0)
  assert.match(await evaluate('document.body.innerText'), /No request was started/u)
  cases.push('no-JavaScript appointment-unavailable status')

  for (const width of [320, 360]) {
    await navigate('/long-multilingual-name', { width, zoom: true })
    const geometry = await evaluate(`({
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      emptyHeadings: [...document.querySelectorAll('h1,h2,h3')].some(node => !node.textContent.trim()),
      h1: document.querySelector('h1').innerText,
    })`)
    assert.equal(geometry.overflow, false, `${width}px at 200% text`)
    assert.equal(geometry.emptyHeadings, false, `${width}px at 200% text`)
    assert.match(geometry.h1, /\p{Script=Ethiopic}/u, `${width}px at 200% text`)
    cases.push(`${width}px multilingual name at 200% text`)
  }

  await navigate('/partial', { scripts: false, width: 320 })
  assert.equal(await evaluate("document.querySelectorAll('[data-profile-section=P2],[data-profile-section=P3],[data-profile-section=P5]').length"), 0)
  assert.equal(await evaluate('document.documentElement.scrollWidth > innerWidth + 1'), false)
  cases.push('no-JavaScript optional-field omission')

  await navigate('/portrait-omitted', { width: 360 })
  assert.equal(await evaluate("document.querySelectorAll('[data-portrait-omitted]').length"), 1)
  assert.equal(await evaluate("document.querySelectorAll('img,picture,source').length"), 0)
  assert.doesNotMatch(await evaluate('document.body.innerText'), /Synthetic portrait metadata only|Synthetic rights fixture/u)
  cases.push('portrait evidence withheld')

  await navigate('/', { media: 'print', scripts: false, width: 360 })
  assert.equal(await evaluate('document.documentElement.scrollWidth > innerWidth + 1'), false)
  assert.equal(await evaluate("document.querySelectorAll('[data-profile-section=P6]').length"), 0)
  assert.equal(await evaluate(`document.querySelectorAll('a[href^="http"],a[href^="tel:"],a[href^="mailto:"]').length`), 0)
  cases.push('print metadata omission and isolation')

  for (const state of ['failure', 'unapproved', 'gone']) {
    await navigate(`/${state}`, { scripts: false, width: 320 })
    assert.equal(await evaluate("document.querySelectorAll('[data-appointment-doctor-public-id],[data-profile-section=P2],[data-profile-section=P3],[data-profile-section=P4],[data-profile-section=P5],[data-profile-section=P6]').length"), 0, state)
    assert.equal(await evaluate("document.querySelectorAll('[data-profile-section=P7] a[href=\"/\"]').length"), 1, state)
    assert.equal(await evaluate('document.documentElement.scrollWidth > innerWidth + 1'), false, state)
    cases.push(`${state} fail-closed withdrawal state`)
  }

  assert.ok(requests.every((url) => url.startsWith(server.origin)), 'Every browser request must remain loopback-only')
  console.log(`Clinician-profile rendered validation passed: ${cases.length} semantics, AT, no-JavaScript, reflow, print and withdrawal cases.`)
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
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
}
