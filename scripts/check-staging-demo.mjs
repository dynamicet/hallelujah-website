import assert from 'node:assert/strict'

const origin = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const routes = ['/', '/doctors', '/services', '/appointment', '/patients-visitors',
  '/emergency', '/about', '/feedback', '/referrals', '/health-topics', '/news-resources']

for (const route of routes) {
  const response = await fetch(new URL(route, origin), { signal: AbortSignal.timeout(15000) })
  assert.equal(response.status, 200, route)
  const html = await response.text()
  assert.match(html, /<main[\s>]/u, `${route}: public page rendered`)
  if (route === '/') assert.ok(html.includes('id="welcome-title"'), 'connected demo homepage rendered')
  console.log(`PASS ${route}`)
}

const health = await fetch(new URL('/health', origin))
assert.equal(health.status, 200)
assert.equal((await health.json()).status, 'ok')
for (const route of ['/doctors/unknown-doctor', '/services/unknown-service']) {
  assert.equal((await fetch(new URL(route, origin))).status, 404, route)
}
const submission = await fetch(new URL('/api/appointment-requests', origin), {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}',
})
assert.equal(submission.status, 503, 'real appointment collection remains disabled')
assert.deepEqual(await submission.json(), { status: 'unavailable' })
console.log('PASS health, unknown routes, and disabled appointment submission')
