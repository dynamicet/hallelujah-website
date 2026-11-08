import { InterfaceLink as Link } from '@/website/interface-language'
import { requireLocalDemo } from '@/demo/site'
import { PatientPage, PatientSection, patientPageStyles as styles } from '@/website/patient-page'
import { hospitalContact } from '@/website/hospital-contact'
import informationStyles from '@/website/information-pages.module.css'

export const metadata = { title: 'Careers | Hallelujah Hospital', description: 'Explore nursing, laboratory and patient-service roles at Hallelujah General Hospital in Addis Ababa.' }

// Sample vacancies for the requested site composition; replace with approved roles before recruitment use.
const jobs = [
  { id: 'registered-nurse', title: 'Registered Nurse', department: 'Nursing', reference: 'HH-NUR-01', description: 'Bring attentive, practical care to patients and their families, working closely with the clinical team.', responsibilities: ['Provide nursing care and maintain clear patient-care records.', 'Support safe handovers and explain care instructions to patients and companions.', 'Follow infection prevention and patient-safety procedures.'], qualifications: 'BSc in Nursing, a valid Ethiopian professional licence, and experience in a hospital nursing role. Clear communication in Amharic and English.' },
  { id: 'laboratory-technologist', title: 'Medical Laboratory Technologist', department: 'Diagnostics', reference: 'HH-LAB-02', description: 'Help clinicians make informed decisions through careful sample handling, testing and reliable documentation.', responsibilities: ['Prepare and process specimens using laboratory procedures.', 'Carry out quality-control checks and document test work accurately.', 'Follow biosafety practices and coordinate with the receiving clinical team.'], qualifications: 'BSc in Medical Laboratory Science, a valid Ethiopian professional licence, and experience in a clinical laboratory. Careful attention to quality and confidentiality.' },
  { id: 'patient-services-officer', title: 'Patient Services Officer', department: 'Patient experience', reference: 'HH-PSO-03', description: 'Be a helpful first point of contact, guiding patients through registration, appointments and their visit.', responsibilities: ['Welcome patients and help them find the appropriate department.', 'Maintain accurate registration and appointment information.', 'Handle enquiries respectfully and refer concerns to the appropriate team.'], qualifications: 'Diploma or degree in a relevant administrative, business or health field, with customer-service experience. Confident communication in Amharic and English and basic computer skills.' },
] as const

export default function CareersPage() {
  requireLocalDemo()
  return <PatientPage title="Make care your everyday work." description="Join the people who help patients feel heard, supported and cared for at Hallelujah General Hospital in Addis Ababa."
    current="/careers" action={{ href: '#open-roles', label: 'Explore open roles' }}>
    <nav className={styles.jumpLinks} aria-label="Careers sections"><a href="#working-together">Working together</a><a href="#open-roles">Open roles · 3</a><a href="#apply">How to apply</a></nav>
    <PatientSection id="working-together" title="Every role touches a life.">
      <p>From the first greeting at reception to a careful clinical handover, thoughtful work makes a difference to a patient’s day.</p>
      <p>We value people who listen, work well across teams and take pride in doing the small things carefully. Explore opportunities in clinical care, diagnostics and patient services.</p>
    </PatientSection>
    <PatientSection id="open-roles" title="Find your next role">
      <p>Three opportunities. One shared focus: better experiences for patients.</p>
      <div className={informationStyles.disclosures}>{jobs.map((job) => <details className={informationStyles.disclosure} id={job.id} key={job.id}>
        <summary><span><span className={informationStyles.jobTitle}>{job.title}</span><span className={informationStyles.jobMeta}>{job.department} · Full time · Addis Ababa</span></span></summary>
        <div className={informationStyles.answer}><p>{job.description}</p><h3>What you’ll do</h3><ul>{job.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}</ul><h3>What you’ll bring</h3><p>{job.qualifications}</p><p><strong>Role reference:</strong> {job.reference}</p><a className="text-link" href="#apply">Prepare your application <span aria-hidden="true">→</span></a></div>
      </details>)}</div>
    </PatientSection>
    <PatientSection id="apply" title="Take the next step" tone>
      <p>Have your CV, a short introduction and the role title ready. For clinical roles, include details of your professional qualification and current licence.</p>
      <ol><li>Choose a role and note its reference.</li><li>Prepare a CV highlighting the experience relevant to that role.</li><li>Contact the hospital to confirm the application channel, required documents and closing date before submitting.</li></ol>
      <div className={informationStyles.contactLinks}><a className="text-link" href={hospitalContact.phoneHref}>Call about applications <span aria-hidden="true">→</span></a><Link href="/contact">Contact & directions</Link></div>
    </PatientSection>
  </PatientPage>
}
