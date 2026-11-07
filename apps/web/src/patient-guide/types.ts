export type GuideAction =
  | { readonly label: string; readonly query: string; readonly href?: never }
  | { readonly label: string; readonly href: string; readonly query?: never }

export interface GuideCard {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly actions: readonly GuideAction[]
}

export interface GuideReply {
  readonly kind: 'answer' | 'directory' | 'fallback' | 'emergency'
  readonly text: string
  readonly actions?: readonly GuideAction[]
  readonly cards?: readonly GuideCard[]
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
