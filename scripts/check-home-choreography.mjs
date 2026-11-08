import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { runVisualCheck } from './lib/visual-check.mjs'

const baseUrl = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const pause = (page, ms) => page.eval(`new Promise(resolve => setTimeout(resolve, ${ms}))`)
const frame = (page) => page.eval('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')
const scrollToSection = (page, name) => page.eval(`document.querySelector('[data-motion-section="${name}"] h2').scrollIntoView({behavior:'instant', block:'center'})`)
const entrances = `document.getAnimations().filter(a => a instanceof CSSAnimation && a.animationName.startsWith('website-'))`

await runVisualCheck('home-choreography', baseUrl, async ({ browser, output }) => {
  const records = []
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ width, height: 1000, mobile: width < 600 })
    await page.goto(baseUrl)
    const sections = await page.eval(`[...document.querySelectorAll('[data-motion-section]')].map(e=>e.dataset.motionSection)`)
    assert.ok(sections.includes('care') && sections.includes('specialists') && sections.includes('stories'), 'core care and story sections retain motion allocation')
    assert.ok(!sections.includes('technology') && !sections.includes('film'), 'equipment invitation and hospital introduction stay static')
    const journey = []
    for (const name of sections) {
      await scrollToSection(page, name)
      await frame(page)
      await pause(page, 70)
      const state = await page.eval(`(() => {
        const section = document.querySelector('[data-motion-section="${name}"]')
        return {
          name: '${name}', y: scrollY,
          effects: section.getAnimations({subtree:true}).map(a => a.animationName || a.transitionProperty),
          nestedReveals: section.querySelectorAll('[data-reveal] [data-reveal]').length,
          overflow: document.documentElement.scrollWidth > innerWidth,
          readable: [...section.querySelectorAll('h2, h3')].every(e => Number(getComputedStyle(e).opacity) >= .65)
        }
      })()`)
      assert.equal(state.overflow, false)
      assert.equal(state.readable, true)
      assert.equal(state.nestedReveals, 0, 'do not animate nested layers independently')
      if (['care', 'technology', 'stories'].includes(name)) {
        await page.screenshot({ path: `${output}/${name}-entering-${width}.png` })
      }
      await pause(page, 950)
      assert.equal(await page.eval(`${entrances}.length`), 0, 'entrances settle when reading stops')
      journey.push(state)
    }
    // Reversing through the page must not replay text/card entrances.
    for (const name of [...sections].reverse()) {
      await scrollToSection(page, name)
      await frame(page)
      assert.equal(await page.eval(`${entrances}.length`), 0)
    }
    // Boundary accents respond in both directions, with no content re-entry.
    await page.eval(`scrollTo({top:0,behavior:'instant'})`)
    await pause(page, 800)
    const collapsed = await page.eval(`getComputedStyle(document.querySelector('[data-motion-section="care"]'),'::before').transform`)
    await scrollToSection(page, 'care')
    await pause(page, 850)
    const expanded = await page.eval(`getComputedStyle(document.querySelector('[data-motion-section="care"]'),'::before').transform`)
    assert.notEqual(collapsed, expanded)
    await page.screenshot({ path: `${output}/technology-settled-${width}.png` })
    // Live preference change also settles decorative section boundaries.
    await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
    await frame(page)
    assert.equal(await page.eval('document.getAnimations().length'), 0)
    assert.equal(await page.eval(`getComputedStyle(document.querySelector('[data-motion-chapter]'),'::before').transform`), 'none')
    assert.equal(await page.eval(`[...document.querySelectorAll('video')].filter(v=>!v.paused).length`), 0)
    await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })

    // A fresh visit: skip an entrance mid-flight, then return to settled copy.
    await page.goto(baseUrl)
    await scrollToSection(page, 'updates')
    await frame(page)
    await page.eval(`scrollTo({top:0,behavior:'instant'})`)
    await pause(page, 100)
    assert.equal(await page.eval(`document.querySelector('[data-motion-section="updates"]').getAnimations({subtree:true}).length`), 0)
    await scrollToSection(page, 'specialists')
    await frame(page)
    await page.eval(`document.querySelector('.team-person').focus()`)
    assert.equal(await page.eval(`document.querySelector('.team-person').getAnimations().length`), 0)
    assert.equal(await page.eval(`document.activeElement.matches('.team-person:focus-visible')`), true)

    // Exercise Next client navigation while other entrances may still be active.
    await page.eval(`document.querySelector('.team-directory').click()`)
    for (let attempt = 0; attempt < 100; attempt++) {
      if (await page.eval(`location.pathname === '/doctors' && !document.querySelector('.enhanced-home')`)) break
      await pause(page, 100)
    }
    assert.equal(await page.eval(`location.pathname`), '/doctors')
    assert.equal(await page.eval(`document.querySelectorAll('.motion-chapter-ready').length`), 0)
    await page.eval('history.back()')
    for (let attempt = 0; attempt < 100; attempt++) {
      if (await page.eval(`Boolean(document.querySelector('[data-motion-section="care"]'))`)) break
      await pause(page, 100)
    }
    assert.equal(await page.eval(`Boolean(document.querySelector('[data-motion-section="care"]'))`), true)
    await pause(page, 1000)
    assert.deepEqual(page.consoleErrors, [])
    records.push({ width, journey, boundary: { collapsed, expanded }, fastScroll: 'passed', keyboardFocus: 'passed', clientNavigation: 'passed' })
    await writeFile(output + '/observations.json', JSON.stringify(records, null, 2))
    await page.close()
    console.log(`PASS ${width}px: full-home sequence, reverse/fast scroll, focus, reduced motion, client navigation`)
  }
})
