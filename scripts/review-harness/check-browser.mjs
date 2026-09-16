import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { reviewCapabilities, reviewGroups, reviewLanguages } from './manifest.mjs'

export function reviewRequestIsAllowed(url, origin) {
  // Chromium may report its embedded native-control images as request events after
  // preference changes. Data images perform no external transfer; every network
  // destination must still be this exact loopback origin.
  return url.startsWith(`${origin}/`) || url.startsWith('data:image/') || url === 'about:blank'
}

export async function checkReviewHarness({ client, sessionId, origin, captureDirectory }) {
  const results = []
  const requests = []
  client.onEvent((event) => {
    if (event.sessionId === sessionId && event.method === 'Network.requestWillBeSent') requests.push(event.params.request.url)
  })
  await client.send('Network.enable', {}, sessionId)
  await client.send('Network.setCacheDisabled', { cacheDisabled: true }, sessionId)
  const evaluate = async (expression) => {
    const result = await client.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, sessionId)
    if (result.exceptionDetails) throw new Error('review browser expression failed')
    return result.result.value
  }
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  const capture = async (clip, label) => {
    const bounds = { ...clip, x: Math.max(0, Math.floor(clip.x)), y: Math.max(0, Math.floor(clip.y)), width: Math.ceil(clip.width), height: Math.ceil(clip.height) }
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await wait(120)
      try {
        return await client.send('Page.captureScreenshot', { clip: bounds, captureBeyondViewport: true, format: 'png', fromSurface: true }, sessionId)
      } catch (error) {
        if (attempt === 2) throw new Error(`review capture ${label} ${JSON.stringify(bounds)}: ${error.message}`)
      }
    }
  }
  const pressKey = async (key, code, keyCode) => {
    await client.send('Input.dispatchKeyEvent', { key, code, type: key === 'Enter' ? 'keyDown' : 'rawKeyDown', ...(key === 'Enter' ? { text: '\r' } : {}), windowsVirtualKeyCode: keyCode }, sessionId)
    await client.send('Input.dispatchKeyEvent', { key, code, type: 'keyUp', windowsVirtualKeyCode: keyCode }, sessionId)
    await wait(80)
  }
  const navigate = async (url, javascript = true) => {
    await client.send('Page.navigate', { url }, sessionId)
    for (let attempt = 0; attempt < 80; attempt += 1) {
      if (await evaluate(`location.href === ${JSON.stringify(url)} && document.readyState === 'complete' && !!document.querySelector('[data-review-harness]')${javascript ? " && document.documentElement.dataset.motionMediaEnhanced === 'true'" : ''}`)) {
        await wait(120)
        return
      }
      await wait(50)
    }
    throw new Error('review document did not become ready')
  }
  for (const language of reviewLanguages) {
    for (const capability of reviewCapabilities) {
      await client.send('Emulation.setEmulatedMedia', { media: capability === 'print' ? 'print' : 'screen', features:
        capability === 'reduced-motion' ? [{ name: 'prefers-reduced-motion', value: 'reduce' }]
          : capability === 'forced-colors' ? [{ name: 'forced-colors', value: 'active' }] : [],
      }, sessionId)
      const javascript = capability !== 'no-javascript'
      await client.send('Emulation.setScriptExecutionDisabled', { value: !javascript }, sessionId)
      await client.send('Network.setBlockedURLs', { urls: capability === 'images-fonts-blocked' ? ['*.png', '*.jpg', '*.jpeg', '*.webp', '*.avif', '*.woff', '*.woff2', '*.ttf', '*.otf'] : [] }, sessionId)
      let saveDataScript
      if (capability === 'save-data') {
        const result = await client.send('Page.addScriptToEvaluateOnNewDocument', {
          source: "Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } })",
        }, sessionId)
        saveDataScript = result.identifier
      }
      await client.send('Emulation.setTouchEmulationEnabled', { enabled: capability === 'coarse-pointer' }, sessionId)
      for (const width of [320, 360, 768, 1280, 1440]) {
        await client.send('Emulation.setDeviceMetricsOverride', {
          deviceScaleFactor: 1, height: 900, mobile: capability === 'coarse-pointer',
          screenHeight: 900, screenWidth: width, width,
        }, sessionId)
        const requestStart = requests.length
        await navigate(`${origin}/?review-language=${language}`, javascript)
        if (capability === '200%-text') await evaluate("document.documentElement.style.fontSize = '200%'")
        await wait(120)
        const specimen = await evaluate(`(() => {
          const ids = [...document.querySelectorAll('[id]')].map((node) => node.id)
          const missingReferences = [...document.querySelectorAll('[aria-labelledby], [aria-describedby], label[for]')].flatMap((node) =>
            ['aria-labelledby', 'aria-describedby', 'for'].flatMap((attribute) =>
              (node.getAttribute(attribute) ?? '').split(/\\s+/).filter((id) => id && !document.getElementById(id))))
          const groups = ${JSON.stringify(reviewGroups)}.map(({ id, marker }) => ({
            id, present: !!document.querySelector('[' + marker + ']'), linked: !!document.getElementById(id),
          }))
          const media = [...document.querySelectorAll('[data-media-state]')]
          const disabled = !document.querySelector('[data-form-submit]').disabled
          const accents = [...document.querySelectorAll('[data-motion-accent]')]
          return {
            groups, missingReferences, duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
            language: document.querySelector('[data-review-harness]').dataset.reviewLanguage,
            shapingCount: document.querySelectorAll('[data-review-shaping]').length,
            overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
            initialMediaAbsent: media.length === 2 && media.every((frame) => !frame.querySelector('video').hasAttribute('src') && !frame.querySelector('track')?.hasAttribute('src')),
            staticMeaning: !!document.querySelector('[data-protected-motion-fact]')?.textContent.trim(),
            noJsDisabled: !disabled && document.querySelector('[data-map-activate]').disabled && document.querySelector('[data-map-acknowledgement]').disabled,
            accentAnimations: accents.map((accent) => getComputedStyle(accent).animationName),
            saveData: navigator.connection?.saveData ?? false,
            coarsePointer: matchMedia('(pointer: coarse)').matches,
            hiddenAccents: accents.every((accent) => accent.dataset.motionEnabled === 'false'),
            printDirections: [...document.querySelectorAll('[data-text-directions]')].every((node) => getComputedStyle(node).display !== 'none'),
            essentialLabels: [...document.querySelectorAll('button, input:not([type=hidden]), select, textarea')].every((node) =>
              !!node.textContent.trim() || !!node.getAttribute('aria-label') || !!node.labels?.length),
          }
        })()`)
        const unexpectedRequests = requests.slice(requestStart).filter((url) =>
          !reviewRequestIsAllowed(url, origin) || /b01-012-abstract-motion\.(?:webm|vtt)/u.test(url))
        if (specimen.groups.some((group) => !group.present || !group.linked)
          || specimen.missingReferences.length || specimen.duplicateIds.length || specimen.overflow
          || specimen.language !== language || (language === 'am' && specimen.shapingCount < 100)
          || !specimen.initialMediaAbsent || !specimen.staticMeaning || !specimen.essentialLabels
          || unexpectedRequests.length
          || (!javascript && !specimen.noJsDisabled)
          || (capability === 'save-data' && (!specimen.saveData || !specimen.hiddenAccents))
          || (capability === 'coarse-pointer' && !specimen.coarsePointer)
          || (capability === 'reduced-motion' && specimen.accentAnimations.some((name) => name !== 'none'))
          || (capability === 'print' && !specimen.printDirections)) {
          const destinations = unexpectedRequests.map((url) => {
            const parsed = new URL(url)
            return { protocol: parsed.protocol, origin: parsed.origin, pathname: parsed.pathname.slice(0, 160) }
          })
          throw new Error(`review ${language}/${capability}/${width}: ${JSON.stringify(specimen)}; unexpected requests ${JSON.stringify(destinations)}`)
        }
        results.push({ language, capability, width, result: 'pass', groups: specimen.groups.length })
        if (captureDirectory && capability === 'default' && [320, 1440].includes(width)) {
          await mkdir(captureDirectory, { recursive: true })
          for (const group of reviewGroups) {
            const clip = await evaluate(`(() => {
              const node = document.getElementById(${JSON.stringify(group.id)})
              node.scrollIntoView({ block: 'start' })
              const rect = node.getBoundingClientRect()
              return { x: 0, y: rect.y + scrollY, width: innerWidth, height: rect.height, scale: 1 }
            })()`)
            await wait(80)
            const { data } = await capture(clip, `${language}/${group.ticket}/${width}`)
            await writeFile(path.join(captureDirectory, `b01-013-${language}-${group.ticket.toLowerCase()}-${width}.png`), data, 'base64')
          }
          for (const part of ['header', 'footer']) {
            const clip = await evaluate(`(() => {
              const node = document.querySelector('[data-site-${part}]')
              node.scrollIntoView({ block: 'start' })
              const rect = node.getBoundingClientRect()
              return { x: 0, y: rect.y + scrollY, width: innerWidth, height: rect.height, scale: 1 }
            })()`)
            const { data } = await capture(clip, `${language}/shell-${part}/${width}`)
            await writeFile(path.join(captureDirectory, `b01-013-${language}-shell-${part}-${width}.png`), data, 'base64')
          }
        }
      }
      if (saveDataScript) await client.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: saveDataScript }, sessionId)
    }
  }
  await client.send('Emulation.setEmulatedMedia', { media: 'screen', features: [] }, sessionId)
  await client.send('Emulation.setScriptExecutionDisabled', { value: false }, sessionId)
  await client.send('Emulation.setTouchEmulationEnabled', { enabled: false }, sessionId)
  await client.send('Network.setBlockedURLs', { urls: [] }, sessionId)
  for (const language of reviewLanguages) {
    await navigate(`${origin}/?review-language=${language}#motion-media-evidence`)
    await client.send('Emulation.setDeviceMetricsOverride', { deviceScaleFactor: 1, height: 900, mobile: false, screenHeight: 900, screenWidth: 320, width: 320 }, sessionId)
    await evaluate("document.querySelector('[data-menu-trigger]').focus()")
    await pressKey(' ', 'Space', 32)
    if (!await evaluate("document.querySelector('[data-navigation-panel]').matches(':popover-open')")) {
      throw new Error(`review ${language}: keyboard menu did not open`)
    }
    await evaluate("document.querySelector('[data-primary-navigation] a').focus()")
    await pressKey('Escape', 'Escape', 27)
    if (!await evaluate("!document.querySelector('[data-navigation-panel]').matches(':popover-open') && document.activeElement === document.querySelector('[data-menu-trigger]')")) {
      throw new Error(`review ${language}: menu Escape did not restore focus`)
    }
    await evaluate("document.querySelector('[data-form-submit]').focus()")
    await pressKey(' ', 'Space', 32)
    // Validation itself is scheduled after 80 ms; the key helper's 80 ms wait
    // cannot guarantee that timer has run on a busy browser.
    let summaryFocused = false
    for (let attempt = 0; attempt < 40; attempt += 1) {
      summaryFocused = await evaluate("document.activeElement === document.querySelector('[data-error-summary]') && !document.querySelector('[data-error-summary]').hidden")
      if (summaryFocused) break
      await wait(50)
    }
    if (!summaryFocused) {
      throw new Error(`review ${language}: invalid form did not focus its summary`)
    }
    await evaluate("document.querySelector('[data-map-acknowledgement]').focus()")
    await pressKey(' ', 'Space', 32)
    await evaluate("document.querySelector('[data-map-activate]').focus()")
    await pressKey('Enter', 'Enter', 13)
    if (!await evaluate("document.getElementById('controlled-map-interactive').dataset.mapState === 'active'")) {
      const state = await evaluate(`(() => ({
        focused: document.activeElement?.outerHTML,
        checked: document.querySelector('[data-map-acknowledgement]').checked,
        disabled: document.querySelector('[data-map-activate]').disabled,
        state: document.getElementById('controlled-map-interactive').dataset.mapState,
      }))()`)
      throw new Error(`review ${language}: explicit keyboard map intent failed: ${JSON.stringify(state)}`)
    }
    await evaluate("document.querySelector('[data-map-remove]').focus()")
    await pressKey(' ', 'Space', 32)
    if (!await evaluate("document.activeElement === document.querySelector('[data-map-activate]') && document.getElementById('controlled-map-interactive').dataset.mapState === 'idle'")) {
      throw new Error(`review ${language}: map removal did not restore focus`)
    }
    // Seek the actual finite fixture close to its end, then wait for the real ended event.
    await evaluate("document.querySelector('[data-media-play]').focus()")
    await pressKey(' ', 'Space', 32)
    for (let attempt = 0; attempt < 60; attempt += 1) {
      if (await evaluate("document.querySelector('[data-media-video]').readyState >= 2")) break
      await wait(50)
    }
    await evaluate("document.querySelector('[data-media-video]').currentTime = 1.85")
    let ended = false
    for (let attempt = 0; attempt < 60; attempt += 1) {
      ended = await evaluate(`(() => {
        const frame = document.querySelector('[data-media-state]')
        return frame.dataset.mediaState === 'ended' && !frame.querySelector('video').hasAttribute('src')
          && !frame.querySelector('[data-media-poster]').hidden && document.activeElement === frame.querySelector('[data-media-play]')
      })()`)
      if (ended) break
      await wait(50)
    }
    if (!ended) throw new Error(`review ${language}: actual media end did not restore the focused static plane`)
    await pressKey(' ', 'Space', 32)
    await wait(200)
    await evaluate("window.dispatchEvent(new PageTransitionEvent('pagehide'))")
    if (!await evaluate("[...document.querySelectorAll('video, track')].every((node) => !node.hasAttribute('src'))")) {
      throw new Error(`review ${language}: page exit retained media sources`)
    }
    await navigate(`${origin}/?review-language=${language}&type=service&page=1#search-controls-evidence`)
    if (!await evaluate("document.querySelector('[data-search-controls-form] input[value=service]').checked")) {
      throw new Error(`review ${language}: deep link failed to restore the selected filter`)
    }
    const { currentIndex, entries } = await client.send('Page.getNavigationHistory', {}, sessionId)
    const previous = entries[currentIndex - 1]
    await client.send('Page.navigateToHistoryEntry', { entryId: previous.id }, sessionId)
    for (let attempt = 0; attempt < 60; attempt += 1) {
      if (await evaluate(`location.href === ${JSON.stringify(previous.url)}`)) break
      await wait(50)
    }
    if (!await evaluate(`location.href === ${JSON.stringify(previous.url)} && [...document.querySelectorAll('video, track')].every((node) => !node.hasAttribute('src'))`)) {
      throw new Error(`review ${language}: Back restored stale media`)
    }
    await client.send('Page.navigateToHistoryEntry', { entryId: entries[currentIndex].id }, sessionId)
    for (let attempt = 0; attempt < 60; attempt += 1) {
      if (await evaluate("location.search.includes('type=service')")) break
      await wait(50)
    }
    if (!await evaluate("location.search.includes('type=service') && document.querySelector('[data-search-controls-form] input[value=service]').checked")) {
      throw new Error(`review ${language}: Forward failed to restore the filter`)
    }
    results.push({ language, capability: 'keyboard-menu-form-map-media-actual-end-page-exit-deep-link-back-forward', result: 'pass' })
  }
  const report = await (await fetch(`${origin}/review-report.json`)).json()
  if (requests.some((url) => !reviewRequestIsAllowed(url, origin))) throw new Error('review interactions requested an external origin')
  report.embeddedBrowserResourceEvents = requests.filter((url) => url.startsWith('data:image/')).length
  report.browser = await client.send('Browser.getVersion')
  report.results = results
  report.coverage = { viewportCapabilityCases: 90, interactionCases: 2, lowerTier: 'local T0 Chromium emulation', fullInteractionSuite: 'shared renderer checks run all B01-005–B01-012 modes before this matrix', productionAcceptance: 'pending named language, browser/AT and physical-device T3 evidence' }
  for (const sample of Object.values(report.samples)) {
    if (sample.javascriptGzipBytes > 150 * 1024 || sample.initialGzipBytes > 1024 * 1024 || sample.initialRequests > 50) {
      throw new Error('review harness exceeds initial asset budgets')
    }
  }
  if (captureDirectory) await writeFile(path.join(captureDirectory, 'b01-013-review-report.json'), JSON.stringify(report, null, 2) + '\n')
  console.log(`B01-013 review matrix passed (${results.length} language/capability/viewport and media/history cases; ${reviewGroups.length} component groups).`)
  console.log(JSON.stringify({ samples: report.samples, motionRuntime: report.motionRuntime, activatedMedia: report.activatedMedia }))
}
