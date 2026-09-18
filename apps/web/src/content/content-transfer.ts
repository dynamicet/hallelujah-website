import { createHash } from 'node:crypto'
import { canonical, createWorkflow, applyWorkflow, contentClasses, type ContentClass, type WorkflowDocument } from './cms-workflow.ts'
import type { CmsActor } from './cms-identity.ts'
import { validateGovernedRecord, validateRecordSet, type GovernedRecord } from './governed-record.ts'
import { validateStoredRecordChange } from './governed-collection.ts'

export type TransferDocument = WorkflowDocument & Readonly<{ id: number | string }>
export type TransferEntry = Readonly<{
  sourceKey: string
  operation: 'upsert' | 'merge' | 'skip'
  contentClass?: ContentClass
  record?: GovernedRecord
}>
export type TransferBundle = Readonly<{ version: 1; synthetic: true; entries: readonly TransferEntry[] }>
export type TransferRow = Readonly<{
  sourceKey: string; publicId: string | null
  action: 'create' | 'update' | 'merge' | 'skip' | 'error'
  issues: readonly string[]
}>
export type TransferReport = Readonly<{
  version: 1; synthetic: true; valid: boolean; snapshotHash: string; planHash: string
  totals: Readonly<Record<TransferRow['action'], number>>; rows: readonly TransferRow[]
}>

export function transferHash(value: unknown): string {
  return createHash('sha256').update(canonical(value)).digest('hex')
}

