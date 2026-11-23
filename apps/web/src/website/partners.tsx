import { CorporateAgreementsRail } from './corporate-agreements-rail'

export type Partner = Readonly<{
  id: string
  name: string
  logo: Readonly<{ src: string; width: number; height: number }>
}>

const eligible = (partner: Partner) => partner.name.trim() && partner.logo.src.trim() && partner.logo.width > 0 && partner.logo.height > 0

function OrganizationList({ organizations, variant }: {
  organizations: readonly Partner[]
  variant: 'directory' | 'ribbon' | 'duplicate'
}) {
  return (
    <ul className={variant === 'directory' ? 'organization-list' : 'partner-ribbon-list'} role="list" aria-hidden={variant === 'duplicate' ? true : undefined}>
      {organizations.map((partner) => (
        <li className="organization-mark" data-partner={partner.id} key={partner.id}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={partner.logo.src}
            alt={variant === 'ribbon' ? partner.name : ''}
            width={partner.logo.width}
            height={partner.logo.height}
            loading="lazy"
            decoding="async"
          />
          {variant === 'directory' && <span>{partner.name}</span>}
        </li>
      ))}
    </ul>
  )
}

export function Partners({ partners }: { partners: readonly Partner[] }) {
  const organizations = partners.filter(eligible)
  if (!organizations.length) return null
  const canLoop = organizations.length >= 10

  return (
    <section className="partner-showcase page-frame" id="partners" aria-labelledby="hospital-partners">
      <h2 id="hospital-partners">Our partners</h2>
      <div className="partner-ribbon-area">
        <div className="partner-ribbon" data-loop={canLoop || undefined}>
          <div className="partner-ribbon-track">
            <OrganizationList organizations={organizations} variant="ribbon" />
            {canLoop && <OrganizationList organizations={organizations} variant="duplicate" />}
          </div>
        </div>
        {canLoop && <input className="partner-motion-control" type="checkbox" aria-label="Pause partner logos" />}
      </div>
    </section>
  )
}

export function CorporateAgreements({ organizations }: { organizations: readonly Partner[] }) {
  const examples = organizations.filter(eligible)
  if (!examples.length) return null

  return (
    <section className="page-frame corporate-agreements" id="corporate-agreements" aria-labelledby="corporate-agreements-title">
      <CorporateAgreementsRail>
        <OrganizationList organizations={examples} variant="directory" />
      </CorporateAgreementsRail>
    </section>
  )
}
