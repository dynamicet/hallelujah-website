import {
  commitTransaction, createLocalReq, initTransaction, killTransaction,
  type Payload, type TypedUser,
} from 'payload'
import { cmsActor, lockCmsWrites, type CmsRole } from './cms-identity.ts'
import type { CmsWorkflow, WorkflowDocument } from './cms-workflow.ts'
import { validateGovernedRecord, type GovernedLocale } from './governed-record.ts'
import { controlledVisitorHub } from './visitor-topic-view.ts'

/** Local authenticated review read; identity revocations and concurrent writes fail closed. */
export async function cmsVisitorHub(
  payload: Payload, user: TypedUser | undefined, locale: GovernedLocale, now: Date, mode?: 'controlled-fixture',
) {
  const req = await createLocalReq({ user }, payload)
  await initTransaction(req)
  try {
    const allowed = ['reviewer', 'publisher', 'operations', 'privacy', 'legal']
    if (!(await cmsActor(req))?.roles.some((role) => allowed.includes(role))) throw new Error('Visitor hub requires an authenticated review identity')
    await lockCmsWrites(req)
    if (!(await cmsActor(req))?.roles.some((role) => allowed.includes(role))) throw new Error('Visitor hub identity is no longer active')
    const result = await payload.find({ collection: 'governed-records', limit: 1000,
      pagination: false, overrideAccess: true, depth: 0, req })
    if (result.totalDocs > result.docs.length) throw new Error('Visitor hub requires the complete local record set')
    const documents: WorkflowDocument[] = []
    for (const doc of result.docs) {
      const parsed = validateGovernedRecord(doc.record)
      if (!parsed.ok || parsed.record.kind !== 'visitor-topic') continue
      const record = parsed.record
      const workflow = doc.workflow as CmsWorkflow
      if (record.status === 'published') {
        const approvals: readonly [string | undefined, CmsRole][] = [
          [record.approval?.actor, 'reviewer'], ...(['operations', 'privacy', 'legal'] as const)
            .map((role): [string | undefined, CmsRole] => [workflow.reviews[role]?.actor, role]),
        ]
        let live = true
        for (const [actor, role] of approvals) {
          if (!actor || !/^cms:[1-9]\d*$/.test(actor)) { live = false; break }
          const identity = await payload.findByID({ collection: 'users', id: Number(actor.slice(4)),
            overrideAccess: true, depth: 0, req }).catch(() => null)
          if (!identity?.active || identity.synthetic !== true || !identity.roles.includes(role)) { live = false; break }
        }
        if (!live) continue
      }
      documents.push({ record, workflow })
    }
    const hub = controlledVisitorHub(documents, locale, now, mode)
    await commitTransaction(req)
    return hub
  } catch (error) {
    await killTransaction(req)
    throw error
  }
}
