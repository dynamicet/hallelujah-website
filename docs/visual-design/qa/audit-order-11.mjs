#!/usr/bin/env node

import { mkdir, stat, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const visualRoot = path.resolve(here, '..');
const pagesRoot = path.join(visualRoot, 'pages');
const evidenceRoot = path.join(here, 'evidence');
const debugPort = process.env.ORDER11_DEBUG_PORT || '9444';
const httpBase = (process.env.ORDER11_HTTP_BASE || '').replace(/\/$/, '');

const pagePaths = [
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

const artifacts = [
  ...pagePaths.map((relative) => ({ name: relative, url: pathToFileURL(path.join(pagesRoot, relative)).href })),
  { name: 'prototype/index.html', url: pathToFileURL(path.join(visualRoot, 'prototype/index.html')).href }
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
let observedRequests = [];

socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
    return;
  }
  if (message.method === 'Network.requestWillBeSent') observedRequests.push(message.params.request.url);
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
const withQuery = (artifact, query = '') => `${artifact.url}${query}`;

const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Browser evaluation failed.');
  return result.result.value;
};

const navigate = async (url, settle = 180) => {
  observedRequests = [];
  const loaded = once('Page.loadEventFired');
  await send('Page.navigate', { url });
  await loaded;
  await pause(settle);
};

const setViewport = (width, height = 900, deviceScaleFactor = 1) => send('Emulation.setDeviceMetricsOverride', {
  width,
  height,
  deviceScaleFactor,
  mobile: width <= 768,
  screenWidth: width * deviceScaleFactor,
  screenHeight: height * deviceScaleFactor
});

const setMedia = (features = []) => send('Emulation.setEmulatedMedia', { media: 'screen', features });

const press = async (key, { shift = false } = {}) => {
  const keyCodes = { Tab: 9, Enter: 13, Escape: 27, Space: 32 };
  const code = key === ' ' ? 'Space' : key;
  const normalizedKey = key === 'Space' ? ' ' : key;
  const params = {
    key: normalizedKey,
    code,
    windowsVirtualKeyCode: keyCodes[key] || keyCodes[code] || 0,
    nativeVirtualKeyCode: keyCodes[key] || keyCodes[code] || 0,
    modifiers: shift ? 8 : 0
  };
  if (key === 'Enter') {
    params.text = '\r';
    params.unmodifiedText = '\r';
  } else if (key === 'Space' || key === ' ') {
    params.text = ' ';
    params.unmodifiedText = ' ';
  }
  await send('Input.dispatchKeyEvent', { type: params.text ? 'keyDown' : 'rawKeyDown', ...params });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', ...params });
  await pause(35);
};

const capture = async (name, width, fullPage = false) => {
  const metrics = await send('Page.getLayoutMetrics');
  const content = metrics.cssContentSize || metrics.contentSize;
  const height = fullPage ? Math.min(content.height, 12000) : Math.min(content.height, 1200);
  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width, height, scale: 1 }
  });
  await writeFile(path.join(evidenceRoot, name), Buffer.from(shot.data, 'base64'));
};

const results = [];
const record = (id, category, passed, detail) => results.push({ id, category, passed: Boolean(passed), detail });

