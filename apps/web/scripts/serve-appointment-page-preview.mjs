import { createAppointmentPagePreviewServer } from './lib/appointment-page-preview-server.mjs'

const server = await createAppointmentPagePreviewServer({ port: 3216 })
console.log(`B03-017 controlled Appointment preview: ${server.origin}`)
console.log('States: /, /validation, /pending, /known-failure, /unknown, /duplicate, /receipt, /delivery-warning, /workflow-unavailable, /long-content.')
try {
  await new Promise((resolve) => {
    process.once('SIGINT', resolve)
    process.once('SIGTERM', resolve)
  })
} finally {
  await server.close()
}
