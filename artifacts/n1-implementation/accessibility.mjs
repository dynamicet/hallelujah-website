import { Browser } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { writeFileSync } from 'node:fs';
const browser = await Browser.launch({ extraArgs: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage();
const results = [];
const routes = ['/', '/health-topics', '/health-topics/diabetes', '/doctors', '/services', '/appointment', '/news-resources', '/patients-visitors', '/emergency', '/feedback', '/referrals', '/doctors/synthetic-clinician-101010101010', '/services/synthetic-service-111111111111', '/news-resources/make-room-for-your-questions'];
try {
  for (const route of routes) for (const [mode, width] of [['reflow',320], ['text200',390], ['text200',1440], ['spacing',390], ['spacing',1440]]) {
    await page.setViewport({width,height:900,mobile:width<600});
    await page.goto('http://localhost:3000'+route,{settleMs:500});
    await page.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    if (mode === 'text200') await page.eval(() => { document.documentElement.style.fontSize = '200%'; });
    if (mode === 'spacing') await page.eval(() => { const s=document.createElement('style');s.textContent='* {line-height:1.5 !important;letter-spacing:.12em !important;word-spacing:.16em !important} p {margin-bottom:2em !important}';document.head.append(s); });
    await new Promise(resolve => setTimeout(resolve, 250));
    const checks = await page.eval(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      clipped: [...document.querySelectorAll('main *, header *, footer *')].filter(e => e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}) && !e.closest('svg,[aria-hidden="true"]') && getComputedStyle(e).clipPath === 'none' && [...e.childNodes].some(n => n.nodeType===3 && n.textContent.trim()) && !['INPUT','TEXTAREA','SELECT'].includes(e.tagName) && (e.scrollWidth > e.clientWidth+2 || e.scrollHeight > e.clientHeight+2) && ['hidden','clip'].includes(getComputedStyle(e).overflow)).map(e=>({text:e.textContent.trim().slice(0,100),class:e.className})),
      wide: [...document.querySelectorAll('main *,header *,footer *')].filter(e=>e.checkVisibility() && e.getBoundingClientRect().right>innerWidth+2 && e.getBoundingClientRect().width>0 && !e.closest('[data-partners]')).slice(0,8).map(e=>({tag:e.tagName,class:e.className,text:e.textContent.trim().slice(0,70)}))
    }));
    results.push({route,mode,width,...checks});
    if (checks.overflow || checks.clipped.length || (route==='/' && mode==='text200')) await page.screenshot({path:`artifacts/n1-implementation/${route.slice(1).replaceAll('/','-')||'home'}-${mode}-${width}.jpg`,fullPage:true});
    console.log(route,mode,width,checks.overflow,checks.clipped.length);
  }
  writeFileSync('artifacts/n1-implementation/accessibility.json',JSON.stringify(results,null,2));
} finally { await browser.close(); }
