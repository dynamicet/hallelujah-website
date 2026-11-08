import { isCompatibleCare, isKnownDoctor, isRequestableCare, type CareSelection } from './care-model.ts'

export type AppointmentRequestPayload = Readonly<{
  full_name: string
  phone: string
  preferred_date?: string
  doctor_id?: string
  service_id?: string
  privacy_acknowledged: true
}>
export type AppointmentDraft = CareSelection & Readonly<{
  fullName: string; phone: string; preferredDate?: string; privacyAcknowledged: boolean
}>
export type DraftField = 'doctor-id' | 'service-id' | 'full-name' | 'phone' | 'preferred-date' | 'privacy-acknowledged'

/** Pure preparation boundary. It performs no request, storage, logging or side effects. */
export function prepareAppointmentRequest(draft: AppointmentDraft, now = new Date()):
  { ok: true; payload: AppointmentRequestPayload } | { ok: false; errors: readonly DraftField[] } {
  const errors: DraftField[] = []
  const fullName = draft.fullName.trim()
  const phone = draft.phone.trim()
  if (draft.doctorId && !isKnownDoctor(draft.doctorId)) errors.push('doctor-id')
  if (draft.serviceId && (!isRequestableCare(draft.serviceId) || (draft.doctorId && !isCompatibleCare(draft.doctorId, draft.serviceId)))) errors.push('service-id')
  if (fullName.length < 2 || fullName.length > 120 || /[\u0000-\u001f\u007f]/u.test(fullName)) errors.push('full-name')
  if (phone.length > 32 || !/^[+\d\s().-]+$/u.test(phone) || phone.replace(/\D/gu, '').length < 7 || phone.replace(/\D/gu, '').length > 15) errors.push('phone')
  if (draft.preferredDate) {
    const date = new Date(`${draft.preferredDate}T00:00:00Z`)
    const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
    if (!/^\d{4}-\d{2}-\d{2}$/u.test(draft.preferredDate) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== draft.preferredDate || date.getTime() < today || date.getTime() > today + 365 * 86400000) errors.push('preferred-date')
  }
  if (!draft.privacyAcknowledged) errors.push('privacy-acknowledged')
  if (errors.length) return { ok: false, errors }
  return { ok: true, payload: { full_name: fullName, phone, privacy_acknowledged: true,
    ...(draft.preferredDate ? { preferred_date: draft.preferredDate } : {}),
    ...(draft.doctorId ? { doctor_id: draft.doctorId } : {}), ...(draft.serviceId ? { service_id: draft.serviceId } : {}) } }
}
