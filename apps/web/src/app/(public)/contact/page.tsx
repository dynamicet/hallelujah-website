import { requireLocalDemo } from '@/demo/site'
import { ContactPage } from '@/website/contact-page'

export const metadata = {
  title: 'Contact & directions | Hallelujah Hospital',
  description: 'Contact Hallelujah General Hospital and find directions to our Gotera location in Addis Ababa.',
}

export default function Contact() {
  requireLocalDemo()
  return <ContactPage />
}
