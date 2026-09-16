import type { Payload, TypedUser } from 'payload'
import { type CmsWorkflow } from './cms-workflow.ts'
import { validateGovernedRecord } from './governed-record.ts'

// Explicit internal local invocation; no production timer or job is registered.
// Every due transition passes the same live-role/revision/transaction write boundary.
export async function advanceDueCmsRecords(payload: Payload, user: TypedUser) {
  const records = await payload.find({
    collection: 'governed-records', user, overrideAccess: false, pagination: false, limit: 1000, depth: 0,
  })
  if (records.totalDocs > records.docs.length) throw new Error('Lifecycle advancement requires the complete local set')
  const changed: Array<{ id: number | string; action: 'publish' | 'expire' }> = []
  for (const document of records.docs) {
    const validated = validateGovernedRecord(document.record)
    if (!validated.ok || !validated.record.synthetic) throw new Error('Lifecycle advancement requires valid synthetic records')
    const record = validated.record
    const now = Date.now()
    const action = record.status === 'published' && record.expiresAt && Date.parse(record.expiresAt) <= now
      ? 'expire' : record.status === 'scheduled' && record.publishAt && Date.parse(record.publishAt) <= now
        ? 'publish' : null
    if (!action) continue
    await payload.update({
      collection: 'governed-records', id: document.id, user, overrideAccess: false,
      data: { command: { action, expectedRevision: (document.workflow as CmsWorkflow).revision,
        ...(action === 'expire' ? { reason: 'Controlled expiry instant reached' } : {}) } },
    })
    changed.push({ id: document.id, action })
  }
  return changed
}
