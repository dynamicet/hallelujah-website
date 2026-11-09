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
    await page.eval('document.querySelector("[data-care-guide]").focus()')
    await key(page, 'Enter')
    await waitFor(page, '!!document.querySelector("[data-patient-guide][open]")')
    const bounds = () => {
      const dialog = document.querySelector('[data-patient-guide]')
      const input = dialog.querySelector('input').getBoundingClientRect()
      const header = dialog.querySelector('header').getBoundingClientRect()
      const frame = dialog.getBoundingClientRect()
      return { inputVisible: input.top >= frame.top && input.bottom <= Math.min(innerHeight, frame.bottom),
        headerVisible: header.top >= frame.top && header.bottom <= frame.bottom,
        panelScroll: dialog.scrollTop, conversationScroll: dialog.querySelector('[data-guide-transcript]').scrollTop }
    }
    assert.equal((await page.eval(bounds)).inputVisible, true, `${width}: initial composer visible`)
    for (let turn = 0; turn < 3; turn++) {
      await page.eval('document.querySelector("[data-guide-input]").focus()')
      await page.send('Input.insertText', { text: 'visiting hours' })
      await key(page, 'Enter')
      await waitFor(page, `document.querySelectorAll('[data-guide-turn]').length === ${turn + 1}`)
    }
    const guide = await page.eval(bounds)
    assert.equal(guide.inputVisible, true, `${width}: composer visible after replies`)
    assert.equal(guide.headerVisible, true, `${width}: header visible after replies`)
    assert.equal(guide.panelScroll, 0, `${width}: panel itself must not scroll`)
    assert.ok(guide.conversationScroll > 0, `${width}: conversation scrolls`)
    await page.screenshot({ path: `${output}/guide-${width}x${height}.png` })
    await key(page, 'Escape', 'Escape', 27)
    assert.equal(await page.eval('document.activeElement.hasAttribute("data-care-guide")'), true)
    measurements.push({ width, height, guide })
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
        await page.eval('document.querySelector("[class*=menuResources] button").focus()')
        await key(page, 'Enter')
        await waitFor(page, '!!document.querySelector("[data-patient-guide][open]")')
        await key(page, 'Escape', 'Escape', 27)
      }
    }
    assert.deepEqual(page.consoleErrors, [])
    await page.close()
    console.log(`PASS ${width}×${height}: fixed guide header/composer, conversation scroll, keyboard dismissal${height > 480 ? ', care modes, topic examples, available language selection, captioned film playback and pause' : ''}`)
  }
  await writeFile(`${output}/measurements.json`, `${JSON.stringify(measurements, null, 2)}\n`)
})
