import type { Payload, TypedUser } from 'payload'

// Internal authenticated preview only. There is no HTTP preview or CMS route.
// Any future route must preserve these directives and authenticate its own caller.
export async function cmsPreview(payload: Payload, user: TypedUser | undefined, id: number) {
  const document = await payload.findByID({
    collection: 'governed-records', id, user, overrideAccess: false, depth: 0,
  })
  return {
    document,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
      'Cache-Control': 'private, no-store',
    },
  }
}
