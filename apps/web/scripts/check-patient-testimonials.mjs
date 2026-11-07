import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import sharp from 'sharp'

// Use the existing isolated TypeScript renderer; no application route is mounted.
import './lib/home-renderer.mjs'

const { PatientTestimonials } = await import('../src/website/patient-testimonials.tsx')
const { patientStories } = await import('../src/demo/patient-stories.ts')
const render = (stories, preview = false) => renderToStaticMarkup(createElement(PatientTestimonials, { stories, preview }))
const first = patientStories[0]

assert.equal(render([]), '')
assert.equal(render([{ ...first, status: 'withdrawn' }]), '')
assert.equal(render([{ ...first, photograph: { ...first.photograph, src: '' } }]), '')
assert.equal(render([{ ...first, account: [' '] }]), '')
assert.equal(render([{ ...first, quote: ' ' }]), '')
const html = render(patientStories, true)
assert.equal((html.match(/<article\b/gu) ?? []).length, 2)
assert.equal((html.match(/<img\b/gu) ?? []).length, 2)
assert.equal((html.match(/<details\b/gu) ?? []).length, 6)
assert.match(html, /stories and AI-generated images are fictional/u)
assert.equal((html.match(/<video\b/gu) ?? []).length, 2)
assert.equal((html.match(/<track\b/gu) ?? []).length, 2)
assert.ok(!render(patientStories.map((story) => ({ ...story, video: undefined }))).includes('<video'))
assert.ok(!render(patientStories).includes('patient-stories-notice'))
assert.ok(!render([{ ...first, status: 'withdrawn' }, patientStories[1]]).includes(first.photograph.src))
assert.ok(render([{ ...first, quote: '<script>unsafe</script>' }]).includes('&lt;script&gt;unsafe&lt;/script&gt;'))

const video = {
  src: '/fixtures/b01-012-abstract-motion.webm',
  captionsSrc: '/fixtures/b01-012-abstract-motion.vtt',
  language: 'en', captionsLabel: 'English',
  transcript: ['Synthetic media test transcript.'],
}
const withVideo = render([{ ...first, video }])
assert.match(withVideo, /<video[^>]*controls=""[^>]*preload="none"/u)
assert.match(withVideo, /<track[^>]*kind="captions"[^>]*srcLang="en"/u)
assert.match(withVideo, /Read the video transcript/u)
assert.match(withVideo, /Synthetic media test transcript/u)
assert.ok(!/autoplay|<iframe/u.test(withVideo))
for (const incomplete of [{ ...video, captionsSrc: '' }, { ...video, transcript: [] }]) {
  const result = render([{ ...first, video: incomplete }])
  assert.ok(!result.includes('<video'))
  assert.ok(result.includes(first.title))
}
for (const story of patientStories) {
  const asset = new URL(`../public${story.photograph.src}`, import.meta.url)
  const metadata = await sharp(asset.pathname).metadata()
  assert.equal(metadata.width, story.photograph.width)
  assert.equal(metadata.height, story.photograph.height)
}
console.log('Patient testimonials passed: required photographs, omission, withdrawal, written stories, escaping, accessible optional video, and preview assets.')
