#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const pagesRoot = path.resolve(here, '../pages');
const evidenceRoot = path.join(here, 'evidence');
const debugPort = process.env.ORDER10_DEBUG_PORT || '9333';

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
  const waiters = eventWaiters.get(message.method);
  if (!waiters?.length) return;
  const waiter = waiters.shift();
  if (!waiters.length) eventWaiters.delete(message.method);
  waiter(message.params);
});

const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});

const once = (method) => new Promise((resolve) => {
  const waiters = eventWaiters.get(method) || [];
  waiters.push(resolve);
  eventWaiters.set(method, waiters);
});
const pause = (duration = 100) => new Promise((resolve) => setTimeout(resolve, duration));
const fileUrl = (relative, query = '') => `${pathToFileURL(path.join(pagesRoot, relative)).href}${query}`;

const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Browser evaluation failed.');
  return result.result.value;
};

const navigate = async (url) => {
  const loaded = once('Page.loadEventFired');
  await send('Page.navigate', { url });
  await loaded;
  await pause(180);
};

const clickAndNavigate = async (selector) => {
  const loaded = once('Page.loadEventFired');
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  await loaded;
  await pause(180);
};

const setViewport = (width, height = 900) => send('Emulation.setDeviceMetricsOverride', {
  width,
  height,
  deviceScaleFactor: 1,
  mobile: width <= 768,
  screenWidth: width,
  screenHeight: height
});

const results = [];
const record = (id, passed, detail) => {
  results.push({ id, passed: Boolean(passed), detail });
};

const capture = async (name, width) => {
  const metrics = await send('Page.getLayoutMetrics');
  const content = metrics.cssContentSize || metrics.contentSize;
  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width, height: Math.min(content.height, 12000), scale: 1 }
  });
  await writeFile(path.join(evidenceRoot, name), Buffer.from(shot.data, 'base64'));
};

await mkdir(evidenceRoot, { recursive: true });
await send('Page.enable');
await send('Runtime.enable');
await send('Network.enable');
await setViewport(1280);

await navigate(fileUrl('critical-journeys/home.html'));
const home = await evaluate(`({
  toolbar: Boolean(document.querySelector('.prototype-tools')),
  doctors: document.querySelector('.task-card[href*="doctor-directory"]')?.href || '',
  services: document.querySelector('.task-card[href*="services-directory"]')?.href || '',
  searchControl: Boolean(document.querySelector('[data-prototype-fill-query]')),
  external: performance.getEntriesByType('resource').map(entry => entry.name).filter(name => !name.startsWith('file:'))
})`);
record('P10-01', home.toolbar && home.doctors.includes('doctor-directory.html') && home.services.includes('services-directory.html'), home);
record('P10-02', home.searchControl && home.external.length === 0, home);

await clickAndNavigate('.task-card[href*="doctor-directory"]');
record('P10-03', (await evaluate('location.pathname')).endsWith('/doctor-directory.html'), await evaluate('location.href'));
await clickAndNavigate('[data-section="D4"] a[href*="doctor-profile"]');
record('P10-04', (await evaluate('location.pathname')).endsWith('/doctor-profile.html'), await evaluate('location.href'));
await clickAndNavigate('a[href*="appointment.html?doctor="]');
const doctorHandoff = await evaluate(`({
  path: location.pathname,
  route: document.querySelector('[data-care-route]:checked')?.value,
  doctor: document.querySelector('#doctor')?.value,
  notice: document.querySelector('.prototype-handoff-status')?.textContent || ''
})`);
record('P10-05', doctorHandoff.path.endsWith('/appointment.html') && doctorHandoff.route === 'doctor' && doctorHandoff.doctor === 'prototype-a' && doctorHandoff.notice.includes('carries no visitor data'), doctorHandoff);

