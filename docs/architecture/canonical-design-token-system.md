# Canonical Design Token System

**Backlog authority:** `B01-003`

**Execution boundary:** Controlled local and private-repository development only

**Final brand, language, asset, motion-runtime, and publication authority:** Not granted

## Outcome

Production UI values follow one generated path:

```text
tokens.json
    ↓ deterministic validation and generation
primitive values
    ↓
semantic purposes
    ↓
component aliases
    ↓
global and template CSS consumers
```

The canonical source is
`apps/web/src/design-system/tokens/tokens.json`. Generated CSS and typed TypeScript output live
under its `generated/` directory and must never be edited independently. Run `pnpm tokens:generate`
after an authorized source change and `pnpm tokens:check` to prove that both outputs match.

## Layer rules

| Layer | Owns | May reference | Consumer rule |
| --- | --- | --- | --- |
| Primitive | Raw provisional color, type, spacing, sizing, shape, shadow, and motion values | Nothing | Never consumed by application or template CSS |
| Semantic | Purpose such as page surface, primary text, readable width, or motion capability | Primitive tokens only | Global CSS consumes semantic aliases |
| Component | A bounded component/template use such as the bootstrap surface or protected-context motion | Semantic tokens only | Template CSS consumes component aliases |

The generator rejects missing references, reference direction violations, type mismatches, CSS-name
collisions, and semantic/component tokens that bypass the preceding layer. Consumer checks reject a
second raw color palette, unknown variables, primitive use, and the wrong alias layer in the current
global and bootstrap styles.

## Generated outputs and drift control

- `generated/tokens.css` exposes deterministic CSS custom properties by layer and a
  `prefers-reduced-motion` override derived from the canonical reduced-equivalent map.
- `generated/tokens.ts` exposes literal token names/values, resolved platform values, a
  `DesignTokenName` type, and the policy metadata used to evaluate contrast and motion.
- `tokens/index.ts` is the stable typed public API. Consumers do not import the generated file
  directly.
- `pnpm tokens:check` rebuilds both outputs in memory and performs byte-for-byte comparison. Its
  negative control proves that a changed output fails rather than being silently accepted.

## Contrast metadata

Every checked foreground/background pair records its semantic token paths, intended usage, and
minimum ratio. The check resolves aliases to canonical six-digit color values and calculates WCAG
relative luminance. This is token-level evidence only: rendered text, borders, states, gradients,
images, forced colors, and production bilingual typography still require the evidence assigned to
`B01-004` and release QA. `B01-002` now supplies the approved value and font direction.

## Motion and protected contexts

Semantic motion roles explicitly name Levels `0`–`4`: static, functional, composed, cinematic, and
immersive opt-in. Every enhanced role has a same-type Level 0 reduced-motion equivalent. The CSS
output applies those equivalents under `prefers-reduced-motion: reduce` without JavaScript.

Emergency, urgent guidance, consequential appointment meaning, error, privacy/consent,
unavailable/expired, and unknown-outcome contexts each have a component binding and a maximum Level
0 policy. Generation fails when a protected binding inherits a higher level. Storytelling aliases
may reference cinematic roles, but this ticket introduces no animation, media, runtime, provider,
or client boundary; those capabilities remain `B01-012`–`B01-013`.

## Project-approved value boundary

`B01-002` advances the source metadata to `project-approved-brand-foundation` and records its value
gate closed. The manifest now includes the exact public-logo cyan/orange, accessible interface
roles, and approved Noto Latin/Ethiopic stacks. Values remain centrally replaceable if a trusted
hospital master or material validation finding triggers change. This does not ingest logo/font
binaries, approve public Amharic copy or rights-dependent media, or replace rendered component,
language, device, and motion-mode testing under `B01-004`, `B02-011`, and release QA.
