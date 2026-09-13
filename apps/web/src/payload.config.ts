import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import { loadServerEnvironment } from './server/environment'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const environment = loadServerEnvironment()

export default buildConfig({
  collections: [],
  db: postgresAdapter({
    pool: {
      connectionString: environment.databaseUrl,
    },
  }),
  graphQL: {
    disable: true,
  },
  secret: environment.payloadSecret,
  telemetry: false,
  typescript: {
    outputFile: path.resolve(currentDirectory, 'payload-types.ts'),
  },
})
