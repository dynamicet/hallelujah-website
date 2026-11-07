import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { Browser } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs'

// Local visual evidence only; never imported by the application.
const output = '.taste-skill/appointment/states'
await mkdir(output, { recursive: true })
const browser = await Browser.launch()
try {
  const page = await browser.newPage({ width: 1440, height: 1000 })
  const ready = () => page.eval(`new Promise(resolve => {
    const check = () => document.querySelector('[data-appointment-safe-form]')?.inert === false
      ? resolve(true) : setTimeout(check, 30);
    check();
  })`)
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewport({ width, height: 1000, mobile: width < 600 })
    await page.goto('http://localhost:3000/appointment')
    await ready()
    await page.eval(`document.querySelector('[data-journey-next]').click()`)
    assert.equal(await page.eval(`document.querySelector('[data-appointment-template]').dataset.journeyStep`), '1')
    // Native Enter must reach review without completing the example.
    await page.eval(`(() => {
      document.querySelector('#full-name').value = 'TEST PATIENT';
      document.querySelector('#phone').value = '+0 000 000 0000';
      document.querySelector('#privacy-acknowledged').click();
      document.querySelector('#phone').focus();
    })()`)
    await page.eval(`window.scrollTo({ top: 0, behavior: 'instant' })`)
    await new Promise(resolve => setTimeout(resolve, 250))
    await page.screenshot({ path: `${output}/details-${width}.jpg`, fullPage: true })
    await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' })
    await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
    assert.equal(await page.eval(`document.querySelector('[data-appointment-template]').dataset.journeyStep`), '2')
    assert.equal(await page.eval(`document.querySelector('[data-appointment-template]').dataset.appointmentState`), 'editing')
    assert.equal(await page.eval(`document.querySelector('[data-journey-review] [data-journey-value=name]').textContent`), 'TEST PATIENT')
    await page.eval(`window.scrollTo({ top: 0, behavior: 'instant' })`)
    await new Promise(resolve => setTimeout(resolve, 250))
    await page.screenshot({ path: `${output}/review-${width}.jpg`, fullPage: true })
    assert.equal(await page.eval('document.documentElement.scrollWidth > innerWidth'), false)
  }
  const reduced = await browser.newPage({ width: 390, height: 844, reducedMotion: true })
  await reduced.goto('http://localhost:3000/appointment')
  assert.equal(await reduced.eval('document.getAnimations().length'), 0)
  await reduced.screenshot({ path: `${output}/reduced-motion-390.jpg`, fullPage: true })
  console.log('Appointment journey: native Enter reaches review; details/review reflow at 320, 390, 768 and 1440px; reduced motion has zero animations.')
} finally {
  await browser.close()
}
