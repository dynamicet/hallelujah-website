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
    heading: 'The controlled service directory is offline',
    copy: 'No cached service is shown as current. Restore the local review connection and retry.',
  }
  if (state === 'failure') return {
    heading: 'The controlled service directory could not load',
    copy: 'No service result is shown. Retry this local review or return to the synthetic search controls.',
  }
  return {
    heading: 'No approved service set is available',
    copy: 'A public directory must remain unavailable until the hospital approves a current taxonomy and launch subset.',
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
          <p className={styles.eyebrow}>Controlled service-directory preview</p>
          <h1 id="service-directory-title">Find a synthetic service</h1>
          <p className={styles.description}>
            Review a recognition and navigation pattern using fictional service names, groups and terms.
            It does not identify a condition, recommend treatment or represent hospital capability.
          </p>
          <p className={styles.fixtureNotice}>
            Controlled preview only. Do not use these records to choose care or respond to an emergency.
          </p>
        </section>

        {searchState.urgent ? (
          <aside aria-labelledby="service-urgent-title" className={styles.urgentNotice} data-directory-section="S2">
            <p className={styles.eyebrow}>Synthetic urgent-term boundary</p>
            <h2 id="service-urgent-title">Emergency guidance must take priority</h2>
            <p>
              This fictional trigger demonstrates placement only. Approved emergency wording, contacts and routes
              remain unavailable; this directory does not estimate urgency.
            </p>
            <a className="ds-touch-target" href="#service-directory-support">Review the unavailable support boundary</a>
          </aside>
        ) : null}

        <section aria-labelledby="service-search-title" className={styles.directory} data-directory-section="S3">
          <div className={styles.directoryHeading}>
            <p className={styles.eyebrow}>Search and one governed taxonomy</p>
            <h2 id="service-search-title">Search synthetic services</h2>
          </div>
          <SearchControlsForm action={pathname} label="Search synthetic services">
            <div className={styles.searchPanel}>
              <SearchBox
                clearHref={serviceDirectoryUrl(pathname, { ...searchState, page: 1, query: '' }, allowedGroups)}
                hint="Search fictional service names or synthetic recognition terms only. Do not enter personal or medical information."
                hintId="service-search-hint"
                inputId="service-search-query"
                label="Search synthetic services"
                maximumLength={serviceDirectoryQueryMaximum}
                query={searchState.query}
                submitLabel="Search"
              />
            </div>

            <div className={styles.discoveryWorkspace}>
              <aside aria-label="Synthetic service groups" className={styles.filterRail}>
                <FilterDisclosure label={`Browse synthetic groups (${activeFilters.length})`} open>
                  <FilterGroup
                    legend="Synthetic service group"
                    name="group"
                    options={directory.filters}
                    selectedValues={searchState.groups}
                  />
                  <button type="submit">Apply groups</button>
                </FilterDisclosure>
              </aside>

              <section aria-labelledby="service-results-title" aria-busy={state === 'loading' ? 'true' : undefined}
                className={styles.resultsSection} data-directory-section="S4" id="service-results">
                <h2 className={styles.visuallyHidden} id="service-results-title">Synthetic service results</h2>
                <div className={styles.resultsToolbar}>
                  {!unavailable && state !== 'loading' ? (
                    <ResultCount id="service-result-count">
                      {directory.resultCount} synthetic {directory.resultCount === 1 ? 'service' : 'services'}
                    </ResultCount>
                  ) : <p className={styles.stateLabel}>Directory status</p>}
                  <ActiveFilterList
                    clearAllHref={serviceDirectoryUrl(pathname, { page: 1, query: '', groups: [] }, allowedGroups)}
                    clearAllLabel="Clear search and groups"
                    filters={activeFilters}
                    label="Active synthetic service groups"
                  />
                </div>

                {state === 'loading' ? (
                  <div className={styles.statePanel} data-directory-section="S5" data-directory-loading role="status">
                    <h2>Loading controlled service results</h2>
                    <p>No result is presented as current while the controlled source is being checked.</p>
                  </div>
                ) : recoveryContent ? (
                  <div className={styles.statePanel} data-directory-section="S6" data-directory-unavailable>
                    <h2>{recoveryContent.heading}</h2>
                    <p>{recoveryContent.copy}</p>
                    <a className="ds-touch-target" href={pathname}>Return to the controlled directory</a>
                  </div>
                ) : noMatches ? (
                  <div className={styles.statePanel} data-directory-section="S6" data-directory-empty>
                    <h2>No synthetic services match</h2>
                    <p>Check the fictional wording, remove a group, or reset this controlled directory. No service is inferred.</p>
                    <a className="ds-touch-target" href={pathname}>Reset controlled search</a>
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
                                <p className={styles.cardLabel}>Synthetic governed service</p>
                                <h3>{service.name}</h3>
                                <p>{service.sections.scope?.[0]}</p>
                                <p className={styles.withheld}>
                                  Capabilities, availability, locations, staffed guidance and appointment actions are withheld.
                                </p>
                                <span aria-disabled="true" className={styles.disabledAction}>
                                  Service details unavailable in controlled preview
                                </span>
                              </article>
                            </li>
                          ))}
                        </ol>
                      </section>
                    ))}
                    <Pagination
                      label="Synthetic service result pages"
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
          <p>No staffed contact, doctor recommendation or appointment route is approved for this controlled preview.</p>
          <a className="ds-touch-target" href="#service-search-title">Return to synthetic search</a>
        </section>
      </div>
    </SiteShell>
  )
}
