import { requestAppointmentLabel } from '@/appointment/copy'
import { appointmentPreviewScenarios } from '@/demo/appointment-request-preview'
import { carePathWithDoctor, isRequestableCare, resolveCareSelection } from '@/demo/care-model'
import { serviceDirectorySource } from '@/demo/service-directory-return'
import { demoScenario } from '@/demo/scenarios'
import { clinicians, requireLocalDemo, services, type DemoSearchParams } from '@/demo/site'
import { AppointmentRequestPreview, type CarePreference } from '@/website/appointment-request-form'
import { Icon } from '@/design-system/components'
import { hospitalContact } from '@/website/hospital-contact'
import { InterfaceLink as Link, InterfaceText } from '@/website/interface-language'
import { PageContent } from '@/website/page-patterns'
import styles from '@/website/appointment-request.module.css'

export const metadata = {
  title: 'Request an appointment | Hallelujah Hospital',
  description: 'Arrange an appointment with Hallelujah Hospital. Share an optional doctor or service preference, or call reception.',
}

export default async function AppointmentPage({ searchParams }: { searchParams: DemoSearchParams }) {
  requireLocalDemo()
  const parameters = await searchParams
  const scenario = demoScenario(parameters.demo, appointmentPreviewScenarios, 'editing')
  const selection = resolveCareSelection({
    doctorId: typeof parameters.doctor === 'string' ? parameters.doctor : undefined,
    serviceId: typeof parameters.service === 'string' ? parameters.service : undefined,
  })
  const careServices = services.filter(({ publicId }) => isRequestableCare(publicId))
  const doctor = clinicians.find(({ publicId }) => publicId === selection.doctorId)
  const service = careServices.find(({ publicId }) => publicId === selection.serviceId)

  // The preview catalogue uses fictional IDs. The form contract uses the same ID shapes as the appointment API.
  const doctors = clinicians.map(({ publicId, details }): CarePreference => ({
    kind: 'doctor', id: `doc_demo_${publicId}`, label: details.name,
  }))
  const serviceOptions = careServices.map(({ publicId, name }): CarePreference => ({
    kind: 'service', id: `svc_demo_${publicId}`, label: name,
  }))
  const preference = doctor
    ? doctors.find(({ id }) => id === `doc_demo_${doctor.publicId}`)
    : serviceOptions.find(({ id }) => id === `svc_demo_${service?.publicId}`)
  const directoryHref = serviceDirectorySource(parameters.from)
  const serviceHref = service ? carePathWithDoctor(service, doctor?.publicId, directoryHref) : undefined
  const returnLink = service && serviceHref
    ? { href: serviceHref, label: `Back to ${service.name}` }
    : doctor?.canonicalPath ? { href: doctor.canonicalPath, label: `Back to ${doctor.details.name}` } : undefined

  return <PageContent>
    <div className={styles.page}>
      <header className={styles.intro}>
        <h1><InterfaceText>{requestAppointmentLabel}</InterfaceText></h1>
        <p>Call reception to arrange a time, or explore the request form below.</p>
        <a href={hospitalContact.phoneHref} className={`text-link ${styles.callShortcut}`}>Call reception <Icon name="phone" /></a>
      </header>
      <div className={styles.layout}>
        <AppointmentRequestPreview
          key={JSON.stringify([selection.doctorId, selection.serviceId, selection.notice, scenario, parameters.start])}
          doctors={doctors}
          services={serviceOptions}
          initialPreference={preference}
          selectionNotice={selection.notice ? 'That preference is unavailable. You can send your request without a preference.' : undefined}
          context={doctor && service ? service.name : undefined}
          scenario={scenario}
          startEditing={parameters.start === 'editing'}
        />
        <aside className={styles.callPanel} id="appointment-call" tabIndex={-1} aria-labelledby="appointment-call-title">
          <h2 id="appointment-call-title">Prefer to call?</h2>
          <p>Call reception to arrange an appointment or get help choosing care.</p>
          <a className={styles.phone} href={hospitalContact.phoneHref}><Icon name="phone" />{hospitalContact.phone}</a>
          <Link className="text-link" href="/contact">Contact &amp; directions <Icon name="arrow-right" /></Link>
        </aside>
      </div>
      <div className={styles.links}>
        {returnLink ? <Link className="text-link" href={returnLink.href}>{returnLink.label}</Link> : null}
        <Link className="text-link" href="/emergency">Emergency information <Icon name="arrow-right" /></Link>
      </div>
    </div>
  </PageContent>
}
