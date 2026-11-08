// Published hospital facts, checked 4 November 2026. See docs/brand/contact-directions.md.
// Supporting arrival copy must not imply unconfirmed hours, parking or access facilities.
export const hospitalContact = {
  name: 'Hallelujah General Hospital',
  phone: '+251 11 470 4242',
  phoneHref: 'tel:+251114704242',
  alternatePhone: '+251 11 470 4244',
  alternatePhoneHref: 'tel:+251114704244',
  // Same number listed for both services on the legacy emergency page, checked 8 November 2026.
  // Source-checked only; no test call or claim about current staffing/dispatch.
  emergencyPhone: '+251 940 105 692',
  emergencyPhoneHref: 'tel:+251940105692',
  email: 'info@hallelujahhospital.com',
  address: 'Around Gotera Condominium, Addis Ababa, Ethiopia',
  mapHref: 'https://maps.app.goo.gl/VQMCJFfeZX1MtXUN7',
  directionsHref: 'https://www.google.com/maps/dir/?api=1&destination=8.9861882%2C38.7590401',
} as const
