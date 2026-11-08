import styles from './consultation-prompts.module.css'

export function ConsultationPrompts() {
  return <div className={styles.prompts}>
    <div><span className={styles.orange} aria-hidden="true" /><h3>What matters to you?</h3><p>Describe how your concern affects daily life and what you hope to discuss. Say if something is difficult to explain.</p></div>
    <div><span className={styles.magenta} aria-hidden="true" /><h3>What happens next?</h3><p>Ask for an explanation of anything unclear, what the next step involves, and who to contact with questions afterwards.</p></div>
  </div>
}
