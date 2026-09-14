import { spawn, spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { repositoryRoot } from './lib/repository-files.mjs'

const host = '127.0.0.1'
const appPort = 3212
const origin = `http://${host}:${appPort}`
const captureFlag = process.argv.indexOf('--capture-dir')
const captureDirectory = captureFlag >= 0 ? path.resolve(process.argv[captureFlag + 1] ?? '') : undefined
const browserProfile = await mkdtemp(path.join(tmpdir(), 'hallelujah-foundations-'))
const browserExecutable = findBrowser()
const environment = {
  ...process.env,
  APP_ENVIRONMENT: 'local',
  EXTERNAL_SERVICES: 'disabled',
  LOCAL_DATABASE_URL: `postgresql://content_local:${randomBytes(18).toString('hex')}@127.0.0.1:5432/hallelujah_content_local`,
  LOCAL_PAYLOAD_SECRET: randomBytes(32).toString('base64url'),
  NEXT_TELEMETRY_DISABLED: '1',
  PERSONAL_DATA_COLLECTION: 'disabled',
}
const usesProcessGroup = process.platform !== 'win32'
const server = spawn('pnpm', ['--dir', 'apps/web', 'start', '--hostname', host, '--port', String(appPort)], {
  cwd: repositoryRoot,
  detached: usesProcessGroup,
  env: environment,
  stdio: ['ignore', 'pipe', 'pipe'],
})
const browser = spawn(
  browserExecutable,
  [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--no-first-run',
    '--no-default-browser-check',
    '--remote-debugging-address=127.0.0.1',
    '--remote-debugging-port=0',
    `--user-data-dir=${browserProfile}`,
    'about:blank',
  ],
  { stdio: ['ignore', 'pipe', 'pipe'] },
)
let serverOutput = ''
let browserOutput = ''
server.stdout.on('data', (chunk) => { serverOutput += chunk.toString() })
server.stderr.on('data', (chunk) => { serverOutput += chunk.toString() })
browser.stdout.on('data', (chunk) => { browserOutput += chunk.toString() })
browser.stderr.on('data', (chunk) => { browserOutput += chunk.toString() })

try {
  await waitForServer()
  const devtools = await waitForDevTools()
  const client = await createDevToolsClient(devtools)
  const { targetId } = await client.send('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await client.send('Target.attachToTarget', { flatten: true, targetId })
  await client.send('Page.enable', {}, sessionId)
  await client.send('Runtime.enable', {}, sessionId)
  await client.send('Page.navigate', { url: origin }, sessionId)
  await waitForDocument(client, sessionId)

  const viewports = [
    { height: 900, label: 320, width: 320 },
    { height: 900, label: 360, width: 360 },
    { height: 900, label: 375, width: 375 },
    { height: 375, label: 'phone-landscape', width: 667 },
    { height: 900, label: 'tablet', width: 768 },
    { height: 900, label: 1280, width: 1280 },
    { height: 900, label: 1440, width: 1440 },
  ]
  for (const viewport of viewports) {
    await client.send(
      'Emulation.setDeviceMetricsOverride',
      {
        deviceScaleFactor: 1,
        height: viewport.height,
        mobile: false,
        screenHeight: viewport.height,
        screenWidth: viewport.width,
        width: viewport.width,
      },
      sessionId,
    )
    await settleLayout()
    const result = await evaluate(client, sessionId, renderedChecksSource())
    assertViewport(viewport.label, result)
    if (captureDirectory && (viewport.width === 320 || viewport.width === 1440)) {
      await mkdir(captureDirectory, { recursive: true })
      const { data } = await client.send(
        'Page.captureScreenshot',
        { captureBeyondViewport: true, format: 'png', fromSurface: true },
        sessionId,
      )
      await writeFile(
        path.join(captureDirectory, `b01-004-foundations-${viewport.width}.png`),
        data,
        'base64',
      )
    }
  }

  await client.send(
    'Emulation.setDeviceMetricsOverride',
    { deviceScaleFactor: 1, height: 900, mobile: false, screenHeight: 900, screenWidth: 1280, width: 640 },
    sessionId,
  )
  await settleLayout()
  assertViewport('200%-equivalent', await evaluate(client, sessionId, renderedChecksSource()))

  await client.send(
    'Emulation.setDeviceMetricsOverride',
    { deviceScaleFactor: 1, height: 900, mobile: false, screenHeight: 900, screenWidth: 1280, width: 320 },
    sessionId,
  )
  await settleLayout()
  assertViewport('400%-equivalent', await evaluate(client, sessionId, renderedChecksSource()))

  await evaluate(client, sessionId, "document.documentElement.style.fontSize = '200%'")
  await settleLayout()
  assertViewport('200%-text', await evaluate(client, sessionId, renderedChecksSource()))
  await evaluate(client, sessionId, "document.documentElement.style.removeProperty('font-size')")

  await client.send(
    'Emulation.setEmulatedMedia',
    { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }], media: 'screen' },
    sessionId,
  )
  const reducedMotionResult = await evaluate(
    client,
    sessionId,
    `(() => ({
      active: matchMedia('(prefers-reduced-motion: reduce)').matches,
      duration: getComputedStyle(document.documentElement)
        .getPropertyValue('--semantic-motion-cinematic-duration')
        .trim(),
    }))()`,
  )
  if (!reducedMotionResult.active || Number.parseFloat(reducedMotionResult.duration) !== 0) {
    fail(`reduced-motion equivalent: ${JSON.stringify(reducedMotionResult)}`)
  }

  await client.send('Emulation.setEmulatedMedia', { media: 'print' }, sessionId)
  const printResult = await evaluate(
    client,
    sessionId,
    `(() => {
      const body = getComputedStyle(document.body)
      const surface = getComputedStyle(document.querySelector('[class*="surface"]'))
      return { background: body.backgroundColor, minHeight: body.minHeight, shadow: surface.boxShadow }
    })()`,
  )
  if (printResult.background !== 'rgb(255, 255, 255)') fail(`print background: ${printResult.background}`)
  if (printResult.shadow !== 'none') fail(`print surface shadow: ${printResult.shadow}`)

  await client.send(
    'Emulation.setEmulatedMedia',
    { features: [{ name: 'forced-colors', value: 'active' }], media: 'screen' },
    sessionId,
  )
  const forcedColorsResult = await evaluate(
    client,
    sessionId,
    `(() => {
      const control = document.querySelector('[data-foundation-control]')
      control.focus()
      const focus = getComputedStyle(control)
      const surface = getComputedStyle(document.querySelector('[class*="surface"]'))
      return {
        active: matchMedia('(forced-colors: active)').matches,
        outlineStyle: focus.outlineStyle,
        outlineWidth: focus.outlineWidth,
        shadow: surface.boxShadow,
      }
    })()`,
  )
  if (!forcedColorsResult.active) fail('forced-colors media emulation did not activate')
  if (forcedColorsResult.outlineStyle === 'none' || Number.parseFloat(forcedColorsResult.outlineWidth) < 3) {
    fail(`forced-colors focus indicator: ${forcedColorsResult.outlineStyle} ${forcedColorsResult.outlineWidth}`)
  }
  if (forcedColorsResult.shadow !== 'none') fail(`forced-colors surface shadow: ${forcedColorsResult.shadow}`)

  client.close()
  if (process.exitCode) throw new Error('one or more rendered foundation assertions failed')
  console.log(
    'Rendered foundation smoke passed (320/360/375/landscape/tablet/1280/1440, zoom and enlarged-text equivalents, focus, touch target, bilingual type, reduced motion, print, and forced colors).',
  )
} catch (error) {
  console.error(`Rendered foundation smoke failed: ${error.message}`)
  if (serverOutput.trim()) console.error('Application server output was captured without environment values.')
  if (browserOutput.trim()) console.error('Browser output was captured; rerun directly for local diagnostics.')
  process.exitCode = 1
} finally {
  stopProcess(server)
  stopProcess(browser)
  await Promise.all([waitForExit(server), waitForExit(browser)])
  stopProcess(server, 'SIGKILL')
  stopProcess(browser, 'SIGKILL')
  await rm(browserProfile, { force: true, recursive: true })
}

