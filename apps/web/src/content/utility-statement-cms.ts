import {
  commitTransaction, createLocalReq, initTransaction, killTransaction,
  type Payload, type TypedUser,
} from 'payload'
import { cmsActor, lockCmsWrites, type CmsRole } from './cms-identity.ts'
import { requiredDomains, type CmsWorkflow, type WorkflowDocument } from './cms-workflow.ts'
import { validateGovernedRecord, type GovernedLocale } from './governed-record.ts'
import { controlledStatementView, controlledCollectionContract } from './utility-statement-view.ts'
import type { StatementType, CollectionFeature, ProcessingInventory } from './utility-statement.ts'

/** Local authenticated review read; identity revocations and concurrent writes fail closed. */
async function statementDocuments(
  payload: Payload, user: TypedUser | undefined, consume: (documents: readonly WorkflowDocument[]) => unknown,
) {
  const req = await createLocalReq({ user }, payload)
  await initTransaction(req)
  try {
    const allowed = ['reviewer', 'publisher', 'content', 'privacy', 'legal', 'accessibility', 'operations']
    if (!(await cmsActor(req))?.roles.some((role) => allowed.includes(role))) throw new Error('Statement view requires an authenticated review identity')
    await lockCmsWrites(req)
    if (!(await cmsActor(req))?.roles.some((role) => allowed.includes(role))) throw new Error('Statement view identity is no longer active')
    const result = await payload.find({ collection: 'governed-records', limit: 1000,
      pagination: false, overrideAccess: true, depth: 0, req })
    if (result.totalDocs > result.docs.length) throw new Error('Statement view requires the complete local record set')
    const documents: WorkflowDocument[] = []
    for (const doc of result.docs) {
      const parsed = validateGovernedRecord(doc.record)
      if (!parsed.ok) throw new Error('Statement view contains invalid stored governance')
      const record = parsed.record
      const workflow = doc.workflow as CmsWorkflow
      if (record.status === 'published') {
        const approvals: readonly [string | undefined, CmsRole][] = [
          [record.approval?.actor, 'reviewer'], ...(requiredDomains(record, workflow.contentClass))
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
    const hub = consume(documents)
    await commitTransaction(req)
    return hub
  } catch (error) {
    await killTransaction(req)
    throw error
  }
}

export async function cmsStatementView(
  payload: Payload, user: TypedUser | undefined, type: StatementType, locale: GovernedLocale,
  now: Date, mode?: 'controlled-fixture',
) {
  return await statementDocuments(payload, user,
    (documents) => controlledStatementView(documents, type, locale, now, mode)) as ReturnType<typeof controlledStatementView>
}
export async function cmsCollectionContract(
  payload: Payload, user: TypedUser | undefined, expectedPublicId: string, feature: CollectionFeature,
  inventory: ProcessingInventory, now: Date, mode?: 'controlled-fixture',
) {
  return await statementDocuments(payload, user, (documents) =>
    controlledCollectionContract(documents, expectedPublicId, feature, inventory, now, mode)) as ReturnType<typeof controlledCollectionContract>
}
