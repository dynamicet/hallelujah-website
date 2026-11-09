import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { setTimeout as delay } from 'node:timers/promises'
import { runVisualCheck } from './lib/visual-check.mjs'

const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const luminance = color => color.match(/[\d.]+/gu).slice(0, 3).map(Number)
  .map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
  .reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0)
const contrast = (foreground, background) => {
  const [low, high] = [luminance(foreground), luminance(background)].sort((a, b) => a - b)
  return (high + .05) / (low + .05)
}

// Measure the rendered foreground against its nearest opaque ancestor, including
// nested white panels. This fixture deliberately uses opaque grounds, not photos.
async function colors(page, selector) {
  return page.eval(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) throw new Error('Missing color specimen: ' + ${JSON.stringify(selector)});
    const style = getComputedStyle(element);
    let parent = element;
    while (parent && getComputedStyle(parent).backgroundColor === 'rgba(0, 0, 0, 0)') parent = parent.parentElement;
    return { foreground: style.color, background: getComputedStyle(parent).backgroundColor,
      outline: style.outlineColor, outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth,
      outlineOffset: style.outlineOffset, shadow: style.boxShadow };
  })()`)
}

await runVisualCheck('color-contexts', base, async ({ browser, output }) => {
  const measurements = []
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ width, height: 1000, mobile: width < 600, reducedMotion: true })
    try {
      await page.goto(new URL('/component-library', base).href)
      await page.send('DOM.enable')
      await page.send('CSS.enable')
      const { root } = await page.send('DOM.getDocument')
      for (const tone of ['paper', 'mist', 'supporting', 'expressive', 'assistance', 'inverse']) {
        const field = `[data-brand-tone='${tone}']:not(article)`
        const samples = ['> h2', '> p', '> [data-action-group] a:first-child', '> [data-action-group] a:nth-child(2)', '> [data-action-group] a:nth-child(3)', '> a:not([data-story-action-example])']
        for (const child of samples) {
          const selector = `${field} ${child}`
          const { nodeId } = await page.send('DOM.querySelector', { nodeId: root.nodeId, selector })
          for (const state of ['rest', 'hover', 'active']) {
            await page.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: state === 'rest' ? [] : [state] })
            await delay(200)
            const pair = await colors(page, selector)
            const ratio = contrast(pair.foreground, pair.background)
            measurements.push({ width, tone, child, state, ...pair, contrast: ratio })
            assert.ok(ratio >= 4.5, `${tone} ${child} ${state}: text contrast ${ratio.toFixed(2)}`)
          }
          await page.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [] })
        }
        const selector = `${field} > [data-action-group] a:first-child`
        await page.eval(`document.querySelector(${JSON.stringify(selector)}).focus()`)
        const focused = await colors(page, selector)
        const ground = await colors(page, `${field} > h2`)
        assert.equal(focused.outlineStyle, 'solid')
        assert.ok(contrast(focused.outline, ground.background) >= 3, `${tone}: outer focus contrast`)
        await page.eval(`document.querySelector(${JSON.stringify(field)}).scrollIntoView({block:'start',behavior:'instant'})`)
        await page.screenshot({ path: `${output}/${tone}-${width}.png` })
      }
      for (const tone of ['inverse', 'assistance']) {
        const selector = `#nested-card-${tone} ~ [data-action-link]`
        const pair = await colors(page, selector)
        assert.ok(contrast(pair.foreground, pair.background) >= 4.5, 'nested white panel action contrast')
      }
      for (const tone of ['supporting', 'expressive']) {
        const pair = await page.eval(`(() => {const s=getComputedStyle(document.querySelector('#context-field-${tone}'));return {foreground:s.borderTopColor,background:s.backgroundColor}})()`)
        assert.ok(contrast(pair.foreground, pair.background) >= 3, 'input inner boundary contrast')
        const ground = await colors(page, `[data-brand-tone='${tone}']:not(article) > h2`)
        assert.ok(contrast(pair.foreground, ground.background) >= 3, 'input outer boundary contrast')
      }
      const selector = 'a[href="/#patient-testimonials"]'
      const { nodeId } = await page.send('DOM.querySelector', { nodeId: root.nodeId, selector })
      for (const state of ['rest', 'hover', 'active']) {
        await page.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: state === 'rest' ? [] : [state] })
        await delay(200)
        const pair = await colors(page, selector)
        const ratio = contrast(pair.foreground, pair.background)
        assert.ok(ratio >= 4.5, `story action ${state}: ${ratio}`)
        if (state === 'active') assert.notEqual(pair.shadow, 'none', 'pressed story action retains a visible inset cue')
        measurements.push({ width, tone: 'story-media', state, ...pair, contrast: ratio })
      }
      await page.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [] })
      await page.eval(`document.querySelector(${JSON.stringify(selector)}).focus()`)
      const pair = await colors(page, selector)
      const ground = await colors(page, "[data-brand-tone='expressive']:not(article) > h2")
      assert.ok(contrast(pair.outline, ground.background) >= 3, 'story focus contrasts with pink')
      assert.deepEqual(page.consoleErrors, [])
      console.log(`PASS ${width}: rendered context text/action states, nested white panels, field edges and focus`)
    } finally { await page.close() }
  }
  await writeFile(`${output}/measurements.json`, JSON.stringify(measurements, null, 2) + '\n')
})
