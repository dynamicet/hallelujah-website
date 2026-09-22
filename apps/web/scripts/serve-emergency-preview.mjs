import { createEmergencyPreviewServer } from './lib/emergency-preview-server.mjs'

const server = await createEmergencyPreviewServer({ port: 3215 })
console.log(`B03-008 controlled Emergency preview: ${server.origin}`)
console.log('States: / (controlled) and /long-content. All safety values are synthetic and inert.')
try {
  await new Promise((resolve) => {
    process.once('SIGINT', resolve)
    process.once('SIGTERM', resolve)
  })
} finally {
  await server.close()
}
