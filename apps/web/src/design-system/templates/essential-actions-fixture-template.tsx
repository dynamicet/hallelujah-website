import {
  ActionButton,
  ActionGroup,
  ActionLink,
  CallAction,
  EmergencyAction,
  LanguageSwitcher,
  SiteShell,
  TextLink,
  type StatusSummaryItem,
} from '../components'

import { ControlledBootstrapTemplate } from './controlled-bootstrap-template'
import { FormPrimitivesFixtureTemplate } from './form-primitives-fixture-template'
import { SearchControlsFixtureTemplate } from './search-controls-fixture-template'
import { SystemStatesFixtureTemplate } from './system-states-fixture-template'

export interface EssentialActionsFixtureTemplateProps {
  readonly searchParameters: Readonly<
    Record<string, string | readonly string[] | undefined>
  >
  readonly statuses: readonly StatusSummaryItem[]
}

export function EssentialActionsFixtureTemplate({
  searchParameters,
  statuses,
}: EssentialActionsFixtureTemplateProps) {
  return (
    <SiteShell
      breadcrumbs={{
        items: [
          { href: '#main-content', label: 'Controlled home' },
          { current: true, href: '#shell-evidence', label: 'Global shell evidence fixture' },
        ],
        label: 'Breadcrumb',
      }}
      footer={{
        brandName: 'Hallelujah Hospital — controlled identity',
        description:
          'Local shell evidence only. No hospital route, contact, translation, or publication is approved from this build.',
        groups: [
          {
            label: 'Controlled core tasks',
            links: [
              { href: '#action-evidence', label: 'Review essential actions' },
              { href: '#foundation-evidence', label: 'Review foundation evidence' },
            ],
          },
          {
            label: 'Access and governance',
            links: [
              { href: '#language-availability', label: 'Language scope' },
              { href: '#controlled-emergency-explanation', label: 'Safety boundary' },
            ],
          },
        ],
        navigationLabel: 'Footer',
      }}
      header={{
        brandName: 'Hallelujah Hospital — controlled identity',
        emergencyAction: (
          <EmergencyAction
            href="#controlled-emergency-explanation"
            label="View controlled urgent guidance"
          />
        ),
        homeHref: '#main-content',
        languageSwitcher: (
          <LanguageSwitcher
            alternate={{
              available: false,
              label: 'አማርኛ',
              lang: 'am',
              reason: 'Approved Amharic shell labels are not available in this controlled build.',
            }}
            currentLabel="English"
            currentLang="en"
            label="Language"
          />
        ),
        menuLabel: 'Menu',
        navigationItems: [
          { current: true, href: '#main-content', label: 'Controlled home' },
          { href: '#foundation-evidence', label: 'Foundation evidence' },
          { href: '#action-evidence', label: 'Essential actions' },
          { href: '#controlled-emergency-explanation', label: 'Safety boundary' },
        ],
        primaryNavigationLabel: 'Primary',
        routineAction: (
          <ActionLink href="#action-evidence" label="Review appointment action" />
        ),
        searchItem: { href: '#shell-evidence', label: 'Search' },
      }}
      skipLinkLabel="Skip to main content"
    >
      <ControlledBootstrapTemplate
        description="The clean Next.js, Payload CMS, and TypeScript foundation is running. No hospital content is published from this build."
        eyebrow="Local development only"
        statuses={statuses}
        title="Controlled application bootstrap"
        withinShell
      >
      <section
        aria-labelledby="shell-evidence-title"
        className="ds-flow ds-section"
        data-global-shell-fixture
        id="shell-evidence"
      >
        <div className="ds-flow ds-reading">
          <h2 id="shell-evidence-title">Global shell evidence fixture</h2>
          <p>
            The header, one responsive navigation order, breadcrumb, language status, skip link,
            and footer use controlled labels. They do not mount or publish the proposed routes.
          </p>
          <p id="language-availability">
            The Amharic language name is a shaping and availability specimen, not an approved
            translation or selectable route.
          </p>
        </div>
      </section>

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
          <a
            className="ds-touch-target"
            data-foundation-control
            href="#foundation-evidence-title"
          >
            Review foundation evidence
          </a>
        </div>
      </section>

      <section
        aria-labelledby="action-evidence-title"
        className="ds-flow ds-section"
        data-essential-actions-fixture
        id="action-evidence"
      >
        <div className="ds-flow ds-reading">
          <h2 id="action-evidence-title">Essential action evidence fixture</h2>
          <p>
            These server-rendered controls use controlled labels and a structurally valid but
            non-staffed specimen number. They are not public hospital routes or contact data.
          </p>

          <ActionGroup label="Routine action examples">
            <ActionLink href="#action-evidence-title" label="Review action guidance" />
            <ActionLink
              href="#controlled-emergency-explanation"
              label="Read the local safety boundary"
              variant="secondary"
            />
            <ActionLink
              href="#action-evidence-title"
              label="Return to the action fixture"
              variant="tertiary"
            />
          </ActionGroup>

          <form action="#action-evidence" method="get">
            <ActionGroup label="Button state examples">
              <ActionButton label="Submit local review" type="submit" />
              <ActionButton
                disabled
                disabledReason="Unavailable until the related controlled operation is approved."
                disabledReasonId="unavailable-operation-reason"
                label="Continue to unavailable operation"
                variant="secondary"
              />
            </ActionGroup>
          </form>

          <ActionGroup label="Contact and emergency examples">
            <CallAction
              availability="Controlled fixture — not a staffed number"
              availabilityId="controlled-call-availability"
              displayNumber="+251 00 000 0000"
              purpose="Prototype appointment help"
            />
            <EmergencyAction
              href="#controlled-emergency-explanation"
              label="View controlled urgent guidance"
            />
          </ActionGroup>

          <p>
            <TextLink
              href="#controlled-emergency-explanation"
              label="Why this fixture cannot publish hospital contact data"
            />
          </p>

          <div className="ds-flow" id="controlled-emergency-explanation" tabIndex={-1}>
            <h3>Controlled safety boundary</h3>
            <p>
              Real emergency, ambulance, switchboard, appointment, and hours data remain withheld
              until the responsible hospital owners approve one canonical record.
            </p>
          </div>
        </div>
      </section>
      <SearchControlsFixtureTemplate searchParameters={searchParameters} />
      <FormPrimitivesFixtureTemplate />
      <SystemStatesFixtureTemplate />
      </ControlledBootstrapTemplate>
    </SiteShell>
  )
}
