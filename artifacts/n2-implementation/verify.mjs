import { Browser, sleep } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs'
import { writeFileSync } from 'node:fs'
const out = new URL('.', import.meta.url).pathname
const b = await Browser.launch()
const p = await b.newPage()
const results = []
const routes = ['/', '/feedback', '/appointment', '/patients-visitors', '/referrals', '/emergency', '/doctors', '/services']
try {
for (const width of [1440, 768, 390, 320]) {
 for (const route of routes) {
  await p.setViewport({ width, height: 900 })
  await p.goto('http://localhost:3000' + route, { settleMs: 300 })
  await p.eval(() => document.fonts.ready)
  const data = await p.eval(() => {
   const footer = document.querySelector('footer')
   return {
    variant: footer.dataset.footerVariant,
    height: footer.getBoundingClientRect().height,
    overflow: document.documentElement.scrollWidth > innerWidth,
    slogan: footer.innerText.includes('Bringing Quality'),
    links: [...footer.querySelectorAll('nav a')].map(a => a.getAttribute('href')),
    smallestTarget: Math.min(...[...footer.querySelectorAll('a')].map(a => a.getBoundingClientRect().height)),
    actionRadius: getComputedStyle(document.documentElement).getPropertyValue('--site-action-radius').trim(),
   }
  })
  if (data.variant !== (route === '/' ? 'full' : 'compact') || data.overflow || data.slogan || data.links.length !== 12 || data.smallestTarget < 44) throw new Error(JSON.stringify({ route, width, ...data }))
  results.push({ route, width, ...data })
  if (['/', '/feedback', '/appointment'].includes(route) && width !== 320) {
   await p.eval(() => document.querySelector('footer').scrollIntoView({ behavior: 'instant', block: 'end' }))
   await sleep(300)
   await p.screenshot({ path: out + (route.slice(1) || 'home') + '-' + width + '.jpg' })
  }
 }
}
// Root-font preference stress, retaining usable navigation and avoiding horizontal overflow.
for (const width of [1440, 768, 390, 320]) {
 await p.setViewport({ width, height: 900 })
 await p.goto('http://localhost:3000/feedback', { settleMs: 200 })
 await p.eval(() => { document.documentElement.style.fontSize = '200%'; document.querySelector('footer').scrollIntoView({ behavior: 'instant', block: 'end' }) })
 const data = await p.eval(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, links: document.querySelectorAll('footer nav a').length }))
 if (data.overflow || data.links !== 12) throw new Error('Enlarged font: ' + JSON.stringify({ width, ...data }))
 results.push({ scenario: 'font200', width, ...data })
}
await p.goto('http://localhost:3000/feedback', { settleMs: 200 })
await p.eval(() => document.querySelector('footer a').focus())
await p.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
await p.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
const focus = await p.eval(() => ({ href: document.activeElement.getAttribute('href'), outline: getComputedStyle(document.activeElement).outlineStyle }))
if (focus.href !== '/news-resources' || focus.outline === 'none') throw new Error('Keyboard focus: ' + JSON.stringify(focus))
results.push({ scenario: 'keyboard', ...focus })
await p.eval(() => document.querySelector('footer a[href="#"]').focus())
await sleep(1200)
await p.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
await p.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
await sleep(1600)
if (await p.eval(() => scrollY) > 1) throw new Error('Back to top failed')
results.push({ scenario: 'back-to-top', passed: true })
await p.send('Emulation.setScriptExecutionDisabled', { value: true })
await p.goto('http://localhost:3000/feedback', { settleMs: 200 })
const noJs = await p.eval(() => ({ variant: document.querySelector('footer').dataset.footerVariant, links: document.querySelectorAll('footer nav a').length }))
if (noJs.variant !== 'compact' || noJs.links !== 12) throw new Error('No JavaScript footer failed')
results.push({ scenario: 'no-js', ...noJs })
writeFileSync(out + 'results.json', JSON.stringify(results, null, 2))
console.log(JSON.stringify({ passed: results.length, heights: results.filter(r => r.route === '/feedback').map(r => ({ width: r.width, height: r.height })) }))
} finally { await b.close() }
