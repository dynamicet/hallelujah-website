import { InterfaceLink as Link } from '@/website/interface-language'
import { notFound } from 'next/navigation'

import {
  ActionButton, ActionGroup, ActionLink, BrandCard, BrandSurface,
  BrandAccent, BrandSurfaceTone, ChoiceGroup, EmergencyAction, FormStatus,
  FormSubmitButton, SelectField, SystemAlert, TaskCard, TextField, TextLink,
  TextAreaField, ErrorSummary, SearchBox, SearchControlsForm, FilterDisclosure,
  FilterGroup, ActiveFilterList, ResultCount, Pagination, SystemState,
  LoadingStatus, NonCriticalSkeleton,
} from '@/design-system/components'
import { isLocalDemo } from '@/server/environment'
import { GovernedCardsFixtureTemplate } from '@/design-system/templates'

import styles from '@/app/component-library/page.module.css'

const fields: readonly { tone: BrandSurfaceTone; accent: BrandAccent; title: string; copy: string }[] = [
  { tone: 'paper', accent: 'none', title: 'A quiet foundation', copy: 'Paper makes room for reading, with blue destinations and a clear action hierarchy.' },
  { tone: 'mist', accent: 'none', title: 'Space to explore care', copy: 'Pale blue groups comparable care information without assigning colors to specialties.' },
  { tone: 'inverse', accent: 'none', title: 'A confident blue field', copy: 'Deep blue supports orientation and closing information. Nested white panels restore their own working context.' },
  { tone: 'supporting', accent: 'none', title: 'Prepare with confidence', copy: 'Richer peach and deep-orange headings identify preparation. Ordinary care actions remain blue.' },
  { tone: 'expressive', accent: 'none', title: 'The people behind care', copy: 'Richer pink and deep-magenta headings give human stories a recognizable editorial setting.' },
  { tone: 'assistance', accent: 'none', title: 'Help with your next step', copy: 'Bounded yellow assistance uses ink for every text role and link state.' },
]

