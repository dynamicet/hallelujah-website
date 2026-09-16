import { OptionalMap, type OptionalMapProps } from '../components'

import styles from './optional-map-fixture-template.module.css'

const directions = [
  {
    instruction: 'Continue toward the controlled landmark; no real route is represented.',
    label: 'Step 1',
  },
  {
    instruction: 'Use the synthetic entrance label; verify a real entrance before publication.',
    label: 'Step 2',
  },
] as const

const common = {
  address: 'Synthetic address for layout testing only',
  directions,
  entrance: 'Controlled entrance specimen — not a hospital entrance',
  landmark: 'Synthetic landmark — not navigational guidance',
} as const

const stateFixtures: readonly OptionalMapProps[] = [
  {
    ...common,
    authority: 'not-approved',
    heading: 'Provider-disabled arrival specimen',
    id: 'controlled-map-blocked',
    state: 'blocked',
    status: 'No provider is approved. The interactive map remains unavailable.',
  },
  {
    ...common,
    activationLabel: 'Unavailable while loading specimen is shown',
    authority: 'controlled-fixture',
    heading: 'Loading-state arrival specimen',
    id: 'controlled-map-loading',
    removeLabel: 'Remove controlled placeholder',
    state: 'loading',
    status: 'This visibly labeled state tests preserved directions during a bounded wait.',
  },
  {
    ...common,
    activationLabel: 'Unavailable after failure specimen',
    authority: 'controlled-fixture',
    heading: 'Failure-state arrival specimen',
    id: 'controlled-map-failure',
    removeLabel: 'Remove controlled placeholder',
    state: 'failure',
    status: 'The optional view did not load; the written route remains complete.',
  },
]

export function OptionalMapFixtureTemplate() {
  return (
    <section
      aria-labelledby="optional-map-evidence-title"
      className="ds-flow ds-section"
      data-optional-map-fixture
      id="optional-map-evidence"
    >
      <script data-optional-map-script defer src="/optional-map.js" />
      <div className="ds-flow ds-reading">
        <h2 id="optional-map-evidence-title">Provider-neutral optional-map evidence</h2>
        <p>
          Every specimen renders complete text-first arrival information before the optional panel.
          No coordinates, provider, external link, tile, iframe, hospital route, or approved fact is
          present.
        </p>
        <p>
          The phrase <span lang="am">የሙከራ አቅጣጫ</span> checks Ethiopic shaping only and is not an
          approved translation.
        </p>
      </div>

      <OptionalMap
        {...common}
        activationLabel="Preview the provider-neutral wrapper"
        authority="controlled-fixture"
        heading="Interactive controlled arrival specimen"
        id="controlled-map-interactive"
        removeLabel="Remove the controlled placeholder"
        state="idle"
        status="JavaScript may enable only a local placeholder. No provider request is permitted."
      />

      <div className={styles.grid} data-map-state-fixtures>
        {stateFixtures.map((fixture) => <OptionalMap key={fixture.id} {...fixture} />)}
      </div>
    </section>
  )
}
