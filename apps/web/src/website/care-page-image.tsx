export interface CarePageImageSource {
  readonly name: string
  readonly alt: string
  readonly width: number
  readonly height: number
  readonly smallWidth: number
}

export const carePageImages = {
  general: { name: 'specialty-general', alt: 'A doctor listening during a consultation', width: 1100, height: 825, smallWidth: 640 },
  heart: { name: 'specialty-heart', alt: 'A clinician discussing heart care with a patient', width: 1100, height: 825, smallWidth: 640 },
  recovery: { name: 'specialty-recovery', alt: 'A physiotherapist guiding a woman through shoulder movement', width: 1100, height: 825, smallWidth: 640 },
  arrival: { name: 'arrival', alt: 'An illustration of arriving at the hospital', width: 1100, height: 733, smallWidth: 640 },
} as const satisfies Record<string, CarePageImageSource>

export function CarePageImage({ image, eager = true }: { readonly image: CarePageImageSource; readonly eager?: boolean }) {
  return <figure className="care-page-image" data-reveal="2">
    <picture>
      <source type="image/avif" srcSet={`/editorial/${image.name}-${image.smallWidth}.avif ${image.smallWidth}w, /editorial/${image.name}-${image.width}.avif ${image.width}w`} sizes="(max-width: 767px) calc(100vw - 40px), 45vw" />
      <img alt={image.alt} src={`/editorial/${image.name}-${image.width}.webp`} srcSet={`/editorial/${image.name}-${image.smallWidth}.webp ${image.smallWidth}w, /editorial/${image.name}-${image.width}.webp ${image.width}w`} sizes="(max-width: 767px) calc(100vw - 40px), 45vw" width={image.width} height={image.height} loading={eager ? undefined : 'lazy'} fetchPriority={eager ? 'high' : undefined} />
    </picture>
  </figure>
}