await navigate(fileUrl('critical-journeys/appointment.html'));
await evaluate(`document.querySelector('form.form-card button[type="submit"]').click()`);
await pause(80);
const validation = await evaluate(`({
  visible: !document.querySelector('[data-section="A3"]').hidden,
  invalid: document.querySelector('#doctor')?.getAttribute('aria-invalid'),
  focus: document.activeElement?.tagName,
  title: document.activeElement?.textContent || ''
})`);
record('P10-06', validation.visible && validation.invalid === 'true' && validation.focus === 'H2' && validation.title.includes('problem'), validation);

await navigate(fileUrl('critical-journeys/appointment.html'));
await evaluate(`
  document.querySelector('[data-care-route][value="unsure"]').click();
  document.querySelector('#prototype-appointment-outcome').value = 'receipt';
  document.querySelector('form.form-card button[type="submit"]').click();
`);
await pause(650);
const receipt = await evaluate(`({
  formHidden: document.querySelector('form.form-card').hidden,
  formDisplay: getComputedStyle(document.querySelector('form.form-card')).display,
  text: document.querySelector('[data-section="A3"]').textContent,
  focus: document.activeElement?.tagName
})`);
record('P10-07', receipt.formHidden && receipt.formDisplay === 'none' && receipt.text.includes('not a confirmed appointment') && receipt.text.includes('PROTO-ONLY-001') && receipt.focus === 'H2', receipt);
await capture('appointment-authoritative-receipt-1280-en-standard.png', 1280);

await navigate(fileUrl('critical-journeys/appointment.html'));
await evaluate(`
  document.querySelector('[data-care-route][value="unsure"]').click();
  document.querySelector('#prototype-appointment-outcome').value = 'unknown';
  document.querySelector('form.form-card button[type="submit"]').click();
`);
await pause(650);
const unknown = await evaluate(`({
  blocked: document.querySelector('form.form-card button[type="submit"]').disabled,
  text: document.querySelector('[data-section="A3"]').textContent,
  recoveryChoices: document.querySelectorAll('[data-prototype-found], [data-prototype-not-created]').length
})`);
record('P10-08', unknown.blocked && unknown.text.includes('No success is claimed') && unknown.recoveryChoices === 2, unknown);
await evaluate(`document.querySelector('[data-prototype-found]').click()`);
await pause(60);
record('P10-09', (await evaluate(`document.querySelector('[data-section="A3"]').textContent`)).includes('PROTO-ONLY-001'), await evaluate(`document.querySelector('[data-section="A3"]').textContent`));

await navigate(fileUrl('care-discovery/doctor-directory.html'));
await evaluate(`document.querySelector('input[name="specialty"][value="prototype-b"]').checked = true`);
await clickAndNavigate('#doctor-filters button[type="submit"]');
const filtered = await evaluate(`({
  url: location.href,
  count: document.querySelector('.result-count')?.textContent,
  visibleCards: [...document.querySelectorAll('[data-section="D4"] .record-card')].filter(card => getComputedStyle(card).display !== 'none').length
})`);
await navigate(fileUrl('care-discovery/services-directory.html'));
await evaluate(`document.querySelector('input[name="group"][value="prototype-b"]').checked = true`);
await clickAndNavigate('#service-groups button[type="submit"]');
const serviceFiltered = await evaluate(`({
  url: location.href,
  count: document.querySelector('.result-count')?.textContent,
  visibleGroups: [...document.querySelectorAll('.result-group')].filter(group => getComputedStyle(group).display !== 'none').length,
  visibleCards: [...document.querySelectorAll('.result-group .record-card')].filter(card => getComputedStyle(card).display !== 'none' && getComputedStyle(card.closest('.result-group')).display !== 'none').length
})`);
record(
  'P10-10',
  filtered.url.includes('specialty=prototype-b') && filtered.count.startsWith('1 controlled') && filtered.visibleCards === 1 &&
    serviceFiltered.url.includes('group=prototype-b') && serviceFiltered.count.startsWith('2 controlled') && serviceFiltered.visibleGroups === 1 && serviceFiltered.visibleCards === 2,
  { doctor: filtered, service: serviceFiltered }
);

