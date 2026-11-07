import {Browser,sleep} from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import {writeFileSync} from 'node:fs';
const b=await Browser.launch({extraArgs:['--no-sandbox','--disable-dev-shm-usage']});const p=await b.newPage();const results=[];
try{for(const [width,height] of [[568,320],[844,390]]){
 await p.setViewport({width,height});await p.goto('http://localhost:3000');await p.eval(()=>document.querySelector('[data-help-trigger]').click());await p.eval(()=>document.querySelector('[data-open-patient-guide]').click());
 await p.eval(()=>{const e=document.querySelector('[data-guide-input]');e.focus();Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,'visiting hours');e.dispatchEvent(new Event('input',{bubbles:true}))});await sleep(100);await p.eval(()=>document.querySelector('[aria-label="Send question"]').click());await sleep(300);
 const r={width,height,...await p.eval(()=>{const d=document.querySelector('[data-patient-guide]'),reply=document.querySelector('[data-guide-reply]');const box=reply?.getBoundingClientRect();return {turns:document.querySelectorAll('[data-guide-turn]').length,reply:reply?.textContent,replyVisible:!!box&&box.bottom>d.getBoundingClientRect().top&&box.top<d.getBoundingClientRect().bottom,dialogScroll:d.scrollTop,overflow:document.documentElement.scrollWidth-innerWidth}})};
 for(let i=0;i<16;i++){await p.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9,modifiers:8});await p.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9,modifiers:8})}
 r.backwardFocusContained=await p.eval(()=>!!document.activeElement.closest('dialog[open]'));await p.screenshot({path:`artifacts/h6-review/after/extra/${width}x${height}-final-reply.jpg`});
 if(r.turns!==1||!r.replyVisible||!r.backwardFocusContained||r.overflow)throw new Error(JSON.stringify(r));results.push(r);
}writeFileSync('artifacts/h6-review/after/extra/guide-check.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));}finally{await b.close()}
