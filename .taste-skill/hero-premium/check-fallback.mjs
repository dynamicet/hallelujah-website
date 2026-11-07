import assert from 'node:assert/strict'
import { Browser } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs'
const browser = await Browser.launch()
try {
  const page = await browser.newPage({width:390,height:844})
  await page.send('Emulation.setScriptExecutionDisabled',{value:true})
  await page.goto('http://localhost:3000')
  await page.eval('document.fonts.ready')
  assert.equal(await page.eval('document.querySelector(".welcome h1").innerText.replace(/\\s+/g," ")'),'Care begins with you.')
  assert.equal(await page.eval('getComputedStyle(document.querySelector(".welcome h1")).animationName'),'none')
  assert.equal(await page.eval('getComputedStyle(document.querySelector(".welcome-appointment")).animationName'),'none')
  await page.screenshot({path:'.taste-skill/hero-premium/no-javascript-static.jpg'})
  console.log('No-JavaScript fallback: static headline and appointment action present; screenshot captured.')
} finally { await browser.close() }
