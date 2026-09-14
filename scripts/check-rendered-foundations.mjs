import { spawn, spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { repositoryRoot } from './lib/repository-files.mjs'

const host = '127.0.0.1'
const appPort = 3212
const origin = `http://${host}:${appPort}`
const browserPort = 20_000 + (randomBytes(2).readUInt16BE(0) % 30_000)
const captureFlag = process.argv.indexOf('--capture-dir')
const captureDirectory = captureFlag >= 0 ? path.resolve(process.argv[captureFlag + 1] ?? '') : undefined
const capturePrefixFlag = process.argv.indexOf('--capture-prefix')
const capturePrefix =
  capturePrefixFlag >= 0 ? process.argv[capturePrefixFlag + 1] : 'b01-004-foundations'
const shellMode = process.argv.includes('--shell')
const searchControlsMode = process.argv.includes('--search-controls')
const formPrimitivesMode = process.argv.includes('--form-primitives')
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
    `--remote-debugging-port=${browserPort}`,
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
  if (shellMode) await waitForShellEnhancement(client, sessionId)
  if (searchControlsMode) await waitForSearchControlsEnhancement(client, sessionId)
  if (formPrimitivesMode) await waitForFormPrimitivesEnhancement(client, sessionId)

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
    if (shellMode) {
      assertShellViewport(
        viewport.label,
        viewport.width,
        await evaluate(client, sessionId, renderedShellChecksSource()),
      )
    }
    if (searchControlsMode) {
      assertSearchControlsViewport(
        viewport.label,
        viewport.width,
        await evaluate(client, sessionId, renderedSearchControlsChecksSource()),
      )
    }
    if (formPrimitivesMode) {
      assertFormPrimitivesViewport(
        viewport.label,
        await evaluate(client, sessionId, renderedFormPrimitivesChecksSource()),
      )
    }
    if (captureDirectory && (viewport.width === 320 || viewport.width === 1440)) {
      await evaluate(
        client,
        sessionId,
        `(() => {
          if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
          window.scrollTo(0, 0)
        })()`,
      )
      await settleLayout()
      await mkdir(captureDirectory, { recursive: true })
      const { data } = await client.send(
        'Page.captureScreenshot',
        { captureBeyondViewport: true, format: 'png', fromSurface: true },
        sessionId,
      )
      await writeFile(
        path.join(captureDirectory, `${capturePrefix}-${viewport.width}.png`),
        data,
        'base64',
      )
    }
  }

  if (shellMode) {
    await client.send(
      'Emulation.setDeviceMetricsOverride',
      {
        deviceScaleFactor: 1,
        height: 900,
        mobile: false,
        screenHeight: 900,
        screenWidth: 320,
        width: 320,
      },
      sessionId,
    )
    await settleLayout()
    await evaluate(client, sessionId, "document.querySelector('[data-menu-trigger]').click()")
    await settleLayout()
    const openMenu = await evaluate(
      client,
      sessionId,
      `(() => {
        const trigger = document.querySelector('[data-menu-trigger]')
        const panel = document.querySelector('[data-navigation-panel]')
        return {
          open: panel.matches(':popover-open'),
          panelHeight: panel.getBoundingClientRect().height,
        }
      })()`,
    )
    if (!openMenu.open || openMenu.panelHeight === 0) {
      fail(`compact menu did not expose its controlled panel: ${JSON.stringify(openMenu)}`)
    }

    await evaluate(
      client,
      sessionId,
      "document.querySelector('[data-primary-navigation] a').focus()",
    )
    await client.send(
      'Input.dispatchKeyEvent',
      { code: 'Escape', key: 'Escape', type: 'rawKeyDown', windowsVirtualKeyCode: 27 },
      sessionId,
    )
    await client.send(
      'Input.dispatchKeyEvent',
      { code: 'Escape', key: 'Escape', type: 'keyUp', windowsVirtualKeyCode: 27 },
      sessionId,
    )
    await settleLayout()
    const closedMenu = await evaluate(
      client,
      sessionId,
      `(() => {
        const trigger = document.querySelector('[data-menu-trigger]')
        const panel = document.querySelector('[data-navigation-panel]')
        return {
          activeIsTrigger: document.activeElement === trigger,
          open: panel.matches(':popover-open'),
        }
      })()`,
    )
    if (closedMenu.open || !closedMenu.activeIsTrigger) {
      fail(`Escape did not close the compact menu and restore focus: ${JSON.stringify(closedMenu)}`)
    }

    await evaluate(client, sessionId, "document.querySelector('[data-skip-link]').focus()")
    await client.send(
      'Input.dispatchKeyEvent',
      { code: 'Enter', key: 'Enter', type: 'rawKeyDown', windowsVirtualKeyCode: 13 },
      sessionId,
    )
    await client.send(
      'Input.dispatchKeyEvent',
      { code: 'Enter', key: 'Enter', type: 'keyUp', windowsVirtualKeyCode: 13 },
      sessionId,
    )
    await settleLayout()
    const skipResult = await evaluate(
      client,
      sessionId,
      `({
        activeId: document.activeElement?.id,
        hash: location.hash,
      })`,
    )
    if (skipResult.hash !== '#main-content' || skipResult.activeId !== 'main-content') {
      fail(`skip link did not land and focus main: ${JSON.stringify(skipResult)}`)
    }
  }

  if (searchControlsMode) {
    await evaluate(
      client,
      sessionId,
      `(() => {
        const disclosure = document.querySelector('[data-filter-disclosure]')
        const summary = disclosure.querySelector('summary')
        summary.click()
        disclosure.querySelector('input').focus()
      })()`,
    )
    await client.send(
      'Input.dispatchKeyEvent',
      { code: 'Escape', key: 'Escape', type: 'rawKeyDown', windowsVirtualKeyCode: 27 },
      sessionId,
    )
    await client.send(
      'Input.dispatchKeyEvent',
      { code: 'Escape', key: 'Escape', type: 'keyUp', windowsVirtualKeyCode: 27 },
      sessionId,
    )
    await settleLayout()
    const disclosureResult = await evaluate(
      client,
      sessionId,
      `(() => {
        const disclosure = document.querySelector('[data-filter-disclosure]')
        return {
          activeIsSummary: document.activeElement === disclosure.querySelector('summary'),
          open: disclosure.open,
        }
      })()`,
    )
    if (disclosureResult.open || !disclosureResult.activeIsSummary) {
      fail(`Escape did not close the compact filters and restore focus: ${JSON.stringify(disclosureResult)}`)
    }

    await evaluate(client, sessionId, "document.documentElement.dataset.searchControlsEnhanced = 'waiting'")
    await evaluate(
      client,
      sessionId,
      `document.querySelector('[data-pagination] a[aria-label="Go to page 2"]').click()`,
    )
    await waitForPathAndSearch(client, sessionId, '/?page=2')
    await waitForDocument(client, sessionId)
    await waitForSearchControlsEnhancement(client, sessionId)
    const pagedResult = await evaluate(
      client,
      sessionId,
      `(() => ({
        count: document.querySelector('[data-result-count]').textContent.trim(),
        currentPage: document.querySelector('[data-pagination] [aria-current="page"]')?.textContent.trim(),
        visibleResults: document.querySelectorAll('[data-search-controls-fixture] article').length,
      }))()`,
    )
    if (
      pagedResult.count !== '5 controlled results'
      || pagedResult.currentPage !== '2'
      || pagedResult.visibleResults !== 2
    ) {
      fail(`paginated GET state was not restored: ${JSON.stringify(pagedResult)}`)
    }

    await evaluate(client, sessionId, "document.documentElement.dataset.searchControlsEnhanced = 'waiting'")
    await evaluate(client, sessionId, 'history.back()')
    await waitForPathAndSearch(client, sessionId, '/')
    await waitForDocument(client, sessionId)
    await waitForSearchControlsEnhancement(client, sessionId)
    const backResult = await evaluate(
      client,
      sessionId,
      `(() => ({
        count: document.querySelector('[data-result-count]').textContent.trim(),
        page: document.querySelector('[data-pagination] [aria-current="page"]')?.textContent.trim(),
      }))()`,
    )
    if (backResult.count !== '5 controlled results' || backResult.page !== '1') {
      fail(`Back did not restore initial search state: ${JSON.stringify(backResult)}`)
    }

    const submittedParameters = await evaluate(
      client,
      sessionId,
      `(() => {
        const form = document.querySelector('[data-search-controls-form]')
        const query = form.querySelector('input[name="q"]')
        query.value = 'service'
        form.querySelector('input[name="type"][value="service"]').checked = true
        query.focus()
        return new URLSearchParams(new FormData(form)).toString()
      })()`,
    )
    if (submittedParameters !== 'q=service&type=service') {
      fail(`native GET controls serialized unexpected state: ${submittedParameters}`)
    }
    await evaluate(client, sessionId, "document.documentElement.dataset.searchControlsEnhanced = 'waiting'")
    await evaluate(
      client,
      sessionId,
      `document.querySelector('[data-search-box] button[type="submit"]').click()`,
    )
    await waitForPathAndSearch(client, sessionId, '/?q=service&type=service')
    await waitForDocument(client, sessionId)
    await waitForSearchControlsEnhancement(client, sessionId)
    const filteredResult = await evaluate(
      client,
      sessionId,
      `(() => ({
        activeFilters: document.querySelectorAll('[data-active-filters] li').length,
        count: document.querySelector('[data-result-count]').textContent.trim(),
        query: document.querySelector('input[name="q"]').value,
        selected: document.querySelector('input[name="type"][value="service"]').checked,
        visibleResults: document.querySelectorAll('[data-search-controls-fixture] article').length,
      }))()`,
    )
    if (
      filteredResult.activeFilters !== 1
      || filteredResult.count !== '2 controlled results'
      || filteredResult.query !== 'service'
      || !filteredResult.selected
      || filteredResult.visibleResults !== 2
    ) {
      fail(`submitted GET search/filter state is incorrect: ${JSON.stringify(filteredResult)}`)
    }

    const noScriptResponse = await fetch(`${origin}/?q=location&type=location`)
    const noScriptHtml = await noScriptResponse.text()
    const noScriptChecks = {
      count: /1(?:<!-- -->)? controlled (?:<!-- -->)?result/u.test(noScriptHtml),
      query: /name="q"[^>]*value="location"/u.test(noScriptHtml),
      record: noScriptHtml.includes('Controlled location record Alpha'),
      response: noScriptResponse.ok,
      selected: /checked=""[^>]*value="location"|value="location"[^>]*checked=""/u.test(noScriptHtml),
    }
    if (Object.values(noScriptChecks).some((passed) => !passed)) {
      fail(
        `no-JavaScript GET response did not retain the bounded search/filter state: ${JSON.stringify(noScriptChecks)}`,
      )
    }
  }

  if (formPrimitivesMode) {
    const initialPath = await evaluate(client, sessionId, 'location.pathname + location.search')
    await evaluate(
      client,
      sessionId,
      `(() => {
        const form = document.querySelector('[data-form-primitives-fixture] form')
        form.elements.controlledReference.value = 'WRONG'
        form.elements.reviewContext.value = 'responsive'
        form.elements.controlledNote.value = 'Synthetic retained wording'
        form.querySelector('[data-form-submit]').click()
      })()`,
    )
    const invalidPending = await evaluate(
      client,
      sessionId,
      `(() => {
        const form = document.querySelector('[data-form-primitives-fixture] form')
        return {
          busy: form.getAttribute('aria-busy'),
          pendingVisible: !form.querySelector('[data-form-status="pending"]').hidden,
          submitDisabled: form.querySelector('[data-form-submit]').disabled,
        }
      })()`,
    )
    if (
      invalidPending.busy !== 'true'
      || !invalidPending.pendingVisible
      || !invalidPending.submitDisabled
    ) {
      fail(`controlled invalid submit did not expose truthful pending state: ${JSON.stringify(invalidPending)}`)
    }
    await pause(120)
    const invalidResult = await evaluate(
      client,
      sessionId,
      `(() => {
        const fixture = document.querySelector('[data-form-primitives-fixture]')
        const form = fixture.querySelector('form')
        const summary = fixture.querySelector('[data-error-summary]')
        const reference = form.elements.controlledReference
        const channel = fixture.querySelector('[data-choice-group]')
        return {
          activeIsSummary: document.activeElement === summary,
          channelErrorVisible: !document.getElementById('controlled-channel-error').hidden,
          channelInvalid: channel.getAttribute('aria-invalid'),
          context: form.elements.reviewContext.value,
          firstErrorHref: summary.querySelector('a').getAttribute('href'),
          note: form.elements.controlledNote.value,
          path: location.pathname + location.search,
          referenceErrorVisible: !document.getElementById('controlled-reference-error').hidden,
          referenceInvalid: reference.getAttribute('aria-invalid'),
          referenceValue: reference.value,
          summaryVisible: !summary.hidden,
        }
      })()`,
    )
    if (
      !invalidResult.activeIsSummary
      || !invalidResult.channelErrorVisible
      || invalidResult.channelInvalid !== 'true'
      || invalidResult.context !== 'responsive'
      || invalidResult.firstErrorHref !== '#controlled-reference'
      || invalidResult.note !== 'Synthetic retained wording'
      || invalidResult.path !== initialPath
      || !invalidResult.referenceErrorVisible
      || invalidResult.referenceInvalid !== 'true'
      || invalidResult.referenceValue !== 'WRONG'
      || !invalidResult.summaryVisible
    ) {
      fail(`controlled invalid state or value retention is incorrect: ${JSON.stringify(invalidResult)}`)
    }

    await evaluate(
      client,
      sessionId,
      `(() => {
        const form = document.querySelector('[data-form-primitives-fixture] form')
        form.elements.controlledReference.value = 'CONTROLLED'
        form.querySelector('input[name="reviewChannel"][value="rendered"]').checked = true
        form.querySelector('[data-form-submit]').click()
      })()`,
    )
    const validPending = await evaluate(
      client,
      sessionId,
      `(() => {
        const form = document.querySelector('[data-form-primitives-fixture] form')
        return {
          busy: form.getAttribute('aria-busy'),
          pendingVisible: !form.querySelector('[data-form-status="pending"]').hidden,
          submitDisabled: form.querySelector('[data-form-submit]').disabled,
        }
      })()`,
    )
    if (
      validPending.busy !== 'true'
      || !validPending.pendingVisible
      || !validPending.submitDisabled
    ) {
      fail(`controlled valid submit did not expose truthful pending state: ${JSON.stringify(validPending)}`)
    }
    await pause(120)
    const validResult = await evaluate(
      client,
      sessionId,
      `(() => {
        const fixture = document.querySelector('[data-form-primitives-fixture]')
        const form = fixture.querySelector('form')
        return {
          failureVisible: !form.querySelector('[data-form-status="failure"]').hidden,
          interactiveReceiptCount: form.querySelectorAll('[data-form-status="receipt"]').length,
          note: form.elements.controlledNote.value,
          path: location.pathname + location.search,
          referenceValue: form.elements.controlledReference.value,
          selectedChannel: form.querySelector('input[name="reviewChannel"]:checked')?.value,
          summaryHidden: form.querySelector('[data-error-summary]').hidden,
        }
      })()`,
    )
    if (
      !validResult.failureVisible
      || validResult.interactiveReceiptCount !== 0
      || validResult.note !== 'Synthetic retained wording'
      || validResult.path !== initialPath
      || validResult.referenceValue !== 'CONTROLLED'
      || validResult.selectedChannel !== 'rendered'
      || !validResult.summaryHidden
    ) {
      fail(`controlled accepted-looking state was not blocked truthfully: ${JSON.stringify(validResult)}`)
    }

    const noScriptResponse = await fetch(origin)
    const noScriptHtml = await noScriptResponse.text()
    const noScriptForm = noScriptHtml.match(/<form[^>]*data-form-primitive[^>]*>[\s\S]*?<\/form>/u)?.[0] ?? ''
    const noScriptChecks = {
      disabled: /<button[^>]*disabled=""[^>]*data-form-submit|<button[^>]*data-form-submit[^>]*disabled=""/u.test(noScriptForm),
      method: /method="post"/u.test(noScriptForm),
      reason: noScriptForm.includes('submission stays') && noScriptForm.includes('no values leave'),
      response: noScriptResponse.ok,
    }
    if (Object.values(noScriptChecks).some((passed) => !passed)) {
      fail(`no-JavaScript form did not fail closed before collection: ${JSON.stringify(noScriptChecks)}`)
    }
  }

  await client.send(
    'Emulation.setDeviceMetricsOverride',
    {
      deviceScaleFactor: 1,
      height: 900,
      mobile: true,
      screenHeight: 900,
      screenWidth: 320,
      width: 320,
    },
    sessionId,
  )
  await client.send('Emulation.setTouchEmulationEnabled', { enabled: true }, sessionId)
  const touchTarget = await evaluate(
    client,
    sessionId,
    `(() => {
      const target = document.querySelector('[data-action-link]')
      target.scrollIntoView({ block: 'center' })
      window.__actionActivationCount = 0
      target.addEventListener('click', (event) => {
        event.preventDefault()
        window.__actionActivationCount += 1
      })
      const rect = target.getBoundingClientRect()
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    })()`,
  )
  await client.send(
    'Input.dispatchTouchEvent',
    {
      touchPoints: [{ id: 1, x: touchTarget.x, y: touchTarget.y }],
      type: 'touchStart',
    },
    sessionId,
  )
  await client.send(
    'Input.dispatchTouchEvent',
    {
      touchPoints: [{ id: 1, x: touchTarget.x, y: touchTarget.y - 80 }],
      type: 'touchMove',
    },
    sessionId,
  )
  await client.send('Input.dispatchTouchEvent', { touchPoints: [], type: 'touchEnd' }, sessionId)
  await settleLayout()
  const movedTouchActivations = await evaluate(
    client,
    sessionId,
    'window.__actionActivationCount',
  )
  if (movedTouchActivations !== 0) {
    fail(`moved touch activated an action ${movedTouchActivations} time(s)`)
  }
  await client.send('Emulation.setTouchEmulationEnabled', { enabled: false }, sessionId)
  await evaluate(client, sessionId, "document.querySelector('[data-action-link]').focus()")
  await client.send(
    'Input.dispatchKeyEvent',
    { code: 'Enter', key: 'Enter', type: 'rawKeyDown', windowsVirtualKeyCode: 13 },
    sessionId,
  )
  await client.send(
    'Input.dispatchKeyEvent',
    { code: 'Enter', key: 'Enter', type: 'keyUp', windowsVirtualKeyCode: 13 },
    sessionId,
  )
  const keyboardActivations = await evaluate(
    client,
    sessionId,
    'window.__actionActivationCount',
  )
  if (keyboardActivations !== 1) {
    fail(`keyboard activation count is ${keyboardActivations}, expected 1`)
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
    formPrimitivesMode
      ? 'Rendered foundation/action/shell/search/form smoke passed (responsive fields and choices, help/error relationships, invalid-summary focus, pending semantics, value retention, false-success prevention, no-JavaScript fail-closed behavior, zoom, reduced motion, print, and forced colors).'
      : searchControlsMode
      ? 'Rendered foundation/action/shell/search-control smoke passed (responsive controls, GET filtering and pagination, Back restoration, count semantics, compact Escape focus, bounded URLs, no-JavaScript state, targets, zoom, reduced motion, print, and forced colors).'
      : shellMode
      ? 'Rendered foundation/action/shell smoke passed (responsive single-order navigation, compact disclosure, Escape and skip-link focus, current state, breadcrumbs, language availability, targets, zoom, reduced motion, print, and forced colors).'
      : 'Rendered foundation/action smoke passed (responsive, zoom, enlarged text, names, targets, gaps, native keyboard and moved-touch behavior, phone invariant, protected emergency, focus, bilingual type, reduced motion, print, and forced colors).',
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
  await Promise.all([waitForExit(server), waitForExit(browser)])
  await rm(browserProfile, { force: true, maxRetries: 5, recursive: true, retryDelay: 100 })
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
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (browser.exitCode !== null) throw new Error('browser exited before DevTools became ready')
    try {
      const response = await fetch(`http://${host}:${browserPort}/json/version`, {
        signal: AbortSignal.timeout(500),
      })
      if (response.ok) {
        const version = await response.json()
        if (version.webSocketDebuggerUrl) return version.webSocketDebuggerUrl
      }
    } catch {
      // Chromium has not exposed its endpoint yet.
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

async function waitForShellEnhancement(client, sessionId) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const enhanced = await evaluate(
      client,
      sessionId,
      "document.documentElement.dataset.shellNavigationEnhanced === 'true'",
    )
    if (enhanced) return
    await pause(100)
  }
  throw new Error('first-party global shell enhancement did not load')
}

