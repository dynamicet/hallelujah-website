import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const applicationRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const tokenRoot = path.join(applicationRoot, 'src', 'design-system', 'tokens')
const manifestPath = path.join(tokenRoot, 'tokens.json')
const generatedRoot = path.join(tokenRoot, 'generated')
const cssPath = path.join(generatedRoot, 'tokens.css')
const typescriptPath = path.join(generatedRoot, 'tokens.ts')
const checkOnly = process.argv.includes('--check')

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const tokenMap = validateManifest(manifest)
const artifacts = buildArtifacts(manifest, tokenMap)

if (checkOnly) {
  await assertCurrent(cssPath, artifacts.css)
  await assertCurrent(typescriptPath, artifacts.typescript)
  await validateConsumers(tokenMap)
  runNegativeControls(manifest)
  console.log(
    `Design token check passed (${tokenMap.size} tokens, ${manifest.policies.contrast.length} contrast pairs, ${Object.keys(manifest.policies.motion.protectedContexts).length} protected contexts).`,
  )
} else {
  await mkdir(generatedRoot, { recursive: true })
  await writeFile(cssPath, artifacts.css)
  await writeFile(typescriptPath, artifacts.typescript)
  console.log(`Generated ${tokenMap.size} design tokens.`)
}

function validateManifest(candidate) {
  const failures = []
  const layers = ['primitive', 'semantic', 'component']
  const tokens = new Map()

  if (candidate.meta?.status !== 'project-approved-brand-foundation') {
    failures.push('meta.status must preserve the project-approved brand foundation')
  }
  if (candidate.meta?.valueGate !== 'B01-002-closed') {
    failures.push('meta.valueGate must record B01-002 closure')
  }

  for (const layer of layers) {
    if (!candidate[layer] || typeof candidate[layer] !== 'object') {
      failures.push(`${layer}: token layer is required`)
      continue
    }
    collectTokens(candidate[layer], layer, tokens, failures)
  }

  const cssNames = new Map()
  for (const [name, token] of tokens) {
    const cssName = toCssName(name)
    if (cssNames.has(cssName)) {
      failures.push(`${name}: CSS name collides with ${cssNames.get(cssName)}`)
    }
    cssNames.set(cssName, name)

    if (typeof token.$type !== 'string' || typeof token.$value !== 'string') {
      failures.push(`${name}: $type and $value must be strings`)
      continue
    }

    const references = extractReferences(token.$value)
    const layer = name.split('.')[0]
    const allowedReferenceLayer = layer === 'semantic' ? 'primitive' : 'semantic'

    if (layer === 'primitive' && references.length > 0) {
      failures.push(`${name}: primitive tokens cannot contain aliases`)
    }
    if (layer !== 'primitive' && references.length === 0) {
      failures.push(`${name}: ${layer} tokens must alias the preceding layer`)
    }

    for (const reference of references) {
      const referencedToken = tokens.get(reference)
      if (!referencedToken) {
        failures.push(`${name}: unknown token reference ${reference}`)
        continue
      }
      if (!reference.startsWith(`${allowedReferenceLayer}.`)) {
        failures.push(`${name}: ${layer} tokens may reference only ${allowedReferenceLayer} tokens`)
      }
      if (referencedToken.$type !== token.$type) {
        failures.push(
          `${name}: ${token.$type} token cannot reference ${reference} (${referencedToken.$type})`,
        )
      }
    }
  }

  validateContrastPolicy(candidate, tokens, failures)
  validateMotionPolicy(candidate, tokens, failures)

  if (failures.length > 0) {
    throw new Error(`Design token validation failed:\n- ${failures.join('\n- ')}`)
  }

  return tokens
}

function collectTokens(node, prefix, tokens, failures) {
  for (const [key, value] of Object.entries(node)) {
    const name = `${prefix}.${key}`
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      failures.push(`${name}: token groups and token records must be objects`)
      continue
    }
    if ('$value' in value) {
      tokens.set(name, value)
      continue
    }
    collectTokens(value, name, tokens, failures)
  }
}

