/**
 * Presentation records from https://hallelujahhospital.com/ (retrieved 2026-11-08).
 * Titles and portrait rights require launch review. Founder status for Mrs.
 * Yetnayet was supplied by the client; no other founder status is inferred.
 * Keep this separate from the clinical directory and its demo clinicians.
 */
export const hospitalLeadership = [
  { name: 'Mrs. Yetnayet Eshetu', role: 'Chief Executive Officer', portrait: '/editorial/leadership/yetnayet-eshetu.jpg', framing: 'founder', width: 786, height: 786 },
  { name: 'Professor Getachew Aderaye', role: 'Chief Clinical Officer', portrait: '/editorial/leadership/getachew-aderaye.webp', framing: 'clinical', width: 786, height: 786 },
  { name: 'Mr. Gebeyehu Seyoum', role: 'Deputy Chief Executive Officer', portrait: '/editorial/leadership/gebeyehu-seyoum.webp', framing: 'deputy', width: 786, height: 786 },
  { name: 'Dr. Abdi Ketema', role: 'Medical Director', portrait: '/editorial/leadership/abdi-ketema.webp', framing: 'medical', width: 787, height: 787 },
] as const

export const hospitalFounder = hospitalLeadership[0]
