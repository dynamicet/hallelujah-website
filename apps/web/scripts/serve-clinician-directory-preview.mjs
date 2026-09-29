import { createClinicianDirectoryPreviewServer } from './lib/clinician-directory-preview-server.mjs'

const server = await createClinicianDirectoryPreviewServer({ port: 3217 })
console.log(`B04-007 controlled clinician-directory preview: ${server.origin}`)
console.log('States: /, /long-content, /failure, /offline and /empty. All clinician values are synthetic.')
try {
  await new Promise((resolve) => {
    process.once('SIGINT', resolve)
    process.once('SIGTERM', resolve)
  })
} finally {
  await server.close()
}
