import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import sharp from 'sharp'
import './lib/home-renderer.mjs'

const { CareSearch } = await import('../src/website/care-search.tsx')
const { CareSpotlight } = await import('../src/website/home-highlights.tsx')
const { featuredSpecialties, specialtyServiceExamples } = await import('../src/demo/specialties.ts')
const demoData = JSON.parse(await readFile(new URL('../src/demo/data.json', import.meta.url), 'utf8'))
const serviceExamples = [...demoData.services, ...specialtyServiceExamples]
assert.equal(new Set(serviceExamples.map((service) => service.publicId)).size, serviceExamples.length)
for (const specialty of featuredSpecialties) {
  const service = serviceExamples.find((entry) => entry.publicId === specialty.servicePublicId)
  assert.ok(service, `Missing care-page destination for ${specialty.label}`)
  assert.equal(service.canonicalPath, `/services/synthetic-service-${specialty.servicePublicId.slice(4)}/`)
  assert.equal(service.appointment.state, 'withheld')
}
const search = renderToStaticMarkup(createElement(CareSearch))
assert.match(search, /action="\/doctors" method="get"/u)
assert.match(search, /name="q"/u)
assert.match(search, /type="radio" name="care-mode" checked="" value="doctors"/u)
assert.match(search, /value="services"/u)
assert.match(search, /Ask the Patient Guide/u)
assert.match(search, /<noscript>[\s\S]*<form[^>]*action="\/services" method="get"/u)
assert.match(search, /href="\/doctors">View all doctors/u)
assert.match(search, /<button[^>]*type="button"[^>]*data-care-guide="true"[\s\S]*?Ask the Patient Guide[\s\S]*?<\/button>/u)
const spotlight = renderToStaticMarkup(createElement(CareSpotlight))
assert.equal((spotlight.match(/aria-pressed="true"/gu) ?? []).length, 1)
assert.equal((spotlight.match(/data-selected="true"/gu) ?? []).length, 1)
assert.equal((spotlight.match(/aria-pressed="false"/gu) ?? []).length, 2)
assert.match(spotlight, /<noscript>[\s\S]*General%20medicine[\s\S]*Heart%20medicine[\s\S]*Rehabilitation%20care/u)
assert.ok(!spotlight.includes('<video'))
for (const id of ['general', 'heart', 'recovery']) {
  for (const width of [640, 1100]) {
    for (const format of ['webp', 'avif']) {
      const metadata = await sharp(new URL(`../public/editorial/specialty-${id}-${width}.${format}`, import.meta.url).pathname).metadata()
      assert.equal(metadata.width, width)
      assert.equal(metadata.height, Math.round(width * .75))
    }
  }
}
console.log('Homepage enhancement passed: native doctor/service GET paths, no-JavaScript forms and service destinations, exclusive specialty selection, and responsive asset geometry.')
