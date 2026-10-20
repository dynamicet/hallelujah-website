import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { serviceDirectoryFixtureStates } from './lib/service-directory-fixture.mjs'
import { createServiceDirectoryPreviewServer } from './lib/service-directory-preview-server.mjs'

const server = await createServiceDirectoryPreviewServer()
const profile = await mkdtemp(path.join(tmpdir(), 'hallelujah-service-directory-browser-'))
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
    if (result.exceptionDetails) throw new Error(`Service-directory browser evaluation failed: ${expression}`)
    return result.result.value
  }
  const until = async (expression) => {
    for (let attempt = 0; attempt < 120; attempt++) {
      if (await evaluate(expression)) return
      await pause(30)
    }
    throw new Error(`Service-directory condition timed out: ${expression}`)
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

  const navigate = async (state, capability, width, query = '', height = 900) => {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
    await send('Emulation.setScriptExecutionDisabled', { value: capability === 'no-js' })
    await send('Emulation.setEmulatedMedia', {
      media: capability === 'print' ? 'print' : '',
      features: capability === 'forced-colors' ? [{ name: 'forced-colors', value: 'active' }]
        : capability === 'reduced-motion' ? [{ name: 'prefers-reduced-motion', value: 'reduce' }] : [],
    })
    await send('Network.setBlockedURLs', { urls: capability === 'no-css' ? ['*/service-directory.css'] : [] })
    const requestStart = requests.length
    const pathName = state === 'controlled' ? '/' : `/${state}`
    await send('Page.navigate', { url: `${server.origin}${pathName}${query}` })
    await until(`document.readyState === 'complete' && !!document.querySelector('[data-service-directory-template]')`)
    await evaluate(`document.documentElement.style.fontSize = ${capability === '200%-text' ? "'200%'" : "''"}`)
    await pause(40)
    return requestStart
  }

  for (const state of serviceDirectoryFixtureStates) {
    const unavailable = ['failure', 'offline', 'empty'].includes(state)
    const loading = state === 'loading'
    for (const width of [320, 360, 768, 1440]) {
      for (const capability of ['default', 'no-js', 'reduced-motion', 'forced-colors', 'print', '200%-text', 'no-css']) {
        const requestStart = await navigate(state, capability, width)
        const result = await evaluate(`({
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          mainCount: document.querySelectorAll('main').length,
          h1Count: document.querySelectorAll('h1').length,
          sections: [...document.querySelectorAll('[data-directory-section]')].map(el => el.dataset.directorySection),
          targets: [...document.querySelectorAll('a[href],button,summary,label:has(input)')].filter(el => !el.closest('[hidden]')).every(el => {
            const r = el.getBoundingClientRect(); return (r.width === 0 && r.height === 0) || (r.width >= 43.5 && r.height >= 43.5);
          }),
          anchors: [...document.querySelectorAll('a[href^="#"]')].every(a => !!document.getElementById(a.hash.slice(1))),
          external: document.querySelectorAll('a[href^="http"],a[href^="tel:"],a[href^="mailto:"],iframe,img,video').length,
          form: document.querySelector('form')?.method,
          cards: document.querySelectorAll('[data-service-public-id]').length,
          composition: (() => {
            const search = document.querySelector('[class*="searchPanel"]');
            const workspace = document.querySelector('[class*="discoveryWorkspace"]');
            const filter = document.querySelector('[class*="filterRail"]');
            const results = document.querySelector('[class*="resultsSection"]');
            const cardGrid = document.querySelector('[data-directory-section="S5"] [class*="results"]');
            if (!search || !workspace || !filter || !results) return null;
            const searchBox = search.getBoundingClientRect();
            const workspaceBox = workspace.getBoundingClientRect();
            return {
              searchWorkspaceEdgeDelta: Math.max(
                Math.abs(searchBox.left - workspaceBox.left), Math.abs(searchBox.right - workspaceBox.right)),
              workspaceColumns: getComputedStyle(workspace).gridTemplateColumns.split(' ').length,
              cardColumns: cardGrid ? getComputedStyle(cardGrid).gridTemplateColumns.split(' ').length : 0,
              filterBeforeResults: !!(filter.compareDocumentPosition(results) & Node.DOCUMENT_POSITION_FOLLOWING),
            };
          })(),
          text: document.body.innerText,
        })`)
        const label = `${state}/${width}/${capability}`
        assert.equal(result.overflow, false, label)
        assert.equal(result.mainCount, 1, label)
        assert.equal(result.h1Count, 1, label)
        assert.deepEqual(result.sections, unavailable
          ? ['S1', 'S3', 'S4', 'S6', 'S7'] : ['S1', 'S3', 'S4', 'S5', 'S7'], label)
        if (capability !== 'no-css') assert.equal(result.targets, true, label)
        assert.equal(result.anchors, true, label)
        assert.equal(result.external, 0, label)
        assert.equal(result.form, 'get', label)
        assert.equal(result.cards, unavailable || loading ? 0 : 4, label)
        if (capability !== 'no-css') {
          assert.ok(result.composition, label)
          assert.ok(result.composition.searchWorkspaceEdgeDelta < 1, `${label}: search must span workspace`)
          assert.equal(result.composition.filterBeforeResults, true, `${label}: filter must precede results`)
          assert.equal(result.composition.workspaceColumns, width >= 1024 ? 2 : 1,
            `${label}: workspace columns`)
          if (!unavailable && !loading) {
            assert.equal(result.composition.cardColumns, width >= 768 || capability === 'print' ? 2 : 1,
              `${label}: service card columns`)
          }
        }
        assert.doesNotMatch(result.text, /Controlled preview only/u, label)
        assert.doesNotMatch(result.text, /Retired Synthetic Service|high-consequence statement that must never render/u, label)
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

  await navigate('controlled', 'no-js', 360, '?q=heart&group=synthetic-medicine')
  assert.equal(await evaluate("document.querySelectorAll('[data-service-public-id]').length"), 1)
  assert.match(await evaluate("document.body.innerText"), /Synthetic heart medicine/u)
  assert.equal(await evaluate("document.querySelector('#service-search-query').value"), 'heart')
  cases.push({ capability: 'no-js', state: 'searched-grouped', width: 360 })

  await navigate('controlled', 'default', 360, '?q=no-match')
  assert.match(await evaluate("document.body.innerText"), /No services match/u)
  assert.equal(await evaluate("document.querySelectorAll('[data-service-public-id]').length"), 0)
  cases.push({ capability: 'default', state: 'no-match', width: 360 })

  await navigate('controlled', 'default', 360, '?q=synthetic+urgent+review')
  assert.match(await evaluate("document.body.innerText"), /Emergency guidance must take priority/u)
  assert.match(await evaluate("document.body.innerText"), /does not assess medical urgency/u)
  assert.equal(await evaluate("document.querySelectorAll('[data-service-public-id]').length"), 0)
  cases.push({ capability: 'default', state: 'urgent-boundary', width: 360 })

  for (const [width, height, label] of [[375, 812, 'small-phone'], [667, 375, 'phone-landscape']]) {
    await navigate('controlled', 'default', width, '', height)
    const responsive = await evaluate(`({
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      targets: [...document.querySelectorAll('a[href],button,summary,label:has(input)')].filter(el => !el.closest('[hidden]')).every(el => {
        const r = el.getBoundingClientRect(); return (r.width === 0 && r.height === 0) || (r.width >= 43.5 && r.height >= 43.5);
      }),
      cards: document.querySelectorAll('[data-service-public-id]').length,
    })`)
    assert.equal(responsive.overflow, false, label)
    assert.equal(responsive.targets, true, label)
    assert.equal(responsive.cards, 4, label)
    cases.push({ capability: 'default', state: label, width })
  }

  // B04-012: copied links and native history retain canonical filter/query state.
  await navigate('controlled', 'default', 360, '?q=heart&group=synthetic-medicine')
  await send('Page.navigate', { url: `${server.origin}/?page=2` })
  await until("document.readyState === 'complete' && new URL(location.href).searchParams.get('page') === '2' && document.querySelectorAll('[data-service-public-id]').length === 4")
  const history = await send('Page.getNavigationHistory')
  await send('Page.navigateToHistoryEntry', { entryId: history.entries[history.currentIndex - 1].id })
  await until("document.querySelector('#service-search-query')?.value === 'heart'")
  assert.equal(await evaluate("document.querySelectorAll('[data-service-public-id]').length"), 1)
  await send('Page.navigateToHistoryEntry', { entryId: history.entries[history.currentIndex].id })
  await until("new URL(location.href).searchParams.get('page') === '2' && document.querySelectorAll('[data-service-public-id]').length === 4")
  cases.push({ capability: 'default', state: 'back-forward', width: 360 })

  await navigate('controlled', 'no-js', 320, '?q=mobility+term')
  const tree = await send('Accessibility.getFullAXTree')
  assert.ok(tree.nodes.some(node => !node.ignored && node.role?.value === 'heading' && /Synthetic rehabilitation care/u.test(node.name?.value ?? '')))
  assert.ok(tree.nodes.some(node => !node.ignored && node.role?.value === 'searchbox' && node.name?.value))
  assert.equal(await evaluate("document.querySelectorAll('[data-service-public-id]').length"), 1)
  cases.push({ capability: 'no-js', state: 'synonym-accessibility-tree', width: 320 })

  console.log(`Service-directory browser matrix passed: ${cases.length} responsive, capability, safety, isolation and GET-state cases.`)
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
