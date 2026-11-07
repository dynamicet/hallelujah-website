import { spawn, spawnSync } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { setTimeout as pause } from 'node:timers/promises'

// Repository-owned Chromium DevTools transport. No skill installation is required.
export class Browser {
  static async launch() {
    const executable = [process.env.CHROME_PATH, 'google-chrome-stable', 'google-chrome',
      '/snap/chromium/current/usr/lib/chromium-browser/chrome', 'chromium', 'chromium-browser']
      .find(candidate => candidate && spawnSync(candidate, ['--version'], { encoding: 'utf8' }).status === 0)
    if (!executable) throw new Error('Chromium is required. Set CHROME_PATH to its executable.')
    const browser = new Browser()
    browser.profile = await mkdtemp(path.join(tmpdir(), 'hh-visual-'))
    browser.pending = new Map()
    browser.pages = new Map()
    browser.nextId = 0
    browser.process = spawn(executable, ['--headless=new', '--no-first-run',
      '--no-default-browser-check', '--disable-background-timer-throttling',
      '--remote-debugging-address=127.0.0.1', '--remote-debugging-port=0',
      `--user-data-dir=${browser.profile}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] })
    let stderr = ''
    let startupError
    browser.process.on('error', error => { startupError = error })
    browser.process.stderr.on('data', chunk => { stderr = (stderr + chunk).slice(-8000) })
    try {
      let endpoint
      for (let attempt = 0; attempt < 100; attempt++) {
        endpoint = stderr.match(/DevTools listening on (ws:\/\/\S+)/)?.[1]
        if (endpoint) break
        if (startupError) throw startupError
        if (browser.process.exitCode !== null) throw new Error(`Chromium exited: ${stderr}`)
        await pause(100)
      }
      if (!endpoint) throw new Error(`Chromium startup timed out: ${stderr}`)
      browser.socket = new WebSocket(endpoint)
      await new Promise((resolve, reject) => {
        browser.socket.addEventListener('open', resolve, { once: true })
        browser.socket.addEventListener('error', reject, { once: true })
      })
      browser.socket.addEventListener('message', event => browser.receive(JSON.parse(event.data)))
      browser.socket.addEventListener('close', () => {
        for (const operation of browser.pending.values()) {
          clearTimeout(operation.timer)
          operation.reject(new Error('Chromium connection closed'))
        }
        browser.pending.clear()
      })
      return browser
    } catch (error) {
      await browser.close()
      throw error
    }
  }

  receive(message) {
    const page = this.pages.get(message.sessionId)
    if (message.method === 'Runtime.exceptionThrown') page?.consoleErrors.push(message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text)
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
      page?.consoleErrors.push(message.params.args.map(arg => arg.value ?? arg.description ?? '').join(' '))
    }
    const operation = this.pending.get(message.id)
    if (!operation) return
    clearTimeout(operation.timer)
    this.pending.delete(message.id)
    if (message.error) operation.reject(new Error(message.error.message))
    else operation.resolve(message.result)
  }

  send(method, params = {}, sessionId) {
    const id = ++this.nextId
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id)
        reject(new Error(`${method} timed out`))
      }, 30000)
      this.pending.set(id, { resolve, reject, timer })
      this.socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
    })
  }

  async newPage(options) {
    const { targetId } = await this.send('Target.createTarget', { url: 'about:blank' })
    const { sessionId } = await this.send('Target.attachToTarget', { targetId, flatten: true })
    const page = new Page(this, targetId, sessionId)
    this.pages.set(sessionId, page)
    await page.send('Page.enable')
    await page.send('Runtime.enable')
    await page.send('Network.enable')
    await page.send('Network.setCacheDisabled', { cacheDisabled: true })
    await page.setViewport(options)
    await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: options.reducedMotion ? 'reduce' : 'no-preference' }] })
    return page
  }

  async close() {
    this.socket?.close()
    if (this.process && this.process.exitCode === null && this.process.signalCode === null) {
      const exited = new Promise(resolve => this.process.once('exit', resolve))
      this.process.kill('SIGTERM')
      await Promise.race([exited, pause(2000)])
      if (this.process.exitCode === null && this.process.signalCode === null) {
        this.process.kill('SIGKILL')
        await exited
      }
    }
    if (this.profile) await rm(this.profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
  }
}

class Page {
  constructor(browser, targetId, sessionId) {
    Object.assign(this, { browser, targetId, sessionId, consoleErrors: [] })
  }

  send(method, params) {
    if (method === 'Emulation.setScriptExecutionDisabled') this.scriptsDisabled = params.value
    return this.browser.send(method, params, this.sessionId)
  }

  async setViewport({ width, height, mobile = false }) {
    await this.send('Emulation.setDeviceMetricsOverride', { width, height, mobile, deviceScaleFactor: 1 })
  }

  async eval(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression: typeof expression === 'function' ? `(${expression})()` : expression,
      returnByValue: true, awaitPromise: true,
    })
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text)
    return result.result.value
  }

  async goto(url) {
    // Reset first so the previous document cannot satisfy the readiness check.
    await this.send('Page.navigate', { url: 'about:blank' })
    const result = await this.send('Page.navigate', { url })
    if (result.errorText) throw new Error(`Navigation failed: ${result.errorText}`)
    for (let attempt = 0; attempt < 200; attempt++) {
      if (await this.eval(`location.href !== 'about:blank' && document.readyState === 'complete' && (${Boolean(this.scriptsDisabled)} || document.documentElement.dataset.hydration !== 'pending')`)) {
        await this.eval('document.fonts.ready.then(() => true)')
        return
      }
      await pause(100)
    }
    throw new Error(`Navigation timed out: ${url}`)
  }

  async screenshot({ path: filename, fullPage = false }) {
    const format = /\.jpe?g$/i.test(filename) ? 'jpeg' : 'png'
    let clip
    if (fullPage) {
      const { cssContentSize } = await this.send('Page.getLayoutMetrics')
      clip = { x: 0, y: 0, width: cssContentSize.width, height: cssContentSize.height, scale: 1 }
    }
    const { data } = await this.send('Page.captureScreenshot', { format, captureBeyondViewport: fullPage, ...(clip ? { clip } : {}) })
    await writeFile(filename, Buffer.from(data, 'base64'))
  }

  async close() {
    await this.browser.send('Target.closeTarget', { targetId: this.targetId })
    this.browser.pages.delete(this.sessionId)
  }
}
