import assert from 'node:assert/strict'
import { runVisualCheck } from './lib/visual-check.mjs'

const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const service = '/services/synthetic-service-151515151515/'
const doctorId = 'pub_121212121212'
const echoId = 'pub_272727272727'
const doctorPath = '/doctors/synthetic-clinician-121212121212/'
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
    for (const [path, selector, fallback, from, backLabel, viewLabel] of [
      [service, 'main a[href^="/services"]', '/services', '/services', 'Back to service results', 'View all services'],
      [doctorPath, '[aria-label="Breadcrumb"] a[href^="/doctors"]', '/doctors', '/doctors?q=Chala', 'Doctor results', 'Doctors'],
    ]) {
      for (const source of ['', from, 'https://example.com' + fallback]) {
        await page.goto(base + path + (source ? '?from=' + encodeURIComponent(source) : ''))
        const expected = source === from ? [path === doctorPath ? `${from}#doctor-${doctorId}` : from, backLabel] : [fallback, viewLabel]
        assert.ok(await page.eval(`[...document.querySelectorAll(${JSON.stringify(selector)})].some(link =>
          link.getAttribute('href') === ${JSON.stringify(expected[0])} &&
          link.textContent.replace('←', '').trim() === ${JSON.stringify(expected[1])})`), `${path} from ${source || 'direct'}`)
      }
    }
    await page.goto(base + service + "?from=%2Fservices%3Fq%3DCardiology")
    await page.eval(() => document.querySelector('main a[href="#care-team"]').focus())
    await enter(page)
    await waitFor(page, 'location.hash === "#care-team" && document.activeElement.id === "care-team"')
    // Generic article-list styles must not change the care-team card spacing.
    const teamSpacing = await page.eval(() => [...document.querySelectorAll('#care-team ul > li')].map(item => {
      const style = getComputedStyle(item)
      return { margin: style.margin, padding: style.padding }
    }))
    assert.ok(teamSpacing.length > 0)
    assert.ok(teamSpacing.every(item => item.margin === '0px' && item.padding === '0px'))
    const profile = await page.eval(() => document.querySelector('#care-team a').getAttribute('href'))
    assert.equal(new URL(profile, base).searchParams.get('service'), 'pub_151515151515')
    await page.goto(base + profile)
    const profileReturn = await page.eval(() => document.querySelector('[aria-label="Breadcrumb"] a[href$="#care-team"]').getAttribute('href'))
    assert.equal(new URL(profileReturn, base).searchParams.get('from'), '/services?q=Cardiology')
    assert.equal(new URL(profileReturn, base).searchParams.get('doctor'), doctorId)
    const appointment = await page.eval(() => document.querySelector('[data-profile-primary-action]').getAttribute('href'))
    await page.goto(base + appointment)
    assert.match(await page.eval(() => document.querySelector('[data-appointment-preference]').textContent), /Chala.*Cardiology/s)
    const appointmentReturn = await page.eval(() => document.querySelector('main a[href^="/services/synthetic-service-"]').getAttribute('href'))
    assert.equal(new URL(appointmentReturn, base).searchParams.get('from'), '/services?q=Cardiology')
    assert.equal(new URL(appointmentReturn, base).searchParams.get('doctor'), doctorId)
    await page.goto(base + appointmentReturn)
    assert.equal(await page.eval(() => document.querySelector('main a[href^="/services?q="]').getAttribute('href')), '/services?q=Cardiology')

    await page.goto(base + '/appointment?doctor=pub_101010101010&service=pub_151515151515')
    assert.match(await page.eval(() => document.querySelector('[data-appointment-preference]').textContent), /Aster/)
    assert.equal(await page.eval(() => document.querySelector('[data-appointment-preference]').textContent.includes('Cardiology')), false)
    await page.goto(base + '/doctors/synthetic-clinician-101010101010/?service=pub_151515151515')
    assert.equal(await page.eval(() => document.querySelectorAll('[aria-label="Breadcrumb"] a[href$="#care-team"]').length), 0)
    assert.match(await page.eval(() => document.querySelector('main').innerText), /not listed|not available|unavailable/i)

    // Doctor → directly provided service → appointment preserves the care context.
    await page.goto(base + doctorPath)
    const echoPath = await page.eval(() => [...document.querySelectorAll('a')].find(a => a.href.includes('synthetic-service-272727272727'))?.getAttribute('href'))
    assert.equal(new URL(echoPath, base).searchParams.get('doctor'), doctorId)
    await page.goto(base + echoPath)
    assert.match(await page.eval(() => document.querySelector('[aria-label="Doctor preference"]').textContent), /Chala/)
    const jointRequest = await page.eval(() => document.querySelector('main a[href^="/appointment?"]').getAttribute('href'))
    assert.equal(new URL(jointRequest, base).searchParams.get('service'), echoId)
    assert.equal(new URL(jointRequest, base).searchParams.get('doctor'), doctorId)
    await page.goto(base + jointRequest)
    assert.match(await page.eval(() => document.querySelector('[data-appointment-preference]').textContent), /Chala.*Echocardiography/s)
    await page.screenshot({ path: `${output}/selected-care-${width}.png` })

    // Team-delivered care has no inferred doctor; contact and referral choices are excluded.
    await page.goto(base + '/services/synthetic-service-171717171717/')
    assert.equal(await page.eval(() => document.querySelectorAll('#care-team a[href*="/doctors/"]').length), 0)
    for (const query of ['doctor=missing', 'service=pub_111111111111', 'service=pub_181818181818']) {
      await page.goto(base + '/appointment?' + query)
      assert.equal(await page.eval(() => document.querySelector('[data-appointment-preference]')), null)
      assert.match(await page.eval(() => document.querySelector('#appointment-request-form').textContent), /preference is unavailable/)
    }

    for (const query of ['', `doctor=${doctorId}`, `service=${echoId}`, `doctor=${doctorId}&service=${echoId}`]) {
      await page.goto(base + '/appointment' + (query ? '?' + query : ''))
      await waitFor(page, 'document.querySelector("#full-name") && !document.querySelector("#full-name").matches(":disabled")')
      await page.eval(() => {
        document.querySelector('#full-name').value = 'TEST PATIENT'
        document.querySelector('#phone').value = '+0 000 000 0000'
        document.querySelector('#privacy-acknowledged').checked = true
        document.querySelector('#appointment-request-form').requestSubmit()
      })
      await waitFor(page, 'document.querySelector("[data-appointment-request]").dataset.appointmentState === "receipt"')
      assert.equal(await page.eval(() => document.activeElement.id), 'appointment-result-title')
      assert.match(await page.eval(() => document.querySelector('[data-appointment-request]').textContent), /did not send or save/)
      assert.equal(await page.eval(() => [...Object.values(localStorage), ...Object.values(sessionStorage)].some(value => /TEST PATIENT/.test(value))), false)
    }
    assert.equal(await page.eval(() => document.documentElement.scrollWidth > innerWidth), false)
    assert.equal(await page.eval(() => document.querySelector('main').getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length), 0)
    assert.deepEqual(page.consoleErrors, [])
    await page.close()
    console.log(`PASS ${width}px: care handoffs, contextual returns, team care, invalid context, local submissions and reduced motion`)
  }
})
