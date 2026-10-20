(() => {
  const root = document.documentElement
  const frame = document.querySelector('[data-logo-overlay]')
  if (!frame || root.dataset.logoEntry !== 'pending' || window.__hallelujahLogoEntered) return
  window.__hallelujahLogoEntered = true
  let animation
  let timer
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  const finish = () => {
    delete root.dataset.logoEntry
    frame.dataset.logoState = 'complete'
    animation?.cancel()
    clearTimeout(timer)
    motion.removeEventListener('change', finish)
  }
  timer = setTimeout(finish, 1600)
  motion.addEventListener('change', finish)
  const image = new Image()
  image.src = '/brand/hallelujah-emblem.png'
  image.decode().then(() => {
    if (root.dataset.logoEntry !== 'pending' || document.hidden) { finish(); return }
    if (motion.matches || !Element.prototype.animate) {
      frame.dataset.logoState = 'static'
      clearTimeout(timer)
      timer = setTimeout(finish, 200)
      return
    }
    try {
      frame.dataset.logoState = 'revealing'
      animation = frame.querySelector('svg').animate([
        { clipPath: 'inset(0 0 100% 0)', opacity: 0.3 },
        { clipPath: 'inset(0 0 0% 0)', opacity: 1 },
      ], { duration: 1000, easing: 'ease-out', fill: 'both' })
      animation.finished.then(finish, finish)
    } catch { finish() }
  }).catch(finish)
})()
