import {mkdirSync,writeFileSync} from 'node:fs'
import assert from 'node:assert/strict'
const {Browser,sleep} = await import(process.env.CARE_REVIEW_BROWSER_DRIVER || (() => { throw new Error('Set CARE_REVIEW_BROWSER_DRIVER to design-taste-frontend/scripts/lib/cdp.mjs') })())
const phase=process.argv[2]||'after'
const out=`docs/visual-design/evidence/inner-pages/${phase}`
mkdirSync(out,{recursive:true})
const browser=await Browser.launch()
const page=await browser.newPage()
const origin='http://localhost:3000'
const routes=['/doctors','/services','/patients-visitors','/health-topics','/news-resources','/appointment','/emergency','/referrals','/feedback']
const detailRoutes=['/health-topics/diabetes']
for(const route of ['/doctors','/services','/health-topics','/news-resources']){
 await page.goto(origin+route,{settleMs:400})
 const link=await page.eval((prefix)=>[...document.querySelectorAll('main a[href]')].map(a=>a.getAttribute('href')).find(h=>h.startsWith(prefix+'/')),route)
 if(link)detailRoutes.push(link)
}
const checks=[]
for(const width of [1440,768,390,320]){
 await page.setViewport({width,height:900})
 for(const route of [...routes,...detailRoutes]){
  await page.goto(origin+route,{settleMs:400})
  await page.eval(()=>document.fonts.ready)
  await sleep(750)
  const name=route.split('?')[0].replaceAll('/','-').replace(/^-|-$/g,'')
  const result=await page.eval(()=>({title:document.querySelector('h1')?.textContent,overflow:document.documentElement.scrollWidth>innerWidth,headings:[...document.querySelectorAll('main h1,main h2')].map(h=>({text:h.textContent,size:getComputedStyle(h).fontSize})),brokenImages:[...document.querySelectorAll('main img')].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)}))
  checks.push({width,route,...result})
  if(width!==320)await page.screenshot({path:`${out}/${name}-${width}.jpg`})
 }
}
writeFileSync(`${out}/checks.json`,JSON.stringify(checks,null,2))
console.log(JSON.stringify({routes:[...routes,...detailRoutes],failures:checks.filter(c=>c.overflow||!c.title||c.brokenImages.length)}))
await browser.close()
assert.deepEqual(checks.filter(c=>c.overflow||!c.title||c.brokenImages.length), [], 'Every reviewed page must have a title, intact images and no horizontal overflow')
