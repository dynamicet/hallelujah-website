import { createElement } from 'react'
import type { AssetInput } from './asset-record.ts'

export type AssetPresentation = Readonly<{
  synthetic: true; locale: 'en' | 'am'; alternative: NonNullable<AssetInput['localized']['en']>;
  image: { src: string; srcSet: string; width: number; height: number } | null;
  video: { src: string; captions: string | null } | null;
  document: string | null;
}>
const local = (value: string) => /^\/fixture-output\/[a-z0-9./-]+$/.test(value) && !value.includes('..')

/** Internal presentation only. Sources must be fresh authorized private derivatives supplied by a consumer. */
export function ControlledAssetMedia({ presentation, mode, locale, saveData = false }: {
  presentation: AssetPresentation | null; mode?: 'controlled-fixture'; locale: 'en' | 'am'; saveData?: boolean;
}) {
  const item = mode === 'controlled-fixture' ? presentation : null
  if (!item?.synthetic || item.locale !== locale || (item.image && (!local(item.image.src)
    || !item.image.srcSet.split(',').every((entry) => /^\/fixture-output\/[a-z0-9./-]+ \d+w$/.test(entry.trim()) && !entry.includes('..'))))
    || (item.video && (!local(item.video.src) || (item.video.captions && !local(item.video.captions))))
    || (item.document && !local(item.document))) return createElement('p', { 'data-asset-state': 'unavailable' }, 'Media unavailable. The complete text content remains available.')
  const alternative = item.alternative
  const image = item.image && createElement('img', { src: item.image.src,
    srcSet: saveData ? undefined : item.image.srcSet, sizes: '(max-width: 48rem) 100vw, 48rem',
    width: item.image.width, height: item.image.height, alt: alternative.alt,
    loading: 'lazy', decoding: 'async', 'data-asset-image': '' })
  const video = item.video && !saveData && createElement('details', { 'data-asset-video': '' },
    createElement('summary', null, 'Open synthetic video'),
    createElement('video', { controls: true, preload: 'none', width: item.image?.width, height: item.image?.height,
      poster: item.image?.src, 'aria-label': alternative.alt }, createElement('source', { src: item.video.src, type: 'video/mp4' }),
      item.video.captions && createElement('track', { src: item.video.captions, kind: 'captions', srcLang: locale,
        label: locale === 'en' ? 'English' : 'Amharic shaping fixture', default: true })))
  return createElement('figure', { 'data-asset-state': 'current' }, image, video,
    createElement('figcaption', null, alternative.alt),
    alternative.transcript && createElement('p', { 'data-asset-transcript': '' }, alternative.transcript),
    alternative.audioDescription && createElement('p', null, alternative.audioDescription),
    item.document && createElement('a', { href: item.document }, 'Read complete accessible document'),
    saveData && item.video && createElement('p', null, 'Video is omitted for this data-saving view. The poster and transcript contain the complete synthetic content.'))
}
