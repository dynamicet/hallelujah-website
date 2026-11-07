import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Run against the existing local demo: pnpm dev, then pnpm --dir apps/web patient-guide:smoke.
const origin = process.env.GUIDE_ORIGIN ?? 'http://localhost:3000'
const capture = path.resolve(process.env.GUIDE_EVIDENCE_DIR ?? fileURLToPath(new URL('../../../artifacts/patient-guide/', import.meta.url)))
await mkdir(capture, { recursive: true })
const profile = await mkdtemp(path.join(tmpdir(), 'hallelujah-guide-browser-'))
const executable = [process.env.CHROME_PATH, '/snap/chromium/current/usr/lib/chromium-browser/chrome', 'chromium', 'google-chrome'].find((candidate) => candidate && spawnSync(candidate, ['--version']).status === 0)
assert.ok(executable, 'Chromium is required')
const browser = spawn(executable, ['--headless=new', '--no-first-run', '--no-default-browser-check', '--disk-cache-size=16777216', '--media-cache-size=16777216', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] })
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
let socket
try {
  const endpoint = await new Promise((resolve, reject) => {
    let output = ''
    const timer = setTimeout(() => reject(new Error(`Browser startup timed out: ${output.slice(-500)}`)), 15000)
    browser.stderr.on('data', (chunk) => {
      output += chunk
      const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/u)
      if (match) { clearTimeout(timer); resolve(match[1]) }
    })
    browser.on('exit', () => { clearTimeout(timer); reject(new Error(output.slice(-1000))) })
  })
  socket = new WebSocket(endpoint)
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }) })
  const pending = new Map()
  const errors = []
  const requests = []
  let id = 0
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data)
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text)
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push(message.params.args.map((arg) => arg.value ?? arg.description).join(' '))
    if (message.method === 'Network.requestWillBeSent') requests.push(message.params.request)
    const operation = pending.get(message.id)
    if (operation) {
      pending.delete(message.id)
      clearTimeout(operation.timer)
      if (message.error) operation.reject(new Error(message.error.message))
      else operation.resolve(message.result)
    }
  })
  function raw(method, params = {}, sessionId) {
    const messageId = ++id
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { pending.delete(messageId); reject(new Error(`${method} timed out`)) }, 15000)
      pending.set(messageId, { resolve, reject, timer })
      socket.send(JSON.stringify({ id: messageId, method, params, ...(sessionId ? { sessionId } : {}) }))
    })
  }
  const { targetId } = await raw('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await raw('Target.attachToTarget', { targetId, flatten: true })
  await raw('Target.activateTarget', { targetId })
  const send = (method, params = {}) => raw(method, params, sessionId)
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }).catch((error) => { throw new Error(`${error.message}: ${expression.slice(0, 180)}`) })
    if (result.exceptionDetails) throw new Error(`Evaluation failed: ${result.exceptionDetails.exception?.description ?? expression}`)
    return result.result.value
  }
  const until = async (expression) => {
    for (let attempt = 0; attempt < 200; attempt++) { if (await evaluate(expression)) return; await pause(50) }
    throw new Error(`Condition timed out: ${expression}`)
  }
  await send('Page.enable')
  await send('Runtime.enable')
  await send('Network.enable')
  async function navigate(route, width = 1440, height = 900) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 })
    await send('Page.navigate', { url: origin + route })
    await until("document.readyState === 'complete' && !!document.querySelector('[data-open-patient-guide]')")
    await pause(400)
  }
  async function open() {
    await evaluate("document.querySelector('[data-help-trigger]').click()")
    await pause(100)
    await evaluate("document.querySelector('[data-open-patient-guide]').click()")
    await until("document.querySelector('[data-patient-guide]').open")
  }
  async function ask(question) {
    const count = await evaluate("document.querySelectorAll('[data-guide-turn]').length")
    await evaluate("document.querySelector('[data-guide-input]').focus()")
    await send('Input.insertText', { text: question })
    await evaluate("document.querySelector('[data-patient-guide] form').requestSubmit()")
    await until(`document.querySelectorAll('[data-guide-turn]').length === ${count + 1}`)
    await pause(50)
  }
  async function shot(name) {
    const result = await send('Page.captureScreenshot', { format: 'png' })
    await writeFile(path.join(capture, `${name}.png`), Buffer.from(result.data, 'base64'))
  }
  if (process.argv.includes('--help-clearance')) {
    const journeys = [
      '/', '/doctors', '/doctors/synthetic-clinician-101010101010',
      '/services', '/services/synthetic-service-111111111111',
      '/patients-visitors', '/appointment', '/appointment?demo=validation', '/emergency', '/feedback', '/referrals',
      '/health-topics', '/health-topics/diabetes',
      '/news-resources', '/news-resources/make-room-for-your-questions',
    ]
    const clearance = []
    for (const [width, height] of [[1440, 900], [768, 1024], [390, 844]]) {
      for (const route of journeys) {
        console.log(`Checking Help: ${route} at ${width}px`)
        await navigate(route, width, height)
        assert.equal(await evaluate("!!document.querySelector('main h1')"), true, `page loaded: ${route}`)
        const result = await evaluate(`(async () => {
          document.documentElement.style.scrollBehavior = 'auto';
          const trigger = document.querySelector('[data-help-trigger]');
          const widget = document.querySelector('[data-help-widget]');
          const header = document.querySelector('[data-site-header]');
          const collisions = [];
          let positions = 0, focused = 0, collapsed = 0;
          const visible = () => getComputedStyle(trigger).visibility !== 'hidden';
          const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
          for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * .7) {
            scrollTo(0, y);
            await new Promise(resolve => setTimeout(resolve, 60));
            positions++;
            if (!visible()) { collapsed++; continue; }
            const t = trigger.getBoundingClientRect(), h = header.getBoundingClientRect();
            for (const node of document.querySelectorAll('main :is(h1, h2, h3, p, a, button, input, select, textarea, summary, [role="alert"])')) {
              const r = node.getBoundingClientRect();
              if (r.width && r.height && r.top >= Math.max(0, h.bottom) && r.bottom <= innerHeight && overlaps(t, r)) collisions.push(node.textContent.slice(0, 60));
            }
          }
          for (const node of document.querySelectorAll('main :is(a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), summary)')) {
            if (!node.getClientRects().length) continue;
            node.focus({ preventScroll: true });
            node.scrollIntoView({ block: 'center', behavior: 'instant' });
            await new Promise(resolve => setTimeout(resolve, 60));
            focused++;
            if (visible() && overlaps(trigger.getBoundingClientRect(), node.getBoundingClientRect())) collisions.push('focused: ' + (node.getAttribute('aria-label') || node.textContent || node.tagName).slice(0, 60));
          }
          document.activeElement?.blur();
          scrollTo(0, 0);
          return { positions, focused, collapsed, collisions, inHeader: header.contains(widget), position: getComputedStyle(trigger).position, overflow: document.documentElement.scrollWidth > innerWidth };
        })()`)
        assert.equal(result.inHeader, false, 'Help stays outside the header')
        assert.equal(result.position, 'fixed', 'Help stays in the traditional chatbot position')
        assert.equal(result.overflow, false, `no horizontal overflow: ${route} at ${width}`)
        assert.deepEqual(result.collisions, [], `Help clearance: ${route} at ${width}`)
        clearance.push({ route, width, height, ...result })
        console.log(`Help clearance: ${route} at ${width}px (${result.positions} scroll positions, ${result.focused} focused controls)`)
      }
      await navigate('/', width, height)
      assert.equal(await evaluate("getComputedStyle(document.querySelector('[data-help-trigger]')).visibility !== 'hidden'"), true, 'Help is discoverable at the top of the homepage')
      await shot(`c3-launcher-${width}`)
      await evaluate("document.querySelector('[data-help-trigger]').click()")
      await until("document.querySelector('[data-help-panel]').matches(':popover-open')")
      await pause(250)
      assert.equal(await evaluate("(() => { const r = document.querySelector('[data-help-panel]').getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth })()"), true, `Help menu fits ${width}`)
      assert.equal(await evaluate("(() => { const trigger = document.querySelector('[data-help-trigger]').getBoundingClientRect(); const panel = document.querySelector('[data-help-panel]').getBoundingClientRect(); return trigger.width === 48 && trigger.height === 48 && trigger.right >= innerWidth - 32 && panel.bottom <= trigger.top - 8 && panel.width <= 280 && panel.height <= 180 })()"), true, `48px launcher and compact menu above it at ${width}`)
      assert.equal(await evaluate("getComputedStyle(document.querySelector('[data-help-panel]'), '::backdrop').backgroundColor"), 'rgba(0, 0, 0, 0)', 'Help does not dim the page')
      assert.equal(await evaluate("document.querySelectorAll('[data-help-panel] li').length"), 2, 'Help offers just guide and appointment actions')
      await shot(`c3-help-open-${width}`)
      await evaluate("document.querySelector('[aria-label=\"Close help options\"]').click()")
      assert.equal(await evaluate("!document.querySelector('[data-help-panel]').matches(':popover-open') && document.activeElement.matches('[data-help-trigger]')"), true, 'visible close dismisses and restores focus')
      await evaluate("document.querySelector('[data-help-trigger]').click()")
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
      assert.equal(await evaluate("!document.querySelector('[data-help-panel]').matches(':popover-open')"), true, 'Escape dismisses Help')
      await evaluate("document.activeElement?.blur()")
      // Capture the original reading collisions with the launcher closed.
      for (const [name, selector] of [['news', '#news-resources-title'], ['faq', '#visit-guide-title']]) {
        assert.equal(await evaluate(`!!document.querySelector(${JSON.stringify(selector)})`), true, `${name} capture target exists`)
        await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({ block: 'center', behavior: 'instant' })`)
        await pause(350)
        await shot(`c3-${name}-${width}`)
      }
    }
    // Isolate collision handling from the page layout so the check cannot pass
    // merely because this particular page happens to have an empty corner.
    await navigate('/', 390, 844)
    await evaluate(`(() => {
      const obstacle = document.createElement('button');
      obstacle.dataset.helpObstacle = '';
      obstacle.textContent = 'Page action';
      obstacle.style.cssText = 'position:fixed;right:8px;bottom:8px;width:72px;height:64px';
      document.querySelector('main').append(obstacle);
    })()`)
    await pause(150)
    assert.equal(await evaluate("(() => { const t = document.querySelector('[data-help-trigger]'); const a = document.querySelector('[data-help-obstacle]').getBoundingClientRect(); return getComputedStyle(t).visibility === 'visible' && t.getBoundingClientRect().bottom <= a.top - 8 })()"), true, 'launcher moves above a page action')
    await evaluate("document.querySelector('[data-help-obstacle]').style.height = '250px'; window.dispatchEvent(new Event('resize'))")
    await pause(150)
    assert.equal(await evaluate("getComputedStyle(document.querySelector('[data-help-trigger]')).visibility"), 'hidden', 'launcher collapses when the corner is occupied')
    await evaluate("document.querySelector('[data-help-obstacle]').remove()")
    await pause(150)
    assert.equal(await evaluate("getComputedStyle(document.querySelector('[data-help-trigger]')).visibility"), 'visible', 'launcher returns when the corner clears')
    await navigate('/appointment', 390, 844)
    await evaluate("document.querySelector('main input:not([type=hidden]):not(:disabled)').focus()")
    await pause(150)
    assert.equal(await evaluate("getComputedStyle(document.querySelector('[data-help-trigger]')).visibility"), 'hidden', 'launcher hides while a mobile page field is active')
    await shot('c3-mobile-form-focus')
    await evaluate("document.activeElement.blur(); scrollTo(0, 0)")
    await pause(150)
    assert.equal(await evaluate("getComputedStyle(document.querySelector('[data-help-trigger]')).visibility"), 'visible', 'launcher returns after editing')
    await send('Emulation.setScriptExecutionDisabled', { value: true })
    await navigate('/', 390, 844)
    await evaluate("document.querySelector('[data-help-trigger]').click()")
    assert.equal(await evaluate("document.querySelector('[data-help-panel]').matches(':popover-open')"), true, 'native Help works without JavaScript')
    await evaluate("document.querySelector('[aria-label=\"Close help options\"]').click()")
    assert.equal(await evaluate("!document.querySelector('[data-help-panel]').matches(':popover-open')"), true, 'native close works without JavaScript')
    await send('Emulation.setScriptExecutionDisabled', { value: false })
    await writeFile(path.join(capture, 'c3-clearance.json'), JSON.stringify(clearance, null, 2) + '\n')
    console.log(`C3 Help clearance passed: ${clearance.length} page/viewport combinations, ${clearance.reduce((n, r) => n + r.positions, 0)} scroll positions and ${clearance.reduce((n, r) => n + r.focused, 0)} focused controls; visible close, Escape, and no-JavaScript dismissal.`)
  }
  const lastReply = "document.querySelector('[data-guide-turn]:last-child [data-guide-reply]')"
  for (const width of [320, 390, 768, 1440]) {
    await navigate('/', width)
    await open()
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true)
    assert.equal(await evaluate("(() => { const d = document.querySelector('[data-patient-guide]'); const r = d.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight && d.scrollWidth <= d.clientWidth })()"), true, `dialog fits ${width}`)
    assert.equal(await evaluate("document.querySelector('[data-patient-guide]').contains(document.activeElement)"), true)
    await shot(`welcome-${width}`)
    await ask('Find Dr Aster')
    assert.match(await evaluate(`${lastReply}.innerText`), /Dr Aster/)
    assert.equal(await evaluate(`${lastReply}.querySelector('a[href*="doctor="]').getAttribute('href')`), '/appointment?doctor=pub_101010101010')
    await shot(`doctor-${width}`)
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
    await until("!document.querySelector('[data-patient-guide]').open")
    assert.equal(await evaluate("document.activeElement.matches('[data-help-trigger]')"), true, 'Escape restores focus')
  }
  await navigate('/appointment', 390)
  await open()
  await evaluate("document.querySelector('[aria-label=\"Close patient guide\"]').focus()")
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, modifiers: 8 })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, modifiers: 8 })
  // Native modal navigation may visit browser chrome (reported as body), but never page controls.
  const modalFocus = "document.activeElement === document.body || document.querySelector('[data-patient-guide]').contains(document.activeElement)"
  assert.equal(await evaluate(modalFocus), true, 'Shift+Tab does not focus background page controls')
  for (let step = 0; step < 14; step++) {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
    assert.equal(await evaluate(modalFocus), true, 'Tab does not focus background page controls')
  }
  const storage = await evaluate('JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage } })')
  const networkStart = requests.length
  for (const [query, expected] of [
    ['visiting hours', /not verified/], ['Can I cancel my appointment?', /cannot look up/],
    ['General medicine', /General medicine/], ['random unmatched question', /couldn’t match/],
    ['<img src=x onerror=alert(1)>', /couldn’t match/], ['emergency', /immediate in-person/],
  ]) {
    await ask(query)
    assert.match(await evaluate(`${lastReply}.innerText`), expected)
  }
  assert.equal(await evaluate("!!document.querySelector('[data-guide-turn] img')"), false, 'user text is escaped')
  assert.equal(await evaluate('JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage } })'), storage, 'no conversation storage')
  assert.equal(requests.slice(networkStart).some((request) => request.method !== 'GET' || request.url.includes('random%20unmatched')), false, 'chat sends no messages to server')
  await shot('emergency-390')
  await evaluate("Array.from(document.querySelectorAll('[data-patient-guide] button')).find(b => b.textContent.includes('Start over')).click()")
  await until("document.querySelectorAll('[data-guide-turn]').length === 0")
  await ask('Rehabilitation care')
  await evaluate(`${lastReply}.querySelector('a[href*="service="]').click()`)
  await until("location.search.includes('service=pub_171717171717') && !document.querySelector('[data-patient-guide]').open")
  assert.equal(await evaluate("!!document.querySelector('[data-appointment-safe-form]')"), true, 'service handoff reaches appointment')
  await open()
  await ask('Find Dr Aster')
  await evaluate(`${lastReply}.querySelector('a[href*="doctor="]').click()`)
  await until("location.search.includes('doctor=pub_101010101010') && !document.querySelector('[data-patient-guide]').open")
  await open()
  await evaluate("document.querySelector('[data-patient-guide] a[href=\"/emergency\"]').click()")
  await until("location.pathname === '/emergency'")
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await navigate('/services', 390, 480)
  await open()
  await ask('Explore services')
  assert.equal(await evaluate("(() => { const d = document.querySelector('[data-patient-guide]'); const r = d.getBoundingClientRect(); return r.bottom <= innerHeight && r.top >= 0 })()"), true, 'short viewport')
  await shot('services-short-390')
  assert.deepEqual(errors, [], 'no browser errors')
  console.log(`Patient guide browser checks passed: four widths, keyboard dismissal, focus return, typed answers, escaped input, reset, privacy, doctor/service handoffs, emergency navigation and reduced motion. Screenshots: ${capture}`)
} finally {
  socket?.close()
  browser.kill('SIGTERM')
  await pause(250)
  await rm(profile, { recursive: true, force: true })
}
