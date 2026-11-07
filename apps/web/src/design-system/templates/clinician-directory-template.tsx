import Link from 'next/link'
import type { ReactNode } from 'react'
import type { SiteShellProps } from '../components'
import {
  ActiveFilterList,
  ClinicianPortrait,
  FilterDisclosure,
  FilterGroup,
  Pagination,
  SearchBox,
  SiteShell,
  type ActiveFilter,
  type PaginationPage,
} from '../components'
import { DirectorySearchForm, DirectoryResultCount } from '../components/directory-search'
import { ClinicianTransition, clinicianTransitionName } from '../components/clinician-transition'
import { ClinicianProfileLink } from '../components/clinician-profile-link'
import {
  clinicianDirectoryQueryMaximum,
  clinicianDirectoryUrl,
  type ClinicianDirectoryView,
} from '../../content/clinician-directory.ts'

import styles from './clinician-directory-template.module.css'

export type ClinicianDirectoryReviewState = 'empty' | 'failure' | 'offline' | 'ready'

export interface ClinicianDirectoryTemplateProps {
  readonly introVisual?: ReactNode
  readonly portraits?: Readonly<Record<string, string>>
  readonly portraitDisclosure?: string
  readonly expandedSearch?: boolean
  readonly relatedTopics?: readonly { name: string; href: string }[]
  readonly directory: ClinicianDirectoryView
  readonly profileLinks?: boolean
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

export function ClinicianDirectoryTemplate({ introVisual, portraits, portraitDisclosure, expandedSearch = false, relatedTopics = [], directory, pathname, profileLinks = false, shell, state }: ClinicianDirectoryTemplateProps) {
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
  const currentResultsHref = clinicianDirectoryUrl(pathname, searchState, allowedFilters)
  const firstResult = (searchState.page - 1) * directory.pageSize + 1
  const lastResult = Math.min(searchState.page * directory.pageSize, directory.resultCount)

  return (
    <SiteShell {...shell}>
      {profileLinks ? <ClinicianTransition /> : null}
      <div className={styles.frame} data-clinician-directory-state={state} data-clinician-directory-template data-care-directory={profileLinks || undefined}>
        <section aria-labelledby="clinician-directory-title" className={styles.introduction} data-directory-section="D1">
          <div className={styles.introductionCopy}>
            <h1 data-reveal="0" id="clinician-directory-title">Find a doctor</h1>
            <Link className="ds-touch-target" href="/services">View all services instead</Link>
          </div>
          {introVisual}
        </section>

        <section aria-labelledby="directory-search-title" className={styles.directory} data-directory-section="D2">
          <div className={styles.directoryHeading}>
            <h2 className={styles.visuallyHidden} id="directory-search-title">Search doctors</h2>
          </div>
          <DirectorySearchForm action={pathname} label="Search clinicians" resultKey={currentResultsHref}>
            <div className={styles.searchPanel}>
              <SearchBox
                clearHref={clinicianDirectoryUrl(pathname, { ...searchState, page: 1, query: '' }, allowedFilters)}
                hint={expandedSearch ? 'Try “blood sugar” or a service name. Use general terms; do not enter personal details.' : 'Search by name or specialty. Do not enter personal or medical information.'}
                hintId="clinician-search-hint"
                inputId="clinician-search-query"
                label={expandedSearch ? 'Name, specialty, condition or service' : 'Name or specialty'}
                maximumLength={clinicianDirectoryQueryMaximum}
                query={searchState.query}
                submitLabel="Search"
              />
            </div>

            {relatedTopics.length ? <section className={styles.guidance} aria-labelledby="related-topics-title">
              <h2 id="related-topics-title">Health topics for your search</h2>
              <p>Understand your concern and explore care options. A topic may be available even when no doctor is listed.</p>
              <ul>{relatedTopics.map((topic) => <li key={topic.href}><Link href={topic.href}>{topic.name}</Link></li>)}</ul>
            </section> : null}
            <details data-directory-guidance aria-labelledby="directory-guidance-title" className={styles.guidance}>
              <summary><h2 id="directory-guidance-title">Not sure where to begin?</h2></summary>
              <Link className="ds-touch-target" href="/appointment">Request appointment guidance</Link>
            </details>

            <div className={styles.discoveryWorkspace}>
              <aside aria-label="Clinician filters" className={styles.filterRail}>
                <FilterDisclosure label={`Filter clinicians (${activeFilters.length})`} open>
                  <FilterGroup
                    legend="Specialty"
                    options={directory.filters}
                    selectedValues={searchState.filters}
                  />
                  <button type="submit">Apply filters</button>
                  <a className={`${styles.resetFilters} ds-touch-target`} href={pathname}>Reset all</a>
                </FilterDisclosure>
              </aside>

              <section aria-labelledby="directory-results-title" className={styles.resultsSection} data-directory-section="D3">
                <h2 className={styles.visuallyHidden} id="directory-results-title">Clinician results</h2>
                <div className={styles.resultsToolbar}>
                  {!unavailable ? (
                    <DirectoryResultCount id="clinician-result-count" resultKey={currentResultsHref}>
                      {directory.resultCount} {directory.resultCount === 1 ? 'clinician' : 'clinicians'}
                    </DirectoryResultCount>
                  ) : <p className={styles.stateLabel}>Directory status</p>}
                  {!unavailable && directory.resultCount > 0 ? <p className={styles.resultRange}>
                    Showing {firstResult}–{lastResult} of {directory.resultCount}
                  </p> : null}
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
                    <div className={styles.stateActions}>
                      <a className="ds-touch-target" href={currentResultsHref}>Try this search again</a>
                      <Link className="ds-touch-target" href="/services">View all services</Link>
                    </div>
                  </div>
                ) : noMatches ? (
                  <div className={styles.statePanel} data-directory-section="D5" data-directory-empty>
                    <h2>No clinicians match</h2>
                    <p>Check the spelling, remove a specialty filter, or begin again. You can also explore care by service.</p>
                    <div className={styles.stateActions}>
                      <a className="ds-touch-target" href={pathname}>Reset search</a>
                      <Link className="ds-touch-target" href="/services">View all services</Link>
                    </div>
                  </div>
                ) : (
                  <>
                    {portraitDisclosure ? <p className={styles.portraitDisclosure}>{portraitDisclosure}</p> : null}
                    <ol aria-labelledby="clinician-result-count" className={styles.results} data-directory-section="D4"
                      start={(searchState.page - 1) * directory.pageSize + 1}>
                      {directory.results.map((clinician) => (
                        <li key={clinician.publicId}>
                          <article className={styles.card} data-clinician-public-id={clinician.publicId}>
                            <div className={styles.cardPhoto}><ClinicianPortrait name={clinician.details.name} src={portraits?.[clinician.publicId]} transitionName={clinicianTransitionName(clinician.publicId, 'portrait')} /></div>
                            <div className={styles.cardContent}>
                              {clinician.details.professionalTitle ? <p className={styles.professionalTitle}>{clinician.details.professionalTitle}</p> : null}
                              <h2 data-care-transition-name style={{ viewTransitionName: clinicianTransitionName(clinician.publicId, 'name') }}>{clinician.details.name}</h2>
                              <ul className={styles.specialties} aria-label="Specialties">
                                {clinician.details.specialties.map((specialty) => <li key={specialty}>{specialty}</li>)}
                              </ul>
                              {clinician.details.interests[0] ? <ul className={styles.careInterests} aria-label="Areas of care">{clinician.details.interests.slice(0, 2).map((interest) => <li key={interest}>{interest}</li>)}</ul> : (
                                <p className={styles.cardSummary}>Areas of care not listed.</p>
                              )}
                              {directory.matchReasons?.[clinician.publicId] ? <p className={styles.cardMeta}>{directory.matchReasons[clinician.publicId]}</p> : null}
                              {clinician.details.languages.length ? <p className={styles.cardMeta}>Languages: {clinician.details.languages.join(', ')}</p> : null}
                              {profileLinks ? <ClinicianProfileLink publicId={clinician.publicId} className={`${styles.profileAction} ds-touch-target`} href={`${clinician.canonicalPath}?from=${encodeURIComponent(currentResultsHref)}`} label={`View profile for ${clinician.details.name}`}><span>View profile</span><span aria-hidden="true">→</span></ClinicianProfileLink> : <span aria-disabled="true" className={styles.disabledAction}>Profile unavailable</span>}
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
          </DirectorySearchForm>
        </section>

        <section aria-labelledby="directory-support-title" className={`${styles.support} ds-support-band`} data-directory-section="D6" id="directory-support">
          <h2 id="directory-support-title">Need help choosing?</h2>
          <div className="ds-support-actions">
            <Link className="ds-touch-target" href="/services">View all services</Link>
            <Link className="ds-touch-target" href="/#home-call">Contact information</Link>
          </div>
        </section>
      </div>
    </SiteShell>
  )
}
