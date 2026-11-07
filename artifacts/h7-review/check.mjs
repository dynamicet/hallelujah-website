import { Browser, sleep } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const browser = await Browser.launch({extraArgs:['--no-sandbox','--disable-dev-shm-usage']});
const page = await browser.newPage();
const results=[];
try {
for (const width of [390,768,1440]) {
 await page.setViewport({width,height:900,mobile:width<600});
 await page.goto('http://localhost:3000/health-topics',{settleMs:1200});
 assert.equal(await page.eval(()=>document.querySelectorAll('[data-health-topic]').length),12);
 assert.equal(await page.eval(()=>document.querySelectorAll('[aria-label="Find topics by first letter"] button').length),26);
 await page.screenshot({path:`artifacts/h7-review/topics-${width}.jpg`});
 await page.eval(()=>document.querySelector('[aria-label="Topics beginning with A"]').click());await sleep(200);
 assert.equal(await page.eval(()=>document.querySelectorAll('[data-health-topic]').length),2);
 await page.eval(()=>document.querySelector('[data-health-topic]').click());await sleep(200);
 assert.equal(await page.eval(()=>document.activeElement.id),'health-topic-reader');
 await page.eval(()=>document.querySelector('#health-topic-reader button').click());await sleep(200);
 assert.equal(await page.eval(()=>document.activeElement.hasAttribute('data-health-topic')),true);
 results.push({width,allTopics:12,letters:26,letterA:2,focusRestored:true});
}
for(const id of ['121212121212','131313131313','191919191919']){
 await page.goto(`http://localhost:3000/services/synthetic-service-${id}`,{settleMs:500});
 assert.equal(await page.eval(()=>!!document.querySelector('a[href*="appointment?service="]')),false);
}
await page.goto('http://localhost:3000/services',{settleMs:500});
assert.equal(await page.eval(()=>!!document.querySelector('#visit-guides-title')),true);
writeFileSync('artifacts/h7-review/results.json',JSON.stringify(results,null,2));
console.log('H7 browser checks passed',results);
}finally{await browser.close()}
