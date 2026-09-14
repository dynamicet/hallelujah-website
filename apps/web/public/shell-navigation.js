(() => {
  const panel = document.querySelector('[data-navigation-panel]')
  const trigger = document.querySelector('[data-menu-trigger]')

  if (!(panel instanceof HTMLElement) || !(trigger instanceof HTMLButtonElement)) return

  let shouldRestoreFocus = false

  panel.addEventListener('beforetoggle', (event) => {
    if (event.newState !== 'closed') return
    shouldRestoreFocus = panel.contains(document.activeElement)
  })

  panel.addEventListener('toggle', (event) => {
    const open = event.newState === 'open'
    trigger.setAttribute('aria-expanded', String(open))
    if (!open && shouldRestoreFocus) trigger.focus()
    shouldRestoreFocus = false
  })

  panel.addEventListener('click', (event) => {
    if (!(event.target instanceof Element) || !event.target.closest('a[href]')) return
    shouldRestoreFocus = true
    panel.hidePopover()
  })

  document.documentElement.dataset.shellNavigationEnhanced = 'true'
})()
