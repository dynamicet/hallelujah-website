import { controlledServiceIndex, type ServiceView } from './service-view.ts'
import type { GovernedLocale } from './governed-record.ts'

export const serviceDirectoryQueryMaximum = 80

export interface ControlledServiceGroupFilter {
  readonly label: string
  readonly publicId: string
  readonly value: string
}

export interface ServiceDirectoryState {
  readonly groups: readonly string[]
  readonly page: number
  readonly query: string
  readonly urgent: boolean
}

export interface ServiceDirectoryFilterView extends ControlledServiceGroupFilter {
  readonly count: number
}

export interface ServiceDirectoryResultGroup {
  readonly name: string
  readonly publicId: string
  readonly services: readonly ServiceView[]
}

export interface ServiceDirectoryView {
  readonly filters: readonly ServiceDirectoryFilterView[]
  readonly groups: readonly ServiceDirectoryResultGroup[]
  readonly pageCount: number
  readonly pageSize: number
  readonly resultCount: number
  readonly state: ServiceDirectoryState
}

type SearchInput = URLSearchParams | Readonly<Record<string, string | readonly string[] | undefined>>

function values(input: SearchInput, key: 'group' | 'page' | 'q'): readonly string[] {
  if (input instanceof URLSearchParams) return input.getAll(key)
  const value = input[key]
  if (value === undefined) return []
  return typeof value === 'string' ? [value] : value
}

function normalizedText(value: string, maximum = serviceDirectoryQueryMaximum) {
  return value.normalize('NFC')
    .replaceAll(/[\u0000-\u001f\u007f]/gu, '')
    .replaceAll(/\s+/gu, ' ')
    .trim()
    .slice(0, maximum)
}

function query(input: SearchInput) {
  return normalizedText(values(input, 'q')[0] ?? '')
}

function checkedFilters(filters: readonly ControlledServiceGroupFilter[]) {
  const values = new Set<string>()
  const publicIds = new Set<string>()
  return filters.filter((filter) => {
    const value = filter.value.trim()
    const label = filter.label.trim()
    const publicId = filter.publicId.trim()
    const valid = /^[a-z0-9][a-z0-9-]{0,39}$/u.test(value)
      && /^grp_[a-z0-9]{12,32}$/u.test(publicId)
      && label.length > 0 && label.length <= 120
      && !values.has(value) && !publicIds.has(publicId)
    if (valid) {
      values.add(value)
      publicIds.add(publicId)
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

function textKey(value: string, locale: GovernedLocale) {
  return value.normalize('NFKC').toLocaleLowerCase(locale).replaceAll(/\s+/gu, ' ').trim()
}

/**
 * Synthetic controlled-directory projection only. It performs literal navigational matching over
 * governed fixture vocabulary; it does not diagnose, infer intent, rank care or mount a route.
 */
export function controlledServiceDirectory(input: Readonly<{
  filters: readonly ControlledServiceGroupFilter[]
  locale: GovernedLocale
  mode?: 'controlled-fixture'
  now: Date
  pageSize?: number
  records: readonly unknown[]
  searchParameters: SearchInput
  urgentTerms?: readonly string[]
}>): ServiceDirectoryView {
  return serviceDirectoryFromViews({
    ...input,
    entries: controlledServiceIndex(input.records, input.locale, input.now, input.mode),
  })
}

/** Search already-projected views; callers retain responsibility for content eligibility. */
export function serviceDirectoryFromViews(input: Readonly<{
  entries: readonly ServiceView[]
  filters: readonly ControlledServiceGroupFilter[]
  groupOrder?: readonly string[]
  locale: GovernedLocale
  pageSize?: number
  searchParameters: SearchInput
  urgentTerms?: readonly string[]
}>): ServiceDirectoryView {
  const filters = checkedFilters(input.filters)
  const allowed = new Set(filters.map((filter) => filter.value))
  const selected = [...new Set(values(input.searchParameters, 'group'))]
    .filter((value) => allowed.has(value))
  const normalizedQuery = query(input.searchParameters)
  const needle = textKey(normalizedQuery, input.locale)
  const urgentVocabulary = new Set((input.urgentTerms ?? [])
    .map((term) => textKey(normalizedText(term), input.locale)).filter(Boolean))
  const groupOrder = new Map((input.groupOrder ?? []).map((id, index) => [id, index]))
  const indexed = [...input.entries]
    .sort((left, right) => (groupOrder.get(left.group.publicId) ?? Number.MAX_SAFE_INTEGER)
      - (groupOrder.get(right.group.publicId) ?? Number.MAX_SAFE_INTEGER)
      || left.group.name.localeCompare(right.group.name, input.locale)
      || left.name.localeCompare(right.name, input.locale))
  const matchingQuery = indexed.filter((service) => !needle
    || [service.name, ...service.synonyms].some((term) => textKey(term, input.locale).includes(needle)))
  const selectedGroupIds = new Set(filters.filter((filter) => selected.includes(filter.value))
    .map((filter) => filter.publicId))
  const matching = matchingQuery.filter((service) => selectedGroupIds.size === 0
    || selectedGroupIds.has(service.group.publicId))
  const pageSize = Number.isSafeInteger(input.pageSize) && (input.pageSize ?? 0) > 0
    ? Math.min(input.pageSize as number, 12) : 6
  const pageCount = Math.max(1, Math.ceil(matching.length / pageSize))
  const page = Math.min(requestedPage(input.searchParameters), pageCount)
  const offset = (page - 1) * pageSize
  const pageResults = matching.slice(offset, offset + pageSize)
  const groups = new Map<string, ServiceDirectoryResultGroup>()
  for (const service of pageResults) {
    const current = groups.get(service.group.publicId) ?? {
      name: service.group.name,
      publicId: service.group.publicId,
      services: [],
    }
    groups.set(service.group.publicId, { ...current, services: [...current.services, service] })
  }

  return Object.freeze({
    filters: Object.freeze(filters.map((filter) => Object.freeze({
      ...filter,
      count: matchingQuery.filter((service) => service.group.publicId === filter.publicId).length,
    }))),
    groups: Object.freeze([...groups.values()].map((group) => Object.freeze({
      ...group,
      services: Object.freeze(group.services),
    }))),
    pageCount,
    pageSize,
    resultCount: matching.length,
    state: Object.freeze({
      groups: Object.freeze(selected),
      page,
      query: normalizedQuery,
      urgent: needle.length > 0 && urgentVocabulary.has(needle),
    }),
  })
}

export function serviceDirectoryUrl(
  pathname: string,
  state: Pick<ServiceDirectoryState, 'groups' | 'page' | 'query'>,
  allowedGroups: readonly string[],
) {
  const parameters = new URLSearchParams()
  const normalizedQuery = normalizedText(state.query)
  if (normalizedQuery) parameters.set('q', normalizedQuery)
  const allowed = new Set(allowedGroups)
  for (const value of [...new Set(state.groups)].filter((group) => allowed.has(group))) {
    parameters.append('group', value)
  }
  if (Number.isSafeInteger(state.page) && state.page > 1) parameters.set('page', String(state.page))
  const suffix = parameters.toString()
  return suffix ? `${pathname}?${suffix}` : pathname
}
