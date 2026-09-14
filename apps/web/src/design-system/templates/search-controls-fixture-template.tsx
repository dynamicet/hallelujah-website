import {
  ActiveFilterList,
  createSearchStateUrl,
  FilterDisclosure,
  FilterGroup,
  Pagination,
  parseSearchState,
  ResultCount,
  SearchBox,
  SearchControlsForm,
  defaultSearchQueryMaximum,
  type ActiveFilter,
  type FilterOption,
  type PaginationPage,
  type SearchParamInput,
  type SearchStatePolicy,
} from '../components'

import styles from './search-controls-fixture-template.module.css'

export interface SearchControlsFixtureTemplateProps {
  readonly searchParameters: SearchParamInput
}

const controlledRecords = [
  {
    id: 'controlled-doctor-a',
    summary: 'Synthetic name and specialty context for component verification only.',
    title: 'Controlled doctor record Alpha',
    type: 'doctor',
  },
  {
    id: 'controlled-doctor-b',
    summary: 'Synthetic clinician result with no roster, schedule, or availability claim.',
    title: 'Controlled doctor record Beta',
    type: 'doctor',
  },
  {
    id: 'controlled-service-a',
    summary: 'Synthetic service context that provides no diagnosis or care recommendation.',
    title: 'Controlled service record Alpha',
    type: 'service',
  },
  {
    id: 'controlled-service-b',
    summary: 'Synthetic service result with no hospital capability claim.',
    title: 'Controlled service record Beta',
    type: 'service',
  },
  {
    id: 'controlled-location-a',
    summary: 'Synthetic location context with no address, hours, or map provider.',
    title: 'Controlled location record Alpha',
    type: 'location',
  },
] as const

const filterOptions = [
  { label: 'Doctor specimen', value: 'doctor' },
  { label: 'Service specimen', value: 'service' },
  { label: 'Location specimen', value: 'location' },
] as const satisfies readonly FilterOption[]

const policy = {
  allowedTypes: filterOptions.map((option) => option.value),
  maximumPage: 99,
  maximumQueryLength: defaultSearchQueryMaximum,
} satisfies SearchStatePolicy

const pageSize = 2
const pathname = '/'

export function SearchControlsFixtureTemplate({
  searchParameters,
}: SearchControlsFixtureTemplateProps) {
  const requestedState = parseSearchState(searchParameters, policy)
  const matchingRecords = controlledRecords.filter((record) => {
    const matchesType = requestedState.types.length === 0 || requestedState.types.includes(record.type)
    const searchableText = `${record.title} ${record.summary}`.toLocaleLowerCase('en')
    const matchesQuery =
      !requestedState.query || searchableText.includes(requestedState.query.toLocaleLowerCase('en'))
    return matchesType && matchesQuery
  })
  const maximumPage = Math.max(1, Math.ceil(matchingRecords.length / pageSize))
  const state = parseSearchState(searchParameters, { ...policy, maximumPage })
  const firstResult = (state.page - 1) * pageSize
  const visibleRecords = matchingRecords.slice(firstResult, firstResult + pageSize)
  const statePolicy = { ...policy, maximumPage }
  const activeFilters: ActiveFilter[] = state.types.map((type) => {
    const option = filterOptions.find((candidate) => candidate.value === type)
    const label = option?.label ?? type
    return {
      label,
      removeHref: createSearchStateUrl(
        pathname,
        { ...state, page: 1, types: state.types.filter((value) => value !== type) },
        statePolicy,
      ),
      removeLabel: `Remove ${label} filter`,
      value: type,
    }
  })
  const pages: PaginationPage[] = Array.from({ length: maximumPage }, (_, index) => {
    const page = index + 1
    return {
      current: page === state.page,
      href: createSearchStateUrl(pathname, { ...state, page }, statePolicy),
      label: String(page),
      page,
    }
  })

  return (
    <section
      aria-labelledby="search-controls-evidence-title"
      className="ds-flow ds-section"
      data-search-controls-fixture
      id="search-controls-evidence"
    >
      <div className="ds-flow ds-reading">
        <h2 id="search-controls-evidence-title">Search and filter evidence fixture</h2>
        <p>
          These controls operate only on five synthetic records. They do not mount a public search
          route, use hospital content, diagnose, send a request, log a query, or contact a provider.
        </p>
      </div>

      <SearchControlsForm action={pathname} label="Search controlled records">
        <SearchBox
          clearHref={createSearchStateUrl(
            pathname,
            { ...state, page: 1, query: '' },
            statePolicy,
          )}
          hint="Search synthetic titles only. Do not enter a name, contact detail, medical history, or care narrative."
          hintId="controlled-search-hint"
          inputId="controlled-search-query"
          label="Search controlled records"
          maximumLength={defaultSearchQueryMaximum}
          query={state.query}
          submitLabel="Search"
        />

        <FilterDisclosure label="Filter controlled results" open>
          <FilterGroup
            legend="Record type"
            options={filterOptions.map((option) => ({
              ...option,
              count: controlledRecords.filter((record) => record.type === option.value).length,
            }))}
            selectedValues={state.types}
          />
          <button type="submit">Apply filters</button>
        </FilterDisclosure>
      </SearchControlsForm>

      <ActiveFilterList
        clearAllHref={createSearchStateUrl(
          pathname,
          { page: 1, query: state.query, types: [] },
          statePolicy,
        )}
        clearAllLabel="Clear all filters"
        filters={activeFilters}
        label="Active filters"
      />

      <ResultCount id="controlled-result-count">
        {matchingRecords.length} controlled {matchingRecords.length === 1 ? 'result' : 'results'}
      </ResultCount>

      {visibleRecords.length > 0 ? (
        <ol aria-labelledby="controlled-result-count" className={styles.results} start={firstResult + 1}>
          {visibleRecords.map((record) => (
            <li key={record.id}>
              <article className={styles.result} id={record.id}>
                <p className={styles.resultType}>{record.type} specimen</p>
                <h3>
                  <a href={`#${record.id}`}>{record.title}</a>
                </h3>
                <p>{record.summary}</p>
              </article>
            </li>
          ))}
        </ol>
      ) : (
        <div className={styles.emptyState} data-search-empty-state>
          <h3>No controlled records match</h3>
          <p>Check the synthetic title, remove a filter, or reset this local evidence fixture.</p>
          <a className="ds-touch-target" href={pathname}>
            Reset controlled search
          </a>
        </div>
      )}

      <Pagination
        label="Controlled result pages"
        next={
          state.page < maximumPage
            ? { ...pages[state.page], label: 'Next' }
            : undefined
        }
        pages={pages}
        previous={
          state.page > 1
            ? { ...pages[state.page - 2], label: 'Previous' }
            : undefined
        }
      />
      <script data-search-controls-script defer src="/search-controls.js" />
    </section>
  )
}
