#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const pagesRoot = path.resolve(here, '..');
const evidenceRoot = path.join(here, 'evidence');
const debugPort = process.env.ORDER9_DEBUG_PORT || '9222';

const pages = [
  'critical-journeys/home.html',
  'critical-journeys/emergency.html',
  'critical-journeys/appointment.html',
  'care-discovery/doctor-directory.html',
  'care-discovery/doctor-profile.html',
  'care-discovery/services-directory.html',
  'care-discovery/service-detail.html',
  'practical-institutional/patient-information.html',
  'practical-institutional/locations-contact.html',
  'practical-institutional/search-results.html',
  'practical-institutional/about.html',
  'practical-institutional/careers.html',
  'critical-journeys/appointment-states.html',
  'care-discovery/care-discovery-states.html',
  'practical-institutional/practical-institutional-states.html'
];

const viewports = [
  { label: '320', width: 320, height: 900 },
  { label: '360', width: 360, height: 900 },
  { label: 'tablet-768', width: 768, height: 1024 },
  { label: '1280', width: 1280, height: 900 },
  { label: '1440', width: 1440, height: 900 },
  { label: '200-reflow', width: 640, height: 900 },
  { label: '400-reflow', width: 320, height: 900 }
];

const fixtures = ['en', 'am', 'mixed', 'long', 'unavailable'];
const captures = new Set([
  'critical-journeys/home.html|320|am',
  'critical-journeys/emergency.html|360|mixed',
  'critical-journeys/appointment.html|200-reflow|long',
  'care-discovery/doctor-directory.html|tablet-768|am',
  'care-discovery/service-detail.html|400-reflow|mixed',
  'practical-institutional/patient-information.html|1440|am',
  'practical-institutional/locations-contact.html|1280|long',
  'practical-institutional/careers.html|320|long',
  'practical-institutional/practical-institutional-states.html|320|unavailable'
]);

const response = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
if (!response.ok) throw new Error(`Cannot reach Chromium debugging endpoint on port ${debugPort}.`);
const targets = await response.json();
const target = targets.find((item) => item.type === 'page');
if (!target) throw new Error('No Chromium page target is available.');

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let sequence = 0;
const pending = new Map();
const eventWaiters = new Map();

socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
    return;
  }
  const waiter = eventWaiters.get(message.method);
  if (waiter) {
    eventWaiters.delete(message.method);
    waiter(message.params);
  }
});

const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});

const once = (method) => new Promise((resolve) => eventWaiters.set(method, resolve));
const pause = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

await mkdir(evidenceRoot, { recursive: true });
await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setEmulatedMedia', { media: 'screen', features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });

const results = [];

for (const page of pages) {
  for (const viewport of viewports) {
    for (const fixture of fixtures) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.width <= 768,
        screenWidth: viewport.width,
        screenHeight: viewport.height
      });

      const url = new URL(pathToFileURL(path.join(pagesRoot, page)));
      url.searchParams.set('fixture', fixture);
      url.searchParams.set('audit', '1');
      const loaded = once('Page.loadEventFired');
      await send('Page.navigate', { url: url.href });
      await loaded;
      await pause(80);

      const evaluated = await send('Runtime.evaluate', {
        expression: `document.getElementById('order-9-audit-result')?.textContent || ''`,
        returnByValue: true
      });
      if (!evaluated.result.value) throw new Error(`Audit result missing for ${page} ${viewport.label} ${fixture}`);
      const result = JSON.parse(evaluated.result.value);
      results.push({ ...result, viewportLabel: viewport.label });

      const captureKey = `${page}|${viewport.label}|${fixture}`;
      if (captures.has(captureKey)) {
        const metrics = await send('Page.getLayoutMetrics');
        const content = metrics.cssContentSize || metrics.contentSize;
        const shot = await send('Page.captureScreenshot', {
          format: 'png',
          fromSurface: true,
          captureBeyondViewport: true,
          clip: { x: 0, y: 0, width: viewport.width, height: Math.min(content.height, 12000), scale: 1 }
        });
        const base = path.basename(page, '.html');
        await writeFile(path.join(evidenceRoot, `${base}-${viewport.label}-${fixture}-reduced.png`), Buffer.from(shot.data, 'base64'));
      }
    }
  }
}

const failures = results.filter((result) => !result.passed);
const summary = {
  generatedAt: new Date().toISOString(),
  method: 'Chromium CDP with exact CSS viewport emulation; reduced motion enabled',
  pages: pages.length,
  pageStudies: 12,
  stateBoards: 3,
  cases: results.length,
  passed: results.length - failures.length,
  failed: failures.length,
  failures,
  results
};

await writeFile(path.join(evidenceRoot, 'order-9-audit-results.json'), `${JSON.stringify(summary, null, 2)}\n`);
socket.close();

console.log(JSON.stringify({
  cases: summary.cases,
  passed: summary.passed,
  failed: summary.failed,
  evidence: path.join(evidenceRoot, 'order-9-audit-results.json')
}, null, 2));

if (failures.length) process.exitCode = 1;
