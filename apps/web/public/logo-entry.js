/* Decide before rendering; never remove an identity that has already been painted. */
(() => {
  if (location.pathname !== '/' || performance.getEntriesByName('first-contentful-paint').length) return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !Element.prototype.animate) return
  try {
    const key = 'hallelujah-logo-entry-v1'
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, 'seen')
  } catch { return }
  document.documentElement.dataset.logoEntry = 'pending'
  // Independent of the enhancement script, which may fail to load.
  setTimeout(() => { delete document.documentElement.dataset.logoEntry }, 2000)
})()
