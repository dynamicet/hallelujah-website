# Service card imagery

The homepage specialties and public service directory use `ServiceCard` from the
shared design-system component exports. A card is one native link to service
details; appointment requests remain available on those detail pages. Search,
service groups, result counts, pagination, and preparation guides remain owned by
the directory template. Controlled template fixtures retain their existing text
cards unless service presentations are supplied.

Website imagery is mapped by service public ID in
`apps/web/src/website/service-presentation.ts`, independently of clinical content
and route slugs. New services inherit the card and general medicine artwork until
a specific image is added. Preparation guides stay separate from clinical cards.
Images are decorative alongside visible names, with reserved dimensions and lazy
loading. Hover movement is limited to fine pointers and disabled for reduced
motion. The homepage keeps its existing section entrance behavior.

## Assets

`apps/web/public/services/*.webp` contains ten original AI-generated editorial
illustrations created on 2026-11-21 using the built-in image generation tool. No
stock photography or third-party asset licence is involved. A coordinated contact
sheet was generated and separated into individual images, with grid dividers
trimmed and artwork fitted within 640 × 480 WebP canvases. Subjects: heart, brain,
kidneys, knee joint, lungs, general medicine equipment, rehabilitation, speech,
admission preparation, and follow-up. They are navigational illustrations, not
clinical diagrams or photographs of hospital facilities. Clinical descriptions,
service availability, and preview-route finalization still need hospital review.
