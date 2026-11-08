export type Partner = Readonly<{
  id: string
  name: string
  logo: Readonly<{ src: string; width: number; height: number }>
}>

const eligible = (partner: Partner) => partner.name.trim() && partner.logo.src.trim() && partner.logo.width > 0 && partner.logo.height > 0
const Chevron = () => <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 9 6 6 6-6" /></svg>

function OrganizationList({ organizations, label }: { organizations: readonly Partner[]; label: string }) {
  return <ul className="organization-list" aria-label={label}>
    {organizations.map((partner) => <li className="partner" data-partner={partner.id} key={partner.id}>
      <figure>
        <div className="partner-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={partner.logo.src} alt="" width={partner.logo.width} height={partner.logo.height} loading="lazy" decoding="async" />
        </div>
        <figcaption>{partner.name}</figcaption>
      </figure>
    </li>)}
  </ul>
}

export function Partners({ partners, billingPartners = [] }: { partners: readonly Partner[]; billingPartners?: readonly Partner[] }) {
  const billing = billingPartners.filter(eligible)
  const collaborations = partners.filter(eligible)
  if (!collaborations.length && !billing.length) return null

  return <section className="partners" id="partners" aria-labelledby="organizations-title">
    <div className="page-frame organizations-layout">
      <div className="organizations-intro">
        <h2 id="organizations-title">Working with organizations</h2>
        <p>Contact your employer or the hospital to confirm your eligibility and requirements.</p>
        <a className="text-link" href="#home-call">Confirm your arrangement <span aria-hidden="true">→</span></a>
      </div>
      <div className="organization-groups">
        {billing.length > 0 && <details className="organization-group" id="corporate-agreements">
          <summary><span>Corporate healthcare agreements<small>{billing.length} organizations</small></span><Chevron /></summary>
          <div className="organization-content">
            <p>We work with companies to provide employee healthcare through agreed credit and health service arrangements.</p>
            <OrganizationList organizations={billing} label="Companies with healthcare agreements" />
          </div>
        </details>}
        {collaborations.length > 0 && <details className="organization-group" id="hospital-partners">
          <summary><span>Our partners<small>{collaborations.length} organizations</small></span><Chevron /></summary>
          <div className="organization-content">
            <OrganizationList organizations={collaborations} label="Hospital partners" />
          </div>
        </details>}
      </div>
    </div>
  </section>
}
