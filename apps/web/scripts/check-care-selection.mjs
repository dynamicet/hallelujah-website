import assert from 'node:assert/strict'
import { careEntry, relatedCareIds, relatedDoctorIds, isCompatibleCare, doctorSpecialties, resolveCareSelection, appointmentHref, carePathWithDoctor, clinicianFilters } from '../src/demo/care-model.ts'
import { prepareAppointmentRequest } from '../src/demo/appointment-draft.ts'
const doctorId = 'pub_121212121212'
const serviceId = 'pub_272727272727'
const specialtyId = 'pub_151515151515'
assert.equal(careEntry(specialtyId).kind, 'specialty')
assert.equal(careEntry(serviceId).kind, 'service')
assert.equal(careEntry('unknown'), undefined)
assert.ok(relatedDoctorIds(specialtyId).length > 1)
assert.equal(relatedDoctorIds(serviceId).length, 1)
assert.deepEqual(relatedDoctorIds('pub_171717171717'), [])
assert.equal(isCompatibleCare('pub_151515151515', serviceId), false)
assert.equal(doctorSpecialties(doctorId).length, 2)
assert.ok(relatedCareIds(doctorId).includes(serviceId))
assert.equal(clinicianFilters.length, 3)
assert.ok(clinicianFilters.every((filter) => /^[a-z0-9][a-z0-9-]{0,39}$/u.test(filter.value)))
assert.ok(!clinicianFilters.some((filter) => filter.label === 'Echocardiography'))
for (const selection of [{}, { doctorId }, { serviceId }, { doctorId, serviceId }]) {
  assert.deepEqual(resolveCareSelection(selection), { doctorId: selection.doctorId, serviceId: selection.serviceId })
  const result = prepareAppointmentRequest({ ...selection, fullName: ' TEST PATIENT ', phone: '+251 911 111 111', privacyAcknowledged: true }, new Date('2026-11-08T10:00:00Z'))
  assert.equal(result.ok, true)
  assert.equal(result.payload.doctor_id, selection.doctorId)
  assert.equal(result.payload.service_id, selection.serviceId)
  assert.equal(result.payload.full_name, 'TEST PATIENT')
  assert.equal(Object.hasOwn(result.payload, 'care_route'), false)
  assert.ok(!appointmentHref(selection).includes('undefined'))
}
assert.ok(resolveCareSelection({ doctorId, serviceId: 'pub_262626262626' }).notice)
assert.equal(resolveCareSelection({ doctorId, serviceId: 'pub_262626262626' }).serviceId, undefined)
for (const id of ['unknown', 'pub_111111111111', 'pub_181818181818']) {
  assert.ok(resolveCareSelection({ serviceId: id }).notice)
  assert.equal(prepareAppointmentRequest({ serviceId: id, fullName: 'TEST PATIENT', phone: '+251911111111', privacyAcknowledged: true }).ok, false)
}
assert.equal(carePathWithDoctor({ publicId: serviceId, canonicalPath: '/services/echo/' }, doctorId), `/services/echo/?doctor=${doctorId}`)
assert.equal(carePathWithDoctor({ publicId: serviceId, canonicalPath: '/services/echo/' }, 'pub_151515151515'), '/services/echo/')
assert.equal(prepareAppointmentRequest({ doctorId: 'unknown', fullName: 'X', phone: 'bad', preferredDate: '2026-02-30', privacyAcknowledged: false }).ok, false)
console.log('Care selection, relationship and frontend payload checks passed.')
