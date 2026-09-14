export const searchStateKeys = ['q', 'type', 'page'] as const
export const defaultSearchQueryMaximum = 80

export interface SearchNavigationState {
  readonly page: number
  readonly query: string
  readonly types: readonly string[]
}

export interface SearchStatePolicy {
  readonly allowedTypes: readonly string[]
  readonly maximumPage?: number
  readonly maximumQueryLength?: number
}

export type SearchParamValue = string | readonly string[] | undefined
export type SearchParamInput = Readonly<Record<string, SearchParamValue>> | URLSearchParams

export function parseSearchState(
  input: SearchParamInput,
  policy: SearchStatePolicy,
): SearchNavigationState {
  const maximumPage = normalizeMaximumPage(policy.maximumPage)
  const maximumQueryLength = normalizeMaximumQueryLength(policy.maximumQueryLength)
  const query = normalizeSearchQuery(firstValue(input, 'q'), maximumQueryLength)
  const allowedTypes = new Set(policy.allowedTypes)
  const types = uniqueValues(allValues(input, 'type')).filter((value) => allowedTypes.has(value))
  const page = normalizePage(firstValue(input, 'page'), maximumPage)

  return Object.freeze({ page, query, types: Object.freeze(types) })
}

export function createSearchStateUrl(
  pathname: string,
  state: SearchNavigationState,
  policy: SearchStatePolicy,
) {
  const normalized = parseSearchState(
    {
      page: String(state.page),
      q: state.query,
      type: state.types,
    },
    policy,
  )
  const parameters = new URLSearchParams()

  if (normalized.query) parameters.set('q', normalized.query)
  for (const type of normalized.types) parameters.append('type', type)
  if (normalized.page > 1) parameters.set('page', String(normalized.page))

  const queryString = parameters.toString()
  return queryString ? `${pathname}?${queryString}` : pathname
}

export function normalizeSearchQuery(
  value: string | undefined,
  maximumLength = defaultSearchQueryMaximum,
) {
  return (value ?? '')
    .normalize('NFC')
    .replaceAll(/[\u0000-\u001f\u007f]/gu, '')
    .replaceAll(/\s+/gu, ' ')
    .trim()
    .slice(0, normalizeMaximumQueryLength(maximumLength))
}

function firstValue(input: SearchParamInput, key: (typeof searchStateKeys)[number]) {
  if (input instanceof URLSearchParams) return input.get(key) ?? undefined
  const value = input[key]
  return Array.isArray(value) ? value[0] : value
}

function allValues(input: SearchParamInput, key: (typeof searchStateKeys)[number]) {
  if (input instanceof URLSearchParams) return input.getAll(key)
  const value = input[key]
  if (Array.isArray(value)) return [...value]
  return value === undefined ? [] : [value]
}

function uniqueValues(values: readonly string[]) {
  return [...new Set(values)]
}

function normalizeMaximumPage(value: number | undefined) {
  if (!Number.isSafeInteger(value) || (value ?? 0) < 1) return Number.MAX_SAFE_INTEGER
  return value as number
}

function normalizeMaximumQueryLength(value: number | undefined) {
  if (!Number.isSafeInteger(value) || (value ?? 0) < 1) return defaultSearchQueryMaximum
  return value as number
}

function normalizePage(value: string | undefined, maximumPage: number) {
  if (!value || !/^\d+$/u.test(value)) return 1
  const page = Number(value)
  return Number.isSafeInteger(page) ? Math.min(Math.max(page, 1), maximumPage) : 1
}
