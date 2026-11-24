import { relatedCareIds } from './care-model.ts'
import type { ClinicianView } from '../content/clinician-view'
import type { ServiceView } from '../content/service-view'

// Preview search vocabulary tied to existing service affiliations.
const careSearchLabels = [
  { serviceId: 'pub_171717171717', labels: ['Back pain', 'backache', 'aching back', 'back hurts', 'lower back pain'] },
  { serviceId: 'pub_141414141414', labels: ['Diabetes', 'blood sugar', 'diabetic', 'diabetes care'] },
  { serviceId: 'pub_141414141414', labels: ['Digestive concerns', 'stomach', 'digestion', 'stomach pain', 'stomach ache', 'tummy pain'] },
  { serviceId: 'pub_141414141414', labels: ['High blood pressure', 'hypertension', 'blood pressure', 'high bp'] },
  { serviceId: 'pub_171717171717', labels: ['Joint pain', 'aching joints', 'joint ache', 'knee pain', 'hip pain'] },
  { serviceId: 'pub_141414141414', labels: ['Thyroid concerns', 'thyroid', 'thyroid care'] },
] as const

const normalizeCareSearch = (text: string) => text.normalize('NFKC').toLocaleLowerCase('en')
  .replaceAll(/[^\p{L}\p{N}]+/gu, ' ').trim()

function matchingCareIds(query: string) {
  const term = normalizeCareSearch(query)
  if (!term) return []
  const words = term.split(' ')
  return careSearchLabels.flatMap(({ serviceId, labels }) => {
    const scores = labels.flatMap((label, index) => {
      const value = normalizeCareSearch(label)
      const tokens = value.split(' ')
      // Every query word must match within one label.
      if (!words.every(word => tokens.some(token => token.startsWith(word)))) return []
      const matchRank = value === term ? 0 : value.startsWith(term) ? 2 : 4
      return [matchRank + Number(index > 0)]
    })
    return scores.length ? [{ serviceId, rank: Math.min(...scores) }] : []
  }).sort((a, b) => a.rank - b.rank).map(({ serviceId }) => serviceId)
}

// Preview relationships only. Search reuses existing affiliations.
export function doctorSearchTerms(query: string, clinicians: readonly ClinicianView[], services: readonly ServiceView[]) {
  const normalizedQuery = query.normalize('NFC').replaceAll(/[\u0000-\u001f\u007f]/gu, '').replaceAll(/\s+/gu, ' ').trim().slice(0, 80)
  const matches = matchingCareIds(normalizedQuery)
  return clinicians.flatMap((clinician) => {
    const ids = relatedCareIds(clinician.publicId)
    const related = services.filter((service) => ids.includes(service.publicId))
    if (!related.length) return []
    const matched = matches.map(id => related.find(service => service.publicId === id)).find(Boolean)
    return [{
      clinicianPublicId: clinician.publicId,
      terms: [...related.map((service) => service.name), ...(matched ? [normalizedQuery] : [])],
      explanation: `Related care: ${matched?.name ?? related.map((service) => service.name).join(' · ')}.`,
    }]
  })
}
