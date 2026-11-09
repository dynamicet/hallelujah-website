import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { runVisualCheck } from './lib/visual-check.mjs'

// Optional tooling, isolated from the website bundle. See docs/visual-checks.md.
if (!process.env.HH_PLAYWRIGHT_MODULE) throw new Error('Set HH_PLAYWRIGHT_MODULE to an installed playwright-core index.mjs; see docs/visual-checks.md.')
const playwright = await import(pathToFileURL(resolve(process.env.HH_PLAYWRIGHT_MODULE)).href)
const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const engines = (process.env.HH_BROWSER_ENGINES || 'firefox,webkit').split(',')
assert.ok(engines.every(engine => ['firefox', 'webkit'].includes(engine)))

for (const engine of engines) {
  try {
    await runVisualCheck(`motion-${engine}`, base, async ({ browser, output }) => {
      const records = []
      for (const width of [390, 768, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 1000 } })
        const errors = []
        const mediaRequests = []
        page.on('pageerror', error => errors.push(error.message))
        page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
        page.on('request', request => { if (/\.(webm|mp4)(\?|$)/u.test(request.url())) mediaRequests.push(request.url()) })
        await page.goto(base)
        await page.waitForSelector('html[data-hydration=ready]')
        await page.evaluate(() => document.fonts.ready)
        await page.locator('#patient-testimonials').scrollIntoViewIfNeeded()
        await page.waitForTimeout(1100)
        const supportsTimeline = await page.evaluate(() => CSS.supports('animation-timeline: view()') && CSS.supports('animation-range: entry 0% entry 100%'))
        const name = await page.locator('[data-signature-frame=story] > img').first().evaluate(e => getComputedStyle(e).animationName)
        assert.equal(name, width >= 900 && supportsTimeline ? 'signature-story' : 'none')
        await page.screenshot({ path: `${output}/stories-${width}.png` })
        await page.locator('.everyday-film > summary').first().focus()
        await page.keyboard.press('Enter')
        await page.waitForTimeout(500)
        assert.equal(await page.locator('.story-cinema[open]').count(), 1)
        assert.equal(await page.evaluate(() => document.activeElement === document.querySelector('.story-cinema[open] .story-cinema-close')), true)
        await page.locator('.story-cinema[open] .everyday-transcript > summary').first().focus()
        await page.keyboard.press('Enter')
        await page.waitForTimeout(500)
        assert.equal(await page.evaluate(() => document.activeElement === document.querySelector('.story-cinema[open] .everyday-transcript > summary')), true)
        await page.screenshot({ path: `${output}/transcript-${width}.png` })
        await page.locator('.story-cinema[open] .everyday-transcript .story-reading-return').first().focus()
        await page.keyboard.press('Enter')
        await page.waitForTimeout(500)
        assert.equal(await page.locator('.story-cinema[open] .everyday-transcript').first().evaluate(e => e.open), false)
        assert.equal(await page.locator('.story-cinema[open]').count(), 1)
        assert.equal(mediaRequests.length, 0, 'discovery and transcript reading do not request video')
        await page.keyboard.press('Escape')
        assert.equal(await page.locator('.care-background-film').count(), 0)
        await page.goto(base + '/about')
        await page.waitForSelector('html[data-hydration=ready]')
        const filmState = await page.locator('#hospital-film video').evaluate(video => ({
          controls: video.controls, autoplay: video.autoplay, loop: video.loop,
          preload: video.preload, paused: video.paused,
        }))
        assert.deepEqual(filmState, { controls: true, autoplay: false, loop: false, preload: 'none', paused: true })
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.waitForTimeout(100)
        assert.equal(await page.evaluate(() => document.getAnimations().length), 0)
        await page.locator('main a[href="#medical-technology"]').focus()
        await page.keyboard.press('Enter')
        await page.waitForTimeout(300)
        const gap = await page.locator('#medical-technology').evaluate(e => e.getBoundingClientRect().top - document.querySelector('[data-site-header]').getBoundingClientRect().bottom)
        assert.ok(gap >= -1, `equipment is clear of the header: ${gap}`)
        await page.locator('#medical-technology summary').first().focus()
        await page.keyboard.press('Enter')
        assert.equal(await page.locator('#medical-technology details').first().evaluate(e => e.open), true)
        await page.keyboard.press('Enter')
        assert.equal(await page.locator('#medical-technology details').first().evaluate(e => e.open), false)
        await page.screenshot({ path: `${output}/equipment-${width}.png` })
        if (width < 1024) {
          await page.locator('[data-menu-trigger]').press('Enter')
          await page.waitForFunction(() => document.querySelector('[data-navigation-panel]').matches(':popover-open'))
          await page.keyboard.press('Escape')
          await page.waitForTimeout(200)
          assert.equal(await page.evaluate(() => document.activeElement.hasAttribute('data-menu-trigger')), true)
        }
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
        assert.deepEqual(errors, [])
        records.push({ width, supportsTimeline, storyAnimation: name, filmState, gap, errors })
        await writeFile(`${output}/observations.json`, JSON.stringify({ version: browser.version(), records }, null, 2) + '\n')
        await page.close()
        console.log(`PASS ${engine} ${width}px: native timeline/fallback, keyboard story journey, native About film, reduced motion, equipment and menu`)
      }
      const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce', viewport: { width: 390, height: 844 } })
      const page = await context.newPage()
      await page.goto(base)
      assert.equal(await page.locator('.everyday-film > summary').first().isVisible(), true)
      await page.locator('.everyday-film > summary').first().click()
      assert.equal(await page.locator('.everyday-film').first().evaluate(e => e.open), true)
      assert.equal(await page.locator('.everyday-film video').first().isVisible(), true)
      await page.screenshot({ path: `${output}/no-js-390.png` })
      await page.goto(base + '/about')
      assert.equal(await page.locator('#hospital-film video').evaluate(video => video.controls && !video.autoplay && video.preload === 'none'), true)
      await context.close()
    }, { launchBrowser: () => playwright[engine].launch({ headless: true }) })
  } catch (error) {
    console.error(`${engine}: ${error.message}`)
    process.exitCode = 1
  }
}
