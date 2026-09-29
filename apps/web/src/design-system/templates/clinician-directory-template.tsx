import type { SiteShellProps } from '../components'
import {
  ActiveFilterList,
  FilterDisclosure,
  FilterGroup,
  Pagination,
  ResultCount,
  SearchBox,
  SearchControlsForm,
  SiteShell,
  type ActiveFilter,
  type PaginationPage,
} from '../components'
import {
  clinicianDirectoryQueryMaximum,
  clinicianDirectoryUrl,
  type ClinicianDirectoryView,
} from '../../content/clinician-directory.ts'

import styles from './clinician-directory-template.module.css'

export type ClinicianDirectoryReviewState = 'empty' | 'failure' | 'offline' | 'ready'

export interface ClinicianDirectoryTemplateProps {
  readonly directory: ClinicianDirectoryView
  readonly pathname: string
  readonly shell: Omit<SiteShellProps, 'breadcrumbs' | 'children'>
  readonly state: ClinicianDirectoryReviewState
}

function recovery(state: Exclude<ClinicianDirectoryReviewState, 'ready'>) {
  if (state === 'offline') return {
    heading: 'The controlled directory is offline',
    copy: 'No cached clinician is shown as current. Restore the local review connection and retry.',
  }
  if (state === 'failure') return {
    heading: 'The controlled directory could not load',
    copy: 'No clinician result is shown. Retry this local review or return to the synthetic search controls.',
  }
  return {
    heading: 'No approved clinician set is available',
    copy: 'A public directory must remain unavailable until the hospital approves a current roster.',
  }
}

export function ClinicianDirectoryTemplate({ directory, pathname, shell, state }: ClinicianDirectoryTemplateProps) {
  const allowedFilters = directory.filters.map((filter) => filter.value)
  const searchState = directory.state
  const activeFilters: ActiveFilter[] = directory.filters
    .filter((filter) => searchState.filters.includes(filter.value))
    .map((filter) => ({
      label: filter.label,
      removeHref: clinicianDirectoryUrl(pathname, {
        ...searchState,
        filters: searchState.filters.filter((value) => value !== filter.value),
        page: 1,
      }, allowedFilters),
      removeLabel: `Remove ${filter.label} filter`,
      value: filter.value,
    }))
  const pages: PaginationPage[] = Array.from({ length: directory.pageCount }, (_, index) => ({
    current: index + 1 === searchState.page,
    href: clinicianDirectoryUrl(pathname, { ...searchState, page: index + 1 }, allowedFilters),
    label: String(index + 1),
    page: index + 1,
  }))
  const unavailable = state !== 'ready'
  const noMatches = !unavailable && directory.resultCount === 0

  return (
    <SiteShell {...shell}>
      <div className={styles.frame} data-clinician-directory-state={state} data-clinician-directory-template>
        <section aria-labelledby="clinician-directory-title" className={styles.introduction} data-directory-section="D1">
          <p className={styles.eyebrow}>Controlled clinician-directory preview</p>
          <h1 id="clinician-directory-title">Find a synthetic clinician</h1>
          <p className={styles.description}>
            Review a directory pattern using fictional names and specialties. It does not represent
            the hospital roster, capability, schedule or availability.
          </p>
          <p className={styles.fixtureNotice}>
            Controlled preview only. Do not use these records to seek care or request an appointment.
          </p>
        </section>

        <section aria-labelledby="directory-search-title" className={styles.directory} data-directory-section="D2">
          <h2 className={styles.visuallyHidden} id="directory-search-title">Search synthetic clinicians</h2>
          <SearchControlsForm action={pathname} label="Search synthetic clinicians">
            <SearchBox
              clearHref={clinicianDirectoryUrl(pathname, { ...searchState, page: 1, query: '' }, allowedFilters)}
              hint="Search fictional names or synthetic specialties only. Do not enter personal or medical information."
              hintId="clinician-search-hint"
              inputId="clinician-search-query"
              label="Search synthetic clinicians"
              maximumLength={clinicianDirectoryQueryMaximum}
              query={searchState.query}
              submitLabel="Search"
            />
            <FilterDisclosure label={`Filter synthetic clinicians (${activeFilters.length})`} open>
              <FilterGroup
                legend="Synthetic specialty"
                options={directory.filters}
                selectedValues={searchState.filters}
              />
              <button type="submit">Apply filters</button>
            </FilterDisclosure>
          </SearchControlsForm>
        </section>

        <section aria-labelledby="directory-results-title" className={styles.resultsSection} data-directory-section="D3">
          <h2 className={styles.visuallyHidden} id="directory-results-title">Synthetic clinician results</h2>
          <ActiveFilterList
            clearAllHref={clinicianDirectoryUrl(pathname, { page: 1, query: '', filters: [] }, allowedFilters)}
            clearAllLabel="Clear search and filters"
            filters={activeFilters}
            label="Active synthetic specialty filters"
          />
          {!unavailable ? (
            <ResultCount id="clinician-result-count">
              {directory.resultCount} synthetic {directory.resultCount === 1 ? 'clinician' : 'clinicians'}
            </ResultCount>
          ) : null}

          {unavailable ? (
            <div className={styles.statePanel} data-directory-section="D5" data-directory-unavailable>
              <h2>{recovery(state).heading}</h2>
              <p>{recovery(state).copy}</p>
              <a className="ds-touch-target" href={pathname}>Return to the controlled directory</a>
            </div>
          ) : noMatches ? (
            <div className={styles.statePanel} data-directory-section="D5" data-directory-empty>
              <h2>No synthetic clinicians match</h2>
              <p>Check the fictional name, remove a filter, or reset this controlled directory.</p>
              <a className="ds-touch-target" href={pathname}>Reset controlled search</a>
            </div>
          ) : (
            <>
              <ol aria-labelledby="clinician-result-count" className={styles.results} data-directory-section="D4"
                start={(searchState.page - 1) * directory.pageSize + 1}>
                {directory.results.map((clinician) => (
                  <li key={clinician.publicId}>
                    <article className={styles.card} data-clinician-public-id={clinician.publicId}>
                      <p className={styles.cardLabel}>Synthetic clinician record</p>
                      <h2>{clinician.details.name}</h2>
                      <ul className={styles.specialties} aria-label="Synthetic specialties">
                        {clinician.details.specialties.map((specialty) => <li key={specialty}>{specialty}</li>)}
                      </ul>
                      <p className={styles.withheld}>Portrait, schedule, availability and appointment actions are withheld.</p>
                      <span aria-disabled="true" className={styles.disabledAction}>Profile unavailable in controlled preview</span>
                    </article>
                  </li>
                ))}
              </ol>
              <Pagination
                label="Synthetic clinician result pages"
                next={searchState.page < directory.pageCount ? { ...pages[searchState.page], label: 'Next' } : undefined}
                pages={pages}
                previous={searchState.page > 1 ? { ...pages[searchState.page - 2], label: 'Previous' } : undefined}
              />
            </>
          )}
        </section>

        <section aria-labelledby="directory-support-title" className={styles.support} data-directory-section="D6" id="directory-support">
          <h2 id="directory-support-title">Need help choosing?</h2>
          <p>No staffed contact or service recommendation is approved for this controlled preview.</p>
          <a className="ds-touch-target" href="#directory-search-title">Return to synthetic search</a>
        </section>
      </div>
    </SiteShell>
  )
}
