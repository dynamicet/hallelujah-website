/** Optional prototype media runtime, loaded only on routes that contain it. */
export function bindMotionMedia() {
  const controller = new AbortController()
  const { signal } = controller
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  const accents = document.querySelectorAll<HTMLElement>('[data-motion-accent]')
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
  const syncAccents = () => accents.forEach((accent) => {
    accent.dataset.motionEnabled = String(!reduced.matches && !saveData && document.visibilityState === 'visible')
  })
  reduced.addEventListener('change', syncAccents, { signal })
  document.addEventListener('visibilitychange', syncAccents, { signal })
  window.addEventListener('pageshow', syncAccents, { signal })
  const animationFrame = window.requestAnimationFrame(syncAccents)

  const cleanups: Array<() => void> = []
  document.querySelectorAll<HTMLElement>('[data-media-state]').forEach((frame) => {
    const video = frame.querySelector<HTMLVideoElement>('[data-media-video]')
    const poster = frame.querySelector<HTMLElement>('[data-media-poster]')
    const play = frame.querySelector<HTMLButtonElement>('[data-media-play]')
    const stop = frame.querySelector<HTMLButtonElement>('[data-media-stop]')
    const status = frame.querySelector<HTMLElement>('[data-media-status]')
    const captions = frame.querySelector<HTMLTrackElement>('[data-media-captions-src]')
    const source = frame.dataset.mediaSrc
    const heading = frame.dataset.mediaHeading
    if (!video || !poster || !play || !stop || !status || !source || !heading) return

    const clearSource = (nextState = 'poster') => {
      frame.dataset.mediaState = nextState
      video.pause()
      video.removeAttribute('src')
      if (captions) {
        captions.track.mode = 'disabled'
        captions.removeAttribute('src')
      }
      video.load()
      video.hidden = true
      poster.hidden = false
      stop.hidden = true
      play.textContent = `${nextState === 'ended' ? 'Replay' : 'Play'} ${heading}`
      status.hidden = nextState !== 'failed'
    }
    play.addEventListener('click', async () => {
      if (frame.dataset.mediaState === 'playing') {
        video.pause()
        frame.dataset.mediaState = 'paused'
        play.textContent = `Resume ${heading}`
        return
      }
      if (frame.dataset.mediaState !== 'paused') {
        video.src = source
        if (captions?.dataset.mediaCaptionsSrc) {
          captions.src = captions.dataset.mediaCaptionsSrc
          captions.track.mode = 'showing'
        }
        video.load()
      }
      video.hidden = false
      poster.hidden = true
      stop.hidden = false
      status.hidden = true
      frame.dataset.mediaState = 'playing'
      play.textContent = `Pause ${heading}`
      try {
        await video.play()
      } catch {
        if (!signal.aborted && frame.dataset.mediaState === 'playing') clearSource('failed')
      }
    }, { signal })
    stop.addEventListener('click', () => {
      clearSource()
      play.focus()
    }, { signal })
    video.addEventListener('error', () => {
      if (video.hasAttribute('src')) clearSource('failed')
    }, { signal })
    video.addEventListener('pause', () => {
      if (frame.dataset.mediaState === 'playing' && video.hasAttribute('src') && !video.ended) {
        frame.dataset.mediaState = 'paused'
        play.textContent = `Resume ${heading}`
      }
    }, { signal })
    video.addEventListener('play', () => {
      if (frame.dataset.mediaState === 'paused' && video.hasAttribute('src')) {
        frame.dataset.mediaState = 'playing'
        play.textContent = `Pause ${heading}`
      }
    }, { signal })
    video.addEventListener('ended', () => clearSource('ended'), { signal })
    window.addEventListener('pagehide', () => clearSource(), { signal })
    cleanups.push(() => clearSource())
  })
  return () => {
    controller.abort()
    window.cancelAnimationFrame(animationFrame)
    accents.forEach((accent) => { accent.dataset.motionEnabled = 'false' })
    cleanups.forEach((cleanup) => cleanup())
  }
}
