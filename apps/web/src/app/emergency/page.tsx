import { EmergencyTemplate } from '@/design-system/templates'
import Link from 'next/link'
import { data, demoShell, requireLocalDemo, type DemoSearchParams } from '@/demo/site'
import { demoScenario } from '@/demo/scenarios'
import { CopyArrivalDirections } from '@/demo/copy-arrival-directions'
import { EmergencyContactAction, EmergencyDemoMap } from '@/demo/emergency-actions'
import { WebsiteEmergencyPage } from '@/website/emergency-page'

export const metadata = { title: 'Emergency information | Hallelujah Hospital' }

export default async function EmergencyPage({ searchParams }: { searchParams: DemoSearchParams }) {
  requireLocalDemo()
  const scenario = demoScenario((await searchParams).demo,
    ['ready', 'unavailable', 'expired', 'map-failed', 'map-blocked', 'call-handoff-unsupported'] as const, 'ready')
  if (scenario === 'ready') return <WebsiteEmergencyPage />
  if (scenario === 'unavailable' || scenario === 'expired') return <EmergencyTemplate eyebrow="Emergency information" title="Emergency help"
    shell={demoShell('/emergency')} state={{
      announcement: 'static', kind: scenario,
      reason: scenario === 'expired' ? 'required-content-expired' : 'required-arrival-unavailable',
      heading: scenario === 'expired' ? 'Emergency information has expired' : 'Contact information unavailable',
      description: scenario === 'expired'
        ? 'Emergency telephone numbers and directions cannot be shown as current.'
        : 'Emergency telephone numbers and directions are currently unavailable.',
      recoveryHref: '/#home-call',
      recoveryLabel: 'Open illustrative non-emergency contact information',
    }} />
  return <EmergencyTemplate eyebrow="Emergency information" title="Emergency help"
    shell={demoShell('/emergency')} description={data.emergency.description}
    hospitalChoice={data.emergency.hospitalChoice} publicChoice={data.emergency.publicChoice}
    arrival={data.emergency.arrival} scope={data.emergency.scope} warning={data.emergency.warning}
    demoActions={{
      hospital: <EmergencyContactAction label="Hospital emergency route" />,
      public: <EmergencyContactAction label="Public emergency route" />,
      directions: <CopyArrivalDirections text={[data.emergency.arrival.address, data.emergency.arrival.entrance, ...data.emergency.arrival.steps].join('\n')} />,
    }}
    mapStatus={<EmergencyDemoMap key={scenario} scenario={scenario} />}
    support={<p>For non-emergency needs, <Link href="/#home-call">view illustrative contact information</Link>, <Link href="/doctors">browse clinicians</Link>, or <Link href="/services">browse services</Link>.</p>}
    state={{ announcement: 'static', kind: scenario }} />
}
