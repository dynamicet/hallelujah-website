import {Browser,sleep} from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import {writeFileSync} from 'node:fs';
const out='artifacts/h6-review/after';
const browser=await Browser.launch({extraArgs:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage();
const results=[];
const key=async(key,code=key)=>{const windowsVirtualKeyCode={Enter:13,Tab:9,Escape:27}[key];await page.send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode,...(key==='Enter'?{text:'\r'}:{})});await page.send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode});await sleep(150)};
const click=async(selector)=>{const r=await page.eval(s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}},selector);await page.send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...r});await page.send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...r});await sleep(250)};
const focus=()=>page.eval(()=>({tag:document.activeElement?.tagName,text:document.activeElement?.textContent?.trim().slice(0,90),label:document.activeElement?.getAttribute('aria-label'),menu:document.activeElement?.matches('[data-menu-trigger]'),help:document.activeElement?.matches('[data-help-trigger]')}));
try {
for(const [width,height] of [[320,740],[390,844],[768,1024],[844,390],[1440,900]]) {
 await page.setViewport({width,height,mobile:width<600});await page.goto('http://localhost:3000',{settleMs:1200});
 const prefix=`${width}x${height}`; const r={width,height};
 r.layout=await page.eval(()=>{const box=s=>{const e=document.querySelector(s),r=e?.getBoundingClientRect();return r?{x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom}:null};return {header:box('[data-site-header]'),topBar:box('[data-top-bar]'),main:box('main'),overflow:document.documentElement.scrollWidth-innerWidth,contacts:[...document.querySelectorAll('[data-contact-channel]')].map(e=>({text:e.textContent.trim(),disabled:e.getAttribute('aria-disabled'),height:e.getBoundingClientRect().height})),doctorLinks:[...document.querySelectorAll('[data-site-header] a')].filter(e=>e.getAttribute('href')?.startsWith('/doctors')).map(e=>({text:e.textContent,href:e.getAttribute('href')}))}});
 await page.screenshot({path:`${out}/${prefix}-initial.jpg`});
 if(width<1024){
  await page.eval(()=>document.querySelector('[data-menu-trigger]').focus());await key('Enter');
  r.menuOpen=await page.eval(()=>({open:document.querySelector('[data-navigation-panel]').matches(':popover-open'),expanded:document.querySelector('[data-menu-trigger]').getAttribute('aria-expanded'),triggerText:document.querySelector('[data-menu-trigger]').innerText,closeTarget:document.querySelector('[aria-label="Close navigation"]').getBoundingClientRect().height,panelHeight:document.querySelector('[data-navigation-panel]').clientHeight,scrollHeight:document.querySelector('[data-navigation-panel]').scrollHeight,links:[...document.querySelectorAll('[data-navigation-panel] a')].map(e=>({text:e.textContent,href:e.getAttribute('href')}))}));
  await page.screenshot({path:`${out}/${prefix}-menu.jpg`});await key('Tab');r.menuTabFocus=await focus();await key('Escape');r.menuEscape={closed:await page.eval(()=>!document.querySelector('[data-navigation-panel]').matches(':popover-open')),focus:await focus()};
  await click('[data-menu-trigger]');await click('[aria-label="Close navigation"]');r.menuCloseButtonFocus=await focus();await click('[data-menu-trigger]');await click('[data-menu-trigger]');r.menuToggleCloses=await page.eval(()=>!document.querySelector('[data-navigation-panel]').matches(':popover-open'));
 }
 await page.eval(()=>document.activeElement?.blur());await page.wheel(650);await sleep(350);r.scrollDown=await page.eval(()=>({y:scrollY,headerBottom:document.querySelector('[data-site-header]').getBoundingClientRect().bottom}));await page.wheel(-150);await sleep(350);r.scrollUp=await page.eval(()=>({y:scrollY,headerTop:document.querySelector('[data-site-header]').getBoundingClientRect().top}));
 await page.eval(()=>scrollTo(0,0));await sleep(350);
 await page.eval(()=>document.querySelector('[data-help-trigger]').focus());await key('Enter');r.helpOpen=await page.eval(()=>document.querySelector('[data-help-panel]').matches(':popover-open'));await page.screenshot({path:`${out}/${prefix}-help.jpg`});await key('Escape');r.helpEscape=await focus();
 await click('[data-help-trigger]');await click('[data-open-patient-guide]');r.guide=await page.eval(()=>{const d=document.querySelector('dialog[open]'),b=d?.getBoundingClientRect();return {open:!!d,box:b?{x:b.x,y:b.y,width:b.width,height:b.height}:null,text:d?.textContent.slice(0,1000)}});await page.screenshot({path:`${out}/${prefix}-guide.jpg`});
 r.guideInitialFocus=await focus();for(let i=0;i<16;i++)await key('Tab');r.guideFocusContained=await page.eval(()=>!!document.activeElement.closest('dialog[open]'));await key('Escape');r.guideEscape={closed:await page.eval(()=>!document.querySelector('dialog[open]')),focus:await focus()};
 r.errors=[...page.consoleErrors];results.push(r);writeFileSync(`${out}/results.json`,JSON.stringify(results,null,2));console.log(prefix,JSON.stringify(r));
}
await page.setViewport({width:390,height:844,mobile:true});await page.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await page.goto('http://localhost:3000');await page.wheel(650);await sleep(350);const reduced=await page.eval(()=>({y:scrollY,headerTop:document.querySelector('[data-site-header]').getBoundingClientRect().top,headerHeight:document.querySelector('[data-site-header]').offsetHeight}));writeFileSync(`${out}/reduced-motion.json`,JSON.stringify(reduced,null,2));
}finally{await browser.close()}