await setViewport(360);
await navigate(fileUrl('care-discovery/doctor-directory.html'));
await evaluate(`
  const trigger = document.querySelector('.filter-toggle');
  trigger.click();
  const radio = document.querySelector('#doctor-filters input');
  radio.focus();
  radio.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
`);
const escape = await evaluate(`({
  expanded: document.querySelector('.filter-toggle').getAttribute('aria-expanded'),
  focusReturned: document.activeElement === document.querySelector('.filter-toggle'),
  visible: document.querySelector('#doctor-filters').classList.contains('is-demo-visible')
})`);
record('P10-11', escape.expanded === 'false' && escape.focusReturned && !escape.visible, escape);

await setViewport(1280);
await navigate(fileUrl('care-discovery/doctor-directory.html', '?state=failure'));
const failure = await evaluate(`({
  alert: document.querySelector('.prototype-result-state')?.getAttribute('role'),
  resultsHidden: document.querySelector('.results-region')?.hidden,
  resultsDisplay: getComputedStyle(document.querySelector('.results-region')).display,
  recovery: Boolean(document.querySelector('[data-prototype-recover]'))
})`);
record('P10-12', failure.alert === 'alert' && failure.resultsHidden && failure.resultsDisplay === 'none' && failure.recovery, failure);
await capture('doctor-directory-failure-1280-en-reduced.png', 1280);
await clickAndNavigate('[data-prototype-recover]');
record('P10-13', !new URL(await evaluate('location.href')).searchParams.has('state'), await evaluate('location.href'));

await navigate(fileUrl('care-discovery/doctor-directory.html', '?q=prototype&specialty=prototype-b'));
await clickAndNavigate('.utility-actions [data-prototype-language="am"]');
const language = await evaluate(`({
  path: location.pathname,
  fixture: new URL(location.href).searchParams.get('fixture'),
  q: new URL(location.href).searchParams.get('q'),
  specialty: new URL(location.href).searchParams.get('specialty'),
  lang: document.documentElement.lang,
  notice: document.querySelector('.order-9-fixture-notice')?.textContent || ''
})`);
record('P10-14', language.path.endsWith('/doctor-directory.html') && language.fixture === 'am' && language.q === 'prototype' && language.specialty === 'prototype-b' && language.lang === 'am' && language.notice.includes('not approved translation'), language);

await navigate(fileUrl('critical-journeys/emergency.html'));
const beforeEmergencyClick = await evaluate('location.href');
await evaluate(`document.querySelector('[data-section="E2"] .demo-action, [data-section="E3"] .demo-action, button.button--emergency.demo-action')?.click()`);
await pause(80);
const emergency = await evaluate(`({
  sameLocation: location.href === ${JSON.stringify(beforeEmergencyClick)},
  telLinks: document.querySelectorAll('a[href^="tel:"]').length,
  runningAnimations: document.getAnimations().filter(animation => animation.playState === 'running').length,
  external: performance.getEntriesByType('resource').map(entry => entry.name).filter(name => !name.startsWith('file:'))
})`);
record('P10-15', emergency.sameLocation && emergency.telLinks === 0 && emergency.runningAnimations === 0 && emergency.external.length === 0, emergency);

await navigate(fileUrl('critical-journeys/home.html', '?motion=reduce'));
const reduced = await evaluate(`({
  mode: document.documentElement.dataset.prototypeMotion,
  durations: document.getAnimations().map(animation => animation.effect?.getTiming().duration || 0)
})`);
record('P10-16', reduced.mode === 'reduce' && reduced.durations.every((duration) => Number(duration) <= 1), reduced);

