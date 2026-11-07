import Link from 'next/link'

/** A care montage introduces the hospital; its invitation yields during playback. */
export function CareBackgroundFilm() {
  return <figure className="care-background-film" data-film-state="poster">
    <picture>
      <source media="(max-width: 600px)" srcSet="/editorial/hallelujah-home-loop-mobile-poster.webp" />
      <img src="/editorial/hallelujah-home-loop-poster.webp" alt="A gloved care professional writing notes" width="1920" height="1080" loading="lazy" />
    </picture>
    {/* The responsive picture is the poster; avoid an eager duplicate desktop image. */}
    <video aria-hidden="true" muted playsInline preload="none" />
    <figcaption className="care-film-caption">
      <h2 className="care-film-heading" id="hospital-film-title">Care in every detail.</h2>
      <span className="care-film-status" role="status">18 sec · No sound</span>
      <div className="care-film-actions">
        <button hidden type="button" className="care-film-control" aria-label="Watch film: Care in every detail">
          <svg className="care-film-play" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="m8 5 11 7-11 7Z" fill="currentColor" /></svg>
          <svg className="care-film-pause" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M7 5h4v14H7zm6 0h4v14h-4z" fill="currentColor" /></svg>
          <span data-film-control-label>Watch film</span>
        </button>
        <Link className="care-film-about" href="/about">About us <span aria-hidden="true">→</span></Link>
      </div>
    </figcaption>
    <button hidden type="button" className="care-film-stop">Return to still</button>
    <span className="care-film-progress" aria-hidden="true"><span /></span>
  </figure>
}
