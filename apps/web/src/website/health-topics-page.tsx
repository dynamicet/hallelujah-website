import { SiteContent } from '@/design-system/components'
import { requireLocalDemo } from '@/demo/site'
import { healthTopics } from '@/demo/health-topics'
import { HealthLibrary } from '@/website/health-library'
import { patientPageStyles as styles } from '@/website/patient-page'

export const metadata = { title: 'Health & care topics | Hallelujah Hospital',
  description: 'Browse health and care topics to prepare questions and explore related care at Hallelujah Hospital.'
}

export default function HealthTopicsPage() {
  requireLocalDemo()
  return <SiteContent>
    <div className={styles.page} data-care-topics><header className={styles.topicOpening}><h1 data-reveal="0">Health &amp; care topics</h1></header></div>
    <HealthLibrary topics={healthTopics} title="Find a topic" standalone />
  </SiteContent>
}
