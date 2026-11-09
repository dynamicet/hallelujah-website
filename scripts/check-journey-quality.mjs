import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { runVisualCheck } from './lib/visual-check.mjs'

const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const pause = (page, ms = 900) => page.eval(`new Promise(r => setTimeout(r, ${ms}))`)
const enter = async (page, selector) => {
  await page.eval(`(() => { const target=document.querySelector(${JSON.stringify(selector)}); target.scrollIntoView({block:'center',behavior:'instant'}); target.focus({preventScroll:true}) })()`)
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' })
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
}
const landing = async (page, selector, expectedGap = 40) => {
  let gap
  for (let attempt = 0; attempt < 60; attempt++) {
    await pause(page, 100)
    gap = await page.eval(`document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect().top - document.querySelector('[data-site-header]').getBoundingClientRect().bottom`)
    if (Math.abs(gap - expectedGap) < 3) break
  }
  await pause(page, 300)
  gap = await page.eval(`document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect().top - document.querySelector('[data-site-header]').getBoundingClientRect().bottom`)
  assert.ok(Math.abs(gap - expectedGap) < 3, `${selector}: expected ${expectedGap}px reading gap, received ${gap}`)
  return gap
}

await runVisualCheck('journey-quality', base, async ({ browser, output }) => {
  const results = []
  for (const [width, height] of [[320, 800], [390, 844], [768, 1000], [1440, 900], [1024, 400]]) {
    const page = await browser.newPage({ width, height, mobile: width < 600 })
    await page.send('Page.addScriptToEvaluateOnNewDocument', { source: `
      window.journeyTelemetry = { shifts: [], tasks: [] };
      for (const [type, key] of [['layout-shift','shifts'],['longtask','tasks']]) {
        if (PerformanceObserver.supportedEntryTypes.includes(type)) new PerformanceObserver(list => {
          window.journeyTelemetry[key].push(...list.getEntries().map(e => ({start:e.startTime,duration:e.duration,value:e.value,recentInput:e.hadRecentInput,sources:e.sources?.map(s=>({node:s.node?.outerHTML?.slice(0,180),before:s.previousRect,after:s.currentRect}))})));
        }).observe({type, buffered:true});
      }
    ` })
    await page.goto(base)
    await pause(page)
    const initialResources = await page.eval(() => {
      const resources = performance.getEntriesByType('resource')
      return Object.fromEntries(['script', 'img', 'video', 'css'].map(type => {
        const matches = resources.filter(r => type === 'video' ? /\.(webm|mp4)(\?|$)/u.test(r.name) : r.initiatorType === type)
        return [type, { requests: matches.length, encodedBytes: matches.reduce((sum, r) => sum + r.encodedBodySize, 0) }]
      }))
    })
    assert.equal(initialResources.video.requests, 0, 'exploration never starts video downloads')
    // Decode before profiling: this sample isolates a warmed scroll journey.
    await page.eval(`Promise.all([...document.images].map(i => { i.loading='eager'; return i.decode().catch(()=>{}) }))`)
    await pause(page)
    const throttled = [390, 1440].includes(width)
    if (throttled) await page.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    const profile = await page.eval(`new Promise(resolve => {
      const frames=[], start=performance.now(), end=document.documentElement.scrollHeight-innerHeight;
      window.journeyTelemetry.shifts=[]; window.journeyTelemetry.tasks=[];
      let previous=start;
      function step(now) {
        frames.push(now-previous); previous=now;
        const progress=Math.min(1,(now-start)/9000);
        scrollTo({top:end*progress,behavior:'instant'});
        if(progress<1) requestAnimationFrame(step);
        else setTimeout(()=>resolve({frames, ...window.journeyTelemetry}), 100);
      }
      requestAnimationFrame(step);
    })`)
    if (throttled) await page.send('Emulation.setCPUThrottlingRate', { rate: 1 })
    const sorted = profile.frames.slice(1).sort((a, b) => a - b)
    const scroll = { cpuRate: throttled ? 4 : 1, durationMs: 9000, frames: sorted.length,
      frameP95Ms: sorted[Math.floor(sorted.length * .95)], framesOver50ms: sorted.filter(ms => ms > 50).length,
      layoutShiftSum: profile.shifts.reduce((sum, shift) => sum + shift.value, 0), shifts: profile.shifts, longTasks: profile.tasks }
    await writeFile(`${output}/profile-${width}.json`, JSON.stringify({ initialResources, scroll }, null, 2) + '\n')
    assert.equal(scroll.layoutShiftSum, 0, 'scroll motion must not shift document layout')
    await pause(page)
    const gaps = {}
    await page.eval("document.querySelector('#patient-testimonials').scrollIntoView({block:'start',behavior:'instant'}); document.querySelector('#patient-testimonials').focus({preventScroll:true})")
    gaps.stories = await landing(page, '#patient-testimonials')
    assert.equal(await page.eval('document.activeElement.id'), 'patient-testimonials')
    await page.screenshot({ path: `${output}/stories-${width}.png` })
    await enter(page, '.everyday-film > summary')
    gaps.film = await page.eval("document.querySelector('.story-cinema[open] .story-cinema-close').getBoundingClientRect().top")
    assert.ok(gaps.film >= 0 && gaps.film < height, 'modal Close remains visible')
    assert.equal(await page.eval('document.activeElement === document.querySelector(".story-cinema[open] .story-cinema-close")'), true)
    await enter(page, '.story-cinema[open] .everyday-transcript > summary')
    gaps.transcript = await page.eval("document.querySelector('.story-cinema[open] .everyday-transcript > summary').getBoundingClientRect().top")
    assert.ok(gaps.transcript >= 0 && gaps.transcript < height, 'transcript focus remains visible')
    await page.screenshot({ path: `${output}/transcript-${width}.png` })
    await page.eval("document.querySelector('.story-cinema[open]').close()")
    await page.goto(base + '/health-topics')
    await page.eval(`document.querySelector('[data-health-library] [aria-controls=health-topic-matches]').click()`)
    await pause(page, 100)
    await enter(page, '[data-health-topic]')
    gaps.reader = await landing(page, '#health-topic-reader')
    await page.screenshot({ path: `${output}/reader-${width}.png` })
    await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
    await page.goto(base + '/about#medical-technology')
    gaps.equipment = await page.eval("document.querySelector('#medical-technology').getBoundingClientRect().top")
    await enter(page, '#medical-technology summary')
    assert.equal(await page.eval("document.querySelector('#medical-technology details').open"), true)
    assert.equal(await page.eval('document.getAnimations().length'), 0)
    await page.screenshot({ path: `${output}/equipment-${width}.png` })
    assert.equal(await page.eval('document.documentElement.scrollWidth > innerWidth'), false)
    await page.goto(base + '/news-resources/make-room-for-your-questions?from=%2F')
    await enter(page, '.article-reading-guide a:nth-child(2)')
    gaps.article = await landing(page, '#reading-2')
    await page.screenshot({ path: `${output}/article-${width}.png` })
    if (height < 600) assert.equal(await page.eval('getComputedStyle(document.querySelector("[class*=readingAside]")).position'), 'static')
    assert.deepEqual(page.consoleErrors, [])
    results.push({ width, height, initialResources, scroll, gaps })
    await writeFile(`${output}/observations.json`, JSON.stringify(results, null, 2) + '\n')
    await page.close()
    console.log(`PASS ${width}×${height}: scroll layout, keyboard landings, reading space, reduced motion; p95 frame ${scroll.frameP95Ms.toFixed(1)}ms at ${scroll.cpuRate}× CPU`)
  }
})