export default function ComponentLibraryPage() {
  if (!isLocalDemo()) notFound()

  return (
    <main className={styles.library} id="component-library">
      <header className={styles.intro}>
        <TextLink href="/" label="Back to the homepage" />

        <h1>Color in practice.</h1>
        <p>Shared components for Hallelujah. Development study: examples below do not submit patient information.</p>
        <nav aria-label="Component study">
          <TextLink href="#surface-study" label="Surfaces & actions" />
          <TextLink href="#card-study" label="Cards" />
          <TextLink href="#form-study" label="Forms" />
          <TextLink href="#notice-study" label="Notices" />
          <TextLink href="#search-study" label="Search & filters" />
          <TextLink href="#extended-states" label="Further states" />
          <TextLink href="#governed-cards-evidence" label="Directory cards" />
        </nav>
      </header>
      <div id="surface-study" className={styles.stack}>
        {fields.map(({ tone, accent, title, copy }) => (
          <BrandSurface key={tone} labelledBy={`surface-${tone}`} tone={tone} accent={accent}>
            <h2 id={`surface-${tone}`}>{title}</h2>
            <p>{copy}</p>
            <ActionGroup label={`${tone} actions`}>
              <ActionLink href="#form-study" label="Find your next step" />
              <ActionLink href="#card-study" label="Explore care" variant="secondary" />
              <ActionLink href="#notice-study" label="Read the guidance" variant="tertiary" />
            </ActionGroup>
            <TextLink href="#card-study" label="An ordinary text link" />
            {tone === 'supporting' || tone === 'expressive' ? (
              <>
                <TextField id={`context-field-${tone}`} name={`context-field-${tone}`} label="Example field" hint="White fields keep their control boundary within a colored context." hintId={`context-hint-${tone}`} />
                <SystemAlert id={`context-status-${tone}`} kind="information" heading="Information within this chapter"><p>Status messages keep their own meaning and white working surface.</p></SystemAlert>
              </>
            ) : null}
            {tone === 'expressive' ? <Link className={styles.storyAction} data-story-action-example href="/#patient-testimonials">Watch story action example</Link> : null}
            {tone === 'inverse' || tone === 'assistance' ? (
              <BrandCard labelledBy={`nested-card-${tone}`}>
                <h3 id={`nested-card-${tone}`}>A white panel within a colored field</h3>
                <p>Nested cards restore light-surface actions and focus indicators.</p>
                <ActionLink href="#form-study" label="Review the form" />
              </BrandCard>
            ) : null}
          </BrandSurface>
        ))}
      </div>
      <section className={styles.study} aria-labelledby="card-study">
        <h2 id="card-study">Cards with a purpose.</h2>
        <div className={styles.grid}>
          <BrandCard labelledBy="guide-card" tone="supporting">
            <h3 id="guide-card">Before your visit</h3>
            <p>An editorial card can hold guidance and a separate action.</p>
            <TextLink href="#form-study" label="See the form example" />
          </BrandCard>
          <BrandCard labelledBy="story-card" tone="expressive">
            <h3 id="story-card">Care, in conversation</h3>
            <p>A pink reading surface and deep-magenta heading establish a human editorial chapter.</p>
            <TextLink href="#notice-study" label="Read the example notices" />
          </BrandCard>
          <TaskCard appearance="panel" href="#form-study" icon="care" label="Explore a care task" description="One linked panel, with a clear destination and visible keyboard focus." />
        </div>
        <TaskCard href="#form-study" icon="arrow-right" label="A compact care route" description="The existing row layout remains the default." />
      </section>
      <section className={styles.study} aria-labelledby="form-study">
        <h2 id="form-study">Clear at every state.</h2>
        <p>State examples only. No data is collected or submitted here.</p>
        <div className={styles.grid}>
          <BrandCard labelledBy="input-study">
            <h3 id="input-study">Fields & choices</h3>
            <TextField id="study-name" name="study-name" label="Your name" hint="Example field; use Tab to review focus." hintId="study-name-hint" autoComplete="off" />
            <TextField id="study-invalid" name="study-invalid" label="Email address" type="email" defaultValue="example" error={{ id: 'study-email-error', message: 'Enter a complete email address.', visible: true }} />
            <SelectField id="study-select" name="study-select" label="Care preference" options={[{ value: '', label: 'Choose an example' }, { value: 'general', label: 'General care' }]} />
            <TextField id="study-disabled" name="study-disabled" label="Unavailable field" disabled hint="This example is unavailable." hintId="study-disabled-hint" />
            <ChoiceGroup id="study-choice" legend="Contact preference" name="study-choice" type="radio" selectedValues={['phone']} options={[{ value: 'phone', label: 'Phone' }, { value: 'email', label: 'Email' }, { value: 'unavailable', label: 'Unavailable option', disabled: true }]} />
          </BrandCard>
          <BrandCard labelledBy="button-study" tone="mist">
            <h3 id="button-study">Actions & feedback</h3>
            <ActionButton label="Available example" />
            <ActionButton label="Unavailable example" disabled disabledReason="Choose a care preference before continuing." disabledReasonId="study-disabled-reason" />
            <FormSubmitButton label="Send example" pending pendingLabel="Sending example…" describedBy="study-pending-copy" />
            <p id="study-pending-copy">Pending state demonstration. No request is being sent.</p>
            <FormStatus id="study-pending" kind="pending" heading="Pending example">
              <p>A request in progress keeps its current context visible.</p>
            </FormStatus>
          </BrandCard>
        </div>
      </section>
      <section className={styles.study} aria-labelledby="notice-study">
        <h2 id="notice-study">Meaning beyond brand color.</h2>
        <p>Every notice includes a label and icon. Red is reserved for urgent or error information.</p>
        <div className={styles.grid}>
          <SystemAlert id="study-information" kind="information" heading="Information example"><p>Use blue for neutral guidance.</p></SystemAlert>
          <SystemAlert id="study-success" kind="success" authoritative heading="Success example"><p>Demonstration of confirmed success styling; no appointment has been created.</p></SystemAlert>
          <SystemAlert id="study-warning" kind="warning" heading="Warning example"><p>Explain what needs attention and what to do next.</p></SystemAlert>
          <SystemAlert id="study-error" kind="error" heading="Error example"><p>Keep the problem visible and provide a recovery action.</p></SystemAlert>
        </div>
        <EmergencyAction href="/emergency" label="View emergency information" />
      </section>
      <section className={styles.study} aria-labelledby="search-study">
        <h2 id="search-study">Find, narrow, continue.</h2>
        <p>Working GET search and filter controls. These examples navigate within this development gallery.</p>
        <BrandCard labelledBy="search-example">
          <h3 id="search-example">Search and filter example</h3>
          <SearchControlsForm action="/component-library#search-study" label="Component search example">
            <SearchBox inputId="library-search" label="Search care" hint="Example controls; use a sample word." hintId="library-search-hint" maximumLength={80} submitLabel="Search" />
            <FilterDisclosure label="Filter care" open>
              <FilterGroup legend="Care type" name="study-type" options={[{ value: 'general', label: 'General care' }, { value: 'specialist', label: 'Specialist care' }]} selectedValues={['general']} />
            </FilterDisclosure>
          </SearchControlsForm>
          <ActiveFilterList label="Example active filters" filters={[{ label: 'General care', value: 'general', removeHref: '#search-study', removeLabel: 'Remove general care example' }]} clearAllHref="#search-study" clearAllLabel="Clear example filters" />
          <ResultCount id="example-results">Pagination and selection styling example</ResultCount>
          <Pagination label="Example result pages" pages={[{ current: true, href: '#search-study', label: 'Example page 1', page: 1 }, { href: '#search-study', label: 'Example page 2', page: 2 }]} next={{ href: '#search-study', label: 'Next example page', page: 2 }} />
        </BrandCard>
      </section>
      <section className={styles.study} aria-labelledby="extended-states">
        <h2 id="extended-states">Details under pressure.</h2>
        <p>Additional state specimens. All messages below are demonstrations, with no request or appointment created.</p>
        <div className={styles.grid}>
          <BrandCard labelledBy="extended-fields">
            <h3 id="extended-fields">Long input & error recovery</h3>
            <TextAreaField id="study-notes" name="study-notes" label="Example notes" hint="Use sample text only." hintId="study-notes-hint" rows={3} />
            <ErrorSummary id="study-error-summary" heading="Review this example" items={[{ fieldId: 'study-invalid', label: 'Email address', message: 'Enter a complete email address.' }]} />
            <FormStatus kind="failure" heading="Failure example"><p>The example could not be sent. Your entered information stays visible.</p></FormStatus>
            <FormStatus kind="warning" heading="Warning example"><p>Review the information before continuing.</p></FormStatus>
          </BrandCard>
          <BrandCard labelledBy="extended-feedback" tone="mist">
            <h3 id="extended-feedback">Loading & preserved context</h3>
            <LoadingStatus id="study-loading" label="Loading example" detail={<p>Existing content remains available.</p>} />
            <NonCriticalSkeleton id="study-skeleton" label="Supplementary content loading example" rows={2} />
            <FormStatus kind="receipt" authoritative reference="DEMO-ONLY" heading="Receipt styling example"><p>Demonstration only. This is not an appointment confirmation.</p></FormStatus>
          </BrandCard>
          {(['empty', 'offline', 'unavailable', 'expired', 'error'] as const).map((kind) => (
            <SystemState key={kind} id={`extended-${kind}`} kind={kind} heading={`${kind[0].toUpperCase()}${kind.slice(1)} example`} recovery={<TextLink href="#search-study" label="Return to the search example" />}><p>Explain the current condition and preserve a useful next step.</p></SystemState>
          ))}
        </div>
      </section>
      <GovernedCardsFixtureTemplate />
    </main>
  )
}
