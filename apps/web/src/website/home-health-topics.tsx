import { InterfaceLink as Link } from './interface-language'
import styles from './home-health-topics.module.css'

export function HomeHealthTopics() {
  return <section className={`page-frame ${styles.invitation}`} id="health-library" aria-labelledby="home-health-topics-title">
    <h2 id="home-health-topics-title">Find health topics</h2>
    <div>
      <p>Prepare questions for your next conversation about care.</p>
      <Link className="text-link" href="/health-topics">Explore health &amp; care topics <span aria-hidden="true">→</span></Link>
    </div>
  </section>
}
