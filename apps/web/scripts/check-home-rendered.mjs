import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { request as httpRequest } from 'node:http'
import path from 'node:path'
import { createHomePreviewServer } from './lib/home-preview-server.mjs'
import { homeFixtureStates } from './lib/home-fixture.mjs'
import { homeContactFixtureStates } from './lib/home-contact-fixture.mjs'
import { homeGovernedFixtureStates } from './lib/home-governed-fixture.mjs'

const server = await createHomePreviewServer()
const profile = await mkdtemp(path.join(tmpdir(), 'hallelujah-home-browser-'))
const port = 20000 + randomBytes(2).readUInt16BE(0) % 30000
const contacts = process.argv.includes('--contacts')
const governed = process.argv.includes('--governed')
const captureRoot = path.resolve(new URL(`../../../docs/backlog/evidence/${governed ? 'b03-006' : contacts ? 'b03-005' : 'b03-004'}-artifacts/`, import.meta.url).pathname)
const capture = process.argv.includes('--capture')
if (capture) await mkdir(captureRoot, { recursive: true })
const browserPath = ['google-chrome-stable', 'google-chrome', '/snap/chromium/current/usr/lib/chromium-browser/chrome', 'chromium', 'chromium-browser']
  .find((candidate) => spawnSync(candidate, ['--version'], { encoding: 'utf8' }).status === 0)
