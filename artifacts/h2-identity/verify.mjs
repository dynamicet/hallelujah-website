import assert from 'node:assert/strict'
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs'
import {Browser,sleep} from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs'
const data=JSON.parse(readFileSync(new URL('../../apps/web/src/demo/data.json',import.meta.url),'utf8'))
const doctors=data.clinicians
const registry=(await import('../../apps/web/src/demo/clinician-portraits.ts')).demoClinicianPortraits
assert.equal(new Set(Object.values(registry)).size,Object.keys(registry).length,'one distinct portrait per mapped identity')
for(const [id,src] of Object.entries(registry)) {assert.ok(doctors.some(d=>d.publicId===id));assert.ok(readFileSync(new URL('../../apps/web/public'+src,import.meta.url)).length>0)}
const out=new URL('./verification/',import.meta.url).pathname;mkdirSync(out,{recursive:true})
const b=await Browser.launch({extraArgs:['--no-sandbox','--disable-dev-shm-usage']});const p=await b.newPage();const results=[]
const go=route=>p.goto('http://localhost:3000'+route,{settleMs:700,timeoutMs:12000})
const waitFor=async selector=>{for(let n=0;n<80;n++){if(await p.eval(selector=>!!document.querySelector(selector),selector))return;await sleep(100)}throw new Error('Missing '+selector+' at '+await p.eval(()=>location.href))}
const key=async(key,code=key)=>{await p.send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:key==='Enter'?13:key==='Tab'?9:key===' '?32:undefined,text:key==='Enter'?'\r':key===' '?' ':undefined});await p.send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:key==='Enter'?13:key==='Tab'?9:key===' '?32:undefined})}
const identity=async selector=>p.eval(selector=>{const el=document.querySelector(selector);if(!el)return null;const img=el.querySelector('[data-clinician-portrait]');return {text:el.innerText,src:img?.getAttribute('src')??null,loaded:img?img.complete&&img.naturalWidth>0:null,initials:el.querySelector('[data-clinician-monogram]')?.textContent??null}},selector)
const check=(view,doctor)=>{assert.ok(view,doctor.publicId);assert.ok(view.text.includes(doctor.details.name));assert.ok(view.text.includes(doctor.details.specialties[0]));assert.equal(view.src,registry[doctor.publicId]??null);if(view.src)assert.equal(view.loaded,true);else assert.ok(view.initials)}
const choose=async(id)=>{await p.eval(id=>{const s=document.querySelector('#doctor-id');s.value=id;s.dispatchEvent(new Event('change',{bubbles:true}))},id);await sleep(200)}
const checkAppointment=async doctor=>{
 const cards=await p.eval(()=>[...document.querySelectorAll('[data-appointment-doctor-identity]')].map(el=>({id:el.dataset.clinicianIdentityId,hidden:el.hidden,text:el.innerText,src:el.querySelector('[data-clinician-portrait]')?.getAttribute('src')??null,initials:el.querySelector('[data-clinician-monogram]')?.textContent??null})))
 assert.equal(cards.length,3)
 for(const card of cards){assert.equal(card.id,doctor.publicId);assert.equal(card.hidden,false);assert.equal(card.src,registry[doctor.publicId]??null);assert.ok(card.text.includes(doctor.details.name));assert.ok(card.text.includes(doctor.details.specialties[0]));if(!card.src)assert.ok(card.initials)}
}
try {
 for(const width of [1440,768,390]) {
 await p.setViewport({width,height:width===768?1024:width===390?844:900,mobile:width===390})
 await go('/')
 for(const doctor of doctors.filter(d=>registry[d.publicId])) {
 await p.eval(id=>document.querySelector(`[data-clinician-identity-id="${id}"]`).scrollIntoView({behavior:"instant",block:"center"}),doctor.publicId);await sleep(300)
 const card=await identity(`[data-clinician-identity-id="${doctor.publicId}"]`);check(card,doctor)
 }
 await go('/doctors')
 assert.equal(await p.eval(()=>document.querySelectorAll('[data-clinician-public-id]').length),9)
 for(const doctor of doctors){await p.eval(id=>document.querySelector(`[data-clinician-public-id="${id}"]`).scrollIntoView({behavior:"instant",block:"center"}),doctor.publicId);await sleep(200);check(await identity(`[data-clinician-public-id="${doctor.publicId}"]`),doctor)}
 assert.equal(await p.eval(()=>document.documentElement.scrollWidth>innerWidth),false)
 // Every mapped portrait follows the identity into both profile and appointment.
 for(const doctor of doctors) {
 await go(doctor.canonicalPath)
 const card=await identity('[data-clinician-profile-template]');check(card,doctor)
 assert.equal(await p.eval(()=>document.documentElement.scrollWidth>innerWidth),false)
 const href=await p.eval(()=>document.querySelector('[data-clinician-profile-template] a[href^="/appointment"]').getAttribute('href'))
 assert.equal(new URL(href,'http://localhost').searchParams.get('doctor'),doctor.publicId)
 await go(href);await checkAppointment(doctor)
 console.log(width,doctor.publicId)
 results.push({width,id:doctor.publicId,src:registry[doctor.publicId]??null,home:!!registry[doctor.publicId],directory:true,profile:true,appointment:true})
 }
 // Use keyboard to enter the profile from filtered results and continue with the same doctor.
 await go('/doctors?q=Aster&type=synthetic-family')
 const profileLink=await p.eval(()=>document.querySelector('[data-clinician-public-id] a').getAttribute('href'))
 await p.eval(()=>document.querySelector('[data-clinician-public-id] a').focus());await key('Enter');await sleep(900)
 assert.ok((await p.eval(()=>location.pathname)).includes('101010101010'))
 const back=await p.eval(()=>[...document.querySelectorAll('a')].find(a=>a.textContent==='Back to doctor results').getAttribute('href'))
 assert.ok(back.includes('q=Aster'));assert.ok(back.includes('type=synthetic-family'))
 assert.ok(profileLink.includes('from='))
 await p.eval(()=>document.querySelector('[data-clinician-profile-template] a[href^="/appointment"]').focus());await key('Enter');await waitFor('#doctor-id');await sleep(300)
 assert.equal(await p.eval(()=>document.querySelector('#doctor-id').value),doctors[0].publicId)
 // Choice changes update selection, guidance and review together; absent portraits remain initials.
 for(const doctor of [doctors[1],doctors[8],doctors[0]]){await choose(doctor.publicId);await checkAppointment(doctor)}
 await p.eval(()=>document.querySelector('input[name="care_route"][value="service"]').click());await sleep(200)
 assert.equal(await p.eval(()=>[...document.querySelectorAll('[data-appointment-doctor-identity]')].every(el=>el.hidden)),true)
 await p.eval(()=>document.querySelector('input[name="care_route"][value="doctor"]').click());await sleep(200)
 assert.equal(await p.eval(()=>[...document.querySelectorAll('[data-appointment-doctor-identity]')].every(el=>el.hidden)),true,'cleared selector must not display stale doctor')
 await choose(doctors[1].publicId)
 await p.eval(()=>document.querySelector('[data-journey-next]').focus());await key('Enter');await sleep(400)
 for(const [id,value] of [['full-name','TEST PATIENT'],['phone','+0 000 000 0000']])await p.eval(({id,value})=>{const el=document.getElementById(id);el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}))},{id,value})
 await p.eval(()=>document.querySelector('#privacy-acknowledged').click())
 await p.eval(()=>document.querySelector('[data-journey-next]').focus());await key('Enter');await sleep(400)
 await checkAppointment(doctors[1]);assert.equal(await p.eval(()=>document.activeElement.id),'appointment-submit-title')
 assert.ok(await p.eval(()=>{const r=document.querySelector('#appointment-submit-title').getBoundingClientRect();return r.top>=document.querySelector('[data-site-header]').offsetHeight&&r.bottom<innerHeight}))
 await p.screenshot({path:`${out}review-${width}.jpg`})
 await p.eval(()=>document.querySelector('[data-journey-back]').focus());await key('Enter');await sleep(300)
 await checkAppointment(doctors[1]);assert.equal(await p.eval(()=>document.querySelector('#doctor-id').value),doctors[1].publicId)
 results.push({width,selectionChanges:true,serviceClearsIdentity:true,filteredReturn:true,keyboardProfileToAppointment:true,reviewAndBack:true,submitted:false})
 }
 // A failed asset keeps a recognizable fallback instead of a broken portrait.
 await go(doctors[0].canonicalPath)
 await p.eval(()=>document.querySelector('[data-clinician-portrait]').src='/editorial/clinicians/missing-preview-portrait.webp');await sleep(600)
 assert.ok(await p.eval(()=>document.querySelector('[data-clinician-monogram]')?.textContent));await p.screenshot({path:`${out}failed-portrait-fallback.jpg`})
 assert.equal(await p.eval(()=>document.querySelectorAll('[data-clinician-portrait]').length),0)
 results.push({failedAssetFallback:true})
 for(const state of ['failure','offline']){await go('/doctors?demo='+state);assert.equal(await p.eval(()=>document.querySelectorAll('[data-clinician-portrait]').length),0)}
 for(const state of ['failure','gone','unavailable']){await go(doctors[0].canonicalPath+'?demo='+state);assert.equal(await p.eval(()=>document.querySelectorAll('[data-clinician-portrait]').length),0)}
 results.push({unavailableStatesWithholdIdentity:true})
 await p.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
 for(const width of [1440,768,390]){
 await p.setViewport({width,height:width===768?1024:width===390?844:900,mobile:width===390});await go('/appointment?doctor='+doctors[0].publicId);await choose(doctors[1].publicId);await checkAppointment(doctors[1]);assert.equal(await p.eval(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);results.push({width,reducedMotionIdentityChange:true})
 }
 await p.send('Emulation.setScriptExecutionDisabled',{value:true})
 for(const route of ['/','/doctors',doctors[0].canonicalPath,'/appointment?doctor='+doctors[0].publicId]){
 await go(route);assert.equal(await p.eval(()=>document.documentElement.scrollWidth>innerWidth),false)
 assert.ok(await p.eval(()=>document.querySelectorAll('[data-clinician-portrait]').length>0));results.push({noJavaScript:true,route})
 }
 console.log(`Passed ${results.length} identity journey and fallback records; no appointment submitted.`)
} finally {writeFileSync(`${out}results.json`,JSON.stringify(results,null,2)+'\n');await b.close()}
