import assert from 'node:assert/strict';
import { Browser, sleep } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs';
const b=await Browser.launch();
try { for(const width of [1440,1024,900,768,600,390,320]) {
 const p=await b.newPage({width,height:900}); await p.goto('http://localhost:3000');
 assert.equal(await p.eval('document.documentElement.scrollWidth > innerWidth'),false,`overflow ${width}`);
 assert.equal(await p.eval("document.querySelectorAll('.team-person').length"),6);
 for(let i=0;i<2;i++) { await p.eval(i=>document.querySelectorAll('.patient-story summary')[i].focus(),i); await p.send('Page.bringToFront'); await p.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'}); await p.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13}); await sleep(100); assert.equal(await p.eval(i=>document.querySelectorAll('.patient-story details')[i].open,i),true); }
 const links=await p.eval(()=>[...document.querySelectorAll('.team-person,#news-resources article h3 a')].map(a=>a.href)); for(const url of links) assert.equal((await fetch(url)).status,200);
 await p.close(); console.log(`Passed overflow, content, story keyboard expansion and 9 destinations at ${width}`);
 }
 const p=await b.newPage({width:390,height:844,reducedMotion:true}); await p.send('Emulation.setScriptExecutionDisabled',{value:true}); await p.goto('http://localhost:3000'); assert.equal(await p.eval("document.querySelectorAll('.team-person,#news-resources article,.patient-story').length"),11); console.log('No-JavaScript collection content passed'); await p.close();
}finally{await b.close()}
