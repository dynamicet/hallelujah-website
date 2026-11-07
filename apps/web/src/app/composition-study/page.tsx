import { notFound } from 'next/navigation'

import { isLocalDemo } from '@/server/environment'

import captures from '../../../../../docs/brand/evidence/composition-revision/captures/before.json'
import revised from '../../../../../docs/brand/evidence/composition-revision/captures/after.json'
import { CompositionStudy } from './study'

export default function CompositionStudyPage() {
  if (!isLocalDemo()) notFound()
  const comparisons = captures.filter((capture) => capture.width === 1440).map((capture) => ({
    ...capture,
    variants: [...captures, ...revised].filter((variant) => variant.id === capture.id),
  }))
  return <CompositionStudy captures={comparisons} />
}