function findBrowser() {
  const candidates = [
    'google-chrome-stable',
    'google-chrome',
    'chromium',
    'chromium-browser',
    '/snap/chromium/current/usr/lib/chromium-browser/chrome',
  ]
  for (const candidate of candidates) {
    const result = spawnSync(candidate, ['--version'], { encoding: 'utf8' })
    if (result.status === 0) return candidate
  }
  throw new Error(`no supported Chromium executable found (${candidates.join(', ')})`)
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) throw new Error('application server exited before becoming ready')
    try {
      const response = await fetch(`${origin}/health`, { signal: AbortSignal.timeout(500) })
      if (response.ok) return
    } catch {
      // The local process is still starting.
    }
    await pause(250)
  }
  throw new Error('application server did not become ready within 15 seconds')
}

async function waitForDevTools() {
  const activePortPath = path.join(browserProfile, 'DevToolsActivePort')
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (browser.exitCode !== null) throw new Error('browser exited before DevTools became ready')
    try {
      const [port, webSocketPath] = (await readFile(activePortPath, 'utf8')).trim().split('\n')
      if (port && webSocketPath) return `ws://${host}:${port}${webSocketPath}`
    } catch {
      // Chromium has not written its endpoint yet.
    }
    await pause(250)
  }
  throw new Error('browser DevTools endpoint did not become ready within 15 seconds')
}

