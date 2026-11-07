import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { Browser, sleep } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs'

const output = 'artifacts/doctors-compact'
const browser = await Browser.launch()
const measurements = []
try {
  for (const width of [1440, 1280, 1200, 1024, 900, 768, 700, 600, 390, 320]) {
    const page = await browser.newPage({ width, height: 1000, reducedMotion: true })
    await page.goto('http://localhost:3000')
    await page.eval('document.fonts.ready')
    await page.eval("document.querySelector('.team-guide').scrollIntoView({behavior:'instant',block:'start'})")
    await sleep(500)
    const result = await page.eval(() => {
      const section = document.querySelector('.team-guide')
      const box = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y + scrollY, width: r.width, height: r.height } }
      return {
        width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth,
        section: box(section), background: getComputedStyle(section).backgroundColor,
        columns: getComputedStyle(section.querySelector('.team-list')).gridTemplateColumns,
        doctors: [...section.querySelectorAll('.team-person')].map(link => ({
          name: link.querySelector('h3').textContent, nameSize: getComputedStyle(link.querySelector('h3')).fontSize,
          portrait: box(link.querySelector('img')), text: box(link.querySelector('.team-person-details')),
          loaded: link.querySelector('img').naturalWidth > 0,
          description: link.querySelector('.team-description').textContent,
          language: link.querySelector('.team-language').textContent,
          href: link.href, ...box(link),
        })),
        disclosure: section.textContent.includes('AI-generated portraits'),
      }
    })
    assert.equal(result.overflow, false, `Overflow at ${width}`)
    assert.equal(result.doctors.length, 6)
    assert.ok(result.disclosure)
    assert.equal(result.columns.split(' ').length, width >= 1200 ? 3 : width >= 700 ? 2 : 1)
    for (const doctor of result.doctors) {
      assert.ok(doctor.loaded, `${doctor.name} portrait loaded at ${width}`)
      assert.ok(parseFloat(doctor.nameSize) >= 28)
      assert.ok(doctor.description && doctor.language)
      assert.ok(doctor.portrait.x + doctor.portrait.width <= doctor.text.x, `${doctor.name} portrait and text do not overlap`)
      assert.ok(doctor.text.x + doctor.text.width <= width, `${doctor.name} text stays in the viewport`)
    }
    if (width === 1440) assert.ok(result.section.height <= 800, `Desktop section is ${result.section.height}px`)
    const { data } = await page.send('Page.captureScreenshot', { format: 'jpeg', quality: 85, captureBeyondViewport: true, clip: { ...result.section, x: 0, width, scale: 1 } })
    await writeFile(`${output}/section-${width}.jpg`, Buffer.from(data, 'base64'))
    await page.eval("document.querySelector('.team-directory').focus()")
    await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
    await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
    const focus = await page.eval(() => ({ doctor: document.activeElement.matches('.team-person'), visible: document.activeElement.matches(':focus-visible'), style: getComputedStyle(document.activeElement).outlineStyle }))
    assert.ok(focus.doctor && focus.visible && focus.style !== 'none')
    if (width === 1440) {
      await page.screenshot({ path: `${output}/keyboard-focus.jpg`, quality: 85 })
      for (const doctor of result.doctors) assert.equal((await fetch(doctor.href)).status, 200)
      assert.equal((await fetch('http://localhost:3000/doctors')).status, 200)
    }
    measurements.push({ ...result, focus })
    await page.close()
    console.log(`${width}px: ${Math.round(result.section.height)}px tall, ${result.columns.split(' ').length} columns; portraits, descriptions, keyboard focus and overflow passed.`)
  }
  const noScript = await browser.newPage({ width: 390, height: 844 })
  await noScript.send('Emulation.setScriptExecutionDisabled', { value: true })
  await noScript.goto('http://localhost:3000')
  assert.equal(await noScript.eval("document.querySelectorAll('.team-person').length"), 6)
  assert.equal(await noScript.eval("getComputedStyle(document.querySelector('.team-person')).opacity"), '1')
  await noScript.close()
  await writeFile(`${output}/measurements.json`, JSON.stringify(measurements, null, 2) + '\n')
  console.log('Six profiles remain visible without JavaScript; all seven destinations return HTTP 200.')
} finally {
  await browser.close()
}
