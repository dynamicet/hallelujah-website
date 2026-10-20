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
  serviceDirectoryQueryMaximum,
  serviceDirectoryUrl,
  type ServiceDirectoryView,
} from '../../content/service-directory.ts'

import styles from './service-directory-template.module.css'

export type ServiceDirectoryReviewState = 'empty' | 'failure' | 'loading' | 'offline' | 'ready'

export interface ServiceDirectoryTemplateProps {
  readonly directory: ServiceDirectoryView
  readonly pathname: string
  readonly shell: Omit<SiteShellProps, 'breadcrumbs' | 'children'>
  readonly state: ServiceDirectoryReviewState
}

function recovery(state: Exclude<ServiceDirectoryReviewState, 'ready' | 'loading'>) {
  if (state === 'offline') return {
    heading: 'The service directory is offline',
    copy: 'No cached service is shown as current. Check your connection and try again.',
  }
  if (state === 'failure') return {
    heading: 'The service directory could not load',
    copy: 'No service result is shown. Try again or return to the search controls.',
  }
  return {
    heading: 'Service information is unavailable',
    copy: 'Please try again later.',
  }
}

export function ServiceDirectoryTemplate({ directory, pathname, shell, state }: ServiceDirectoryTemplateProps) {
  const allowedGroups = directory.filters.map((filter) => filter.value)
  const searchState = directory.state
  const activeFilters: ActiveFilter[] = directory.filters
    .filter((filter) => searchState.groups.includes(filter.value))
    .map((filter) => ({
      label: filter.label,
      removeHref: serviceDirectoryUrl(pathname, {
        ...searchState,
        groups: searchState.groups.filter((value) => value !== filter.value),
        page: 1,
      }, allowedGroups),
      removeLabel: `Remove ${filter.label} group`,
      value: filter.value,
    }))
  const pages: PaginationPage[] = Array.from({ length: directory.pageCount }, (_, index) => ({
    current: index + 1 === searchState.page,
    href: serviceDirectoryUrl(pathname, { ...searchState, page: index + 1 }, allowedGroups),
    label: String(index + 1),
    page: index + 1,
  }))
  const unavailable = !['ready', 'loading'].includes(state)
  const recoveryContent = state === 'empty' || state === 'failure' || state === 'offline'
    ? recovery(state) : null
  const noMatches = state === 'ready' && directory.resultCount === 0

  return (
    <SiteShell {...shell}>
      <div className={styles.frame} data-service-directory-state={state} data-service-directory-template>
        <section aria-labelledby="service-directory-title" className={styles.introduction} data-directory-section="S1">
          <h1 id="service-directory-title">Find a service</h1>
        </section>

        {searchState.urgent ? (
          <aside aria-labelledby="service-urgent-title" className={styles.urgentNotice} data-directory-section="S2">
            <p className={styles.eyebrow}>Emergency information</p>
            <h2 id="service-urgent-title">Emergency guidance must take priority</h2>
            <p>
              This directory does not assess medical urgency.
            </p>
            <a className="ds-touch-target" href="#service-directory-support">Contact information</a>
          </aside>
        ) : null}

        <section aria-labelledby="service-search-title" className={styles.directory} data-directory-section="S3">
          <div className={styles.directoryHeading}>
            <p className={styles.eyebrow}>Browse by service</p>
            <h2 id="service-search-title">Search services</h2>
          </div>
          <SearchControlsForm action={pathname} label="Search services">
            <div className={styles.searchPanel}>
              <SearchBox
                clearHref={serviceDirectoryUrl(pathname, { ...searchState, page: 1, query: '' }, allowedGroups)}
                hint="Search by service name. Do not enter personal or medical information."
                hintId="service-search-hint"
                inputId="service-search-query"
                label="Search services"
                maximumLength={serviceDirectoryQueryMaximum}
                query={searchState.query}
                submitLabel="Search"
              />
            </div>

            <div className={styles.discoveryWorkspace}>
              <aside aria-label="service groups" className={styles.filterRail}>
                <FilterDisclosure label={`Browse groups (${activeFilters.length})`} open>
                  <FilterGroup
                    legend="service group"
                    name="group"
                    options={directory.filters}
                    selectedValues={searchState.groups}
                  />
                  <button type="submit">Apply groups</button>
                </FilterDisclosure>
              </aside>

              <section aria-labelledby="service-results-title" aria-busy={state === 'loading' ? 'true' : undefined}
                className={styles.resultsSection} data-directory-section="S4" id="service-results">
                <h2 className={styles.visuallyHidden} id="service-results-title">Service results</h2>
                <div className={styles.resultsToolbar}>
                  {!unavailable && state !== 'loading' ? (
                    <ResultCount id="service-result-count">
                      {directory.resultCount} {directory.resultCount === 1 ? 'service' : 'services'}
                    </ResultCount>
                  ) : <p className={styles.stateLabel}>Directory status</p>}
                  <ActiveFilterList
                    clearAllHref={serviceDirectoryUrl(pathname, { page: 1, query: '', groups: [] }, allowedGroups)}
                    clearAllLabel="Clear search and groups"
                    filters={activeFilters}
                    label="Active service groups"
                  />
                </div>

                {state === 'loading' ? (
                  <div className={styles.statePanel} data-directory-section="S5" data-directory-loading role="status">
                    <h2>Loading service results</h2>
                    <p>Please wait.</p>
                  </div>
                ) : recoveryContent ? (
                  <div className={styles.statePanel} data-directory-section="S6" data-directory-unavailable>
                    <h2>{recoveryContent.heading}</h2>
                    <p>{recoveryContent.copy}</p>
                    <a className="ds-touch-target" href={pathname}>Return to the directory</a>
                  </div>
                ) : noMatches ? (
                  <div className={styles.statePanel} data-directory-section="S6" data-directory-empty>
                    <h2>No services match</h2>
                    <p>Check the search terms, remove a group, or reset this directory.</p>
                    <a className="ds-touch-target" href={pathname}>Reset search</a>
                  </div>
                ) : (
                  <div className={styles.groupCollection} data-directory-section="S5">
                    {directory.groups.map((group) => (
                      <section aria-labelledby={`service-group-${group.publicId}`} className={styles.resultGroup} key={group.publicId}>
                        <h2 id={`service-group-${group.publicId}`}>{group.name}</h2>
                        <ol aria-labelledby={`service-group-${group.publicId}`} className={styles.results}>
                          {group.services.map((service) => (
                            <li key={service.publicId}>
                              <article className={styles.card} data-service-public-id={service.publicId}>
                                <p className={styles.cardLabel}>Service</p>
                                <h3>{service.name}</h3>
                                <p>{service.sections.scope?.[0]}</p>
                                <span aria-disabled="true" className={styles.disabledAction}>
                                  Service details unavailable
                                </span>
                              </article>
                            </li>
                          ))}
                        </ol>
                      </section>
                    ))}
                    <Pagination
                      label="service result pages"
                      next={searchState.page < directory.pageCount ? { ...pages[searchState.page], label: 'Next' } : undefined}
                      pages={pages}
                      previous={searchState.page > 1 ? { ...pages[searchState.page - 2], label: 'Previous' } : undefined}
                    />
                  </div>
                )}
              </section>
            </div>
          </SearchControlsForm>
        </section>

        <section aria-labelledby="service-support-title" className={styles.support} data-directory-section="S7"
          id="service-directory-support">
          <h2 id="service-support-title">Still not sure?</h2>

          <a className="ds-touch-target" href="#service-search-title">Return to search</a>
        </section>
      </div>
    </SiteShell>
  )
}
