import { createClinicianProfilePreviewServer } from './lib/clinician-profile-preview-server.mjs'

const server = await createClinicianProfilePreviewServer({ port: 3218 })
console.log(`B04-009 controlled clinician-profile preview: ${server.origin}`)
console.log('States: /, /partial, /portrait-omitted, /long-content, /missing-related, /appointment-unavailable, /failure, /unapproved, /gone and /redirect.')
try {
  await new Promise((resolve) => {
    process.once('SIGINT', resolve)
    process.once('SIGTERM', resolve)
  })
} finally {
  await server.close()
}
