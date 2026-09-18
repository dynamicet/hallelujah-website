import { createHomePreviewServer } from './lib/home-preview-server.mjs'
import { homeContactFixtureStates } from './lib/home-contact-fixture.mjs'

const server = await createHomePreviewServer({ port: 3214 })
console.log(`B03-004/B03-005 controlled Home preview: ${server.origin}`)
console.log('States: /, /hero, /story, /media-failure, /long-labels. Hospital facts and publication remain withheld.')
console.log(`Synthetic contact states: ${homeContactFixtureStates.map(state => `/${state}`).join(', ')}. No call, email or map is active.`)
try {
  await new Promise((resolve) => {
    process.once('SIGINT', resolve)
    process.once('SIGTERM', resolve)
  })
} finally {
  await server.close()
}
