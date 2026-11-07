import { Browser, sleep } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const b=await Browser.launch({extraArgs:['--no-sandbox','--disable-dev-shm-usage']});
const p=await b.newPage(); const results=[];
const check=async(state,width,mode)=>{
 const data=await p.eval(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,dialogs:[...document.querySelectorAll('dialog[open],[data-help-panel]:popover-open')].map(e=>({width:e.clientWidth,scrollWidth:e.scrollWidth,height:e.clientHeight,scrollHeight:e.scrollHeight,overflow:getComputedStyle(e).overflowY})),clipped:[...document.querySelectorAll('main *,dialog[open] *')].filter(e=>e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})&&getComputedStyle(e).clipPath==='none'&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&['hidden','clip'].includes(getComputedStyle(e).overflow)&&(e.scrollWidth>e.clientWidth+2||e.scrollHeight>e.clientHeight+2)).map(e=>e.textContent.slice(0,80))}));
 results.push({state,width,mode,...data});
 await p.screenshot({path:`artifacts/n1-implementation/${state}-${width}-${mode}.jpg`,fullPage:!data.dialogs.length});
 assert.equal(data.overflow,false,`${state}/${width}/${mode}`);
 assert.equal(data.clipped.length,0,`${state}: ${data.clipped}`);
 for(const d of data.dialogs)assert.ok(d.scrollWidth<=d.width+1,`${state} dialog horizontal overflow`);
};
try{
for(const width of [390,768,1440])for(const mode of ['normal','text200']){
 await p.setViewport({width,height:900,mobile:width<600});
 await p.goto('http://localhost:3000/appointment',{settleMs:800});
 await p.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 if(mode==='text200')await p.eval(()=>document.documentElement.style.fontSize='200%');
 await p.eval(()=>document.querySelector('[data-journey-next]').click());await sleep(200);
 await p.eval(()=>document.querySelector('[data-journey-next]').click());await sleep(200);
 assert.equal(await p.eval(()=>!!document.querySelector('[aria-invalid="true"]')),true);
 await check('appointment-errors',width,mode);
 await p.eval(()=>{for(const [id,value]of [['full-name','Sample Visitor'],['phone','0911111111']]){const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));}document.getElementById('privacy-acknowledged').click();document.querySelector('[data-journey-next]').click();});await sleep(200);
 assert.equal(await p.eval(()=>document.querySelector('[data-journey-review]').hidden),false);
 await check('appointment-review',width,mode);
 await p.goto('http://localhost:3000',{settleMs:800});
 if(mode==='text200')await p.eval(()=>document.documentElement.style.fontSize='200%');
 await p.eval(()=>document.querySelector('[data-help-trigger]').click());await sleep(200);
 await check('help-menu',width,mode);
 await p.eval(()=>document.querySelector('[data-open-patient-guide]').click());await sleep(300);
 assert.equal(await p.eval(()=>document.querySelector('[data-patient-guide]').open),true);
 await check('patient-guide',width,mode);
 await p.eval(()=>document.querySelector('[data-patient-guide] [class*="topics"] button').click());await sleep(300);
 await check('patient-guide-answer',width,mode);
 await p.eval(()=>document.querySelector('[data-patient-guide]').close());
 await p.eval(()=>{document.querySelector('.visit-questions details').open=true;document.querySelector('.patient-story details').open=true;});
 await check('expanded-home',width,mode);
}
}finally{writeFileSync('artifacts/n1-implementation/states.json',JSON.stringify(results,null,2));await b.close();}
