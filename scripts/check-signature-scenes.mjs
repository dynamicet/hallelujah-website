import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { runVisualCheck } from './lib/visual-check.mjs'

const baseUrl = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const pause = (page, ms) => page.eval(`new Promise(r=>setTimeout(r,${ms}))`)
const frames = [
  ['portrait', '[data-signature-frame="portrait"]', 'img'],
  ['story', '[data-signature-frame="story"]', 'img'],
]
async function position(page, selector, progress) {
  await page.eval(`(() => {
    const e=document.querySelector(${JSON.stringify(selector)}), box=e.getBoundingClientRect()
    scrollTo({top:scrollY + box.top - innerHeight + box.height * ${progress},behavior:'instant'})
  })()`)
  await pause(page, 900)
}
const state = (page, selector, child) => page.eval(`(() => {
  const frame=document.querySelector(${JSON.stringify(selector)}), e=frame.querySelector(${JSON.stringify(child)}),
    s=getComputedStyle(e), b=frame.getBoundingClientRect(), copy=frame.closest('article, a').querySelector('h3')
  return {name:s.animationName,timeline:s.animationTimeline,transform:s.transform,clip:s.clipPath,
    top:b.top+scrollY,width:b.width,height:b.height, y:scrollY, copyTop:copy.getBoundingClientRect().top+scrollY,
    progress:e.getAnimations().map(a=>a.effect.getComputedTiming().progress)}
})()`)

await runVisualCheck('signature-scenes',baseUrl,async({browser,output})=>{
  const records=[]
  for(const width of [390,768,1440]){
    const page=await browser.newPage({width,height:1000,mobile:width<600})
    await page.goto(baseUrl)
    const scenes=[]
    for(const [name,selector,child] of frames){
      await position(page,selector,.2)
      const early=await state(page,selector,child)
      await page.screenshot({path:`${output}/${name}-entry-${width}.png`})
      await position(page,selector,.65)
      const middle=await state(page,selector,child)
      await page.screenshot({path:`${output}/${name}-progress-${width}.png`})
      await pause(page,350)
      const stopped=await state(page,selector,child)
      assert.equal(middle.transform,stopped.transform,'image stays still when scrolling stops')
      assert.equal(middle.clip,stopped.clip)
      assert.equal(early.top,middle.top,'scene must not move document layout')
      assert.equal(early.height,middle.height)
      assert.equal(early.copyTop,middle.copyTop,'names and descriptions stay in place')
      await position(page,selector,1.2)
      const complete=await state(page,selector,child)
      if(width>=900 && name==='portrait'){
        // The horizontal specialist rail is the portrait's scroll container.
        // Its vertical timeline stays complete; portrait browsing has its own check.
        assert.equal(early.transform,middle.transform,'carousel portrait stays settled during vertical scrolling')
        assert.equal(middle.transform,complete.transform)
        assert.equal(early.clip,middle.clip,'carousel portrait keeps its complete crop')
        assert.equal(await page.eval(`new DOMMatrix(getComputedStyle(document.querySelector(${JSON.stringify(selector)}).querySelector('img')).transform).isIdentity`),true)
      }else if(width>=900){
        assert.ok(early.name.startsWith('signature-'),name+' uses an actual signature animation')
        assert.notEqual(early.transform,middle.transform,name+' responds to scroll progress')
        assert.notEqual(middle.transform,complete.transform)
        await position(page,selector,.2)
        const reverse=await state(page,selector,child)
        assert.equal(reverse.transform,early.transform,'reverse scroll restores the same visual state')
        assert.equal(reverse.clip,early.clip)
      }else{
        assert.equal(early.name,'none','compact screens retain the D2 entrance fallback')
        assert.equal(early.transform,'none')
        assert.equal(middle.transform,'none')
      }
      await page.eval(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({behavior:'instant',block:'center'})`)
      await pause(page,950)
      await page.screenshot({path:`${output}/${name}-settled-${width}.png`})
      scenes.push({name,early,middle,complete})
    }
    // Resolve media immediately when interacting with its associated content.
    await position(page,'[data-signature-frame="portrait"]',.4)
    await page.eval(`document.querySelector('.team-person').focus({preventScroll:true})`)
    const focused=await state(page,'[data-signature-frame="portrait"]','img')
    assert.equal(focused.name,'none')
    assert.equal(await page.eval(`document.activeElement.matches('.team-person:focus-visible')`),true)
    await page.eval('document.activeElement.blur()')
    if(width>=900){
      await page.setViewport({width:768,height:1000})
      await pause(page,100)
      assert.equal((await state(page,'[data-signature-frame="portrait"]','img')).name,'none')
      await page.setViewport({width,height:1000})
      await pause(page,100)
      assert.equal((await state(page,'[data-signature-frame="portrait"]','img')).name,'signature-portrait')
    }
    await page.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
    await pause(page,80)
    assert.equal(await page.eval('document.getAnimations().length'),0)
    for(const [,selector,child] of frames){
      const reduced=await state(page,selector,child)
      assert.equal(reduced.name,'none')
      assert.equal(reduced.transform,'none')
      assert.equal(reduced.clip,'none')
    }
    // Real keyboard activation of the two inter-section links.
    for(const target of ['home-doctors']){
      await page.eval(`document.querySelector('a.signature-link[href="#${target}"]').focus()`)
      await page.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'})
      await page.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13})
      await pause(page,150)
      assert.equal(await page.eval('location.hash'),'#'+target)
      assert.equal(await page.eval('document.activeElement.id'),target)
      assert.ok(await page.eval(`document.querySelector('#${target}').getBoundingClientRect().top >= document.querySelector('[data-site-header]').getBoundingClientRect().bottom`),'anchor clears sticky header')
    }
    assert.equal(await page.eval('document.documentElement.scrollWidth > innerWidth'),false)
    assert.deepEqual(page.consoleErrors,[])
    records.push({width,scenes})
    await writeFile(output+'/observations.json',JSON.stringify(records,null,2) + '\n')
    await page.close()
    console.log(`PASS ${width}px: scroll response/fallback, stop, reverse, stable geometry, focus, reduced motion and chapter links`)
  }
})
