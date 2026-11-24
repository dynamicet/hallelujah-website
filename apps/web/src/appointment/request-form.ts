import type { AppointmentCareRoute, AppointmentValidationIssue } from './schema'

export type AppointmentRequestInput = Readonly<{
  full_name: string
  phone: string
  privacy_acknowledged: boolean
}> & (
  | Readonly<{ care_route: Extract<AppointmentCareRoute, 'not_sure'> }>
  | Readonly<{ care_route: Extract<AppointmentCareRoute, 'doctor'>; doctor_id: string }>
  | Readonly<{ care_route: Extract<AppointmentCareRoute, 'service'>; service_id: string }>
)

export type AppointmentRequestResult =
  | Readonly<{ status: 'accepted' | 'reconciled'; reference?: string }>
  | Readonly<{ status: 'rejected'; issues: readonly AppointmentValidationIssue[] }>
  | Readonly<{ status: 'unavailable' | 'unknown' }>

export type SendAppointmentRequest = (input: AppointmentRequestInput) => Promise<AppointmentRequestResult>
