import type { AppointmentSubmission } from './schema.ts'

export type AppointmentCreateOutcome =
  | Readonly<{ status: 'accepted'; reference: string }>
  | Readonly<{ status: 'invalid_selector' | 'rate_limited' }>

export type AppointmentCreateCommand = Readonly<{
  submission: AppointmentSubmission
  noticeVersion: string
  abuseKey: string
  correlationId: string
}>

export interface AppointmentRepository {
  create(command: AppointmentCreateCommand): Promise<AppointmentCreateOutcome>
}

export type AppointmentAuditEvent = Readonly<{
  event:
    | 'appointment.request.accepted'
    | 'appointment.request.rejected'
    | 'appointment.request.unavailable'
    | 'appointment.request.failed'
  outcome:
    | 'accepted'
    | 'collection_disabled'
    | 'csrf_rejected'
    | 'invalid_input'
    | 'invalid_selector'
    | 'malformed_body'
    | 'oversized_body'
    | 'rate_limited'
    | 'unsupported_media'
    | 'internal_failure'
  correlationId: string
}>

export interface AppointmentAuditSink {
  record(event: AppointmentAuditEvent): void
}

export const consoleAppointmentAuditSink: AppointmentAuditSink = Object.freeze({
  record(event: AppointmentAuditEvent) {
    console.info(JSON.stringify(event))
  },
})
