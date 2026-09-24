export const appointmentCareRoutes = ['doctor', 'service', 'not_sure'] as const

export type AppointmentCareRoute = (typeof appointmentCareRoutes)[number]

export type AppointmentSubmission = Readonly<{
  careRoute: AppointmentCareRoute
  doctorId?: string
  serviceId?: string
  fullName: string
  phone: string
  preferredDate?: string
  privacyAcknowledged: true
}>

type AppointmentInputField =
  | 'body'
  | 'care_route'
  | 'doctor_id'
  | 'service_id'
  | 'full_name'
  | 'phone'
  | 'preferred_date'
  | 'privacy_acknowledged'

export type AppointmentValidationIssue = Readonly<{
  field: AppointmentInputField
  code:
    | 'invalid'
    | 'required'
    | 'unexpected'
    | 'out_of_range'
    | 'invalid_selection'
}>

export type AppointmentValidationResult =
  | Readonly<{ ok: true; value: AppointmentSubmission }>
  | Readonly<{ ok: false; issues: readonly AppointmentValidationIssue[] }>

type ValidationOptions = Readonly<{
  now?: Date
  maximumPreferredDateDays?: number
}>

const acceptedFields = new Set([
  'care_route',
  'doctor_id',
  'service_id',
  'full_name',
  'phone',
  'preferred_date',
  'privacy_acknowledged',
])

const publicDoctorId = /^doc_[a-z0-9][a-z0-9_-]{15,63}$/u
const publicServiceId = /^svc_[a-z0-9][a-z0-9_-]{15,63}$/u
const calendarDate = /^(\d{4})-(\d{2})-(\d{2})$/u
const telephoneCharacters = /^\+?[0-9(). -]+$/u
const unsafeText = /[\p{Cc}\p{Cf}\p{Cs}]/u

export function parseAppointmentSubmission(
  candidate: unknown,
  options: ValidationOptions = {},
): AppointmentValidationResult {
  if (!isRecord(candidate)) {
    return { ok: false, issues: [{ field: 'body', code: 'invalid' }] }
  }

  const issues: AppointmentValidationIssue[] = []
  if (Object.keys(candidate).some((field) => !acceptedFields.has(field))) {
    issues.push({ field: 'body', code: 'unexpected' })
  }

  const careRoute = parseCareRoute(candidate.care_route, issues)
  const fullName = parseFullName(candidate.full_name, issues)
  const phone = parsePhone(candidate.phone, issues)
  const preferredDate = parsePreferredDate(candidate.preferred_date, options, issues)
  const doctorId = parseOptionalId(candidate.doctor_id, 'doctor_id', publicDoctorId, issues)
  const serviceId = parseOptionalId(candidate.service_id, 'service_id', publicServiceId, issues)

  if (candidate.privacy_acknowledged !== true) {
    issues.push({ field: 'privacy_acknowledged', code: 'required' })
  }

  if (careRoute === 'doctor') {
    if (!doctorId) issues.push({ field: 'doctor_id', code: 'required' })
    if (serviceId) issues.push({ field: 'service_id', code: 'unexpected' })
  } else if (careRoute === 'service') {
    if (!serviceId) issues.push({ field: 'service_id', code: 'required' })
    if (doctorId) issues.push({ field: 'doctor_id', code: 'unexpected' })
  } else if (careRoute === 'not_sure') {
    if (doctorId) issues.push({ field: 'doctor_id', code: 'unexpected' })
    if (serviceId) issues.push({ field: 'service_id', code: 'unexpected' })
  }

  if (issues.length > 0 || !careRoute || !fullName || !phone) {
    return { ok: false, issues: Object.freeze(issues) }
  }

  return {
    ok: true,
    value: Object.freeze({
      careRoute,
      ...(doctorId ? { doctorId } : {}),
      ...(serviceId ? { serviceId } : {}),
      fullName,
      phone,
      ...(preferredDate ? { preferredDate } : {}),
      privacyAcknowledged: true as const,
    }),
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseCareRoute(
  value: unknown,
  issues: AppointmentValidationIssue[],
): AppointmentCareRoute | undefined {
  if (typeof value !== 'string' || !appointmentCareRoutes.includes(value as AppointmentCareRoute)) {
    issues.push({ field: 'care_route', code: value === undefined ? 'required' : 'invalid_selection' })
    return undefined
  }
  return value as AppointmentCareRoute
}

function parseFullName(
  value: unknown,
  issues: AppointmentValidationIssue[],
): string | undefined {
  if (typeof value !== 'string') {
    issues.push({ field: 'full_name', code: value === undefined ? 'required' : 'invalid' })
    return undefined
  }

  const normalized = value.normalize('NFC').trim().replace(/\s+/gu, ' ')
  if (normalized.length < 2 || normalized.length > 120 || unsafeText.test(normalized)) {
    issues.push({ field: 'full_name', code: 'invalid' })
    return undefined
  }
  return normalized
}

function parsePhone(
  value: unknown,
  issues: AppointmentValidationIssue[],
): string | undefined {
  if (typeof value !== 'string') {
    issues.push({ field: 'phone', code: value === undefined ? 'required' : 'invalid' })
    return undefined
  }

  const normalized = value.trim().replace(/\s+/gu, ' ')
  const digits = normalized.replace(/\D/gu, '')
  if (
    normalized.length > 32
    || !telephoneCharacters.test(normalized)
    || digits.length < 7
    || digits.length > 15
  ) {
    issues.push({ field: 'phone', code: 'invalid' })
    return undefined
  }
  return normalized
}

function parseOptionalId(
  value: unknown,
  field: 'doctor_id' | 'service_id',
  pattern: RegExp,
  issues: AppointmentValidationIssue[],
): string | undefined {
  if (value === undefined) return undefined
  if (typeof value !== 'string' || !pattern.test(value)) {
    issues.push({ field, code: 'invalid' })
    return undefined
  }
  return value
}

function parsePreferredDate(
  value: unknown,
  options: ValidationOptions,
  issues: AppointmentValidationIssue[],
): string | undefined {
  if (value === undefined) return undefined
  if (typeof value !== 'string') {
    issues.push({ field: 'preferred_date', code: 'invalid' })
    return undefined
  }

  const match = calendarDate.exec(value)
  if (!match) {
    issues.push({ field: 'preferred_date', code: 'invalid' })
    return undefined
  }

  const candidate = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
  if (candidate.toISOString().slice(0, 10) !== value) {
    issues.push({ field: 'preferred_date', code: 'invalid' })
    return undefined
  }

  const now = options.now ?? new Date()
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const maximumDays = options.maximumPreferredDateDays ?? 365
  const maximum = new Date(today)
  maximum.setUTCDate(maximum.getUTCDate() + maximumDays)
  if (candidate < today || candidate > maximum) {
    issues.push({ field: 'preferred_date', code: 'out_of_range' })
    return undefined
  }
  return value
}