function validateContrastPolicy(candidate, tokens, failures) {
  const checks = candidate.policies?.contrast
  if (!Array.isArray(checks) || checks.length === 0) {
    failures.push('policies.contrast must contain at least one rendered-pair check')
    return
  }

  for (const check of checks) {
    const foreground = tokens.get(check.foreground)
    const background = tokens.get(check.background)
    if (foreground?.$type !== 'color' || background?.$type !== 'color') {
      failures.push(
        `contrast ${check.foreground}/${check.background}: both paths must reference color tokens`,
      )
      continue
    }
    if (typeof check.minimum !== 'number' || !check.usage) {
      failures.push(
        `contrast ${check.foreground}/${check.background}: minimum and usage metadata are required`,
      )
      continue
    }

    const foregroundValue = resolveValue(check.foreground, tokens)
    const backgroundValue = resolveValue(check.background, tokens)
    const ratio = contrastRatio(foregroundValue, backgroundValue)
    if (ratio < check.minimum) {
      failures.push(
        `contrast ${check.foreground}/${check.background}: ${ratio.toFixed(2)} is below ${check.minimum}`,
      )
    }
  }
}

function validateMotionPolicy(candidate, tokens, failures) {
  const policy = candidate.policies?.motion
  const expectedLevels = ['0', '1', '2', '3', '4']
  if (JSON.stringify(Object.keys(policy?.levels ?? {})) !== JSON.stringify(expectedLevels)) {
    failures.push('motion policy must define ordered Levels 0 through 4')
  }

  const reducedEquivalents = policy?.reducedEquivalents ?? {}
  const semanticMotionTokens = [...tokens].filter(([name]) => name.startsWith('semantic.motion.'))
  for (const [name, token] of semanticMotionTokens) {
    const level = token.$extensions?.hallelujah?.motionLevel
    if (!Number.isInteger(level) || level < 0 || level > 4) {
      failures.push(`${name}: semantic motion tokens require motionLevel metadata from 0 to 4`)
      continue
    }
    if (level === 0) continue

    const equivalentName = reducedEquivalents[name]
    const equivalent = tokens.get(equivalentName)
    if (!equivalentName || !equivalent) {
      failures.push(`${name}: enhanced motion token requires a reduced-motion equivalent`)
      continue
    }
    if (equivalent.$type !== token.$type) {
      failures.push(`${name}: reduced-motion equivalent must preserve token type`)
    }
    if (equivalent.$extensions?.hallelujah?.motionLevel !== 0) {
      failures.push(`${name}: reduced-motion equivalent must resolve to Level 0`)
    }
  }

  const protectedContexts = policy?.protectedContexts ?? {}
  const coveredContexts = new Set()
  for (const [name, token] of tokens) {
    const context = token.$extensions?.hallelujah?.protectedContext
    if (!context) continue
    coveredContexts.add(context)
    const maximum = protectedContexts[context]
    if (!Number.isInteger(maximum)) {
      failures.push(`${name}: protected context ${context} is not declared by policy`)
      continue
    }
    const motionReferences = extractReferences(token.$value)
      .map((reference) => tokens.get(reference))
      .filter((reference) => reference?.$extensions?.hallelujah?.motionLevel !== undefined)
    if (motionReferences.length === 0) {
      failures.push(`${name}: protected context binding must reference semantic motion metadata`)
      continue
    }
    const inheritedLevel = Math.max(
      ...motionReferences.map((reference) => reference.$extensions.hallelujah.motionLevel),
    )
    if (inheritedLevel > maximum) {
      failures.push(`${name}: motion Level ${inheritedLevel} exceeds maximum ${maximum} for ${context}`)
    }
  }

  for (const context of Object.keys(protectedContexts)) {
    if (!coveredContexts.has(context)) {
      failures.push(`protected context ${context} requires a component binding`)
    }
  }
}

