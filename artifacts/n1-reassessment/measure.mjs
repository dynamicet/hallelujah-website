import { Browser } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
const out = 'artifacts/n1-reassessment';
mkdirSync(out, { recursive: true });
const browser = await Browser.launch({ extraArgs: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage();
const results = [];
try {
  for (const route of ['/', '/health-topics', '/health-topics/diabetes', '/doctors', '/services', '/appointment', '/news-resources', '/patients-visitors']) {
    for (const width of [390, 768, 1440]) {
      await page.setViewport({ width, height: 900, mobile: width === 390 });
      await page.goto('http://localhost:3000' + route, { settleMs: 900 });
      await page.eval(() => document.fonts.ready.then(() => true));
      const data = await page.eval(() => {
        const texts = [...document.querySelectorAll('body *')].filter(e => !e.closest('nextjs-portal,script,style,svg') && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })).map(e => {
          const s = getComputedStyle(e), r = e.getBoundingClientRect();
          return { tag: e.tagName, class: e.className, text: e.textContent.trim().slice(0, 180), size: parseFloat(s.fontSize), lineHeight: s.lineHeight, color: s.color, background: s.backgroundColor, font: s.fontFamily, width: Math.round(r.width) };
        });
        return { title: document.title, overflow: document.documentElement.scrollWidth > innerWidth, sizes: [...new Set(texts.map(t => t.size))].sort((a,b) => a-b), small: texts.filter(t => t.size < 16), headings: texts.filter(t => /^H[1-6]$/.test(t.tag)), texts };
      });
      results.push({ route, width, ...data });
      if (route !== '/') await page.screenshot({ path: `${out}/${route.slice(1).replaceAll('/', '-')}-${width}.jpg`, fullPage: true });
      console.log(route, width, data.sizes.join(','), 'small:', data.small.length, 'overflow:', data.overflow);
    }
  }
  writeFileSync(`${out}/measurements.json`, JSON.stringify(results, null, 2));
} finally { await browser.close(); }