async function waitForSearchControlsEnhancement(client, sessionId) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const enhanced = await evaluate(
      client,
      sessionId,
      "document.documentElement.dataset.searchControlsEnhanced === 'true'",
    )
    if (enhanced) return
    await pause(100)
  }
  throw new Error('first-party search-control enhancement did not load')
}

async function waitForFormPrimitivesEnhancement(client, sessionId) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const enhanced = await evaluate(
      client,
      sessionId,
      "document.documentElement.dataset.formPrimitivesEnhanced === 'true'",
    )
    if (enhanced) return
    await pause(100)
  }
  throw new Error('first-party form primitive enhancement did not load')
}

async function waitForPathAndSearch(client, sessionId, expectedValue) {
  let currentValue = ''
  for (let attempt = 0; attempt < 60; attempt += 1) {
    currentValue = await evaluate(client, sessionId, 'location.pathname + location.search')
    if (currentValue === expectedValue) return
    await pause(100)
  }
  throw new Error(
    `navigation did not reach expected controlled path and state ${expectedValue}; received ${currentValue}`,
  )
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
  for (const target of result.actionTargets) {
    if (target.width < 44 || target.height < 44) {
      fail(`${label}: ${target.name} target is ${target.width}×${target.height}`)
    }
    if (!target.name) fail(`${label}: action target has no visible accessible name`)
  }
  for (const gap of result.actionGroupGaps) {
    if (gap < 8) fail(`${label}: action group gap is ${gap}px`)
  }
  if (!result.call.matches) fail(`${label}: visible call number and tel value diverge`)
  if (!result.emergency.explicit || !result.emergency.hasIcon) {
    fail(`${label}: emergency action lacks explicit text or its supporting icon`)
  }
  if (result.emergency.experienceLevel !== '0' || result.emergency.duration !== 0) {
    fail(`${label}: emergency action is not protected at motion Level 0`)
  }
  if (result.actionFocus.style === 'none' || result.actionFocus.width < 3) {
    fail(`${label}: action focus indicator is ${result.actionFocus.style} ${result.actionFocus.width}px`)
  }
  if (!result.amharicFont.toLowerCase().includes('noto sans ethiopic')) {
    fail(`${label}: Amharic font stack is ${result.amharicFont}`)
  }
  if (result.readingWidth > 721) fail(`${label}: reading measure is ${result.readingWidth}px`)
  if (result.bodyLineRatio < 1.5) fail(`${label}: body line-height ratio is ${result.bodyLineRatio}`)
}

