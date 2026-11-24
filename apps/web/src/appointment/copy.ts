export const requestAppointmentLabel = 'Request appointment'

export const appointmentCopy = {
  preview: {
    introduction: 'Call reception to arrange a time. You can request an appointment without choosing a doctor or service.',
    acknowledgment: 'I understand I need to call reception to arrange my appointment.',
    submit: 'Review details',
    pending: 'Checking details…',
    receipt: 'This form did not send or save your request. Call reception to arrange a time.',
  },
  delivery: {
    introduction: 'Send a request and reception will call you to arrange a time.',
    acknowledgment: 'I understand that reception will use my details to follow up on this request.',
    submit: 'Send appointment request',
    pending: 'Sending request…',
    receipt: 'Reception will call you to arrange a time.',
  },
} as const
