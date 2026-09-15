import { ExperienceRegion, MotionAccent, OptInMedia } from '../components'

import styles from './motion-media-fixture-template.module.css'

export function MotionMediaFixtureTemplate() {
  return (
    <section aria-labelledby="motion-fixture-title" className="ds-flow ds-section" data-motion-media-fixture id="motion-media-evidence">
      <script data-motion-media-script defer src="/motion-media.js" />
      <div className="ds-flow ds-reading">
        <h2 id="motion-fixture-title">Controlled motion and media evidence</h2>
        <p>
          These treatments use abstract first-party test media. They do not depict hospital people,
          facilities, equipment, operations, or approved content. The text and controls remain
          readable before enhancement and without JavaScript.
        </p>
        <p><span lang="am">የሙከራ ንቅናቄ</span> is unreviewed Ethiopic shaping text.</p>
      </div>

      <div className={styles.grid}>
        <ExperienceRegion area="home-hero" requestedLevel={3}>
          <h3>Eligible decorative plane</h3>
          <p>The complete static statement precedes one bounded decorative accent.</p>
          <MotionAccent level={3} />
          <ExperienceRegion area="home-hero" protectedContext="emergency" requestedLevel={3}>
            <p data-protected-motion-fact>Controlled urgent meaning remains stable inside an eligible region.</p>
            <MotionAccent level={3} />
          </ExperienceRegion>
        </ExperienceRegion>

        <ExperienceRegion area="patient-stages" requestedLevel={2}>
          <h3>Composed wayfinding plane</h3>
          <p>Before, during, and after headings retain their document order.</p>
          <MotionAccent level={2} />
        </ExperienceRegion>

        <ExperienceRegion area="appointment" requestedLevel={3}>
          <h3>Consequence ceiling</h3>
          <p>The appointment area clamps expressive motion to functional Level 1.</p>
          <MotionAccent level={3} />
        </ExperienceRegion>
      </div>

      <div className={styles.media}>
        <OptInMedia
          authority="controlled-fixture"
          heading="abstract controlled clip"
          posterDescription="A neutral blue plane; the clip contains only moving geometric shapes."
          source={{ kind: 'decorative', src: '/fixtures/b01-012-abstract-motion.webm' }}
        />
        <OptInMedia
          authority="controlled-fixture"
          heading="abstract geometric sequence"
          posterDescription="An abstract shape moves across a blue plane; no hospital identity is represented."
          source={{
            captionsSrc: '/fixtures/b01-012-abstract-motion.vtt',
            kind: 'informative',
            src: '/fixtures/b01-012-abstract-motion.webm',
            transcriptHref: '#controlled-media-transcript',
          }}
        />
        <p id="controlled-media-transcript">
          Controlled transcript: a gold rectangle moves across a blue plane. The clip has no
          speech, sound, hospital location, clinician, or care claim.
        </p>
        <p>
          The local video source is absent from the initial video element. Play attaches it after
          intent; Stop, failure, and route removal clear it. No external provider is contacted.
        </p>
      </div>
    </section>
  )
}
