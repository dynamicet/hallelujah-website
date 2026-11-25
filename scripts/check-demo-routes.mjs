import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

const server = { origin: 'http://localhost:3000' }
const runtimeDirectory = process.env.DEMO_RUNTIME_DIR ? path.resolve(process.env.DEMO_RUNTIME_DIR) : tmpdir()
await mkdir(runtimeDirectory, { recursive: true })
const profile = await mkdtemp(path.join(runtimeDirectory, 'hh-'))
const port = 20000 + randomBytes(2).readUInt16BE(0) % 30000
const browserPath = [
  process.env.CHROME_PATH,
  'google-chrome-stable',
  'google-chrome',
  '/snap/chromium/current/usr/lib/chromium-browser/chrome',
  'chromium',
  'chromium-browser',
].find((candidate) => candidate && spawnSync(candidate, ['--version'], { encoding: 'utf8' }).status === 0)
assert.ok(browserPath, 'A Chromium browser is required')

const browser = spawn(browserPath, [
  '--headless=new', '--no-first-run', '--disable-background-timer-throttling',
  '--no-default-browser-check', '--remote-debugging-address=127.0.0.1', `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] })
let browserStartupError = ''
browser.stderr.on('data', (chunk) => { browserStartupError = (browserStartupError + chunk).slice(-2000) })
const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))
const requests = []
const requestUrls = new Map()
const requestNoJavaScript = new Map()
const failedLoads = []
const httpErrors = []
const cases = []
const browserErrors = []
const browserWarnings = []
let noJavaScript = false
let socket

try {
  let endpoint
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      endpoint = (await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()).webSocketDebuggerUrl
      break
    } catch {
      if (browser.exitCode !== null || browser.signalCode !== null) throw new Error(`Browser failed to start: ${browserStartupError}`)
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
    if (message.method === 'Network.requestWillBeSent') {
      requests.push(message.params.request)
      requestUrls.set(message.params.requestId, message.params.request.url)
      requestNoJavaScript.set(message.params.requestId, noJavaScript)
    }
    if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) {
      httpErrors.push(`${message.params.response.status} ${message.params.response.url}`)
    }
    if (message.method === 'Network.loadingFailed' && !message.params.canceled) {
      failedLoads.push({
        url: requestUrls.get(message.params.requestId) ?? message.params.requestId,
        error: message.params.errorText ?? null,
        blockedReason: message.params.blockedReason ?? null,
        type: message.params.type ?? null,
        whenNoJavaScript: requestNoJavaScript.get(message.params.requestId) ?? false,
      })
    }
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
      browserErrors.push(message.params.args.map((arg) => arg.value ?? arg.description ?? '').join(' '))
    }
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'warning') {
      browserWarnings.push(message.params.args.map((arg) => arg.value ?? arg.description ?? '').join(' '))
    }
    if (message.method === 'Runtime.exceptionThrown') browserErrors.push(message.params.exceptionDetails.text)
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
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`${method} timed out`)) }, process.env.PATIENT_PAGES_ONLY === '1' ? 30000 : 10000)
      pending.set(id, { resolve, reject, timer })
      socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
    })
  }
  const { targetId } = await sendRaw('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await sendRaw('Target.attachToTarget', { targetId, flatten: true })
  const send = (method, params = {}) => sendRaw(method, params, sessionId)
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true })
    if (result.exceptionDetails) throw new Error(`Demo browser evaluation failed: ${expression}`)
    return result.result.value
  }
  const until = async (expression) => {
    for (let attempt = 0; attempt < 120; attempt++) {
      if (await evaluate(expression)) return
      await pause(30)
    }
    throw new Error(`Demo condition timed out: ${expression}`)
  }
  await send('Page.enable')
  await send('Runtime.enable')
  await send('Network.enable')
  await send('DOM.enable')
  await send('CSS.enable')
  await send('Network.setCacheDisabled', { cacheDisabled: true })

  const navigate = async (pathname, width = 1280) => {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false })
    await send('Page.navigate', { url: server.origin + pathname })
    await until("document.readyState === 'complete' && !!document.querySelector('main h1')")
  }
  const demoData = JSON.parse(await readFile(new URL('../apps/web/src/demo/data.json', import.meta.url), 'utf8'))
  const patientPagesOnly = process.env.PATIENT_PAGES_ONLY === '1'
  const paths = process.env.PATIENT_FEEDBACK_ONLY === '1' ? ['/feedback'] : [...(patientPagesOnly ? [] : ['/', '/doctors', '/services', '/emergency', '/appointment']), '/contact', '/feedback',
    ...demoData.services.map((service) => service.canonicalPath)]
  const checkedDestinations = new Map()
  for (const pathname of paths) {
    const response = await fetch(server.origin + pathname)
    assert.equal(response.status, 200, pathname)
    await navigate(pathname)
    await pause(500)
    assert.equal(await evaluate("Array.from(document.querySelector('nextjs-portal')?.shadowRoot?.querySelectorAll('[data-next-badge-root]') ?? []).some(element => element.checkVisibility({ opacityProperty: true, visibilityProperty: true }))"), false, 'development indicator hidden')
    const visibleText = await evaluate("document.body.innerText")
    assert.doesNotMatch(visibleText.replace('Original concept illustration · Fictional people and setting', ''), /\b(demo|fictional|synthetic|fixture|specimen|placeholder|mock data|under development|invalid test value)\b/i, pathname)
    assert.equal(await evaluate("document.querySelectorAll('main').length"), 1)
    assert.equal(await evaluate("document.querySelectorAll('h1').length"), 1)
    assert.equal(await evaluate("document.querySelector('meta[name=robots]')?.content.includes('noindex')"), true)
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true, pathname)
    const links = await evaluate("Array.from(document.querySelectorAll('a[href]'), a => a.getAttribute('href'))")
    for (const href of new Set(links)) {
      const url = new URL(href, server.origin + pathname)
      assert.equal(url.origin, server.origin)
      const documentUrl = new URL(url)
      documentUrl.hash = ''
      if (!checkedDestinations.has(documentUrl.href)) {
        const destination = await fetch(documentUrl)
        checkedDestinations.set(documentUrl.href, { status: destination.status, body: await destination.text() })
      }
      const destination = checkedDestinations.get(documentUrl.href)
      assert.equal(destination.status, 200, `${pathname} -> ${href}`)
      if (url.hash) assert.ok(destination.body.includes(`id="${url.hash.slice(1)}"`), href)
    }
    cases.push(`route and links: ${pathname}`)
    if (patientPagesOnly) console.log(`Patient route and links passed: ${pathname}`)
  }
  if (patientPagesOnly) {
    for (const pathname of paths) {
      for (const width of [768, 390, 320]) {
        await navigate(pathname, width)
        assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true, `${pathname} at ${width}`)
      }
      console.log(`Patient responsive layouts passed: ${pathname}`)
    }
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
    await navigate('/contact', 390)
    assert.equal(await evaluate("document.getAnimations().filter(animation => animation.playState === 'running').length"), 0)
    await send('Emulation.setScriptExecutionDisabled', { value: true })
    noJavaScript = true
    await navigate('/feedback', 390)
    assert.equal(await evaluate("document.querySelector('main button[type=submit]').disabled"), true)
    await send('Emulation.setScriptExecutionDisabled', { value: false })
    noJavaScript = false
    cases.push('all patient pages at tablet and mobile widths, reduced motion and no-JavaScript feedback')
  }
  assert.equal((await fetch(server.origin + '/services/unknown-service')).status, 404, 'unknown service returns 404')
  await navigate('/feedback', 390)
  await until("!document.querySelector('#feedback-message').disabled")
  await evaluate("document.querySelector('#share summary').click()")
  const beforeFeedbackRequests = requests.length
  await evaluate(`(() => {
    const field = document.querySelector('#feedback-message');
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(field, 'Sample suggestion: clearer arrival signs.');
    field.dispatchEvent(new Event('input', { bubbles: true }));
  })()`)
  await evaluate("document.querySelector('main form button[type=submit]').click()")
  await until("!!document.querySelector('#feedback-review-title')")
  assert.equal(await evaluate("document.querySelector('main blockquote').textContent"), 'Sample suggestion: clearer arrival signs.')
  await until("document.activeElement.getAttribute('aria-labelledby') === 'feedback-review-title'")
  assert.match(await evaluate("document.querySelector('main [role=status]').textContent"), /Nothing has been sent/)
  assert.equal(await evaluate("Array.from(document.querySelectorAll('main button')).find(button => button.textContent === 'Sending unavailable').disabled"), true)
  await evaluate("Array.from(document.querySelectorAll('main button')).find(button => button.textContent === 'Edit message').click()")
  await until("document.activeElement.id === 'feedback-message'")
  assert.equal(await evaluate("document.querySelector('#feedback-message').value"), 'Sample suggestion: clearer arrival signs.')
  await evaluate("document.querySelector('main form button[type=submit]').click()")
  await until("!!document.querySelector('#feedback-review-title')")
  await evaluate("Array.from(document.querySelectorAll('main button')).find(button => button.textContent === 'Clear & start again').click()")
  await until("document.activeElement.id === 'feedback-message'")
  assert.equal(await evaluate("document.querySelector('#feedback-message').value"), '')
  assert.ok(!requests.slice(beforeFeedbackRequests).some(request => request.method !== 'GET' || request.url.includes('Sample%20suggestion')), 'feedback never transmits the sample')
  await navigate('/feedback')
  await until("!document.querySelector('#feedback-message').disabled")
  assert.equal(await evaluate("document.querySelector('#feedback-message').value"), '', 'feedback cleared on reload')
  cases.push('feedback review, edit, clear, focus, reload and no transmission')
  if (patientPagesOnly) console.log('Feedback review, edit, clear, focus, reload and no transmission passed.')
  // The focused run excludes unrelated homepage and legacy directory scenarios.
  if (!patientPagesOnly) {
  await navigate('/')
  await until("document.documentElement.dataset.hydration === 'ready'")
  assert.equal(await evaluate("document.querySelector('.hero-film-play').textContent.trim()"), '')
  assert.equal(await evaluate("document.querySelector('#hospital-film video').hasAttribute('src')"), false)
  assert.equal(await evaluate("performance.getEntriesByType('resource').some(entry => /abstract-motion\.(webm|vtt)/.test(entry.name))"), false)
  await evaluate("document.querySelectorAll('.care-spotlight-choice')[1].click()")
  await until("document.querySelector('#care-spotlight-result a').getAttribute('href').includes('Heart%20medicine')")
  assert.equal(await evaluate("document.querySelectorAll('.care-spotlight-choice[aria-pressed=true]').length"), 1)
  await evaluate("document.querySelectorAll('.hospital-spaces-choice')[1].click()")
  await until("document.querySelector('#hospital-spaces-result h3').textContent === 'Room to talk.'")
  assert.equal(await evaluate("document.querySelector('.hospital-spaces-photo img').getAttribute('src')"), '/editorial/hope-care.webp')
  const playFilm = async () => {
    await evaluate("document.querySelector('.hero-film-play').scrollIntoView({ block: 'center', behavior: 'instant' })")
    const position = await evaluate("(() => { const r = document.querySelector('.hero-film-play').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } })()")
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', ...position, button: 'left', clickCount: 1 })
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...position, button: 'left', clickCount: 1 })
  }
  await playFilm()
  await until("document.querySelector('#hospital-film').open && document.querySelector('#hospital-film video').readyState >= 2")
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await until("!document.querySelector('#hospital-film').open && !document.querySelector('#hospital-film video').hasAttribute('src')")
  assert.equal(await evaluate("document.activeElement.matches('.hero-film-play')"), true)
  assert.equal(await evaluate("document.body.style.overflow"), '')
  await playFilm()
  await until("document.querySelector('#hospital-film').open")
  await evaluate("document.querySelector('#hospital-film video').dispatchEvent(new Event('error'))")
  await until("!!document.querySelector('.hospital-film-fallback')")
  await evaluate("document.querySelector('.hospital-film-close').click()")
  await until("!document.querySelector('#hospital-film').open && !document.querySelector('#hospital-film video').hasAttribute('src')")
  cases.push('Homepage selectors, icon-only film control, deferred media, Escape, focus restoration and playback failure')
  await navigate('/')
  await until("document.documentElement.dataset.hydration === 'ready'")
  await evaluate("document.querySelector('#home-doctor-search').value = 'Aster'; document.querySelector('.welcome-search').requestSubmit()")
  await until("location.pathname === '/doctors' && location.search.includes('q=Aster') && !!document.querySelector('[data-clinician-public-id]')")
  assert.equal(await evaluate("document.querySelectorAll('[data-clinician-public-id]').length"), 1)
  cases.push('Homepage doctor search hands its query to the directory')
  await navigate('/')
  // Below-fold images intentionally load lazily. Request them before checking asset integrity.
  await evaluate("Array.from(document.images).forEach(image => { image.loading = 'eager' })")
  await until("Array.from(document.images).every(image => image.complete && image.naturalWidth > 0)")
  await navigate('/doctors?q=Aster')
  assert.equal(await evaluate("document.querySelectorAll('[data-clinician-public-id]').length"), 1)
  await navigate('/doctors?q=no-matching-name')
  assert.equal(await evaluate("!!document.querySelector('[data-directory-empty]')"), true)
  cases.push('Care navigator choices, service/doctor handoff, complete images and zero-result recovery')
  await navigate('/?demo=empty')
  assert.equal(await evaluate("!!document.querySelector('[data-home-section=H4]')"), false)
  assert.equal(await evaluate("!!document.querySelector('[data-home-section=H8]')"), false)
  await navigate('/?demo=unavailable')
  assert.equal(await evaluate("!!document.querySelector('[data-home-arrival-artwork]')"), false)
  await navigate('/emergency')
  assert.equal(await evaluate("document.querySelector('[data-emergency-template]').dataset.emergencyState"), 'ready')
  assert.deepEqual(await evaluate("Array.from(document.querySelectorAll('[data-emergency-section]'), node => node.dataset.emergencySection)"), ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8'])
  assert.equal(await evaluate("document.querySelectorAll('[data-emergency-template] a[href^=\"tel:\"]').length"), 0)
  await evaluate("document.querySelector('[data-inert-call-choice] button').click()")
  await until("!!document.querySelector('[data-inert-call-choice] [role=status]').textContent")
  assert.match(await evaluate("document.querySelector('[data-inert-call-choice] [role=status]').textContent"), /cannot open a call/u)
  await evaluate("document.querySelector('[data-emergency-section=E5] button').click()")
  await until("!!document.querySelector('[data-emergency-section=E5] [role=status]').textContent")
  await evaluate("document.querySelector('[data-emergency-section=E7] button').click()")
  await until("document.querySelector('[data-demo-map-state]').dataset.demoMapState === 'failed'")
  assert.equal(await evaluate("document.querySelectorAll('[data-emergency-template] a[href^=\"tel:\"]').length"), 0)
  cases.push('Emergency route choices, copy feedback and local map recovery')
  await navigate('/emergency?demo=unavailable')
  assert.equal(await evaluate("document.querySelector('[data-emergency-template]').dataset.emergencyState"), 'unavailable')
  assert.equal(await evaluate("!!document.querySelector('[data-emergency-section=E1] a[href=\"/#home-call\"]')"), true)
  await navigate('/emergency?demo=expired')
  assert.equal(await evaluate("!!document.querySelector('[data-inert-call-choice]')"), false)
  await navigate('/emergency?demo=map-blocked')
  assert.equal(await evaluate("document.querySelector('[data-demo-map-state]').dataset.demoMapState"), 'blocked')
  await navigate('/emergency?demo=call-handoff-unsupported')
  assert.equal(await evaluate("document.querySelectorAll('[data-call-action=unsupported]').length"), 2)
  await navigate('/doctors?demo=failure')
  assert.equal(await evaluate("document.querySelector('[data-clinician-directory-template]').dataset.clinicianDirectoryState"), 'failure')
  await navigate('/services?demo=loading')
  assert.equal(await evaluate("!!document.querySelector('[data-directory-loading]')"), true)
  await navigate('/services')
  assert.equal(await evaluate("document.querySelectorAll('[data-service-public-id]').length"), 6)
  assert.deepEqual(await evaluate("Array.from(document.querySelectorAll('[data-directory-section=S5] section h2'), node => node.textContent)"), ['Access and hospital care', 'Medicine'])
  assert.equal(await evaluate("document.querySelectorAll('[data-service-public-id] a[href^=\"/appointment?service=\"]').length"), 6)
  const selectedServiceDetail = await evaluate("document.querySelector('[data-service-public-id=pub_151515151515] h3 a').getAttribute('href')")
  await navigate(selectedServiceDetail)
  assert.equal(await evaluate("document.querySelector('h1').textContent"), 'Heart medicine')
  assert.equal(await evaluate("document.querySelectorAll('#care-team a[href^=\"/doctors/\"]').length"), 3)
  const selectedServiceHref = await evaluate("document.querySelector('a[href^=\"/appointment?service=\"]').getAttribute('href')")
  await navigate(selectedServiceHref)
  assert.match(await evaluate("document.querySelector('#care-preference').value"), /Cardiology/)
  await navigate('/services?page=2')
  assert.deepEqual(await evaluate("Array.from(document.querySelectorAll('[data-directory-section=S5] section h2'), node => node.textContent)"), ['Specialty and rehabilitation'])
  await navigate('/services?q=heart')
  assert.equal(await evaluate("document.querySelectorAll('[data-service-public-id]').length"), 1)
  await evaluate("history.back()")
  await until("location.pathname === '/services' && location.search === '?page=2' && !!document.querySelector('[data-service-public-id]')")
  await evaluate("history.forward()")
  await until("location.search.includes('q=heart') && document.querySelectorAll('[data-service-public-id]').length === 1")
  await navigate('/services?group=synthetic-medicine')
  assert.equal(await evaluate("document.querySelectorAll('[data-service-public-id]').length"), 3)
  assert.equal(await evaluate("document.querySelectorAll('[data-active-filters] a').length > 0"), true)
  await evaluate("document.querySelector('[data-active-filters] a').click()")
  await until("location.pathname === '/services' && location.search === '' && document.querySelectorAll('[data-service-public-id]').length === 6")
  await navigate('/services?q=urgent')
  assert.equal(await evaluate("!!document.querySelector('[data-directory-section=S2] a[href=\"/emergency\"]')"), true)
  await navigate('/services?demo=failure&q=heart&group=synthetic-medicine')
  assert.equal(await evaluate("document.querySelector('[data-directory-unavailable] a').getAttribute('href')"), '/services?q=heart&group=synthetic-medicine')
  await evaluate("document.querySelector('[data-directory-unavailable] a').click()")
  await until("!!document.querySelector('[data-service-public-id=pub_151515151515]')")
  cases.push('service groups, selected-service handoff, urgency and retained failure search')
  await navigate('/services', 320)
  assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true, 'Services at 320px')
  await navigate('/doctors/synthetic-clinician-101010101010/?demo=partial')
  assert.equal(await evaluate("!!document.querySelector('[data-profile-section=P3]')"), false)
  assert.equal(await evaluate("!!document.querySelector('[data-clinician-profile-template] [data-clinician-monogram]')"), true)
  assert.equal(await evaluate("document.querySelectorAll('[data-profile-section=P1] img').length"), 0)
  await navigate('/doctors/synthetic-clinician-101010101010/')
  assert.equal(await evaluate("!!document.querySelector('[data-profile-section=P3]')"), true)
  await navigate('/appointment?demo=validation')
  assert.equal(await evaluate("document.querySelector('[data-appointment-request]').dataset.appointmentState"), 'validation')
  assert.equal(await evaluate("!!document.querySelector('[data-error-summary]:not([hidden])')"), true)
  await navigate('/appointment?demo=workflow-unavailable')
  assert.equal(await evaluate("!!document.querySelector('#appointment-request-form')"), false)
  await navigate('/appointment')
  assert.equal(await evaluate("document.querySelector('[data-appointment-request]').dataset.appointmentState"), 'editing')
  cases.push('fixture sections, safe normal Emergency, alternate states and reset')
  const formReady = "document.querySelector('#full-name') && !document.querySelector('#full-name').matches(':disabled')"
  const formState = "document.querySelector('[data-appointment-request]').dataset.appointmentState"
  const submitRequest = () => evaluate("document.querySelector('#appointment-request-form').requestSubmit()")
  const fillRequest = () => evaluate(`(() => {
    document.querySelector('#full-name').value = 'TEST PATIENT';
    document.querySelector('#phone').value = '+0 000 000 0000';
  })()`)
  await navigate('/appointment', 390)
  await until(formReady)
  assert.equal(await evaluate("document.querySelector('#appointment-preference-options').hidden"), false)
  await submitRequest()
  await until("document.activeElement.id === 'appointment-error-summary'")
  assert.equal(await evaluate("document.querySelectorAll('#appointment-error-summary li').length"), 2)
  await fillRequest()
  await submitRequest()
  await until(formState + " === 'receipt' && document.activeElement.id === 'appointment-result-title'")
  assert.match(await evaluate("document.querySelector('[data-appointment-request]').textContent"), /Our team will call you to arrange a time/)
  assert.equal(await evaluate("document.querySelector('#full-name') === null"), true)
  cases.push('single-screen request without a preference, validation, focus and receipt cleanup')

  await navigate('/doctors?q=Aster')
  assert.equal(await evaluate("document.querySelectorAll('[data-clinician-public-id]').length"), 1)
  const profileHref = await evaluate("document.querySelector('[data-clinician-public-id] a').getAttribute('href')")
  await evaluate("document.querySelector('[data-clinician-public-id] a').click()")
  await until("!!document.querySelector('[data-clinician-profile-template]')")
  assert.equal(await evaluate("document.querySelector('h1').textContent"), 'Dr. Aster')
  assert.doesNotMatch(await evaluate("document.body.innerText"), /\b(demo|fictional|synthetic|fixture|placeholder)\b/i)
  const appointmentHref = await evaluate(`document.querySelector('a[href^="/appointment?doctor="]').getAttribute('href')`)
  await navigate(appointmentHref)
  await until(formReady)
  assert.match(await evaluate("document.querySelector('#care-preference').value"), /Dr. Aster/)
  await fillRequest()
  await evaluate("const form = document.querySelector('#appointment-request-form'); form.requestSubmit(); form.requestSubmit()")
  await until(formState + " === 'receipt'")
  cases.push('matching doctor profile, carried preference and guarded double submission')

  for (const [scenario, first, retry] of [['known-failure', 'known-failure', 'receipt'], ['unknown', 'unknown', 'duplicate']]) {
    await navigate('/appointment?start=editing&demo=' + scenario)
    await until(formReady)
    await fillRequest()
    await submitRequest()
    await until(formState + " === '" + first + "'")
    assert.equal(await evaluate("document.querySelector('#phone').value"), '+0 000 000 0000')
    await submitRequest()
    await until(formState + " === '" + retry + "'")
  }
  assert.equal(requests.some((request) => request.method === 'POST' && !new URL(request.url).pathname.startsWith('/__nextjs')), false)
  cases.push('appointment error and uncertain outcome retain details and allow retry without delivery')
  await navigate('/doctors?q=Aster&type=synthetic-family')
  await evaluate("document.querySelector('[data-clinician-public-id] a').click()")
  await until("!!document.querySelector('[data-clinician-profile-template]')")
  const returnHref = await evaluate("document.querySelector('a[href^=\"/doctors?q=Aster\"]').getAttribute('href')")
  assert.match(returnHref, /type=synthetic-family/u)
  const serviceHref = await evaluate("document.querySelector('[data-profile-section=P5] a').getAttribute('href')")
  assert.match(serviceHref, /^\/services\?q=General%20medicine/u)
  await evaluate("document.querySelector('[data-profile-section=P5] a').click()")
  await until("location.pathname === '/services' && location.search.includes('General%20medicine')")
  assert.equal(await evaluate("document.querySelectorAll('[data-service-public-id]').length"), 1)
  await navigate('/doctors?demo=failure&q=Aster')
  const retryHref = await evaluate("document.querySelector('[data-directory-unavailable] a').getAttribute('href')")
  assert.equal(retryHref, '/doctors?q=Aster')
  await evaluate("document.querySelector('[data-directory-unavailable] a').click()")
  await until("!!document.querySelector('[data-clinician-public-id]')")
  cases.push('directory context, related-service handoff and failure recovery')
  await navigate('/doctors?page=2')
  assert.equal(await evaluate("document.querySelector('ol[data-directory-section=D4]').getAttribute('start')"), '5')
  await navigate('/doctors?type=synthetic-child')
  assert.equal(await evaluate("Array.from(document.querySelectorAll('[data-clinician-public-id]')).every(e => e.textContent.includes('Child care'))"), true)
  await navigate('/services?q=no-such-demo-service')
  assert.equal(await evaluate("!!document.querySelector('[data-directory-empty]')"), true)
  cases.push('pagination, specialty filtering, service empty state')
  for (const pathname of [...paths, profileHref]) {
    await navigate(pathname, 390)
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true, `mobile ${pathname}`)
  }
  await navigate('/doctors/synthetic-clinician-181818181818/', 320)
  assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true, 'long clinician name at 320px')
  await navigate('/doctors', 390)
  await pause(500)
  await evaluate("document.querySelector('[data-menu-trigger]').click()")
  await until("document.querySelector('[data-navigation-panel]').matches(':popover-open')")
  assert.equal(await evaluate("document.querySelector('[data-navigation-panel] a[href=\"/appointment\"]').checkVisibility()"), true)
  await evaluate("document.querySelector('[data-navigation-panel] a[href=\"/services\"]').focus()")
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await until("!document.querySelector('[data-navigation-panel]').matches(':popover-open')")
  await until("document.activeElement === document.querySelector('[data-menu-trigger]')")
  await evaluate("document.querySelector('[data-menu-trigger]').click()")
  await until("document.querySelector('[data-navigation-panel]').matches(':popover-open')")
  await evaluate("document.querySelector('[data-language-switcher] summary').click()")
  await until("document.querySelector('[data-language-switcher]').open")
  await evaluate("document.querySelector('[data-language-switcher] summary').focus()")
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await until("!document.querySelector('[data-language-switcher]').open")
  assert.equal(await evaluate("document.activeElement === document.querySelector('[data-language-switcher] summary')"), true)
  await evaluate("document.querySelector('[data-navigation-panel] a[href=\"/services\"]').click()")
  await until("location.pathname === '/services' && !!document.querySelector('[data-service-directory-template]')")
  assert.equal(await evaluate("document.querySelector('[data-primary-navigation] [aria-current=page]')?.getAttribute('href')"), '/services')
  await pause(500)
  await evaluate("document.querySelector('[data-menu-trigger]').click()")
  await until("document.querySelector('[data-menu-trigger]').getAttribute('aria-expanded') === 'true'")
  await evaluate("document.querySelector('[data-menu-trigger]').click()")
  await evaluate('history.back()')
  await until("location.pathname === '/doctors' && !!document.querySelector('[data-clinician-directory-template]')")
  assert.equal(await evaluate("document.querySelector('[data-primary-navigation] [aria-current=page]')?.getAttribute('href')"), '/doctors')
  cases.push('mobile reflow, Escape focus return, language disclosure, client navigation and history')
  noJavaScript = true
  await send('Emulation.setScriptExecutionDisabled', { value: true })
  await navigate('/')
  await evaluate("document.querySelector('#home-doctor-search').value = 'Aster'; document.querySelector('.welcome-search').submit()")
  await until("location.pathname === '/doctors' && !!document.querySelector('[data-clinician-public-id]')")
  assert.equal(await evaluate("document.querySelectorAll('[data-clinician-public-id]').length"), 1)
  await navigate('/')
  assert.equal(await evaluate("document.querySelector('.navigator-result a').getAttribute('href')"), '/doctors')
  assert.equal(await evaluate("!!document.querySelector('.navigator-fallback a[href=\"/services\"]')"), true)
  await navigate('/doctors?q=Aster')
  assert.equal(await evaluate("document.querySelectorAll('[data-clinician-public-id]').length"), 1)
  await navigate('/appointment')
  assert.equal(await evaluate("document.querySelector('#full-name').matches(':disabled')"), true)
  assert.match(await evaluate("document.querySelector('noscript').innerText"), /call reception/u)
  await send('Emulation.setScriptExecutionDisabled', { value: false })
  noJavaScript = false
  cases.push('server search and disabled appointment form without JavaScript')
  assert.equal((await fetch(server.origin + '/doctors/unknown-doctor')).status, 404)
  const response = await fetch(server.origin + '/api/appointment-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
  assert.equal(response.status, 503)
  cases.push('unknown profile 404 and disabled API')
  for (const pathname of [...paths, profileHref]) {
    for (const width of [390, 768, 1440]) {
      await navigate(pathname, width)
      assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, `${pathname} at ${width}px`)
    }
  }
  for (const width of [320, 360, 1280]) {
    await navigate('/emergency', width)
    assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, `Emergency at ${width}px`)
    await navigate('/appointment', width)
    assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, `Appointment at ${width}px`)
  }
  await navigate('/doctors', 1440)
  await evaluate("document.querySelector('[data-directory-section=D6] a[href=\"/services\"]').click()")
  await until("location.pathname === '/services' && !!document.querySelector('[data-service-public-id]')")
  await navigate('/appointment', 1440)
  await evaluate("document.querySelector('#appointment-call a[href=\"/contact\"]').click()")
  await until("location.pathname === '/contact' && !!document.querySelector('#contact-reception')")
  await navigate('/')
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.welcome-photo')).animationName"), 'none', 'hero image stays still; film playback is optional')
  cases.push('six routes at mobile, tablet and desktop widths; support handoffs')
  const { root } = await send('DOM.getDocument')
  const { nodeId } = await send('DOM.querySelector', { nodeId: root.nodeId, selector: 'main h1' })
  const { fonts } = await send('CSS.getPlatformFontsForNode', { nodeId })
  assert.ok(fonts.length > 0, 'browser reports a rendered heading font')
  for (const [pathname, label, width] of [
    ['/', 'home', 1440], ['/appointment', 'appointment', 1440], ['/doctors', 'doctors', 1440],
    ['/services', 'services', 1440], ['/emergency', 'emergency', 1440], [profileHref, 'profile', 1440],
    ['/', 'home-mobile', 390], ['/appointment', 'appointment-mobile', 390], ['/services', 'services-mobile', 390],
  ]) {
    await navigate(pathname, width)
    await pause(250)
    const shot = await send('Page.captureScreenshot', { format: 'png' })
    await writeFile(path.join(runtimeDirectory, `hallelujah-demo-${label}.png`), Buffer.from(shot.data, 'base64'))
  }
  for (const [pathname, label] of [['/', 'home-footer'], ['/appointment', 'appointment-footer']]) {
    await navigate(pathname, 1440)
    await evaluate('window.scrollTo(0, document.body.scrollHeight)')
    await pause(150)
    const shot = await send('Page.captureScreenshot', { format: 'png' })
    await writeFile(path.join(runtimeDirectory, `hallelujah-demo-${label}.png`), Buffer.from(shot.data, 'base64'))
  }
  await navigate('/', 1440)
  await pause(250)
  const fullHome = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
  await writeFile(path.join(runtimeDirectory, 'hallelujah-demo-home-full.png'), Buffer.from(fullHome.data, 'base64'))
  await navigate('/', 390)
  await pause(250)
  const fullMobileHome = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
  await writeFile(path.join(runtimeDirectory, 'hallelujah-demo-home-mobile-full.png'), Buffer.from(fullMobileHome.data, 'base64'))
  for (const [pathname, label, width] of [
    ['/services', 'services-full', 1440], ['/services', 'services-mobile-full', 390],
    ['/emergency', 'emergency-full', 1440], ['/emergency', 'emergency-mobile-full', 390],
    ['/appointment', 'appointment-full', 1440], ['/appointment', 'appointment-mobile-full', 390],
    ['/appointment?demo=validation', 'appointment-validation-full', 1440],
    ['/appointment?demo=receipt', 'appointment-receipt-mobile-full', 390],
  ]) {
    await navigate(pathname, width)
    await pause(250)
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
    await writeFile(path.join(runtimeDirectory, `hallelujah-demo-${label}.png`), Buffer.from(shot.data, 'base64'))
  }
  if (process.env.DEMO_EVIDENCE_DIR) {
    const evidenceDirectory = path.resolve(process.env.DEMO_EVIDENCE_DIR)
    await mkdir(evidenceDirectory, { recursive: true })
    for (const [pathname, label] of [
      ['/', 'home'], ['/doctors', 'doctors'],
      [profileHref, 'profile'], ['/services', 'services'],
      ['/emergency', 'emergency'], ['/appointment', 'appointment'],
    ]) {
      for (const width of [320, 360, 768, 1280, 1440]) {
        await navigate(pathname, width)
        await pause(250)
        const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
        await writeFile(path.join(evidenceDirectory, `${label}-${width}.png`), Buffer.from(shot.data, 'base64'))
      }
    }
    for (const [pathname, label, width] of [
      ['/doctors/synthetic-clinician-101010101010?demo=partial', 'profile-partial-360', 360],
      ['/doctors?demo=failure&q=Aster', 'doctors-failure-360', 360],
      ['/services?q=no-such-demo-service', 'services-empty-360', 360],
      ['/emergency?demo=unavailable', 'emergency-unavailable-360', 360],
      ['/appointment?demo=validation', 'appointment-validation-360', 360],
      ['/appointment?demo=receipt', 'appointment-receipt-360', 360],
    ]) {
      await navigate(pathname, width)
      await pause(250)
      const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
      await writeFile(path.join(evidenceDirectory, `${label}.png`), Buffer.from(shot.data, 'base64'))
    }
  }
  }
  const expectedNoJavaScriptLoads = failedLoads.filter((failure) => failure.whenNoJavaScript
    && failure.blockedReason === 'csp'
    && /\/_next\/static\/chunks\/%5Bturbopack%5D_browser_dev_hmr-client_/u.test(failure.url))
  const unexpectedFailedLoads = failedLoads.filter((failure) => !expectedNoJavaScriptLoads.includes(failure))
  if (browserErrors.length || browserWarnings.length || unexpectedFailedLoads.length || httpErrors.length) {
    console.error(JSON.stringify({ browserErrors, browserWarnings, failedLoads: unexpectedFailedLoads, httpErrors }, null, 2))
  }
  assert.deepEqual(browserErrors, [], 'browser exceptions')
  assert.deepEqual(unexpectedFailedLoads, [], 'failed browser network loads')
  assert.deepEqual(httpErrors, [], 'browser HTTP errors')
  assert.deepEqual(browserWarnings, [], 'browser console warnings')
  console.log(`${patientPagesOnly ? 'Patient sections' : 'Connected demo'} passed: ${cases.length} route/journey groups; no browser errors, warnings, unexpected failed loads or HTTP errors. ${expectedNoJavaScriptLoads.length} development scripts blocked in the intentional no-JavaScript scenario.${patientPagesOnly ? '' : ` Screenshots: ${runtimeDirectory}/hallelujah-demo-*.png`}`)
} finally {
  socket?.close()
  browser.kill('SIGTERM')
  await pause(250)
  await rm(profile, { recursive: true, force: true })
}
