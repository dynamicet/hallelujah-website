import data from './data.json'

// Presentation fixtures only. Replace institutional figures with approved source
// records before publication; directory totals follow the same preview dataset.
export const hospitalStatistics = {
  isPreview: true,
  yearsOfService: 18,
  doctorCount: data.clinicians.length,
  careAreaCount: data.services.length,
  annualPatientCount: 24000,
  reportingYear: 2025,
}
