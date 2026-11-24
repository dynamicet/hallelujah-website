import { requestAppointmentLabel } from '@/appointment/copy'
import { TemplateFrame } from './template-frame'
import { InterfaceText, InterfaceLink as Link } from '@/website/interface-language'

import type { ReactNode } from 'react'
import {
  ActiveFilterList,
  DirectorySearchForm, DirectoryResultCount,
  ClinicianTransition, clinicianTransitionName, ClinicianProfileLink,
  type SiteShellProps,
  ClinicianPortrait,
  FilterDisclosure,
  FilterGroup,
  Pagination,
  SearchBox,
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
  readonly introVisual?: ReactNode
  readonly portraits?: Readonly<Record<string, string>>
  readonly portraitDisclosure?: string
  readonly expandedSearch?: boolean
  readonly directory: ClinicianDirectoryView
  readonly profileLinks?: boolean
  readonly pathname: string
  readonly shell?: Omit<SiteShellProps, 'breadcrumbs' | 'children'>
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

export function ClinicianDirectoryTemplate({ introVisual, portraits, portraitDisclosure, expandedSearch = false, directory, pathname, profileLinks = false, shell, state }: ClinicianDirectoryTemplateProps) {
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
    <TemplateFrame shell={shell}>
      {profileLinks ? <ClinicianTransition /> : null}
      <div className={styles.frame} data-clinician-directory-state={state} data-clinician-directory-template data-care-directory={profileLinks || undefined}>
        <section aria-labelledby="clinician-directory-title" className={styles.introduction} data-directory-section="D1">
          <div className={styles.introductionCopy} data-ui-part="introduction-copy" data-directory-introduction-copy>
            <h1 data-reveal="0" id="clinician-directory-title">Find a doctor</h1>
            <Link className="ds-touch-target" href="/services">View all services instead</Link>
          </div>
          {introVisual}
        </section>

        <section aria-labelledby="directory-search-title" className={styles.directory} data-directory-section="D2">
          <div className={styles.directoryHeading} data-ui-part="heading directory-heading" data-directory-heading>
            <h2 className={styles.visuallyHidden} id="directory-search-title">Search doctors</h2>
          </div>
          <DirectorySearchForm action={pathname} label="Search doctors" resultKey={currentResultsHref}>
            <div className={styles.searchPanel} data-ui-part="search-panel" data-directory-search-panel>
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

            <p data-directory-guidance>You can request an appointment without choosing a doctor.{' '}
              <Link className="ds-touch-target" href="/appointment">{requestAppointmentLabel}</Link>
            </p>

            <div className={styles.discoveryWorkspace} data-ui-part="workspace discovery-workspace" data-directory-workspace>
              <aside aria-label="Doctor filters" className={styles.filterRail} data-ui-part="filter-rail" data-directory-filter-rail>
                <FilterDisclosure label={`Filter doctors (${activeFilters.length})`} open>
                  <FilterGroup
                    legend="Specialty"
                    options={directory.filters}
                    selectedValues={searchState.filters}
                  />
                  <button type="submit"><InterfaceText>Apply filters</InterfaceText></button>
                  <a className={`${styles.resetFilters} ds-touch-target`} href={pathname}><InterfaceText>Reset all</InterfaceText></a>
                </FilterDisclosure>
              </aside>

              <section aria-labelledby="directory-results-title" data-ui-part="results results-section" className={styles.resultsSection} data-directory-section="D3">
                <h2 className={styles.visuallyHidden} id="directory-results-title">Doctor results</h2>
                <div data-ui-part="results" className={styles.resultsToolbar}>
                  {!unavailable ? (
                    <DirectoryResultCount id="clinician-result-count" resultKey={currentResultsHref}>
                      {directory.resultCount} {directory.resultCount === 1 ? 'doctor' : 'doctors'}
                    </DirectoryResultCount>
                  ) : <p className={styles.stateLabel}>Directory status</p>}
                  {!unavailable && directory.resultCount > 0 ? <p className={styles.resultRange}>
                    <InterfaceText>{`Showing ${firstResult}–${lastResult} of ${directory.resultCount}`}</InterfaceText>
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
                    <div className={styles.stateActions} data-directory-state-actions>
                      <a className="ds-touch-target" href={currentResultsHref}><InterfaceText>Try this search again</InterfaceText></a>
                      <Link className="ds-touch-target" href="/services">View all services</Link>
                    </div>
                  </div>
                ) : noMatches ? (
                  <div className={styles.statePanel} data-directory-section="D5" data-directory-empty>
                    <h2>No doctors match</h2>
                    <p>Check the spelling, remove a specialty filter, or begin again. You can also explore care by service.</p>
                    <div className={styles.stateActions} data-directory-state-actions>
                      <a className="ds-touch-target" href={pathname}><InterfaceText>Reset search</InterfaceText></a>
                      <Link className="ds-touch-target" href="/services">View all services</Link>
                      {expandedSearch ? <Link className="ds-touch-target" href="/contact#contact-reception">Contact reception</Link> : null}
                    </div>
                  </div>
                ) : (
                  <>
                    {portraitDisclosure ? <p className={styles.portraitDisclosure}>{portraitDisclosure}</p> : null}
                    <ol aria-labelledby="clinician-result-count" data-ui-part="results" className={styles.results} data-directory-section="D4"
                      start={(searchState.page - 1) * directory.pageSize + 1}>
                      {directory.results.map((clinician) => (
                        <li key={clinician.publicId}>
                          <article className={styles.card} data-clinician-public-id={clinician.publicId}>
                            <div className={styles.cardPhoto} data-ui-part="card-photo" data-directory-card-photo><ClinicianPortrait name={clinician.details.name} src={portraits?.[clinician.publicId]} transitionName={clinicianTransitionName(clinician.publicId, 'portrait')} /></div>
                            <div className={styles.cardContent} data-ui-part="card-content" data-directory-card-content>
                              {clinician.details.professionalTitle ? <p className={styles.professionalTitle}>{clinician.details.professionalTitle}</p> : null}
                              <h2 data-care-transition-name style={{ viewTransitionName: clinicianTransitionName(clinician.publicId, 'name') }}>{clinician.details.name}</h2>
                              <ul className={styles.specialties} data-ui-part="specialties" data-directory-specialties aria-label="Specialties">
                                {clinician.details.specialties.map((specialty) => <li key={specialty}>{specialty}</li>)}
                              </ul>
                              {clinician.details.interests[0] ? <ul className={styles.careInterests} aria-label="Areas of care">{clinician.details.interests.slice(0, 2).map((interest) => <li key={interest}>{interest}</li>)}</ul> : (
                                <p className={styles.cardSummary} data-ui-part="card-summary" data-directory-card-summary>Areas of care not listed.</p>
                              )}
                              {directory.matchReasons?.[clinician.publicId] ? <p data-ui-part="card" className={styles.cardMeta}>{directory.matchReasons[clinician.publicId]}</p> : null}
                              {clinician.details.languages.length ? <p data-ui-part="card" className={styles.cardMeta}>Languages: {clinician.details.languages.join(', ')}</p> : null}
                              {profileLinks ? <ClinicianProfileLink publicId={clinician.publicId} data-ui-part="profile-action" className={`${styles.profileAction} ds-touch-target`} href={`${clinician.canonicalPath}?from=${encodeURIComponent(currentResultsHref)}`} label={`View profile for ${clinician.details.name}`}><span>View profile</span><span aria-hidden="true">→</span></ClinicianProfileLink> : <span aria-disabled="true" className={styles.disabledAction}>Profile unavailable</span>}
                            </div>
                          </article>
                        </li>
                      ))}
                    </ol>
                    <Pagination
                      label="doctor result pages"
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

        <section aria-labelledby="directory-support-title" className={`${styles.support} ds-support-band`} data-ui-part="support" data-directory-support data-care-band="assistance" data-directory-section="D6" id="directory-support">
          <h2 id="directory-support-title">Need help choosing?</h2>
          <div className="ds-support-actions">
            <Link className="ds-touch-target" href="/services">View all services</Link>
            <Link className="ds-touch-target" href="/contact">Contact &amp; directions</Link>
          </div>
        </section>
      </div>
    </TemplateFrame>
  )
}