await mkdir(evidenceRoot, { recursive: true });
await send('Page.enable');
await send('Runtime.enable');
await send('Network.enable');
await send('Network.setCacheDisabled', { cacheDisabled: true });
await send('Accessibility.enable');
await send('Performance.enable');
await setViewport(1280);
await setMedia([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

const semanticCases = [];
const contrastCases = [];
const axCases = [];

for (const artifact of artifacts) {
  await navigate(withQuery(artifact, artifact.name === 'prototype/index.html' ? '' : '?motion=reduce'));
  const semantic = await evaluate(`(() => {
    const visible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };
    const text = (element) => (element.getAttribute('aria-label') || element.textContent || '').trim();
    const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
    const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    const brokenReferences = [];
    for (const element of document.querySelectorAll('[for], [aria-labelledby], [aria-describedby], [aria-controls], a[href^="#"]')) {
      const attributes = ['for', 'aria-labelledby', 'aria-describedby', 'aria-controls'];
      for (const attribute of attributes) {
        if (!element.hasAttribute(attribute)) continue;
        for (const id of element.getAttribute(attribute).split(/\\s+/).filter(Boolean)) {
          if (!document.getElementById(id)) brokenReferences.push({ attribute, id, element: element.tagName });
        }
      }
      if (element.matches('a[href^="#"]')) {
        const id = decodeURIComponent(element.hash.slice(1));
        if (id && !document.getElementById(id)) brokenReferences.push({ attribute: 'href', id, element: 'A' });
      }
    }
    const headings = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].filter(visible);
    const headingJumps = [];
    headings.forEach((heading, index) => {
      if (!index) return;
      const previous = Number(headings[index - 1].tagName.slice(1));
      const current = Number(heading.tagName.slice(1));
      if (current > previous + 1) headingJumps.push({ previous, current, text: text(heading).slice(0, 80) });
    });
    const unnamedControls = [...document.querySelectorAll('a[href], button, input, select, textarea, summary')]
      .filter(visible)
      .filter((element) => {
        if (element.matches('input[type="hidden"]')) return false;
        const labels = element.labels ? [...element.labels].map((label) => label.textContent).join(' ') : '';
        const labelled = (element.getAttribute('aria-labelledby') || '').split(/\\s+/).map((id) => document.getElementById(id)?.textContent || '').join(' ');
        return !(element.getAttribute('aria-label') || labelled || labels || element.textContent || element.value || element.title).trim();
      }).map((element) => element.outerHTML.slice(0, 140));
    const unnamedImages = [...document.querySelectorAll('img, [role="img"]')].filter(visible).filter((element) =>
      element.getAttribute('aria-hidden') !== 'true' && !(element.getAttribute('alt') || element.getAttribute('aria-label') || '').trim()
    ).map((element) => element.outerHTML.slice(0, 140));
    const badSchemes = [...document.querySelectorAll('a[href]')].map((link) => link.getAttribute('href')).filter((href) => /^(?:https?:|tel:|mailto:)/i.test(href));
    return {
      title: document.title,
      lang: document.documentElement.lang,
      mainCount: document.querySelectorAll('main').length,
      h1Count: [...document.querySelectorAll('h1')].filter(visible).length,
      skipTarget: document.querySelector('.skip-link')?.getAttribute('href'),
      prototypeLabel: Boolean(document.querySelector('.prototype-banner')),
      duplicateIds,
      brokenReferences,
      headingJumps,
      unnamedControls,
      unnamedImages,
      positiveTabindex: [...document.querySelectorAll('[tabindex]')].filter((element) => Number(element.tabIndex) > 0).length,
      badSchemes,
      activeInertForms: document.querySelectorAll('.demo-form[inert]').length,
      externalResources: performance.getEntriesByType('resource').map((entry) => entry.name).filter((name) => !name.startsWith('file:'))
    };
  })()`);
  const semanticPassed = semantic.title.length > 0 && semantic.lang.length > 0 && semantic.mainCount === 1 && semantic.h1Count === 1 && semantic.skipTarget.endsWith('#main') && semantic.prototypeLabel && semantic.duplicateIds.length === 0 && semantic.brokenReferences.length === 0 && semantic.headingJumps.length === 0 && semantic.unnamedControls.length === 0 && semantic.unnamedImages.length === 0 && semantic.positiveTabindex === 0 && semantic.badSchemes.length === 0 && semantic.activeInertForms === 0 && semantic.externalResources.length === 0;
  semanticCases.push({ artifact: artifact.name, passed: semanticPassed, ...semantic });

  const contrast = await evaluate(`(() => {
    const parse = (value) => {
      const match = value.match(/rgba?\\(([^)]+)\\)/);
      if (!match) return null;
      const parts = match[1].split(/[ ,/]+/).filter(Boolean).map(Number);
      return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
    };
    const channel = (value) => { const n = value / 255; return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4; };
    const luminance = (color) => .2126 * channel(color.r) + .7152 * channel(color.g) + .0722 * channel(color.b);
    const ratio = (a, b) => { const l1 = luminance(a); const l2 = luminance(b); return (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05); };
    const background = (element) => {
      let current = element;
      while (current) {
        const color = parse(getComputedStyle(current).backgroundColor);
        if (color && color.a === 1) return color;
        current = current.parentElement;
      }
      return { r: 255, g: 255, b: 255, a: 1 };
    };
    const failures = [];
    const samples = [];
    for (const element of document.querySelectorAll('body *')) {
      const directText = [...element.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.textContent.trim()).join(' ').trim();
      if (!directText) continue;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      if (style.display === 'none' || style.visibility === 'hidden' || rect.width <= 0 || rect.height <= 0) continue;
      const foreground = parse(style.color);
      if (!foreground || foreground.a !== 1) continue;
      const value = ratio(foreground, background(element));
      const size = parseFloat(style.fontSize);
      const weight = Number(style.fontWeight) || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const required = large ? 3 : 4.5;
      samples.push(value);
      if (value + .01 < required) failures.push({ text: directText.slice(0, 70), ratio: Number(value.toFixed(2)), required, color: style.color, background: getComputedStyle(element).backgroundColor });
    }
    return { samples: samples.length, minimum: Number(Math.min(...samples).toFixed(2)), failures };
  })()`);
  contrastCases.push({ artifact: artifact.name, passed: contrast.failures.length === 0, ...contrast });

  const ax = await send('Accessibility.getFullAXTree');
  const nodes = ax.nodes.filter((node) => !node.ignored);
  const controls = new Set(['button', 'link', 'textbox', 'searchbox', 'combobox', 'checkbox', 'radio']);
  const unnamed = nodes.filter((node) => controls.has(node.role?.value) && !(node.name?.value || '').trim()).map((node) => node.role.value);
  const axResult = {
    root: nodes.some((node) => node.role?.value === 'RootWebArea' && (node.name?.value || '').trim()),
    main: nodes.some((node) => node.role?.value === 'main'),
    headings: nodes.filter((node) => node.role?.value === 'heading').length,
    navigations: nodes.filter((node) => node.role?.value === 'navigation').length,
    unnamed
  };
  axCases.push({ artifact: artifact.name, passed: axResult.root && axResult.main && axResult.headings > 0 && axResult.unnamed.length === 0, ...axResult });
}

record('Q11-01', 'semantics', semanticCases.every((item) => item.passed), { cases: semanticCases.length, failures: semanticCases.filter((item) => !item.passed) });
record('Q11-02', 'screen-reader-structure', axCases.every((item) => item.passed), { method: 'Chromium accessibility tree inspection; not a human screen-reader session', cases: axCases.length, failures: axCases.filter((item) => !item.passed) });
record('Q11-03', 'contrast', contrastCases.every((item) => item.passed), { method: 'Computed solid-background text contrast; gradients and anti-aliasing excluded', cases: contrastCases.length, minimum: Math.min(...contrastCases.map((item) => item.minimum)), failures: contrastCases.filter((item) => !item.passed) });

const keyboardCases = [];
await setViewport(320);
for (const artifact of artifacts) {
  await navigate(withQuery(artifact, artifact.name === 'prototype/index.html' ? '' : '?motion=reduce'));
  await evaluate(`document.activeElement?.blur(); document.body.setAttribute('tabindex', '-1'); document.body.focus(); document.body.removeAttribute('tabindex')`);
  await press('Tab');
  const skip = await evaluate(`(() => { const active = document.activeElement; const style = getComputedStyle(active); const rect = active.getBoundingClientRect(); return { isSkip: active.matches('.skip-link'), outline: parseFloat(style.outlineWidth), visible: rect.top >= 0 && rect.left >= 0 && rect.width > 0 && rect.height >= 44 }; })()`);
  await press('Enter');
  const targetFocused = await evaluate(`document.activeElement === document.querySelector('main') && location.hash === '#main'`);
  keyboardCases.push({ artifact: artifact.name, passed: skip.isSkip && skip.outline >= 3 && skip.visible && targetFocused, skip, targetFocused });
}
record('Q11-04', 'keyboard-focus', keyboardCases.every((item) => item.passed), { method: 'Real CDP Tab and Enter key events on every artifact', cases: keyboardCases.length, failures: keyboardCases.filter((item) => !item.passed) });

const home = artifacts.find((item) => item.name.endsWith('home.html'));
const doctorDirectory = artifacts.find((item) => item.name.endsWith('doctor-directory.html'));
const appointment = artifacts.find((item) => item.name.endsWith('appointment.html'));
const emergencyPage = artifacts.find((item) => item.name.endsWith('emergency.html'));

await navigate(withQuery(home, '?motion=reduce'));
await evaluate(`document.querySelector('.menu-trigger').focus()`);
await press('Enter');
const menuOpen = await evaluate(`({ expanded: document.querySelector('.menu-trigger').getAttribute('aria-expanded'), firstFocused: document.activeElement === document.querySelector('#mobile-menu a'), hidden: document.querySelector('#mobile-menu').hidden })`);
await press('Escape');
const menuClosed = await evaluate(`({ expanded: document.querySelector('.menu-trigger').getAttribute('aria-expanded'), returned: document.activeElement === document.querySelector('.menu-trigger'), hidden: document.querySelector('#mobile-menu').hidden })`);
record('Q11-05', 'keyboard-focus', menuOpen.expanded === 'true' && menuOpen.firstFocused && !menuOpen.hidden && menuClosed.expanded === 'false' && menuClosed.returned && menuClosed.hidden, { menuOpen, menuClosed });

await navigate(withQuery(doctorDirectory, '?motion=reduce'));
await evaluate(`document.querySelector('.filter-toggle').focus()`);
await press('Enter');
await press('Tab');
await press('Escape');
const filterKeyboard = await evaluate(`({ expanded: document.querySelector('.filter-toggle').getAttribute('aria-expanded'), returned: document.activeElement === document.querySelector('.filter-toggle'), visible: document.querySelector('#doctor-filters').classList.contains('is-demo-visible') })`);
record('Q11-06', 'keyboard-focus', filterKeyboard.expanded === 'false' && filterKeyboard.returned && !filterKeyboard.visible, filterKeyboard);

await navigate(withQuery(appointment, '?motion=reduce'));
await evaluate(`document.querySelector('form.form-card button[type="submit"]').focus()`);
await press('Enter');
const validationFocus = await evaluate(`({ summaryFocused: document.activeElement?.matches('[data-section="A3"] h2'), invalid: document.querySelector('#doctor').getAttribute('aria-invalid'), valuesRetained: document.querySelector('#full-name').value === '' })`);
await press('Tab');
await press('Enter');
const linkedField = await evaluate(`document.activeElement === document.querySelector('#doctor')`);
record('Q11-07', 'forms-feedback', validationFocus.summaryFocused && validationFocus.invalid === 'true' && linkedField, { validationFocus, linkedField });

const stateCases = [];
for (const artifact of artifacts.filter((item) => /doctor-directory|services-directory|search-results/.test(item.name))) {
  for (const state of ['loading', 'no-match', 'failure', 'offline', 'unavailable']) {
    await navigate(withQuery(artifact, `?state=${state}&motion=reduce`));
    const observed = await evaluate(`(() => { const panel = document.querySelector('.prototype-result-state'); const results = document.querySelector('.results-region'); return { panel: Boolean(panel), role: panel?.getAttribute('role'), resultsHidden: results?.hidden, recover: Boolean(panel?.querySelector('[data-prototype-recover]')), external: performance.getEntriesByType('resource').some((entry) => !entry.name.startsWith('file:')) }; })()`);
    const expectedRole = state === 'loading' ? 'status' : 'alert';
    stateCases.push({ artifact: artifact.name, state, passed: observed.panel && observed.role === expectedRole && observed.resultsHidden && observed.recover && !observed.external, ...observed });
  }
}
record('Q11-08', 'error-loading-states', stateCases.every((item) => item.passed), { cases: stateCases.length, failures: stateCases.filter((item) => !item.passed) });

const bilingualCases = [];
for (const artifact of artifacts.filter((item) => item.name !== 'prototype/index.html')) {
  for (const fixture of ['am', 'mixed', 'long', 'unavailable']) {
    await navigate(withQuery(artifact, `?fixture=${fixture}&motion=reduce`));
    const observed = await evaluate(`({ lang: document.documentElement.lang, notice: document.querySelector('.order-9-fixture-notice')?.textContent || '', overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1, external: performance.getEntriesByType('resource').some((entry) => !entry.name.startsWith('file:')) })`);
    const expectedLang = fixture === 'am' ? 'am' : 'en';
    bilingualCases.push({ artifact: artifact.name, fixture, passed: observed.lang === expectedLang && observed.notice.length > 0 && !observed.overflow && !observed.external, ...observed });
  }
}
record('Q11-09', 'bilingual-presentation', bilingualCases.every((item) => item.passed), { method: 'Controlled geometry/stress fixtures only; no linguistic approval', cases: bilingualCases.length, failures: bilingualCases.filter((item) => !item.passed) });

await setMedia([
  { name: 'prefers-reduced-motion', value: 'reduce' },
  { name: 'forced-colors', value: 'active' }
]);
const forcedColorCases = [];
for (const [artifact, selector] of [[home, '.task-card'], [emergencyPage, '.button--emergency'], [appointment, '.field']]) {
  for (const width of [320, 1280]) {
    await setViewport(width);
    await navigate(withQuery(artifact, '?motion=reduce'));
    await evaluate(`document.querySelector(${JSON.stringify(selector)}).focus()`);
    const observed = await evaluate(`(() => { const element = document.querySelector(${JSON.stringify(selector)}); const style = getComputedStyle(element); return { active: matchMedia('(forced-colors: active)').matches, overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1, outline: parseFloat(style.outlineWidth), border: Math.max(parseFloat(style.borderTopWidth), parseFloat(style.borderRightWidth), parseFloat(style.borderBottomWidth), parseFloat(style.borderLeftWidth)), color: style.color, background: style.backgroundColor }; })()`);
    forcedColorCases.push({ artifact: artifact.name, width, passed: observed.active && !observed.overflow && observed.outline >= 3 && observed.border >= 1, ...observed });
  }
}
record('Q11-10', 'forced-colors', forcedColorCases.every((item) => item.passed), { method: 'Chromium forced-colors media emulation plus focus/border geometry', cases: forcedColorCases.length, failures: forcedColorCases.filter((item) => !item.passed) });
await setViewport(320);
await navigate(withQuery(emergencyPage, '?motion=reduce'));
await capture('emergency-320-en-forced-colors-reduced.png', 320, true);

await setMedia([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await setViewport(360);
await navigate(withQuery(emergencyPage, '?motion=reduce'));
const touchPoint = await evaluate(`(() => { const element = document.querySelector('[data-section="E1"] .button--emergency.demo-action'); element.scrollIntoView({ block: 'center' }); const rect = element.getBoundingClientRect(); return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }; })()`);
await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: touchPoint.x, y: touchPoint.y, radiusX: 2, radiusY: 2, force: 1, id: 1 }] });
await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
await pause(100);
const deliberateTouch = await evaluate(`({ samePage: location.pathname.endsWith('/emergency.html'), noDialer: document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]').length === 0, announced: !document.querySelector('#demo-announcement').hidden })`);
await navigate(withQuery(emergencyPage, '?motion=reduce'));
const scrollPoint = await evaluate(`(() => { const element = document.querySelector('[data-section="E1"] .button--emergency.demo-action'); element.scrollIntoView({ block: 'center' }); const rect = element.getBoundingClientRect(); return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }; })()`);
await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: scrollPoint.x, y: scrollPoint.y, radiusX: 2, radiusY: 2, force: 1, id: 2 }] });
await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: scrollPoint.x, y: Math.max(20, scrollPoint.y - 120), radiusX: 2, radiusY: 2, force: 1, id: 2 }] });
await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
await pause(120);
const scrollTouch = await evaluate(`({ samePage: location.pathname.endsWith('/emergency.html'), announcementHidden: document.querySelector('#demo-announcement').hidden, noDialer: document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]').length === 0 })`);
record('Q11-11', 'touch-emergency-safety', deliberateTouch.samePage && deliberateTouch.noDialer && deliberateTouch.announced && scrollTouch.samePage && scrollTouch.announcementHidden && scrollTouch.noDialer, { method: 'Emulated touch tap and moved scroll gesture; no physical dialer/device', deliberateTouch, scrollTouch });
await send('Emulation.setTouchEmulationEnabled', { enabled: false });

