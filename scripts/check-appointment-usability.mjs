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
    assert.equal(await page.eval(() => document.querySelector('#appointment-preference-options').hidden), false)
    assert.equal(await page.eval(() => document.querySelector('#appointment-request-form button[type=submit]').textContent.trim()), 'Send appointment request')
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
    assert.equal(await page.eval(() => document.querySelectorAll('#appointment-error-summary li').length), 2)
    await page.eval(() => document.querySelector('#appointment-error-summary a[href="#phone"]').focus())
    await press(page, 'Enter', 13)
    await waitFor(page, 'document.activeElement.id === "phone"')
    await fill(page)
    await page.eval(() => {
      const form = document.querySelector('#appointment-request-form')
      form.requestSubmit()
      form.requestSubmit()
    })
    await waitFor(page, `${result} === "receipt" && document.activeElement.id === "appointment-result-title"`)
    assert.match(await page.eval(() => document.querySelector('[data-appointment-request]').innerText), /Our team will call you to arrange a time/)
    assert.equal(await page.eval(() => document.querySelector('#appointment-result-title').textContent), 'Appointment request submitted')
    const reference = () => page.eval(() => document.querySelector('[data-appointment-request] strong').textContent)
    const firstReference = await reference()
    assert.match(firstReference, /^HH-[0-9A-F]{8}-[0-9A-F]{8}$/u)
    await page.screenshot({ path: `${output}/receipt-${width}.png` })
    assert.equal(await page.eval(() => window.appointmentDeliveryAttempts), 0)
    assert.equal(await page.eval(() => [...Object.values(localStorage), ...Object.values(sessionStorage)].some(value => /TEST PATIENT|000 000/.test(value))), false)

    await page.goto(base + '/appointment?doctor=pub_121212121212&demo=known-failure&start=editing')
    await waitFor(page, ready)
    assert.match(await page.eval(() => document.querySelector('#care-preference').value), /Chala/)
    await fill(page)
    await page.eval(() => document.querySelector('#care-preference').focus())
    await press(page, 'Enter', 13)
    await page.send('Input.insertText', { text: 'echo' })
    await waitFor(page, 'document.querySelectorAll("#care-options [role=option]").length === 1')
    await press(page, 'ArrowDown', 40)
    await press(page, 'Enter', 13)
    await waitFor(page, 'document.querySelector("#care-preference").value.includes("Echocardiography")')
    await press(page, 'Enter', 13)
    await page.screenshot({ path: `${output}/preference-${width}.png` })
    await press(page, 'ArrowDown', 40)
    await press(page, 'Enter', 13)
    await waitFor(page, 'document.querySelector("#care-preference").value === ""')
    await submit(page)
    await waitFor(page, `${result} === "known-failure"`)
    assert.equal(await page.eval(() => document.querySelector('#full-name').value), 'TEST PATIENT')
    assert.equal(await page.eval(() => document.querySelector('#phone').value), '+0 000 000 0000')
    assert.match(await page.eval(() => document.activeElement.textContent), /couldn’t send your request/)
    await page.screenshot({ path: `${output}/failure-${width}.png` })
    await submit(page)
    await waitFor(page, `${result} === "receipt"`)
    assert.notEqual(await reference(), firstReference)
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
