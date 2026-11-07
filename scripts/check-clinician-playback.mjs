import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { setTimeout as pause } from 'node:timers/promises'
import { runVisualCheck } from './lib/visual-check.mjs'

const baseUrl = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
// Observe natural playback without pausing animations or taking screenshots.
// requestAnimationFrame measures main-thread opportunities, not GPU delivery.
const probe = `
  window.playbackTasks = [];
  new PerformanceObserver(list => window.playbackTasks.push(...list.getEntries().map(entry => ({
    start: entry.startTime, duration: entry.duration,
  })))).observe({type: 'longtask', buffered: true});
  function sample(transition) {
    if (!transition) return;
    transition.ready.then(() => {
      const start = performance.now();
      let done = false;
      const frames = [];
      function frame(now) { frames.push(now); if (!done) requestAnimationFrame(frame); }
      requestAnimationFrame(frame);
      transition.finished.then(() => {
        done = true;
        window.playback = { start, end: performance.now(), frames,
          tasks: window.playbackTasks.filter(entry => entry.start >= start - 20) };
      });
    });
  }
  addEventListener('pagereveal', event => sample(event.viewTransition));
  if (document.startViewTransition) {
    const start = document.startViewTransition.bind(document);
    document.startViewTransition = (...args) => { const transition = start(...args); sample(transition); return transition; };
  }
`
await runVisualCheck('clinician-playback', baseUrl, async ({ browser, output }) => {
  const results = []
  // Run alone: concurrent screenshots or other browsers distort these samples.
  for (const width of [390, 768, 1440]) {
    for (const cpuRate of [1, 4]) {
      for (let repeat = 0; repeat < 2; repeat++) {
        const page = await browser.newPage({ width, height: 1000, mobile: width < 600, reducedMotion: false })
        try {
          await page.send('Emulation.setCPUThrottlingRate', { rate: cpuRate })
          await page.send('Page.addScriptToEvaluateOnNewDocument', { source: probe })
          await page.goto(`${baseUrl}/doctors?q=Aster`)
          await page.eval('window.playbackDocument = document; true')
          await page.eval(() => document.querySelector('[data-clinician-public-id] a[aria-label^="View profile"]').click())
          let playback
          for (let attempt = 0; attempt < 200; attempt++) {
            playback = await page.eval('window.playback')
            if (playback) break
            await pause(50)
          }
          assert.ok(playback, 'Expected completed enhanced playback')
          const intervals = playback.frames.slice(1).map((time, index) => time - playback.frames[index])
          const meanFrameMs = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
          const result = { width, cpuRate, repeat, durationMs: playback.end - playback.start,
            meanFrameMs, maxFrameMs: Math.max(...intervals), frames: intervals.length, longTasks: playback.tasks }
          results.push(result)
          await writeFile(path.join(output, 'measurements.json'), `${JSON.stringify(results, null, 2)}\n`)
          assert.equal(await page.eval('window.playbackDocument === document'), true, 'Avoid restarting the app during playback')
          assert.ok(intervals.length >= 10, 'Too few sampled frames to assess playback')
          // Compare at 0.1ms precision: frame timestamps are quantized and a
          // nominal 20ms sample can report 20.005ms.
          assert.ok(Number(meanFrameMs.toFixed(1)) <= 20, `Playback exceeded the 20ms mean-frame budget: ${JSON.stringify(result)}`)
          assert.deepEqual(page.consoleErrors, [])
          console.log(`PASS ${width}px at ${cpuRate}× CPU, sample ${repeat + 1}: ${meanFrameMs.toFixed(2)}ms mean, ${result.maxFrameMs.toFixed(2)}ms max`)
        } finally { await page.close() }
      }
    }
  }
})
