// Capture current React templates through their controlled preview adapters.
// Screenshots record appearance; this runner does not certify visual acceptance.
import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

const previews = [
  ['home', 'home', 'createHomePreviewServer', 'static'],
  ['emergency', 'emergency', 'createEmergencyPreviewServer', 'controlled'],
  ['appointment', 'appointment-page', 'createAppointmentPagePreviewServer', 'controlled'],
  ['clinician-directory', 'clinician-directory', 'createClinicianDirectoryPreviewServer', 'controlled'],
  ['clinician-profile', 'clinician-profile', 'createClinicianProfilePreviewServer', 'controlled'],
  ['service-directory', 'service-directory', 'createServiceDirectoryPreviewServer', 'controlled'],
]
if (process.env.VISUAL_CAPTURE_ORIGIN) {
  const origin = new URL(process.env.VISUAL_CAPTURE_ORIGIN)
  assert.ok(['localhost', '127.0.0.1'].includes(origin.hostname), 'Application captures require loopback')
  previews.push(['bootstrap', undefined, undefined, ''])
}
const captureRoot = path.resolve(process.argv[2] ?? 'docs/backlog/evidence/visual-direction-baseline-2026-10-08')
const selected = process.argv[3]
const widths = (process.env.VISUAL_CAPTURE_WIDTHS ?? '360,1440').split(',').map(Number)
assert.ok(widths.every(width => Number.isInteger(width) && width >= 320), 'Invalid capture width')
// Each renderer owns a CSS-module registry. Isolate it from Node's module cache.
if (!selected) {
  const reports = []
  for (const [name] of previews) {
    const result = spawnSync(process.execPath, [import.meta.filename, captureRoot, name], { stdio: 'inherit' })
    assert.equal(result.status, 0, `${name}: capture failed`)
    reports.push(JSON.parse(await readFile(path.join(captureRoot, `${name}-report.json`), 'utf8')))
  }
  await writeFile(path.join(captureRoot, 'capture-report.json'), JSON.stringify({
    ...reports[0], captures: reports.flatMap(report => report.captures),
  }, null, 2) + '\n')
  process.exit(0)
}
assert.ok(previews.some(([name]) => name === selected), 'Unknown template')
const profile = await mkdtemp(path.join(tmpdir(), 'hallelujah-visual-baseline-'))
const port = 20000 + randomBytes(2).readUInt16BE(0) % 30000
await mkdir(captureRoot, { recursive: true })
const browserPath = ['google-chrome-stable', 'google-chrome', '/snap/chromium/current/usr/lib/chromium-browser/chrome', 'chromium', 'chromium-browser']
  .find((candidate) => spawnSync(candidate, ['--version'], { encoding: 'utf8' }).status === 0)
