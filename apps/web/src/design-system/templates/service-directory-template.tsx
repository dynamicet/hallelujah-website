import { requestAppointmentLabel } from '@/appointment/copy'
import { TemplateFrame } from './template-frame'
import { InterfaceText, InterfaceLink as Link } from '@/website/interface-language'

import type { ReactNode } from 'react'
import {
  ServiceCard,
  type ServiceCardPresentation,
  ActiveFilterList,
  DirectorySearchForm, DirectoryResultCount,
  type SiteShellProps,
  FilterDisclosure,
  FilterGroup,
  Pagination,
  SearchBox,
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
  readonly servicePresentations?: Readonly<Record<string, ServiceCardPresentation>>
  readonly introVisual?: ReactNode
  readonly directory: ServiceDirectoryView
  readonly pathname: string
  readonly serviceRequestLinks?: boolean
  readonly serviceActions?: Readonly<Record<string, Readonly<{ href: string; label: string }>>>
  readonly serviceDetailLinks?: boolean
  readonly shell?: Omit<SiteShellProps, 'breadcrumbs' | 'children'>
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

export function ServiceDirectoryTemplate({ introVisual, servicePresentations, directory, pathname, serviceRequestLinks = false, serviceActions, serviceDetailLinks = false, shell, state }: ServiceDirectoryTemplateProps) {
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
  const currentResultsHref = serviceDirectoryUrl(pathname, searchState, allowedGroups)
  const firstResult = (searchState.page - 1) * directory.pageSize + 1
  const lastResult = Math.min(searchState.page * directory.pageSize, directory.resultCount)

  return (
    <TemplateFrame shell={shell}>
      <div className={styles.frame} data-service-directory-state={state} data-service-directory-template data-care-directory={serviceDetailLinks || undefined}>
        <section aria-labelledby="service-directory-title" className={styles.introduction} data-directory-section="S1">
          <div className={styles.introductionCopy} data-ui-part="introduction-copy" data-directory-introduction-copy>
            <h1 data-reveal="0" id="service-directory-title">{serviceDetailLinks ? 'Specialties & services' : 'Find a service'}</h1>
            {serviceDetailLinks ? <p>Explore specialist care, tests and treatments. Choose a care option to see the team and how to arrange your visit.</p> : null}
            {!serviceDetailLinks ? <Link className="ds-touch-target" href="/appointment">Need help choosing care?</Link> : null}
          </div>
          {introVisual}
        </section>

        {searchState.urgent ? (
          <aside aria-labelledby="service-urgent-title" className={styles.urgentNotice} data-directory-section="S2">
            <h2 id="service-urgent-title">Need urgent help?</h2>
            <p>This directory does not assess medical urgency. Online requests are not emergency channels.</p>
            <Link className="ds-touch-target" href="/emergency">Emergency information</Link>
          </aside>
        ) : null}

        <section aria-labelledby="service-search-title" className={styles.directory} data-directory-section="S3">
          <div className={styles.directoryHeading} data-ui-part="heading directory-heading" data-directory-heading>
            <h2 className={styles.visuallyHidden} id="service-search-title">{serviceDetailLinks ? 'Search specialties and services' : 'Search services'}</h2>
          </div>
          <DirectorySearchForm action={pathname} label="Search services" resultKey={currentResultsHref}>
            <div className={styles.searchPanel} data-ui-part="search-panel" data-directory-search-panel>
              <SearchBox
                clearHref={serviceDirectoryUrl(pathname, { ...searchState, page: 1, query: '' }, allowedGroups)}
                hint="Do not enter personal or medical information."
                hintId="service-search-hint"
                inputId="service-search-query"
                label={serviceDetailLinks ? 'Specialty, service or area of care' : 'Search services'}
                maximumLength={serviceDirectoryQueryMaximum}
                query={searchState.query}
                submitLabel="Search"
              />
            </div>

            <div className={styles.discoveryWorkspace} data-ui-part="workspace discovery-workspace" data-directory-workspace>
              <aside aria-label="service groups" className={styles.filterRail} data-ui-part="filter-rail" data-directory-filter-rail>
                <FilterDisclosure label={`Filter services (${activeFilters.length})`} open>
                  <FilterGroup
                    legend={serviceDetailLinks ? 'Area of care' : 'Service group'}
                    name="group"
                    options={directory.filters}
                    selectedValues={searchState.groups}
                  />
                  <button type="submit">{serviceDetailLinks ? 'Apply filters' : 'Apply groups'}</button>
                  <a className={`${styles.resetFilters} ds-touch-target`} href={pathname}><InterfaceText>Reset all</InterfaceText></a>
                </FilterDisclosure>
              </aside>

              <section aria-labelledby="service-results-title" aria-busy={state === 'loading' ? 'true' : undefined}
                data-ui-part="results results-section" className={styles.resultsSection} data-directory-section="S4" id="service-results">
                <h2 className={styles.visuallyHidden} id="service-results-title">Service results</h2>
                <div data-ui-part="results" className={styles.resultsToolbar}>
                  {!unavailable && state !== 'loading' ? (
                    <DirectoryResultCount id="service-result-count" resultKey={currentResultsHref}>
                      {directory.resultCount} {serviceDetailLinks ? directory.resultCount === 1 ? 'care option' : 'care options' : directory.resultCount === 1 ? 'service' : 'services'}
                    </DirectoryResultCount>
                  ) : <p className={styles.stateLabel}>Directory status</p>}
                  {!unavailable && state !== 'loading' && directory.resultCount > 0 ? <p className={styles.resultRange}>
                    <InterfaceText>{`Showing ${firstResult}–${lastResult} of ${directory.resultCount}`}</InterfaceText>
                  </p> : null}
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
                    <div className={styles.stateActions} data-directory-state-actions>
                      <a className="ds-touch-target" href={currentResultsHref}><InterfaceText>Try this search again</InterfaceText></a>
                      <Link className="ds-touch-target" href="/doctors">Find a doctor</Link>
                    </div>
                  </div>
                ) : noMatches ? (
                  <div className={styles.statePanel} data-directory-section="S6" data-directory-empty>
                    <h2>{serviceDetailLinks ? 'No care options match' : 'No services match'}</h2>
                    <p>{serviceDetailLinks ? 'Check the spelling, remove a filter, or start again. You can also explore doctors by specialty.' : 'Check the spelling, remove a group, or start again. You can also explore clinicians by area of care.'}</p>
                    <div className={styles.stateActions} data-directory-state-actions>
                      <a className="ds-touch-target" href={pathname}><InterfaceText>Reset search</InterfaceText></a>
                      <Link className="ds-touch-target" href="/doctors">Find a doctor</Link>
                    </div>
                  </div>
                ) : (
                  <div className={styles.groupCollection} data-directory-section="S5">
                    {directory.groups.map((group) => (
                      <section aria-labelledby={`service-group-${group.publicId}`} className={styles.resultGroup} data-ui-part="result-group" data-directory-result-group key={group.publicId}>
                        <h2 id={`service-group-${group.publicId}`}>{group.name}</h2>
                        <ol aria-labelledby={`service-group-${group.publicId}`} data-visual-service-results={servicePresentations ? true : undefined} data-ui-part="results" className={styles.results}>
                          {group.services.map((service) => (
                            <li key={service.publicId}>
                              {serviceDetailLinks && servicePresentations?.[service.publicId] ? <div className={styles.visualCard} data-service-public-id={service.publicId}>
                                <ServiceCard href={`${service.canonicalPath}?from=${encodeURIComponent(currentResultsHref)}`} name={service.name}
                                  summary={service.sections.scope?.[0]} {...servicePresentations[service.publicId]} />
                              </div> : <article data-ui-part="card" className={styles.card} data-service-public-id={service.publicId}>
                                {!serviceDetailLinks ? <p className={styles.cardLabel} data-ui-part="card-label" data-directory-card-label>{service.group.name}</p> : null}
                                <h3>{serviceDetailLinks ? <Link href={`${service.canonicalPath}?from=${encodeURIComponent(currentResultsHref)}`}>{service.name}</Link> : service.name}</h3>
                                <p className={styles.cardSummary} data-ui-part="card-summary" data-directory-card-summary>{service.sections.scope?.[0] ?? 'Explore this care area and choose a next step.'}</p>
                                <div className={styles.cardActions}>
                                  {serviceActions?.[service.publicId] ? <Link className="ds-touch-target" aria-label={`${serviceActions[service.publicId].label} for ${service.name}`} href={serviceActions[service.publicId].href}>{serviceActions[service.publicId].label}</Link> : serviceRequestLinks ? <Link className="ds-touch-target" aria-label={`${requestAppointmentLabel} for ${service.name}`} href={`/appointment?service=${encodeURIComponent(service.publicId)}`}>{requestAppointmentLabel}</Link> : !serviceDetailLinks ? <span aria-disabled="true" className={styles.disabledAction}>Service details unavailable</span> : null}
                                </div>
                              </article>}
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
          </DirectorySearchForm>
        </section>

        <section aria-labelledby="service-support-title" className={`${styles.support} ds-support-band`} data-ui-part="support" data-directory-support data-care-band="assistance" data-directory-section="S7"
          id="service-directory-support">
          <h2 id="service-support-title">Still not sure?</h2>
          <Link className="ds-touch-target" href="/contact#contact-reception">Contact the hospital</Link>
        </section>
      </div>
    </TemplateFrame>
  )
}
