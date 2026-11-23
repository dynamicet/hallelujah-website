/**
 * Presentation sources are recorded in about-founder-story.md (retrieved 2026-11-08).
 * Titles and portrait rights require launch review. The hospital identified
 * Mrs. Yetnayet Eshetu and Professor Getachew Aderaye as founders.
 * Keep this separate from the clinical directory and its demo clinicians.
 */
export const hospitalLeadership = [
  { name: 'Mrs. Yetnayet Eshetu', role: 'Chief Executive Officer', portrait: '/editorial/leadership/yetnayet-eshetu-enhanced.webp', framing: 'founder', width: 1254, height: 1254 },
  { name: 'Professor Getachew Aderaye', role: 'Chief Clinical Officer', portrait: '/editorial/leadership/getachew-aderaye.webp', framing: 'clinical', width: 786, height: 786 },
  { name: 'Mr. Gebeyehu Seyoum', role: 'Deputy Chief Executive Officer', portrait: '/editorial/leadership/gebeyehu-seyoum.webp', framing: 'deputy', width: 786, height: 786 },
  { name: 'Dr. Abdi Ketema', role: 'Medical Director', portrait: '/editorial/leadership/abdi-ketema.webp', framing: 'medical', width: 787, height: 787 },
] as const

export const hospitalFounders = [hospitalLeadership[0], hospitalLeadership[1]] as const
