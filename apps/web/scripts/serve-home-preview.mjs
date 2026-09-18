import { createHomePreviewServer } from './lib/home-preview-server.mjs'

const server = await createHomePreviewServer({ port: 3214 })
console.log(`B03-004 controlled Home preview: ${server.origin}`)
console.log('States: /, /hero, /story, /media-failure, /long-labels. Hospital facts and publication remain withheld.')
try {
  await new Promise((resolve) => {
    process.once('SIGINT', resolve)
    process.once('SIGTERM', resolve)
  })
} finally {
  await server.close()
}
