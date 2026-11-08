'use client'

import { getInterfaceLanguage, interfaceLanguageChangeEvent } from '@/website/interface-language'
import { translateInterface } from '@/website/interface-messages'

import { isCompatibleCare } from './care-model'
import { prepareAppointmentRequest } from './appointment-draft'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function DemoInteractions() {
  const pathname = usePathname()
  const search = useSearchParams().toString()
  useEffect(() => {
    const t = (text: string) => translateInterface(text, getInterfaceLanguage())
    const controller = new AbortController()
    const { signal } = controller
    const form = document.querySelector<HTMLFormElement>('#appointment-request-form')
    const safeForm = form?.closest<HTMLElement>('[data-appointment-safe-form]')
    const frame = form?.closest<HTMLElement>('[data-appointment-template]')
    if (!form || !safeForm || !frame || form.closest('[data-appointment-form-controller="enabled"]') === null) {
      return () => controller.abort()
    }
    const submit = form.querySelector<HTMLButtonElement>('[data-form-submit]')
    const summary = form.querySelector<HTMLElement>('#appointment-error-summary')
    const fields = ['care-route', 'doctor-id', 'service-id', 'full-name', 'phone', 'preferred-date', 'privacy-acknowledged'] as const
    type Field = typeof fields[number]
    const initialState = frame.dataset.appointmentState || 'editing'
    const outcomeScenario = frame.dataset.appointmentOutcome || initialState
    let state = initialState
    let busy = false
    let attempts = initialState === 'known-failure' ? 1 : 0
    let reconciledMissing = false
    let timer: number | undefined
    let journeyStep = initialState === 'editing' ? 0 : initialState === 'validation' ? 1 : 2
    let furthestStep = journeyStep
    const syncCare = (changed?: string) => {
      const selected = form.querySelector<HTMLInputElement>('input[name="care_route"]:checked')?.value
      const doctor = form.querySelector<HTMLSelectElement>('#doctor-id')
      const service = form.querySelector<HTMLSelectElement>('#service-id')
      const notice = form.querySelector<HTMLElement>('[data-selection-notice]')
      if (notice && ['care-route', 'doctor-id', 'service-id'].includes(changed ?? '')) {
        notice.hidden = true
        notice.textContent = ''
      }
      if (selected === 'not_sure') {
        if (doctor) doctor.value = ''
        if (service) service.value = ''
      }
      if (doctor?.value && service?.value && !isCompatibleCare(doctor.value, service.value)) {
        if (changed === 'service-id') doctor.value = ''
        else service.value = ''
        if (notice) {
          notice.hidden = false
          notice.textContent = t(changed === 'service-id' ? 'Your previous doctor does not provide this care. Choose a related doctor or continue without a doctor preference.' : 'Your previous care choice is not listed for this doctor. Choose related care or continue with the doctor.')
        }
      }
      form.querySelectorAll<HTMLElement>('[data-care-selector]').forEach((element) => {
        const mode = element.dataset.careSelector
        element.hidden = mode === 'not_sure' ? selected !== 'not_sure' : selected === 'not_sure'
        const select = element.querySelector<HTMLSelectElement>('select')
        if (select) {
          select.required = selected === mode
          const emptyOption = [...select.options].find((option) => !option.value)
          if (emptyOption) emptyOption.textContent = t(select.required
            ? mode === 'doctor' ? 'Choose a doctor' : 'Choose a specialty or service'
            : mode === 'doctor' ? 'No doctor preference' : 'No specialty or service preference')
          select.disabled = selected === 'not_sure'
          const requirement = element.querySelector<HTMLElement>('label > span:last-child')
          if (requirement) requirement.textContent = t(select.required ? 'Required' : 'Optional')
          for (const option of select.options) {
            if (!option.value) continue
            const related = select === doctor && selected === 'service' && service?.value
              ? isCompatibleCare(option.value, service.value)
              : select === service && selected === 'doctor' && doctor?.value
                ? isCompatibleCare(doctor.value, option.value) : true
            option.disabled = !related
            option.hidden = !related
          }
        }
      })
      form.dispatchEvent(new Event('appointment-selection-change'))
    }
    const showErrors = (errors: readonly Field[]) => {
      if (!summary) return
      summary.hidden = errors.length === 0
      const count = summary.querySelector<HTMLElement>('[data-error-count]')
      if (count) count.textContent = t(`There ${errors.length === 1 ? 'is 1 problem' : `are ${errors.length} problems`} to correct.`)
      fields.forEach((field) => {
        const invalid = errors.includes(field)
        const item = summary.querySelector<HTMLElement>(`[data-error-item="${field}"]`)
        const message = form.querySelector<HTMLElement>(`#${field}-error`)
        const control = form.querySelector<HTMLElement>(`#${field}`)
        if (item) item.hidden = !invalid
        if (message) message.hidden = !invalid
        if (control) {
          const descriptions = new Set((control.getAttribute('aria-describedby') || '').split(/\s+/u).filter(Boolean))
          descriptions.delete(`${field}-error`)
          if (invalid) descriptions.add(`${field}-error`)
          if (descriptions.size) control.setAttribute('aria-describedby', [...descriptions].join(' '))
          else control.removeAttribute('aria-describedby')
          if (invalid) control.setAttribute('aria-invalid', 'true')
          else control.removeAttribute('aria-invalid')
        }
      })
    }
    const focusState = (name: string) => {
      form.querySelector<HTMLElement>(`#appointment-${name}-heading`)?.focus()
    }
    const clearContacts = () => {
      for (const id of ['full-name', 'phone', 'preferred-date']) {
        const control = form.querySelector<HTMLInputElement>(`#${id}`)
        if (control) control.value = ''
      }
      const consent = form.querySelector<HTMLInputElement>('#privacy-acknowledged')
      if (consent) consent.checked = false
    }
    const setState = (next: string, focus = false) => {
      state = next
      frame.dataset.appointmentState = next
      form.querySelectorAll<HTMLElement>('[data-appointment-state-panel]').forEach((panel) => {
        const status = panel.querySelector<HTMLElement>('[data-form-status]')
        if (status) status.hidden = panel.dataset.appointmentStatePanel !== next
      })
      const terminal = next === 'receipt' || next === 'delivery-warning'
      for (const id of ['A4', 'A5']) {
        const section = form.querySelector<HTMLElement>(`[data-appointment-section="${id}"]`)
        if (section) section.hidden = terminal
      }
      const action = form.querySelector<HTMLElement>('[data-form-actions]')
      if (action) action.hidden = terminal || next === 'unknown' || next === 'duplicate'
      if (submit) {
        submit.disabled = busy || terminal || next === 'unknown' || next === 'duplicate'
        submit.textContent = t(busy ? 'Checking details…' : next === 'known-failure' ? 'Try again' : 'Check details')
      }
      form.setAttribute('aria-busy', String(busy))
      if (terminal) {
        clearContacts()
        showErrors([])
      }
      syncJourney()
      if (focus) focusState(next)
    }
    const validate = (): Field[] => {
      const errors: Field[] = []
      const route = form.querySelector<HTMLInputElement>('input[name="care_route"]:checked')?.value
      const doctor = form.querySelector<HTMLSelectElement>('#doctor-id')
      const service = form.querySelector<HTMLSelectElement>('#service-id')
      if (!['doctor', 'service', 'not_sure'].includes(route ?? '')) errors.push('care-route')
      if (route === 'doctor' && !doctor?.value) errors.push('doctor-id')
      if (route === 'service' && !service?.value) errors.push('service-id')
      const result = prepareAppointmentRequest({
        doctorId: route === 'not_sure' ? undefined : doctor?.value || undefined,
        serviceId: route === 'not_sure' ? undefined : service?.value || undefined,
        fullName: form.querySelector<HTMLInputElement>('#full-name')?.value ?? '',
        phone: form.querySelector<HTMLInputElement>('#phone')?.value ?? '',
        preferredDate: form.querySelector<HTMLInputElement>('#preferred-date')?.value || undefined,
        privacyAcknowledged: form.querySelector<HTMLInputElement>('#privacy-acknowledged')?.checked ?? false,
      })
      if (!result.ok) errors.push(...result.errors.filter((field) => !errors.includes(field)))
      if (form.querySelector<HTMLInputElement>('#preferred-date')?.validity.badInput && !errors.includes('preferred-date')) errors.push('preferred-date')
      return errors
    }
    const dateControl = form.querySelector<HTMLInputElement>('#preferred-date')
    if (dateControl) {
      const today = new Date()
      const first = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()))
      dateControl.min = first.toISOString().slice(0, 10)
      dateControl.max = new Date(first.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    }
    const syncJourney = () => {
      const terminal = ['receipt', 'delivery-warning'].includes(state)
      const outcome = !['editing', 'validation', 'prepared'].includes(state)
      frame.dataset.journeyStep = String(journeyStep)
      form.querySelectorAll<HTMLElement>('[data-journey-group]').forEach((group) => {
        group.hidden = terminal || journeyStep !== (group.dataset.journeyGroup === 'care' ? 0 : 1)
      })
      const details = form.querySelector<HTMLElement>('[data-appointment-section="A4"]')
      const privacy = form.querySelector<HTMLElement>('[data-appointment-section="A5"]')
      const review = form.querySelector<HTMLElement>('[data-appointment-section="A6"]')
      if (details) details.hidden = terminal || journeyStep === 2
      if (privacy) privacy.hidden = terminal || journeyStep !== 1
      if (review) review.hidden = journeyStep !== 2 && !outcome
      const reviewTitle = form.querySelector<HTMLElement>('#appointment-submit-title')
      const reviewDescription = form.querySelector<HTMLElement>('[data-journey-review-description]')
      if (reviewTitle) reviewTitle.textContent = t(terminal ? 'Your next step' : 'Review your details')
      if (reviewDescription) reviewDescription.hidden = terminal
      const progress = form.querySelector<HTMLElement>('[data-journey-progress]')
      if (progress) progress.hidden = terminal
      form.querySelectorAll<HTMLButtonElement>('[data-journey-step]').forEach((button) => {
        const index = Number(button.dataset.journeyStep)
        button.disabled = index > furthestStep || busy || outcome
        if (index === journeyStep) button.setAttribute('aria-current', 'step')
        else button.removeAttribute('aria-current')
        button.dataset.complete = String(index < journeyStep)
      })
      const title = form.querySelector<HTMLElement>('[data-journey-title]')
      const description = form.querySelector<HTMLElement>('[data-journey-description]')
      if (title) title.textContent = t(journeyStep === 0 ? 'Choose your care' : 'A few details')
      if (description) description.textContent = ''
      const actions = form.querySelector<HTMLElement>('[data-journey-actions]')
      const back = form.querySelector<HTMLButtonElement>('[data-journey-back]')
      const next = form.querySelector<HTMLButtonElement>('[data-journey-next]')
      if (actions) actions.hidden = terminal || outcome
      if (back) back.hidden = journeyStep === 0
      if (next) {
        next.hidden = journeyStep === 2
        const unsure = form.querySelector<HTMLInputElement>('input[name="care_route"]:checked')?.value === 'not_sure'
        next.firstChild!.textContent = t(journeyStep === 0 ? unsure ? 'Continue without choosing ' : 'Continue ' : 'Review request ')
      }
      const reviewSummary = form.querySelector<HTMLElement>('[data-journey-review]')
      if (reviewSummary) reviewSummary.hidden = terminal || outcome || journeyStep !== 2
      const route = form.querySelector<HTMLInputElement>('input[name="care_route"]:checked')?.value
      const chosenDoctor = form.querySelector<HTMLSelectElement>('#doctor-id')
      const chosenService = form.querySelector<HTMLSelectElement>('#service-id')
      const selectedLabels = [chosenDoctor, chosenService].flatMap((select) => select?.value ? [select.selectedOptions[0]?.textContent ?? ''] : [])
      const date = form.querySelector<HTMLInputElement>('#preferred-date')?.value
      const parsedDate = date ? new Date(`${date}T00:00:00Z`) : undefined
      const values: Record<string, string> = {
        visit: form.querySelector<HTMLInputElement>('input[name="visit_type"]:checked')?.value === 'follow-up' ? 'Follow-up visit' : 'First visit',
        care: route === 'not_sure' ? 'Help finding the right care' : selectedLabels.length ? selectedLabels.join(' · ') : 'Choose your care',
        name: terminal ? 'Not added' : form.querySelector<HTMLInputElement>('#full-name')?.value || 'Not added',
        phone: terminal ? 'Not added' : form.querySelector<HTMLInputElement>('#phone')?.value || 'Not added',
        date: parsedDate && Number.isFinite(parsedDate.getTime()) ? new Intl.DateTimeFormat(getInterfaceLanguage(), { dateStyle: 'medium', timeZone: 'UTC' }).format(parsedDate) : 'No preference',
      }
      frame.querySelectorAll<HTMLElement>('[data-journey-value]').forEach((element) => {
        const value = values[element.dataset.journeyValue ?? ''] ?? ''
        const display = ['visit', 'care', 'date'].includes(element.dataset.journeyValue ?? '') ? t(value) : value
        if (element.textContent !== display) element.textContent = display
      })
    }
    const goToStep = (step: number, focus = true) => {
      // Keyboard focus can still be scrolling toward the previous stage's button.
      // Cancel that scroll before hiding or resizing the stage.
      if (focus) window.scrollTo({ top: window.scrollY, behavior: 'instant' })
      journeyStep = step
      furthestStep = Math.max(furthestStep, step)
      syncJourney()
      if (focus) {
        const heading = form.querySelector<HTMLElement>(step === 2 ? '#appointment-submit-title' : '[data-journey-title]')
        heading?.focus({ preventScroll: true })
        // Let the browser finish anchoring the resized stage before positioning it.
        requestAnimationFrame(() => {
          if (!signal.aborted && document.activeElement === heading) {
            heading?.scrollIntoView({ block: 'start', behavior: 'instant' })
          }
        })
      }
    }
    const stepForField = (field: Field) => ['care-route', 'doctor-id', 'service-id'].includes(field) ? 0 : 1
    const advanceJourney = () => {
      if (journeyStep >= 2 || busy) return
      const errors = validate().filter((field) => stepForField(field) === journeyStep)
      showErrors(errors)
      if (errors.length) { summary?.querySelector<HTMLElement>("#appointment-error-summary-heading")?.focus(); return }
      goToStep(journeyStep + 1)
    }
    form.querySelector<HTMLButtonElement>('[data-journey-next]')?.addEventListener('click', advanceJourney, { signal })
    form.querySelector<HTMLButtonElement>('[data-journey-back]')?.addEventListener('click', () => {
      showErrors([])
      goToStep(Math.max(0, journeyStep - 1))
    }, { signal })
    form.querySelector<HTMLButtonElement>('[data-journey-edit-care]')?.addEventListener('click', () => { showErrors([]); goToStep(0) }, { signal })
    form.querySelector<HTMLButtonElement>('[data-journey-edit]')?.addEventListener('click', () => goToStep(1), { signal })
    form.querySelectorAll<HTMLButtonElement>('[data-journey-step]').forEach((button) => {
      button.addEventListener('click', () => {
        const step = Number(button.dataset.journeyStep)
        const errors = step > journeyStep ? validate().filter((field) => stepForField(field) < step) : []
        showErrors(errors)
        if (errors.length) {
          goToStep(stepForField(errors[0]), false)
          summary?.querySelector<HTMLElement>("#appointment-error-summary-heading")?.focus()
          return
        }
        goToStep(step)
      }, { signal })
    })
    form.querySelector<HTMLButtonElement>('[data-journey-correct]')?.addEventListener('click', () => {
      setState('editing')
      goToStep(1)
    }, { signal })
    window.addEventListener(interfaceLanguageChangeEvent, () => {
      requestAnimationFrame(() => {
        if (signal.aborted) return
        syncCare()
        setState(state)
        if (!summary?.hidden) showErrors(validate().filter((field) => stepForField(field) === journeyStep))
      })
    }, { signal })
    form.noValidate = true
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      if (busy || ['unknown', 'duplicate', 'receipt', 'delivery-warning'].includes(state)) return
      if (journeyStep < 2) { advanceJourney(); return }
      const errors = validate()
      showErrors(errors)
      if (errors.length) {
        setState('validation')
        goToStep(stepForField(errors[0]), false)
        summary?.querySelector<HTMLElement>("#appointment-error-summary-heading")?.focus()
        return
      }
      if (!['known-failure', 'unknown', 'duplicate', 'delivery-warning', 'receipt'].includes(outcomeScenario)) {
        setState('prepared', true)
        return
      }
      busy = true
      goToStep(2, false)
      setState('pending')
      attempts++
      timer = window.setTimeout(() => {
        if (signal.aborted) return
        busy = false
        const outcome = outcomeScenario === 'known-failure' && attempts === 1 ? 'known-failure'
          : outcomeScenario === 'unknown' && !reconciledMissing ? 'unknown'
          : outcomeScenario === 'duplicate' ? 'duplicate'
          : outcomeScenario === 'delivery-warning' ? 'delivery-warning' : 'receipt'
        setState(outcome, true)
      }, 500)
    }, { signal })
    form.addEventListener('change', (event) => {
      if (state === 'prepared') setState('editing')
      syncCare(event.target instanceof HTMLInputElement && event.target.name === 'care_route' ? 'care-route' : event.target instanceof HTMLElement ? event.target.id : undefined)
      syncJourney()
      if (!summary?.hidden) showErrors(validate().filter((field) => stepForField(field) === journeyStep))
    }, { signal })
    form.addEventListener('input', () => {
      if (state === 'prepared') setState('editing')
      syncJourney()
      if (!summary?.hidden) showErrors(validate().filter((field) => stepForField(field) === journeyStep))
    }, { signal })
    summary?.addEventListener('click', (event) => {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null
      const id = anchor?.getAttribute('href')?.slice(1)
      if (!id || !fields.includes(id as Field)) return
      const target = id === 'care-route'
        ? form.querySelector<HTMLElement>('#care-route input:checked, #care-route input')
        : form.querySelector<HTMLElement>(`#${id}`)
      if (!target) return
      event.preventDefault()
      goToStep(stepForField(id as Field), false)
      target.focus()
      target.scrollIntoView({ block: 'center' })
    }, { signal })
    form.querySelectorAll<HTMLButtonElement>('[data-reconcile]').forEach((button) => {
      button.addEventListener('click', () => {
        if (state !== 'unknown' && state !== 'duplicate') return
        if (button.dataset.reconcile === 'found') setState('receipt', true)
        else {
          reconciledMissing = true
          setState('editing')
          submit?.focus()
        }
      }, { signal })
    })
    const restart = (focus = true) => {
      if (timer !== undefined) window.clearTimeout(timer)
      busy = false
      attempts = 0
      reconciledMissing = false
      clearContacts()
      showErrors([])
      setState('editing')
      goToStep(0, focus)
    }
    form.querySelectorAll<HTMLButtonElement>('[data-journey-restart]').forEach((button) => {
      button.addEventListener('click', () => restart(), { signal })
    })
    syncCare()
    if (initialState === 'pending') busy = true
    setState(initialState)
    form.querySelector<HTMLElement>('#appointment-submit-title')?.setAttribute('tabindex', '-1')
    safeForm.removeAttribute('inert')
    window.addEventListener('pagehide', () => {
      // A cached document must not retain contact text in either inputs or review summaries.
      // Cancel a pending example so it cannot finish while the page is away.
      restart(false)
    }, { signal })
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) restart(false)
    }, { signal })
    return () => { controller.abort(); if (timer) window.clearTimeout(timer); clearContacts(); safeForm.setAttribute('inert', '') }
  }, [pathname, search])
  return null
}

