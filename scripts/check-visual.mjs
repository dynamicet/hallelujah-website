import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { runVisualCheck } from './lib/visual-check.mjs'

const baseUrl = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const routes = process.argv.slice(2)
if (routes.some(route => !route.startsWith('/') || route.startsWith('//'))) {
  throw new Error('Pass local route paths, for example: pnpm visual:check / /doctors')
}

await runVisualCheck('responsive', baseUrl, async ({ browser, output }) => {
  const results = []
  for (const [index, route] of (routes.length ? routes : ['/']).entries()) {
    for (const width of [390, 768, 1440]) {
      const page = await browser.newPage({ width, height: 1000, mobile: width < 600, reducedMotion: true })
      try {
        await page.goto(new URL(route, baseUrl).href)
        await page.eval('Promise.all([...document.images].map(image => { image.loading = "eager"; return image.decode().catch(() => {}) }))')
        const layout = await page.eval(() => ({
          titleCount: document.querySelectorAll('h1').length,
          hasMain: Boolean(document.querySelector('main')),
          overflow: document.documentElement.scrollWidth > innerWidth,
          brokenImages: [...document.images].filter(image => !image.naturalWidth).map(image => image.currentSrc || image.src),
        }))
        await page.screenshot({ path: path.join(output, `route-${index}-${width}.png`), fullPage: true })
        results.push({ route, width, ...layout, consoleErrors: [...page.consoleErrors] })
        await writeFile(path.join(output, 'measurements.json'), `${JSON.stringify(results, null, 2)}\n`)
        assert.equal(layout.titleCount, 1, `${route} at ${width}px: expected one h1`)
        assert.equal(layout.hasMain, true, `${route}: missing main`)
        assert.equal(layout.overflow, false, `${route} at ${width}px: horizontal overflow`)
        assert.deepEqual(layout.brokenImages, [], `${route}: broken images`)
        assert.deepEqual(page.consoleErrors, [], `${route}: browser errors`)
        console.log(`PASS ${route} at ${width}px`)
      } finally { await page.close() }
    }
  }
})
