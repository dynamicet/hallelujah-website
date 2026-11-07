export type PatientStory = {
  id: string
  status: 'published' | 'withdrawn'
  title: string
  attribution: string
  quote: string
  account: readonly string[]
  photograph: { src: string; alt: string; width: number; height: number }
  video?: {
    src: string
    captionsSrc: string
    language: string
    captionsLabel: string
    transcript: readonly string[]
  }
}

// Content adapters supply reviewed stories and remove withdrawn records and media.
// Preview content is supplied only by the development homepage, never as a default.
export function PatientTestimonials({ stories, preview = false }: {
  stories: readonly PatientStory[]
  preview?: boolean
}) {
  const visible = stories.filter((story) => story.status === 'published'
    && story.title.trim() && story.attribution.trim() && story.quote.trim()
    && story.account.some((paragraph) => paragraph.trim())
    && story.photograph.src.trim() && story.photograph.alt.trim()
    && story.photograph.width > 0 && story.photograph.height > 0)

  if (!visible.length) return null

  return (
    <section className="patient-testimonials" id="patient-testimonials" aria-labelledby="patient-testimonials-title">
      <div className="page-frame">
        <div className="section-intro">
          <h2 id="patient-testimonials-title">Patient testimonials.</h2>
          <p>Hope in the everyday. Courage in the next step. Stories of finding a way forward.</p>
        </div>
        {preview ? <p className="patient-stories-notice">These stories and AI-generated images are fictional. Videos are silent illustrated previews.</p> : null}
        <div className="patient-stories">
          {visible.map((story) => {
            const video = story.video
            const playable = video && video.src.trim() && video.captionsSrc.trim()
              && video.language.trim() && video.captionsLabel.trim()
              && video.transcript.some((paragraph) => paragraph.trim())
            return (
              <article className="patient-story" key={story.id} aria-labelledby={`patient-story-${story.id}`}>
                <figure className="patient-story-photograph" data-orientation={story.photograph.width >= story.photograph.height ? 'landscape' : 'portrait'}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={story.photograph.src} alt={story.photograph.alt} width={story.photograph.width} height={story.photograph.height} loading="lazy" />
                </figure>
                <div className="patient-story-copy">
                  <h3 id={`patient-story-${story.id}`}>{story.title}</h3>
                  <blockquote><p>“{story.quote}”</p></blockquote>
                  <p className="patient-story-attribution">{story.attribution}</p>
                  <details className="patient-story-account">
                    <summary>Read the story<span className="patient-story-context">: {story.title}</span></summary>
                    <div>{story.account.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
                  </details>
                  {playable && video ? (
                    <details className="patient-story-video">
                      <summary>Watch the video<span className="patient-story-context">: {story.title}</span></summary>
                      <video controls playsInline preload="none" poster={story.photograph.src} aria-label={`Video: ${story.title}`}>
                        <source src={video.src} />
                        <track kind="captions" src={video.captionsSrc} srcLang={video.language} label={video.captionsLabel} default />
                        Your browser does not support this video. Read the transcript below.
                      </video>
                      <p className="patient-story-media-help">If playback is unavailable, <a href={video.src}>open the video</a> or read the transcript.</p>
                      <details className="patient-story-transcript">
                        <summary>Read the video transcript<span className="patient-story-context">: {story.title}</span></summary>
                        {video.transcript.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                      </details>
                    </details>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
        <p className="patient-stories-note">Every experience is personal. Recovery and care needs vary from person to person.</p>
      </div>
    </section>
  )
}
