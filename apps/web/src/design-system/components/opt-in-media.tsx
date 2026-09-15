import styles from './opt-in-media.module.css'

export type MediaAuthority = 'controlled-fixture' | 'production-approved'

interface DecorativeMediaSource {
  readonly kind: 'decorative'
  readonly src: string
}

interface InformativeMediaSource {
  readonly captionsSrc: string
  readonly kind: 'informative'
  readonly src: string
  readonly transcriptHref: string
}

export type OptInMediaSource = DecorativeMediaSource | InformativeMediaSource

export interface OptInMediaProps {
  readonly authority: MediaAuthority
  readonly heading: string
  readonly source: OptInMediaSource
  readonly posterDescription: string
}

export function isFirstPartyMediaPath(value: string): boolean {
  if (!/^\/[A-Za-z0-9/_\-.]+$/u.test(value) || value.startsWith('//')) return false
  return !value.split('/').some((segment) => segment === '.' || segment === '..')
}

export function OptInMedia({ authority, heading, posterDescription, source }: OptInMediaProps) {
  const validSource = isFirstPartyMediaPath(source.src) &&
    (source.kind === 'decorative' || isFirstPartyMediaPath(source.captionsSrc))

  return (
    <figure
      className={styles.frame}
      data-media-authority={authority}
      data-media-heading={heading}
      data-media-src={validSource ? source.src : undefined}
      data-media-state="poster"
    >
      <div className={styles.plane}>
        <div className={styles.poster} data-media-poster>
          <span>{posterDescription}</span>
        </div>
        <video
          aria-hidden={source.kind === 'decorative'}
          className={styles.video}
          controls={source.kind === 'informative'}
          data-media-video
          hidden
          muted={source.kind === 'decorative'}
          playsInline
          preload="none"
        >
          {source.kind === 'informative' ?
            <track data-media-captions-src={source.captionsSrc} kind="captions" srcLang="en" /> : null}
        </video>
      </div>
      <figcaption className={styles.caption}>
        <strong>{heading}</strong>
        <p>{posterDescription}</p>
        <div className={styles.actions}>
          <button className={styles.button} data-media-play disabled={!validSource} type="button">
            Play {heading}
          </button>
          <button className={styles.button} data-media-stop hidden type="button">
            Stop {heading}
          </button>
        </div>
        {source.kind === 'informative' ?
          <a href={source.transcriptHref}>Read the {heading} transcript</a> : null}
        {!validSource ? <p>Media is unavailable; the written description remains available.</p> : null}
        <p data-media-status hidden role="status">Playback failed. The still description remains available.</p>
      </figcaption>
    </figure>
  )
}
