(() => {
  const form = document.querySelector('[data-form-primitives-fixture] [data-form-primitive]')
  if (!(form instanceof HTMLFormElement)) return

  const submit = form.querySelector('[data-form-submit]')
  const unavailable = form.querySelector('[data-controlled-submit-unavailable]')
  const summary = form.querySelector('[data-error-summary]')
  const pending = form.querySelector('[data-form-status="pending"]')
  const failure = form.querySelector('[data-form-status="failure"]')
  const reference = form.elements.namedItem('controlledReference')
  const channel = form.querySelector('[data-choice-group]')
  if (
    !(submit instanceof HTMLButtonElement)
    || !(summary instanceof HTMLElement)
    || !(pending instanceof HTMLElement)
    || !(failure instanceof HTMLElement)
    || !(reference instanceof HTMLInputElement)
    || !(channel instanceof HTMLFieldSetElement)
  ) return

  const errorContracts = [
    {
      control: reference,
      error: document.getElementById('controlled-reference-error'),
      invalid: () => reference.value.trim() !== 'CONTROLLED',
    },
    {
      control: channel,
      error: document.getElementById('controlled-channel-error'),
      invalid: () => !form.querySelector('input[name="reviewChannel"]:checked'),
    },
  ]

  form.noValidate = true
  submit.disabled = false
  if (unavailable instanceof HTMLElement) unavailable.hidden = true
  document.documentElement.dataset.formPrimitivesEnhanced = 'true'

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    summary.hidden = true
    failure.hidden = true
    for (const contract of errorContracts) {
      contract.control.removeAttribute('aria-invalid')
      if (contract.error instanceof HTMLElement) contract.error.hidden = true
    }

    form.setAttribute('aria-busy', 'true')
    submit.disabled = true
    pending.hidden = false

    window.setTimeout(() => {
      const invalidContracts = errorContracts.filter((contract) => contract.invalid())
      pending.hidden = true
      form.removeAttribute('aria-busy')
      submit.disabled = false

      if (invalidContracts.length > 0) {
        for (const contract of invalidContracts) {
          contract.control.setAttribute('aria-invalid', 'true')
          if (contract.error instanceof HTMLElement) contract.error.hidden = false
        }
        summary.hidden = false
        summary.focus()
        return
      }

      failure.hidden = false
    }, 80)
  })
})()