function plain(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function fields(value: Record<string, unknown>, allowed: readonly string[]) {
  if (Object.keys(value).some((key) => !allowed.includes(key))) throw new Error('Unexpected transfer fields')
}

/** A transfer is an unsigned synthetic authoring input, never an approval or asset receipt. */
export function parseTransferBundle(input: unknown): TransferBundle {
  if (!plain(input)) throw new Error('Transfer bundle must be an object')
  if (Buffer.byteLength(canonical(input), 'utf8') > 4 * 1024 * 1024) throw new Error('Transfer input exceeds 4 MiB')
  fields(input, ['version', 'synthetic', 'entries'])
  if (input.version !== 1 || input.synthetic !== true || !Array.isArray(input.entries)
    || input.entries.length > 500) throw new Error('Transfer requires version 1, synthetic scope and at most 500 entries')
  const keys = new Set<string>()
  const targets = new Set<string>()
  const entries: TransferEntry[] = input.entries.map((entry: unknown) => {
    if (!plain(entry)) throw new Error('Transfer entry must be an object')
    fields(entry, ['sourceKey', 'operation', 'contentClass', 'record'])
    if (typeof entry.sourceKey !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._:/#-]{0,199}$/.test(entry.sourceKey)
      || keys.has(entry.sourceKey)) throw new Error('Transfer source keys must be bounded and unique')
    keys.add(entry.sourceKey)
    if (!['upsert', 'merge', 'skip'].includes(entry.operation as string)) throw new Error('Unsupported transfer operation')
    if (entry.operation === 'skip') {
      if (entry.record !== undefined || entry.contentClass !== undefined) throw new Error('Explicit skip cannot carry a record')
      return { sourceKey: entry.sourceKey, operation: 'skip' }
    }
    if (!contentClasses.includes(entry.contentClass as ContentClass)) throw new Error('Transfer requires an explicit content class')
    const result = validateGovernedRecord(entry.record)
    if (!result.ok) throw new Error(`Invalid transfer record: ${result.issues.join('; ')}`)
    const record = result.record
    // Normalization must not silently discard unsupported authored fields or payloads.
    if (canonical(entry.record) !== canonical(record)) throw new Error('Transfer record must use the exact governed schema')
    if (!record.synthetic || record.status !== 'draft' || record.owner || record.reviewer
      || record.approval || record.domainApproval || record.withdrawal || record.audit.length) {
      throw new Error('Transfer only accepts unsigned synthetic drafts without governance metadata')
    }
    if (targets.has(record.publicId)) throw new Error('A transfer may target each stable ID only once')
    targets.add(record.publicId)
    return { sourceKey: entry.sourceKey, operation: entry.operation as 'upsert' | 'merge',
      contentClass: entry.contentClass as ContentClass, record }
  })
  return { version: 1, synthetic: true, entries }
}

export function exportTransferSnapshot(documents: readonly TransferDocument[]) {
  if (documents.length > 1000) throw new Error('Transfer requires a complete bounded local record set')
  const ordered = [...documents].sort((a, b) => a.record.publicId.localeCompare(b.record.publicId))
  for (const doc of ordered) {
    const parsed = validateGovernedRecord(doc.record)
    if (!parsed.ok || !parsed.record.synthetic || canonical(parsed.record) !== canonical(doc.record)
      || !doc.workflow || !Number.isSafeInteger(doc.workflow.revision) || doc.workflow.revision < 1
      || !contentClasses.includes(doc.workflow.contentClass)
      || typeof doc.workflow.author !== 'string' || !plain(doc.workflow.reviews)) {
      throw new Error('Export requires valid synthetic records and workflow metadata')
    }
  }
  const issues = validateRecordSet(ordered.map((doc) => doc.record))
  if (issues.length) throw new Error(`Invalid transfer snapshot: ${issues.join('; ')}`)
  const snapshot = { version: 1 as const, synthetic: true as const,
    documents: structuredClone(ordered) }
  return { ...snapshot, snapshotHash: transferHash(snapshot) }
}

export function unsignedTransferRecord(record: GovernedRecord): GovernedRecord {
  if (record.status !== 'draft') throw new Error('Only an existing draft can become an authoring input')
  return { ...record, owner: null, reviewer: null, approval: null,
    domainApproval: null, withdrawal: null, audit: [] }
}

export type TransferStep = Readonly<{ entry: TransferEntry; previous?: TransferDocument }>

/** Dependency order is determined without mutating input; cyclic new references fail closed. */
export function planContentTransfer(
  input: unknown, documents: readonly TransferDocument[], actor: CmsActor, now: Date,
): Readonly<{ report: TransferReport; steps: readonly TransferStep[] }> {
  if (!actor.roles.includes('author') || !Number.isFinite(now.getTime())) throw new Error('Transfer planning requires an author and valid clock')
  const snapshot = exportTransferSnapshot(documents)
  const rows: TransferRow[] = []
  const steps: TransferStep[] = []
  let bundle: TransferBundle
  try { bundle = parseTransferBundle(input) } catch (error) {
    rows.push({ sourceKey: 'bundle', publicId: null, action: 'error',
      issues: [error instanceof Error ? error.message : 'Invalid transfer bundle'] })
    return finish()
  }
  const staged = new Map(documents.map((doc) => [doc.record.publicId, doc]))
  const pending = [...bundle.entries].sort((a, b) => a.sourceKey.localeCompare(b.sourceKey))
  while (pending.length) {
    const index = pending.findIndex((entry) => !entry.record
      || entry.record.relationships.every((id) => staged.has(id)))
    if (index < 0) {
      for (const entry of pending) rows.push({ sourceKey: entry.sourceKey, publicId: entry.record!.publicId,
        action: 'error', issues: ['Unresolved or cyclic new-record relationships'] })
      break
    }
    const entry = pending.splice(index, 1)[0]
    if (entry.operation === 'skip') {
      rows.push({ sourceKey: entry.sourceKey, publicId: null, action: 'skip', issues: [] })
      continue
    }
    const record = entry.record!
    const previous = staged.get(record.publicId)
    try {
      if (entry.operation === 'merge' && !previous) throw new Error('Explicit merge requires an existing target ID')
      if (previous && (previous.record.status !== 'draft' || previous.workflow.author !== actor.id
        || previous.workflow.contentClass !== entry.contentClass)) throw new Error('Transfer can only edit the owning author draft with unchanged content class')
      // Run workflow validation even for a repeated no-op, so authored review stamps cannot sneak in.
      const candidate = previous ? { ...record, owner: previous.record.owner,
        reviewer: previous.record.reviewer, approval: previous.record.approval,
        domainApproval: previous.record.domainApproval, audit: previous.record.audit } : record
      const change = previous ? applyWorkflow(previous, candidate,
        { action: 'edit', expectedRevision: previous.workflow.revision }, actor, now)
        : createWorkflow(record, entry.contentClass!, actor, now)
      if (previous && canonical(candidate) === canonical(previous.record)) {
        rows.push({ sourceKey: entry.sourceKey, publicId: record.publicId, action: 'skip', issues: [] })
        continue
      }
      const peers = [...staged.values()].filter((doc) => doc.record.publicId !== record.publicId).map((doc) => doc.record)
      validateStoredRecordChange(change.record, previous?.record, peers)
      staged.set(record.publicId, { id: previous?.id ?? `new:${record.publicId}`, ...change })
      steps.push({ entry, previous })
      rows.push({ sourceKey: entry.sourceKey, publicId: record.publicId,
        action: entry.operation === 'merge' ? 'merge' : previous ? 'update' : 'create', issues: [] })
    } catch (error) {
      rows.push({ sourceKey: entry.sourceKey, publicId: record.publicId, action: 'error',
        issues: [error instanceof Error ? error.message : 'Transfer validation failed'] })
    }
  }
  if (staged.size > 1000) rows.push({ sourceKey: 'bundle', publicId: null,
    action: 'error', issues: ['Imported set exceeds the complete local record bound'] })
  return finish()

  function finish() {
    rows.sort((a, b) => a.sourceKey.localeCompare(b.sourceKey))
    const totals = { create: 0, update: 0, merge: 0, skip: 0, error: 0 }
    rows.forEach((row) => { totals[row.action] += 1 })
    const report = { version: 1 as const, synthetic: true as const,
      valid: totals.error === 0, snapshotHash: snapshot.snapshotHash,
      planHash: transferHash({ input, snapshotHash: snapshot.snapshotHash, actor, rows }), totals, rows }
    return { report, steps: report.valid ? steps : [] }
  }
}
