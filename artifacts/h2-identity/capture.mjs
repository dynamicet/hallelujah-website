import {Browser,sleep} from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs'
import {mkdirSync,writeFileSync} from 'node:fs'
const phase=process.argv[2]??'after',out=new URL(`./${phase}/`,import.meta.url).pathname;mkdirSync(out,{recursive:true});
const b=await Browser.launch({extraArgs:['--no-sandbox','--disable-dev-shm-usage']});const p=await b.newPage();const records=[];
try { for(const width of [1440,768,390]) {
 await p.setViewport({width,height:width===768?1024:width===390?844:900,mobile:width===390});
 for(const [name,route] of [['home','/'],['directory','/doctors'],['profile','/doctors/synthetic-clinician-101010101010/'],['appointment','/appointment?doctor=pub_101010101010']]) {
 await p.goto('http://localhost:3000'+route,{settleMs:1100,timeoutMs:12000});
 if(name==='home') {await p.eval(()=>document.querySelector('#team-title').scrollIntoView({behavior:'instant',block:'start'}));await sleep(1000)}
 if(name!=='home') {await p.eval(async()=>{for(const img of document.querySelectorAll('[data-clinician-portrait]')){if(img.checkVisibility()){img.scrollIntoView({behavior:'instant',block:'center'});await new Promise(r=>setTimeout(r,120))}}scrollTo({top:0,behavior:'instant'})});await sleep(400)}
 await p.screenshot({path:`${out}${name}-${width}.jpg`});
 if(name!=='home') await p.screenshot({path:`${out}${name}-${width}-full.jpg`,fullPage:true});
 records.push(await p.eval(({width,name,route})=>({width,name,route,overflow:document.documentElement.scrollWidth>innerWidth,identities:[...document.querySelectorAll('[data-clinician-portrait]')].map(el=>({src:el.getAttribute('src'),loaded:el.complete&&el.naturalWidth>0})),title:document.querySelector('h1')?.textContent}),{width,name,route}));console.log(phase,width,name)
 }
} writeFileSync(`${out}measurements.json`,JSON.stringify(records,null,2)+'\n') } finally {await b.close()}
