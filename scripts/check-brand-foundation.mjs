import { readFile } from 'node:fs/promises'
import path from 'node:path'

const repositoryRoot = path.resolve(import.meta.dirname, '..')
const brandPath = path.join(repositoryRoot, 'docs', 'brand', 'brand-foundation.json')
const tokenPath = path.join(
  repositoryRoot,
  'apps',
  'web',
  'src',
  'design-system',
  'tokens',
  'tokens.json',
)

const brand = JSON.parse(await readFile(brandPath, 'utf8'))
const tokens = JSON.parse(await readFile(tokenPath, 'utf8'))
const failures = []

expect(brand.decision?.ticket === 'B01-002', 'brand decision must belong to B01-002')
expect(brand.decision?.gate === 'BRAND-01', 'brand decision must close BRAND-01')
expect(brand.decision?.status === 'project-approved', 'brand status must remain project-approved')
expect(brand.identity?.name === 'Hallelujah General Hospital', 'approved public name drifted')
expect(brand.identity?.tagline === 'Bringing Quality Care Home', 'approved tagline drifted')

expect(brand.sources?.logos?.length === 2, 'two public-source logo variants are required')
for (const logo of brand.sources?.logos ?? []) {
  expect(/^https:\/\/hallelujahhospital\.com\//u.test(logo.url), `${logo.id}: source must be first-party`)
  expect(/^\d{4}-\d{2}-\d{2}$/u.test(logo.retrieved), `${logo.id}: retrieval date is required`)
  expect(logo.width > 0 && logo.height > 0, `${logo.id}: intrinsic dimensions are required`)
  expect(/^[\da-f]{64}$/u.test(logo.sha256), `${logo.id}: SHA-256 fingerprint is required`)
  expect(
    logo.classification === 'project-adopted-public-source-raster',
    `${logo.id}: provenance classification drifted`,
  )
}

const requiredWeights = JSON.stringify([400, 600, 700])
expect(JSON.stringify(brand.typography?.weights) === requiredWeights, 'approved font weights drifted')
expect(brand.typography?.license === 'SIL Open Font License 1.1', 'font license must be explicit')
expect(brand.typography?.families?.length === 2, 'Latin and Ethiopic families are required')
for (const family of brand.typography?.families ?? []) {
  expect(/^https:\/\/github\.com\/notofonts\//u.test(family.releaseUrl), `${family.family}: official release URL required`)
  expect(/^[\da-f]{64}$/u.test(family.archiveSha256), `${family.family}: archive fingerprint required`)
  for (const weight of brand.typography.weights) {
    expect(/^[\da-f]{64}$/u.test(family.fileSha256?.[weight]), `${family.family} ${weight}: file fingerprint required`)
  }
}
expect(
  brand.typography.families.some(
    (family) => family.family === 'Noto Sans Ethiopic' && family.auditedLanguages?.includes('am'),
  ),
  'Amharic glyph/language coverage evidence is required',
)

expect(brand.mediaPolicy?.authenticityRequired === true, 'media authenticity must be required')
expect(brand.mediaPolicy?.rightsAndConsentRequired === true, 'media rights and consent must be required')
expect(brand.mediaPolicy?.aiPeopleMayRepresentRealPeople === false, 'synthetic people may not represent real people')
expect(brand.mediaPolicy?.videoPreIntentRequests === 0, 'video must make zero pre-intent requests')
expect(brand.mediaPolicy?.requiredLifecycle?.includes('purged'), 'asset lifecycle must include purge')
expect(brand.renderEvidence?.length === 2, 'desktop and compact render evidence are required')
for (const render of brand.renderEvidence ?? []) {
  expect(/^[\da-f]{64}$/u.test(render.sha256), `${render.path}: render fingerprint is required`)
}

expect(tokens.meta?.status === 'project-approved-brand-foundation', 'token status must match brand approval')
expect(tokens.meta?.valueGate === 'B01-002-closed', 'token value gate must record B01-002 closure')
expect(
  tokens.primitive?.color?.brand?.cyan?.$value.toUpperCase() === brand.colors.sourceIdentity.cyan.hex,
  'canonical cyan token drifted from brand record',
)
expect(
  tokens.primitive?.color?.brand?.orange?.$value.toUpperCase() === brand.colors.sourceIdentity.orange.hex,
  'canonical orange token drifted from brand record',
)
expect(
  tokens.primitive?.font?.family?.latin?.$value.startsWith('"Noto Sans"'),
  'canonical Latin stack must start with Noto Sans',
)
expect(
  tokens.primitive?.font?.family?.ethiopic?.$value.startsWith('"Noto Sans Ethiopic"'),
  'canonical Ethiopic stack must start with Noto Sans Ethiopic',
)

const white = brand.colors.interface.surfaceRaised
for (const identity of Object.values(brand.colors.sourceIdentity)) {
  const measured = contrastRatio(identity.hex, white)
  expect(Math.abs(measured - identity.contrastOnWhite) < 0.01, `${identity.hex}: recorded contrast drifted`)
  expect(identity.usage === 'decorative-and-logo-only', `${identity.hex}: low-contrast usage restriction is required`)
}

if (failures.length > 0) {
  throw new Error(`Brand foundation validation failed:\n- ${failures.join('\n- ')}`)
}

console.log(
  `Brand foundation check passed (${brand.sources.logos.length} logo sources, ${brand.typography.families.length} font families, ${brand.typography.weights.length} weights).`,
)

function expect(condition, message) {
  if (!condition) failures.push(message)
}

function contrastRatio(foreground, background) {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background))
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background))
  return (lighter + 0.05) / (darker + 0.05)
}

function relativeLuminance(color) {
  const channels = color
    .slice(1)
    .match(/.{2}/gu)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    )
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}
