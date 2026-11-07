import { StoryFilm } from './story-film'
import type { PatientStory } from './patient-testimonials'

export type PatientQuote = {
  id: string
  status: 'published' | 'withdrawn'
  quote: string
  attribution: string
}

export function EverydayStories({ stories, quotes, preview = false }: {
  stories: readonly PatientStory[]
  quotes: readonly PatientQuote[]
  preview?: boolean
}) {
  const featured = stories.filter((story) => story.status === 'published'
    && story.title.trim() && story.attribution.trim()
    && story.account.some((paragraph) => paragraph.trim())
    && story.photograph.src.trim() && story.photograph.alt.trim()
    && story.photograph.width > 0 && story.photograph.height > 0).slice(0, 2)
  const visibleQuotes = quotes.filter((quote) => quote.status === 'published'
    && quote.quote.trim() && quote.attribution.trim()).slice(0, 3)

  if (!featured.length && !visibleQuotes.length) return null

  return (
    <section className="page-frame everyday-stories" id="patient-testimonials" tabIndex={-1} data-signature-scene="stories" data-motion-section="stories" data-motion-chapter aria-labelledby="everyday-stories-title">
      <div className="everyday-stories-intro">
        <h2 data-motion="heading" data-reveal="0" id="everyday-stories-title">Everyday stories.</h2>
      </div>
      {preview && <p className="everyday-stories-note">Fictional stories and generated images. Videos are silent illustrated previews.</p>}
      {featured.length > 0 && <div className="everyday-stories-features">
        {featured.map((story, index) => {
          const video = story.video
          const playable = video && video.src.trim() && video.captionsSrc.trim()
            && video.language.trim() && video.captionsLabel.trim()
            && video.transcript.some((paragraph) => paragraph.trim())
          return (
            <article className="everyday-feature" key={story.id} aria-labelledby={`everyday-${story.id}`}>
              <figure data-signature-frame="story" data-motion="image" data-reveal={index} className="everyday-feature-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={story.photograph.src} alt={story.photograph.alt} width={story.photograph.width} height={story.photograph.height} loading="lazy" />
              </figure>
              <div data-motion="soft" data-reveal={index + 1} className="everyday-feature-copy">
                <p className="everyday-feature-person">{story.attribution}’s story</p>
                <h3 id={`everyday-${story.id}`}>{story.title}</h3>
                <p className="everyday-feature-introduction">{story.quote}</p>
                <div className="everyday-feature-actions">
                  {playable && video ? (
                    <details id={`film-${story.id}`} data-motion-disclosure className="everyday-film">
                      <summary aria-label={`Watch story: ${story.title}`}><span aria-hidden="true">▷</span> Watch story</summary>
                      <div className="everyday-film-content">
                        {preview ? <p>Silent illustrated preview · Fictional account. Captions available.</p> : null}
                        <StoryFilm transcriptId={`transcript-${story.id}`} title={`${story.attribution}’s story`} poster={story.photograph.src} source={video} />
                        <details id={`transcript-${story.id}`} data-motion-disclosure className="everyday-transcript">
                          <summary>Read video transcript</summary>
                          <div className="story-reading-body">{video.transcript.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<button className="story-reading-return" type="button" data-story-return>Close transcript <span aria-hidden="true">↑</span></button></div>
                        </details>
                      </div>
                    </details>
                  ) : null}
                  <details data-motion-disclosure className="everyday-account">
                    <summary aria-label={`Read story: ${story.title}`}>Read story <span aria-hidden="true">⌄</span></summary>
                    <div className="story-reading-body">{story.account.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<button className="story-reading-return" type="button" data-story-return>Back to story <span aria-hidden="true">↑</span></button></div>
                  </details>
                </div>
              </div>
            </article>
          )
        })}
      </div>}
      {visibleQuotes.length > 0 && <section className="everyday-quotes-panel" aria-labelledby="everyday-quotes-title">
        <h3 id="everyday-quotes-title">In their own words</h3>
        <div className="everyday-quotes">
        {visibleQuotes.map((quote) => (
          <figure className="everyday-quote" key={quote.id}>
            <span className="everyday-quote-mark" aria-hidden="true">“</span>
            <blockquote><p>{quote.quote}</p></blockquote>
            <figcaption>
              <span>{quote.attribution}</span>
            </figcaption>
          </figure>
        ))}
        </div>
      </section>}
    </section>
  )
}
