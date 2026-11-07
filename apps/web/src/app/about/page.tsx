import { requireLocalDemo } from '@/demo/site'
import { AboutPage } from '@/website/about-page'

export const metadata = {
  title: 'About Hallelujah | Hallelujah Hospital',
  description: 'The story and values of Hallelujah General Hospital in Addis Ababa, Ethiopia.',
}

export default function About() {
  requireLocalDemo()
  return <AboutPage />
}
