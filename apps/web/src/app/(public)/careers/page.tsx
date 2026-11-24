import { InterfaceLink as Link } from '@/website/interface-language'
import { requireLocalDemo } from '@/demo/site'
import { PatientPage, PatientSection } from '@/website/patient-page'
import { hospitalContact } from '@/website/hospital-contact'
import informationStyles from '@/website/information-pages.module.css'

export const metadata = { title: 'Careers | Hallelujah Hospital', description: 'Explore nursing, laboratory and patient-service roles at Hallelujah General Hospital in Addis Ababa.' }

// Sample vacancies for the requested site composition; replace with approved roles before recruitment use.
const jobs = [
  { id: 'registered-nurse', title: 'Registered Nurse', department: 'Nursing', reference: 'HH-NUR-01', description: 'Bring attentive, practical care to patients and their families, working closely with the clinical team.', responsibilities: ['Provide nursing care and maintain clear patient-care records.', 'Support safe handovers and explain care instructions to patients and companions.', 'Follow infection prevention and patient-safety procedures.'], qualifications: 'BSc in Nursing, a valid Ethiopian professional licence, and experience in a hospital nursing role. Clear communication in Amharic and English.' },
  { id: 'laboratory-technologist', title: 'Medical Laboratory Technologist', department: 'Diagnostics', reference: 'HH-LAB-02', description: 'Help clinicians make informed decisions through careful sample handling, testing and reliable documentation.', responsibilities: ['Prepare and process specimens using laboratory procedures.', 'Carry out quality-control checks and document test work accurately.', 'Follow biosafety practices and coordinate with the receiving clinical team.'], qualifications: 'BSc in Medical Laboratory Science, a valid Ethiopian professional licence, and experience in a clinical laboratory. Careful attention to quality and confidentiality.' },
  { id: 'patient-services-officer', title: 'Patient Services Officer', department: 'Patient experience', reference: 'HH-PSO-03', description: 'Be a helpful first point of contact, guiding patients through registration, appointments and their visit.', responsibilities: ['Welcome patients and help them find the appropriate department.', 'Maintain accurate registration and appointment information.', 'Handle enquiries respectfully and refer concerns to the appropriate team.'], qualifications: 'Diploma or degree in a relevant administrative, business or health field, with customer-service experience. Confident communication in Amharic and English and basic computer skills.' },
]

export default function CareersPage() {
  requireLocalDemo()
  return <PatientPage variant="recruitment" title="Careers" description="Join the clinical, diagnostic and patient services teams at Hallelujah General Hospital in Addis Ababa."
    current="/careers">
    <PatientSection id="open-roles" title={`Open roles (${jobs.length})`}>
      {jobs.length === 0 && <p>There are no open roles at the moment.</p>}
      {jobs.length > 0 && <p>Full time · Addis Ababa</p>}
      <div className={informationStyles.disclosures}>{jobs.map((job) => <details className={informationStyles.disclosure} id={job.id} key={job.id}>
        <summary><span><span className={informationStyles.jobTitle}>{job.title}</span><span className={informationStyles.jobMeta}>{job.department}</span></span></summary>
        <div className={informationStyles.answer}><p>{job.description}</p><h3>What you’ll do</h3><ul>{job.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}</ul><h3>What you’ll bring</h3><p>{job.qualifications}</p><p><strong>Role reference:</strong> {job.reference}</p><a className="text-link" href="#apply">Prepare your application <span aria-hidden="true">→</span></a></div>
      </details>)}</div>
    </PatientSection>
    <PatientSection id="apply" title="How to apply">
      <p>When you contact the hospital, mention the role title and reference. Reception can help you confirm where to send your CV, which documents to include and the closing date.</p>
      <div className={informationStyles.contactLinks}><a className="text-link" href={hospitalContact.phoneHref}>Call about applications <span aria-hidden="true">→</span></a><Link href="/contact">Contact & directions</Link></div>
    </PatientSection>
  </PatientPage>
}