function assertShellViewport(label, width, result) {
  if (result.primaryNavigationCount !== 1) {
    fail(`${label}: found ${result.primaryNavigationCount} primary navigation regions, expected one`)
  }
  if (!result.currentPage || result.currentMarkerWidth < 3) {
    fail(`${label}: current navigation item lacks semantic or non-color state`)
  }
  if (result.breadcrumbOverflow > 1) {
    fail(`${label}: breadcrumb overflows by ${result.breadcrumbOverflow}px`)
  }
  if (!result.languageUnavailable || !result.languageReason) {
    fail(`${label}: unavailable language lacks explicit state or explanation`)
  }
  if (!result.footerPresent) fail(`${label}: semantic footer is missing`)
  if (width < 1024 && (result.triggerDisplay === 'none' || result.panelHeight !== 0)) {
    fail(`${label}: compact navigation disclosure state is incorrect`)
  }
  if (width >= 1024 && (result.triggerDisplay !== 'none' || result.panelHeight === 0)) {
    fail(`${label}: wide navigation state is incorrect`)
  }
  for (const target of result.visibleTargets) {
    if (target.width < 44 || target.height < 44) {
      fail(`${label}: shell target ${target.name} is ${target.width}×${target.height}`)
    }
    if (!target.name) fail(`${label}: visible shell target has no name`)
  }
}

