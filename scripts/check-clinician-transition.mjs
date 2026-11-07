import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { setTimeout as pause } from 'node:timers/promises'
import { runVisualCheck } from './lib/visual-check.mjs'

const baseUrl = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
async function until(page, expression) {
  for (let attempt = 0; attempt < 160; attempt++) {
    try { if (await page.eval(expression)) return } catch { /* Document replacement. */ }
    await pause(50)
  }
  throw new Error(`Timed out: ${expression}; state: ${JSON.stringify(await page.eval('({url: location.href, title: document.title, transition: window.careTransition})'))}`)
}
const probe = `
  window.careTransition = { present: false, ready: false };
  function captureTransition(transition) {
    if (!transition) return;
    window.careTransition = { present: true, ready: false };
    transition.ready.then(() => {
      const animations = document.getAnimations().filter(animation => animation.effect?.pseudoElement?.startsWith('::view-transition'));
      window.careAnimations = animations;
      animations.forEach(animation => { animation.pause(); animation.currentTime = 0; });
      window.careTransition = { present: true, ready: true, animations: animations.map(animation => ({ pseudo: animation.effect.pseudoElement, duration: animation.effect.getTiming().duration })) };
    }).catch(error => { window.careTransition.error = error.message; });
  }
  addEventListener('pagereveal', event => captureTransition(event.viewTransition));
  if (document.startViewTransition) {
    const start = document.startViewTransition.bind(document);
    document.startViewTransition = (...args) => { const transition = start(...args); captureTransition(transition); return transition; };
  }
`

