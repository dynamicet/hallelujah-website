import assert from 'node:assert/strict'
import { runVisualCheck } from './lib/visual-check.mjs'

const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const ready = 'document.querySelector("#full-name") && !document.querySelector("#full-name").matches(":disabled")'
const result = 'document.querySelector("[data-appointment-request]").dataset.appointmentState'
const submit = page => page.eval(() => document.querySelector('#appointment-request-form').requestSubmit())
const waitFor = async (page, expression) => {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await page.eval(expression)) return
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  throw new Error(`Timed out: ${expression}`)
}
const press = async (page, key, windowsVirtualKeyCode) => {
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key, code: key, windowsVirtualKeyCode, ...(key === 'Enter' ? { text: '\r' } : {}) })
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key, code: key, windowsVirtualKeyCode })
}
const fill = page => page.eval(() => {
  document.querySelector('#full-name').value = 'TEST PATIENT'
  document.querySelector('#phone').value = '+0 000 000 0000'
  document.querySelector('#privacy-acknowledged').checked = true
})

await runVisualCheck('appointment-usability', base, async ({ browser, output }) => {
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ width, height: 950, mobile: width < 600, reducedMotion: true })
    // The page stays local across every submission state.
    await page.goto(base + '/appointment')
    await waitFor(page, ready)
    await page.eval(() => {
      window.appointmentDeliveryAttempts = 0
      const fetch = window.fetch
      window.fetch = function (input, options) {
        if (String(options?.method ?? input?.method ?? 'GET').toUpperCase() === 'POST') window.appointmentDeliveryAttempts++
        return fetch.call(this, input, options)
      }
    })
    assert.equal(await page.eval(() => document.querySelector('#privacy-acknowledged').checked), false)
    assert.equal(await page.eval(() => document.querySelector('#appointment-preference-options').hidden), true)
    assert.equal(await page.eval(() => document.querySelector('#appointment-request-form button[type=submit]').textContent.trim()), 'Check sample request')
    assert.match(await page.eval(() => document.querySelector('#privacy-acknowledged').labels[0].textContent), /sample request and reception will not contact me/)
    const phone = '#appointment-call a[href="tel:+251114704242"]'
    assert.ok(await page.eval(`document.querySelector('${phone}').checkVisibility()`))
    assert.equal(await page.eval(() => document.querySelector('[data-call-widget]')), null)
    if (width === 390) {
      const shortcut = 'main header a[href="tel:+251114704242"]'
      await page.eval(`document.querySelector('${shortcut}').focus()`)
      assert.ok(await page.eval(`document.activeElement.matches('${shortcut}')`))

    }

    await submit(page)
    await waitFor(page, 'document.activeElement.id === "appointment-error-summary"')
    assert.equal(await page.eval(() => document.querySelectorAll('#appointment-error-summary li').length), 3)
    await page.eval(() => document.querySelector('#appointment-error-summary a[href="#phone"]').focus())
    await press(page, 'Enter', 13)
    await waitFor(page, 'document.activeElement.id === "phone"')
    await fill(page)
    await submit(page)
    await waitFor(page, `${result} === "receipt" && document.activeElement.id === "appointment-result-title"`)
    assert.match(await page.eval(() => document.querySelector('[data-appointment-request]').innerText), /did not send or save/)
    assert.equal(await page.eval(() => window.appointmentDeliveryAttempts), 0)
    assert.equal(await page.eval(() => [...Object.values(localStorage), ...Object.values(sessionStorage)].some(value => /TEST PATIENT|000 000/.test(value))), false)

    await page.goto(base + '/appointment?doctor=pub_121212121212&demo=known-failure&start=editing')
    await waitFor(page, ready)
    assert.match(await page.eval(() => document.querySelector('[data-appointment-preference]').textContent), /Chala/)
    await fill(page)
    await page.eval(() => document.querySelector('button[aria-controls="appointment-preference-options"]').focus())
    await press(page, 'Enter', 13)
    await waitFor(page, 'document.activeElement.id === "care-preference"').catch(async (error) => {
      const state = await page.eval(() => ({
        active: document.activeElement.outerHTML.slice(0, 240),
        expanded: document.querySelector('button[aria-controls="appointment-preference-options"]').getAttribute('aria-expanded'),
      }))
      throw new Error(`${error.message} (${JSON.stringify(state)})`)
    })
    await page.eval(() => {
      const field = document.querySelector('#care-preference')
      field.value = 'svc_demo_pub_272727272727'
      field.dispatchEvent(new Event('change', { bubbles: true }))
    })
    await waitFor(page, 'document.querySelector("[data-appointment-preference]").textContent.includes("Echocardiography")')
    await page.screenshot({ path: `${output}/preference-${width}.png` })
    await page.eval(() => [...document.querySelectorAll('button')].find(button => button.textContent === 'Remove').click())
    assert.equal(await page.eval(() => document.querySelector('[data-appointment-preference]')), null)
    await waitFor(page, 'document.activeElement.textContent.includes("Add a doctor or service preference")')
    await submit(page)
    await waitFor(page, `${result} === "known-failure"`)
    assert.equal(await page.eval(() => document.querySelector('#full-name').value), 'TEST PATIENT')
    assert.equal(await page.eval(() => document.querySelector('#phone').value), '+0 000 000 0000')
    assert.match(await page.eval(() => document.activeElement.textContent), /couldn’t check the sample request/)
    await page.screenshot({ path: `${output}/failure-${width}.png` })
    await submit(page)
    await waitFor(page, `${result} === "receipt"`)
    assert.equal(await page.eval(() => document.documentElement.scrollWidth <= innerWidth), true)
    assert.equal(await page.eval(() => document.querySelector('main').getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length), 0)
    if (width === 390) {
      await page.send('Emulation.setScriptExecutionDisabled', { value: true })
      await page.goto(base + '/appointment')
      assert.equal(await page.eval(() => document.querySelector('#full-name').matches(':disabled')), true)
      assert.ok(await page.eval(`document.querySelector('${phone}').checkVisibility()`))
      assert.match(await page.eval(() => document.querySelector('[data-appointment-request] noscript').textContent), /call reception/)
    }
    assert.deepEqual(page.consoleErrors, [])
    await page.close()
    console.log(`PASS ${width}px: call shortcut, keyboard focus, general submission, preference change/removal, retry retention, no delivery and reduced motion`)
  }
})
