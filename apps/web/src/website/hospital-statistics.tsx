type HospitalStatisticsProps = {
  yearsOfService: number
  doctorCount: number
  careAreaCount: number
  annualPatientCount: number
  reportingYear: number
}

export function HospitalStatistics({
  yearsOfService, doctorCount, careAreaCount, annualPatientCount, reportingYear,
}: HospitalStatisticsProps) {
  const number = new Intl.NumberFormat('en')
  return (
    <section className="hospital-statistics" data-motion-section="numbers" aria-labelledby="hospital-statistics-title">
      <div className="page-frame">
        <h2 data-motion="soft" data-reveal="0" id="hospital-statistics-title">Hallelujah in numbers</h2>
        <dl className="hospital-statistics-list" data-reveal-group>
          <div>
            <dt>Years of care</dt>
            <dd className="hospital-statistics-value">{number.format(yearsOfService)}</dd>
          </div>
          <div>
            <dt>Doctors</dt>
            <dd className="hospital-statistics-value">{number.format(doctorCount)}</dd>
          </div>
          <div>
            <dt>Areas of care</dt>
            <dd className="hospital-statistics-value">{number.format(careAreaCount)}</dd>
          </div>
          <div>
            <dt>Patients served in {reportingYear}</dt>
            <dd className="hospital-statistics-value">{number.format(annualPatientCount)}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
