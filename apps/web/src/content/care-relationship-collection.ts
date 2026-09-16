import {
  commitTransaction, createLocalReq, initTransaction, killTransaction,
  type CollectionConfig, type Payload, type PayloadRequest, type TypedUser,
} from 'payload'
import { cmsActor, lockCmsWrites, roleAccess, type CmsRole } from './cms-identity.ts'
import { canonical } from './cms-workflow.ts'
import {
  applyCareCommand, careDomains, careRelationship, checkedCareRecords, createCareRelationship, validateCareSet,
  type CareCommand, type CareRelationship,
} from './care-relationships.ts'
import { controlledCareGraph } from './care-relationship-view.ts'
import type { GovernedLocale, GovernedRecord } from './governed-record.ts'

async function liveIdentity(req: PayloadRequest, actor: string, role: CmsRole) {
  if (!/^cms:[1-9]\d*$/.test(actor)) throw new Error('Care approval identity is invalid')
  const user = await req.payload.findByID({ collection: 'users', id: Number(actor.slice(4)),
    overrideAccess: true, depth: 0, req }).catch(() => null)
  if (!user?.active || user.synthetic !== true || !user.roles.includes(role)) {
    throw new Error('Care approval identity is inactive or lacks its matching role')
  }
}
async function liveApprovals(req: PayloadRequest, link: CareRelationship, records: readonly GovernedRecord[]) {
  for (const domain of careDomains) {
    const review = link.reviews[domain]
    if (review) await liveIdentity(req, review.actor, domain)
  }
  if (link.approval) await liveIdentity(req, link.approval.actor, 'reviewer')
  for (const id of [link.definition.doctorPublicId, link.definition.servicePublicId, link.definition.locationPublicId]) {
    const record = records.find((entry) => entry.publicId === id)
    if (!record?.approval || !record.domainApproval) throw new Error('Care endpoint lacks persisted approval')
    await liveIdentity(req, record.approval.actor, 'reviewer')
    await liveIdentity(req, record.domainApproval.actor, record.domainApproval.domain as CmsRole)
  }
}
async function allRecords(req: PayloadRequest) {
  const result = await req.payload.find({ collection: 'governed-records',
    limit: 1000, pagination: false, overrideAccess: true, depth: 0, req })
  if (result.totalDocs > result.docs.length) throw new Error('Care validation requires complete endpoint set')
  return checkedCareRecords(result.docs.map((doc) => doc.record))
}
async function allLinks(req: PayloadRequest) {
  const result = await req.payload.find({ collection: 'care-relationships',
    limit: 1000, pagination: false, overrideAccess: true, depth: 0, req })
  if (result.totalDocs > result.docs.length) throw new Error('Care validation requires complete association set')
  return result.docs
}
const deny = () => false
export const careRelationshipsCollection: CollectionConfig = {
  slug: 'care-relationships', admin: { hidden: true },
  endpoints: false, graphQL: false, disableBulkDelete: true, disableBulkEdit: true, disableDuplicate: true,
  access: {
    admin: deny, delete: deny, create: roleAccess('author'),
    read: async ({ req }) => {
      const actor = await cmsActor(req)
      if (!actor) return false
      if (actor.roles.some((role) => ['reviewer', 'publisher', ...careDomains].includes(role))) return true
      return actor.roles.includes('author') ? { authorId: { equals: actor.id } } : false
    },
    update: roleAccess('author', 'reviewer', 'publisher', ...careDomains),
  },
  fields: [
    { name: 'publicId', type: 'text', required: true, unique: true, index: true },
    { name: 'authorId', type: 'text', required: true, admin: { readOnly: true }, index: true },
    { name: 'relationship', type: 'json', required: true, admin: { readOnly: true } },
    { name: 'definition', type: 'json', virtual: true },
    { name: 'command', type: 'json', virtual: true },
  ],
  hooks: {
    beforeChange: [async ({ data, operation, originalDoc, req }) => {
      if (!await cmsActor(req)) throw new Error('Care writes require active persisted CMS identity')
      await lockCmsWrites(req)
      const actor = await cmsActor(req)
      if (!actor) throw new Error('Care writes require active persisted CMS identity')
      const stored = operation === 'update' ? await req.payload.findByID({
        collection: 'care-relationships', id: originalDoc.id, overrideAccess: true, depth: 0, req,
      }) : undefined
      if (stored && (data.command as CareCommand)?.expectedRevision !== careRelationship(stored.relationship).revision) {
        throw new Error('Stale or missing care revision')
      }
      if (data.relationship !== undefined && canonical(data.relationship) !== canonical(stored?.relationship)
        || data.authorId !== undefined && data.authorId !== stored?.authorId
        || !stored && data.command !== undefined) throw new Error('Care workflow metadata cannot be supplied or changed')
      const records = await allRecords(req)
      const relationship = stored
        ? applyCareCommand(stored.relationship, data.definition, data.command as CareCommand, records, actor, new Date())
        : createCareRelationship(data.definition, records, actor, new Date())
      if (data.publicId !== undefined && data.publicId !== relationship.definition.publicId) {
        throw new Error('Care stored ID must match immutable relationship identity')
      }
      if (!['request-changes', 'withdraw'].includes((data.command as CareCommand)?.action)) {
        await liveApprovals(req, relationship, records)
      }
      const peers = (await allLinks(req)).filter((doc) => doc.id !== stored?.id).map((doc) => careRelationship(doc.relationship))
      validateCareSet([...peers, relationship])
      return { ...data, publicId: relationship.definition.publicId, authorId: relationship.author,
        relationship, definition: null, command: null }
    }],
    beforeDelete: [() => { throw new Error('Care relationships must be withdrawn, not deleted') }],
  },
}

/** Authenticated transaction-consistent internal read; identity revocations fail closed too. */
export async function cmsCareGraph(
  payload: Payload, user: TypedUser | undefined, locale: GovernedLocale, now: Date, mode?: 'controlled-fixture',
) {
  const req = await createLocalReq({ user }, payload)
  await initTransaction(req)
  try {
    const actor = await cmsActor(req)
    if (!actor?.roles.some((role) => ['reviewer', 'publisher', ...careDomains].includes(role))) {
      throw new Error('Care graph requires an authenticated review identity')
    }
    await lockCmsWrites(req)
    const currentActor = await cmsActor(req)
    if (!currentActor?.roles.some((role) => ['reviewer', 'publisher', ...careDomains].includes(role))) {
      throw new Error('Care graph identity is no longer active')
    }
    const records = await allRecords(req)
    const links: CareRelationship[] = []
    for (const doc of await allLinks(req)) {
      const link = careRelationship(doc.relationship)
      try {
        await liveApprovals(req, link, records)
        links.push(link)
      } catch { /* Revoked approvals cannot supply affiliations or handoff candidates. */ }
    }
    const graph = controlledCareGraph(records, links, locale, now, mode)
    await commitTransaction(req)
    return graph
  } catch (error) {
    await killTransaction(req)
    throw error
  }
}
