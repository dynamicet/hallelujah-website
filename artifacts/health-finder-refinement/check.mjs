import { Browser, sleep } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const browser=await Browser.launch({extraArgs:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage();const checks=[];
const key=async()=>{await page.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});await page.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter'});await sleep(100)};
const action=async(text)=>{await page.eval(t=>[...document.querySelectorAll('[data-health-library] button')].find(e=>e.textContent===t).focus(),text);await key()};
const query=async(text)=>{await page.eval(()=>{const e=document.querySelector('#health-topic-search');e.focus();e.select()});await page.send('Input.insertText',{text});await sleep(150)};
const count=()=>page.eval(()=>document.querySelectorAll('[data-health-topic]').length);
const capture=async(name)=>{await page.eval(()=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,document.querySelector('[data-health-library]').getBoundingClientRect().top+scrollY-160)});await sleep(200);await page.screenshot({path:`artifacts/health-finder-refinement/${name}.jpg`})};
try{
for(const width of [320,390,768,1440])for(const route of ['/','/health-topics']){
 await page.setViewport({width,height:1000,mobile:width<600});await page.goto('http://localhost:3000'+route,{settleMs:600});
 assert.equal(await count(),0);
 assert.equal(await page.eval(()=>document.documentElement.scrollWidth<=innerWidth),true);
 if(route==='/')await capture(`initial-${width}`);
 await action('View all topics');assert.equal(await count(),6);
 if(route==='/')await capture(`results-${width}`);
 await action('Show more topics');assert.equal(await count(),12);
 assert.equal(await page.eval(()=>document.activeElement.dataset.healthTopic===document.querySelectorAll('[data-health-topic]')[6].dataset.healthTopic),true);
 await page.eval(()=>document.activeElement.click());await sleep(100);assert.equal(await page.eval(()=>document.activeElement.id),'health-topic-reader');
 await action('← Back to matches');assert.equal(await count(),12);assert.equal(await page.eval(()=>document.activeElement.hasAttribute('data-health-topic')),true);
 await action('Clear results');assert.equal(await count(),0);assert.equal(await page.eval(()=>document.activeElement.id),'health-topic-search');
 await query('blood sugar');assert.equal(await count(),1);assert.equal(await page.eval(()=>document.querySelector('[data-health-topic]').dataset.healthTopic),'diabetes');
 await page.eval(()=>document.querySelector('[aria-label="Topics beginning with A"]').focus());await key();assert.equal(await count(),2);assert.equal(await page.eval(()=>document.querySelector('#health-topic-search').value),'');
 await query('back pain');assert.equal(await count(),1);assert.equal(await page.eval(()=>document.querySelectorAll('[data-health-library] [aria-pressed="true"]').length),0);
 await query('zzunlisted');assert.equal(await count(),0);assert.equal(await page.eval(()=>document.querySelector('[data-health-library]').textContent.includes('No matching topics')),true);
 await action('View all topics');assert.equal(await count(),6);
 await action('Clear results');await query('   ');assert.equal(await count(),0);
 await action('View all topics');
 await page.eval(()=>document.documentElement.style.fontSize='200%');
 assert.equal(await page.eval(()=>document.documentElement.scrollWidth<=innerWidth),true,`200% overflow ${route} ${width}`);
 if(route==='/')await capture(`enlarged-${width}`);
 await page.eval(()=>document.documentElement.style.fontSize='');
 checks.push({width,route,initialHidden:true,inlineBatches:true,expansionFocus:true,readerReturn:true,searchAndLetters:true,emptyRecovery:true,reflow:true});
}
writeFileSync('artifacts/health-finder-refinement/checks.json',JSON.stringify(checks,null,2));console.log('Passed all eight viewport/route interaction scenarios.');
}finally{await browser.close()}
