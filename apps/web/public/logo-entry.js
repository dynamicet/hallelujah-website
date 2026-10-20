/* Runs before first paint; unavailable storage or JS leaves content accessible. */
(() => {
  if (location.pathname !== '/' || performance.getEntriesByName('first-contentful-paint').length) return
  try {
    const key = 'hallelujah-logo-entry-v2'
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, 'seen')
  } catch { return }
  const root = document.documentElement
  root.dataset.logoEntry = 'pending'
  // Independent of image decoding and the animation script.
  setTimeout(() => { delete root.dataset.logoEntry }, 1800)
  window.addEventListener('pagehide', () => { delete root.dataset.logoEntry }, { once: true })
})()
