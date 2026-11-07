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
        await page.locator('.care-background-film').scrollIntoViewIfNeeded()
        await page.waitForSelector('.care-film-control:not([hidden])')
        await page.locator('.care-film-control').focus()
        await page.keyboard.press('Enter')
        await page.waitForFunction(() => ['playing', 'failed'].includes(document.querySelector('.care-background-film').dataset.filmState))
        // Codec support varies by engine/host. A failed decode must retain a usable still/retry.
        const filmState = await page.locator('.care-background-film').getAttribute('data-film-state')
        if (filmState === 'playing') {
          await page.locator('.care-film-control').press('Enter')
          assert.equal(await page.locator('.care-background-film').getAttribute('data-film-state'), 'paused')
          await page.locator('.care-film-stop').press('Enter')
          assert.equal(await page.evaluate(() => document.activeElement.matches('.care-film-control')), true)
        } else {
          assert.equal(await page.locator('.care-film-control').innerText(), 'Try film again')
        }
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.waitForTimeout(100)
        assert.equal(await page.evaluate(() => document.getAnimations().length), 0)
        await page.locator('.equipment-chapter-nav a').nth(1).focus()
        await page.keyboard.press('Enter')
        await page.waitForTimeout(100)
        const gap = await page.locator('#equipment-laboratory-scene').evaluate(e => e.getBoundingClientRect().top - document.querySelector('[data-site-header]').getBoundingClientRect().bottom)
        assert.ok(Math.abs(gap - (width >= 900 ? 124 : 40)) < 3, `chapter landing gap ${gap}`)
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
        await writeFile(`${output}/observations.json`, JSON.stringify({ version: browser.version(), records }, null, 2))
        await page.close()
        console.log(`PASS ${engine} ${width}px: native timeline/fallback, keyboard story journey, film ${filmState}, reduced motion, equipment and menu`)
      }
      const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce', viewport: { width: 390, height: 844 } })
      const page = await context.newPage()
      await page.goto(base)
      await page.locator('.everyday-account summary').first().click()
      assert.equal(await page.locator('.everyday-account').first().evaluate(e => e.open), true)
      assert.equal(await page.locator('.everyday-film > summary').first().isVisible(), true)
      assert.equal(await page.locator('.care-background-film video').getAttribute('src'), null)
      await page.screenshot({ path: `${output}/no-js-390.png` })
      await context.close()
    }, { launchBrowser: () => playwright[engine].launch({ headless: true }) })
  } catch (error) {
    console.error(`${engine}: ${error.message}`)
    process.exitCode = 1
  }
}