const reflowCases = [];
for (const setting of [
  { label: '200%-equivalent', width: 640, scale: 2, fixture: 'long' },
  { label: '400%-equivalent', width: 320, scale: 4, fixture: 'mixed' }
]) {
  await setViewport(setting.width, 900, setting.scale);
  for (const artifact of artifacts) {
    await navigate(withQuery(artifact, artifact.name === 'prototype/index.html' ? '' : `?fixture=${setting.fixture}&motion=reduce`));
    const observed = await evaluate(`(() => { const root = document.documentElement; const controls = [...document.querySelectorAll('button, input:not([type="checkbox"]):not([type="radio"]), select, textarea, summary, .choice, .button, .menu-trigger, .pagination a, nav a')].filter((element) => { const style = getComputedStyle(element); const rect = element.getBoundingClientRect(); return style.display !== 'none' && style.visibility !== 'hidden' && !element.disabled && rect.width > 0 && rect.height > 0; }); const small = controls.filter((element) => { const rect = element.getBoundingClientRect(); return rect.width < 44 || rect.height < 44; }).length; return { viewport: innerWidth, overflow: root.scrollWidth > root.clientWidth + 1, small }; })()`);
    reflowCases.push({ artifact: artifact.name, setting: setting.label, passed: observed.viewport === setting.width && !observed.overflow && observed.small === 0, ...observed });
  }
}
record('Q11-12', 'zoom-reflow', reflowCases.every((item) => item.passed), { method: 'Chromium CSS-viewport/device-scale emulation; browser UI zoom controls were not manually operated', cases: reflowCases.length, failures: reflowCases.filter((item) => !item.passed) });

