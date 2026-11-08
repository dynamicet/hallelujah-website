import { InterfaceText, InterfaceLink as Link } from '@/website/interface-language'

import { ClinicianPortrait, Icon, SiteShell } from '@/design-system/components'
import { clinicians, demoShell } from '@/demo/site'
import { demoClinicianPortraits } from '@/demo/clinician-portraits'
import { hospitalStatistics } from '@/demo/hospital-statistics'
import { patientStories, patientQuotes } from '@/demo/patient-stories'
import { EverydayStories } from './everyday-stories'
import { CareSearch } from './care-search'
import { HomeScenes } from './home-scenes'
import { CareBackgroundFilm } from './care-background-film'
import { SpecialtyGrid } from './specialty-grid'
import { EquipmentShowcase } from './equipment-showcase'
import { HospitalStatistics } from './hospital-statistics'
import { HealthLibrary } from './health-library'
import { healthTopics } from '@/demo/health-topics'
import { partners } from '@/demo/partners'
import { Partners } from './partners'
import { NewsResources } from './news-resources'
import { editorialEntries } from '@/demo/editorial'
import { ContactDirections } from './contact-directions'

const Arrow = () => <span aria-hidden="true">→</span>
const VisitChevron = () => <span aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg></span>
const HeroArrow = () => <span className="welcome-action-arrow" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h15m-6-6 6 6-6 6" /></svg></span>

const featuredClinicians = Object.keys(demoClinicianPortraits).slice(0, 3).flatMap((publicId) => {
  const clinician = clinicians.find((entry) => entry.publicId === publicId)
  return clinician ? [clinician] : []
})

