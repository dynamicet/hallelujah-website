export type GuideSelection = { readonly kind: 'doctor' | 'service'; readonly id: string }
export type GuideChoice = GuideSelection | { readonly kind: 'faq' | 'specialty' | 'topic'; readonly id: string }

// Only public record/topic identifiers and a recovery count; never patient data.
export interface GuideContext {
  readonly selection?: GuideSelection
  readonly topicId?: string
  readonly choices?: readonly GuideChoice[]
  readonly unmatchedCount?: number
}

export type GuideAction = (
  | { readonly label: string; readonly query: string; readonly href?: never }
  | { readonly label: string; readonly href: string; readonly query?: never }
) & { readonly context?: GuideContext }

export interface GuideCard {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly actions: readonly GuideAction[]
}

export interface GuideReply {
  readonly kind: 'answer' | 'directory' | 'clarification' | 'fallback' | 'emergency'
  readonly text: string
  readonly actions?: readonly GuideAction[]
  readonly cards?: readonly GuideCard[]
  readonly context?: GuideContext
}

export interface GuideFaq {
  readonly id: string
  readonly question: string
  readonly aliases: readonly string[]
  readonly answer: string
  readonly actions: readonly GuideAction[]
}

// Public presentation data only. Never pass CMS documents or patient records here.
export interface GuideCatalog {
  readonly preview: boolean
  readonly doctors: readonly {
    readonly id: string
    readonly name: string
    readonly specialties: readonly string[]
    readonly profileHref: string
  }[]
  readonly services: readonly { readonly id: string; readonly name: string; readonly description: string }[]
  readonly faqs: readonly GuideFaq[]
}
