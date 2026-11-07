import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { Browser, sleep } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs'

const browser = await Browser.launch()
const measurements = []
try {
  for (const width of [1440, 1024, 900, 768, 600, 390, 320]) {
    const page = await browser.newPage({ width, height: 1000, reducedMotion: true })
    await page.goto('http://localhost:3000')
    await page.eval('document.fonts.ready')
    for (let y = 0; y < await page.eval('document.documentElement.scrollHeight'); y += 650) {
      await page.eval(y => scrollTo({ top: y, behavior: 'instant' }), y)
      await sleep(50)
    }
    await page.eval("document.querySelector('.team-guide').scrollIntoView({behavior:'instant',block:'start'})")
    await sleep(400)
    const result = await page.eval(() => {
      const section = document.querySelector('.team-guide')
      const box = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y + scrollY, width: r.width, height: r.height } }
      return {
        width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth,
        section: box(section), columns: getComputedStyle(section.querySelector('.team-list')).gridTemplateColumns,
        doctors: [...section.querySelectorAll('.team-person')].map(link => ({
          name: link.querySelector('h3').textContent, nameSize: getComputedStyle(link.querySelector('h3')).fontSize,
          portrait: box(link.querySelector('img')), loaded: link.querySelector('img').naturalWidth > 0,
          href: link.href, ...box(link),
        })),
        disclosure: section.textContent.includes('AI-generated portraits'),
      }
    })
    assert.equal(result.overflow, false, `Overflow at ${width}`)
    assert.equal(result.doctors.length, 6)
    assert.ok(result.disclosure)
    assert.ok(result.doctors.every(d => d.loaded && parseFloat(d.nameSize) >= 28))
    await page.screenshot({path:`artifacts/doctors-gallery/doctors-${width}.jpg`,quality:85})
    if (width === 1440 || width === 768 || width === 390) {
      await page.send('Page.captureScreenshot', {format:'jpeg',quality:85,captureBeyondViewport:true,clip:{...result.section,x:0,width,scale:1}}).then(async ({data}) => {
        await writeFile(`artifacts/doctors-gallery/section-${width}.jpg`, Buffer.from(data,'base64'))
      })
    }
    await page.eval("document.querySelector('.team-person').focus()")
    const focus = await page.eval(() => ({ visible:document.activeElement.matches(':focus-visible'), color:getComputedStyle(document.activeElement).outlineColor, style:getComputedStyle(document.activeElement).outlineStyle }))
    assert.ok(focus.visible && focus.style !== 'none')
    if(width === 1440) {
      await page.screenshot({path:'artifacts/doctors-gallery/keyboard-focus.jpg',quality:85})
      for (const doctor of result.doctors) assert.equal((await fetch(doctor.href)).status,200)
      assert.equal((await fetch('http://localhost:3000/doctors')).status,200)
    }
    measurements.push({...result,focus})
    await page.close()
    console.log(`Passed portraits, names, layout and keyboard focus at ${width}px`)
  }
  const page = await browser.newPage({width:390,height:844})
  await page.send('Emulation.setScriptExecutionDisabled',{value:true})
  await page.goto('http://localhost:3000')
  assert.equal(await page.eval("document.querySelectorAll('.team-person').length"),6)
  assert.equal(await page.eval("getComputedStyle(document.querySelector('.team-person')).opacity"),'1')
  await page.close()
  console.log('All seven destinations return 200; all six profiles remain visible without JavaScript.')
  await writeFile('artifacts/doctors-gallery/measurements.json', JSON.stringify(measurements,null,2)+'\n')
} finally { await browser.close() }
