import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { runVisualCheck } from './lib/visual-check.mjs'

const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const waitFor = async (page, expression) => {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await page.eval(expression)) return
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  throw new Error(`Timed out: ${expression}`)
}
const key = async (page, name, code = name, number = 13) => {
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: name, code, windowsVirtualKeyCode: number, ...(name === 'Enter' ? { text: '\r' } : {}) })
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: name, code, windowsVirtualKeyCode: number })
}

await runVisualCheck('usability-refinements', base, async ({ browser, output }) => {
  const measurements = []
  for (const [width, height] of [[390, 844], [768, 900], [1440, 900], [375, 400], [844, 390]]) {
    const page = await browser.newPage({ width, height, mobile: width < 600, reducedMotion: true })
    await page.goto(base)
    await waitFor(page, 'document.documentElement.dataset.hydration === "ready"')
    assert.equal(await page.eval('document.querySelectorAll("[data-patient-guide], [data-care-guide], [data-help-widget]").length'), 0)
    assert.equal(await page.eval('document.querySelector("[data-call-widget] a").getAttribute("href")'), 'tel:9975')
    measurements.push({ width, height, chatbotRemoved: true })
    if (height > 480) {
      await page.eval('scrollTo({top:0,behavior:"instant"})')
      await page.screenshot({ path: `${output}/home-${width}.png` })
      await page.eval('document.querySelector("[data-language-switcher]").open = true')
      assert.equal(await page.eval('document.querySelector("[data-language-switcher] button").disabled'), false)
      await page.eval('document.querySelector("[data-language-switcher]").open = false')
      await page.eval('document.querySelector(".care-mode-options input[value=services]").click()')
      assert.equal(await page.eval('new URL(document.querySelector(".care-search-panel form").action).pathname'), '/services')
      await page.goto(base + '/health-topics')
      await page.eval(`document.querySelector('[aria-label="Topics beginning with B"]').click()`)
      await waitFor(page, '!!document.querySelector("[data-health-topic]")')
      await page.goto(base)
      for (const [name, selector] of [['doctors', '#home-doctors'], ['equipment', '#medical-technology'], ['footer', '[data-site-footer]'], ['partners', '#partners']]) {
        await page.eval(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'start',behavior:'instant'})`)
        await page.screenshot({ path: `${output}/${name}-${width}.png` })
      }
      await page.eval('document.querySelector(".everyday-film > summary").scrollIntoView({block:"center",behavior:"instant"})')
      await waitFor(page, 'document.querySelector("#patient-testimonials")?.dataset.storyControlsReady === "true"')
      await page.eval('document.querySelector(".everyday-film > summary").focus()')
      await waitFor(page, 'document.querySelector(".everyday-film > summary").getBoundingClientRect().top >= 0')
      await key(page, 'Enter')
      await waitFor(page, '!!document.querySelector(".story-cinema[open]")')
      await page.eval('window.hhUsabilityVideo = document.querySelector(".story-cinema[open] video"); window.hhUsabilityVideo.play()')
      await waitFor(page, 'document.querySelector(".story-cinema[open] video").currentTime > 0')
      assert.equal(await page.eval('document.querySelector(".story-cinema[open] video").textTracks[0].mode'), 'showing')
      await page.screenshot({ path: `${output}/story-playing-${width}.png` })
      await key(page, 'Escape', 'Escape', 27)
      await waitFor(page, '!document.querySelector(".story-cinema[open]")')
      assert.equal(await page.eval('window.hhUsabilityVideo.paused'), true)
      if (width < 1024) {
        await page.eval('scrollTo({top:0,behavior:"instant"}); document.querySelector("[data-menu-trigger]").click()')
        await page.screenshot({ path: `${output}/navigation-${width}.png` })
        if (width === 768) assert.equal(await page.eval('[...document.querySelectorAll("[data-site-header] a[href=\\"/appointment\\"]")].filter(el => el.getClientRects().length).length'), 1)
        await key(page, 'Escape', 'Escape', 27)
      }
    }
    assert.deepEqual(page.consoleErrors, [])
    await page.close()
    console.log(`PASS ${width}×${height}: chatbot removal and hotline action${height > 480 ? ', care modes, topic examples, available language selection, captioned film playback and pause' : ''}`)
  }
  await writeFile(`${output}/measurements.json`, `${JSON.stringify(measurements, null, 2)}\n`)
})
