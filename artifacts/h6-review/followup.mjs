import {Browser,sleep} from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import {writeFileSync} from 'node:fs';
const b=await Browser.launch({extraArgs:['--no-sandbox','--disable-dev-shm-usage']});const p=await b.newPage();const r={};
const esc=()=>p.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
try {
 await p.setViewport({width:844,height:390});await p.goto('http://localhost:3000');
 await p.eval(()=>document.querySelector('[data-menu-trigger]').click());
 await p.eval(()=>{const a=[...document.querySelectorAll('[data-navigation-panel] a')].at(-1);a.focus();a.scrollIntoView({block:'nearest'})});
 r.landscapeLastLink=await p.eval(()=>{const a=document.activeElement,r=a.getBoundingClientRect();return {text:a.textContent,y:r.y,bottom:r.bottom,inViewport:r.top>=0&&r.bottom<=innerHeight}});await p.screenshot({path:'artifacts/h6-review/landscape-menu-last-link.jpg'});await esc();
 await p.eval(()=>document.querySelector('[data-help-trigger]').click());await p.eval(()=>document.querySelector('[data-open-patient-guide]').click());
 await p.eval(()=>{const d=document.querySelector('[data-patient-guide]');const x=[...d.querySelectorAll('button')].find(e=>e.textContent.includes('Contact &'));x.focus();x.scrollIntoView({block:'nearest'})});
 r.landscapeTopic=await p.eval(()=>{const r=document.activeElement.getBoundingClientRect();return {text:document.activeElement.textContent,y:r.y,bottom:r.bottom,inViewport:r.top>=0&&r.bottom<=innerHeight}});await p.screenshot({path:'artifacts/h6-review/landscape-guide-topic.jpg'});
 await p.eval(()=>document.querySelector('[aria-label="Close patient guide"]').click());await sleep(100);r.guideCloseButton=await p.eval(()=>({closed:!document.querySelector('dialog[open]'),focusReturned:document.activeElement.matches('[data-help-trigger]')}));
 await p.setViewport({width:390,height:844,mobile:true});await p.goto('http://localhost:3000');
 await p.eval(()=>document.querySelector('[data-help-trigger]').click());await p.eval(()=>document.querySelector('[aria-label="Close help options"]').click());r.helpCloseButton=await p.eval(()=>({closed:!document.querySelector('[data-help-panel]').matches(':popover-open'),focusReturned:document.activeElement.matches('[data-help-trigger]')}));
 await p.goto('http://localhost:3000/doctors');r.directory=await p.eval(()=>({title:document.querySelector('h1')?.textContent,searchY:document.querySelector('#directory-search-title').getBoundingClientRect().top}));await p.screenshot({path:'artifacts/h6-review/doctor-directory-390.jpg'});
 await p.goto('http://localhost:3000/doctors#directory-search-title');r.directoryAnchor=await p.eval(()=>({scrollY,searchY:document.querySelector('#directory-search-title').getBoundingClientRect().top}));
 writeFileSync('artifacts/h6-review/followup.json',JSON.stringify(r,null,2));console.log(JSON.stringify(r));
}finally{await b.close()}
