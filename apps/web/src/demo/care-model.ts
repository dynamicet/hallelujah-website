/** Representative frontend fixtures. Replace through an adapter when backend integration begins. */
export type CareEntry = Readonly<{
  kind: 'specialty' | 'service'
  access: 'appointment' | 'contact' | 'referral' | 'emergency'
  name: string
  synonyms: readonly string[]
  scope: string
  specialtyIds: readonly string[]
}>

const entries: Readonly<Record<string, CareEntry>> = {
  pub_111111111111: { kind: 'service', access: 'referral', name: 'Admission guidance', synonyms: ['planned admission'], scope: 'Help coordinating a planned hospital admission and preparing for your stay.', specialtyIds: [] },
  pub_121212121212: { kind: 'service', access: 'referral', name: 'Preparing for a hospital stay', synonyms: ['inpatient'], scope: 'Bring your referral, identification, medicine list and previous reports. Arrange the details of your arrival with the admissions team.', specialtyIds: [] },
  pub_131313131313: { kind: 'service', access: 'contact', name: 'Preparing for a day visit', synonyms: ['day care'], scope: 'Prepare your documents and questions before arriving. Ask the care team about the expected length of your visit and any support needed afterwards.', specialtyIds: [] },
  pub_141414141414: { kind: 'specialty', access: 'appointment', name: 'Family medicine', synonyms: ['Family care', 'General medicine', 'Family clinic'], scope: 'Consultations for everyday health concerns, ongoing conditions and preventive care.', specialtyIds: [] },
  pub_151515151515: { kind: 'specialty', access: 'appointment', name: 'Cardiology', synonyms: ['Heart care', 'Heart medicine', 'Cardiology department', 'Cardiology clinic'], scope: 'Specialist consultations, assessment and follow-up for heart health.', specialtyIds: [] },
  pub_161616161616: { kind: 'specialty', access: 'appointment', name: 'Respiratory medicine', synonyms: ['Breathing medicine', 'Pulmonology', 'Lung care'], scope: 'Assessment and ongoing care for breathing and lung concerns.', specialtyIds: [] },
  pub_171717171717: { kind: 'service', access: 'appointment', name: 'Physiotherapy', synonyms: ['Rehabilitation care', 'Physical therapy'], scope: 'Support with movement, everyday activities and recovery goals.', specialtyIds: ['pub_252525252525', 'pub_232323232323'] },
  pub_181818181818: { kind: 'service', access: 'contact', name: 'Speech & language therapy', synonyms: ['Speech support', 'Communication therapy'], scope: 'Assessment and therapy for speech, language and communication needs.', specialtyIds: ['pub_232323232323', 'pub_262626262626'] },
  pub_191919191919: { kind: 'service', access: 'referral', name: 'Preparing for a therapy conversation', synonyms: ['Therapy navigation'], scope: 'Write down your recovery goals, questions and any earlier therapy. A referral can help the team understand the support you need.', specialtyIds: [] },
  pub_212121212121: { kind: 'service', access: 'appointment', name: 'Follow-up consultation', synonyms: ['Follow-up support', 'Review appointment'], scope: 'Review your progress, earlier results and care plan with your doctor.', specialtyIds: ['pub_141414141414', 'pub_151515151515'] },
  pub_232323232323: { kind: 'specialty', access: 'appointment', name: 'Neurology', synonyms: ['Brain & nerve care', 'Neurology department'], scope: 'Specialist assessment and follow-up for brain and nerve concerns.', specialtyIds: [] },
  pub_242424242424: { kind: 'specialty', access: 'appointment', name: 'Nephrology', synonyms: ['Kidney care', 'Nephrology department'], scope: 'Specialist consultations and ongoing care for kidney health.', specialtyIds: [] },
  pub_252525252525: { kind: 'specialty', access: 'appointment', name: 'Orthopedics', synonyms: ['Bones & joints', 'Orthopedic clinic'], scope: 'Care for bone, joint and movement concerns.', specialtyIds: [] },
  pub_262626262626: { kind: 'specialty', access: 'appointment', name: 'Pediatrics', synonyms: ['Child care', 'Pediatric clinic'], scope: 'Consultations for children’s health and support for families.', specialtyIds: [] },
  pub_272727272727: { kind: 'service', access: 'appointment', name: 'Echocardiography', synonyms: ['Heart ultrasound', 'Echo test'], scope: 'An ultrasound examination of the heart, arranged as part of your care plan.', specialtyIds: ['pub_151515151515'] },
}