async function createDevToolsClient(url) {
  const socket = new WebSocket(url)
  const pending = new Map()
  let nextId = 0
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    const operation = pending.get(message.id)
    if (!operation) return
    pending.delete(message.id)
    if (message.error) operation.reject(new Error(message.error.message))
    else operation.resolve(message.result)
  })
  return {
    close: () => socket.close(),
    send(method, params = {}, sessionId) {
      const id = ++nextId
      return new Promise((resolve, reject) => {
        pending.set(id, { reject, resolve })
        socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
      })
    },
  }
}

async function waitForDocument(client, sessionId) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const ready = await evaluate(client, sessionId, 'document.readyState')
    if (ready === 'complete') return
    await pause(100)
  }
  throw new Error('foundation document did not finish loading')
}

async function evaluate(client, sessionId, expression) {
  const { exceptionDetails, result } = await client.send(
    'Runtime.evaluate',
    { awaitPromise: true, expression, returnByValue: true },
    sessionId,
  )
  if (exceptionDetails) throw new Error(exceptionDetails.text)
  return result.value
}

function assertViewport(label, result) {
  if (result.viewportOverflow > 1) fail(`${label}: page overflows by ${result.viewportOverflow}px`)
  if (result.clipped.length > 0) fail(`${label}: clipped content ${JSON.stringify(result.clipped)}`)
  if (result.control.width < 44 || result.control.height < 44) {
    fail(`${label}: control is ${result.control.width}×${result.control.height}`)
  }
  if (result.focus.style === 'none' || result.focus.width < 3) {
    fail(`${label}: focus indicator is ${result.focus.style} ${result.focus.width}px`)
  }
  if (!result.amharicFont.toLowerCase().includes('noto sans ethiopic')) {
    fail(`${label}: Amharic font stack is ${result.amharicFont}`)
  }
  if (result.readingWidth > 721) fail(`${label}: reading measure is ${result.readingWidth}px`)
  if (result.bodyLineRatio < 1.5) fail(`${label}: body line-height ratio is ${result.bodyLineRatio}`)
}

function fail(message) {
  console.error(`- ${message}`)
  process.exitCode = 1
}

function stopProcess(processHandle, signal = 'SIGTERM') {
  try {
    if (usesProcessGroup && processHandle === server && processHandle.pid) {
      process.kill(-processHandle.pid, signal)
    }
    else processHandle.kill(signal)
  } catch (error) {
    if (error.code !== 'ESRCH') throw error
  }
}

async function waitForExit(processHandle) {
  if (processHandle.exitCode !== null) return
  await Promise.race([
    new Promise((resolve) => processHandle.once('exit', resolve)),
    pause(2000),
  ])
}

function pause(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

function settleLayout() {
  return pause(100)
}

function renderedChecksSource() {
  return `(() => {
  const root = document.documentElement
  const control = document.querySelector('[data-foundation-control]')
  const reading = document.querySelector('.ds-reading')
  const amharic = document.querySelector('[lang="am"]')
  control.focus()
  const focus = getComputedStyle(control)
  const body = getComputedStyle(document.body)
  const excludedOverflow = new Set(['auto', 'scroll'])
  const clipped = [...document.body.querySelectorAll('*')]
    .filter((element) => {
      const style = getComputedStyle(element)
      return element.scrollWidth > element.clientWidth + 1 && !excludedOverflow.has(style.overflowX)
    })
    .slice(0, 8)
    .map((element) => ({
      clientWidth: element.clientWidth,
      element: element.tagName.toLowerCase()
        + (element.id ? '#' + element.id : '')
        + (typeof element.className === 'string' && element.className
          ? '.' + element.className.trim().replaceAll(/\s+/g, '.')
          : ''),
      overflowX: getComputedStyle(element).overflowX,
      scrollWidth: element.scrollWidth,
    }))
  const controlRect = control.getBoundingClientRect()
  return {
    amharicFont: getComputedStyle(amharic).fontFamily,
    bodyLineRatio: Number.parseFloat(body.lineHeight) / Number.parseFloat(body.fontSize),
    clipped,
    control: { height: controlRect.height, width: controlRect.width },
    focus: { style: focus.outlineStyle, width: Number.parseFloat(focus.outlineWidth) },
    readingWidth: reading.getBoundingClientRect().width,
    viewportOverflow: root.scrollWidth - root.clientWidth,
  }
})()`
}
