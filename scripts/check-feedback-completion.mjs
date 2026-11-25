import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { runVisualCheck } from './lib/visual-check.mjs'

const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
await runVisualCheck('feedback-completion', base, async ({ browser, output }) => {
  const metadata = []
  const page = await browser.newPage({ width: 1440, height: 1000, reducedMotion: true })
  for (const route of ['/appointment', '/doctors', '/services', '/emergency', '/feedback', '/contact', '/referrals',
    '/doctors/synthetic-clinician-101010101010/', '/services/synthetic-service-151515151515/', '/services/synthetic-service-111111111111/']) {
    await page.goto(new URL(route, base).href)
    const description = await page.eval('document.querySelector("meta[name=description]")?.content')
    assert.ok(description?.length > 40, `${route}: meaningful page description`)
    assert.notEqual(description, 'Find care and visitor information at Hallelujah Hospital.', `${route}: override the generic layout description`)
    metadata.push({ route, description })
  }
  assert.equal(new Set(metadata.map(item => item.description)).size, metadata.length, 'Distinct descriptions for each checked page')
  assert.deepEqual(page.consoleErrors, [])
  await page.close()
  await writeFile(`${output}/metadata.json`, JSON.stringify(metadata, null, 2))
  for (const width of [390, 768, 1440]) {
    const guide = await browser.newPage({ width, height: 1000, mobile: width < 600, reducedMotion: true })
    for (const id of ['111111111111', '171717171717', '181818181818']) {
      await guide.goto(`${base}/services/synthetic-service-${id}/`)
      const order = await guide.eval(() => {
        const header = document.querySelector('[data-top-bar]')
        const emergency = header.querySelector('a[href="/emergency"]').getBoundingClientRect()
        const language = header.querySelector('[data-language-switcher]').getBoundingClientRect()
        return language.left >= emergency.right - 1
      })
      assert.ok(order, 'Emergency appears before language at every width')
      const target = id === '171717171717' ? 'main a[href^="/appointment?service="]' : 'main a[href="/contact#contact-reception"]'
      assert.ok(await guide.eval(`document.querySelector(${JSON.stringify(target)})` + ' !== null'))
      await guide.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
      await guide.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
      await guide.eval(`document.querySelector(${JSON.stringify(target)}).focus()`)
      assert.notEqual(await guide.eval('getComputedStyle(document.activeElement).outlineStyle'), 'none')
      await guide.screenshot({ path: `${output}/guide-${id}-${width}.png`, fullPage: true })
      assert.deepEqual(guide.consoleErrors, [])
    }
    await guide.close()
    console.log(`PASS ${width}: Emergency/language order, admission and therapy destinations, primary links and keyboard focus`)
  }
  console.log('PASS page-specific metadata on eleven public routes')
})
