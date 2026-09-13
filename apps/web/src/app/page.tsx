export default function BootstrapPage() {
  return (
    <main id="main-content">
      <section aria-labelledby="bootstrap-title">
        <p className="eyebrow">Local development only</p>
        <h1 id="bootstrap-title">Controlled application bootstrap</h1>
        <p>
          The clean Next.js, Payload CMS, and TypeScript foundation is running. No hospital
          content is published from this build.
        </p>
        <dl>
          <div>
            <dt>Personal-data collection</dt>
            <dd>Disabled</dd>
          </div>
          <div>
            <dt>External providers</dt>
            <dd>Disabled</dd>
          </div>
          <div>
            <dt>CMS routes and content models</dt>
            <dd>Not mounted</dd>
          </div>
        </dl>
      </section>
    </main>
  )
}