await send('Emulation.setScriptExecutionDisabled', { value: true });
await setViewport(360);
const noJsCases = [];
for (const artifact of artifacts) {
  await navigate(artifact.url, 80);
  const observed = await evaluate(`({ mainText: document.querySelector('main')?.innerText.trim().length || 0, prototypeLabel: Boolean(document.querySelector('.prototype-banner')), interactiveForms: document.querySelectorAll('.demo-form:not([inert])').length, forms: document.querySelectorAll('.demo-form').length, noJsMessage: [...document.querySelectorAll('.demo-form')].every((form) => getComputedStyle(form, '::after').content.includes('No information can be entered or sent')), external: performance.getEntriesByType('resource').some((entry) => !entry.name.startsWith('file:')) })`);
  const formsSafe = observed.forms === 0 || (observed.interactiveForms === 0 && observed.noJsMessage);
  noJsCases.push({ artifact: artifact.name, passed: observed.mainText > 80 && observed.prototypeLabel && formsSafe && !observed.external, ...observed });
}
record('Q11-13', 'no-javascript', noJsCases.every((item) => item.passed), { cases: noJsCases.length, failures: noJsCases.filter((item) => !item.passed) });
await send('Emulation.setScriptExecutionDisabled', { value: false });

await setViewport(1280);
await setMedia([]);
await navigate(home.url, 40);
const standardMotion = await evaluate(`(() => { const animations = document.getAnimations().map((animation) => ({ state: animation.playState, timing: animation.effect.getTiming(), frames: animation.effect.getKeyframes().map((frame) => ({ transform: frame.transform, opacity: frame.opacity })) })); return { count: animations.length, animations, maxDuration: Math.max(0, ...animations.map((item) => Number(item.timing.duration))), maxDelay: Math.max(0, ...animations.map((item) => Number(item.timing.delay))), layoutShift: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 }; })()`);
await navigate(emergencyPage.url, 40);
const emergencyMotion = await evaluate(`document.getAnimations().length`);
await setMedia([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await navigate(home.url, 40);
const reducedMotion = await evaluate(`({ animations: document.getAnimations().map((animation) => animation.effect.getTiming().duration), mode: matchMedia('(prefers-reduced-motion: reduce)').matches })`);
const motionPassed = standardMotion.count <= 6 && standardMotion.maxDuration <= 300 && standardMotion.maxDelay <= 150 && !standardMotion.layoutShift && emergencyMotion === 0 && reducedMotion.mode && reducedMotion.animations.every((duration) => Number(duration) <= 1);
record('Q11-14', 'motion', motionPassed, { standardMotion, emergencyMotion, reducedMotion });

const saveDataInjection = await send('Page.addScriptToEvaluateOnNewDocument', {
  source: `Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true, effectiveType: '2g' } });`
});
await setMedia([]);
await navigate(home.url, 60);
const saveDataMotion = await evaluate(`({ conserve: document.documentElement.dataset.prototypeConserve, animations: document.getAnimations().map((animation) => animation.playState) })`);
record('Q11-15', 'motion', saveDataMotion.conserve === 'true' && saveDataMotion.animations.length === 0, { method: 'Navigator Save-Data override before document creation', ...saveDataMotion });
await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: saveDataInjection.identifier });

