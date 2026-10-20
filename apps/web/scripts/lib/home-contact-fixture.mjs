import { applyWorkflow, createWorkflow } from '../../src/content/cms-workflow.ts'
import { homeFixture } from './home-fixture.mjs'
import { siteSettingsFixture } from './site-settings-fixture.mjs'

export const homeContactTime = new Date('2026-09-19T09:00:00Z')
export const homeContactFixtureStates = ['contacts-current', 'contacts-missing', 'contacts-unverified',
  'contacts-expired', 'contacts-withdrawn', 'contacts-updated', 'contacts-amharic-unavailable', 'contacts-public-denied']

/** Reserved fictional data only; generated through the actual independent workflow. */
export function homeContactDocument(now = homeContactTime, change = (record) => record) {
  const workflowTime = new Date(now.getTime() - 60000)
  const author = { id: 'cms:1', roles: ['author'] }
  const operations = { id: 'cms:2', roles: ['operations'] }
  const reviewer = { id: 'cms:3', roles: ['reviewer'] }
  const publisher = { id: 'cms:4', roles: ['publisher'] }
  const action = (doc, actor, action, extra = {}) => applyWorkflow(doc, undefined,
    { action, expectedRevision: doc.workflow.revision, ...extra }, actor, workflowTime)
  let doc = createWorkflow(change(siteSettingsFixture(now)), 'contact', author, workflowTime)
  doc = action(doc, author, 'submit')
  doc = action(doc, operations, 'review-domain', { domain: 'operations', reference: 'Synthetic Home operations review' })
  doc = action(doc, reviewer, 'approve')
  doc = action(doc, publisher, 'publish')
  return action(doc, operations, 'verify-publication', { reference: 'Synthetic Home publication verification' })
}

export function homeContactFixture(state = 'contacts-current') {
  if (!homeContactFixtureStates.includes(state)) throw new Error('Unsupported Home contact review state')
  const doc = homeContactDocument(homeContactTime, (record) => {
    if (state === 'contacts-updated') record.siteSettings.publicPhone.value = '+1 (202) 555-0199'
    if (state === 'contacts-amharic-unavailable') delete record.siteSettings.publicEntrance.label.am
    return record
  })
  if (state === 'contacts-unverified') doc.record.siteSettings.publicPhone.state = 'unverified'
  if (state === 'contacts-withdrawn') {
    const retired = applyWorkflow(doc, undefined,
      { action: 'withdraw', expectedRevision: doc.workflow.revision, reason: 'Synthetic Home retirement' },
      { id: 'cms:4', roles: ['publisher'] }, homeContactTime)
    return { ...homeFixture(), documents: [retired], locale: 'en', now: homeContactTime, mode: 'controlled-fixture' }
  }
  return { ...homeFixture(),
    eyebrow: 'Care access, clearly organized',
    documents: state === 'contacts-missing' ? [] : [doc],
    locale: state === 'contacts-amharic-unavailable' ? 'am' : 'en',
    now: state === 'contacts-expired' ? new Date(homeContactTime.getTime() + 7 * 86400000) : homeContactTime,
    ...(state === 'contacts-public-denied' ? {} : { mode: 'controlled-fixture' }),
  }
}