function buildArtifacts(candidate, tokens) {
  const cssSections = ['primitive', 'semantic', 'component'].map((layer) => {
    const declarations = [...tokens]
      .filter(([name]) => name.startsWith(`${layer}.`))
      .map(([name, token]) => `  ${toCssName(name)}: ${toCssValue(token.$value)};`)
      .join('\n')
    return `/* ${capitalize(layer)} tokens */\n:root {\n${declarations}\n}`
  })

  const reducedDeclarations = Object.entries(candidate.policies.motion.reducedEquivalents)
    .map(([name, equivalent]) => `    ${toCssName(name)}: var(${toCssName(equivalent)});`)
    .join('\n')

  const css = `${[
    '/* This file is generated from tokens.json. Run pnpm tokens:generate; do not edit it. */',
    ...cssSections,
    `/* Enhanced roles resolve to intentional static equivalents when motion is reduced. */\n@media (prefers-reduced-motion: reduce) {\n  :root {\n${reducedDeclarations}\n  }\n}`,
  ].join('\n\n')}\n`

  const values = Object.fromEntries([...tokens].map(([name, token]) => [name, token.$value]))
  const resolvedValues = Object.fromEntries(
    [...tokens].map(([name]) => [name, resolveValue(name, tokens)]),
  )
  const metadata = {
    authority: candidate.meta.authority,
    status: candidate.meta.status,
    valueGate: candidate.meta.valueGate,
    contrast: candidate.policies.contrast,
    motion: candidate.policies.motion,
  }
  const typescript = [
    '/* This file is generated from tokens.json. Run pnpm tokens:generate; do not edit it. */',
    `export const designTokenValues = ${JSON.stringify(values, null, 2)} as const`,
    '',
    'export type DesignTokenName = keyof typeof designTokenValues',
    '',
    `export const resolvedDesignTokenValues = ${JSON.stringify(resolvedValues, null, 2)} as const`,
    '',
    `export const designTokenMetadata = ${JSON.stringify(metadata, null, 2)} as const`,
    '',
  ].join('\n')

  return { css, typescript }
}

