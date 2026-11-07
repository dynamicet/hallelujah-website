import assert from 'node:assert/strict'
import {setTimeout as delay} from 'node:timers/promises'
import {runVisualCheck} from './lib/visual-check.mjs'
const base=process.env.HH_PREVIEW_URL||'http://localhost:3000'
const pause=p=>p.eval('new Promise(r=>setTimeout(r,1000))')
await runVisualCheck('editorial-passage',base,async({browser,output})=>{
 for(const width of [390,768,1440]){
  const p=await browser.newPage({width,height:1000,mobile:width<600})
  await p.goto(base)
  assert.equal(await p.eval("document.querySelectorAll('.equipment-chapter-nav a').length"),3)
  for(const id of ['home-doctors','medical-technology','patient-testimonials']){
   await p.eval(`document.querySelector('#${id}').scrollIntoView({behavior:'instant'})`)
   await pause(p)
   await p.screenshot({path:`${output}/${id}-${width}.png`})
  }
  for(const id of ['c-arm','laboratory','dental']){
   await p.eval(`document.querySelector('.equipment-chapter-nav a[href="#equipment-${id}-scene"]').focus()`)
   await p.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'})
   await p.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13})
   await pause(p)
   assert.equal(await p.eval('document.activeElement.id'),`equipment-${id}-scene`)
   assert.equal(await p.eval("document.querySelector('.equipment-chapter-nav [aria-current]')?.hash"),`#equipment-${id}-scene`)
   assert.ok(await p.eval(`document.activeElement.getBoundingClientRect().top>=document.querySelector('[data-site-header]').getBoundingClientRect().bottom`))
   if(width>=900) assert.ok(await p.eval("document.activeElement.getBoundingClientRect().top>=document.querySelector('.equipment-chapter-nav').getBoundingClientRect().bottom"))
  }
  assert.equal(await p.eval('document.documentElement.scrollWidth>innerWidth'),false)
  await p.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
  await pause(p)
  assert.equal(await p.eval('document.getAnimations().length'),0)
  assert.deepEqual(p.consoleErrors,[])
  await p.close()
  console.log(`PASS ${width}: chapter keyboard navigation, active tracking, clearance, overflow, reduced motion`)
 }
 const p=await browser.newPage({width:1440,height:1000})
 await p.send('Emulation.setScriptExecutionDisabled',{value:true})
 await p.goto(base)
 assert.equal(await p.eval("document.querySelectorAll('.equipment-chapter-nav a[href]').length"),3)
 await p.eval("document.querySelector('.equipment-chapter-nav a:last-child').click()")
 await delay(1000)
 assert.equal(await p.eval('location.hash'),'#equipment-dental-scene')
 assert.ok(await p.eval("document.querySelector('#equipment-dental-scene').getBoundingClientRect().top>=document.querySelector('.equipment-chapter-nav').getBoundingClientRect().bottom"))
 await p.close()
 console.log('PASS native navigation without JavaScript')
})
