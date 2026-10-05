import { createServiceDirectoryPreviewServer } from './lib/service-directory-preview-server.mjs'

const server = await createServiceDirectoryPreviewServer({ port: Number(process.env.PORT) || 3216 })
console.log(`B04-011 controlled service-directory preview: ${server.origin}`)

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, async () => {
    await server.close()
    process.exit(0)
  })
}
