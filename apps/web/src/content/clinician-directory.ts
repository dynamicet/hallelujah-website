import { controlledClinicianIndex, type ClinicianView } from './clinician-view.ts'
import type { GovernedLocale } from './governed-record.ts'

export const clinicianDirectoryQueryMaximum = 80

export interface ControlledClinicianFilter {
  readonly label: string
  readonly specialty: string
  readonly value: string
}

export interface ClinicianDirectoryState {
  readonly page: number
  readonly query: string
  readonly filters: readonly string[]
}

export interface ClinicianDirectoryFilterView extends ControlledClinicianFilter {
  readonly count: number
}

export interface ClinicianDirectoryView {
  readonly state: ClinicianDirectoryState
  readonly filters: readonly ClinicianDirectoryFilterView[]
  readonly results: readonly ClinicianView[]
  readonly resultCount: number
  readonly pageCount: number
  readonly pageSize: number
}

type SearchInput = URLSearchParams | Readonly<Record<string, string | readonly string[] | undefined>>

function values(input: SearchInput, key: 'page' | 'q' | 'type'): readonly string[] {
  if (input instanceof URLSearchParams) return input.getAll(key)
  const value = input[key]
  if (value === undefined) return []
  return typeof value === 'string' ? [value] : value
}

function query(input: SearchInput) {
  return (values(input, 'q')[0] ?? '')
    .normalize('NFC')
    .replaceAll(/[\u0000-\u001f\u007f]/gu, '')
    .replaceAll(/\s+/gu, ' ')
    .trim()
    .slice(0, clinicianDirectoryQueryMaximum)
}

function checkedFilters(filters: readonly ControlledClinicianFilter[]) {
  const values = new Set<string>()
  const specialties = new Set<string>()
  return filters.filter((filter) => {
    const value = filter.value.trim()
    const label = filter.label.trim()
    const specialty = filter.specialty.trim()
    const valid = /^[a-z0-9][a-z0-9-]{0,39}$/u.test(value)
      && label.length > 0 && label.length <= 120
      && specialty.length > 0 && specialty.length <= 120
      && !values.has(value) && !specialties.has(specialty.toLocaleLowerCase('en'))
    if (valid) {
      values.add(value)
      specialties.add(specialty.toLocaleLowerCase('en'))
    }
    return valid
  })
}

function requestedPage(input: SearchInput) {
  const value = values(input, 'page')[0]
  if (!value || !/^\d+$/u.test(value)) return 1
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1
}

/**
 * Synthetic controlled-directory projection only. Authentic records remain care-gated and this
 * function cannot mount a route or promote a fixture into public eligibility.
 */
export function controlledClinicianDirectory(input: Readonly<{
  filters: readonly ControlledClinicianFilter[]
  locale: GovernedLocale
  mode?: 'controlled-fixture'
  now: Date
  pageSize?: number
  records: readonly unknown[]
  searchParameters: SearchInput
}>): ClinicianDirectoryView {
  const filters = checkedFilters(input.filters)
  const allowed = new Set(filters.map((filter) => filter.value))
  const selected = [...new Set(values(input.searchParameters, 'type'))]
    .filter((value) => allowed.has(value))
  const normalizedQuery = query(input.searchParameters)
  const needle = normalizedQuery.toLocaleLowerCase(input.locale)
  const indexed = [...controlledClinicianIndex(input.records, input.locale, input.now, input.mode)]
    .sort((left, right) => left.details.name.localeCompare(right.details.name, input.locale))
  const matchingQuery = indexed.filter((clinician) => !needle
    || [clinician.details.name, ...clinician.details.specialties]
      .join(' ').normalize('NFC').toLocaleLowerCase(input.locale).includes(needle))
  const selectedSpecialties = new Set(filters
    .filter((filter) => selected.includes(filter.value))
    .map((filter) => filter.specialty.toLocaleLowerCase(input.locale)))
  const matching = matchingQuery.filter((clinician) => selectedSpecialties.size === 0
    || clinician.details.specialties.some((specialty) => selectedSpecialties.has(
      specialty.toLocaleLowerCase(input.locale),
    )))
  const pageSize = Number.isSafeInteger(input.pageSize) && (input.pageSize ?? 0) > 0
    ? Math.min(input.pageSize as number, 12) : 4
  const pageCount = Math.max(1, Math.ceil(matching.length / pageSize))
  const page = Math.min(requestedPage(input.searchParameters), pageCount)
  const offset = (page - 1) * pageSize

  return Object.freeze({
    filters: Object.freeze(filters.map((filter) => Object.freeze({
      ...filter,
      count: matchingQuery.filter((clinician) => clinician.details.specialties.some((specialty) =>
        specialty.toLocaleLowerCase(input.locale) === filter.specialty.toLocaleLowerCase(input.locale))).length,
    }))),
    pageCount,
    pageSize,
    resultCount: matching.length,
    results: Object.freeze(matching.slice(offset, offset + pageSize)),
    state: Object.freeze({ filters: Object.freeze(selected), page, query: normalizedQuery }),
  })
}

export function clinicianDirectoryUrl(
  pathname: string,
  state: ClinicianDirectoryState,
  allowedFilters: readonly string[],
) {
  const parameters = new URLSearchParams()
  const normalizedQuery = state.query.normalize('NFC').replaceAll(/[\u0000-\u001f\u007f]/gu, '')
    .replaceAll(/\s+/gu, ' ').trim().slice(0, clinicianDirectoryQueryMaximum)
  if (normalizedQuery) parameters.set('q', normalizedQuery)
  const allowed = new Set(allowedFilters)
  for (const value of [...new Set(state.filters)].filter((filter) => allowed.has(filter))) {
    parameters.append('type', value)
  }
  if (Number.isSafeInteger(state.page) && state.page > 1) parameters.set('page', String(state.page))
  const suffix = parameters.toString()
  return suffix ? `${pathname}?${suffix}` : pathname
}
