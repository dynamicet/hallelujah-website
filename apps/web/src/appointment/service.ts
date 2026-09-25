import type { AppointmentSubmission } from './schema.ts'

export type AppointmentCreateOutcome =
  | Readonly<{ status: 'accepted'; reference: string }>
  | Readonly<{ status: 'reconciled'; reference: string }>
  | Readonly<{ status: 'idempotency_conflict' }>
  | Readonly<{ status: 'invalid_selector' | 'rate_limited' }>

export type AppointmentCreateCommand = Readonly<{
  submission: AppointmentSubmission
  noticeVersion: string
  abuseKey: string
  correlationId: string
  intentKeyHash: string
  payloadFingerprint: string
}>

export interface AppointmentRepository {
  create(command: AppointmentCreateCommand): Promise<AppointmentCreateOutcome>
}

export type AppointmentAuditEvent = Readonly<{
  event:
    | 'appointment.request.accepted'
    | 'appointment.request.reconciled'
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
    | 'invalid_intent'
    | 'idempotency_conflict'
    | 'reconciled'
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
