import type { PatientStory } from './patient-testimonials'

export function StoryFilm({ title, poster, source, transcriptId }: {
  transcriptId: string
  title: string
  poster: string
  source: NonNullable<PatientStory['video']>
}) {
  return <div className="story-film-player">
    <video controls playsInline preload="none" poster={poster} aria-label={title}>
      <source src={source.src} />
      <track kind="captions" src={source.captionsSrc} srcLang={source.language} label={source.captionsLabel} default />
      Read the transcript below if video playback is unavailable.
    </video>
    <div className="story-film-state"><span>{title}</span><span role="status">Ready when you are</span></div>
    <button type="button" className="story-film-continue" data-ended="false" aria-controls={transcriptId}><span data-story-continue-label>Read in words</span><span aria-hidden="true">↓</span></button>
  </div>
}
