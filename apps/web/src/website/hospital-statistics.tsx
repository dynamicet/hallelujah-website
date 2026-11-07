import { StatisticsCountUp } from './statistics-count-up'

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
  const value = (count: number) => <span className="statistics-count" data-count-to={count}>
    <span className="statistics-count-final">{number.format(count)}</span>
    <span className="statistics-count-overlay" aria-hidden="true" hidden>{number.format(count)}</span>
  </span>

  return (
    <section className="hospital-statistics" data-motion-section="numbers" data-count-state="static" aria-labelledby="hospital-statistics-title">
      <div className="page-frame">
        <h2 data-motion="soft" data-reveal="0" id="hospital-statistics-title">Hallelujah in numbers</h2>
        <dl className="hospital-statistics-list">
          <div>
            <dt>Years of care</dt>
            <dd className="hospital-statistics-value">{value(yearsOfService)}</dd>
          </div>
          <div>
            <dt>Doctors</dt>
            <dd className="hospital-statistics-value">{value(doctorCount)}</dd>
          </div>
          <div>
            <dt>Areas of care</dt>
            <dd className="hospital-statistics-value">{value(careAreaCount)}</dd>
          </div>
          <div>
            <dt>Patients served in {reportingYear}</dt>
            <dd className="hospital-statistics-value">{value(annualPatientCount)}</dd>
          </div>
        </dl>
        <StatisticsCountUp />
      </div>
    </section>
  )
}