const vitalsInjection = await send('Page.addScriptToEvaluateOnNewDocument', {
  source: `window.__order11Vitals = { cls: 0, lcp: 0, longTasks: [] };
    new PerformanceObserver((list) => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__order11Vitals.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((list) => { const entries = list.getEntries(); if (entries.length) window.__order11Vitals.lcp = entries.at(-1).startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => { for (const entry of list.getEntries()) window.__order11Vitals.longTasks.push(entry.duration); }).observe({ type: 'longtask', buffered: true });`
});
await send('Network.emulateNetworkConditions', { offline: false, latency: 400, downloadThroughput: 50000, uploadThroughput: 20000, connectionType: 'cellular3g' });
await send('Emulation.setCPUThrottlingRate', { rate: 6 });
await setViewport(360);
const constrainedUrl = httpBase ? `${httpBase}/visual-design/pages/critical-journeys/home.html` : home.url;
await navigate(constrainedUrl, 1200);
const constrainedRequests = [...new Set(observedRequests)];
const constrained = await evaluate(`(() => { const nav = performance.getEntriesByType('navigation')[0]; const resources = performance.getEntriesByType('resource'); const allowedHttp = ${JSON.stringify(httpBase)}; return { dcl: nav.domContentLoadedEventEnd, load: nav.loadEventEnd, resources: resources.map((entry) => ({ name: entry.name, duration: entry.duration, initiatorType: entry.initiatorType })), external: resources.filter((entry) => !entry.name.startsWith('file:') && !(allowedHttp && entry.name.startsWith(allowedHttp + '/'))).length, vitals: window.__order11Vitals, usable: Boolean(document.querySelector('main h1') && document.querySelector('.task-card')) }; })()`);
await evaluate(`document.querySelector('.menu-trigger').focus()`);
const interactionStart = Date.now();
await press('Enter');
const interactionElapsed = Date.now() - interactionStart;
const constrainedMenu = await evaluate(`document.querySelector('.menu-trigger').getAttribute('aria-expanded') === 'true'`);

