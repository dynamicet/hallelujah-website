# Gotera location map

- Asset: `apps/web/public/maps/gotera-location.webp` (768 × 440).
- Source: © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright).
- Retrieved 6 November 2026 from `https://tile.openstreetmap.org/15/{x}/{y}.png`,
  x = 19910–19913, y = 15561–15563. Twelve tiles composed at their native scale;
  crop origin (111, 211), size 768 × 440, encoded WebP at quality 88.
- Local image loading only; attribution is visible in the component and links to
  the source copyright page. Street labels and other mapped features are OSM data.
- Hospital coordinate: 8.9861882, 38.7590401, from the documented listing in
  `docs/brand/contact-directions.md`. At zoom 15, its pixel offset from the tile
  mosaic origin is approximately (495.094, 430.866), putting it at
  (384.094, 219.866) in the crop, within 0.2px of the center.
- CSS uses centered `object-fit: none` (native map scale); the marker’s bottom center stays at the
  image center at every aspect ratio. The marker denotes the hospital location;
  it does not designate an entrance. Directions use the existing Google Maps URL.
- No artistic alteration or invented streets: this asset is a crop/composition of
  the source map tiles. The hospital marker and name are HTML overlays.
