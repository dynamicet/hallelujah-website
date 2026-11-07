/** Bind near the chapter, but request film bytes only after explicit activation. */
export function startCareFilm(player: HTMLVideoElement, button: HTMLButtonElement) {
  const frame = player.closest<HTMLElement>('.care-background-film')!
  const stop = frame.querySelector<HTMLButtonElement>('.care-film-stop')!
  const status = frame.querySelector<HTMLElement>('.care-film-status')!
  const progress = frame.querySelector<HTMLElement>('.care-film-progress > span')!
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const controller = new AbortController()
  const { signal } = controller
  let generation = 0
  player.muted = true
  player.defaultMuted = true

  function state(next: string, message: string) {
    frame.dataset.filmState = next
    status.textContent = message
    const playing = next === 'playing' || next === 'loading'
    button.dataset.playing = String(playing)
    const label = playing ? 'Pause film' : next === 'paused' ? 'Resume film' : next === 'ended' ? 'Replay film' : next === 'failed' ? 'Try film again' : 'Watch film'
    let controlLabel = button.querySelector<HTMLElement>('[data-film-control-label]')
    if (!controlLabel) {
      // Recover if a DOM refresh or translation replaced the label markup.
      controlLabel = document.createElement('span')
      controlLabel.dataset.filmControlLabel = ''
      button.replaceChildren(...button.querySelectorAll('svg'), controlLabel)
    }
    controlLabel.textContent = label
    button.setAttribute('aria-label', label + ': Care in every detail')
    stop.hidden = !['playing', 'loading', 'paused'].includes(next)
  }
  function reset(next = 'poster') {
    generation++
    player.pause()
    player.removeAttribute('src')
    player.load()
    player.dataset.played = 'false'
    progress.style.transform = 'scaleX(0)'
    state(next, next === 'failed' ? 'Film unavailable · You can try again' : '18 sec · No sound')
  }
  function pause() {
    if (!player.hasAttribute('src')) return
    generation++
    player.pause()
    state('paused', 'Paused · Continue when you’re ready')
  }
  async function toggle() {
    if (reduced.matches) return
    if (['playing', 'loading'].includes(frame.dataset.filmState!)) { pause(); return }
    const attempt = ++generation
    if (!player.hasAttribute('src')) {
      const portrait = matchMedia('(max-width: 600px)').matches
      const format = player.canPlayType('video/webm') ? 'webm' : 'mp4'
      player.src = `/editorial/hallelujah-home-loop${portrait ? '-mobile' : ''}.${format}`
    }
    state('loading', 'Loading your film…')
    try {
      await player.play()
    } catch {
      if (!signal.aborted && attempt === generation) reset('failed')
    }
  }
  function preference() {
    if (reduced.matches) reset()
    button.hidden = reduced.matches
    if (reduced.matches) status.textContent = 'Still image'
  }
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting && ['playing', 'loading'].includes(frame.dataset.filmState!)) pause()
  }, { threshold: 0 })
  observer.observe(frame)
  button.addEventListener('click', toggle, { signal })
  stop.addEventListener('click', () => { reset(); button.focus({ preventScroll: true }) }, { signal })
  player.addEventListener('playing', () => {
    if (signal.aborted || reduced.matches || document.hidden || frame.dataset.filmState === 'paused') { player.pause(); return }
    // Only fade the video in when an actual frame is available.
    player.dataset.played = 'true'
    state('playing', 'Playing · No sound')
  }, { signal })
  player.addEventListener('pause', () => {
    if (player.paused && ['playing', 'loading'].includes(frame.dataset.filmState!) && !player.ended) state('paused', 'Paused · Continue when you’re ready')
  }, { signal })
  player.addEventListener('waiting', () => {
    if (frame.dataset.filmState === 'playing') state('loading', 'Buffering · Your film will continue')
  }, { signal })
  player.addEventListener('timeupdate', () => {
    const fraction = Number.isFinite(player.duration) && player.duration > 0 ? player.currentTime / player.duration : 0
    progress.style.transform = `scaleX(${fraction})`
  }, { signal })
  player.addEventListener('ended', () => reset('ended'), { signal })
  player.addEventListener('error', () => { if (player.hasAttribute('src')) reset('failed') }, { signal })
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause() }, { signal })
  window.addEventListener('pagehide', () => reset(), { signal })
  reduced.addEventListener('change', preference, { signal })
  state('poster', '18 sec · No sound')
  preference()
  return () => { controller.abort(); observer.disconnect(); reset() }
}
