import { canonical, type WorkflowDocument } from './cms-workflow.ts'
import { controlledDiscovery, governedPath, type DiscoverySnapshot } from './governed-discovery.ts'
import type { GovernedRecord } from './governed-record.ts'

export type DiscoveryInvalidation = Readonly<{ publicIds: readonly string[]; paths: readonly string[]; tags: readonly string[] }>
/** Includes both path versions and transitive reverse dependencies. */
export function discoveryInvalidation(before: readonly GovernedRecord[], after: readonly GovernedRecord[], changedId: string): DiscoveryInvalidation {
  const records = [...before, ...after]
  const ids = new Set([changedId])
  let changed = true
  while (changed) {
    changed = false
    for (const record of records) {
      const dependencies = [...record.relationships, ...(record.clinician?.locationPublicIds ?? []), ...(record.service?.locationPublicIds ?? [])]
      if (!ids.has(record.publicId) && dependencies.some((id) => ids.has(id))) { ids.add(record.publicId); changed = true }
    }
  }
  const safety = records.some((record) => ids.has(record.publicId) && record.kind === 'site-settings')
  const paths = new Set(['/sitemap.xml', '/robots.txt', '/search/', '/am/search/', '/doctors/', '/am/doctors/', '/services/', '/am/services/'])
  for (const record of records.filter((record) => ids.has(record.publicId))) {
    for (const locale of ['en', 'am'] as const) { const path = governedPath(record, locale); if (path) paths.add(path) }
    if (record.kind === 'visitor-topic') { paths.add('/patient-information/'); paths.add('/am/patient-information/') }
    if (record.kind === 'institutional-block') { paths.add('/about/'); paths.add('/am/about/') }
  }
  if (safety) {
    // Shared shell/footer contacts can appear on every page, not only emergency/contact.
    for (const slug of ['', 'contact', 'emergency', 'doctors', 'services', 'appointments', 'patient-information', 'search', 'about', 'privacy', 'accessibility']) {
      for (const prefix of ['', '/am']) paths.add(`${prefix}/${slug ? `${slug}/` : ''}`)
    }
    for (const record of records) for (const locale of ['en', 'am'] as const) {
      const path = governedPath(record, locale)
      if (path) paths.add(path)
    }
  }
  return { publicIds: [...ids].sort(), paths: [...paths].sort(),
    tags: ['governed-discovery', ...[...ids].sort().map((id) => `governed:${id}`), ...(safety ? ['canonical-contacts'] : [])] }
}

/** Controlled memory cache. CMS callers recheck live roles before every use. */
export class ControlledDiscoveryCache {
  private entries = new Map<string, { fingerprint: string; at: number; snapshot: DiscoverySnapshot }>()
  read(documents: readonly WorkflowDocument[], origin: string, now: Date, mode?: 'controlled-fixture'): DiscoverySnapshot {
    const key = `${origin}:${mode ?? 'withheld'}`
    const fingerprint = canonical(documents)
    const stored = this.entries.get(key)
    if (stored && stored.fingerprint === fingerprint && now.getTime() >= stored.at && now.getTime() < stored.snapshot.validUntil) return structuredClone(stored.snapshot)
    const snapshot = controlledDiscovery(documents, origin, now, mode)
    if (this.entries.size >= 16) this.entries.clear()
    if (snapshot.state === 'controlled-fixture') this.entries.set(key, { fingerprint, at: now.getTime(), snapshot: structuredClone(snapshot) })
    return snapshot
  }
  invalidate(): void {
    // A complete-set projection depends on additions and hub consumers as well as known IDs.
    this.entries.clear()
  }
}
export const controlledDiscoveryCache = new ControlledDiscoveryCache()
