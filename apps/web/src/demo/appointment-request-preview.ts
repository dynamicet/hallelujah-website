import type { SendAppointmentRequest } from '@/appointment/request-form'


export const appointmentPreviewScenarios = [
  'editing', 'validation', 'pending', 'known-failure', 'unknown', 'duplicate', 'receipt', 'delivery-warning', 'workflow-unavailable',
] as const
export type AppointmentPreviewScenario = (typeof appointmentPreviewScenarios)[number]

/** Exercise the appointment interface locally without transmitting or storing the submission. */
export function previewAppointmentRequest(scenario: AppointmentPreviewScenario): SendAppointmentRequest {
  return async () => {
    if (scenario === 'known-failure' || scenario === 'workflow-unavailable') return { status: 'unavailable' }
    if (scenario === 'unknown') return { status: 'unknown' }
    const parts = Array.from(crypto.getRandomValues(new Uint32Array(2)), value => value.toString(16).padStart(8, '0').toUpperCase())
    return { status: scenario === 'duplicate' ? 'reconciled' : 'accepted', reference: `HH-${parts.join('-')}` }
  }
}
