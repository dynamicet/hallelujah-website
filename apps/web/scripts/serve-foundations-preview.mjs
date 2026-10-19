import { createFoundationsPreviewServer } from './lib/foundations-preview-server.mjs'

const server = await createFoundationsPreviewServer({ port: Number(process.argv[2] ?? 3212) })
console.log(`Controlled component specimens: ${server.origin}`)
try {
  await new Promise(resolve => { process.once('SIGINT', resolve); process.once('SIGTERM', resolve) })
} finally {
  await server.close()
}
