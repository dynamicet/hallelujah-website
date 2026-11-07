# Equipment lineup assets

The open equipment index uses three transparent cutouts derived from the existing AI-generated illustrations. These are generic equipment depictions, matching the full chapter illustrations. They are not manufacturer/model photographs.

The built-in image generation tool performs the background extraction. The original editorial images remain unchanged. Alpha transparency is preserved when the selected outputs are encoded as WebP for the website.

## Source and output mapping

| Source | Project asset |
| --- | --- |
| `public/editorial/equipment-c-arm-1440.webp` | [equipment-c-arm-cutout-v1.webp](../../apps/web/public/editorial/equipment-c-arm-cutout-v1.webp) |
| `public/editorial/equipment-laboratory-1440.webp` | [equipment-laboratory-cutout-v1.webp](../../apps/web/public/editorial/equipment-laboratory-cutout-v1.webp) |
| `public/editorial/equipment-dental-1440.webp` | [equipment-dental-cutout-v1.webp](../../apps/web/public/editorial/equipment-dental-cutout-v1.webp) |

## Production metadata

Built-in image generation performed the extraction. The resulting PNGs were resized proportionally and encoded as WebP; no additional background removal or shape editing was performed in code. Alpha channels range from 0 to 255 for all three assets.

| Asset | Dimensions | Size |
| --- | --- | --- |
| C-arm | 512 × 468 | 43,572 bytes |
| Laboratory | 512 × 256 | 26,622 bytes |
| Dental | 512 × 468 | 30,200 bytes |

The dental output contains transparent space at its sides. Its navigation frame crops that empty space while keeping the device visible. Final browser checks include narrow-phone clipping and all image states. The dental frame has responsive width caps so cropping stays within transparent margins at narrow-phone and desktop breakpoints.

## Prompt set

### C-arm

Use case: background-extraction. Edit target: supplied existing AI equipment illustration. Extract ONLY the main mobile C-arm imaging unit (the curved machine on wheels at the right). Remove the separate monitor/workstation cart at the left. Remove the entire dark background, floor, reflections and cast shadows to genuinely transparent alpha, including the negative space inside the C. Preserve the exact main machine shape, perspective, white/grey materials, turquoise edging, wheels and details. Do not redesign, add parts, add text or logos. Center the complete isolated machine with narrow transparent padding, nothing clipped. Clean antialiased edges suitable for a small website navigation object on pale blue.

### Laboratory

Use case: background-extraction. Edit target: supplied existing AI laboratory equipment illustration. Extract the complete laboratory analyser ONLY. Remove the entire dark backdrop, support table, floor, reflections and cast shadows to genuinely transparent alpha. Preserve the machine's exact low wide silhouette, perspective, white/grey cabinet, black lid with internal samples, turquoise screen, small feet and details. Do not redesign, add parts, text or logos. Center the complete isolated analyser with narrow transparent padding, nothing clipped. Clean antialiased edges suitable for a small website navigation object on pale blue.

### Dental

Use case: background-extraction. Edit target: supplied existing AI panoramic dental imaging illustration. Extract the complete upright dental imaging machine ONLY. Remove the entire dark background, floor, reflections and cast shadows to genuinely transparent alpha, also inside all openings around the upright frame. Preserve the exact tall silhouette, perspective, white/grey materials, turquoise accents, top imaging arch, hand grips, base and small feet. Do not redesign, add parts, text or logos. Center the complete isolated machine with narrow transparent padding, nothing clipped. Clean antialiased edges suitable for a small website navigation object on pale blue.
