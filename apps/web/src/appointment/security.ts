import { createHmac, timingSafeEqual } from 'node:crypto'

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
  if (Buffer.byteLength(secret, 'utf8') < 32) {
    throw new Error('Appointment abuse secret must contain at least 32 bytes')
  }
  return createHmac('sha256', secret).update(csrfToken, 'utf8').digest('hex')
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