await runVisualCheck('clinician-transition', baseUrl, async ({ browser, output }) => {
  const results = []
  for (const width of [390, 768, 1440]) {
    for (const reducedMotion of [false, true]) {
      const page = await browser.newPage({ width, height: 1000, mobile: width < 600, reducedMotion })
      try {
        await page.send('Page.addScriptToEvaluateOnNewDocument', { source: probe })
        await page.goto(`${baseUrl}/doctors?q=Aster`)
        assert.equal(await page.eval(() => Boolean(document.querySelector('style[data-href="care-identity-transitions"]'))), true)
        await page.eval('window.originalDocument = document; true')
        const link = '[data-clinician-public-id] a[aria-label^="View profile"]'
        await page.eval(`document.querySelector('${link}').focus()`)
        const target = await page.eval(`document.querySelector('${link}').href`)
        await page.screenshot({ path: path.join(output, `source-${width}-${reducedMotion}.png`) })
        await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
        await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
        await until(page, `location.pathname.replace(/\\/$/, "") === ${JSON.stringify(new URL(target).pathname.replace(/\/$/, ""))} && Boolean(document.querySelector('#clinician-profile-title')) && window.careTransition`)
        if (!reducedMotion) {
          await until(page, 'window.careTransition.ready || window.careTransition.error')
          const motion = await page.eval('window.careTransition')
          assert.equal(motion.error, undefined)
          assert.equal(motion.present, true)
          const groups = motion.animations.filter(animation => animation.pseudo.startsWith('::view-transition-group('))
          assert.equal(groups.length, 2, 'Only the matching portrait and name should travel')
          assert.ok(groups.every(animation => animation.duration === 380))
          for (const [frame, time] of [['start', 0], ['middle', 140], ['end', 375]]) {
            await page.eval(`window.careAnimations.forEach(animation => { animation.currentTime = ${time}; })`)
            await pause(40)
            await page.screenshot({ path: path.join(output, `${frame}-${width}.png`) })
          }
          if (width === 390) {
            await page.eval('window.careAnimations.forEach(animation => { animation.currentTime = 140; })')
            await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
            await until(page, '!document.getAnimations().some(animation => animation.effect?.pseudoElement?.startsWith("::view-transition"))')
          }
          await page.eval('window.careAnimations.forEach(animation => animation.finish())')
          results.push({ width, reducedMotion, motion })
        } else {
          assert.equal(await page.eval('window.careTransition.present'), false, 'Reduced motion must disable animation')
          results.push({ width, reducedMotion, motion: 'disabled' })
        }
        assert.equal(await page.eval('window.originalDocument === document'), true, 'Enhanced navigation must reuse the hydrated document');
        await until(page, 'document.readyState === "complete" && document.documentElement.dataset.hydration !== "pending"')
        await page.eval('document.fonts.ready')
        assert.equal(await page.eval('document.documentElement.scrollWidth > innerWidth'), false)
        assert.equal(await page.eval('document.querySelector("#clinician-profile-title").textContent'), 'Dr Aster')
        if (!reducedMotion) {
          assert.equal(await page.eval('document.activeElement.id'), 'clinician-profile-title')
          assert.equal(await page.eval('scrollY'), 0, 'Profile arrival should begin at the top')
        }
        await page.screenshot({ path: path.join(output, `profile-${width}-${reducedMotion}.png`) })
        const back = await page.eval(() => document.querySelector('[data-profile-section="P1"] a[href^="/doctors"]').getAttribute('href'))
        assert.equal(back, '/doctors?q=Aster')
        const history = await page.send('Page.getNavigationHistory')
        await page.send('Page.navigateToHistoryEntry', { entryId: history.entries[history.currentIndex - 1].id })
        await until(page, 'location.pathname === "/doctors" && location.search === "?q=Aster" && Boolean(document.querySelector("[data-clinician-public-id]"))')
        await page.eval('window.careAnimations?.forEach(animation => animation.finish())')
        assert.deepEqual(page.consoleErrors, [])
        console.log(`PASS keyboard/profile/history ${width}px, reduced motion ${reducedMotion}`)
      } finally { await page.close() }
    }
  }
  for (const scriptsDisabled of [false, true]) {
    const page = await browser.newPage({ width: 390, height: 1000, mobile: true, reducedMotion: true })
    try {
      if (scriptsDisabled) await page.send('Emulation.setScriptExecutionDisabled', { value: true })
      await page.goto(`${baseUrl}/doctors?q=Genet`)
      await page.eval(() => document.querySelector('[data-clinician-public-id] a[aria-label^="View profile"]').focus())
      await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
      await until(page, 'Boolean(document.querySelector("#clinician-profile-title"))')
      assert.equal(await page.eval('document.querySelector("#clinician-profile-title").textContent'), 'Dr Genet')
      assert.equal(await page.eval(() => Boolean(document.querySelector('[data-profile-section="P1"] [data-clinician-monogram]'))), true)
      await page.screenshot({ path: path.join(output, `monogram-${scriptsDisabled ? 'no-js' : 'js'}.png`) })
      assert.deepEqual(page.consoleErrors, [])
      results.push({ scriptsDisabled, monogram: 'passed' })
      console.log(`PASS initials fallback, JavaScript disabled ${scriptsDisabled}`)
    } finally { await page.close() }
  }
  for (const fallback of ['unsupported', 'slow-route']) {
    const page = await browser.newPage({ width: 390, height: 1000, mobile: true, reducedMotion: false })
    try {
      if (fallback === 'unsupported') await page.send('Page.addScriptToEvaluateOnNewDocument', {
        source: 'Object.defineProperty(Document.prototype, "startViewTransition", { value: undefined });',
      })
      await page.goto(`${baseUrl}/doctors?q=Aster`)
      await page.eval('window.originalDocument = document; true')
      if (fallback === 'slow-route') await page.send('Network.emulateNetworkConditions', {
        offline: false, latency: 1800, downloadThroughput: -1, uploadThroughput: -1,
      })
      await page.eval(() => document.querySelector('[data-clinician-public-id] a[aria-label^="View profile"]').click())
      await until(page, 'Boolean(document.querySelector("#clinician-profile-title")) && !document.documentElement.hasAttribute("data-care-profile-transition")')
      assert.equal(await page.eval('window.originalDocument === document'), true)
      assert.equal(await page.eval(() => document.querySelectorAll('[data-selected-care-transition]').length), 0)
      assert.deepEqual(page.consoleErrors, [])
      results.push({ fallback, status: 'passed' })
      console.log(`PASS ${fallback} navigation and cleanup`)
    } finally { await page.close() }
  }
  await writeFile(path.join(output, 'measurements.json'), `${JSON.stringify(results, null, 2)}\n`)
})
