import type { Access, CollectionConfig, PayloadRequest } from 'payload'
import { sql, type PostgresAdapter } from '@payloadcms/db-postgres'
import { loadServerEnvironment } from '../server/environment.ts'

export const cmsRoles = [
  'author', 'reviewer', 'publisher', 'medical', 'clinical', 'operations',
  'human-resources', 'content', 'privacy', 'legal', 'brand', 'accessibility', 'identity-manager',
] as const
export type CmsRole = typeof cmsRoles[number]
export type CmsActor = Readonly<{ id: string; roles: readonly CmsRole[] }>

export async function cmsActor(req: PayloadRequest): Promise<CmsActor | null> {
  if (req.user?.collection !== 'users' || loadServerEnvironment().deployment !== 'local') return null
  const user = await req.payload.findByID({
    collection: 'users', id: req.user.id, overrideAccess: true, depth: 0, req,
  }).catch(() => null)
  if (!user?.active || user.synthetic !== true || !Array.isArray(user.roles)
    || !user.roles.every((role: CmsRole) => cmsRoles.includes(role))) return null
  return { id: `cms:${user.id}`, roles: user.roles }
}

export async function lockCmsWrites(req: PayloadRequest) {
  const transactionId = await req.transactionID
  const adapter = req.payload.db as unknown as PostgresAdapter
  const transaction = transactionId && adapter.sessions?.[transactionId]?.db
  if (!transaction) throw new Error('Governed workflow writes require a PostgreSQL transaction')
  await transaction.execute(sql`SELECT pg_advisory_xact_lock(2002002)`)
}

export function roleAccess(...roles: CmsRole[]): Access {
  return async ({ req }) => {
    const actor = await cmsActor(req)
    return actor !== null && roles.some((role) => actor.roles.includes(role))
  }
}

const deny = () => false

export const cmsUsersCollection: CollectionConfig = {
  slug: 'users',
  auth: { tokenExpiration: 1800, maxLoginAttempts: 5, lockTime: 600000 },
  admin: { hidden: true },
  endpoints: false,
  graphQL: false,
  access: {
    admin: deny, create: deny, delete: deny,
    read: ({ req }) => req.user?.collection === 'users' ? { id: { equals: req.user.id } } : false,
    update: roleAccess('identity-manager'),
  },
  fields: [
    { name: 'synthetic', type: 'checkbox', required: true, defaultValue: true },
    { name: 'active', type: 'checkbox', required: true, defaultValue: true },
    { name: 'roles', type: 'select', hasMany: true, required: true, options: [...cmsRoles] },
  ],
  hooks: {
    beforeChange: [async ({ data, operation, originalDoc, req }) => {
      if (loadServerEnvironment().deployment !== 'local') throw new Error('CMS identities are local-only')
      const email = data.email ?? originalDoc?.email
      if (data.synthetic === false || originalDoc?.synthetic === false
        || !/^fixture-[a-z0-9-]+@cms\.invalid$/.test(email ?? '')) {
        throw new Error('Only visibly synthetic CMS identities are allowed')
      }
      if (operation === 'update') {
        const actor = await cmsActor(req)
        if (!actor?.roles.includes('identity-manager') || actor.id === `cms:${originalDoc?.id}`) {
          throw new Error('Identity changes require a separate identity manager')
        }
        await lockCmsWrites(req)
        if (!(await cmsActor(req))?.roles.includes('identity-manager')) {
          throw new Error('Identity manager authority is no longer active')
        }
        if (email !== originalDoc?.email) throw new Error('Synthetic identity email is immutable')
      } else if (req.user) {
        throw new Error('Synthetic identity provisioning is restricted to the trusted local seed')
      }
      return { ...data, synthetic: true }
    }],
    beforeLogin: [({ user }) => {
      if (loadServerEnvironment().deployment !== 'local' || !user.active || !user.synthetic) {
        throw new Error('Inactive or non-local CMS login is disabled')
      }
      return user
    }],
    beforeDelete: [() => { throw new Error('CMS identities must be deactivated, not deleted') }],
  },
}
