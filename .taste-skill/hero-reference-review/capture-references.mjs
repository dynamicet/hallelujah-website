import { Browser } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs'
import { mkdir, writeFile } from 'node:fs/promises'
const dir = '.taste-skill/hero-reference-review/references'
await mkdir(dir, { recursive: true })
const browser = await Browser.launch()
const results = []
try {
  for (const [name, url] of [['sidra', 'https://www.sidra.org/'], ['mayo', 'https://www.mayoclinic.org/'], ['cleveland', 'https://www.clevelandclinicabudhabi.ae/en']]) {
    const page = await browser.newPage({ width: 1440, height: 900 })
    try {
      const navigation = await page.goto(url, { timeoutMs: 20000, settleMs: 2500 })
      await page.screenshot({ path: `${dir}/${name}-desktop.jpg` })
      const content = await page.eval(() => ({ title: document.title, url: location.href, headings: [...document.querySelectorAll('h1,h2')].slice(0,12).map(x=>x.innerText), firstScreen: document.body.innerText.slice(0,6500) }))
      results.push({ name, navigation, ...content })
      console.log(JSON.stringify({ name, title: content.title, headings: content.headings }))
    } catch (e) { results.push({ name, error: e.message }); console.log(name, e.message) }
    await page.close()
  }
} finally { await browser.close() }
await writeFile(`${dir}/observations.json`, JSON.stringify(results, null, 2))
