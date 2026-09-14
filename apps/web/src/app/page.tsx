import { ControlledBootstrapTemplate } from '@/design-system/templates'

const statuses = [
  { description: 'Disabled', term: 'Personal-data collection' },
  { description: 'Disabled', term: 'External providers' },
  { description: 'Not mounted', term: 'CMS routes and content models' },
] as const

export default function BootstrapPage() {
  return (
    <ControlledBootstrapTemplate
      description="The clean Next.js, Payload CMS, and TypeScript foundation is running. No hospital content is published from this build."
      eyebrow="Local development only"
      statuses={statuses}
      title="Controlled application bootstrap"
    >
      <section
        aria-labelledby="foundation-evidence-title"
        className="ds-flow ds-section"
        data-foundation-fixture
        id="foundation-evidence"
      >
        <div className="ds-flow ds-reading">
          <h2 id="foundation-evidence-title">Foundation evidence fixture</h2>
          <p>
            This local-only text checks readable measure, long-content wrapping, immediate system
            fallback, and stable hierarchy without relying on imagery or JavaScript.
          </p>
          <p data-long-content>
            Representative expanded interface guidance remains complete and readable when labels
            wrap across compact, tablet, desktop, and zoom-equivalent layouts.
          </p>
          <p>
            <span lang="am">እንኳን ደህና መጡ</span>{' '}
            <span>— unreviewed Ethiopic shaping fixture</span>
          </p>
          <a className="ds-touch-target" data-foundation-control href="#foundation-evidence-title">
            Review foundation evidence
          </a>
        </div>
      </section>
    </ControlledBootstrapTemplate>
  )
}
