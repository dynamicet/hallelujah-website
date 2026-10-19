(() => {
  const panel = document.querySelector('[data-navigation-panel]')
  const trigger = document.querySelector('[data-menu-trigger]')

  if (!(panel instanceof HTMLElement) || !(trigger instanceof HTMLButtonElement)) return

  const language = document.querySelector('[data-language-switcher]')
  const closeLanguage = (restoreFocus = false) => {
    if (!(language instanceof HTMLDetailsElement) || !language.open) return
    language.open = false
    if (restoreFocus) language.querySelector('summary')?.focus()
  }
  document.addEventListener('click', (event) => {
    if (event.target instanceof Node && !language?.contains(event.target)) closeLanguage()
  })
  language?.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !language.open) return
    event.preventDefault()
    event.stopPropagation()
    closeLanguage(true)
  })

  let shouldRestoreFocus = false

  panel.addEventListener('beforetoggle', (event) => {
    if (event.newState !== 'closed') return
    shouldRestoreFocus = panel.contains(document.activeElement)
  })

  panel.addEventListener('toggle', (event) => {
    const open = event.newState === 'open'
    trigger.setAttribute('aria-expanded', String(open))
    if (!open) closeLanguage()
    if (!open && shouldRestoreFocus) trigger.focus()
    shouldRestoreFocus = false
  })

  panel.addEventListener('click', (event) => {
    if (!(event.target instanceof Element) || !event.target.closest('a[href]')) return
    shouldRestoreFocus = true
    if (panel.matches(':popover-open')) panel.hidePopover()
  })

  document.documentElement.dataset.shellNavigationEnhanced = 'true'
})()
