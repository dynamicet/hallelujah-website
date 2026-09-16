import { spawn, spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { repositoryRoot } from './lib/repository-files.mjs'
import { createReviewHarnessServer } from './review-harness/server.mjs'
import { checkReviewHarness } from './review-harness/check-browser.mjs'

const host = '127.0.0.1'
const appPort = 3212
const upstreamOrigin = `http://${host}:${appPort}`
let origin = upstreamOrigin
let reviewHarness
const browserPort = 20_000 + (randomBytes(2).readUInt16BE(0) % 30_000)
const captureFlag = process.argv.indexOf('--capture-dir')
const captureDirectory = captureFlag >= 0 ? path.resolve(process.argv[captureFlag + 1] ?? '') : undefined
const capturePrefixFlag = process.argv.indexOf('--capture-prefix')
const capturePrefix =
  capturePrefixFlag >= 0 ? process.argv[capturePrefixFlag + 1] : 'b01-004-foundations'
const reviewHarnessMode = process.argv.includes('--review-harness')
const shellMode = reviewHarnessMode || process.argv.includes('--shell')
const searchControlsMode = reviewHarnessMode || process.argv.includes('--search-controls')
const formPrimitivesMode = reviewHarnessMode || process.argv.includes('--form-primitives')
const systemStatesMode = reviewHarnessMode || process.argv.includes('--system-states')
const motionMediaMode = reviewHarnessMode || process.argv.includes('--motion-media')
const governedCardsMode = reviewHarnessMode || process.argv.includes('--governed-cards')
const optionalMapMode = reviewHarnessMode || process.argv.includes('--optional-map')
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
  if (reviewHarnessMode) {
    const production = await (await fetch(upstreamOrigin)).text()
    if (production.includes('data-review-harness') || production.includes('data-review-shaping')) {
      throw new Error('review tooling was mounted in the production application')
    }
    reviewHarness = await createReviewHarnessServer({ upstreamOrigin })
    origin = reviewHarness.origin
  }
  const devtools = await waitForDevTools()
  const client = await createDevToolsClient(devtools)
  const { targetId } = await client.send('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await client.send('Target.attachToTarget', { flatten: true, targetId })
  await client.send('Page.enable', {}, sessionId)
  await client.send('Runtime.enable', {}, sessionId)
  const mapRequests = []
  if (optionalMapMode) {
    client.onEvent((event) => {
      if (event.sessionId === sessionId && event.method === 'Network.requestWillBeSent') {
        mapRequests.push(event.params.request.url)
      }
    })
    await client.send('Network.enable', {}, sessionId)
  }
  await client.send('Page.navigate', { url: origin }, sessionId)
  await waitForDocument(client, sessionId)
  if (shellMode) await waitForShellEnhancement(client, sessionId)
  if (searchControlsMode) await waitForSearchControlsEnhancement(client, sessionId)
  if (formPrimitivesMode) await waitForFormPrimitivesEnhancement(client, sessionId)
  if (motionMediaMode) await waitForMotionMediaEnhancement(client, sessionId)
  if (optionalMapMode) await waitForOptionalMapEnhancement(client, sessionId)

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
    if (systemStatesMode) {
      assertSystemStatesViewport(
        viewport.label,
        await evaluate(client, sessionId, renderedSystemStatesChecksSource()),
      )
    }
    if (optionalMapMode) {
      assertOptionalMapViewport(
        viewport.label,
        await evaluate(client, sessionId, renderedOptionalMapChecksSource()),
      )
    }
    if (governedCardsMode) {
      const cards = await evaluate(client, sessionId, `(() => {
        const fixture = document.querySelector('[data-governed-cards-fixture]')
        const current = [...fixture.querySelectorAll('[data-card-state="current"]')]
        const retired = [...fixture.querySelectorAll('[data-card-retired]')]
        const cards = [...fixture.querySelectorAll('[data-card-kind]')]
        return {
          count: cards.length,
          publicGateClosed: !fixture.querySelector('[data-public-gate-fixture]')?.textContent.trim(),
          kinds: current.map((card) => card.dataset.cardKind),
          noOptionalPlaceholders: !fixture.textContent.includes('Credentials:')
            && !fixture.textContent.includes('Also known as:'),
          reviewShape: fixture.querySelectorAll('[data-card-review]').length === 1
            && fixture.textContent.includes('Synthetic review specimen')
            && !fixture.textContent.includes('Medically reviewed'),
          retiredWithoutActions: retired.length === 3 && retired.every((state) =>
            !state.closest('[data-card-kind]').querySelector('a[href]')),
          noPortraitImpersonation: fixture.querySelectorAll('img').length === 0,
          links: [...fixture.querySelectorAll('a[href]')].map((link) => ({
            href: link.getAttribute('href'), height: link.getBoundingClientRect().height,
          })),
          overflow: cards.some((card) => card.getBoundingClientRect().right
            > document.documentElement.clientWidth + 1),
        }
      })()`)
      if (cards.count !== 7 || !cards.publicGateClosed || JSON.stringify(cards.kinds)
        !== JSON.stringify(['doctor', 'service', 'location', 'vacancy'])
        || !cards.noOptionalPlaceholders || !cards.reviewShape || !cards.retiredWithoutActions
        || !cards.noPortraitImpersonation || cards.overflow
        || cards.links.some((link) => !link.href.startsWith('#') || link.height < 44)) {
        fail(`governed cards viewport ${viewport.label}: ${JSON.stringify(cards)}`)
      }
    }
    if (motionMediaMode) {
      const motionResult = await evaluate(client, sessionId, `(() => {
        const fixture = document.querySelector('[data-motion-media-fixture]')
        const regions = [...fixture.querySelectorAll('[data-experience-area]')].map((region) => ({
          area: region.dataset.experienceArea,
          level: region.dataset.experienceLevel,
          protected: region.dataset.protectedContext ?? null,
        }))
        const media = fixture.querySelector('[data-media-state]')
        const video = media.querySelector('video')
        const button = media.querySelector('button')
        const allMedia = [...fixture.querySelectorAll('[data-media-state]')]
        const rect = button.getBoundingClientRect()
        return {
          buttonHeight: rect.height,
          content: fixture.textContent.includes('complete static statement'),
          mediaState: media.dataset.mediaState,
          mediaSrc: video.getAttribute('src'),
          mediaCount: allMedia.length,
          allInitialSourcesAbsent: allMedia.every((frame) =>
            !frame.querySelector('video').hasAttribute('src')
            && !frame.querySelector('track')?.hasAttribute('src')),
          posterVisible: !media.querySelector('[data-media-poster]').hidden,
          regions,
          resourceCount: performance.getEntriesByType('resource').filter((entry) => entry.name.includes('b01-012-abstract-motion.webm')).length,
        }
      })()`)
      if (
        motionResult.buttonHeight < 44 || !motionResult.content || motionResult.mediaState !== 'poster'
        || motionResult.mediaCount !== 2 || !motionResult.allInitialSourcesAbsent
        || motionResult.mediaSrc !== null || !motionResult.posterVisible || motionResult.resourceCount !== 0
        || motionResult.regions.find((region) => region.protected === 'emergency')?.level !== '0'
        || motionResult.regions.find((region) => region.area === 'appointment')?.level !== '1'
      ) fail(`motion/media viewport ${viewport.label}: ${JSON.stringify(motionResult)}`)
    }
    if (captureDirectory && (viewport.width === 320 || viewport.width === 1440)) {
      if (optionalMapMode && !reviewHarnessMode) {
        await evaluate(client, sessionId, `(() => {
          const fixture = document.querySelector('[data-optional-map-fixture]')
          const nodes = [...fixture.parentElement.children].filter((node) => node !== fixture)
          window.__optionalMapCaptureNodes = nodes.map((node) => ({ node, display: node.style.display }))
          nodes.forEach((node) => { node.style.display = 'none' })
        })()`)
      }
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
      const clip = reviewHarnessMode ? { x: 0, y: 0, width: viewport.width, height: viewport.height, scale: 1 }
        : optionalMapMode ? await evaluate(client, sessionId, `(() => {
        const rect = document.querySelector('[data-optional-map-fixture]').getBoundingClientRect()
        return { x: 0, y: rect.y + scrollY, width: innerWidth, height: rect.height, scale: 1 }
      })()`) : undefined
      const { data } = await client.send(
        'Page.captureScreenshot',
        { captureBeyondViewport: true, ...(clip ? { clip } : {}), format: 'png', fromSurface: true },
        sessionId,
      )
      await writeFile(
        path.join(captureDirectory, `${capturePrefix}-${viewport.width}.png`),
        data,
        'base64',
      )
      if (optionalMapMode && !reviewHarnessMode) {
        await evaluate(client, sessionId, `(() => {
          window.__optionalMapCaptureNodes.forEach(({ node, display }) => { node.style.display = display })
          delete window.__optionalMapCaptureNodes
        })()`)
      }
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

  if (systemStatesMode) {
    const semanticResult = await evaluate(
      client,
      sessionId,
      `(() => {
        const fixture = document.querySelector('[data-system-states-fixture]')
        const blockingError = document.getElementById('controlled-error-alert')
        const success = document.getElementById('controlled-success-alert')
        const staticWarning = document.getElementById('controlled-warning-alert')
        const temporary = document.getElementById('controlled-temporary-notice')
        const skeleton = document.querySelector('[data-skeleton-placeholder]')
        const unavailable = document.getElementById('controlled-unavailable-state')
        unavailable.focus()
        const focus = getComputedStyle(unavailable)
        return {
          alertCount: fixture.querySelectorAll('[data-system-feedback="alert"]').length,
          blockingErrorLive: blockingError.getAttribute('aria-live'),
          blockingErrorRole: blockingError.getAttribute('role'),
          focusStyle: focus.outlineStyle,
          focusWidth: Number.parseFloat(focus.outlineWidth),
          stateCount: fixture.querySelectorAll('[data-system-feedback="system-state"]').length,
          staticWarningLive: staticWarning.getAttribute('aria-live'),
          staticWarningRole: staticWarning.getAttribute('role'),
          successLive: success.getAttribute('aria-live'),
          successRole: success.getAttribute('role'),
          successAuthoritative: success.dataset.authoritativeCompletion,
          skeletonHidden: skeleton.getAttribute('aria-hidden'),
          skeletonBoundary: skeleton.closest('[data-loading-boundary]')?.dataset.loadingBoundary,
          temporaryMetadata: temporary.querySelectorAll('[data-status-metadata] time').length,
          temporaryScope: temporary.querySelector('[data-status-metadata] div:first-child dd')?.textContent.trim(),
          temporaryOwner: temporary.querySelector('[data-status-metadata] div:last-child dd')?.textContent.trim(),
        }
      })()`,
    )
    if (
      semanticResult.alertCount !== 5
      || semanticResult.blockingErrorLive !== 'assertive'
      || semanticResult.blockingErrorRole !== 'alert'
      || semanticResult.focusStyle === 'none'
      || semanticResult.focusWidth < 3
      || semanticResult.stateCount !== 5
      || semanticResult.staticWarningLive !== null
      || semanticResult.staticWarningRole !== null
      || semanticResult.successLive !== 'polite'
      || semanticResult.successRole !== 'status'
      || semanticResult.successAuthoritative !== 'true'
      || semanticResult.skeletonHidden !== 'true'
      || semanticResult.skeletonBoundary !== 'non-critical-records'
      || semanticResult.temporaryMetadata !== 2
      || semanticResult.temporaryScope !== 'Controlled fixture only'
      || semanticResult.temporaryOwner !== 'Synthetic fixture owner'
    ) {
      fail(`system-state semantics or focus are incorrect: ${JSON.stringify(semanticResult)}`)
    }

    const noScriptResponse = await fetch(origin)
    const noScriptHtml = await noScriptResponse.text()
    const noScriptChecks = {
      boundary: noScriptHtml.includes('data-loading-boundary="non-critical-records"'),
      criticalFacts: noScriptHtml.includes('data-preserved-critical-facts'),
      fixture: noScriptHtml.includes('data-system-states-fixture'),
      recovery: noScriptHtml.includes('controlled-state-recovery'),
      response: noScriptResponse.ok,
      temporary: noScriptHtml.includes('data-system-feedback="temporary-notice"'),
    }
    if (Object.values(noScriptChecks).some((passed) => !passed)) {
      fail(`no-JavaScript system states are incomplete: ${JSON.stringify(noScriptChecks)}`)
    }
  }

  if (governedCardsMode) {
    const response = await fetch(origin)
    const html = await response.text()
    if (!response.ok || !html.includes('data-governed-cards-fixture')
      || !html.includes('data-card-state="expired"')
      || !html.includes('Synthetic, non-public specimen')
      || html.includes('Must never render publicly')) {
      fail('no-JavaScript governed cards or synthetic public gate are incomplete')
    }
  }

  if (optionalMapMode) {
    const uncheckedMap = await evaluate(client, sessionId, `(() => ({
      unchecked: !document.querySelector('[data-map-acknowledgement]').checked,
      activationDisabled: document.querySelector('[data-map-activate]').disabled,
    }))()`)
    if (!uncheckedMap.unchecked || !uncheckedMap.activationDisabled) {
      fail(`optional-map unchecked baseline: ${JSON.stringify(uncheckedMap)}`)
    }
    await evaluate(client, sessionId, "document.querySelector('[data-map-acknowledgement]').click()")
    await settleLayout()
    const acknowledgedMap = await evaluate(client, sessionId, `(() => ({
      checked: document.querySelector('[data-map-acknowledgement]').checked,
      choiceDisabled: document.querySelector('[data-map-acknowledgement]').disabled,
      activationDisabled: document.querySelector('[data-map-activate]').disabled,
    }))()`)
    if (!acknowledgedMap.checked || acknowledgedMap.choiceDisabled || acknowledgedMap.activationDisabled) {
      throw new Error(`optional-map acknowledgement did not enable the launcher: ${JSON.stringify(acknowledgedMap)}`)
    }
    await evaluate(client, sessionId, `(() => {
      const button = document.querySelector('[data-map-activate]')
      button.scrollIntoView({ block: 'center' })
      button.focus()
    })()`)
    await settleLayout()
    const launcherFocused = await evaluate(client, sessionId,
      "document.activeElement === document.querySelector('[data-map-activate]')")
    if (!launcherFocused) throw new Error('optional-map keyboard launcher could not receive focus')
    const requestCountBeforeIntent = mapRequests.length
    await client.send('Input.dispatchKeyEvent', {
      code: 'Enter', key: 'Enter', text: '\r', type: 'keyDown', windowsVirtualKeyCode: 13,
    }, sessionId)
    await client.send('Input.dispatchKeyEvent', {
      code: 'Enter', key: 'Enter', type: 'keyUp', windowsVirtualKeyCode: 13,
    }, sessionId)
    await settleLayout()
    const activeMap = await evaluate(client, sessionId, `(() => {
      const wrapper = document.getElementById('controlled-map-interactive')
      const surface = wrapper.querySelector('[data-map-surface]')
      const live = wrapper.querySelector('[data-map-live]')
      return {
        focused: document.activeElement === surface,
        state: wrapper.dataset.mapState,
        surfaceVisible: !surface.hidden,
        removeVisible: !wrapper.querySelector('[data-map-remove]').hidden,
        directionsVisible: wrapper.querySelector('[data-text-directions]').getBoundingClientRect().height > 0,
        live: live.getAttribute('aria-live'),
        statusAvailable: !live.hidden,
        status: live.textContent,
      }
    })()`)
    if (activeMap.state !== 'active' || !activeMap.focused || !activeMap.surfaceVisible
      || !activeMap.removeVisible || !activeMap.directionsVisible || activeMap.live !== 'polite'
      || !activeMap.statusAvailable || !activeMap.status.includes('No map provider was contacted')
      || mapRequests.length !== requestCountBeforeIntent) {
      fail(`optional-map intent or request boundary: ${JSON.stringify(activeMap)}; new requests ${mapRequests.length - requestCountBeforeIntent}`)
    }

    await evaluate(client, sessionId, "document.querySelector('[data-map-remove]').focus()")
    await client.send('Input.dispatchKeyEvent', {
      code: 'Space', key: ' ', type: 'rawKeyDown', windowsVirtualKeyCode: 32,
    }, sessionId)
    await client.send('Input.dispatchKeyEvent', {
      code: 'Space', key: ' ', type: 'keyUp', windowsVirtualKeyCode: 32,
    }, sessionId)
    await settleLayout()
    const removedMap = await evaluate(client, sessionId, `(() => {
      const wrapper = document.getElementById('controlled-map-interactive')
      return {
        focused: document.activeElement === wrapper.querySelector('[data-map-activate]'),
        state: wrapper.dataset.mapState,
        surfaceHidden: wrapper.querySelector('[data-map-surface]').hidden,
        removeHidden: wrapper.querySelector('[data-map-remove]').hidden,
      }
    })()`)
    if (removedMap.state !== 'idle' || !removedMap.focused || !removedMap.surfaceHidden
      || !removedMap.removeHidden || mapRequests.length !== requestCountBeforeIntent) {
      fail(`optional-map removal or focus: ${JSON.stringify(removedMap)}`)
    }

    await evaluate(client, sessionId, "document.querySelector('[data-map-activate]').click()")
    await evaluate(client, sessionId, "document.querySelector('[data-map-acknowledgement]').click()")
    const revokedMap = await evaluate(client, sessionId, `(() => ({
      idle: document.getElementById('controlled-map-interactive').dataset.mapState === 'idle',
      unchecked: !document.querySelector('[data-map-acknowledgement]').checked,
      disabled: document.querySelector('[data-map-activate]').disabled,
      hidden: document.querySelector('[data-map-surface]').hidden,
    }))()`)
    if (Object.values(revokedMap).some((passed) => !passed)) {
      fail(`optional-map local-choice revocation: ${JSON.stringify(revokedMap)}`)
    }
    await evaluate(client, sessionId, "document.querySelector('[data-map-acknowledgement]').click()")
    await evaluate(client, sessionId, "document.querySelector('[data-map-activate]').click()")
    await evaluate(client, sessionId, "window.dispatchEvent(new PageTransitionEvent('pagehide'))")
    const exitedMap = await evaluate(client, sessionId, `(() => ({
      idle: document.getElementById('controlled-map-interactive').dataset.mapState === 'idle',
      unchecked: !document.querySelector('[data-map-acknowledgement]').checked,
      disabled: document.querySelector('[data-map-activate]').disabled,
    }))()`)
    if (Object.values(exitedMap).some((passed) => !passed)) {
      fail(`optional-map route-exit cleanup: ${JSON.stringify(exitedMap)}`)
    }

    await client.send('Emulation.setScriptExecutionDisabled', { value: true }, sessionId)
    await client.send('Page.navigate', { url: origin }, sessionId)
    await waitForDocument(client, sessionId)
    const noScriptMap = await evaluate(client, sessionId, `(() => ({
      enhanced: document.documentElement.dataset.optionalMapEnhanced ?? null,
      disabled: document.querySelector('[data-map-activate]').disabled,
      choiceDisabled: document.querySelector('[data-map-acknowledgement]').disabled,
      choiceUnchecked: !document.querySelector('[data-map-acknowledgement]').checked,
      directions: document.querySelectorAll('[data-text-directions]').length,
      hidden: document.querySelector('[data-map-surface]').hidden,
      embeddedResources: document.querySelectorAll('[data-optional-map-fixture] iframe, [data-optional-map-fixture] img').length,
    }))()`)
    if (noScriptMap.enhanced !== null || !noScriptMap.disabled || !noScriptMap.choiceDisabled
      || !noScriptMap.choiceUnchecked || noScriptMap.directions !== 4
      || !noScriptMap.hidden || noScriptMap.embeddedResources !== 0) {
      fail(`no-JavaScript optional-map boundary: ${JSON.stringify(noScriptMap)}`)
    }
    await client.send('Emulation.setScriptExecutionDisabled', { value: false }, sessionId)
    await client.send('Page.navigate', { url: origin }, sessionId)
    await waitForDocument(client, sessionId)
    await waitForOptionalMapEnhancement(client, sessionId)
    if (mapRequests.some((url) => !url.startsWith(`${origin}/`))) {
      fail('optional-map browser matrix made a request outside the local application origin')
    }
  }

  if (motionMediaMode) {
    const noScriptResponse = await fetch(origin)
    const noScriptHtml = await noScriptResponse.text()
    if (!noScriptResponse.ok || !noScriptHtml.includes('data-motion-media-fixture')
      || !noScriptHtml.includes('Controlled urgent meaning remains stable')
      || /<video[^>]*src=/u.test(noScriptHtml)) {
      fail('no-JavaScript motion/media foundation is incomplete or preloads video')
    }
    await evaluate(client, sessionId, `(() => {
      const button = document.querySelector('[data-media-state] button')
      button.scrollIntoView({ block: 'center' })
      button.focus()
    })()`)
    await client.send('Input.dispatchKeyEvent',
      { code: 'Space', key: ' ', type: 'rawKeyDown', windowsVirtualKeyCode: 32 }, sessionId)
    await client.send('Input.dispatchKeyEvent',
      { code: 'Space', key: ' ', type: 'keyUp', windowsVirtualKeyCode: 32 }, sessionId)
    let playing = false
    let lastMediaResult
    for (let attempt = 0; attempt < 40; attempt += 1) {
      const result = await evaluate(client, sessionId, `(() => {
        const media = document.querySelector('[data-media-state]')
        const video = media.querySelector('video')
        return {
          focusedPlay: document.activeElement === media.querySelector('button'),
          posterHidden: media.querySelector('[data-media-poster]').hidden,
          readyState: video.readyState,
          paused: video.paused,
          errorCode: video.error?.code ?? null,
          sourceAttached: video.getAttribute('src'),
          state: media.dataset.mediaState,
        }
      })()`)
      lastMediaResult = result
      if (result.state === 'playing' && result.readyState >= 2 && !result.paused) {
        if (!result.focusedPlay || !result.posterHidden
          || result.sourceAttached !== '/fixtures/b01-012-abstract-motion.webm') {
          fail(`media activation did not preserve focus or plane: ${JSON.stringify(result)}`)
        }
        playing = true
        break
      }
      await pause(50)
    }
    if (!playing) fail(`controlled media did not begin playback after keyboard intent: ${JSON.stringify(lastMediaResult)}`)
    await evaluate(client, sessionId, `document.querySelector('[data-media-state] button').click()`)
    await settleLayout()
    const paused = await evaluate(client, sessionId,
      `document.querySelector('[data-media-state]').dataset.mediaState`)
    if (paused !== 'paused') fail(`controlled media did not pause: ${paused}`)
    await evaluate(client, sessionId,
      `document.querySelector('[data-media-state] button:last-of-type').click()`)
    await settleLayout()
    const stopped = await evaluate(client, sessionId, `(() => {
      const media = document.querySelector('[data-media-state]')
      return {
        focusedPlay: document.activeElement === media.querySelector('button'),
        posterVisible: !media.querySelector('[data-media-poster]').hidden,
        sourceDetached: !media.querySelector('video').hasAttribute('src'),
        state: media.dataset.mediaState,
      }
    })()`)
    if (stopped.state !== 'poster' || !stopped.focusedPlay || !stopped.posterVisible
      || !stopped.sourceDetached) fail(`media Stop did not restore static plane: ${JSON.stringify(stopped)}`)

    await evaluate(client, sessionId,
      `document.querySelectorAll('[data-media-play]')[1].click()`)
    let informative
    for (let attempt = 0; attempt < 40; attempt += 1) {
      informative = await evaluate(client, sessionId, `(() => {
        const frame = document.querySelectorAll('[data-media-state]')[1]
        const video = frame.querySelector('video')
        return {
          captionsAttached: frame.querySelector('track').getAttribute('src'),
          captionsMode: frame.querySelector('track').track.mode,
          nativeControls: video.controls,
          readyState: video.readyState,
          state: frame.dataset.mediaState,
          transcript: frame.querySelector('a')?.getAttribute('href'),
        }
      })()`)
      if (informative.state === 'playing' && informative.readyState >= 2) break
      await pause(50)
    }
    if (informative?.state !== 'playing' || informative.readyState < 2
      || informative.captionsAttached !== '/fixtures/b01-012-abstract-motion.vtt'
      || informative.captionsMode !== 'showing' || !informative.nativeControls
      || informative.transcript !== '#controlled-media-transcript') {
      fail(`informative media did not attach captions and transcript after intent: ${JSON.stringify(informative)}`)
    }
    await evaluate(client, sessionId,
      `document.querySelectorAll('[data-media-video]')[1].pause()`)
    await settleLayout()
    const nativePaused = await evaluate(client, sessionId,
      `document.querySelectorAll('[data-media-state]')[1].dataset.mediaState`)
    if (nativePaused !== 'paused') fail(`informative native Pause was not reflected: ${nativePaused}`)
    await evaluate(client, sessionId,
      `document.querySelectorAll('[data-media-play]')[1].click()`)
    await settleLayout()
    const informativeResumed = await evaluate(client, sessionId,
      `document.querySelectorAll('[data-media-state]')[1].dataset.mediaState`)
    if (informativeResumed !== 'playing') fail(`informative Resume was not reflected: ${informativeResumed}`)
    await evaluate(client, sessionId,
      `document.querySelectorAll('[data-media-stop]')[1].click()`)
    const informativeStopped = await evaluate(client, sessionId, `(() => {
      const frame = document.querySelectorAll('[data-media-state]')[1]
      return !frame.querySelector('video').hasAttribute('src')
        && !frame.querySelector('track').hasAttribute('src')
        && !frame.querySelector('[data-media-poster]').hidden
    })()`)
    if (!informativeStopped) fail('informative Stop retained a video or caption source')

    const { identifier } = await client.send('Page.addScriptToEvaluateOnNewDocument', {
      source: `Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } })`,
    }, sessionId)
    await client.send('Network.enable', {}, sessionId)
    await client.send('Network.setCacheDisabled', { cacheDisabled: true }, sessionId)
    await client.send('Network.setBlockedURLs',
      { urls: ['*b01-012-abstract-motion.webm*'] }, sessionId)
    await client.send('Page.navigate', { url: origin }, sessionId)
    await waitForDocument(client, sessionId)
    await waitForMotionMediaEnhancement(client, sessionId)
    await settleLayout()
    const saveData = await evaluate(client, sessionId, `(() => {
      const accent = document.querySelector('[data-motion-accent]')
      const media = document.querySelector('[data-media-state]')
      return {
        accentEnabled: accent.dataset.motionEnabled,
        posterVisible: !media.querySelector('[data-media-poster]').hidden,
        resourceCount: performance.getEntriesByType('resource').filter((entry) => entry.name.includes('b01-012-abstract-motion.webm')).length,
        saveData: navigator.connection?.saveData,
      }
    })()`)
    if (!saveData.saveData || saveData.accentEnabled !== 'false'
      || !saveData.posterVisible || saveData.resourceCount !== 0) {
      fail(`Save-Data static foundation or pre-intent request: ${JSON.stringify(saveData)}`)
    }
    await evaluate(client, sessionId,
      `document.querySelector('[data-media-play]').click()`)
    let failureState
    for (let attempt = 0; attempt < 40; attempt += 1) {
      failureState = await evaluate(client, sessionId, `(() => {
        const media = document.querySelector('[data-media-state]')
        return {
          posterVisible: !media.querySelector('[data-media-poster]').hidden,
          sourceDetached: !media.querySelector('video').hasAttribute('src'),
          state: media.dataset.mediaState,
          statusVisible: !media.querySelector('[data-media-status]').hidden,
        }
      })()`)
      if (failureState.state === 'failed') break
      await pause(50)
    }
    if (failureState?.state !== 'failed' || !failureState.posterVisible
      || !failureState.sourceDetached || !failureState.statusVisible) {
      fail(`blocked media did not retain its static recovery: ${JSON.stringify(failureState)}`)
    }
    await client.send('Network.setBlockedURLs', { urls: [] }, sessionId)
    await client.send('Network.setCacheDisabled', { cacheDisabled: false }, sessionId)
    await client.send('Page.removeScriptToEvaluateOnNewDocument', { identifier }, sessionId)
    await client.send('Page.navigate', { url: origin }, sessionId)
    await waitForDocument(client, sessionId)
    await waitForMotionMediaEnhancement(client, sessionId)
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
  if (optionalMapMode) {
    assertOptionalMapViewport('200%-text', await evaluate(client, sessionId, renderedOptionalMapChecksSource()))
  }
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
  if (systemStatesMode) {
    const reducedStateResult = await evaluate(
      client,
      sessionId,
      `(() => ({
        animationName: getComputedStyle(document.querySelector('[data-loading-indicator]')).animationName,
      }))()`,
    )
    if (reducedStateResult.animationName !== 'none') {
      fail(`reduced-motion loading indicator still animates: ${JSON.stringify(reducedStateResult)}`)
    }
  }
  if (optionalMapMode) {
    const animation = await evaluate(client, sessionId,
      "getComputedStyle(document.querySelector('[data-map-loading] span')).animationName")
    if (animation !== 'none') fail('reduced-motion optional-map loading specimen still animates')
  }
  if (motionMediaMode) {
    const accent = await evaluate(client, sessionId, `(() => {
      const protectedAccent = document.querySelector('[data-protected-context="emergency"] [data-motion-accent]')
      const eligibleAccent = document.querySelector('[data-experience-area="home-hero"] > [data-motion-accent]')
      return {
        eligible: getComputedStyle(eligibleAccent).animationName,
        protected: getComputedStyle(protectedAccent).animationName,
      }
    })()`)
    if (accent.eligible !== 'none' || accent.protected !== 'none') {
      fail(`reduced-motion accent did not become static: ${JSON.stringify(accent)}`)
    }
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
  if (systemStatesMode) {
    const printStateResult = await evaluate(
      client,
      sessionId,
      `(() => {
        const panel = getComputedStyle(document.querySelector('[data-system-feedback]'))
        return { background: panel.backgroundColor, color: panel.color }
      })()`,
    )
    if (printStateResult.background !== 'rgba(0, 0, 0, 0)') {
      fail(`print system-state background: ${printStateResult.background}`)
    }
  }
  if (governedCardsMode) {
    const printCard = await evaluate(client, sessionId, `(() => {
      const card = getComputedStyle(document.querySelector('[data-card-kind]'))
      return { background: card.backgroundColor, border: card.borderLeftStyle }
    })()`)
    if (printCard.background !== 'rgba(0, 0, 0, 0)' || printCard.border === 'none') {
      fail(`print governed card boundary: ${JSON.stringify(printCard)}`)
    }
  }
  if (optionalMapMode) {
    const printMap = await evaluate(client, sessionId, `(() => ({
      directions: [...document.querySelectorAll('[data-text-directions]')].every((node) =>
        getComputedStyle(node).display !== 'none' && node.getBoundingClientRect().height > 0),
      panelsHidden: [...document.querySelectorAll('[data-map-panel]')].every((node) =>
        getComputedStyle(node).display === 'none'),
    }))()`)
    if (!printMap.directions || !printMap.panelsHidden) {
      fail(`print optional-map text-first boundary: ${JSON.stringify(printMap)}`)
    }
  }

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
  if (systemStatesMode) {
    const forcedStateResult = await evaluate(
      client,
      sessionId,
      `(() => {
        const panel = getComputedStyle(document.getElementById('controlled-unavailable-state'))
        return { borderStyle: panel.borderLeftStyle, borderWidth: panel.borderLeftWidth }
      })()`,
    )
    if (forcedStateResult.borderStyle === 'none' || Number.parseFloat(forcedStateResult.borderWidth) < 2) {
      fail(`forced-colors system-state boundary: ${JSON.stringify(forcedStateResult)}`)
    }
  }
  if (governedCardsMode) {
    const forcedCard = await evaluate(client, sessionId, `(() => {
      const retired = getComputedStyle(document.querySelector('[data-card-state="expired"]'))
      const link = document.querySelector('[data-card-kind="doctor"] a')
      link.focus()
      const focus = getComputedStyle(link)
      return { border: retired.borderLeftStyle, focus: focus.outlineStyle }
    })()`)
    if (forcedCard.border === 'none' || forcedCard.focus === 'none') {
      fail(`forced-colors governed card boundary: ${JSON.stringify(forcedCard)}`)
    }
  }
  if (optionalMapMode) {
    const forcedMap = await evaluate(client, sessionId, `(() => {
      const panel = getComputedStyle(document.querySelector('[data-map-state="blocked"] [data-map-panel]'))
      const button = document.querySelector('[data-map-acknowledgement]')
      button.focus()
      const focus = getComputedStyle(button)
      return { border: panel.borderLeftStyle, focus: focus.outlineStyle, width: Number.parseFloat(focus.outlineWidth) }
    })()`)
    if (forcedMap.border === 'none' || forcedMap.focus === 'none' || forcedMap.width < 3) {
      fail(`forced-colors optional-map boundary: ${JSON.stringify(forcedMap)}`)
    }
  }

  if (reviewHarnessMode) await checkReviewHarness({ client, sessionId, origin, captureDirectory })
  client.close()
  if (process.exitCode) throw new Error('one or more rendered foundation assertions failed')
  console.log(
    reviewHarnessMode
      ? 'Rendered B01-013 harness passed (all shared component interactions plus bilingual capability, viewport, media-end and history matrix; production exclusion and zero external/pre-intent media requests).'
      : optionalMapMode
      ? 'Rendered optional-map smoke passed (complete text-first fallback, four controlled states, explicit keyboard intent, removal/focus, route cleanup, zero activation/external requests, true no-JavaScript mode, responsive/enlarged text, reduced motion, print, and forced colors).'
      : governedCardsMode
      ? 'Rendered governed-card smoke passed (four synthetic variants, omission, unavailable and retired actions, public fail-closed gate, responsive targets, no-JavaScript output, print, and forced colors).'
      : motionMediaMode
      ? 'Rendered motion/media smoke passed (responsive static regions, protected and area ceilings, zero pre-intent requests, keyboard Play/Pause/Stop, focus, Save-Data and blocked-media recovery, no-JavaScript content, reduced motion, print, and forced colors).'
      : systemStatesMode
      ? 'Rendered foundation/action/shell/search/form/system-state smoke passed (responsive state panels, alert/status timing, recovery targets, focus, dated temporary metadata, loading boundaries, critical-fact preservation, no-JavaScript output, zoom, reduced motion, print, and forced colors).'
      : formPrimitivesMode
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
  if (reviewHarness) await reviewHarness.close()
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
      const response = await fetch(`${upstreamOrigin}/health`, { signal: AbortSignal.timeout(500) })
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
  const eventListeners = new Set()
  let nextId = 0
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    if (message.method) {
      eventListeners.forEach((listener) => listener(message))
      return
    }
    const operation = pending.get(message.id)
    if (!operation) return
    pending.delete(message.id)
    if (message.error) operation.reject(new Error(message.error.message))
    else operation.resolve(message.result)
  })
  return {
    close: () => socket.close(),
    onEvent(listener) { eventListeners.add(listener) },
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

async function waitForMotionMediaEnhancement(client, sessionId) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const enabled = await evaluate(client, sessionId,
      "document.documentElement.dataset.motionMediaEnhanced === 'true'")
    if (enabled) return
    await pause(100)
  }
  const state = await evaluate(client, sessionId, `(() => ({
    accent: document.querySelector('[data-motion-accent]')?.dataset.motionEnabled,
    visibility: document.visibilityState,
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    saveData: navigator.connection?.saveData,
  }))()`)
  throw new Error(`first-party motion enhancement did not load: ${JSON.stringify(state)}`)
}

async function waitForOptionalMapEnhancement(client, sessionId) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const enhanced = await evaluate(client, sessionId,
      "document.documentElement.dataset.optionalMapEnhanced === 'true'")
    if (enhanced) return
    await pause(100)
  }
  throw new Error('first-party optional-map enhancement did not load')
}

function renderedOptionalMapChecksSource() {
  return `(() => {
    const fixture = document.querySelector('[data-optional-map-fixture]')
    const wrappers = [...fixture.querySelectorAll('[data-optional-map]')]
    const button = fixture.querySelector('[data-map-activate]')
    const rect = button.getBoundingClientRect()
    return {
      count: wrappers.length,
      states: wrappers.map((wrapper) => wrapper.dataset.mapState),
      complete: wrappers.every((wrapper) => {
        const directions = wrapper.querySelector('[data-text-directions]')
        return directions.querySelectorAll('dt').length === 3
          && directions.querySelectorAll('ol li').length === 2
          && directions.compareDocumentPosition(wrapper.querySelector('[data-map-panel]')) & Node.DOCUMENT_POSITION_FOLLOWING
      }),
      blocked: fixture.querySelector('[data-map-state="blocked"] button').disabled,
      busy: fixture.querySelector('[data-map-state="loading"] [data-map-panel]').getAttribute('aria-busy'),
      failure: Boolean(fixture.querySelector('[data-map-failure]')),
      noResourceSurface: !fixture.querySelector('iframe, img, video, canvas, a[href]'),
      prohibited: wrappers.every((wrapper) => wrapper.dataset.providerRequest === 'prohibited'),
      livePrepared: !fixture.querySelector('[data-map-live]').hidden
        && fixture.querySelector('[data-map-live]').textContent === '',
      button: { height: rect.height, width: rect.width },
      overflow: wrappers.some((wrapper) => wrapper.getBoundingClientRect().right > document.documentElement.clientWidth + 1),
    }
  })()`
}

function assertOptionalMapViewport(label, result) {
  if (result.count !== 4 || JSON.stringify(result.states) !== JSON.stringify(['idle', 'blocked', 'loading', 'failure'])
    || !result.complete || !result.blocked || result.busy !== 'true' || !result.failure
    || !result.noResourceSurface || !result.prohibited || !result.livePrepared || result.button.height < 44
    || result.button.width < 44 || result.overflow) {
    fail(`optional-map viewport ${label}: ${JSON.stringify(result)}`)
  }
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

function assertSystemStatesViewport(label, result) {
  if (result.alertKinds.length !== 5 || result.stateKinds.length !== 5) {
    fail(`${label}: system-state fixture coverage is incomplete ${JSON.stringify(result)}`)
  }
  if (result.panelsWithoutHeading.length > 0 || result.panelsWithoutAction.length > 0) {
    fail(`${label}: state anatomy is incomplete ${JSON.stringify(result)}`)
  }
  if (!result.criticalFactsVisible || result.skeletonContainsText) {
    fail(`${label}: loading boundary hides critical facts or invents record text ${JSON.stringify(result)}`)
  }
  for (const target of result.visibleTargets) {
    if (target.width < 44 || target.height < 44) {
      fail(`${label}: state recovery target ${target.name} is ${target.width}×${target.height}`)
    }
    if (!target.name) fail(`${label}: visible state recovery target has no name`)
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

function renderedSystemStatesChecksSource() {
  return `(() => {
  const fixture = document.querySelector('[data-system-states-fixture]')
  const panels = [...fixture.querySelectorAll('[data-system-feedback]')]
  const visibleTargets = [...fixture.querySelectorAll('[data-system-feedback] a[href]')]
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
    alertKinds: [...fixture.querySelectorAll('[data-system-feedback="alert"]')]
      .map((panel) => panel.dataset.feedbackKind),
    criticalFactsVisible: document.querySelector('[data-preserved-critical-facts]')
      .getBoundingClientRect().height > 0,
    panelsWithoutAction: panels
      .filter((panel) => !panel.querySelector('a[href], button'))
      .map((panel) => panel.id),
    panelsWithoutHeading: panels
      .filter((panel) => !document.getElementById(panel.getAttribute('aria-labelledby')))
      .map((panel) => panel.id),
    skeletonContainsText: Boolean(
      document.querySelector('[data-skeleton-placeholder]').textContent.trim(),
    ),
    stateKinds: [...fixture.querySelectorAll('[data-system-feedback="system-state"]')]
      .map((panel) => panel.dataset.feedbackKind),
    visibleTargets,
  }
})()`
}
