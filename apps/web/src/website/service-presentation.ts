import type { ServiceCardPresentation } from '@/design-system/components'

/** Presentation belongs to the website, never inferred from medical names or route slugs. */
const serviceArtwork: Readonly<Record<string, ServiceCardPresentation>> = {
  pub_111111111111: { imageSrc: '/services/admission.webp' },
  pub_141414141414: { imageSrc: '/services/general-medicine.webp' },
  pub_151515151515: { imageSrc: '/services/heart.webp', specialty: 'Cardiology' },
  pub_161616161616: { imageSrc: '/services/lungs.webp' },
  pub_171717171717: { imageSrc: '/services/rehabilitation.webp' },
  pub_181818181818: { imageSrc: '/services/speech.webp' },
  pub_212121212121: { imageSrc: '/services/follow-up.webp' },
  pub_232323232323: { imageSrc: '/services/brain.webp', specialty: 'Neurology' },
  pub_242424242424: { imageSrc: '/services/kidneys.webp', specialty: 'Nephrology' },
  pub_262626262626: { imageSrc: '/editorial/family-care.webp' },
  pub_272727272727: { imageSrc: '/services/echocardiography.webp' },
  pub_252525252525: { imageSrc: '/services/joints.webp', specialty: 'Orthopedics' },
}

export function servicePresentation(publicId: string): ServiceCardPresentation {
  return serviceArtwork[publicId] ?? { imageSrc: '/services/general-medicine.webp' }
}