await navigate(fileUrl('critical-journeys/home.html'));
await evaluate(`(() => {
  const input = document.querySelector('#home-search');
  input.value = 'private patient information';
  input.closest('form').querySelector('button[type="submit"]').click();
})()`);
await pause(80);
const rejectedQuery = await evaluate(`({
  page: location.pathname,
  invalid: document.querySelector('#home-search')?.getAttribute('aria-invalid'),
  announced: document.querySelector('#demo-announcement')?.textContent || ''
})`);
record('P10-17', rejectedQuery.page.endsWith('/home.html') && rejectedQuery.invalid === 'true' && rejectedQuery.announced.includes('accepts only the controlled terms'), rejectedQuery);
await evaluate(`(() => {
  const input = document.querySelector('#home-search');
  input.value = 'prototype care';
})()`);
await clickAndNavigate('#home-search + .button, #home-search ~ .button[type="submit"]');
const safeSearch = await evaluate(`({ path: location.pathname, q: new URL(location.href).searchParams.get('q') })`);
record('P10-18', safeSearch.path.endsWith('/search-results.html') && safeSearch.q === 'prototype care', safeSearch);

const geometry = [];
for (const width of [320, 768, 1280]) {
  await setViewport(width, width === 768 ? 1024 : 900);
  for (const page of pages) {
    await navigate(fileUrl(page, '?motion=reduce'));
    const audit = await evaluate(`(() => {
      const root = document.documentElement;
      const interactive = [...document.querySelectorAll('button, input:not([type="checkbox"]):not([type="radio"]), select, textarea, summary, .choice, .button, .menu-trigger, .pagination a, nav a')]
        .filter(element => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== 'none' && style.visibility !== 'hidden' && !element.disabled && rect.width > 0 && rect.height > 0;
        });
      const small = interactive.filter(element => {
        const rect = element.getBoundingClientRect();
        return rect.width < 44 || rect.height < 44;
      }).map(element => ({ text: element.textContent.trim().slice(0, 60), rect: element.getBoundingClientRect().toJSON() }));
      return {
        overflow: root.scrollWidth > root.clientWidth + 1,
        small,
        toolbar: Boolean(document.querySelector('.prototype-tools')),
        external: performance.getEntriesByType('resource').map(entry => entry.name).filter(name => !name.startsWith('file:'))
      };
    })()`);
    geometry.push({ page, width, ...audit, passed: !audit.overflow && audit.small.length === 0 && audit.toolbar && audit.external.length === 0 });
  }
}
const geometryFailures = geometry.filter((item) => !item.passed);
record('P10-19', geometryFailures.length === 0, { cases: geometry.length, failures: geometryFailures });

await setViewport(360);
await navigate(fileUrl('critical-journeys/home.html'));
await capture('home-connected-routes-360-en-standard.png', 360);
await navigate(fileUrl('care-discovery/doctor-directory.html', '?q=prototype&specialty=prototype-b&fixture=am&motion=reduce'));
await capture('doctor-directory-handoff-360-am-reduced.png', 360);
await navigate(fileUrl('practical-institutional/search-results.html', '?state=offline&motion=reduce'));
await capture('search-offline-360-en-reduced.png', 360);

const failures = results.filter((result) => !result.passed);
const summary = {
  generatedAt: new Date().toISOString(),
  method: 'Local Chromium CDP; scripted pointer/keyboard-equivalent activation, focus/state assertions, and 320/768/1280 geometry checks',
  interactionAssertions: results.length,
  passed: results.length - failures.length,
  failed: failures.length,
  geometryCases: geometry.length,
  geometryFailures: geometryFailures.length,
  results,
  geometry
};

await writeFile(path.join(evidenceRoot, 'order-10-audit-results.json'), `${JSON.stringify(summary, null, 2)}\n`);
socket.close();

console.log(JSON.stringify({
  interactionAssertions: summary.interactionAssertions,
  passed: summary.passed,
  failed: summary.failed,
  geometryCases: summary.geometryCases,
  geometryFailures: summary.geometryFailures,
  evidence: path.join(evidenceRoot, 'order-10-audit-results.json')
}, null, 2));

if (failures.length) process.exitCode = 1;
