/* Progressive enhancement: the server always delivers the complete original logo. */
(() => {
  const key = 'hallelujah-logo-entry-v1'
  const frame = document.querySelector('[data-logo-reveal]')
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (!frame || window.__hallelujahLogoEntered) return
  window.__hallelujahLogoEntered = true
  try {
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, 'seen')
  } catch {
    // Without session persistence, prefer the static identity over repeat intros.
    return
  }
  if (motion.matches || !Element.prototype.animate) return
  const image = new Image()
  image.src = '/brand/hallelujah-emblem.png'
  const started = performance.now()
  image.decode().then(() => {
    // Never introduce a late animation after slow loading or background entry.
    if (performance.now() - started > 500 || document.hidden || motion.matches) return
    const firstPaint = performance.getEntriesByName('first-contentful-paint')[0]
    if (firstPaint && performance.now() - firstPaint.startTime > 150) return
    const complete = frame.querySelector('[data-logo-complete]')
    const parts = frame.querySelector('[data-logo-parts]')
    const animations = []
    let timer
    const finish = () => {
      complete.style.visibility = 'visible'
      parts.style.visibility = 'hidden'
      animations.forEach((animation) => animation.cancel())
      clearTimeout(timer)
      motion.removeEventListener('change', finish)
      window.removeEventListener('pagehide', finish)
      frame.dataset.logoState = 'complete'
    }
    try {
      const choreography = {
        left: [0, 1080, 5, 12], right: [80, 1080, -5, 12],
        center: [180, 800, 0, 9], gold: [320, 760, 2, 7],
        pink: [440, 720, -2, 7], cyan: [560, 680, 2, 6],
      }
      for (const part of frame.querySelectorAll('[data-logo-part]')) {
        const [delay, duration, x, y] = choreography[part.dataset.logoPart]
        animations.push(part.animate([
          { opacity: 0, transform: `translate(${x}px, ${y}px)` },
          { opacity: 1, transform: 'translate(0, 0)' },
        ], { delay, duration, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both' }))
      }
      complete.style.visibility = 'hidden'
      parts.style.visibility = 'visible'
      frame.dataset.logoState = 'revealing'
      // Switch to the untouched raster after assembly; hold in place with the page.
      timer = setTimeout(finish, 1800)
      motion.addEventListener('change', finish)
      window.addEventListener('pagehide', finish, { once: true })
      Promise.all(animations.map((animation) => animation.finished)).catch(finish)
    } catch { finish() }
  }).catch(() => { /* The original server-rendered image remains visible. */ })
})()
