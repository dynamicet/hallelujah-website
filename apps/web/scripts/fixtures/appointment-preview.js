// Loopback review enhancement only. This file is never copied into the deployable public assets.
(() => {
  const controller = document.querySelector('[data-appointment-form-controller="enabled"]')
  const form = controller?.querySelector('#appointment-request-form')
  if (!(form instanceof HTMLFormElement)) return

  const submit = form.querySelector('[data-form-submit]')
  if (!(submit instanceof HTMLButtonElement)) return

  const fields = ['care-route', 'doctor-id', 'service-id', 'full-name', 'phone', 'preferred-date', 'privacy-acknowledged']
  const summary = form.querySelector('#appointment-error-summary')
  const summaryCount = summary?.querySelector('[data-error-count]')
  const panels = [...form.querySelectorAll('[data-appointment-state-panel]')]
  let pendingTimer

  form.noValidate = true
  submit.disabled = false

  const setSelector = (route) => {
    for (const kind of ['doctor', 'service']) {
      const wrapper = form.querySelector(`[data-care-selector="${kind}"]`)
      const select = wrapper?.querySelector('select')
      const visible = route === kind
      if (wrapper instanceof HTMLElement) wrapper.hidden = !visible
      if (select instanceof HTMLSelectElement) {
        select.disabled = !visible
        select.required = visible
        if (!visible) select.value = ''
      }
    }
  }

  const selectedRoute = () => form.querySelector('input[name="care_route"]:checked')?.value ?? ''
  setSelector(selectedRoute())
  for (const choice of form.querySelectorAll('input[name="care_route"]')) {
    choice.addEventListener('change', () => setSelector(selectedRoute()))
  }

  const setFieldError = (field, visible) => {
    const target = form.querySelector(`#${field}`)
    const error = form.querySelector(`#${field}-error`)
    const item = summary?.querySelector(`[data-error-item="${field}"]`)
    if (target instanceof HTMLElement) {
      if (visible) target.setAttribute('aria-invalid', 'true')
      else target.removeAttribute('aria-invalid')
    }
    if (error instanceof HTMLElement) error.hidden = !visible
    if (item instanceof HTMLElement) item.hidden = !visible
  }

  const hidePanels = () => {
    for (const wrapper of panels) {
      const panel = wrapper.querySelector('[data-form-status]')
      if (panel instanceof HTMLElement) panel.hidden = true
    }
  }

  const showPanel = (kind, focus = false) => {
    hidePanels()
    const panel = form.querySelector(`[data-appointment-state-panel="${kind}"] [data-form-status]`)
    if (!(panel instanceof HTMLElement)) return
    panel.hidden = false
    if (focus) {
      panel.tabIndex = -1
      panel.focus()
    }
  }

  const validate = () => {
    const route = selectedRoute()
    const doctor = form.elements.namedItem('doctor_id')
    const service = form.elements.namedItem('service_id')
    const fullName = form.elements.namedItem('full_name')
    const phone = form.elements.namedItem('phone')
    const preferredDate = form.elements.namedItem('preferred_date')
    const privacy = form.elements.namedItem('privacy_acknowledged')
    const invalid = new Set()

    if (!['doctor', 'service', 'not_sure'].includes(route)) invalid.add('care-route')
    if (route === 'doctor' && (!(doctor instanceof HTMLSelectElement) || !doctor.value)) invalid.add('doctor-id')
    if (route === 'service' && (!(service instanceof HTMLSelectElement) || !service.value)) invalid.add('service-id')
    if (!(fullName instanceof HTMLInputElement) || fullName.value.trim() !== 'TEST PATIENT') invalid.add('full-name')
    if (!(phone instanceof HTMLInputElement) || phone.value.trim() !== '+0 000 000 0000') invalid.add('phone')
    if (preferredDate instanceof HTMLInputElement && preferredDate.value && !/^\d{4}-\d{2}-\d{2}$/u.test(preferredDate.value)) invalid.add('preferred-date')
    if (!(privacy instanceof HTMLInputElement) || !privacy.checked) invalid.add('privacy-acknowledged')
    return invalid
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    clearTimeout(pendingTimer)
    const invalid = validate()
    for (const field of fields) setFieldError(field, invalid.has(field))
    hidePanels()

    if (invalid.size > 0) {
      if (summary instanceof HTMLElement) {
        summary.hidden = false
        summary.querySelector('h3')?.focus()
      }
      if (summaryCount instanceof HTMLElement) {
        summaryCount.textContent = invalid.size === 1
          ? 'There is 1 problem to correct.'
          : `There are ${invalid.size} problems to correct.`
      }
      return
    }

    if (summary instanceof HTMLElement) summary.hidden = true
    submit.disabled = true
    submit.textContent = 'Checking synthetic request…'
    form.setAttribute('aria-busy', 'true')
    showPanel('pending')
    pendingTimer = window.setTimeout(() => {
      form.removeAttribute('aria-busy')
      submit.disabled = false
      submit.textContent = 'Validate synthetic request'
      showPanel('known-failure', true)
    }, 80)
  })
})()