// Affiliation and provision are explicit. No service team is inferred from specialty membership.
const links: Readonly<Record<string, readonly string[]>> = {
  pub_101010101010: ['pub_141414141414', 'pub_212121212121'],
  pub_111111111111: ['pub_262626262626'],
  pub_121212121212: ['pub_151515151515', 'pub_141414141414', 'pub_272727272727', 'pub_212121212121'],
  pub_131313131313: ['pub_141414141414', 'pub_212121212121'],
  pub_141414141414: ['pub_262626262626'],
  pub_151515151515: ['pub_151515151515', 'pub_212121212121'],
  pub_161616161616: ['pub_141414141414'],
  pub_171717171717: ['pub_262626262626'],
  pub_181818181818: ['pub_151515151515'],
}

export function careEntry(id: string): CareEntry | undefined { return entries[id] }
export function relatedCareIds(doctorId: string): readonly string[] { return links[doctorId] ?? [] }
export function relatedDoctorIds(serviceId: string): readonly string[] {
  return Object.keys(links).filter((id) => links[id].includes(serviceId))
}
export function isRequestableCare(id: string): boolean { return entries[id]?.access === 'appointment' }
export function isKnownDoctor(id: string): boolean { return Object.hasOwn(links, id) }
export function isCompatibleCare(doctorId: string, serviceId: string): boolean {
  return relatedCareIds(doctorId).includes(serviceId)
}
export function doctorSpecialties(doctorId: string): readonly string[] {
  return relatedCareIds(doctorId).flatMap((id) => entries[id]?.kind === 'specialty' ? [entries[id].name] : [])
}
export const clinicianFilters = Object.entries(entries).filter(([id, entry]) => entry.kind === 'specialty' && relatedDoctorIds(id).length)
  .map(([id, entry]) => ({ value: ({ pub_141414141414: 'synthetic-family', pub_151515151515: 'synthetic-heart', pub_262626262626: 'synthetic-child' } as Record<string, string>)[id] ?? entry.name.toLowerCase().replaceAll(/[^a-z0-9]+/gu, '-'), specialty: entry.name, label: entry.name }))

export type CareSelection = Readonly<{ doctorId?: string; serviceId?: string }>
export function resolveCareSelection(input: CareSelection): CareSelection & { notice?: string } {
  const doctorId = input.doctorId && isKnownDoctor(input.doctorId) ? input.doctorId : undefined
  const serviceId = input.serviceId && isRequestableCare(input.serviceId) ? input.serviceId : undefined
  if (doctorId && serviceId && !isCompatibleCare(doctorId, serviceId)) return { doctorId, notice: 'This doctor is not listed for that specialty or service. Choose another care option or continue with the doctor.' }
  return { doctorId, serviceId, ...((input.doctorId && !doctorId) || (input.serviceId && !serviceId) ? { notice: 'That care option is unavailable for online requests. Choose another option or ask us to help you choose.' } : {}) }
}
export function appointmentHref(selection: CareSelection): string {
  const valid = resolveCareSelection(selection)
  const params = new URLSearchParams()
  if (valid.doctorId) params.set('doctor', valid.doctorId)
  if (valid.serviceId) params.set('service', valid.serviceId)
  return `/appointment${params.size ? `?${params}` : ''}`
}
export function carePathWithDoctor(service: { publicId: string; canonicalPath: string }, doctorId?: string): string {
  return doctorId && isCompatibleCare(doctorId, service.publicId) ? `${service.canonicalPath}?doctor=${encodeURIComponent(doctorId)}` : service.canonicalPath
}
