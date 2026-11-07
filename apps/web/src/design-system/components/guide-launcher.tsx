'use client'

/** Reuses the shared guide and preserves the initiating control for focus return. */
export function GuideLauncher() {
  return <button type="button" onClick={(event) => {
    event.currentTarget.closest<HTMLElement>('[popover]')?.hidePopover()
    document.querySelector<HTMLButtonElement>('[data-open-patient-guide]')?.click()
  }}>Ask the Patient Guide <span aria-hidden="true">+</span></button>
}
