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
  pub_111111111111: { kind: 'service', access: 'referral', name: 'Admission guidance', synonyms: ['planned admission'], scope: 'Plan a hospital admission with your referring clinician and the admissions team. Discuss arrival arrangements, documents and support for your stay.', specialtyIds: [] },
  pub_121212121212: { kind: 'service', access: 'referral', name: 'Preparing for a hospital stay', synonyms: ['inpatient'], scope: 'Bring your referral, identification, medicine list and previous reports. Arrange the details of your arrival with the admissions team.', specialtyIds: [] },
  pub_131313131313: { kind: 'service', access: 'contact', name: 'Preparing for a day visit', synonyms: ['day care'], scope: 'Prepare your documents and questions before arriving. Ask the care team about the expected length of your visit and any support needed afterwards.', specialtyIds: [] },
  pub_141414141414: { kind: 'specialty', access: 'appointment', name: 'Family medicine', synonyms: ['Family care', 'General medicine', 'Family clinic'], scope: 'Care for everyday health concerns, ongoing conditions and preventive health. Start with a consultation to discuss your concerns and plan the next step.', specialtyIds: [] },
  pub_151515151515: { kind: 'specialty', access: 'appointment', name: 'Cardiology', synonyms: ['Heart care', 'Heart medicine', 'Cardiology department', 'Cardiology clinic'], scope: 'Specialist consultations for heart health, review of earlier results and follow-up care. Bring previous reports and a current medicine list to your visit.', specialtyIds: [] },
  pub_161616161616: { kind: 'specialty', access: 'appointment', name: 'Respiratory medicine', synonyms: ['Breathing medicine', 'Pulmonology', 'Lung care'], scope: 'Consultations for breathing and lung concerns, with review of your symptoms, medical history and earlier results.', specialtyIds: [] },
  pub_171717171717: { kind: 'service', access: 'appointment', name: 'Physiotherapy', synonyms: ['Rehabilitation care', 'Physical therapy'], scope: 'Work with the rehabilitation team on movement, daily activities and recovery goals. Bring information about previous treatment and your referral if you have one.', specialtyIds: ['pub_252525252525', 'pub_232323232323'] },
  pub_181818181818: { kind: 'service', access: 'contact', name: 'Speech & language therapy', synonyms: ['Speech support', 'Communication therapy'], scope: 'Discuss communication support with the therapy team. Contact the team to explain your needs and arrange an initial assessment.', specialtyIds: ['pub_232323232323', 'pub_262626262626'] },
  pub_191919191919: { kind: 'service', access: 'referral', name: 'Preparing for a therapy conversation', synonyms: ['Therapy navigation'], scope: 'Write down your recovery goals, questions and any earlier therapy. A referral can help the team understand the support you need.', specialtyIds: [] },
  pub_212121212121: { kind: 'service', access: 'appointment', name: 'Follow-up consultation', synonyms: ['Follow-up support', 'Review appointment'], scope: 'Review your care plan, earlier results and progress with your doctor. Bring your previous visit notes and the questions you want to discuss.', specialtyIds: ['pub_141414141414', 'pub_151515151515'] },
  pub_232323232323: { kind: 'specialty', access: 'appointment', name: 'Neurology', synonyms: ['Brain & nerve care', 'Neurology department'], scope: 'Specialist assessment and follow-up for brain and nerve concerns. Bring previous consultation notes, test reports and a current medicine list.', specialtyIds: [] },
  pub_242424242424: { kind: 'specialty', access: 'appointment', name: 'Nephrology', synonyms: ['Kidney care', 'Nephrology department'], scope: 'Consultations about kidney health and ongoing care. Bring earlier blood and urine test results and your current medicine list.', specialtyIds: [] },
  pub_252525252525: { kind: 'specialty', access: 'appointment', name: 'Orthopedics', synonyms: ['Bones & joints', 'Orthopedic clinic'], scope: 'Specialist consultations for bones, joints and movement concerns, including review of earlier imaging and treatment.', specialtyIds: [] },
  pub_262626262626: { kind: 'specialty', access: 'appointment', name: 'Pediatrics', synonyms: ['Child care', 'Pediatric clinic'], scope: 'Care for children and guidance for families. Bring your child’s health records, medicine list and any earlier reports.', specialtyIds: [] },
  pub_272727272727: { kind: 'service', access: 'appointment', name: 'Echocardiography', synonyms: ['Heart ultrasound', 'Echo test'], scope: 'An ultrasound examination of the heart, arranged as part of your care plan. Bring the request from your clinician and previous heart reports.', specialtyIds: ['pub_151515151515'] },
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
  .map(([id, entry]) => ({ value: id, specialty: entry.name, label: entry.name }))

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
