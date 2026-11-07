import {Browser,sleep} from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import {mkdirSync,writeFileSync} from 'node:fs';
const phase=process.argv[2]||'before';const out=process.cwd()+'/artifacts/n3-review/'+phase;mkdirSync(out,{recursive:true});
const b=await Browser.launch();const p=await b.newPage();const results=[];
for(const width of [1440,768,390,320]){
await p.setViewport({width,height:900});await p.goto('http://localhost:3000',{settleMs:800});
await p.eval(()=>document.querySelector('#partners').scrollIntoView({block:'center',behavior:'instant'}));await sleep(500);await p.screenshot({path:out+'/partners-'+width+'.jpg'});
results.push({width,route:'/',...await p.eval(()=>({overflow:document.documentElement.scrollWidth>innerWidth,partners:[...document.querySelectorAll('.partner figcaption')].map(e=>e.textContent),links:[...document.querySelectorAll('main a')].map(e=>({text:e.textContent,href:e.getAttribute('href')}))}))});
}
for(const route of ['/services','/doctors','/services/synthetic-service-111111111111','/doctors/synthetic-clinician-101010101010','/news-resources','/patients-visitors','/feedback']){
await p.setViewport({width:390,height:844});await p.goto('http://localhost:3000'+route,{settleMs:500});await p.wheel(10000,{step:700,pauseMs:30});await p.screenshot({path:out+'/'+route.slice(1).replaceAll('/','-')+'.jpg',fullPage:true});results.push({route,...await p.eval(()=>({overflow:document.documentElement.scrollWidth>innerWidth,links:[...document.querySelectorAll('main a')].map(e=>({text:e.textContent,href:e.getAttribute('href')}))}))});
}
writeFileSync(out+'/results.json',JSON.stringify(results,null,2));await b.close();
