import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  collections: [],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL ?? '',
    },
  }),
  graphQL: {
    disable: true,
  },
  secret: process.env.PAYLOAD_SECRET ?? '',
  telemetry: false,
  typescript: {
    outputFile: path.resolve(currentDirectory, 'payload-types.ts'),
  },
})
