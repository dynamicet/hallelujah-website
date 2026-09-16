import { withBuiltApplication } from './lib/built-application.mjs'
import { createReviewHarnessServer } from './review-harness/server.mjs'

await withBuiltApplication(async (upstreamOrigin) => {
  const harness = await createReviewHarnessServer({ upstreamOrigin, port: 3213 })
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
})
