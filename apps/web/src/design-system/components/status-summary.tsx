export interface StatusSummaryItem {
  readonly description: string
  readonly term: string
}

export interface StatusSummaryProps {
  readonly items: readonly StatusSummaryItem[]
}

export function StatusSummary({ items }: StatusSummaryProps) {
  return (
    <dl>
      {items.map(({ description, term }) => (
        <div key={term}>
          <dt>{term}</dt>
          <dd>{description}</dd>
        </div>
      ))}
    </dl>
  )
}
