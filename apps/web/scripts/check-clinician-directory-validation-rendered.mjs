import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { createClinicianDirectoryPreviewServer } from './lib/clinician-directory-preview-server.mjs'

const server = await createClinicianDirectoryPreviewServer()
const profile = await mkdtemp(path.join(tmpdir(), 'hallelujah-clinician-validation-browser-'))
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
    if (result.exceptionDetails) throw new Error(`Clinician-directory validation evaluation failed: ${expression}`)
    return result.result.value
  }
  const until = async (expression) => {
    for (let attempt = 0; attempt < 150; attempt++) {
      try {
        if (await evaluate(expression)) return
      } catch {
        // A native GET navigation can replace the execution context between probes.
      }
      await pause(30)
    }
    throw new Error(`Clinician-directory validation condition timed out: ${expression}`)
  }
  const key = async (keyName, code, virtualKeyCode, text = '') => {
    const details = {
      code,
      key: keyName,
      nativeVirtualKeyCode: virtualKeyCode,
      windowsVirtualKeyCode: virtualKeyCode,
      ...(text ? { text, unmodifiedText: text } : {}),
    }
    await send('Input.dispatchKeyEvent', { type: 'keyDown', ...details })
    await send('Input.dispatchKeyEvent', { type: 'keyUp', ...details })
  }
  const navigate = async (pathName, { scripts = true, width = 360, zoom = false } = {}) => {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    })
    await send('Emulation.setScriptExecutionDisabled', { value: !scripts })
    const requestStart = requests.length
    await send('Page.navigate', { url: `${server.origin}${pathName}` })
    await until(`document.readyState === 'complete' && !!document.querySelector('[data-clinician-directory-template]')`)
    await evaluate(`document.documentElement.style.fontSize = ${zoom ? "'200%'" : "''"}`)
    await pause(40)
    assert.ok(!requests.slice(requestStart).some((url) => !url.startsWith(server.origin)), pathName)
  }

  await send('Page.enable')
  await send('Runtime.enable')
  await send('Network.enable')
  await send('Accessibility.enable')
  await send('Network.setCacheDisabled', { cacheDisabled: true })

  await navigate('/')
  await evaluate(`(() => {
    const input = document.querySelector('#clinician-search-query')
    input.value = 'Aster'
    setTimeout(() => input.form.requestSubmit(), 0)
    return true
  })()`)
  await until(`location.search === '?q=Aster' && document.querySelectorAll('[data-clinician-public-id]').length === 1`)
  assert.equal(await evaluate("document.querySelector('[data-result-count]').innerText"), '1 clinician')
  cases.push('native GET search')

  await evaluate(`(() => {
    document.querySelector('#filter-type-synthetic-family').checked = true
    setTimeout(() => document.querySelector('[data-search-controls-form]').requestSubmit(), 0)
    return true
  })()`)
  await until(`location.search === '?q=Aster&type=synthetic-family'`)
  assert.equal(await evaluate("document.querySelectorAll('[data-active-filters] a').length"), 2)
  cases.push('combined query and filter')

  await evaluate('history.back(); true')
  await until(`location.search === '?q=Aster'`)
  assert.equal(await evaluate("document.querySelector('#clinician-search-query').value"), 'Aster')
  assert.equal(await evaluate("document.querySelector('#filter-type-synthetic-family').checked"), false)
  cases.push('Back state restoration')

  await evaluate('history.forward(); true')
  await until(`location.search === '?q=Aster&type=synthetic-family'`)
  assert.equal(await evaluate("document.querySelector('#filter-type-synthetic-family').checked"), true)
  cases.push('Forward state restoration')

  await navigate('/?q=Aster&type=synthetic-family', { scripts: false })
  assert.equal(await evaluate("document.querySelectorAll('[data-clinician-public-id]').length"), 1)
  assert.equal(await evaluate("document.querySelector('[data-active-filters] a').href.endsWith('?q=Aster')"), true)
  cases.push('no-JavaScript deep link and reset')

  await send('Emulation.setScriptExecutionDisabled', { value: false })
  await evaluate("document.querySelector('[data-filter-disclosure] > summary').focus()")
  const initiallyOpen = await evaluate("document.querySelector('[data-filter-disclosure]').open")
  await key('Enter', 'Enter', 13, '\r')
  assert.equal(await evaluate("document.querySelector('[data-filter-disclosure]').open"), !initiallyOpen)
  await key('Enter', 'Enter', 13, '\r')
  await evaluate("document.querySelector('#filter-type-synthetic-child').focus()")
  const initiallyChecked = await evaluate("document.querySelector('#filter-type-synthetic-child').checked")
  await key(' ', 'Space', 32, ' ')
  assert.equal(await evaluate("document.querySelector('#filter-type-synthetic-child').checked"), !initiallyChecked)
  await evaluate("document.querySelector('#clinician-search-query').focus()")
  await key('Tab', 'Tab', 9)
  assert.equal(await evaluate("document.activeElement.matches('[data-search-box] button[type=submit]')"), true)
  cases.push('keyboard disclosure, filter and search focus')

  const { nodes } = await send('Accessibility.getFullAXTree')
  const statuses = nodes.filter((node) => node.role?.value === 'status')
  assert.equal(statuses.length, 1)
  assert.ok(nodes.some((node) => node.parentId === statuses[0].nodeId
    && node.name?.value === '1 clinician'))
  assert.equal(await evaluate("document.querySelectorAll('[role=status][aria-live=polite][aria-atomic=true]').length"), 1)
  assert.equal(await evaluate("document.querySelectorAll('ol[aria-labelledby=clinician-result-count]').length"), 1)
  cases.push('single assistive-technology count')

  for (const width of [320, 360]) {
    await navigate('/long-content', { width, zoom: true })
    const geometry = await evaluate(`({
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      emptyHeadings: [...document.querySelectorAll('h1,h2,h3')].some((heading) => !heading.textContent.trim()),
      visibleCards: document.querySelectorAll('[data-clinician-public-id]').length,
    })`)
    assert.equal(geometry.overflow, false, `${width}px at 200% text`)
    assert.equal(geometry.emptyHeadings, false, `${width}px at 200% text`)
    assert.equal(geometry.visibleCards, 4, `${width}px at 200% text`)
    cases.push(`${width}px long content at 200% text`)
  }

  for (const state of ['failure', 'offline', 'empty']) {
    await navigate(`/${state}`, { width: 360 })
    assert.equal(await evaluate("document.querySelectorAll('[data-clinician-public-id]').length"), 0, state)
    assert.equal(await evaluate("document.querySelectorAll('[data-directory-unavailable]').length"), 1, state)
    assert.equal(await evaluate("document.querySelectorAll('[role=status]').length"), 0, state)
    cases.push(`${state} fail-closed state`)
  }

  assert.ok(requests.every((url) => url.startsWith(server.origin)), 'Every browser request must remain loopback-only')
  console.log(`Clinician-directory rendered validation passed: ${cases.length} history, keyboard, AT, reflow and resilience cases.`)
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
