import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { runVisualCheck } from './lib/visual-check.mjs'
const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
const key = async (p, key, code = key, num = 13) => {
 await p.send('Input.dispatchKeyEvent', {type:'keyDown',key,code,windowsVirtualKeyCode:num,...(key==='Enter'?{text:'\r'}:{})})
 await p.send('Input.dispatchKeyEvent', {type:'keyUp',key,code,windowsVirtualKeyCode:num})
}
const wait = async (p, expr) => {for(let i=0;i<100;i++){if(await p.eval(expr))return;await pause(100)}throw Error(expr)}
const activate = async (p, selector) => {await p.eval(`document.querySelector(${JSON.stringify(selector)}).focus()`);await key(p,'Enter')}
await runVisualCheck('help-refinement',base,async({browser,output})=>{
 const results=[]
 for(const [width,height] of [[390,844],[768,900],[1440,900],[320,700],[375,400],[844,390]]){
  const p=await browser.newPage({width,height,mobile:width<600,reducedMotion:true})
  for(const route of ['/','/doctors']){
   await p.goto(base+route)
   const visible=await p.eval(()=>{const t=document.querySelector('[data-help-trigger]');const r=t.getBoundingClientRect();return getComputedStyle(t).visibility==='visible'&&r.top>=0&&r.bottom<=innerHeight})
   assert.equal(visible,true,`${width} ${route}: Help visible naturally`)
  }
  await activate(p,'[data-help-trigger]')
  await wait(p,'document.querySelector("[data-help-panel]").matches(":popover-open")')
  await p.screenshot({path:`${output}/help-open-${width}x${height}.png`})
  const actions=await p.eval('document.querySelector("[data-help-panel] ul").children.length')
  assert.equal(actions,2)
  await key(p,'Escape','Escape',27)
  assert.equal(await p.eval('document.activeElement.hasAttribute("data-help-trigger")'),true)
  await key(p,'Enter')
  await activate(p,'[data-open-patient-guide]')
  await wait(p,'!!document.querySelector("[data-patient-guide][open]")')
  await p.screenshot({path:`${output}/guide-start-${width}x${height}.png`})
  const start=await p.eval(()=>{const d=document.querySelector('[data-patient-guide]');const t=d.querySelector('[aria-label="Choose a topic"]');const r=d.querySelector('[data-guide-transcript]').getBoundingClientRect();const i=d.querySelector('input').getBoundingClientRect();return {topicCount:t.children.length,topicsBottom:t.getBoundingClientRect().bottom,transcriptBottom:r.bottom,inputVisible:i.top>=0&&i.bottom<=innerHeight,overflow:document.documentElement.scrollWidth>innerWidth}})
  assert.equal(start.topicCount,4)
  assert.equal(start.inputVisible,true)
  assert.equal(start.overflow,false)
  if(height>=700)assert.ok(start.topicsBottom<=start.transcriptBottom+1,`${width}: all topics initially visible`)
  const replies=[]
  for(const text of ['hello visiting hours','hello visiting hours','qwertyxyz','appointment']){
   await p.eval('document.querySelector("[data-guide-input]").focus()')
   await p.send('Input.insertText',{text})
   await key(p,'Enter')
   await wait(p,`document.querySelectorAll('[data-guide-turn]').length===${replies.length+1}`)
   replies.push(await p.eval('document.querySelector("[data-patient-guide] [role=status]").textContent'))
  }
  assert.match(replies[0],/hours/i)
  assert.notEqual(replies[0],replies[1])
  assert.match(replies[2],/couldn.t match/i)
  assert.match(replies[3],/no request is sent/i)
  assert.equal(await p.eval('document.activeElement.hasAttribute("data-guide-input")'),true)
  await p.screenshot({path:`${output}/guide-replies-${width}x${height}.png`})
  await key(p,'Escape','Escape',27)
  assert.equal(await p.eval('document.activeElement.hasAttribute("data-help-trigger")'),true)
  await key(p,'Enter')
  await activate(p,'[data-open-patient-guide]')
  await wait(p,'!!document.querySelector("[data-patient-guide][open]")')
  assert.equal(await p.eval('document.querySelectorAll("[data-guide-turn]").length'),4)
  await activate(p,'[data-patient-guide] [class*=toolbar] button')
  assert.equal(await p.eval('document.querySelectorAll("[data-guide-turn]").length'),0)
  await key(p,'Escape','Escape',27)
  assert.deepEqual(p.consoleErrors,[])
  results.push({width,height,start,replies})
  await p.close()
  console.log(`PASS ${width}x${height}: natural Help access, two choices, keyboard/focus, four topics, matching, reset/reopen`)
 }
 // Reuse the page's own selected-care action rather than selecting from a directory.
 const p=await browser.newPage({width:1440,height:900,reducedMotion:false})
 for(const route of ['/doctors/synthetic-clinician-121212121212/','/services/synthetic-service-151515151515/']){
  await p.goto(base+route)
  const expected=await p.eval('document.querySelector("main a[href^=\\"/appointment?\\"]").getAttribute("href")')
  await activate(p,'[data-help-trigger]')
  await wait(p,`document.querySelector('[data-help-panel] a').getAttribute('href')===${JSON.stringify(expected)}`)
  assert.equal(await p.eval('document.documentElement.scrollWidth>innerWidth'),false)
 }
 assert.deepEqual(p.consoleErrors,[])
 await p.goto(base)
 await activate(p,'[data-care-guide]')
 await wait(p,'!!document.querySelector("[data-patient-guide][open]")')
 await activate(p,'[data-patient-guide] footer a')
 await wait(p,'location.pathname==="/emergency"')
 assert.equal(await p.eval('!!document.querySelector("[data-patient-guide][open]")'),false)
 await p.close()
 const pending=await browser.newPage({width:390,height:844,mobile:true,reducedMotion:true})
 await pending.goto(base)
 await activate(pending,'[data-help-trigger]')
 const held=[]
 const receive=browser.receive.bind(browser)
 browser.receive=message=>{
  receive(message)
  if(message.method==='Fetch.requestPaused' && message.sessionId===pending.sessionId)held.push(message.params.requestId)
 }
 await pending.send('Fetch.enable',{patterns:[{urlPattern:'*.js*',requestStage:'Request'}]})
 await activate(pending,'[data-open-patient-guide]')
 await wait(pending,'document.querySelector("[data-help-panel]").textContent.includes("Opening the Patient Guide")')
 await pending.screenshot({path:`${output}/guide-loading.png`})
 await key(pending,'Escape','Escape',27)
 assert.equal(await pending.eval('document.activeElement.hasAttribute("data-help-trigger")'),true)
 await Promise.all(held.map(requestId=>pending.send('Fetch.continueRequest',{requestId})))
 await pending.send('Fetch.disable')
 browser.receive=receive
 await pause(1000)
 assert.equal(await pending.eval('!!document.querySelector("[data-patient-guide][open]")'),false,'dismissed download must not open a late modal')
 await key(pending,'Enter')
 await activate(pending,'[data-open-patient-guide]')
 await wait(pending,'!!document.querySelector("[data-patient-guide][open]")')
 assert.deepEqual(pending.consoleErrors,[])
 await pending.close()
 console.log('PASS external guide entry, emergency navigation, loading feedback and cancellation')
 // Only post-hydration script requests are blocked, simulating a failed lazy download.
 const recovery=await browser.newPage({width:390,height:844,mobile:true,reducedMotion:true})
 await recovery.goto(base)
 await activate(recovery,'[data-help-trigger]')
 await recovery.send('Network.setBlockedURLs',{urls:['*.js*']})
 await activate(recovery,'[data-open-patient-guide]')
 await wait(recovery,'document.querySelector("[data-help-panel]").textContent.includes("could not open")')
 assert.equal(await recovery.eval('document.querySelector("[data-help-panel]").matches(":popover-open")'),true)
 await recovery.screenshot({path:`${output}/guide-error.png`})
 await recovery.send('Network.setBlockedURLs',{urls:[]})
 await activate(recovery,'[data-help-panel] [class*=retry]')
 await wait(recovery,'!!document.querySelector("[data-patient-guide][open]")')
 await key(recovery,'Escape','Escape',27)
 assert.equal(await recovery.eval('document.activeElement.hasAttribute("data-help-trigger")'),true)
 results.push({recovery:'passed',expectedBlockedDownloadErrors:recovery.consoleErrors})
 await recovery.close()
 console.log('PASS care-context links, normal motion, failed download and keyboard retry')
 await writeFile(`${output}/measurements.json`,JSON.stringify(results,null,2)+'\n')

})
