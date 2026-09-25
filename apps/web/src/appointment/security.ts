import { createHmac, timingSafeEqual } from 'node:crypto'

import type { AppointmentSubmission } from './schema.ts'

export const appointmentRequestBodyLimit = 4_096

type BodyReadResult =
  | Readonly<{ ok: true; value: unknown }>
  | Readonly<{ ok: false; reason: 'malformed' | 'oversized' }>

export function verifyAppointmentCsrf(request: Request): boolean {
  const originValue = request.headers.get('origin')
  const fetchSite = request.headers.get('sec-fetch-site')
  if (!originValue || (fetchSite !== null && !['same-origin', 'none'].includes(fetchSite))) {
    return false
  }

  let expectedOrigin: URL
  let suppliedOrigin: URL
  try {
    expectedOrigin = new URL(request.url)
    suppliedOrigin = new URL(originValue)
  } catch {
    return false
  }
  if (suppliedOrigin.origin !== expectedOrigin.origin) return false

  const headerToken = request.headers.get('x-csrf-token')
  const cookieToken = readSingleCookie(request.headers.get('cookie'), '__Host-appointment-csrf')
  if (!headerToken || !cookieToken || !/^[a-zA-Z0-9_-]{43,86}$/u.test(headerToken)) return false

  const left = Buffer.from(headerToken)
  const right = Buffer.from(cookieToken)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function deriveAppointmentAbuseKey(csrfToken: string, secret: string): string {
  return deriveAppointmentKey(secret, 'abuse-v1', csrfToken)
}

export function readAppointmentIntentKey(request: Request): string | undefined {
  const value = request.headers.get('idempotency-key')
  if (!value || !/^[a-zA-Z0-9_-]{43}$/u.test(value)) return undefined

  const decoded = Buffer.from(value, 'base64url')
  if (decoded.byteLength !== 32 || decoded.toString('base64url') !== value) return undefined
  return value
}

export function deriveAppointmentIntentMaterial(
  intentKey: string,
  submission: AppointmentSubmission,
  noticeVersion: string,
  secret: string,
): Readonly<{ intentKeyHash: string; payloadFingerprint: string }> {
  const canonicalPayload = JSON.stringify([
    'appointment-payload-v1',
    submission.careRoute,
    submission.doctorId ?? null,
    submission.serviceId ?? null,
    submission.fullName,
    submission.phone,
    submission.preferredDate ?? null,
    submission.privacyAcknowledged,
    noticeVersion,
  ])

  return Object.freeze({
    intentKeyHash: deriveAppointmentKey(secret, 'intent-key-v1', intentKey),
    payloadFingerprint: deriveAppointmentKey(secret, 'payload-fingerprint-v1', canonicalPayload),
  })
}

export async function readAppointmentJson(request: Request): Promise<BodyReadResult> {
  const declaredLength = request.headers.get('content-length')
  if (declaredLength !== null) {
    const parsedLength = Number(declaredLength)
    if (!Number.isSafeInteger(parsedLength) || parsedLength < 0) {
      return { ok: false, reason: 'malformed' }
    }
    if (parsedLength > appointmentRequestBodyLimit) return { ok: false, reason: 'oversized' }
  }

  if (!request.body) return { ok: false, reason: 'malformed' }
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let byteLength = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      byteLength += value.byteLength
      if (byteLength > appointmentRequestBodyLimit) {
        await reader.cancel()
        return { ok: false, reason: 'oversized' }
      }
      chunks.push(value)
    }
  } catch {
    return { ok: false, reason: 'malformed' }
  }

  const body = new Uint8Array(byteLength)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }

  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(body)
    return { ok: true, value: JSON.parse(text) as unknown }
  } catch {
    return { ok: false, reason: 'malformed' }
  }
}

function readSingleCookie(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined
  const values = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part.startsWith(`${name}=`))
    .map((part) => part.slice(name.length + 1))
  return values.length === 1 ? values[0] : undefined
}

function deriveAppointmentKey(secret: string, purpose: string, value: string): string {
  if (Buffer.byteLength(secret, 'utf8') < 32) {
    throw new Error('Appointment key secret must contain at least 32 bytes')
  }
  return createHmac('sha256', secret)
    .update(`hallelujah-appointment:${purpose}\0`, 'utf8')
    .update(value, 'utf8')
    .digest('hex')
}