async function validateConsumers(tokens) {
  const consumers = [
    {
      path: path.join(applicationRoot, 'src', 'app', 'styles.css'),
      requiredPrefix: '--semantic-',
    },
    {
      path: path.join(
        applicationRoot,
        'src',
        'design-system',
        'templates',
        'controlled-bootstrap-template.module.css',
      ),
      requiredPrefix: '--component-',
    },
    {
      path: path.join(
        applicationRoot,
        'src',
        'design-system',
        'components',
        'essential-actions.module.css',
      ),
      requiredPrefix: '--component-',
    },
    {
      path: path.join(
        applicationRoot,
        'src',
        'design-system',
        'components',
        'global-shell.module.css',
      ),
      requiredPrefix: '--component-',
    },
    {
      path: path.join(
        applicationRoot,
        'src',
        'design-system',
        'components',
        'search-controls.module.css',
      ),
      requiredPrefix: '--component-',
    },
    {
      path: path.join(
        applicationRoot,
        'src',
        'design-system',
        'components',
        'form-primitives.module.css',
      ),
      requiredPrefix: '--component-',
    },
    {
      path: path.join(
        applicationRoot,
        'src',
        'design-system',
        'templates',
        'search-controls-fixture-template.module.css',
      ),
      requiredPrefix: '--component-',
    },
    {
      path: path.join(
        applicationRoot,
        'src',
        'design-system',
        'templates',
        'form-primitives-fixture-template.module.css',
      ),
      requiredPrefix: '--component-',
    },
  ]
  const available = new Set([...tokens.keys()].map(toCssName))
  const failures = []

  for (const consumer of consumers) {
    const contents = await readFile(consumer.path, 'utf8')
    const relative = path.relative(applicationRoot, consumer.path)
    if (/(?:#[\da-f]{3,8}\b|\brgba?\()/iu.test(contents)) {
      failures.push(`${relative}: raw color values are not allowed outside the canonical manifest`)
    }
    for (const match of contents.matchAll(/var\((--[\w-]+)/gu)) {
      const name = match[1]
      if (!available.has(name)) failures.push(`${relative}: unknown token ${name}`)
      if (!name.startsWith(consumer.requiredPrefix)) {
        failures.push(`${relative}: must consume ${consumer.requiredPrefix} aliases`)
      }
    }
  }

  if (failures.length > 0) {
    throw new Error(`Design token consumer validation failed:\n- ${failures.join('\n- ')}`)
  }
}

function runNegativeControls(candidate) {
  expectValidationFailure(
    candidate,
    (control) => {
      control.semantic.color.text.primary.$value = '{semantic.color.text.secondary}'
    },
    'semantic tokens may reference only primitive tokens',
  )
  expectValidationFailure(
    candidate,
    (control) => {
      control.component['protected-context'].emergency['motion-duration'].$value =
        '{semantic.motion.cinematic.duration}'
    },
    'exceeds maximum 0 for emergency',
  )
  expectValidationFailure(
    candidate,
    (control) => {
      delete control.policies.motion.reducedEquivalents['semantic.motion.cinematic.duration']
    },
    'requires a reduced-motion equivalent',
  )
  expectValidationFailure(
    candidate,
    (control) => {
      control.policies.contrast[0].minimum = 21
    },
    'is below 21',
  )

  try {
    assertNoDrift('generated', 'changed', 'negative-control')
    throw new Error('drift negative control did not fail')
  } catch (error) {
    if (!String(error.message).includes('generated output is stale')) throw error
  }
}

function expectValidationFailure(candidate, mutate, expected) {
  const control = structuredClone(candidate)
  mutate(control)
  let validationError
  try {
    validateManifest(control)
  } catch (error) {
    validationError = error
  }
  if (!validationError) throw new Error(`negative control did not fail: ${expected}`)
  if (!String(validationError.message).includes(expected)) throw validationError
}

async function assertCurrent(file, expected) {
  let actual
  try {
    actual = await readFile(file, 'utf8')
  } catch {
    throw new Error(`${path.relative(applicationRoot, file)}: generated output is missing`)
  }
  assertNoDrift(actual, expected, path.relative(applicationRoot, file))
}

function assertNoDrift(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: generated output is stale; run pnpm tokens:generate`)
  }
}

function resolveValue(name, tokens, trail = []) {
  if (trail.includes(name)) throw new Error(`Token alias cycle: ${[...trail, name].join(' -> ')}`)
  const token = tokens.get(name)
  if (!token) throw new Error(`Unknown token ${name}`)
  return token.$value.replace(/\{([^{}]+)\}/gu, (_, reference) =>
    resolveValue(reference, tokens, [...trail, name]),
  )
}

function extractReferences(value) {
  return [...value.matchAll(/\{([^{}]+)\}/gu)].map((match) => match[1])
}

function toCssValue(value) {
  return value.replace(/\{([^{}]+)\}/gu, (_, reference) => `var(${toCssName(reference)})`)
}

function toCssName(name) {
  return `--${name.replaceAll('.', '-').replaceAll('_', '-')}`
}

function contrastRatio(foreground, background) {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background))
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background))
  return (lighter + 0.05) / (darker + 0.05)
}

function relativeLuminance(color) {
  if (!/^#[\da-f]{6}$/iu.test(color)) {
    throw new Error(`Contrast metadata must resolve to six-digit hex colors, received ${color}`)
  }
  const channels = color
    .slice(1)
    .match(/.{2}/gu)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    )
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

function capitalize(value) {
  return `${value[0].toUpperCase()}${value.slice(1)}`
}
