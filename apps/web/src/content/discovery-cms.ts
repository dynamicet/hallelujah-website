import { commitTransaction, createLocalReq, initTransaction, killTransaction, type Payload, type TypedUser } from 'payload'
import { cmsActor, lockCmsWrites, type CmsRole } from './cms-identity.ts'
import { requiredDomains, type CmsWorkflow, type WorkflowDocument } from './cms-workflow.ts'
import { validateGovernedRecord } from './governed-record.ts'
import { controlledDiscoveryCache } from './discovery-cache.ts'

/** Fresh locked reads validate live roles even when the projection cache has an entry. */
export async function cmsDiscovery(payload: Payload, user: TypedUser | undefined, origin: string, now: Date, mode?: 'controlled-fixture') {
  const req = await createLocalReq({ user }, payload)
  await initTransaction(req)
  try {
    const allowed = ['reviewer', 'publisher', 'content', 'operations', 'medical', 'clinical', 'privacy', 'legal', 'accessibility']
    if (!(await cmsActor(req))?.roles.some((role) => allowed.includes(role))) throw new Error('Discovery requires an authenticated review identity')
    await lockCmsWrites(req)
    if (!(await cmsActor(req))?.roles.some((role) => allowed.includes(role))) throw new Error('Discovery review identity is no longer active')
    const result = await payload.find({ collection: 'governed-records', limit: 1000, pagination: false, overrideAccess: true, depth: 0, req })
    if (result.totalDocs > result.docs.length) throw new Error('Discovery requires the complete local record set')
    const documents: WorkflowDocument[] = []
    for (const doc of result.docs) {
      const parsed = validateGovernedRecord(doc.record)
      if (!parsed.ok) throw new Error('Discovery contains invalid stored governance')
      const record = parsed.record
      const workflow = doc.workflow as CmsWorkflow
      if (record.status === 'published') {
        const approvals: readonly [string | undefined, CmsRole][] = [[record.approval?.actor, 'reviewer'],
          ...requiredDomains(record, workflow.contentClass).map((role): [string | undefined, CmsRole] => [workflow.reviews[role]?.actor, role]),
          ...(['contact', 'emergency'].includes(workflow.contentClass) ? [[workflow.verification?.actor, 'operations'] as [string | undefined, CmsRole]] : [])]
        let live = true
        for (const [actor, role] of approvals) {
          const identity = actor && /^cms:[1-9]\d*$/.test(actor) ? await payload.findByID({ collection: 'users',
            id: Number(actor.slice(4)), overrideAccess: true, depth: 0, req }).catch(() => null) : null
          if (!identity?.active || !identity.synthetic || !identity.roles.includes(role)) { live = false; break }
        }
        // Keep stable routes and dependencies, while making revoked workflows ineligible.
        documents.push({ record, workflow: live ? workflow : { ...workflow, reviews: {} } })
      } else documents.push({ record, workflow })
    }
    const snapshot = controlledDiscoveryCache.read(documents, origin, now, mode)
    await commitTransaction(req)
    return snapshot
  } catch (error) { await killTransaction(req); throw error }
}
