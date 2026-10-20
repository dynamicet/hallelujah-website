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
    heading: 'The directory is offline',
    copy: 'No cached clinician is shown as current. Check your connection and try again.',
  }
  if (state === 'failure') return {
    heading: 'The directory could not load',
    copy: 'No clinician result is shown. Try again or return to the search controls.',
  }
  return {
    heading: 'Clinician information is unavailable',
    copy: 'Please try again later.',
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
          <div className={styles.introductionCopy}>
            <h1 id="clinician-directory-title">Find a clinician</h1>
          </div>
          <aside aria-labelledby="directory-guidance-title" className={styles.guidance}>
            <h2 id="directory-guidance-title">Not sure where to begin?</h2>
            <p>Contact information is unavailable.</p>
            <a className="ds-touch-target" href="#directory-support">Review available help</a>
          </aside>
        </section>

        <section aria-labelledby="directory-search-title" className={styles.directory} data-directory-section="D2">
          <div className={styles.directoryHeading}>
            <p className={styles.eyebrow}>Search and filters</p>
            <h2 id="directory-search-title">Search clinicians</h2>
          </div>
          <SearchControlsForm action={pathname} label="Search clinicians">
            <div className={styles.searchPanel}>
              <SearchBox
                clearHref={clinicianDirectoryUrl(pathname, { ...searchState, page: 1, query: '' }, allowedFilters)}
                hint="Search by name or specialty. Do not enter personal or medical information."
                hintId="clinician-search-hint"
                inputId="clinician-search-query"
                label="Name or specialty"
                maximumLength={clinicianDirectoryQueryMaximum}
                query={searchState.query}
                submitLabel="Search"
              />
            </div>

            <div className={styles.discoveryWorkspace}>
              <aside aria-label="Clinician filters" className={styles.filterRail}>
                <FilterDisclosure label={`Filter clinicians (${activeFilters.length})`} open>
                  <FilterGroup
                    legend="Specialty"
                    options={directory.filters}
                    selectedValues={searchState.filters}
                  />
                  <button type="submit">Apply filters</button>
                </FilterDisclosure>
              </aside>

              <section aria-labelledby="directory-results-title" className={styles.resultsSection} data-directory-section="D3">
                <h2 className={styles.visuallyHidden} id="directory-results-title">Clinician results</h2>
                <div className={styles.resultsToolbar}>
                  {!unavailable ? (
                    <ResultCount id="clinician-result-count">
                      {directory.resultCount} {directory.resultCount === 1 ? 'clinician' : 'clinicians'}
                    </ResultCount>
                  ) : <p className={styles.stateLabel}>Directory status</p>}
                  <ActiveFilterList
                    clearAllHref={clinicianDirectoryUrl(pathname, { page: 1, query: '', filters: [] }, allowedFilters)}
                    clearAllLabel="Clear search and filters"
                    filters={activeFilters}
                    label="Active specialty filters"
                  />
                </div>

                {unavailable ? (
                  <div className={styles.statePanel} data-directory-section="D5" data-directory-unavailable>
                    <h2>{recovery(state).heading}</h2>
                    <p>{recovery(state).copy}</p>
                    <a className="ds-touch-target" href={pathname}>Return to the directory</a>
                  </div>
                ) : noMatches ? (
                  <div className={styles.statePanel} data-directory-section="D5" data-directory-empty>
                    <h2>No clinicians match</h2>
                    <p>Check the name, remove a filter, or reset this directory.</p>
                    <a className="ds-touch-target" href={pathname}>Reset search</a>
                  </div>
                ) : (
                  <>
                    <ol aria-labelledby="clinician-result-count" className={styles.results} data-directory-section="D4"
                      start={(searchState.page - 1) * directory.pageSize + 1}>
                      {directory.results.map((clinician) => (
                        <li key={clinician.publicId}>
                          <article className={styles.card} data-clinician-public-id={clinician.publicId}>
                            <div aria-hidden="true" className={styles.portraitPlaceholder}>
                              <span />
                            </div>
                            <div className={styles.cardContent}>
                              <p className={styles.cardLabel}>Clinician</p>
                              <h2>{clinician.details.name}</h2>
                              <ul className={styles.specialties} aria-label="Specialties">
                                {clinician.details.specialties.map((specialty) => <li key={specialty}>{specialty}</li>)}
                              </ul>
                              <span aria-disabled="true" className={styles.disabledAction}>Profile unavailable</span>
                            </div>
                          </article>
                        </li>
                      ))}
                    </ol>
                    <Pagination
                      label="clinician result pages"
                      next={searchState.page < directory.pageCount ? { ...pages[searchState.page], label: 'Next' } : undefined}
                      pages={pages}
                      previous={searchState.page > 1 ? { ...pages[searchState.page - 2], label: 'Previous' } : undefined}
                    />
                  </>
                )}
              </section>
            </div>
          </SearchControlsForm>
        </section>

        <section aria-labelledby="directory-support-title" className={styles.support} data-directory-section="D6" id="directory-support">
          <h2 id="directory-support-title">Need help choosing?</h2>

          <a className="ds-touch-target" href="#directory-search-title">Return to search</a>
        </section>
      </div>
    </SiteShell>
  )
}