export function WebsiteHome() {
  const shell = demoShell('/')
  const receptionTarget = shell.header.contactTargets?.call
  const receptionAction = <><Icon name="phone" /><span><InterfaceText>Call us</InterfaceText></span></>
  return (
    <SiteShell {...shell}>
      <div className="hospital-home enhanced-home">
        <HomeScenes />
        <section className="welcome cinematic-life" aria-labelledby="welcome-title">
          <div className="welcome-story">
            <div className="welcome-copy">
              <a className="welcome-location" href="#home-directions">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
                <span className="welcome-location-text"><span>Gotera Agona <span aria-hidden="true">·</span></span><span className="welcome-location-city">Addis Ababa, Ethiopia</span></span>
              </a>
              <h1 id="welcome-title">Care for your whole life.</h1>
              <p>Hallelujah General Hospital</p>
              <div className="welcome-actions">
                <Link className="welcome-appointment" href="/appointment"><span>Request an appointment</span><HeroArrow /></Link>
                <div className="welcome-secondary-links">
                  <Link className="text-link" href="/doctors"><span className="welcome-action-label">Find a doctor</span><HeroArrow /></Link>
                  {receptionTarget ? <a className="welcome-call" href={receptionTarget}>{receptionAction}</a> : (
                    <button aria-disabled="true" aria-label="Call reception. Preview only; not connected." className="welcome-call" title="Reception number is not connected." type="button">{receptionAction}</button>
                  )}
                </div>
              </div>
            </div>
            <figure className="welcome-media">
              <picture>
                <source type="image/avif" srcSet="/editorial/hero-care-640.avif 640w, /editorial/hero-care-960.avif 960w, /editorial/hero-care-1536.avif 1536w" sizes="100vw" />
                <img className="welcome-photo" src="/editorial/hero-care-1536.webp" srcSet="/editorial/hero-care-640.webp 640w, /editorial/hero-care-960.webp 960w, /editorial/hero-care-1536.webp 1536w" sizes="100vw" alt="A woman and her clinician taking time for a conversation" width="1536" height="1024" fetchPriority="high" />
              </picture>
            </figure>
          </div>
          <CareSearch />
        </section>

        <nav className="home-quick-access" aria-label="Plan your care and visit">
          <ul className="page-frame home-quick-access-list">
            <li><a href="#visit-guide"><span className="home-quick-access-icon"><Icon name="calendar" /></span><span className="home-quick-access-copy"><strong><InterfaceText>Plan your visit</InterfaceText></strong></span><Arrow /></a></li>
            <li><a href="#home-directions"><span className="home-quick-access-icon"><Icon name="directions" /></span><span className="home-quick-access-copy"><strong><InterfaceText>Contact &amp; directions</InterfaceText></strong></span><Arrow /></a></li>
            <li><Link className="home-quick-access-urgent" href="/emergency"><span className="home-quick-access-icon"><Icon name="emergency" /></span><span className="home-quick-access-copy"><strong>Emergency information</strong><span>Urgent care and ambulance contacts</span></span><Arrow /></Link></li>
          </ul>
        </nav>

        <SpecialtyGrid />

        <section className="team-guide" id="home-doctors" tabIndex={-1} data-signature-scene="team" data-motion-section="specialists" aria-labelledby="team-title">
          <div className="page-frame team-inner">
            <div className="team-intro">
              <div className="team-introduction">
                <h2 data-motion="heading" data-reveal="0" id="team-title">Meet our specialists</h2>
              </div>
              <Link className="team-directory text-link" href="/doctors">View all doctors <Arrow /></Link>
            </div>
            <div className="team-list">
              {featuredClinicians.map((clinician, index) => (
                <Link data-motion="card" data-reveal={index} className="team-person" aria-labelledby={`team-name-${clinician.publicId} team-profile-${clinician.publicId}`} data-clinician-identity-id={clinician.publicId} key={clinician.publicId} href={clinician.canonicalPath}>
                  <div className="team-portrait-frame" data-signature-frame="portrait">
                    <ClinicianPortrait className="team-portrait" name={clinician.details.name} src={demoClinicianPortraits[clinician.publicId]} />
                  </div>
                  <div className="team-person-details">
                    <div className="team-person-heading"><h3 id={`team-name-${clinician.publicId}`}>{clinician.details.name}</h3></div>
                    <p className="team-specialty">{clinician.details.specialties.join(' · ')}</p>
                    {clinician.details.languages.length > 0 && <p className="team-language">Languages: {clinician.details.languages.map((language, languageIndex) => <span className="team-language-item" key={language}>{language}{languageIndex < clinician.details.languages.length - 1 ? ' · ' : ''}</span>)}</p>}
                    {clinician.details.interests[0] && <p className="team-description">{clinician.details.interests[0]}</p>}
                    <span className="team-profile text-link"><span id={`team-profile-${clinician.publicId}`}>View profile</span><Arrow /></span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="team-next-step">
              <h3>Not sure who to see?</h3>
              <Link className="team-care-help" href="/services">Explore care options <Arrow /></Link>
            </div>
          </div>
        </section>

        <section className="visit-guide" data-motion-section="visit" aria-labelledby="visit-guide-title" id="visit-guide" tabIndex={-1}>
          <div className="page-frame visit-inner">
            <div className="visit-copy"><h2 data-motion="heading" data-reveal="0" id="visit-guide-title">Plan <span className="home-heading-accent">your visit</span></h2>
            </div>
            <div className="visit-preparation">
              <div className="visit-questions">
                <details data-motion-disclosure><summary>What should I bring?<VisitChevron /></summary><ul><li>Your questions and medicine list</li><li>Referral letter, if you have one</li><li>Relevant previous results</li></ul><p>Confirm any additional requirements before travelling.</p></details>
                <details data-motion-disclosure><summary>How do appointment requests work?<VisitChevron /></summary><p>Choose your care, add your contact details, and review your request. Contact the hospital to confirm a time.</p></details>
                <details data-motion-disclosure><summary>Can someone come with me?<VisitChevron /></summary><p>Ask the hospital about companions and visiting arrangements before your visit.</p></details>
                <details data-motion-disclosure><summary>When should I arrive?<VisitChevron /></summary><p>Call to confirm department opening hours, your arrival time, and where to check in. Ask how much time to allow for registration. <Link href="/patients-visitors#visit-times">Hours &amp; arrival guidance</Link></p></details>
                <details data-motion-disclosure><summary>What if I need extra support?<VisitChevron /></summary><p>Confirm language, mobility, or other support with the hospital before travelling, including step-free access if you need it.</p></details>
              </div>
              <Link className="text-link" href="/patients-visitors">Read the full visit guide <Arrow /></Link>
            </div>
          </div>
        </section>

        <ContactDirections />

        <HealthLibrary topics={healthTopics} />

        <EquipmentShowcase />

        <section className="hospital-film-section" data-motion-section="film" id="about-hallelujah" aria-labelledby="hospital-film-title">
          <div className="page-frame hospital-film-stage" data-motion="image" data-reveal="1"><CareBackgroundFilm /></div>
        </section>

        <section className="human-care" aria-label="Hospital in numbers and patient stories">
          <HospitalStatistics {...hospitalStatistics} />
          <div className="home-stories-room"><EverydayStories stories={patientStories} quotes={patientQuotes} /></div>
        </section>

        <NewsResources entries={editorialEntries} />

        {/* Shared organizations appear once; the complete list remains available on demand. */}
        <Partners partners={partners} billingPartners={partners} />
      </div>
    </SiteShell>
  )
}
