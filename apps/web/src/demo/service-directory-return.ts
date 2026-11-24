import { serviceDirectoryFromViews, serviceDirectoryUrl } from '@/content/service-directory'
import { data, services } from './site'
import { isRetiredVisitGuide } from './visit-guides'

export const directoryServices = services.filter(service => !isRetiredVisitGuide(service.canonicalPath))

export function serviceDirectorySource(from: unknown): string | undefined {
  if (typeof from !== 'string' || !from.startsWith('/services')) return undefined
  const source = new URL(from, 'https://local.invalid')
  if (source.pathname !== '/services' || source.origin !== 'https://local.invalid') return undefined
  const directory = serviceDirectoryFromViews({
    entries: directoryServices, filters: data.serviceFilters, locale: 'en', pageSize: 6,
    groupOrder: ['grp_202020202020', 'grp_303030303030', 'grp_101010101010'],
    searchParameters: source.searchParams, urgentTerms: ['emergency', 'urgent'],
  })
  return serviceDirectoryUrl('/services', directory.state, data.serviceFilters.map(filter => filter.value))
}
