import { Browser, sleep } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const browser=await Browser.launch({extraArgs:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage();const results=[];
const key=async(key,code=key)=>{await page.send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:{Enter:13,Tab:9}[key],...(key==='Enter'?{text:'\r'}:{})});await page.send('Input.dispatchKeyEvent',{type:'keyUp',key,code});await sleep(100)};
const query=async(text)=>{await page.eval(()=>{const e=document.querySelector('#health-topic-search');e.focus();e.select()});await page.send('Input.insertText',{text});await sleep(200)};
const count=()=>page.eval(()=>document.querySelectorAll('[data-health-topic]').length);
try{
for(const width of [390,768,1440])for(const route of ['/','/health-topics']){
 await page.setViewport({width,height:900,mobile:width<600});await page.goto('http://localhost:3000'+route,{settleMs:800});
 assert.equal(await count(),12);
 assert.equal(await page.eval(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.eval(()=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,document.querySelector('[data-health-library]').getBoundingClientRect().top+scrollY-120)});await sleep(1200);
 await page.screenshot({path:`artifacts/n1-implementation/${route==='/'?'home':'index'}-${width}.jpg`});
 await query('blood sugar');assert.equal(await count(),1);assert.equal(await page.eval(()=>document.querySelector('[data-health-topic]').dataset.healthTopic),'diabetes');
 await page.eval(()=>document.querySelector('[aria-label="Topics beginning with A"]').focus());await key('Enter');assert.equal(await count(),2);assert.equal(await page.eval(()=>document.querySelector('#health-topic-search').value),'');
 await query('back pain');assert.equal(await count(),1);assert.equal(await page.eval(()=>document.querySelectorAll('[data-health-library] [aria-pressed="true"]').length),0);
 await page.eval(()=>document.querySelector('[data-health-topic]').focus());await key('Enter');assert.equal(await page.eval(()=>document.activeElement.id),'health-topic-reader');
 assert.equal(await page.eval(()=>!!document.querySelector('#health-topic-reader a[href^="/health-topics/"]')),true);
 await page.eval(()=>document.querySelector('#health-topic-reader button').focus());await key('Enter');assert.equal(await page.eval(()=>document.activeElement.hasAttribute('data-health-topic')),true);
 await query('zzunlisted');assert.equal(await count(),0);assert.equal(await page.eval(()=>document.querySelector('[data-health-library]').textContent.includes('No matching topics')),true);
 assert.equal(await page.eval(()=>!!document.querySelector('[data-health-library] a[href="/appointment"]')),true);
 await page.eval(()=>[...document.querySelectorAll('[data-health-library] button')].find(e=>e.textContent==='All topics').focus());await key('Enter');assert.equal(await count(),12);assert.equal(await page.eval(()=>document.activeElement.id),'health-topic-search');
 await key('Tab');assert.equal(await page.eval(()=>document.activeElement.getAttribute('aria-label')),'Search health topics');
 await query('sleep');await page.eval(()=>document.querySelector('[data-health-topic]').click());await sleep(150);assert.equal(await page.eval(()=>document.querySelector('#health-topic-reader a[href="/appointment"]').textContent.includes('Help choosing care')),true);
 await page.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 assert.equal(await page.eval(()=>getComputedStyle(document.querySelector('#health-topic-reader')).animationName),'none');
 await page.send('Emulation.setEmulatedMedia',{features:[]});
 results.push({width,route,search:true,alias:true,letterKeyboard:true,mutualReset:true,empty:true,allTopics:true,focus:true,choiceFallback:true,reducedMotion:true,noOverflow:true});
}
for(const slug of ['diabetes','sleep-concerns']){
 await page.goto('http://localhost:3000/health-topics/'+slug,{settleMs:400});assert.equal(await page.eval(()=>!!document.querySelector('#prepare')),true);assert.equal(await page.eval(()=>document.body.textContent.includes('Not yet reviewed')),true);
}
for(const id of ['121212121212','131313131313','191919191919']){
 await page.goto('http://localhost:3000/services/synthetic-service-'+id,{settleMs:400});assert.equal(await page.eval(()=>!!document.querySelector('a[href*="appointment?service="]')),false);assert.equal(await page.eval(()=>!!document.querySelector('a[href="/patients-visitors#checklist"]')),true);
}
await page.goto('http://localhost:3000/appointment',{settleMs:500});assert.equal(await page.eval(()=>[...document.querySelectorAll('#service-id option')].some(e=>['pub_121212121212','pub_131313131313','pub_191919191919'].includes(e.value))),false);
writeFileSync('artifacts/n1-implementation/verification.json',JSON.stringify({results,detailRoutes:true,guideRoutes:true,appointmentExcludesGuides:true},null,2));console.log('Full H7 interaction matrix passed');
}finally{await browser.close()}
