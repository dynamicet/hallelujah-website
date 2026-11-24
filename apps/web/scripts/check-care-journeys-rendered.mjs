import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Run against the existing local demo: pnpm dev, then pnpm --dir apps/web care-journeys:smoke.
const origin = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const capture = path.resolve(process.env.CARE_EVIDENCE_DIR ?? fileURLToPath(new URL('../../../artifacts/care-journeys/', import.meta.url)))
await mkdir(capture, { recursive: true })
const profileRoot = process.env.CARE_BROWSER_PROFILE_ROOT ?? fileURLToPath(new URL('../../../tmp/', import.meta.url))
await mkdir(profileRoot, { recursive: true })
const profile = await mkdtemp(path.join(profileRoot, 'hc-'))
const executable = [process.env.CHROME_PATH, '/snap/chromium/current/usr/lib/chromium-browser/chrome', 'chromium', 'google-chrome'].find((candidate) => candidate && spawnSync(candidate, ['--version']).status === 0)
assert.ok(executable, 'Chromium is required')
const browser = spawn(executable, ['--headless=new', '--disable-dev-shm-usage', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disk-cache-size=16777216', '--media-cache-size=16777216', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] })
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
let socket
let browserLog = ''
browser.stderr.on('data', (chunk) => { browserLog += chunk })
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
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push(message.params.args.map((arg) => arg.value ?? arg.description).join(' ') + JSON.stringify(message.params.stackTrace?.callFrames?.slice(0, 4) ?? []))
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
  const send = (method, params = {}) => raw(method, params, sessionId)
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
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
    console.log(`Checking ${route} at ${width}px`)
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 })
    await send('Page.navigate', { url: origin + route })
    await until("document.readyState === 'complete' && !!document.querySelector('main h1')")
    await pause(1000)
  }
  async function shot(name) {
    if (process.env.CARE_SCREENSHOTS === '0') return
    await send('Page.bringToFront')
    const result = await send('Page.captureScreenshot', { format: 'jpeg', quality: 75, fromSurface: false })
    await writeFile(path.join(capture, `${name}.jpg`), Buffer.from(result.data, 'base64'))
  }
  const ready = "!document.querySelector('[data-appointment-safe-form]')?.hasAttribute('inert')"
  for (const width of [390, 768, 1440]) {
    for (const route of ['/services/synthetic-service-141414141414', '/contact', '/appointment?service=pub_141414141414', '/doctors?q=blood%20sugar', '/referrals']) {
      await navigate(route, width)
      assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, `${route} fits ${width}`)
      assert.equal(await evaluate(`document.querySelector('a[href^="/health-topics"]') === null`), true)
      await shot(`${route.split('?')[0].replaceAll('/', '-').slice(1)}-${width}`)
    }
  }
  const serviceRedirects = [
    ['diabetes', '141414141414'],
    ['digestive-concerns', '141414141414'],
    ['high-blood-pressure', '141414141414'],
    ['thyroid-concerns', '141414141414'],
    ['back-pain', '171717171717'],
    ['joint-pain', '171717171717'],
  ]
  for (const [slug, id] of serviceRedirects) {
    const response = await fetch(`${origin}/health-topics/${slug}`, { redirect: 'manual' })
    assert.equal(response.status, 308, slug)
    assert.equal(response.headers.get('location'), `/services/synthetic-service-${id}`)
  }
  const retiredTopics = ['allergies', 'asthma', 'everyday-wellbeing', 'headaches', 'sleep-concerns', 'vision-concerns', 'not-a-topic']
  for (const route of ['/health-topics', ...retiredTopics.map(slug => `/health-topics/${slug}`)]) {
    assert.equal((await fetch(origin + route, { redirect: 'manual' })).status, 404, route)
  }
  await navigate('/doctors?q=blood%20sugar', 390)
  assert.ok(await evaluate("document.querySelectorAll('[data-clinician-public-id]').length > 0"))
  assert.match(await evaluate("document.querySelector('[data-clinician-public-id]').innerText"), /Related care: Family medicine/)
  await navigate('/doctors?q=headache', 390)
  assert.equal(await evaluate("document.querySelectorAll('[data-clinician-public-id]').length"), 0)
  await evaluate(`document.querySelector('[data-directory-empty] a[href="/contact#contact-reception"]').focus()`)
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
  await until("location.pathname === '/contact' && document.activeElement.id === 'contact-reception'")
  await navigate('/health-topics/diabetes', 390)
  await until("location.pathname === '/services/synthetic-service-141414141414'")
  await evaluate(`document.querySelector('main a[href="/appointment?service=pub_141414141414"]').click()`)
  await until("location.pathname === '/appointment' && location.search.includes('service=pub_141414141414')")
  await until(ready)
  assert.equal(await evaluate("document.querySelector('#service-id').value"), 'pub_141414141414')
  await evaluate("document.querySelector('input[value=\"follow-up\"]').click()")
  await until("document.querySelector('[data-journey-value=visit]').textContent === 'Follow-up visit'")
  await evaluate("document.querySelector('[data-journey-next]').click()")
  await until("document.querySelector('[data-appointment-template]').dataset.journeyStep === '1'")
  await evaluate("document.querySelector('#full-name').value = 'TEST PATIENT'; document.querySelector('#phone').value = '+0 000 000 0000'; document.querySelector('#privacy-acknowledged').click()")
  await evaluate("document.querySelector('[data-journey-next]').click()")
  await until("document.querySelector('[data-appointment-template]').dataset.journeyStep === '2'")
  assert.equal(await evaluate("document.querySelector('[data-journey-review] [data-journey-value=visit]').textContent"), 'Follow-up visit')
  assert.equal(await evaluate("document.querySelector('[data-journey-review] [data-journey-value=care]').textContent"), 'Family medicine')
  await shot('appointment-follow-up-review-390')
  await navigate('/health-topics/back-pain', 390)
  await until("location.pathname === '/services/synthetic-service-171717171717'")
  assert.ok(await evaluate(`!!document.querySelector('main a[href="/appointment?service=pub_171717171717"]')`))
  for (const [id, destination] of [
    ['121212121212', '/services/synthetic-service-111111111111#care-team'],
    ['131313131313', '/contact#before-you-travel'],
    ['191919191919', '/contact#contact-reception'],
  ]) {
    const response = await fetch(origin + '/services/synthetic-service-' + id, { redirect: 'manual' })
    assert.equal(response.status, 308)
    assert.equal(response.headers.get('location'), destination)
  }
  await navigate('/services/synthetic-service-121212121212#prepare', 390)
  await until("location.pathname === '/services/synthetic-service-111111111111' && location.hash === '#care-team'")
  await navigate('/patients-visitors#checklist', 390)
  await until("location.pathname === '/contact' && location.hash === '#before-you-travel'")
  assert.match(await evaluate("document.querySelector('#what-to-bring').innerText"), /What to bring/)
  await shot('visit-preparation-390')
  await send('Emulation.setEmulatedMedia', { media: 'screen', features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await navigate('/doctors?q=headache', 320)
  assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true)
  await shot('doctor-search-empty-320')
  await send('Emulation.setScriptExecutionDisabled', { value: true })
  await navigate('/health-topics/diabetes', 390)
  assert.equal(await evaluate("document.querySelector('main h1').textContent"), 'Family medicine')
  await send('Emulation.setScriptExecutionDisabled', { value: false })
  assert.deepEqual(errors, [], 'no browser errors')
  assert.equal(requests.some((request) => request.method === 'POST'), false, 'preview sends no submissions')
  console.log(`Care journey browser checks passed: redirects, retired routes, three widths, doctor aliases, reception keyboard access, service-to-appointment handoff, follow-up review, legacy visit links, reduced motion and no-JavaScript redirect. Screenshots: ${capture}`)
} catch (error) {
  console.error(browserLog.slice(-4000))
  throw error
} finally {
  socket?.close()
  browser.kill('SIGTERM')
  await pause(250)
  await rm(profile, { recursive: true, force: true })
}
