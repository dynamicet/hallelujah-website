export const requestAppointmentLabel = 'Request appointment'

export const appointmentCopy = {
  preview: {
    introduction: 'Try the form with sample details, or call reception to arrange an appointment.',
    acknowledgment: 'I understand this is a sample request and reception will not contact me.',
    submit: 'Check sample request',
    pending: 'Checking sample request…',
    receipt: 'This preview did not send or save a request.',
  },
  delivery: {
    introduction: 'Send a request and reception will call you to arrange a time.',
    acknowledgment: 'I understand that reception will use my details to follow up on this request.',
    submit: 'Send appointment request',
    pending: 'Sending request…',
    receipt: 'Reception will call you to arrange a time.',
  },
} as const
