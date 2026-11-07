/** Initials represent a name without implying that a clinician portrait is available. */
export function ClinicianMonogram({ name, className, transitionName }: { readonly name: string; readonly className?: string; readonly transitionName?: string }) {
  const initials = name.split(/\s+/u).filter((part) => !/^dr\.?$/iu.test(part)).slice(0, 2).map((part) => part[0]).join('')
  return <span aria-hidden="true" className={className} data-clinician-monogram style={{ viewTransitionName: transitionName }}>{initials}</span>
}
