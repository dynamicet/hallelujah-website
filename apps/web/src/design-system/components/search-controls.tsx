import type { ReactNode } from 'react'

import styles from './search-controls.module.css'

export interface SearchControlsFormProps {
  readonly action: string
  readonly children: ReactNode
  readonly label: string
}

export interface SearchBoxProps {
  readonly clearHref?: string
  readonly clearLabel?: string
  readonly hint: string
  readonly hintId: string
  readonly inputId: string
  readonly label: string
  readonly maximumLength: number
  readonly query?: string
  readonly submitLabel: string
}

export interface FilterOption {
  readonly count?: number
  readonly label: string
  readonly value: string
}

export interface FilterGroupProps {
  readonly legend: string
  readonly name?: string
  readonly options: readonly FilterOption[]
  readonly selectedValues: readonly string[]
}

export interface FilterDisclosureProps {
  readonly children: ReactNode
  readonly label: string
  readonly open?: boolean
}

export interface DirectoryBrowseProps {
  readonly label: string
  readonly options: readonly { label: string; href: string; current?: boolean; count?: number }[]
}

export interface ActiveFilter {
  readonly label: string
  readonly removeHref: string
  readonly removeLabel: string
  readonly value: string
}

export interface ActiveFilterListProps {
  readonly clearAllHref: string
  readonly clearAllLabel: string
  readonly filters: readonly ActiveFilter[]
  readonly label: string
}

export interface ResultCountProps {
  readonly children: ReactNode
  readonly id: string
}

export interface PaginationPage {
  readonly current?: boolean
  readonly href: string
  readonly label: string
  readonly page: number
}

export interface PaginationProps {
  readonly label: string
  readonly next?: PaginationPage
  readonly pages: readonly PaginationPage[]
  readonly previous?: PaginationPage
}

export function SearchControlsForm({ action, children, label }: SearchControlsFormProps) {
  return (
    <form
      action={action}
      aria-label={label}
      className={styles.form}
      data-search-controls-form
      method="get"
      role="search"
    >
      {children}
    </form>
  )
}

export function SearchBox({
  clearHref,
  clearLabel = 'Clear search',
  hint,
  hintId,
  inputId,
  label,
  maximumLength,
  query = '',
  submitLabel,
}: SearchBoxProps) {
  return (
    <div className={styles.searchBox} data-search-box>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <p className={styles.hint} id={hintId}>
        {hint}
      </p>
      <div className={styles.searchRow}>
        <input
          aria-describedby={hintId}
          autoComplete="off"
          defaultValue={query}
          id={inputId}
          maxLength={maximumLength}
          name="q"
          type="search"
        />
        <button type="submit">{submitLabel}</button>
        {clearHref && query ? <a href={clearHref}>{clearLabel}</a> : null}
      </div>
    </div>
  )
}

export function FilterDisclosure({ children, label, open = false }: FilterDisclosureProps) {
  return (
    <details className={styles.filterDisclosure} data-filter-disclosure open={open}>
      <summary>
        <span>{label}</span>
        <svg aria-hidden="true" className={styles.disclosureChevron} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
      </summary>
      <div className={styles.filterPanel}>{children}</div>
    </details>
  )
}

export function DirectoryBrowse({ label, options }: DirectoryBrowseProps) {
  return <nav aria-label={label} className={styles.browse} data-directory-browse>
    <p>{label}</p>
    <ul>{options.map((option) => <li key={option.href}>
      <a aria-current={option.current ? 'true' : undefined} href={option.href}>
        <span>{option.label}</span>
        {option.count === undefined ? null : <span className={styles.browseCount} aria-label={`${option.count} results`}>{option.count}</span>}
      </a>
    </li>)}</ul>
  </nav>
}

export function FilterGroup({
  legend,
  name = 'type',
  options,
  selectedValues,
}: FilterGroupProps) {
  const selected = new Set(selectedValues)

  return (
    <fieldset className={styles.filterGroup} data-filter-group>
      <legend>{legend}</legend>
      {options.map((option) => {
        const optionId = `filter-${name}-${option.value}`
        return (
          <label htmlFor={optionId} key={option.value}>
            <input
              defaultChecked={selected.has(option.value)}
              id={optionId}
              name={name}
              type="checkbox"
              value={option.value}
            />
            <span>{option.label}</span>
            {option.count === undefined ? null : (
              <span aria-label={`${option.count} results`} className={styles.optionCount}>
                {option.count}
              </span>
            )}
          </label>
        )
      })}
    </fieldset>
  )
}

export function ActiveFilterList({
  clearAllHref,
  clearAllLabel,
  filters,
  label,
}: ActiveFilterListProps) {
  if (filters.length === 0) return null

  return (
    <div aria-label={label} className={styles.activeFilters} data-active-filters role="group">
      <ul>
        {filters.map((filter) => (
          <li key={`${filter.value}-${filter.removeHref}`}>
            <a aria-label={filter.removeLabel} href={filter.removeHref}>
              <span>{filter.label}</span>
              <span aria-hidden="true">×</span>
            </a>
          </li>
        ))}
      </ul>
      <a className={styles.clearAll} href={clearAllHref}>
        {clearAllLabel}
      </a>
    </div>
  )
}

export function ResultCount({ children, id }: ResultCountProps) {
  return (
    <p
      aria-atomic="true"
      aria-live="polite"
      className={styles.resultCount}
      data-result-count
      id={id}
      role="status"
    >
      {children}
    </p>
  )
}

export function Pagination({ label, next, pages, previous }: PaginationProps) {
  if (pages.length < 2) return null

  return (
    <nav aria-label={label} className={styles.pagination} data-pagination>
      <ul>
        {previous ? <PaginationLink kind="previous" page={previous} /> : null}
        {pages.map((page) => (
          <PaginationLink key={page.page} page={page} />
        ))}
        {next ? <PaginationLink kind="next" page={next} /> : null}
      </ul>
    </nav>
  )
}

function PaginationLink({
  kind,
  page,
}: {
  readonly kind?: 'next' | 'previous'
  readonly page: PaginationPage
}) {
  const rel = kind === 'next' ? 'next' : kind === 'previous' ? 'prev' : undefined

  return (
    <li>
      {page.current ? (
        <span aria-current="page" aria-label={`Page ${page.page}`}>
          {page.label}
        </span>
      ) : (
        <a aria-label={`Go to page ${page.page}`} href={page.href} rel={rel}>
          {page.label}
        </a>
      )}
    </li>
  )
}