const resourceFiles = new Set();
for (const requestUrl of constrainedRequests) {
  if (requestUrl.startsWith('file:')) resourceFiles.add(fileURLToPath(requestUrl));
  else if (httpBase && requestUrl.startsWith(`${httpBase}/`)) {
    resourceFiles.add(path.join(path.resolve(visualRoot, '..'), decodeURIComponent(new URL(requestUrl).pathname).replace(/^\/+/, '')));
  }
}
let totalBytes = 0;
let javascriptBytes = 0;
const missingBudgetFiles = [];
for (const resourceFile of resourceFiles) {
  let size;
  try {
    size = (await stat(resourceFile)).size;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    missingBudgetFiles.push(resourceFile);
    continue;
  }
  totalBytes += size;
  if (resourceFile.endsWith('.js')) javascriptBytes += size;
}
const budgets = { requests: constrainedRequests.length, totalUncompressedBytes: totalBytes, javascriptUncompressedBytes: javascriptBytes, ignoredBrowserRequests: missingBudgetFiles };
record('Q11-16', 'constrained-performance', constrained.external === 0 && constrained.usable && constrainedMenu && constrained.vitals.cls <= .1 && constrained.vitals.longTasks.every((duration) => duration <= 50), { method: httpBase ? 'Chromium 6× CPU throttle and 400 ms / 400 kbps local HTTP profile' : 'Chromium 6× CPU throttle; Slow-3G network settings do not throttle file URLs', constrained, requests: constrainedRequests, interactionRoundTripMs: interactionElapsed });
record('Q11-17', 'asset-budgets', budgets.requests <= 50 && budgets.totalUncompressedBytes <= 1000000 && budgets.javascriptUncompressedBytes <= 150000, { method: 'Initial Home document plus loaded local dependency file sizes, uncompressed (conservative versus compressed limits)', budgets });
await send('Emulation.setCPUThrottlingRate', { rate: 1 });
await send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1, connectionType: 'none' });
await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: vitalsInjection.identifier });

