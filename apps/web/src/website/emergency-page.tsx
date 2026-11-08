import { Icon, SiteShell } from '@/design-system/components'
import { demoShell } from '@/demo/site'
import { hospitalContact } from './hospital-contact'
import styles from './emergency-page.module.css'

export function WebsiteEmergencyPage() {
  return <SiteShell {...demoShell('/emergency')} showHelp={false}>
    <div className={styles.page} data-hospital-emergency lang="en">
      <header className={styles.introduction}>
        <h1>Emergency &amp; ambulance</h1>
        <p>Call the hospital for emergency or ambulance assistance.</p>
      </header>

      <div className={styles.priority}>
        <section className={styles.call} aria-labelledby="emergency-call-title">
          <h2 id="emergency-call-title">Speak to the hospital</h2>
          <p>One number for emergency and ambulance enquiries.</p>
          <a className={styles.callAction} href={hospitalContact.emergencyPhoneHref}>
            <Icon name="phone" />
            <span><span className={styles.actionLabel}>Call emergency &amp; ambulance</span><strong>{hospitalContact.emergencyPhone}</strong></span>
          </a>
          <p className={styles.callNote}>If this device cannot make calls, dial the number from a phone.</p>
          <p className={styles.warning}><strong>Call for urgent help.</strong> Email, online messages and appointment requests are not emergency channels.</p>
        </section>

        <section className={styles.arrival} aria-labelledby="emergency-arrival-title" id="emergency-arrival" tabIndex={-1}>
          <h2 id="emergency-arrival-title">Coming to the hospital?</h2>
          <address><strong>{hospitalContact.name}</strong><span>Around Gotera Condominium</span><span>Addis Ababa, Ethiopia</span></address>
          <a className={styles.directions} href={hospitalContact.directionsHref}>
            <Icon name="directions" /><span>Get directions</span><span aria-hidden="true">↗</span>
          </a>
          <p>Call to confirm the emergency entrance and where to arrive. The map pin marks the hospital location.</p>
          <p className={styles.access}>For step-free access, parking or drop-off guidance, ask the hospital team before travelling.</p>
        </section>
      </div>

      <section className={styles.practical} aria-labelledby="emergency-practical-title">
        <div>
          <h2 id="emergency-practical-title">Ambulance assistance</h2>
          <p>Use the same number to discuss ambulance availability, your collection location and the support needed during transport.</p>
        </div>
        <details className={styles.questions}>
          <summary>What to discuss when you call<span aria-hidden="true">+</span></summary>
          <div>
            <ul>
              <li>Your location and a nearby landmark.</li>
              <li>Whether you need an ambulance or are coming to the hospital.</li>
              <li>Any mobility or access support you need.</li>
            </ul>
            <p>The team can explain current availability and arrival arrangements.</p>
          </div>
        </details>
      </section>

      <section className={styles.reception} aria-labelledby="emergency-reception-title">
        <div><h2 id="emergency-reception-title">General enquiries</h2><p>For appointments and other hospital questions, call reception.</p></div>
        <a href={hospitalContact.phoneHref}><span>Call reception</span><strong>{hospitalContact.phone}</strong><Icon name="arrow-right" /></a>
      </section>

      <div className={styles.mobileCall} aria-label="Emergency telephone access">
        <a href={hospitalContact.emergencyPhoneHref}><Icon name="phone" /><span>Call emergency &amp; ambulance<strong>{hospitalContact.emergencyPhone}</strong></span></a>
      </div>
    </div>
  </SiteShell>
}