assert.ok(browserPath, 'A Chromium browser is required')
const browser = spawn(browserPath, ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  '--no-first-run', '--no-default-browser-check', '--remote-debugging-address=127.0.0.1',
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' })
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
let socket
const cases = []
const requests = []
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
    if (result.exceptionDetails) throw new Error('Home browser evaluation failed')
    return result.result.value
  }
  const until = async (expression) => {
    for (let attempt = 0; attempt < 100; attempt++) {
      if (await evaluate(expression)) return
      await pause(30)
    }
    throw new Error(`Home condition timed out: ${expression}`)
  }
  const key = async (name = 'Enter', code = 13) => {
    const details = { key: name, code: name, windowsVirtualKeyCode: code, nativeVirtualKeyCode: code }
    await send('Input.dispatchKeyEvent', { type: 'keyDown', ...details, ...(name === 'Enter' ? { text: '\r', unmodifiedText: '\r' } : {}) })
    await send('Input.dispatchKeyEvent', { type: 'keyUp', ...details })
  }
  await send('Page.enable')
  await send('Runtime.enable')
  await send('Network.enable')
  await send('Network.setCacheDisabled', { cacheDisabled: true })
  let initId
  const navigate = async (state, capability = 'default', width = 320) => {
    if (initId) await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: initId })
    const { identifier } = await send('Page.addScriptToEvaluateOnNewDocument', { source: `
      if (navigator.connection) Object.defineProperty(navigator.connection, 'saveData', { get: () => ${capability === 'save-data'}, configurable: true });
      window.homeMetrics = { cls: 0, lcp: 0, longTasks: [] };
      new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) homeMetrics.cls += e.value; }).observe({type:'layout-shift',buffered:true});
      new PerformanceObserver(list => { for (const e of list.getEntries()) homeMetrics.lcp = e.startTime; }).observe({type:'largest-contentful-paint',buffered:true});
      new PerformanceObserver(list => { for (const e of list.getEntries()) homeMetrics.longTasks.push(e.duration); }).observe({type:'longtask',buffered:true});
    ` })
    initId = identifier
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false })
    await send('Emulation.setScriptExecutionDisabled', { value: capability === 'no-js' })
    await send('Emulation.setEmulatedMedia', { media: capability === 'print' ? 'print' : '',
      features: capability === 'forced-colors' ? [{ name: 'forced-colors', value: 'active' }]
        : capability === 'reduced-motion' ? [{ name: 'prefers-reduced-motion', value: 'reduce' }] : [] })
    await send('Network.setExtraHTTPHeaders', { headers: capability === 'save-data' ? { 'Save-Data': 'on' } : {} })
    await send('Network.setBlockedURLs', { urls: capability === 'images-fonts-blocked' ? ['*.png', '*.jpg', '*.woff', '*.woff2', '*.webm']
      : capability === 'no-css' ? ['*/home.css'] : [] })
    await send('Page.navigate', { url: state === 'static' ? server.origin : `${server.origin}/${state}` })
    await until(`document.readyState === 'complete' && !!document.querySelector('[data-home-template]') ${capability === 'no-js' ? '' : "&& document.documentElement.dataset.motionMediaEnhanced === 'true'"}`)
    if (capability.startsWith('200%-text')) await evaluate("document.documentElement.style.fontSize = '200%'")
    if (capability === '200%-text-wide-font') await evaluate("document.body.style.fontFamily = 'monospace'")
    await pause(45)
  }
  const captureOnly = process.argv.includes('--capture-only')
  const reviewStates = governed ? homeGovernedFixtureStates : contacts ? homeContactFixtureStates : homeFixtureStates
  for (const state of (process.argv.includes('--lifecycle-only') ? [] : captureOnly
    ? reviewStates.filter(state => (governed ? ['governed-current', 'governed-empty', 'governed-expired']
      : contacts ? ['contacts-current', 'contacts-missing', 'contacts-expired'] : ['static', 'hero', 'story']).includes(state)) : reviewStates))
    for (const width of (captureOnly ? [320, 1440] : [320, 360, 768, 1440]))
    for (const capability of (captureOnly ? ['no-js'] : ['default', 'no-js', 'reduced-motion', 'forced-colors', 'save-data', 'images-fonts-blocked', 'print', '200%-text', ...(contacts ? ['no-css', '200%-text-wide-font'] : [])])) {
      const requestStart = requests.length
      await navigate(state, capability, width)
      const result = await evaluate(`({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        overflowingElements: [...document.querySelectorAll('main *')].filter(el => {
          const r = el.getBoundingClientRect(); return r.width > 0 && r.right > innerWidth + 1;
        }).slice(0, 12).map(el => ({tag: el.tagName, className: el.className, width: el.getBoundingClientRect().width})),
        mainCount: document.querySelectorAll('main').length, h1Count: document.querySelectorAll('h1').length,
        taskCount: document.querySelector('[data-home-section="H2"] ul').children.length,
        targets: [...document.querySelectorAll('[data-action-link],[data-emergency-action],[data-media-play],[data-controlled-fixture="true"] a')].every(el => {
          const r = el.getBoundingClientRect(); return (r.width === 0 && r.height === 0) || (r.width >= 43.5 && r.height >= 43.5);
        }),
        safeMotion: [...document.querySelectorAll('[data-emergency-action], [data-home-destinations] section, [data-home-contact-state] section')].every(el => !el.closest('[data-experience-area]')),
        anchors: [...document.querySelectorAll('a[href]')].every(a => {
          const href = a.getAttribute('href');
          return href.startsWith('#') ? !!document.getElementById(a.hash.slice(1))
            : /^\\/(?:doctors|services)\\/[a-z0-9-]+\\/$/.test(href) && !!a.closest('[data-controlled-fixture="true"]');
        }),
        headingOrder: [...document.querySelectorAll('main h1,main h2,main h3')].map(el => Number(el.tagName[1])),
        videoSource: !!document.querySelector('video[src],track[src]'),
        accentEnabled: document.querySelector('[data-motion-accent]').dataset.motionEnabled,
        text: document.body.innerText,
        languageReason: (() => {
          const unavailable = document.querySelector('[data-language-switcher] [aria-disabled="true"]');
          return document.getElementById(unavailable?.getAttribute('aria-describedby'))?.textContent.trim();
        })(),
        hasFields: !!document.querySelector('form,input,iframe'),
        contactState: document.querySelector('[data-home-contact-state]')?.dataset.homeContactState,
        contactFacts: [...document.querySelectorAll('[data-home-contact-fact]')].map(el => ({key: el.dataset.homeContactFact, label: el.querySelector('dt').innerText, value: el.querySelector('dd').innerText})),
        metrics: window.homeMetrics ?? null,
      })`)
      const label = `${state}/${width}/${capability}`
      assert.equal(result.overflow, false, `${label}: ${JSON.stringify(result.overflowingElements)}`)
      assert.equal(result.mainCount, 1, label)
      assert.equal(result.h1Count, 1, label)
      assert.equal(result.taskCount, 5, label)
      if (capability !== 'no-css') assert.equal(result.targets, true, label)
      assert.equal(result.safeMotion, true, label)
      assert.equal(result.anchors, true, label)
      assert.equal(result.videoSource, false, label)
      assert.equal(result.hasFields, false, label)
      assert.equal(result.headingOrder[0], 1, label)
      assert.ok(result.headingOrder.slice(1).every((level, index) => level <= result.headingOrder[index] + 1), label)
      assert.match(result.text, /Online appointment requests are unavailable/u)
      if ((contacts && ['contacts-current', 'contacts-updated'].includes(state)) || governed) {
        assert.equal(result.contactState, 'controlled-fixture', label)
        assert.match(result.text, /Synthetic contact fixture/u)
        const enquiry = result.contactFacts.find(fact => fact.key === 'publicPhone')
        assert.equal(enquiry.label, 'Public enquiry phone', label)
        assert.equal(enquiry.value, state === 'contacts-updated' ? '+1 (202) 555-0199' : '+1 (202) 555-0101', label)
        for (const id of ['publicPhone', 'emergencyPhone', 'switchboardPhone', 'ambulancePhone', 'address', 'publicEntrance', 'accessibleEntrance']) {
          assert.ok(result.contactFacts.some(fact => fact.key === id), label + '/' + id)
        }
      } else {
        assert.match(result.text, /Telephone contact information is unavailable/u)
        if (contacts) {
          assert.equal(result.contactState, 'unavailable', label)
          assert.equal(result.contactFacts.length, 0, label)
          assert.doesNotMatch(result.text, /555|hospital\.invalid|Synthetic address/u)
        }
      }
      assert.match(result.languageReason, /This page is unavailable in Amharic/u)
      if (governed) {
        const sections = await evaluate(`[...document.querySelectorAll('[data-home-governed-section]')].map(el => el.dataset.homeGovernedSection)`)
        const expected = ({
          'governed-current': ['services', 'doctors', 'institutional'],
          'governed-doctor-only': ['doctors'],
          'governed-service-only': ['services'],
          'governed-institution-only': ['institutional'],
        })[state] ?? []
        assert.deepEqual(sections, expected, label)
        if (state === 'governed-current') {
          assert.match(result.text, /Synthetic featured services/u)
          assert.match(result.text, /Synthetic featured clinicians/u)
          assert.match(result.text, /Synthetic institutional evidence/u)
          assert.equal(await evaluate(`document.querySelectorAll('[data-card-state="current"]').length`), 2, label)
        } else if (!expected.length) {
          assert.doesNotMatch(result.text, /Browse care by need|Synthetic featured clinicians|About the hospital/u, label)
        }
      }
      if (['no-js', 'reduced-motion', 'save-data'].includes(capability)) assert.equal(result.accentEnabled, 'false', label)
      assert.ok(!requests.slice(requestStart).some((url) => /\.(?:webm|vtt)(?:\?|$)/u.test(url)), label)
      if (capability !== 'print') {
        await evaluate("document.querySelector('[data-skip-link]').focus()")
        await key()
        assert.equal(await evaluate("document.activeElement.id === 'main-content'"), true, label)
      }
      for (const id of ['emergency', 'doctor', 'service', 'appointment', 'call', 'directions']) {
        await evaluate(`document.querySelector('[data-home-template] a[href="#home-${id}"]').focus()`)
        await key()
        assert.equal(await evaluate(`location.hash === '#home-${id}' && document.activeElement.id === 'home-${id}'`), true, label + '/' + id)
      }
      await evaluate('scrollTo(0,0)')
      if (capture && capability === 'no-js' && [320, 1440].includes(width)
        && (governed ? ['governed-current', 'governed-empty', 'governed-expired']
          : contacts ? ['contacts-current', 'contacts-missing', 'contacts-expired'] : ['static', 'hero', 'story']).includes(state)) {
        // Allow native anchor scrolling to paint before requesting the full document.
        await pause(150)
        const { cssContentSize } = await send('Page.getLayoutMetrics')
        const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
          clip: { x: 0, y: 0, width: cssContentSize.width, height: cssContentSize.height, scale: 1 } })
        await writeFile(path.join(captureRoot, `${state}-${width}-no-js.png`), Buffer.from(shot.data, 'base64'))
      }
      cases.push({ state, width, capability, passed: true, metrics: result.metrics })
    }

  if (contacts) {
    for (const state of ['contacts-current', 'contacts-updated', 'contacts-expired', 'contacts-withdrawn']) {
      await navigate(state)
      const tree = await send('Accessibility.getFullAXTree')
      const nodes = tree.nodes.filter(node => !node.ignored)
      assert.ok(nodes.some(node => node.role?.value === 'heading' && node.name?.value === 'Call and contact information'))
      assert.ok(nodes.some(node => node.role?.value === 'link' && node.name?.value === 'Call the hospital'))
      const body = await evaluate('document.body.innerText')
      if (state === 'contacts-updated') { assert.match(body, /555-0199/u); assert.doesNotMatch(body, /555-0101/u) }
      if (['contacts-expired', 'contacts-withdrawn'].includes(state)) assert.doesNotMatch(body, /555|hospital\.invalid/u)
      cases.push({ state, capability: 'updated-lifecycle-accessibility-tree', passed: true })
    }
    await navigate('contacts-current')
    await send('Emulation.setTouchEmulationEnabled', { enabled: true })
    await evaluate(`document.querySelector('[data-home-template] a[href="#home-directions"]').scrollIntoView({block:'center'})`)
    const point = await evaluate(`(() => { const r = document.querySelector('[data-home-template] a[href="#home-directions"]').getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`)
    await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...point, radiusX: 1, radiusY: 1, force: 1, id: 1 }] })
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await until(`location.hash === '#home-directions'`)
    assert.match(await evaluate('document.getElementById("home-directions").innerText'), /Synthetic accessible entrance/u)
    cases.push({ state: 'contacts-current', capability: 'emulated-touch-directions', passed: true })
    await send('Emulation.setTouchEmulationEnabled', { enabled: false })
    assert.equal((await fetch(`${server.origin}/contacts-current`)).headers.get('cache-control'), 'no-store')
  }
  if (governed) {
    await navigate('governed-current')
    const tree = await send('Accessibility.getFullAXTree')
    const nodes = tree.nodes.filter(node => !node.ignored)
    for (const heading of ['Browse care by need', 'Find a doctor', 'About the hospital']) {
      assert.ok(nodes.some(node => node.role?.value === 'heading' && node.name?.value === heading), heading)
    }
    const canonicalPaths = await evaluate(`[...document.querySelectorAll('[data-controlled-fixture="true"] a')].map(a => a.getAttribute('href'))`)
    assert.equal(canonicalPaths.length, 2)
    for (const canonicalPath of canonicalPaths) {
      assert.equal((await fetch(server.origin + canonicalPath)).status, 404)
    }
    await evaluate(`document.querySelector('[data-controlled-fixture="true"] a').focus()`)
    assert.equal(await evaluate(`document.activeElement.matches('[data-controlled-fixture="true"] a')`), true)
    await navigate('governed-empty')
    assert.equal(await evaluate(`document.querySelectorAll('[data-home-governed-section]').length`), 0)
    cases.push({ state: 'governed-current', capability: 'accessibility-tree-canonical-paths-keyboard', passed: true })
  }
  for (const capability of (contacts || governed ? [] : ['default', 'no-js'])) {
    await navigate('static', capability)
    await evaluate("document.querySelector('[data-menu-trigger]').focus()")
    await key()
    await until("document.querySelector('[data-navigation-panel]').matches(':popover-open')")
    await evaluate("document.querySelector('[data-language-switcher] summary').focus()")
    await key()
    await until("document.querySelector('[data-language-switcher]').open")
    assert.ok(await evaluate("document.querySelector('[data-language-switcher] [aria-disabled]').getBoundingClientRect().height >= 44"))
    assert.ok(await evaluate("document.querySelector('[data-language-switcher] p').getBoundingClientRect().height > 0"))
    await key(capability === 'no-js' ? 'Enter' : 'Escape', capability === 'no-js' ? 13 : 27)
    await until("!document.querySelector('[data-language-switcher]').open")
    assert.ok(await evaluate("document.activeElement.matches('[data-language-switcher] summary')"))
    await key('Escape', 27)
    await until("!document.querySelector('[data-navigation-panel]').matches(':popover-open')")
    if (capability === 'default') assert.equal(await evaluate("document.activeElement.matches('[data-menu-trigger]')"), true)
    cases.push({ capability, state: 'compact-menu-language-keyboard', passed: true })
  }
  for (const state of (contacts || governed ? [] : ['hero', 'story'])) {
    await navigate(state)
    const geometry = await evaluate("({frame: document.querySelector('[data-media-state]').getBoundingClientRect().height, tasks: document.querySelector('[data-home-section=\"H2\"]').offsetTop})")
    await evaluate("document.querySelector('[data-media-play]').focus()")
    await key()
    await until("document.querySelector('[data-media-state]').dataset.mediaState === 'playing'")
    const playingGeometry = await evaluate("({frame: document.querySelector('[data-media-state]').getBoundingClientRect().height, tasks: document.querySelector('[data-home-section=\"H2\"]').offsetTop})")
    assert.deepEqual(playingGeometry, geometry, 'Media activation cannot move the frame or essential tasks')
    await key()
    await until("document.querySelector('[data-media-state]').dataset.mediaState === 'paused'")
    assert.equal(await evaluate("document.activeElement.matches('[data-media-play]')"), true)
    await key()
    await until("document.querySelector('[data-media-state]').dataset.mediaState === 'playing'")
    await evaluate("document.querySelector('[data-media-stop]').focus()")
    await key()
    await until("document.querySelector('[data-media-state]').dataset.mediaState === 'poster'")
    assert.equal(await evaluate("document.activeElement.matches('[data-media-play]') && !document.querySelector('video').hasAttribute('src') && !document.querySelector('track').hasAttribute('src')"), true)
    await key()
    await until("document.querySelector('[data-media-state]').dataset.mediaState === 'ended'")
    await key()
    await until("document.querySelector('[data-media-state]').dataset.mediaState === 'playing'")
    // Browser history retains the destination and does not resume playback on restoration.
    await send('Page.navigate', { url: `${server.origin}/static` })
    await until(`location.pathname === '/static' && document.readyState === 'complete' && document.querySelector('[data-home-media]') === null`)
    await evaluate('history.back()')
    await until(`location.pathname === '/${state}' && document.readyState === 'complete'`)
    assert.equal(await evaluate("document.querySelector('[data-media-state]').dataset.mediaState !== 'playing' && !document.querySelector('video').hasAttribute('src')"), true)
    cases.push({ state, capability: 'play-pause-resume-stop-end-history', passed: true })
  }
  if (!contacts && !governed) {
    await navigate('media-failure')
    await evaluate("document.querySelector('[data-media-play]').focus()")
    await key()
    await until("document.querySelector('[data-media-state]').dataset.mediaState === 'failed'")
    assert.equal(await evaluate("!document.querySelector('[data-media-poster]').hidden && !document.querySelector('[data-media-status]').hidden && document.activeElement.matches('[data-media-play]')"), true)
    cases.push({ state: 'media-failure', capability: 'keyboard-activation-recovery', passed: true })
  }

  for (const pathName of ['/?q=private-review', '/admin', '/appointments/', '//external.invalid/']) {
    const response = await fetch(server.origin + pathName)
    assert.ok(response.status >= 400)
  }
  assert.equal((await fetch(server.origin, { method: 'POST', body: 'rejected' })).status, 405)
  const rejectedHostStatus = await new Promise((resolve, reject) => {
    const request = httpRequest(server.origin, { headers: { Host: 'external.invalid' } }, (response) => {
      response.resume(); resolve(response.statusCode)
    })
    request.once('error', reject)
    request.end()
  })
  assert.equal(rejectedHostStatus, 403)
  for (const sample of Object.values(server.samples)) {
    assert.ok(sample.javascriptGzipBytes <= 150 * 1024)
    assert.ok(sample.initialGzipBytes <= 1024 * 1024)
    assert.ok(sample.initialRequests <= 50)
  }
  // Native video controls expose inline image events through CDP. They open no connection.
  const allowedRequest = (url) => url.startsWith(server.origin + '/') || url.startsWith('data:image/')
  assert.ok(requests.every(allowedRequest),
    `No external request may occur: ${JSON.stringify(requests.filter((url) => !allowedRequest(url))
      .map((value) => ({ protocol: new URL(value).protocol, origin: new URL(value).origin,
        ...(value.startsWith('data:') ? { mime: value.slice(5).split(/[,;]/u)[0] } : {}) })))}`)
  const mediaBytes = await readFile(new URL('../public/fixtures/b01-012-abstract-motion.webm', import.meta.url))
  const captionBytes = await readFile(new URL('../public/fixtures/b01-012-abstract-motion.vtt', import.meta.url))
  const report = { ticket: governed ? 'B03-006' : contacts ? 'B03-005' : 'B03-004', scope: 'Isolated controlled Home T0; not deployed-route or language/AT acceptance',
    cases, samples: server.samples, activatedMediaRequests: server.requestLog.filter((url) => /\.(webm|vtt)$/u.test(url)),
    activatedMedia: contacts || governed ? null : { bytes: mediaBytes.byteLength, captionBytes: captionBytes.byteLength, durationSeconds: 2,
      posterAssetBytes: 0, kind: 'abstract informative test film, no hospital people/facilities', provider: 'none' },
    externalRequests: 0, inlineImageEvents: requests.filter((url) => url.startsWith('data:image/')).length,
    forbiddenRequestControls: 6, reflowBasis: '320 CSS px also covers 1280 px at 400% zoom equivalent',
    metricsBasis: 'Local Chromium samples only; no constrained-device LCP/INP or motion long-task attribution is claimed' }
  if (capture) await writeFile(path.join(captureRoot, captureOnly ? 'capture-report.json' : 'browser-report.json'), JSON.stringify(report, null, 2) + '\n')
  console.log(governed
    ? `Home governed-content browser matrix passed: ${cases.length} cases, canonical card paths, responsive whole-section omissions and zero external requests.`
    : contacts
    ? `Home contact browser matrix passed: ${cases.length} cases, native keyboard, lifecycle/accessibility tree, emulated touch, no external requests or callable targets.`
    : `Home browser matrix passed: ${cases.length} cases, native task/skip/menu keyboard, media lifecycle/failure/history, zero pre-intent/external media requests.`)
} finally {
  socket?.close()
  browser.kill('SIGTERM')
  await Promise.race([new Promise((resolve) => browser.once('exit', resolve)), pause(2000)])
  if (browser.exitCode === null && browser.signalCode === null) browser.kill('SIGKILL')
  await server.close()
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
}
