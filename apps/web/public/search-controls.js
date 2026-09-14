function restoreServerState() {
  const state = new URL(window.location.href).searchParams
  const selectedTypes = new Set(state.getAll('type'))

  for (const form of document.querySelectorAll('[data-search-controls-form]')) {
    const query = form.querySelector('input[name="q"]')
    if (query instanceof HTMLInputElement) {
      const value = query.getAttribute('value') ?? ''
      query.defaultValue = value
      query.value = value
    }

    for (const filter of form.querySelectorAll('input[name="type"]')) {
      if (filter instanceof HTMLInputElement) {
        const selected = selectedTypes.has(filter.value)
        filter.defaultChecked = selected
        filter.checked = selected
      }
    }
  }
}

const compactFilters = window.matchMedia('(max-width: 63.999rem)')

function synchronizeFilterDisclosure() {
  for (const disclosure of document.querySelectorAll('[data-filter-disclosure]')) {
    const hasSelection = Boolean(disclosure.querySelector('input[name="type"]:checked'))
    disclosure.open = !compactFilters.matches || hasSelection
  }
}

restoreServerState()
synchronizeFilterDisclosure()
window.addEventListener('pageshow', restoreServerState)
compactFilters.addEventListener('change', synchronizeFilterDisclosure)
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    restoreServerState()
    synchronizeFilterDisclosure()
    document.documentElement.dataset.searchControlsEnhanced = 'true'
  })
})

for (const disclosure of document.querySelectorAll('[data-filter-disclosure]')) {
  const summary = disclosure.querySelector('summary')
  if (!(summary instanceof HTMLElement)) continue

  disclosure.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !disclosure.open) return
    event.preventDefault()
    disclosure.open = false
    summary.focus()
  })
}
