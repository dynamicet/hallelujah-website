(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  const accents = [...document.querySelectorAll('[data-motion-accent]')]
  const media = [...document.querySelectorAll('[data-media-state]')]

  function disableAccents() {
    for (const accent of accents) accent.dataset.motionEnabled = 'false'
  }

  function enableAccents() {
    if (reduced.matches || navigator.connection?.saveData || document.visibilityState !== 'visible') return
    for (const accent of accents) accent.dataset.motionEnabled = 'true'
  }

  reduced.addEventListener('change', disableAccents)
  document.addEventListener('visibilitychange', disableAccents)
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) disableAccents()
  })
  window.requestAnimationFrame(enableAccents)

  for (const frame of media) {
    const video = frame.querySelector('[data-media-video]')
    const poster = frame.querySelector('[data-media-poster]')
    const play = frame.querySelector('[data-media-play]')
    const stop = frame.querySelector('[data-media-stop]')
    const status = frame.querySelector('[data-media-status]')
    const captions = frame.querySelector('[data-media-captions-src]')
    const source = frame.dataset.mediaSrc
    const heading = frame.dataset.mediaHeading
    if (!(video instanceof HTMLVideoElement) || !poster || !play || !stop || !status || !source) continue

    function clearSource(nextState = 'poster') {
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
      frame.dataset.mediaState = nextState
      play.textContent = 'Play ' + heading
      status.hidden = nextState !== 'failed'
    }

    play.addEventListener('click', async () => {
      if (frame.dataset.mediaState === 'playing') {
        video.pause()
        frame.dataset.mediaState = 'paused'
        play.textContent = 'Resume ' + heading
        return
      }

      if (frame.dataset.mediaState !== 'paused') {
        video.src = source
        if (captions) {
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
      play.textContent = 'Pause ' + heading
      try {
        await video.play()
      } catch {
        if (frame.dataset.mediaState === 'playing') clearSource('failed')
      }
    })

    stop.addEventListener('click', () => {
      clearSource()
      play.focus()
    })
    video.addEventListener('error', () => {
      if (video.hasAttribute('src')) clearSource('failed')
    })
    video.addEventListener('pause', () => {
      if (frame.dataset.mediaState === 'playing' && video.hasAttribute('src') && !video.ended) {
        frame.dataset.mediaState = 'paused'
        play.textContent = 'Resume ' + heading
      }
    })
    video.addEventListener('play', () => {
      if (frame.dataset.mediaState === 'paused' && video.hasAttribute('src')) {
        frame.dataset.mediaState = 'playing'
        play.textContent = 'Pause ' + heading
      }
    })
    video.addEventListener('ended', () => {
      clearSource('ended')
      play.textContent = 'Replay ' + heading
    })
    window.addEventListener('pagehide', () => clearSource())
  }

  document.documentElement.dataset.motionMediaEnhanced = 'true'
})()
