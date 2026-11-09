import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Run against the existing local demo: pnpm dev, then pnpm --dir apps/web patient-guide:smoke.
const origin = 'http://localhost:3000'
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
    await until("document.readyState === 'complete' && !!document.querySelector('[data-open-patient-guide]')")
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
    for (const route of ['/health-topics/diabetes', '/patients-visitors', '/appointment?service=pub_141414141414', '/doctors?q=blood%20sugar', '/referrals']) {
      await navigate(route, width)
      assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, `${route} fits ${width}`)
      await shot(`${route.split('?')[0].replaceAll('/', '-').slice(1)}-${width}`)
    }
  }
  const topics = ['allergies', 'asthma', 'back-pain', 'diabetes', 'digestive-concerns', 'everyday-wellbeing', 'headaches', 'high-blood-pressure', 'joint-pain', 'sleep-concerns', 'thyroid-concerns', 'vision-concerns']
  for (const slug of topics) assert.equal((await fetch(`${origin}/health-topics/${slug}`)).status, 200, slug)
  assert.equal((await fetch(`${origin}/health-topics/not-a-topic`)).status, 404)
  await navigate('/doctors?q=blood%20sugar', 390)
  assert.ok(await evaluate("document.querySelectorAll('[data-clinician-public-id]').length > 0"))
  assert.ok(await evaluate("document.querySelector('a[href=\"/health-topics/diabetes\"]') !== null"))
  assert.match(await evaluate("document.querySelector('[data-clinician-public-id]').innerText"), /Related care: Family medicine/)
  await navigate('/doctors?q=backache', 390)
  assert.equal(await evaluate("document.querySelectorAll('[data-clinician-public-id]').length"), 0)
  assert.ok(await evaluate("document.querySelector('a[href=\"/health-topics/back-pain\"]') !== null"))
  await navigate('/', 390)
  await evaluate("document.querySelector('#health-library a').click()")
  await until("location.pathname === '/health-topics' && !!document.querySelector('#health-topic-search')")
  await evaluate("document.querySelector('#health-topic-search').focus()")
  await send('Input.insertText', { text: 'blood sugar' })
  await until("document.querySelector('[data-health-topic=diabetes]') !== null")
  await evaluate("document.querySelector('[data-health-topic=diabetes]').click()")
  await evaluate("document.querySelector('#health-topic-reader a[href=\"/health-topics/diabetes\"]').click()")
  await until("location.pathname === '/health-topics/diabetes'")
  await evaluate("document.querySelector('#care-options a[href*=\"service=\"]').click()")
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
  await navigate('/patients-visitors', 390)
  const stored = await evaluate('JSON.stringify({local: {...localStorage}, session: {...sessionStorage}})')
  await evaluate("document.querySelector('#visit-check-0').click()")
  assert.equal(await evaluate("document.querySelector('#visit-check-0').checked"), true)
  assert.equal(await evaluate('JSON.stringify({local: {...localStorage}, session: {...sessionStorage}})'), stored)
  await evaluate("window.__printed = false; window.print = () => { window.__printed = true }; document.querySelector('#checklist button').click()")
  assert.equal(await evaluate('window.__printed'), true)
  await send('Emulation.setDeviceMetricsOverride', { width: 794, height: 1123, deviceScaleFactor: 1, mobile: false })
  await send('Emulation.setEmulatedMedia', { media: 'print' })
  await shot('visit-checklist-print')
  const pdf = await send('Page.printToPDF', { printBackground: true, paperWidth: 8.27, paperHeight: 11.69, marginTop: 0.5, marginBottom: 0.5, marginLeft: 0.5, marginRight: 0.5 })
  await writeFile(path.join(capture, 'visit-checklist.pdf'), Buffer.from(pdf.data, 'base64'))
  await send('Emulation.setEmulatedMedia', { media: 'screen', features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await navigate('/health-topics', 320)
  assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true)
  await shot('health-topics-320')
  await send('Emulation.setScriptExecutionDisabled', { value: true })
  await navigate('/health-topics/diabetes', 390)
  assert.match(await evaluate('document.body.innerText'), /Prepare for a conversation/)
  await send('Emulation.setScriptExecutionDisabled', { value: false })
  assert.deepEqual(errors, [], 'no browser errors')
  assert.equal(requests.some((request) => request.method === 'POST'), false, 'preview sends no submissions')
  console.log(`Care journey browser checks passed: 12 topic pages, 404, three widths, aliases, missing doctor relationships, homepage-to-topic-to-appointment handoff, follow-up review, checklist, print, reduced motion and no-JavaScript reading. Screenshots: ${capture}`)
} catch (error) {
  console.error(browserLog.slice(-4000))
  throw error
} finally {
  socket?.close()
  browser.kill('SIGTERM')
  await pause(250)
  await rm(profile, { recursive: true, force: true })
}
