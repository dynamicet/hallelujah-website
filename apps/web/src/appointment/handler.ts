import { randomUUID } from 'node:crypto'
import { parseAppointmentSubmission } from './schema.ts'
import {
  deriveAppointmentAbuseKey,
  readAppointmentJson,
  verifyAppointmentCsrf,
} from './security.ts'
import type { AppointmentAuditSink, AppointmentRepository } from './service.ts'

type AppointmentPostHandlerOptions = Readonly<{
  collectionEnabled: boolean
  repository?: AppointmentRepository
  audit: AppointmentAuditSink
  noticeVersion?: string
  abuseSecret?: string
  now?: () => Date
}>

const jsonHeaders = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
} as const

export function createAppointmentPostHandler(options: AppointmentPostHandlerOptions) {
  return async function postAppointmentRequest(request: Request): Promise<Response> {
    const correlationId = randomUUID()
    if (!options.collectionEnabled) {
      options.audit.record({
        event: 'appointment.request.unavailable',
        outcome: 'collection_disabled',
        correlationId,
      })
      return json(503, { status: 'unavailable' })
    }

    if (!options.repository || !options.noticeVersion || !options.abuseSecret) {
      options.audit.record({
        event: 'appointment.request.failed',
        outcome: 'internal_failure',
        correlationId,
      })
      return json(503, { status: 'unavailable' })
    }

    if (!verifyAppointmentCsrf(request)) {
      options.audit.record({
        event: 'appointment.request.rejected',
        outcome: 'csrf_rejected',
        correlationId,
      })
      return json(403, { status: 'rejected' })
    }

    if (!isJson(request.headers.get('content-type'))) {
      options.audit.record({
        event: 'appointment.request.rejected',
        outcome: 'unsupported_media',
        correlationId,
      })
      return json(415, { status: 'rejected' })
    }

    const body = await readAppointmentJson(request)
    if (!body.ok) {
      options.audit.record({
        event: 'appointment.request.rejected',
        outcome: body.reason === 'oversized' ? 'oversized_body' : 'malformed_body',
        correlationId,
      })
      return json(body.reason === 'oversized' ? 413 : 400, { status: 'rejected' })
    }

    const parsed = parseAppointmentSubmission(body.value, { now: options.now?.() })
    if (!parsed.ok) {
      options.audit.record({
        event: 'appointment.request.rejected',
        outcome: 'invalid_input',
        correlationId,
      })
      return json(400, { status: 'rejected', issues: parsed.issues })
    }

    try {
      const csrfToken = request.headers.get('x-csrf-token') as string
      const outcome = await options.repository.create({
        submission: parsed.value,
        noticeVersion: options.noticeVersion,
        abuseKey: deriveAppointmentAbuseKey(csrfToken, options.abuseSecret),
        correlationId,
      })

      if (outcome.status === 'accepted') {
        options.audit.record({
          event: 'appointment.request.accepted',
          outcome: 'accepted',
          correlationId,
        })
        return json(201, { status: 'accepted', reference: outcome.reference })
      }

      options.audit.record({
        event: 'appointment.request.rejected',
        outcome: outcome.status,
        correlationId,
      })
      return json(outcome.status === 'rate_limited' ? 429 : 422, {
        status: 'rejected',
        ...(outcome.status === 'invalid_selector'
          ? { issues: [{ field: 'care_route', code: 'invalid_selection' }] }
          : {}),
      }, outcome.status === 'rate_limited' ? { 'Retry-After': '600' } : undefined)
    } catch {
      options.audit.record({
        event: 'appointment.request.failed',
        outcome: 'internal_failure',
        correlationId,
      })
      return json(503, { status: 'unavailable' })
    }
  }
}

function isJson(value: string | null): boolean {
  return value?.split(';', 1)[0]?.trim().toLowerCase() === 'application/json'
}

function json(status: number, body: unknown, extraHeaders?: HeadersInit): Response {
  return Response.json(body, {
    status,
    headers: { ...jsonHeaders, ...Object.fromEntries(new Headers(extraHeaders)) },
  })
}
