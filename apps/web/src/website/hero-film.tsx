'use client'

import { useEffect, useRef, useState } from 'react'

interface HeroFilmProps {
  readonly source?: {
    readonly src: string
    readonly captionsSrc?: string
    readonly transcriptHref?: string
    readonly preview?: boolean
  }
}

export function HeroFilm({ source }: HeroFilmProps) {
  const trigger = useRef<HTMLButtonElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [open, setOpen] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!open) return
    const player = video.current
    const previousOverflow = document.body.style.overflow
    const previousPadding = document.body.style.paddingRight
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar}px`
    document.body.style.overflow = 'hidden'
    const pauseWhenHidden = () => { if (document.hidden) player?.pause() }
    document.addEventListener('visibilitychange', pauseWhenHidden)
    return () => {
      player?.pause()
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPadding
      document.removeEventListener('visibilitychange', pauseWhenHidden)
    }
  }, [open])

  if (!source) return null

  const finish = () => {
    video.current?.pause()
    video.current?.removeAttribute('src')
    video.current?.load()
    setOpen(false)
    trigger.current?.focus({ preventScroll: true })
  }

  return <>
    <button
      aria-label={source.preview ? 'Play hospital film preview' : 'Play hospital film'}
      aria-haspopup="dialog"
      aria-controls="hospital-film"
      className="hero-film-play"
      onClick={() => {
        setFailed(false)
        setOpen(true)
        dialog.current?.showModal()
        // Start inside the activation handler so mobile browsers retain the user's gesture.
        if (video.current) {
          video.current.src = source.src
          void video.current.play().catch(() => {
            // Native controls remain available if the browser requires another activation.
          })
        }
      }}
      ref={trigger}
      type="button"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M8 4.8c0-.7.8-1.1 1.4-.7l12 7.2c.6.4.6 1.2 0 1.6l-12 7.2c-.6.4-1.4 0-1.4-.7V4.8Z" /></svg>
    </button>
    <dialog aria-labelledby="hospital-film-title" aria-describedby={source.preview ? 'hospital-film-notice' : undefined} className="hospital-film" id="hospital-film" onClose={finish} ref={dialog}>
      <div className="hospital-film-heading">
        <h2 id="hospital-film-title">Meet Hallelujah.</h2>
        <button aria-label="Close hospital film" className="hospital-film-close" onClick={() => dialog.current?.close()} type="button">
          <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </div>
      <video
        aria-label={source.preview ? 'Silent abstract playback preview' : 'Meet Hallelujah Hospital'}
        controls
        hidden={failed}
        onError={() => setFailed(true)}
        playsInline
        poster="/editorial/together-care.webp"
        preload="none"
        ref={video}
      >
        {open && source.captionsSrc ? <track default kind="captions" label="English" src={source.captionsSrc} srcLang="en" /> : null}
      </video>
      {source.preview ? <p className="hospital-film-notice" id="hospital-film-notice">Playback preview. Hospital footage is still to be supplied.</p> : null}
      {failed ? <p className="hospital-film-fallback" role="status">The film could not be played. Close this window to continue exploring care and visitor information.</p> : null}
      {source.transcriptHref ? <a className="text-link" href={source.transcriptHref}>Read the film transcript <span aria-hidden="true">→</span></a> : null}
    </dialog>
  </>
}
