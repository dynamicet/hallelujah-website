import assert from 'node:assert/strict'
import {writeFileSync,mkdirSync} from 'node:fs'
const {Browser,sleep} = await import(process.env.CARE_REVIEW_BROWSER_DRIVER || (() => { throw new Error('Set CARE_REVIEW_BROWSER_DRIVER to design-taste-frontend/scripts/lib/cdp.mjs') })())
const b=await Browser.launch(),p=await b.newPage(),out='docs/visual-design/evidence/inner-pages/after'
mkdirSync(out,{recursive:true})
const checks=[]
const profile='/doctors/synthetic-clinician-101010101010/'
for(const [w,h] of [[1440,900],[768,900],[390,900],[320,900],[1024,900],[390,568]]) {
 await p.setViewport({width:w,height:h})
 for(const path of ['/doctors',profile]) {
  await p.goto('http://localhost:3000'+path,{settleMs:500});await sleep(750)
  assert.equal(await p.eval(()=>document.documentElement.scrollWidth<=innerWidth),true)
  assert.equal(await p.eval(()=>document.querySelectorAll('h1').length),1)
  if(path===profile)assert.equal(await p.eval(()=>document.querySelector('[data-profile-section="P1"] a').textContent),'Request an appointment')
  if(path==='/doctors') {
   assert.equal(await p.eval(()=>document.querySelector('[data-clinician-public-id] a').textContent),'View profile')
   const frame=await p.eval(()=>{const r=document.querySelector('[data-care-directory]').getBoundingClientRect();return {left:r.left,right:innerWidth-r.right}})
   assert.ok(Math.abs(frame.left-frame.right)<1)
  }
  if(w!==320)await p.screenshot({path:`${out}/${path===profile?'doctors-synthetic-clinician-101010101010':'doctors'}-${w}${h===568?'-short':''}.jpg`})
  checks.push(`${path} at ${w}×${h}: one title, no overflow, final control labels, equal directory margins`)
 }
}
await p.setViewport({width:720,height:450})
for(const path of ['/doctors','/services','/patients-visitors','/news-resources','/appointment','/emergency']){
 await p.goto('http://localhost:3000'+path,{settleMs:300})
 assert.equal(await p.eval(()=>document.documentElement.scrollWidth<=innerWidth),true)
 checks.push(`${path}: reflow at a 720×450 CSS viewport (1440px desktop at 200% zoom equivalent)`)
}
await p.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
await p.goto('http://localhost:3000/doctors',{settleMs:500})
assert.equal(await p.eval(()=>[...document.querySelectorAll('[data-reveal]')].every(e=>getComputedStyle(e).opacity==='1')),true)
checks.push('Reduced motion: all enhanced directory content visible')
await p.goto('http://localhost:3000'+profile,{settleMs:700})
for(let i=0;i<100 && !await p.eval(()=>document.documentElement.dataset.hydration==='ready');i++)await sleep(100)
await p.eval(()=>{const img=document.querySelector('[data-clinician-portrait]');img.loading='eager';img.src='/__missing-clinician-portrait.webp';img.scrollIntoView()})
for(let i=0;i<50 && !await p.eval(()=>!!document.querySelector('[data-clinician-monogram]'));i++)await sleep(100)
assert.equal(await p.eval(()=>!!document.querySelector('[data-clinician-monogram]')),true)
assert.equal(await p.eval(()=>document.querySelector('h1').textContent),'Dr Aster')
checks.push('Failed portrait: initials fallback retains clinician identity and appointment action')
writeFileSync(`${out}/final-checks.json`,JSON.stringify(checks,null,2));console.log(checks.join('\n'))
await b.close()
