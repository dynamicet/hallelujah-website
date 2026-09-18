# Hallelujah Hospital content resources

This directory is the pre-development content bundle extracted from Hallelujah General Hospital's public website on **10 September 2026**.

The bundle separates published source material from editorial and operational verification. The existing site contains duplicated doctor pages, conflicting labels, generic portraits, inconsistent contact details, and service claims that should not be treated as launch-ready merely because they are public.

## Files

| File | Purpose |
| --- | --- |
| [`hospital-profile.json`](hospital-profile.json) | Curated hospital story, mission, vision, values, leadership, contacts, visitor journey, emergency information, technology, and partner names |
| [`data/doctors.json`](data/doctors.json) | One structured record per unique public doctor profile, including source status, portrait, availability, and quality flags |
| [`data/services.json`](data/services.json) | Patient-facing content from 39 clinical, surgical, diagnostic, rehabilitation, and hospital-care service records |
| [`data/site-pages.json`](data/site-pages.json) | Structured source blocks, links, forms, and image references from the main public pages |
| [`data/media-manifest.json`](data/media-manifest.json) | Referenced doctor/home/about media URLs and missing-alt status; binaries are intentionally not copied yet |
| [`data/metadata.json`](data/metadata.json) | Extraction counts, source URL, and snapshot notes |
| [`content-inventory.md`](content-inventory.md) | Human-readable doctor/service inventory and recommended page-to-data mapping |
| [`content-review.md`](content-review.md) | Decisions and confirmations required before content is published |
| [`scripts/build_content_bundle.py`](scripts/build_content_bundle.py) | Reproducible transformer for a WordPress REST pages snapshot |

## Recommended implementation use

1. Use `hospital-profile.json` for global contact, about, emergency, leadership, and trust sections only after the fields in `content-review.md` are confirmed.
2. Default the doctor directory to records where `listed_in_current_directory` is `true`. Keep profile-only records out of production until the hospital confirms employment and availability.
3. Keep `hours_as_published` as display text until the hospital explains whether `LT` means Ethiopian local time and corrects the repeated Saturday/missing Sunday rows.
4. Use `services.json` as source copy, not as proof that every procedure is currently available. Service owners must approve high-risk capability claims.
5. Do not hotlink production images. After the hospital approves each asset, download the original, record ownership/consent, create responsive variants, and add useful alt text.

## Regenerating the structured data

Fetch the public REST response to a temporary file, then run:

```bash
python3 resources/scripts/build_content_bundle.py \
  --input /tmp/hallelujah-pages.json \
  --output resources/data
```

The snapshot used for this extraction contained 99 published WordPress pages. The site's full sitemap was deliberately excluded because the existing audit found thousands of unrelated spam URLs.

## Editorial rule

Fields ending in `_as_published` preserve what the source site claims. They may have been lightly normalized for capitalization, punctuation, or readability but must not be presented as independently verified facts.
