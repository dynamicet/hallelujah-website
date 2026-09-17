import sharp from 'sharp'
import { assetHash } from '../../src/content/asset-record.ts'

export function assetFixture(assetId = 'asset_111111111111', kind = 'image', now = new Date()) {
  const instant = (offset) => new Date(now.getTime() + offset).toISOString()
  return {
    assetId, version: 1, kind, synthetic: true,
    provenance: { reference: 'Synthetic raw pixels; no hospital photograph or rights claim', originalName: 'synthetic.png', recordedAt: instant(-60000) },
    owner: 'Synthetic content owner', removalOwner: 'Synthetic removal owner', fallback: 'neutral',
    rights: { license: 'Synthetic fixture only', consent: 'No subjects; synthetic pixels', routes: ['/about/'],
      channels: ['controlled-review'], territories: ['local-fixture'], restrictions: 'Never publish', expiresAt: instant(86400000) },
    authenticity: { description: 'Synthetic geometric pixels', claimLimitations: 'No person/facility/care claim', bakedText: false },
    localized: { en: { purpose: 'informative', alt: 'Synthetic red and blue geometry', caption: null,
      transcript: kind === 'video' ? 'Synthetic transcript fixture' : null,
      audioDescription: kind === 'video' ? 'Synthetic description decision' : null } },
    crop: ['logo', 'image', 'icon'].includes(kind)
      ? { focalPoint: { x: 1, y: 0.5 }, ratios: kind === 'image' ? [1] : [], landmarks: 'Keep synthetic right-hand red region' } : null,
    publishAt: instant(-30000), reviewAt: instant(3600000), expiresAt: instant(86400000),
  }
}

export async function assetPixels(width = 800, height = 400) {
  const raw = Buffer.alloc(width * height * 3)
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    raw[(y * width + x) * 3 + (x < width / 2 ? 2 : 0)] = 255
  }
  return sharp(raw, { raw: { width, height, channels: 3 } }).png()
    .withMetadata({ orientation: 1 }).withExif({ IFD0: { Artist: 'Synthetic private EXIF fixture' } }).toBuffer()
}

// Deliberately NOT malware clearance. Restricted to explicitly synthetic local intake.
export async function fixtureAssetScanner(file, sha256) {
  const { readFile } = await import('node:fs/promises')
  if (assetHash(await readFile(file)) !== sha256) throw new Error('Fixture scan byte mismatch')
  return { sha256, engine: 'fixture-only-no-malware-clearance', signatures: 'fixture-only',
    at: new Date().toISOString(), fixtureOnly: true }
}
