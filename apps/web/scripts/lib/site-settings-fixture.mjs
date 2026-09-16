import { siteFactKeys } from '../../src/content/site-settings.ts'

/** Reserved fictional numbers and .invalid email; never imported by application source. */
export function siteSettingsFixture(now = new Date('2026-09-16T12:00:00Z')) {
  const instant = (offset) => new Date(now.getTime() + offset).toISOString().replace(/\.\d{3}Z$/, 'Z')
  const values = {
    identity: 'Synthetic hospital identity', emergencyPhone: '+1 (202) 555-0100',
    publicPhone: '+1 (202) 555-0101', switchboardPhone: '+1 (202) 555-0102',
    ambulancePhone: '+1 (202) 555-0100', email: 'contact@hospital.invalid',
    address: 'Synthetic address — no real location', hours: 'Synthetic staffed hours — not operational guidance',
    emergencyEntrance: 'Synthetic emergency entrance, landmark, hours and vehicle route',
    publicEntrance: 'Synthetic public entrance, landmark, hours and parking route',
    accessibleEntrance: 'Synthetic accessible entrance and step-free text directions',
    staffedFallback: 'Synthetic staffed fallback purpose, contact and hours — no real service',
  }
  const labels = {
    identity: 'Hospital identity', emergencyPhone: 'Emergency phone', publicPhone: 'Public enquiry phone',
    switchboardPhone: 'Switchboard phone', ambulancePhone: 'Ambulance phone', email: 'Email',
    address: 'Address', hours: 'Staffed hours', emergencyEntrance: 'Emergency entrance and directions',
    publicEntrance: 'Public entrance and directions', accessibleEntrance: 'Accessible entrance and directions',
    staffedFallback: 'Staffed fallback',
  }
  return {
    publicId: 'pub_030303030303', kind: 'site-settings', status: 'draft', synthetic: true,
    localized: { en: { slug: 'synthetic-site-settings', title: 'Synthetic site settings fixture' },
      am: { slug: 'synthetic-site-settings-am', title: 'የቁጥጥር ምሳሌ' } },
    source: { reference: 'synthetic-site-settings-fixture', recordedAt: instant(-86400000) },
    owner: null, reviewer: null, approval: null, domainApproval: null, relationships: [],
    publishAt: instant(-3600000), reviewAt: instant(86400000 * 30), expiresAt: instant(86400000 * 60),
    withdrawal: null, audit: [],
    siteSettings: Object.fromEntries(siteFactKeys.map((key) => [key, {
      label: { en: labels[key], am: `የቁጥጥር ምሳሌ ${key}` }, value: values[key], state: 'verified',
      source: `synthetic-operations-${key}`, owner: 'Synthetic operations owner',
      verifier: 'Synthetic evidence verifier', checkedAt: instant(-7200000),
      reviewAt: instant(86400000 * 7), expiresAt: instant(86400000 * 14), note: null,
    }])),
  }
}
