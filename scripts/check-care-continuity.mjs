import assert from 'node:assert/strict'
import { runVisualCheck } from './lib/visual-check.mjs'

const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const service = '/services/synthetic-service-151515151515/'
const doctorId = 'pub_121212121212'
const echoId = 'pub_272727272727'
const doctorPath = '/doctors/synthetic-clinician-121212121212/'
const select = (page, id, value) => page.eval(`(() => {
  const control = document.getElementById(${JSON.stringify(id)})
  control.value = ${JSON.stringify(value)}
  control.dispatchEvent(new Event('change', { bubbles: true }))
})()`)
const selected = page => page.eval('({ doctor: document.querySelector("#doctor-id").value, service: document.querySelector("#service-id").value })')
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
    await page.goto(base + '/doctors')
    assert.equal(await page.eval('document.querySelectorAll("input[name=type]").length'), 3)
    assert.equal(await page.eval(() => [...document.querySelectorAll('input[name=type]')].some(input => input.closest('label').textContent.includes('Echocardiography'))), false)
    await page.eval(() => {
      const input = document.querySelector('input[name=type][value=synthetic-heart]')
      input.checked = true
      input.closest('form').requestSubmit()
    })
    await waitFor(page, 'location.search.includes("type=synthetic-heart") && document.querySelectorAll("[data-clinician-public-id]").length === 3')
    assert.equal(await page.eval(() => [...document.querySelectorAll('[data-clinician-public-id]')].every(card => card.querySelector('[aria-label="Specialties"]').textContent.includes('Cardiology'))), true)
    await page.goto(base + service)
    const profile = await page.eval(() => document.querySelector('#care-team a').getAttribute('href'))
    assert.equal(new URL(profile, base).searchParams.get('service'), 'pub_151515151515')
    await page.goto(base + profile)
    assert.equal(await page.eval(() => document.querySelector('[aria-label="Your service choice"] strong').textContent), 'Cardiology')
    const appointment = await page.eval(() => document.querySelector('a[aria-label^="Request an appointment with"]').getAttribute('href'))
    await page.goto(base + appointment)
    await waitFor(page, '!document.querySelector("[data-appointment-safe-form]").hasAttribute("inert")')
    assert.equal(await page.eval('document.querySelector("input[name=care_route]:checked").value'), 'doctor')
    assert.equal(await page.eval('document.querySelector("#doctor-id").value'), 'pub_121212121212')
    assert.deepEqual(await selected(page), { doctor: doctorId, service: 'pub_151515151515' })
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
    assert.match(await page.eval('document.querySelector("[data-journey-review] [data-journey-value=care]").textContent'), /Cardiology/)
    await page.eval(() => document.querySelector('[data-journey-review]').scrollIntoView({ block: 'center' }))
    await page.screenshot({ path: `${output}/review-${width}.png` })
    await page.eval(() => document.querySelector('[data-journey-edit-care]').focus())
    assert.equal(await page.eval('document.activeElement.matches(":focus-visible")'), true)
    await enter(page)
    assert.equal(await page.eval('document.querySelector("[data-appointment-template]").dataset.journeyStep'), '0')
    assert.equal(await page.eval('document.activeElement.id'), 'doctor-id')
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
    assert.match(await page.eval('document.querySelector("main").innerText'), /not listed|not available|unavailable/i)

    // Doctor → specifically provided service → request retains both choices.
    await page.goto(base + doctorPath)
    const echo = await page.eval(`document.querySelector('a[href*="synthetic-service-272727272727"]').getAttribute('href')`)
    assert.equal(new URL(echo, base).searchParams.get('doctor'), doctorId)
    await page.goto(base + echo)
    assert.match(await page.eval(() => document.querySelector('[aria-label="Doctor preference"]').textContent), /Chala/)
    const jointRequest = await page.eval(() => [...document.querySelectorAll('a')].find(link => link.getAttribute('href')?.startsWith('/appointment?')).getAttribute('href'))
    assert.equal(new URL(jointRequest, base).searchParams.get('service'), echoId)
    assert.equal(new URL(jointRequest, base).searchParams.get('doctor'), doctorId)
    await page.goto(base + jointRequest)
    await waitFor(page, '!document.querySelector("[data-appointment-safe-form]").hasAttribute("inert")')
    assert.deepEqual(await selected(page), { doctor: doctorId, service: echoId })
    assert.equal(await page.eval('document.querySelector("#service-id").disabled'), false)
    assert.equal(await page.eval('document.querySelector("[data-care-editor]").hidden'), true)
    assert.equal(await page.eval('document.querySelector("[data-care-summary]").hidden'), false)
    assert.equal(await page.eval('document.querySelectorAll("[data-appointment-doctor-identity]").length'), 0)
    assert.equal(await page.eval('document.querySelector("[data-care-edit-toggle]").getAttribute("aria-expanded")'), 'false')
    await page.eval(() => document.querySelector('[data-care-edit-toggle]').focus())
    await enter(page)
    assert.equal(await page.eval('document.querySelector("[data-care-editor]").hidden'), false)
    assert.equal(await page.eval('document.activeElement.id'), 'doctor-id')
    assert.equal(await page.eval('document.querySelector("[data-care-edit-toggle]").getAttribute("aria-expanded")'), 'true')
    await page.eval(() => document.querySelector('[data-care-edit-toggle]').click())
    assert.equal(await page.eval('document.querySelector("[data-care-editor]").hidden'), true)
    assert.equal(await page.eval('document.activeElement.matches("[data-care-edit-toggle]")'), true)
    assert.deepEqual(await selected(page), { doctor: doctorId, service: echoId })
    await page.screenshot({ path: `${output}/selected-care-${width}.png` })
    await waitFor(page, `(() => {
      const trigger = document.querySelector('[data-help-widget] button')
      if (!trigger || getComputedStyle(trigger).visibility === 'hidden') return true
      const bounds = trigger.getBoundingClientRect()
      return [...document.querySelectorAll('#appointment-request-form input, #appointment-request-form select, #appointment-request-form button, #appointment-request-form a[href]')].every(control => {
        const rect = control.getBoundingClientRect()
        return !control.getClientRects().length || rect.right <= bounds.left || rect.left >= bounds.right || rect.bottom <= bounds.top || rect.top >= bounds.bottom
      })
    })()`)

    // Exploring care again from appointment keeps the selected doctor preference.
    const backCare = await page.eval(() => document.querySelector('[data-appointment-service-context] a').getAttribute('href'))
    assert.equal(new URL(backCare, base).searchParams.get('doctor'), doctorId)
    assert.equal(new URL(backCare, base).hash, '#care-team')
    await page.goto(base + backCare)
    assert.match(await page.eval(() => document.querySelector('[aria-label="Doctor preference"]').textContent), /Chala/)
    const returnRequest = await page.eval(() => [...document.querySelectorAll('a')].find(link => link.getAttribute('href')?.startsWith('/appointment?')).getAttribute('href'))
    assert.equal(new URL(returnRequest, base).searchParams.get('doctor'), doctorId)
    assert.equal(new URL(returnRequest, base).searchParams.get('service'), echoId)
    await page.goto(base + returnRequest)
    await waitFor(page, '!document.querySelector("[data-appointment-safe-form]").hasAttribute("inert")')

    await page.eval(() => document.querySelector('[data-care-edit-toggle]').click())

    // Changing the primary selection clears only the incompatible dependent choice.
    await select(page, 'doctor-id', 'pub_151515151515')
    assert.deepEqual(await selected(page), { doctor: 'pub_151515151515', service: '' })
    assert.match(await page.eval('document.querySelector("[data-selection-notice]").textContent'), /previous care choice/)
    await select(page, 'doctor-id', doctorId)
    await select(page, 'service-id', echoId)
    assert.equal(await page.eval('document.querySelector("[data-selection-notice]").hidden'), true)
    await page.eval(() => document.querySelector('input[name=care_route][value=service]').click())
    assert.equal(await page.eval('document.querySelector("[data-care-selectors]").firstElementChild.dataset.careSelector'), 'service')
    await page.eval(() => document.querySelector('#service-id').focus())
    await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
    await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
    assert.equal(await page.eval('document.activeElement.id'), 'doctor-id')
    await page.screenshot({ path: `${output}/care-editor-${width}.png` })
    await select(page, 'service-id', 'pub_171717171717')
    assert.deepEqual(await selected(page), { doctor: '', service: 'pub_171717171717' })
    assert.match(await page.eval('document.querySelector("[data-selection-notice]").textContent'), /previous doctor/)
    assert.equal(await page.eval('[...document.querySelector("#doctor-id").options].filter(option => option.value && !option.disabled).length'), 0)

    // Team-delivered care has no inferred doctor; contact/referral choices are excluded.
    await page.goto(base + '/services/synthetic-service-171717171717/')
    assert.equal(await page.eval(() => document.querySelectorAll('#care-team a[href*="/doctors/"]').length), 0)
    for (const query of ['doctor=missing', 'service=pub_111111111111', 'service=pub_181818181818']) {
      await page.goto(base + '/appointment?' + query)
      await waitFor(page, '!document.querySelector("[data-appointment-safe-form]").hasAttribute("inert")')
      assert.match(await page.eval('document.querySelector("[data-selection-notice]").textContent'), /unavailable/)
      assert.deepEqual(await selected(page), { doctor: '', service: '' })
      // Initial URL recovery guidance survives unrelated contact edits.
      await page.eval(() => document.querySelector('#full-name').dispatchEvent(new Event('change', { bubbles: true })))
      assert.equal(await page.eval('document.querySelector("[data-selection-notice]").hidden'), false)
      await page.eval(() => document.querySelector('input[name=care_route][value=doctor]').click())
      assert.equal(await page.eval('document.querySelector("[data-selection-notice]").hidden'), true)
      assert.equal(await page.eval('document.querySelector("#doctor-id").options[0].textContent'), 'Choose a doctor')
      assert.equal(await page.eval('document.querySelector("#service-id").options[0].textContent'), 'No specialty or service preference')
      await page.eval(() => document.querySelector('input[name=care_route][value=service]').click())
      assert.equal(await page.eval('document.querySelector("#doctor-id").options[0].textContent'), 'No doctor preference')
      assert.equal(await page.eval('document.querySelector("#service-id").options[0].textContent'), 'Choose a specialty or service')
    }

    // A required-field error must reopen the collapsed editor before recovery.
    await page.goto(base + `/appointment?doctor=${doctorId}`)
    await waitFor(page, '!document.querySelector("[data-appointment-safe-form]").hasAttribute("inert")')
    await page.eval(() => {
      document.querySelector('#doctor-id').value = ''
      document.querySelector('[data-journey-next]').click()
    })
    assert.equal(await page.eval('document.querySelector("[data-care-editor]").hidden'), false)
    assert.equal(await page.eval('document.activeElement.id'), 'appointment-error-summary-heading')
    await page.eval(() => document.querySelector('#appointment-error-summary a[href="#doctor-id"]').click())
    assert.equal(await page.eval('document.activeElement.id'), 'doctor-id')

    // Prepare all normal selection shapes; observe delivery/storage boundaries.
    for (const query of ['', `doctor=${doctorId}`, `service=${echoId}`, `doctor=${doctorId}&service=${echoId}`]) {
      await page.goto(base + '/appointment' + (query ? '?' + query : ''))
      await waitFor(page, '!document.querySelector("[data-appointment-safe-form]").hasAttribute("inert")')
      if (query === `service=${echoId}`) {
        await waitFor(page, 'Boolean(document.querySelector("[data-appointment-service-context] a"))')
        const careBack = await page.eval(() => document.querySelector('[data-appointment-service-context] a').getAttribute('href'))
        assert.equal(new URL(careBack, base).searchParams.has('doctor'), false)
        assert.equal(await page.eval('document.querySelector("[data-care-editor]").hidden'), true)
      }
      await page.eval(() => {
        window.__careDeliveryAttempts = 0
        const originalFetch = window.fetch
        window.fetch = (...args) => {
          const method = args[1]?.method ?? (args[0] instanceof Request ? args[0].method : 'GET')
          if (!['GET', 'HEAD'].includes(method.toUpperCase())) window.__careDeliveryAttempts++
          return originalFetch(...args)
        }
        const send = XMLHttpRequest.prototype.send
        XMLHttpRequest.prototype.send = function (...args) { window.__careDeliveryAttempts++; return send.apply(this, args) }
        if (navigator.sendBeacon) navigator.sendBeacon = () => { window.__careDeliveryAttempts++; return false }
        document.querySelector('[data-journey-next]').click()
        document.querySelector('#full-name').value = 'TEST PATIENT'
        document.querySelector('#phone').value = '+251911111111'
        document.querySelector('#privacy-acknowledged').checked = true
        document.querySelector('[data-journey-next]').click()
      })
      assert.equal(await page.eval('document.querySelector("[data-appointment-template]").dataset.journeyStep'), '2')
      await page.eval(() => document.querySelector('[data-form-submit]').click())
      await waitFor(page, 'document.querySelector("[data-appointment-template]").dataset.appointmentState === "prepared"')
      assert.equal(await page.eval('document.activeElement.id'), 'appointment-prepared-heading')
      assert.match(await page.eval('document.querySelector("#appointment-prepared").textContent'), /No request has been sent/)
      assert.equal(await page.eval('window.__careDeliveryAttempts'), 0)
      assert.equal(await page.eval('[...Object.values(localStorage), ...Object.values(sessionStorage)].some(value => /TEST PATIENT|251911111111/.test(value))'), false)
    }
    await page.eval(() => document.querySelector('#appointment-prepared').scrollIntoView({ block: 'center' }))
    await page.screenshot({ path: `${output}/prepared-${width}.png` })
    assert.equal(await page.eval('document.documentElement.scrollWidth > innerWidth'), false)
    assert.equal(await page.eval('document.getAnimations().filter(a => a.playState === "running").length'), 0)
    assert.deepEqual(page.consoleErrors, [])
    await page.close()
    console.log(`PASS ${width}px: bidirectional care handoff, joint selections, keyboard recovery, compatible editing, team care, invalid context, four local payload paths without delivery/storage, reduced motion`)
  }
})
