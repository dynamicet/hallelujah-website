import Link from 'next/link'
import { CopyArrivalDirections } from './copy-arrival-directions'
import { clinicians, data, services } from './site'
import { ClinicianPhotoPlaceholder } from '../design-system/components/clinician-photo-placeholder'
import styles from './home-content.module.css'

export function DemoHeroArtwork() {
  return <figure className={styles.heroArtwork} data-home-artwork="care-conversation">
    {/* Bundled concept art, never presented as hospital photography. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img alt="Illustration of an Ethiopian clinician in conversation with a family" src="/editorial/care-illustration.webp" width={1200} height={800} fetchPriority="high" />
  </figure>
}

export function HomeCareContent({ partial = false }: { readonly partial?: boolean }) {
  const featuredServices = data.home.featuredServiceIds.slice(0, partial ? 1 : 3).map((index) => services[index])
  const featuredDoctors = data.home.featuredDoctorIds.slice(0, partial ? 1 : 3).map((index) => clinicians[index])
  return <>
    <section aria-labelledby="home-services-title" className={`${styles.section} ${styles.services}`} data-home-section="H4">
      <div className={styles.heading}><h2 id="home-services-title">Find your next step.</h2><p>Compare areas of care, then open the directory with a relevant service already selected.</p></div>
      <div className={styles.grid}>{featuredServices.map((service) => <article className={styles.card} key={service.publicId}>
        <h3>{service.name}</h3><p>{service.group.name}</p>
        <p>{service.sections.scope?.[0]}</p>
        <Link href={`/services?q=${encodeURIComponent(service.name)}`}>Find this service</Link>
      </article>)}</div>
      <Link className={styles.directoryLink} href="/services">View all services</Link>
    </section>
    <section aria-labelledby="home-doctors-title" className={`${styles.section} ${styles.tinted}`} data-home-section="H5">
      <div className={styles.heading}><h2 id="home-doctors-title">Care starts with a conversation.</h2><p>Start with an area of care, then read a clinician profile before choosing a next step.</p></div>
      <div className={styles.grid}>{featuredDoctors.map((doctor) => <article className={styles.card} key={doctor.publicId}>
        <div className={styles.portrait}><span aria-hidden="true" className={styles.initials}>{doctor.details.name.split(" ").filter((part) => !/^dr\.?$/i.test(part)).slice(0, 2).map((part) => part[0]).join("")}</span><ClinicianPhotoPlaceholder /></div><h3>{doctor.details.name}</h3><p>{doctor.details.specialties.join(', ')}</p>
        <p>{doctor.details.interests[0]}</p>
        <Link href={doctor.canonicalPath}>View profile</Link>
      </article>)}</div>
      <Link className={styles.directoryLink} href="/doctors">View all doctors</Link>
    </section>
  </>
}

export function HomeInstitutionalContent() {
  return <section aria-labelledby="home-story-title" className={`${styles.section} ${styles.story}`} data-home-section="H8">
    <div className={styles.storyCopy}>
      <h2 id="home-story-title">A hospital. A community. A place to begin.</h2>
      <p>{data.home.story.body}</p>
      <Link href="/doctors">Begin with the care team</Link>
    </div>

  </section>
}

export function HomeDemoContactDetails() {
  const directions = `${data.home.contact.address}. ${data.home.contact.entrance}. Ask at the example reception point for the next step.`
  return <div className={styles.contacts}>
    <section aria-labelledby="home-emergency-title" id="home-emergency">
      <h2 id="home-emergency-title">Emergency information</h2>
      <p>Review the two illustrative emergency routes. No number shown here can be used for care.</p>
      <Link href="/emergency">Review emergency information</Link>
    </section>
    <section aria-labelledby="home-call-title" id="home-call" tabIndex={-1}>
      <h2 id="home-call-title">Contact the hospital</h2>
      <p className={styles.contactValue}>{data.home.contact.call}</p>
      <p>This value is for layout review only. It cannot place a call.</p>
      <Link href="/appointment">Review the request journey</Link>
    </section>
    <section aria-labelledby="home-directions-title" id="home-directions" tabIndex={-1}>
      <h2 id="home-directions-title">Location and arrival</h2>
      <p>{data.home.contact.address}</p>
      <p>{data.home.contact.entrance}</p>
      <ol className={styles.directionSteps}>
        <li>Identify the illustrative main entrance above.</li>
        <li>Go to the example reception point for visit guidance.</li>
        <li>Ask for accessible arrival support when needed.</li>
      </ol>
      <div className={styles.copyAction}><CopyArrivalDirections text={directions} /></div>
    </section>
  </div>
}
