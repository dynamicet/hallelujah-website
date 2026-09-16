import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import { governedRecordsCollection } from './content/governed-collection.ts'
import { careRelationshipsCollection } from './content/care-relationship-collection.ts'
import { cmsUsersCollection } from './content/cms-identity.ts'
import { loadServerEnvironment } from './server/environment.ts'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const environment = loadServerEnvironment()

export default buildConfig({
  collections: [cmsUsersCollection, governedRecordsCollection, careRelationshipsCollection],
  db: postgresAdapter({
    pool: {
      connectionString: environment.databaseUrl,
    },
  }),
  graphQL: {
    disable: true,
  },
  email: () => ({
    name: 'disabled-controlled-cms',
    defaultFromAddress: 'fixture-system@cms.invalid',
    defaultFromName: 'Synthetic CMS',
    sendEmail: async () => { throw new Error('CMS email delivery remains disabled') },
  }),
  secret: environment.payloadSecret,
  telemetry: false,
  typescript: {
    outputFile: path.resolve(currentDirectory, 'payload-types.ts'),
  },
})
