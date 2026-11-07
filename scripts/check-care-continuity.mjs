import assert from 'node:assert/strict'
import { runVisualCheck } from './lib/visual-check.mjs'

const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const service = '/services/synthetic-service-151515151515/'
const waitFor = async (page, expression) => {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await page.eval(expression)) return
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  throw new Error(`Timed out: ${expression}`)
}
const enter = async page => {
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' })
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
}
await runVisualCheck('care-continuity', base, async ({ browser, output }) => {
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ width, height: 1000, mobile: width < 600, reducedMotion: true })
    await page.goto(base + service)
    const profile = await page.eval(() => document.querySelector('#care-team a').getAttribute('href'))
    assert.equal(new URL(profile, base).searchParams.get('service'), 'pub_151515151515')
    await page.goto(base + profile)
    assert.equal(await page.eval(() => document.querySelector('[aria-label="Your service choice"] strong').textContent), 'Heart medicine')
    const appointment = await page.eval(() => document.querySelector('a[aria-label^="Request an appointment with"]').getAttribute('href'))
    await page.goto(base + appointment)
    await waitFor(page, '!document.querySelector("[data-appointment-safe-form]").hasAttribute("inert")')
    assert.equal(await page.eval('document.querySelector("input[name=care_route]:checked").value'), 'doctor')
    assert.equal(await page.eval('document.querySelector("#doctor-id").value'), 'pub_121212121212')
    assert.equal(await page.eval('document.querySelector("[data-appointment-service-context] strong").textContent'), 'Heart medicine')
    await page.eval(() => document.querySelector('[data-journey-next]').click())
    await page.eval(() => document.querySelector('[data-journey-next]').click())
    assert.equal(await page.eval('document.activeElement.id'), 'appointment-error-summary-heading')
    await page.eval(() => {
      document.querySelector('#full-name').value = 'TEST PATIENT'
      document.querySelector('#phone').value = '+0 000 000 0000'
      document.querySelector('#privacy-acknowledged').checked = true
      document.querySelector('[data-journey-next]').click()
    })
    assert.equal(await page.eval('document.querySelector("[data-appointment-template]").dataset.journeyStep'), '2')
    assert.equal(await page.eval('document.querySelector("[data-journey-review] [data-appointment-service-context] strong").textContent'), 'Heart medicine')
    await page.eval(() => document.querySelector('[data-journey-review]').scrollIntoView({ block: 'center' }))
    await page.screenshot({ path: `${output}/review-${width}.png` })
    await page.eval(() => document.querySelector('[data-journey-edit-care]').focus())
    assert.equal(await page.eval('document.activeElement.matches(":focus-visible")'), true)
    await enter(page)
    assert.equal(await page.eval('document.querySelector("[data-appointment-template]").dataset.journeyStep'), '0')
    assert.equal(await page.eval('document.activeElement.matches("[data-journey-title]")'), true)
    assert.equal(await page.eval('document.querySelector("#full-name").value'), 'TEST PATIENT')
    await page.eval(() => { const select = document.querySelector('#doctor-id'); select.value = 'pub_101010101010'; select.dispatchEvent(new Event('change', { bubbles: true })) })
    await waitFor(page, 'document.querySelectorAll("[data-appointment-service-context]").length === 0')
    await page.eval(() => document.querySelector('input[name=care_route][value=not_sure]').click())
    assert.equal(await page.eval('document.querySelector("#doctor-id").disabled'), true)
    assert.equal(await page.eval('[...document.querySelectorAll("[data-journey-value=care]")].every(el => el.textContent === "Help finding the right care")'), true)
    await page.goto(base + '/appointment?doctor=pub_101010101010&service=pub_151515151515')
    assert.equal(await page.eval('document.querySelectorAll("[data-appointment-service-context]").length'), 0)
    await page.goto(base + '/doctors/synthetic-clinician-101010101010/?service=pub_151515151515')
    assert.equal(await page.eval(() => document.querySelectorAll('[aria-label="Your service choice"]').length), 0)
    assert.equal(await page.eval('document.documentElement.scrollWidth > innerWidth'), false)
    assert.equal(await page.eval('document.getAnimations().filter(a => a.playState === "running").length'), 0)
    assert.deepEqual(page.consoleErrors, [])
    await page.close()
    console.log(`PASS ${width}px: service → doctor → review, validation focus, keyboard care editing, retained details, cleared context, unrelated service rejected, reduced motion`)
  }
})