assert.ok(browserPath, 'A Chromium browser is required')
const browser = spawn(browserPath, ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  '--no-first-run', '--no-default-browser-check', '--remote-debugging-address=127.0.0.1',
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' })
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
let socket
const requests = []
const captures = []
let server
try {
  let endpoint
  for (let attempt = 0; attempt < 100; attempt++) {
    try { endpoint = (await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()).webSocketDebuggerUrl; break }
    catch { if (browser.exitCode !== null || browser.signalCode !== null) throw new Error('Browser failed to start'); await pause(100) }
  }
  assert.ok(endpoint, 'DevTools startup timed out')
  socket = new WebSocket(endpoint)
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true })
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
    if (result.exceptionDetails) throw new Error('Visual baseline evaluation failed')
    return result.result.value
  }
  const until = async (expression) => {
    for (let attempt = 0; attempt < 100; attempt++) {
      if (await evaluate(expression)) return
      await pause(30)
    }
    throw new Error(`Visual baseline condition timed out: ${expression}`)
  }
  await send('Page.enable')
  await send('Runtime.enable')
  await send('Network.enable')
  await send('Network.setCacheDisabled', { cacheDisabled: true })
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  for (const [name, module, factory, state] of previews.filter(([name]) => name === selected)) {
    server = name === 'bootstrap'
      ? { origin: process.env.VISUAL_CAPTURE_ORIGIN, close: async () => {} }
      : await (await import(`./lib/${module}-preview-server.mjs`))[factory]()
    for (const width of widths) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false })
      const fixtureState = process.env.VISUAL_CAPTURE_STATE ?? state
      const url = `${server.origin}/${fixtureState}`
      const requestStart = requests.length
      await send('Page.navigate', { url })
      await until(`document.readyState === 'complete' && !!document.querySelector('main h1') && location.href === ${JSON.stringify(url)}`)
      await send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true })
      assert.ok(await evaluate("parseFloat(getComputedStyle(document.querySelector('header svg')).width) <= 32"), 'Shell CSS did not load')
      await pause(150)
      const geometry = await evaluate(`({
        viewport: innerWidth, documentWidth: document.documentElement.scrollWidth,
        headerHeight: document.querySelector('header')?.getBoundingClientRect().height,
        h1Count: document.querySelectorAll('h1').length,
        mainCount: document.querySelectorAll('main').length,
        footerBackground: getComputedStyle(document.querySelector('footer')).backgroundColor,
        homeComposition: document.querySelector('[data-home-template]') ? {
          heroColumns: getComputedStyle(document.querySelector('[data-home-section="H1"]')).gridTemplateColumns,
          taskColumns: getComputedStyle(document.querySelector('[data-home-section="H2"] ul')).gridTemplateColumns,
          tasks: [...document.querySelectorAll('[data-task-card]')].map(element => {
            const box = element.getBoundingClientRect();
            const cue = element.querySelector('[data-icon="arrow-right"]').getBoundingClientRect();
            return { x: box.x, y: box.y, width: box.width, height: box.height,
              cueBottom: cue.bottom, cueContained: cue.x >= box.x && cue.right <= box.right && cue.bottom <= box.bottom };
          }),
        } : undefined,
        clinicianDirectoryComposition: document.querySelector('[data-clinician-directory-template]') ? (() => {
          const search = document.querySelector('[class*="searchPanel"]').getBoundingClientRect();
          const workspace = document.querySelector('[class*="discoveryWorkspace"]').getBoundingClientRect();
          const filter = document.querySelector('[class*="filterRail"]');
          const results = document.querySelector('[class*="resultsSection"]');
          return {
            searchWorkspaceEdgeDelta: Math.max(Math.abs(search.left - workspace.left), Math.abs(search.right - workspace.right)),
            workspaceColumns: getComputedStyle(document.querySelector('[class*="discoveryWorkspace"]')).gridTemplateColumns,
            resultColumns: getComputedStyle(document.querySelector('[data-directory-section="D4"]')).gridTemplateColumns,
            filterBeforeResults: !!(filter.compareDocumentPosition(results) & Node.DOCUMENT_POSITION_FOLLOWING),
          };
        })() : undefined,
        serviceDirectoryComposition: document.querySelector('[data-service-directory-template]') ? (() => {
          const search = document.querySelector('[class*="searchPanel"]').getBoundingClientRect();
          const workspace = document.querySelector('[class*="discoveryWorkspace"]').getBoundingClientRect();
          const filter = document.querySelector('[class*="filterRail"]');
          const results = document.querySelector('[class*="resultsSection"]');
          return {
            searchWorkspaceEdgeDelta: Math.max(Math.abs(search.left - workspace.left), Math.abs(search.right - workspace.right)),
            workspaceColumns: getComputedStyle(document.querySelector('[class*="discoveryWorkspace"]')).gridTemplateColumns,
            resultColumns: [...document.querySelectorAll('[data-directory-section="S5"] [class*="results"]')]
              .map(element => getComputedStyle(element).gridTemplateColumns),
            filterBeforeResults: !!(filter.compareDocumentPosition(results) & Node.DOCUMENT_POSITION_FOLLOWING),
          };
        })() : undefined,
        clinicianProfileComposition: document.querySelector('[data-clinician-profile-template]') ? (() => {
          const layout = document.querySelector('[data-profile-content-layout]');
          const request = document.querySelector('[data-profile-section="P4"]');
          const related = document.querySelector('[data-profile-section="P5"]');
          const review = document.querySelector('[data-profile-section="P6"]');
          const support = document.querySelector('[data-profile-section="P7"]');
          return {
            contentColumns: layout ? getComputedStyle(layout).gridTemplateColumns : null,
            requestAfterEditorial: !!document.querySelector('[data-profile-section="P3"]')
              && !!(document.querySelector('[data-profile-section="P3"]').compareDocumentPosition(request) & Node.DOCUMENT_POSITION_FOLLOWING),
            relatedWidth: related?.getBoundingClientRect().width,
            reviewSupportGap: review && support ? support.getBoundingClientRect().top - review.getBoundingClientRect().bottom : null,
          };
        })() : undefined,
        shellControls: [...document.querySelectorAll('[data-shell-identity], [data-menu-trigger], [data-shell-emergency], [data-navigation-panel]')].map(element => {
          const box = element.getBoundingClientRect();
          return { marker: Object.keys(element.dataset)[0], x: box.x, y: box.y, width: box.width, height: box.height };
        }),
      })`)
      const { cssContentSize } = await send('Page.getLayoutMetrics')
      const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
        clip: { x: 0, y: 0, width: cssContentSize.width, height: cssContentSize.height, scale: 1 } })
      const file = `${name}-${width}.png`
      await writeFile(path.join(captureRoot, file), Buffer.from(shot.data, 'base64'))
      if (name === 'bootstrap') {
        const header = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false,
          clip: { x: 0, y: 0, width: cssContentSize.width, height: 360, scale: 1 } })
        await writeFile(path.join(captureRoot, `${name}-${width}-header.png`), Buffer.from(header.data, 'base64'))
      }
      const externalRequests = requests.slice(requestStart).filter(url => !url.startsWith(server.origin) && /^https?:/u.test(url)).length
      assert.equal(externalRequests, 0, `${name}/${width}: external request`)
      assert.equal(geometry.h1Count, 1, `${name}/${width}: missing template`)
      assert.equal(geometry.mainCount, 1, `${name}/${width}: main landmark`)
      assert.ok(geometry.documentWidth <= width, `${name}/${width}: horizontal overflow`)
      if (geometry.homeComposition) {
        assert.equal(geometry.homeComposition.tasks.length, 5, 'Home task card count');
        assert.ok(geometry.homeComposition.tasks.every(task => task.cueContained), 'Home task cue escaped its card');
        const rows = Map.groupBy(geometry.homeComposition.tasks, task => Math.round(task.y));
        for (const row of rows.values()) {
          assert.ok(Math.max(...row.map(task => task.cueBottom)) - Math.min(...row.map(task => task.cueBottom)) < 1,
            'Home task cues lost row alignment');
        }
      }
      if (geometry.clinicianDirectoryComposition) {
        assert.ok(geometry.clinicianDirectoryComposition.searchWorkspaceEdgeDelta < 1,
          'Clinician search does not span the discovery workspace');
        assert.equal(geometry.clinicianDirectoryComposition.filterBeforeResults, true,
          'Clinician filter rail must precede results in source order');
      }
      if (geometry.serviceDirectoryComposition) {
        assert.ok(geometry.serviceDirectoryComposition.searchWorkspaceEdgeDelta < 1,
          'Service search does not span the discovery workspace');
        assert.equal(geometry.serviceDirectoryComposition.filterBeforeResults, true,
          'Service group rail must precede results in source order');
      }
      captures.push({ file, state: fixtureState, width, height: cssContentSize.height, ...geometry, externalRequests })
      if (process.env.VISUAL_CAPTURE_SHELL_CHECK === '1') {
        if (name === 'bootstrap' && width >= 1280) assert.ok(geometry.headerHeight < 110, 'Application header lost compact composition')
        const key = async (value, code) => {
          await send('Input.dispatchKeyEvent', { type: 'keyDown', key: value, code: value, windowsVirtualKeyCode: code, nativeVirtualKeyCode: code, ...(value === 'Enter' ? { text: '\r', unmodifiedText: '\r' } : {}) });
          await send('Input.dispatchKeyEvent', { type: 'keyUp', key: value, code: value, windowsVirtualKeyCode: code });
        }
        const compact = await evaluate("document.querySelector('[data-menu-trigger]').getBoundingClientRect().width > 0")
        if (compact) {
          await evaluate("document.querySelector('[data-menu-trigger]').focus()")
          await key('Enter', 13)
          await until("document.querySelector('[data-navigation-panel]').matches(':popover-open')")
        }
        await evaluate("document.querySelector('[data-language-switcher] summary').focus()")
        await key('Enter', 13)
        await until("document.querySelector('[data-language-switcher]').open")
        assert.ok(await evaluate(`(() => {
          const box = document.querySelector('[data-language-switcher] [role="group"]').getBoundingClientRect();
          return box.width > 0 && box.x >= 0 && box.right <= innerWidth && box.y >= 0;
        })()`), `${name}/${width}: language disclosure outside viewport`)
        if ([360, 1440].includes(width)) {
          const shot = await send('Page.captureScreenshot', { format: 'png' })
          await writeFile(path.join(captureRoot, `${name}-${width}-language.png`), Buffer.from(shot.data, 'base64'))
        }
        await key('Escape', 27)
        await until("!document.querySelector('[data-language-switcher]').open")
        assert.ok(await evaluate("document.activeElement.matches('[data-language-switcher] summary')"), 'Language Escape restores focus')
        if (compact) {
          await key('Escape', 27)
          await until("!document.querySelector('[data-navigation-panel]').matches(':popover-open')")
        }
        captures.at(-1).shellKeyboard = 'Menu/Language Enter, Escape, focus restoration passed'
      }
      console.log(`Captured ${file}`)
    }
    await server.close()
    server = undefined
  }
  const version = await sendRaw('Browser.getVersion')
  await writeFile(path.join(captureRoot, `${selected}-report.json`), JSON.stringify({
    sourceRevision: spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim(),
    sourceState: spawnSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).stdout.trim() ? 'working-tree' : 'committed',
    browser: version.product, javascript: 'enabled', motion: 'reduced', deviceScaleFactor: 1,
    scope: 'Controlled local preview adapters; appearance baseline only', captures,
  }, null, 2) + '\n')
} finally {
  socket?.close()
  browser.kill('SIGTERM')
  await Promise.race([new Promise(resolve => browser.once('exit', resolve)), pause(2000)])
  if (browser.exitCode === null && browser.signalCode === null) browser.kill('SIGKILL')
  await server?.close()
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
}
