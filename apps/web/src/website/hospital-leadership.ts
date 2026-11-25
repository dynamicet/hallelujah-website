/**
 * Presentation sources are recorded in about-founder-story.md (retrieved 2026-11-08).
 * Titles and portrait rights require launch review. Backgrounds describe
 * documented roles and, where available, published professional experience.
 * Keep this separate from the clinical directory and its demo clinicians.
 */
export const hospitalLeadership = [
  {
    name: 'Mrs. Yetnayet Eshetu', role: 'Chief Executive Officer',
    background: 'A co-founder of Hallelujah, she leads the hospital’s overall strategy and management.',
    portrait: '/editorial/leadership/yetnayet-eshetu-enhanced.webp', framing: 'founder', width: 1254, height: 1254,
  },
  {
    name: 'Professor Getachew Aderaye', role: 'Chief Clinical Officer',
    background: 'A pulmonologist and co-founder, he brings experience in respiratory medicine and tuberculosis research to Hallelujah’s clinical leadership.',
    portrait: '/editorial/leadership/getachew-aderaye.webp', framing: 'clinical', width: 786, height: 786,
  },
  {
    name: 'Mr. Gebeyehu Seyoum', role: 'Deputy Chief Executive Officer',
    background: 'He supports the chief executive in managing the hospital and putting its priorities into practice.',
    portrait: '/editorial/leadership/gebeyehu-seyoum.webp', framing: 'deputy', width: 786, height: 786,
  },
  {
    name: 'Dr. Abdi Ketema', role: 'Medical Director',
    background: 'He oversees the hospital’s medical services and provides direction to its clinical teams.',
    portrait: '/editorial/leadership/abdi-ketema.webp', framing: 'medical', width: 787, height: 787,
  },
] as const

export const hospitalFounders = [hospitalLeadership[0], hospitalLeadership[1]] as const
