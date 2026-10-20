(() => {
  const wrappers = [...document.querySelectorAll('[data-optional-map]')]

  for (const wrapper of wrappers) {
    const activate = wrapper.querySelector('[data-map-activate]')
    const acknowledgement = wrapper.querySelector('[data-map-acknowledgement]')
    const remove = wrapper.querySelector('[data-map-remove]')
    const surface = wrapper.querySelector('[data-map-surface]')
    const live = wrapper.querySelector('[data-map-live]')

    if (
      wrapper.dataset.mapAuthority !== 'controlled-fixture'
      || wrapper.dataset.mapState !== 'idle'
      || !(activate instanceof HTMLButtonElement)
      || !(acknowledgement instanceof HTMLInputElement)
      || !(remove instanceof HTMLButtonElement)
      || !(surface instanceof HTMLElement)
      || !(live instanceof HTMLElement)
    ) continue

    function reset({ announce = false, clearChoice = false, restoreFocus = false } = {}) {
      wrapper.dataset.mapState = 'idle'
      surface.hidden = true
      remove.hidden = true
      activate.hidden = false
      activate.setAttribute('aria-expanded', 'false')
      if (clearChoice) acknowledgement.checked = false
      activate.disabled = !acknowledgement.checked
      live.textContent = announce ? 'Written directions remain available.' : ''
      if (restoreFocus) activate.focus()
    }

    acknowledgement.disabled = false
    acknowledgement.addEventListener('change', () => {
      activate.disabled = !acknowledgement.checked
      if (!acknowledgement.checked) reset({ announce: wrapper.dataset.mapState === 'active' })
    })
    activate.addEventListener('click', () => {
      if (!acknowledgement.checked) return
      wrapper.dataset.mapState = 'active'
      activate.hidden = true
      activate.setAttribute('aria-expanded', 'true')
      surface.hidden = false
      remove.hidden = false
      live.textContent = 'Map unavailable. Written directions remain available.'
      surface.focus()
    })
    remove.addEventListener('click', () => reset({ announce: true, restoreFocus: true }))
    window.addEventListener('pagehide', () => reset({ clearChoice: true }))
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) reset({ clearChoice: true })
    })
  }

  document.documentElement.dataset.optionalMapEnhanced = 'true'
})()
