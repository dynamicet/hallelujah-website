import { createFoundationsPreviewServer } from '../apps/web/scripts/lib/foundations-preview-server.mjs'
import { createReviewHarnessServer } from './review-harness/server.mjs'

const specimens = await createFoundationsPreviewServer()
try {
  const harness = await createReviewHarnessServer({ upstreamOrigin: specimens.origin, port: 3213 })
  console.log(`B01-013 controlled component review: ${harness.origin}`)
  console.log('English and unreviewed Amharic shaping fixtures; loopback only; collection and providers disabled.')
  try {
    await new Promise((resolve) => {
      process.once('SIGINT', resolve)
      process.once('SIGTERM', resolve)
    })
  } finally {
    await harness.close()
  }
} finally {
  await specimens.close()
}
