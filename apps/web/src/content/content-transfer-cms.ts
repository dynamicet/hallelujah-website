import { commitTransaction, createLocalReq, initTransaction, killTransaction, type Payload, type TypedUser, type RequiredDataFromCollectionSlug } from 'payload'
import { cmsActor, lockCmsWrites } from './cms-identity.ts'
import { canonical, type CmsWorkflow } from './cms-workflow.ts'
import { exportTransferSnapshot, planContentTransfer, type TransferDocument } from './content-transfer.ts'
import { validateGovernedRecord } from './governed-record.ts'

/** No HTTP endpoint: local authenticated tooling shares the existing serialized CMS boundary. */
export async function cmsContentTransfer(
  payload: Payload, user: TypedUser | undefined,
  command: Readonly<{ action: 'export' | 'dry-run' | 'import'; bundle?: unknown; expectedPlanHash?: string }>,
) {
  if (!['export', 'dry-run', 'import'].includes(command.action)) throw new Error('Unsupported content transfer action')
  // Bind the caller's bundle before the first await; later caller mutation cannot change the batch.
  const bundle = command.bundle === undefined ? undefined : structuredClone(command.bundle)
  const expectedPlanHash = command.expectedPlanHash
  const action = command.action
  const req = await createLocalReq({ user }, payload)
  await initTransaction(req)
  try {
    await lockCmsWrites(req)
    const actor = await cmsActor(req)
    if (!actor?.roles.includes('author') && !(action === 'export' && actor?.roles.includes('reviewer'))) {
      throw new Error('Content transfer requires an active persisted local author or export reviewer')
    }
    const result = await payload.find({ collection: 'governed-records', limit: 1000,
      pagination: false, depth: 0, overrideAccess: true, req })
    if (result.totalDocs > result.docs.length) throw new Error('Transfer requires the complete local record set')
    const documents: TransferDocument[] = result.docs.map((doc) => {
      const parsed = validateGovernedRecord(doc.record)
      if (!parsed.ok || canonical(parsed.record) !== canonical(doc.record)) throw new Error('Transfer contains invalid stored governance')
      return { id: doc.id, record: parsed.record, workflow: doc.workflow as CmsWorkflow }
    })
    // Author exports cannot reveal another author's draft via the internal complete-set read.
    if (action === 'export') {
      if (!actor!.roles.includes('reviewer') && documents.some((doc) => doc.workflow.author !== actor!.id)) {
        throw new Error('Complete export requires a review identity when other authors have records')
      }
      const snapshot = exportTransferSnapshot(documents)
      await commitTransaction(req)
      return { action: 'export' as const, snapshot }
    }
    const plan = planContentTransfer(bundle, documents, actor!, new Date())
    if (action === 'dry-run') {
      await commitTransaction(req)
      return { action: 'dry-run' as const, report: plan.report }
    }
    if (!plan.report.valid || !/^[a-f0-9]{64}$/.test(expectedPlanHash ?? '')
      || expectedPlanHash !== plan.report.planHash) throw new Error('Import requires a valid matching dry-run plan; stale or changed input rejected')
    for (const step of plan.steps) {
      if (step.previous) {
        const candidate = { ...step.entry.record!, owner: step.previous.record.owner,
          reviewer: step.previous.record.reviewer, approval: step.previous.record.approval,
          domainApproval: step.previous.record.domainApproval, audit: step.previous.record.audit }
        await payload.update({ collection: 'governed-records', id: step.previous.id,
          overrideAccess: false, req, data: { record: candidate,
            command: { action: 'edit', expectedRevision: step.previous.workflow.revision } } })
      } else {
        // Generated create types require authorId/workflow; the collection hook owns both
        // and rejects supplied values. Keep validation enabled and omit those fields.
        await payload.create({ collection: 'governed-records', overrideAccess: false, req,
          data: { publicId: step.entry.record!.publicId, record: step.entry.record!,
            contentClass: step.entry.contentClass! } as unknown as RequiredDataFromCollectionSlug<'governed-records'> })
      }
    }
    // Hooks remain authoritative; any failure rolls back the entire batch, including revisions/audit.
    const after = await payload.find({ collection: 'governed-records', limit: 1000,
      pagination: false, depth: 0, overrideAccess: true, req })
    if (after.totalDocs > after.docs.length) throw new Error('Imported set exceeds the transfer bound')
    const snapshot = exportTransferSnapshot(after.docs.map((doc) => ({ id: doc.id,
      record: doc.record as TransferDocument['record'], workflow: doc.workflow as CmsWorkflow })))
    await commitTransaction(req)
    return { action: 'import' as const, report: plan.report, snapshot,
      changed: snapshot.snapshotHash !== exportTransferSnapshot(documents).snapshotHash }
  } catch (error) { await killTransaction(req); throw error }
}