function assertSearchControlsViewport(label, width, result) {
  if (!result.formLabel || result.formMethod !== 'get') {
    fail(`${label}: search form is not a labeled GET landmark`)
  }
  if (
    result.countAtomic !== 'true'
    || result.countLive !== 'polite'
    || result.countRole !== 'status'
  ) {
    fail(`${label}: result count is not one atomic polite status`)
  }
  if (result.invalidUrlKeys.length > 0) {
    fail(`${label}: non-allowlisted URL keys ${result.invalidUrlKeys.join(', ')}`)
  }
  if (width < 1024 && (result.filterSummaryDisplay === 'none' || result.filterPanelHeight !== 0)) {
    fail(
      `${label}: compact filter disclosure baseline is incorrect ${JSON.stringify(result.filterDisclosure)}`,
    )
  }
  if (width >= 1024 && (result.filterSummaryDisplay !== 'none' || result.filterPanelHeight === 0)) {
    fail(`${label}: wide filter panel is not persistently visible`)
  }
  for (const target of result.visibleTargets) {
    if (target.width < 44 || target.height < 44) {
      fail(`${label}: search target ${target.name} is ${target.width}×${target.height}`)
    }
    if (!target.name) fail(`${label}: visible search target has no name`)
  }
}

function assertFormPrimitivesViewport(label, result) {
  if (!result.formLabel || result.formMethod !== 'post') {
    fail(`${label}: controlled form is not a labeled POST form`)
  }
  if (!result.descriptionExists || result.invalidDescriptionIds.length > 0) {
    fail(`${label}: form help/error relationships are incomplete ${JSON.stringify(result.invalidDescriptionIds)}`)
  }
  if (result.requiredCopyCount < 3) {
    fail(`${label}: persistent required copy is missing`)
  }
  if (result.choiceGroupCount < 1 || result.fieldLabelCount < 4) {
    fail(`${label}: native field or choice labels are missing`)
  }
  if (!result.authoritativeReceipt || result.interactiveReceiptCount !== 0) {
    fail(`${label}: authoritative receipt boundary is incorrect`)
  }
  for (const target of result.visibleTargets) {
    if (target.width < 44 || target.height < 44) {
      fail(`${label}: form target ${target.name} is ${target.width}×${target.height}`)
    }
    if (!target.name) fail(`${label}: visible form target has no name`)
  }
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
  const actionsFixture = document.querySelector('[data-essential-actions-fixture]')
  const emergency = actionsFixture.querySelector('[data-emergency-action]')
  const call = actionsFixture.querySelector('[data-call-action]')
  control.focus()
  const controlFocusStyle = getComputedStyle(control)
  const focus = {
    style: controlFocusStyle.outlineStyle,
    width: Number.parseFloat(controlFocusStyle.outlineWidth),
  }
  emergency.focus()
  const emergencyFocusStyle = getComputedStyle(emergency)
  const actionFocus = {
    style: emergencyFocusStyle.outlineStyle,
    width: Number.parseFloat(emergencyFocusStyle.outlineWidth),
  }
  const body = getComputedStyle(document.body)
  const excludedOverflow = new Set(['auto', 'scroll'])
  const clipped = [...document.body.querySelectorAll('*')]
    .filter((element) => {
      const style = getComputedStyle(element)
      if (element.matches('input, textarea, select')) return false
      return element.scrollWidth > element.clientWidth + 1 && !excludedOverflow.has(style.overflowX)
    })
    .slice(0, 8)
    .map((element) => ({
      clientWidth: element.clientWidth,
      element: element.tagName.toLowerCase()
        + (element.id ? '#' + element.id : '')
        + (typeof element.className === 'string' && element.className
          ? '.' + element.className.trim().replaceAll(/\\s+/g, '.')
          : ''),
      overflowX: getComputedStyle(element).overflowX,
      scrollWidth: element.scrollWidth,
    }))
  const controlRect = control.getBoundingClientRect()
  const actionTargets = [...actionsFixture.querySelectorAll('a[href], button')].map((target) => {
    const rect = target.getBoundingClientRect()
    return {
      height: rect.height,
      name: target.innerText.trim(),
      tag: target.tagName.toLowerCase(),
      width: rect.width,
    }
  })
  const actionGroupGaps = [...actionsFixture.querySelectorAll('[data-action-group]')]
    .map((group) => Number.parseFloat(getComputedStyle(group).gap))
  const callNumber = call.querySelector('[data-call-number]').textContent.replace(/[\\s().-]/g, '')
  const emergencyStyle = getComputedStyle(emergency)
  return {
    actionFocus,
    actionGroupGaps,
    actionTargets,
    amharicFont: getComputedStyle(amharic).fontFamily,
    bodyLineRatio: Number.parseFloat(body.lineHeight) / Number.parseFloat(body.fontSize),
    clipped,
    control: { height: controlRect.height, width: controlRect.width },
    call: {
      matches: call.getAttribute('href') === 'tel:' + call.dataset.callValue
        && call.dataset.callValue === callNumber,
    },
    emergency: {
      duration: Number.parseFloat(emergencyStyle.transitionDuration),
      experienceLevel: emergency.dataset.experienceLevel,
      explicit: emergency.innerText.includes('Emergency'),
      hasIcon: Boolean(emergency.querySelector('[data-icon="emergency"]')),
    },
    focus,
    readingWidth: reading.getBoundingClientRect().width,
    viewportOverflow: root.scrollWidth - root.clientWidth,
  }
})()`
}

function renderedShellChecksSource() {
  return `(() => {
  const header = document.querySelector('[data-site-header]')
  const trigger = header.querySelector('[data-menu-trigger]')
  const panel = header.querySelector('[data-navigation-panel]')
  const current = header.querySelector('[data-primary-navigation] [aria-current="page"]')
  const currentStyle = getComputedStyle(current)
  const breadcrumb = document.querySelector('[data-breadcrumbs]')
  const unavailableLanguage = header.querySelector('[data-language-switcher] [aria-disabled="true"]')
  const reasonId = unavailableLanguage?.getAttribute('aria-describedby')
  const visibleTargets = [...header.querySelectorAll('a[href], summary')]
    .filter((target) => {
      const rect = target.getBoundingClientRect()
      const style = getComputedStyle(target)
      return style.display !== 'none' && rect.width > 0 && rect.height > 0
    })
    .map((target) => {
      const rect = target.getBoundingClientRect()
      return { height: rect.height, name: target.textContent.trim(), width: rect.width }
    })
  return {
    breadcrumbOverflow: breadcrumb.scrollWidth - breadcrumb.clientWidth,
    currentMarkerWidth: Math.max(
      Number.parseFloat(currentStyle.borderInlineStartWidth),
      Number.parseFloat(currentStyle.borderBlockEndWidth),
    ),
    currentPage: current.getAttribute('aria-current') === 'page',
    footerPresent: Boolean(document.querySelector('footer[data-site-footer]')),
    languageReason: Boolean(reasonId && document.getElementById(reasonId)?.textContent.trim()),
    languageUnavailable: unavailableLanguage?.getAttribute('aria-disabled') === 'true',
    panelHeight: panel.getBoundingClientRect().height,
    primaryNavigationCount: header.querySelectorAll('[data-primary-navigation]').length,
    triggerDisplay: getComputedStyle(trigger).display,
    visibleTargets,
  }
})()`
}

function renderedSearchControlsChecksSource() {
  return `(() => {
  const fixture = document.querySelector('[data-search-controls-fixture]')
  const form = fixture.querySelector('[data-search-controls-form]')
  const count = fixture.querySelector('[data-result-count]')
  const disclosure = fixture.querySelector('[data-filter-disclosure]')
  const allowedUrlKeys = new Set(['q', 'type', 'page'])
  const invalidUrlKeys = [...fixture.querySelectorAll('a[href]')]
    .flatMap((link) => [...new URL(link.href).searchParams.keys()])
    .filter((key) => !allowedUrlKeys.has(key))
  const visibleTargets = [
    ...form.querySelectorAll('a[href], button, input[type="search"], summary, [data-filter-group] label'),
    ...fixture.querySelectorAll('[data-active-filters] a[href], [data-pagination] a[href], [data-pagination] [aria-current="page"]'),
  ]
    .filter((target) => {
      const rect = target.getBoundingClientRect()
      const style = getComputedStyle(target)
      return style.display !== 'none' && rect.width > 0 && rect.height > 0
    })
    .map((target) => {
      const rect = target.getBoundingClientRect()
      const input = target.matches('input') ? target : null
      return {
        height: rect.height,
        name: input?.labels?.[0]?.textContent.trim() ?? target.textContent.trim(),
        width: rect.width,
      }
    })
  return {
    countAtomic: count.getAttribute('aria-atomic'),
    countLive: count.getAttribute('aria-live'),
    countRole: count.getAttribute('role'),
    filterDisclosure: {
      open: disclosure.open,
      panelDisplay: getComputedStyle(disclosure.querySelector('div')).display,
      panelHeight: disclosure.querySelector('div').getBoundingClientRect().height,
      summaryDisplay: getComputedStyle(disclosure.querySelector('summary')).display,
    },
    filterPanelHeight: disclosure.querySelector('div').getBoundingClientRect().height,
    filterSummaryDisplay: getComputedStyle(disclosure.querySelector('summary')).display,
    formLabel: form.getAttribute('aria-label'),
    formMethod: form.method.toLowerCase(),
    invalidUrlKeys,
    visibleTargets,
  }
})()`
}

function renderedFormPrimitivesChecksSource() {
  return `(() => {
  const fixture = document.querySelector('[data-form-primitives-fixture]')
  const form = fixture.querySelector('[data-form-primitive]')
  const descriptionId = form.getAttribute('aria-describedby')
  const describedElements = [...fixture.querySelectorAll('[aria-describedby]')]
  const invalidDescriptionIds = describedElements.flatMap((element) =>
    element.getAttribute('aria-describedby').split(/\\s+/)
      .filter((id) => !document.getElementById(id)),
  )
  const visibleTargets = [
    ...form.querySelectorAll(
      'input:not([type="radio"]):not([type="checkbox"]), select, textarea, button, [data-choice-group] label',
    ),
  ]
    .filter((target) => {
      const rect = target.getBoundingClientRect()
      const style = getComputedStyle(target)
      return style.display !== 'none' && rect.width > 0 && rect.height > 0
    })
    .map((target) => {
      const rect = target.getBoundingClientRect()
      const control = target.matches('input, select, textarea') ? target : null
      return {
        height: rect.height,
        name: control?.labels?.[0]?.textContent.trim() ?? target.textContent.trim(),
        width: rect.width,
      }
    })
  return {
    authoritativeReceipt: fixture.querySelector('[data-form-status="receipt"]')?.dataset.authoritativeAcceptance === 'true',
    choiceGroupCount: form.querySelectorAll('fieldset[data-choice-group] legend').length,
    descriptionExists: Boolean(descriptionId && document.getElementById(descriptionId)),
    fieldLabelCount: form.querySelectorAll('label[for]').length,
    formLabel: form.getAttribute('aria-label'),
    formMethod: form.method.toLowerCase(),
    interactiveReceiptCount: form.querySelectorAll('[data-form-status="receipt"]').length,
    invalidDescriptionIds,
    requiredCopyCount: [...form.querySelectorAll('label, legend')]
      .filter((element) => element.textContent.includes('Required')).length,
    visibleTargets,
  }
})()`
}
