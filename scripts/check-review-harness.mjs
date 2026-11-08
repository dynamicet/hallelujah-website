import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { collectFilesUnder, repositoryRoot } from './lib/repository-files.mjs'
import { reviewGroups, standaloneReviews } from './review-harness/manifest.mjs'
import { createReviewHarnessServer, prepareReviewDocument } from './review-harness/server.mjs'
import { experienceAreas, protectedExperienceContexts, resolveExperienceLevel } from '../apps/web/src/design-system/contracts/experience.ts'
import { reviewRequestIsAllowed } from './review-harness/check-browser.mjs'

const appRoot = path.join(repositoryRoot, 'apps/web')
const componentFiles = await collectFilesUnder(path.join(appRoot, 'src/design-system/components'), (file) => file.endsWith('.tsx'))
const inventoried = new Set([...reviewGroups, ...standaloneReviews].flatMap((group) => group.components))
for (const url of ['https://example.invalid/', 'http://127.0.0.1:2/', 'http://127.0.0.1:1.example.invalid/', 'http://127.0.0.1:1@external.invalid/', 'file:///private', 'blob:http://127.0.0.1:1/value', 'data:text/html,CONTROLLED', 'about:config']) {
  assert.equal(reviewRequestIsAllowed(url, 'http://127.0.0.1:1'), false)
}
assert.equal(reviewRequestIsAllowed('http://127.0.0.1:1/motion-media.js', 'http://127.0.0.1:1'), true)
assert.equal(reviewRequestIsAllowed('data:image/svg+xml,CONTROLLED', 'http://127.0.0.1:1'), true)
assert.equal(reviewRequestIsAllowed('about:blank', 'http://127.0.0.1:1'), true)
for (const area of experienceAreas) {
  for (const context of protectedExperienceContexts) {
    for (const level of [0, 1, 2, 3]) assert.equal(resolveExperienceLevel(area, level, context), 0)
  }
}
for (const review of standaloneReviews) await readFile(path.join(repositoryRoot, review.check), 'utf8')
for (const file of componentFiles) {
  const source = await readFile(file, 'utf8')
  for (const match of source.matchAll(/export function ([A-Z]\w*)\(/gu)) {
    assert(inventoried.has(match[1]), `review inventory omits ${match[1]}`)
  }
}
for (const root of ['src', 'public']) {
  const files = await collectFilesUnder(path.join(appRoot, root), (file) => /\.(?:tsx?|js|css)$/u.test(file))
  for (const file of files) {
    assert(!/review-harness|data-review-shaping/u.test(await readFile(file, 'utf8')), `review tool leaked into application: ${path.relative(appRoot, file)}`)
  }
}
assert(!/review-harness/u.test(await readFile(path.join(appRoot, 'next.config.ts'), 'utf8')), 'review tool leaked into Next configuration')

const fixture = '<!doctype html><html lang="en"><head><title>Local</title></head><body><main><h1>Controlled specimen</h1><label for="note">Controlled note</label><textarea id="note">Keep literal value</textarea><script>self.__next_f.push([1,"flight"])</script><script src="/_next/static/test.js"></script><script defer src="/motion-media.js"></script></main></body></html>'
const shaped = prepareReviewDocument(fixture, 'am')
assert(shaped.includes('data-review-shaping'))
assert(shaped.includes('<textarea id="note">Keep literal value</textarea>'))
assert(!shaped.includes('__next_f') && !shaped.includes('/_next/static/test.js'))
assert(shaped.includes('<script defer src="/motion-media.js"></script>'))
assert.throws(() => prepareReviewDocument(fixture, 'unknown'))
await assert.rejects(createReviewHarnessServer({ upstreamOrigin: 'http://example.invalid' }))
let upstreamRequests = 0
const upstream = createServer((request, response) => {
  upstreamRequests += 1
  response.writeHead(200, { 'Content-Type': request.url.endsWith('.js') ? 'text/javascript' : 'text/html' })
  response.end(request.url.endsWith('.js') ? '/* bounded fixture */' : fixture)
})
await new Promise((resolve) => upstream.listen(0, '127.0.0.1', resolve))
const harness = await createReviewHarnessServer({ upstreamOrigin: `http://127.0.0.1:${upstream.address().port}` })
try {
  for (const [route, status, method] of [
    ['/controlled-form-submission-disabled', 405, 'POST'],
    ['/admin', 404, 'GET'], ['/api/governed-records', 404, 'GET'],
    ['/?review-language=unknown', 400, 'GET'], ['/?review-language=am&review-language=en', 400, 'GET'],
    ['/?unexpected=CONTROLLED', 400, 'GET'], ['/?q=' + 'x'.repeat(81), 400, 'GET'],
    ['//example.invalid/', 404, 'GET'], ['/%2e%2e/private', 404, 'GET'],
  ]) {
    const response = await fetch(harness.origin + route, { method })
    assert.equal(response.status, status, `unexpected access to ${route}`)
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow, noarchive')
    assert.equal(response.headers.get('cache-control'), 'no-store')
  }
  assert.equal(upstreamRequests, 0, 'denied routes must never contact the upstream')
  const response = await fetch(harness.origin + '/?review-language=am')
  assert.equal(response.status, 200)
  assert((await response.text()).includes('data-review-language="am"'))
  const report = await (await fetch(harness.origin + '/review-report.json')).json()
  assert.equal(report.activatedMedia.initialVideoBytes, 0)
  assert.equal(report.samples.am.externalOrigins, 0)
} finally {
  await harness.close()
  await new Promise((resolve) => { upstream.close(resolve); upstream.closeAllConnections() })
}
console.log(`Review harness contract passed (${inventoried.size} components inventoried; production exclusion, literal input preservation, loopback-only routing, denied collection and bounded URL state).`)
