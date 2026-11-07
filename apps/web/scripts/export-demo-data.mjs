// Snapshot public-shaped, fictional views for the client-authorized local demo.
// Runtime routes never import the review tools or their workflow records.
import { writeFile } from 'node:fs/promises'
import { clinicianDirectoryFixture, clinicianDirectoryTime } from './lib/clinician-directory-fixture.mjs'
import { serviceDirectoryFixture, serviceDirectoryTime } from './lib/service-directory-fixture.mjs'
import { controlledClinicianIndex } from '../src/content/clinician-view.ts'
import { controlledServiceIndex } from '../src/content/service-view.ts'
import { clinicianExamples, emergencyExample, homeExample, serviceExamples, serviceSourceNames } from './lib/demo-presentation-content.mjs'

// Presentation labels only; retain stable internal IDs and fixture isolation.
const cleanLabel = (value) => value.replace(/Synthetic /gu, '').replace(/^./u, (letter) => letter.toUpperCase())

const doctors = clinicianDirectoryFixture()
const services = serviceDirectoryFixture()
const clinicianViews = controlledClinicianIndex(doctors.records, 'en', clinicianDirectoryTime, 'controlled-fixture')
const serviceViews = controlledServiceIndex(services.records, 'en', serviceDirectoryTime, 'controlled-fixture')
if (clinicianViews.length !== clinicianExamples.length || serviceViews.length !== serviceExamples.length
  || clinicianViews.some((view, index) => cleanLabel(view.details.name) !== clinicianExamples[index].sourceName)
  || serviceViews.some((view, index) => cleanLabel(view.name) !== serviceSourceNames[index])) {
  throw new Error('Demo presentation copy must be reconciled with the controlled fixture counts.')
}
await writeFile(new URL('../src/demo/data.json', import.meta.url), JSON.stringify({
  clinicianFilters: doctors.filters.map((filter) => ({ ...filter, label: cleanLabel(filter.label), specialty: cleanLabel(filter.specialty) })),
  clinicians: clinicianViews.map((clinician, index) => ({
    ...clinician, biography: clinicianExamples[index].biography,
    details: { ...clinician.details,
      name: clinicianExamples[index].name ?? cleanLabel(clinician.details.name),
      specialties: clinician.details.specialties.map(cleanLabel),
      interests: clinicianExamples[index].interests,
      languages: clinicianExamples[index].languages,
      availabilityGuidance: 'Availability is not provided in this demonstration.',
    },
  })),
  serviceFilters: services.filters.map((filter) => ({ ...filter, label: cleanLabel(filter.label) })),
  services: serviceViews.map((service, index) => ({
    ...service, name: cleanLabel(service.name), synonyms: [],
    group: { ...service.group, name: cleanLabel(service.group.name) },
    sections: { scope: [serviceExamples[index]] },
  })),
  home: homeExample,
  emergency: emergencyExample,
}, null, 2) + '\n')
console.log('Local demo snapshot exported; fictional records only.')