await setViewport(360);
await setMedia([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await navigate(withQuery(appointment, '?motion=reduce'));
await evaluate(`document.querySelector('[data-care-route][value="unsure"]').click(); document.querySelector('#prototype-appointment-outcome').value = 'failure'; document.querySelector('form.form-card button[type="submit"]').click()`);
await pause(550);
await capture('appointment-failure-360-en-reduced.png', 360, true);
await navigate(withQuery(doctorDirectory, '?state=loading&fixture=am&motion=reduce'));
await capture('doctor-directory-loading-360-am-reduced.png', 360, true);

const failures = results.filter((result) => !result.passed);
const summary = {
  generatedAt: new Date().toISOString(),
  environment: 'Local headless Chromium through DevTools Protocol',
  method: 'Automated semantic/AX-tree, contrast, real keyboard event, state, bilingual stress, forced-colors, emulated touch, reflow-equivalent, no-JavaScript, motion, Save-Data, and constrained-profile checks',
  assertions: results.length,
  passed: results.length - failures.length,
  failed: failures.length,
  artifacts: artifacts.length,
  results,
  semanticCases,
  contrastCases,
  axCases,
  keyboardCases,
  stateCases,
  bilingualCases,
  forcedColorCases,
  reflowCases,
  noJsCases
};

await writeFile(path.join(evidenceRoot, 'order-11-audit-results.json'), `${JSON.stringify(summary, null, 2)}\n`);
socket.close();

console.log(JSON.stringify({
  assertions: summary.assertions,
  passed: summary.passed,
  failed: summary.failed,
  artifacts: summary.artifacts,
  evidence: path.join(evidenceRoot, 'order-11-audit-results.json'),
  failures: failures.map((failure) => failure.id)
}, null, 2));

if (failures.length) process.exitCode = 1;
