import { requestAppointmentLabel } from '@/appointment/copy'
import { InterfaceCopy, InterfaceLanguageSwitcher, InterfaceLink as Link } from '@/website/interface-language'
import type { ReactNode } from 'react'

import { CallWidget } from './call-widget'
import { HeaderContacts, type HeaderContactTargets } from './header-contacts'
import { Icon } from './icon'
import controlledStyles from './global-shell.module.css'
import publicStyles from './hospital-shell.module.css'
import footerStyles from './site-footer.module.css'
import { hospitalContact } from '../../website/hospital-contact'

const styles = controlledStyles

export interface NavigationItem {
  readonly current?: boolean
  readonly href: string
  readonly label: string
}

export interface BreadcrumbItem extends NavigationItem {
  readonly current?: boolean
}

interface AvailableLanguage {
  readonly available: true
  readonly href: string
  readonly hrefLang: string
  readonly label: string
  readonly lang: string
}

interface UnavailableLanguage {
  readonly available: false
  readonly label: string
  readonly lang: string
  readonly reason: string
}

export type AlternateLanguage = AvailableLanguage | UnavailableLanguage

export interface LanguageSwitcherProps {
  readonly alternate: AlternateLanguage
  readonly currentLabel: string
  readonly currentLang: string
  readonly label: string
}

export type SiteHeaderNavigationMode = 'compact' | 'responsive'

export interface SiteHeaderProps {
  readonly brandMark?: ReactNode
  readonly brandName: string
  readonly contactTargets?: HeaderContactTargets
  readonly contactHref?: string
  readonly contactCurrent?: boolean
  readonly collaborationItem?: NavigationItem
  readonly previewEmergencyNumber?: string
  readonly emergencyAction: ReactNode
  readonly homeHref: string
  readonly homeLabel: string
  readonly identityLanguage: string
  readonly languageSwitcher: ReactNode
  readonly menuLabel: string
  readonly navigationMode: SiteHeaderNavigationMode
  readonly navigationItems: readonly NavigationItem[]
  readonly primaryNavigationLabel: string
  readonly routineAction?: ReactNode
  readonly searchItem: NavigationItem
}

export interface BreadcrumbsProps {
  readonly items: readonly BreadcrumbItem[]
  readonly label: string
}

export interface FooterLinkGroup {
  readonly label: string
  readonly links: readonly NavigationItem[]
}

export interface SiteFooterProps {
  readonly publicWebsite?: boolean
  readonly variant?: 'full' | 'compact'
  readonly contact?: { readonly address: string; readonly phone: string; readonly phoneHref: string }
  readonly socialLinks?: readonly { readonly platform: 'facebook' | 'instagram' | 'linkedin' | 'tiktok' | 'telegram'; readonly label: string; readonly href?: string }[]
  readonly brandName: string
  readonly description?: string
  readonly groups: readonly FooterLinkGroup[]
  readonly navigationLabel: string
}

export interface SiteShellProps {
  readonly showCallAction?: boolean
  readonly breadcrumbs?: BreadcrumbsProps
  readonly children: ReactNode
  readonly footer: SiteFooterProps
  readonly header: SiteHeaderProps
  readonly mainId?: string
  readonly notice?: string
  readonly skipLinkLabel: string
}

export function SkipLink({ label, targetId }: { readonly label: string; readonly targetId: string }) {
  return (
    <InterfaceCopy><a className={styles.skipLink} data-skip-link href={`#${targetId}`}>
      {label}
    </a></InterfaceCopy>
  )
}

export function PrimaryNavigation({
  items,
  label,
  publicWebsite = false,
}: {
  readonly publicWebsite?: boolean
  readonly items: readonly NavigationItem[]
  readonly label: string
}) {
  return (
    <InterfaceCopy><nav aria-label={label} className={(publicWebsite ? publicStyles : styles).primaryNavigation} data-primary-navigation>
      <ul>
        {items.map((item) => (
          <li key={`${item.href}-${item.label}`}>
            <Link
              aria-current={item.current ? 'page' : undefined}
              data-ui-part="navigation-link" className={styles.navigationLink}
              href={item.href}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav></InterfaceCopy>
  )
}

export function LanguageSwitcher({
  alternate,
  currentLabel,
  currentLang,
  label,
}: LanguageSwitcherProps) {
  const reasonId = `language-${alternate.lang}-availability`

  return (
    <InterfaceCopy><details className={styles.languageSwitcher} data-language-switcher>
      <summary aria-label={`${label}: ${currentLabel}`} className={styles.languageTrigger}>
        <span aria-current="true" className={styles.currentLanguage} lang={currentLang}>
          <span className={styles.languageFull}>{currentLabel}</span>
          <span aria-hidden="true" className={styles.languageShort}>{currentLang.split('-')[0].toUpperCase()}</span>
        </span>
        <svg aria-hidden="true" className={styles.languageChevron} focusable="false" viewBox="0 0 24 24">
          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </summary>
      <div aria-label={label} className={styles.languageOptions} role="group">
        {alternate.available ? (
          <Link href={alternate.href} hrefLang={alternate.hrefLang} lang={alternate.lang}>
            {alternate.label}
          </Link>
        ) : (
          <>
            <button aria-describedby={reasonId} disabled lang={alternate.lang} type="button">
              {alternate.label} · Unavailable
            </button>
            <p className={styles.languageReason} id={reasonId}>
              {alternate.reason}
            </p>
          </>
        )}
      </div>
    </details></InterfaceCopy>
  )
}

export function SiteHeader({
  brandMark,
  brandName,
  collaborationItem,
  contactTargets,
  contactHref = '/contact',
  contactCurrent = false,
  previewEmergencyNumber,
  emergencyAction,
  homeHref,
  homeLabel,
  identityLanguage,
  languageSwitcher,
  menuLabel,
  navigationMode,
  navigationItems,
  primaryNavigationLabel,
  routineAction,
  searchItem,
}: SiteHeaderProps) {
  if (!homeLabel.trim()) throw new Error('SiteHeader homeLabel must not be empty')
  const publicWebsite = homeHref === '/'
  // Native same-page anchors transfer focus after the mobile menu closes.
  const ContactLink = contactHref.startsWith('#') ? 'a' : Link
  const styles = publicWebsite ? publicStyles : controlledStyles
  const primaryNavigationItems = navigationItems
    .filter((item) => item.href !== searchItem.href && !(publicWebsite && item.href === '/appointment'))
    .map((item) => publicWebsite ? { ...item, label: ({ Doctors: 'Find a doctor', Directions: 'Your visit' } as Record<string, string>)[item.label] ?? item.label } : item)

  return (
    <InterfaceCopy><header
      className={styles.header}
      data-navigation-mode={navigationMode}
      data-site-header
      data-public-shell={publicWebsite || undefined}
    >
      {publicWebsite ? (
        <div data-ui-part="utility-bar" className={styles.utilityBar} data-top-bar>
          <div className={styles.utilityInner}>
            <HeaderContacts targets={contactTargets} />
            <div className={styles.utilityLinks}>
              <div className={styles.utilityContext}>
                <div className={styles.utilityResources}><Link href="/health-topics">Health topics</Link></div>
                <ContactLink aria-current={contactCurrent ? 'page' : undefined} className={styles.contactDirections} href={contactHref}>Contact & directions</ContactLink>
                {collaborationItem ? <Link aria-current={collaborationItem.current ? 'page' : undefined} href={collaborationItem.href}>{collaborationItem.label}</Link> : null}
              </div>
              <div className={styles.utilityEssentials}>
                {previewEmergencyNumber ? (
                  <div aria-label="Emergency help" className={styles.emergencyActions} role="group">
                    <button aria-disabled="true" aria-label={`Call emergency hotline ${previewEmergencyNumber}. Preview only; not connected.`} className={styles.emergencyCall} title="Mock hotline. Calling is not connected." type="button">
                      <Icon name="phone" />
                      <strong>{previewEmergencyNumber}</strong>
                    </button>
                    <Link className={styles.emergencyInfoLink} href="/emergency">Emergency<span aria-hidden="true"> →</span></Link>
                  </div>
                ) : (
                  <Link className={styles.urgentLink} href="/emergency">Emergency<span aria-hidden="true">→</span></Link>
                )}
                <InterfaceLanguageSwitcher fallback={languageSwitcher} enabled={publicWebsite} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className={styles.headerInner}>
        <Link
          aria-label={homeLabel}
          className={styles.identity}
          data-shell-identity
          href={homeHref}
          lang={identityLanguage}
        >
          {brandMark ? (
            <span aria-hidden="true" className={styles.brandMark}>
              {brandMark}
            </span>
          ) : null}
          <span data-ui-part="wordmark" className={styles.wordmark}>{brandName === 'Hallelujah Hospital' ? <>Hallelujah<span>General Hospital</span></> : brandName}</span>
        </Link>

        <button
          aria-controls="primary-navigation-panel"
          aria-expanded="false"
          className={styles.menuTrigger}
          data-menu-trigger
          popoverTarget="primary-navigation-panel"
          popoverTargetAction="toggle"
          type="button"
        >
          <span aria-hidden="true" data-ui-part="menu-glyph" className={styles.menuGlyph}>
            <span />
            <span />
            <span />
          </span>
          <span className={styles.menuOpenLabel}>{menuLabel}</span>
          <span className={styles.menuCloseLabel}>Close</span>
        </button>

        <div
          className={styles.navigationPanel}
          data-navigation-panel
          id="primary-navigation-panel"
          popover="auto"
          tabIndex={-1}
        >
          {publicWebsite ? <Link className={styles.mobileAppointment} href="/appointment">{requestAppointmentLabel} <span aria-hidden="true">→</span></Link> : null}
          <PrimaryNavigation items={primaryNavigationItems} label={primaryNavigationLabel} publicWebsite={publicWebsite} />
          {publicWebsite ? <div className={styles.menuResources}>
            <Link href="/emergency">Emergency information →</Link>
            <Link href="/health-topics">Health &amp; care topics →</Link>
            {collaborationItem ? <Link aria-current={collaborationItem.current ? 'page' : undefined} href={collaborationItem.href}>{collaborationItem.label}<span aria-hidden="true">→</span></Link> : null}
          </div> : null}
          {!publicWebsite ? <div className={styles.headerUtilities} data-shell-utilities>
            <Link
              aria-current={searchItem.current ? 'page' : undefined}
              className={styles.utilityLink}
              data-shell-search
              href={searchItem.href}
            >
              {searchItem.label}
            </Link>
            {!publicWebsite ? languageSwitcher : null}
          </div> : null}
          {publicWebsite ? <div className={styles.mobileVisitActions} aria-label="Plan your arrival" role="group">
            <a href={hospitalContact.phoneHref}>Call the hospital <span>{hospitalContact.phone}</span></a>
            <ContactLink aria-current={contactCurrent ? 'page' : undefined} href={contactHref}>Contact &amp; directions <Icon name="arrow-right" /></ContactLink>
          </div> : null}
          {routineAction ? (
            <div className={styles.headerRoutine} data-shell-routine>
              {routineAction}
            </div>
          ) : null}
        </div>

        <div className={styles.headerEmergency} data-shell-emergency>
          {publicWebsite ? <Link data-ui-part="appointment-link" className={styles.appointmentLink} href="/appointment">{requestAppointmentLabel} <span aria-hidden="true">→</span></Link> : emergencyAction}
        </div>
      </div>
    </header></InterfaceCopy>
  )
}

export function Breadcrumbs({ items, label }: BreadcrumbsProps) {
  return (
    <InterfaceCopy><nav aria-label={label} className={styles.breadcrumbs} data-breadcrumbs>
      <ol>
        {items.map((item) => (
          <li key={`${item.href}-${item.label}`}>
            {item.current ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <Link href={item.href}>{item.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav></InterfaceCopy>
  )
}

// Body-only wrapper for routes whose layout already owns the site shell.
export function SiteContent({ breadcrumbs, children }: {
  readonly breadcrumbs?: BreadcrumbsProps
  readonly children: ReactNode
}) {
  return <>
    {breadcrumbs ? <div className={styles.breadcrumbFrame}><Breadcrumbs {...breadcrumbs} /></div> : null}
    {children}
  </>
}

export function SiteFooter({
  publicWebsite = false,
  variant = 'full',
  contact,
  socialLinks = [],
  brandName,
  description,
  groups,
  navigationLabel,
}: SiteFooterProps) {
  const careLinks = groups.flatMap((group) => group.links)
  const careLink = careLinks.find((link) => link.href === '/appointment') ?? careLinks.find((link) => link.href === '/doctors')
  return (
    <InterfaceCopy><footer className={footerStyles.footer} data-site-footer data-footer-variant={variant}>
      <div className={footerStyles.footerInner}>
        {variant === 'full' ? <div className={footerStyles.footerIdentity}>
          <h2>Your care.<br />Your visit.</h2>
          {description ? <p>{description}</p> : null}
          {careLink ? <Link className={footerStyles.footerAction} href={careLink.href}>{careLink.href === '/appointment' ? requestAppointmentLabel : 'Find a doctor'} <Icon name="arrow-right" /></Link> : null}

        </div> : null}
        <nav aria-label={navigationLabel} className={footerStyles.footerNavigation}>
          {groups.map((group) => (
            <section aria-labelledby={`footer-${slugify(group.label)}`} key={group.label}>
              <h2 id={`footer-${slugify(group.label)}`}>{group.label}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </div>
      <div className={footerStyles.footerClose}>
          {socialLinks.length ? (
            <ul aria-label="Follow Hallelujah Hospital" className={footerStyles.footerSocial}>
              {socialLinks.map(({ platform, label, href }) => (
                <li key={platform}>
                  {href ? (
                    <a href={href}>
                      <SocialIcon platform={platform} />
                      <span>{label}</span>
                    </a>
                  ) : (
                    <span className={footerStyles.footerSocialPending} aria-label={`${label} — link coming soon`}>
                      <SocialIcon platform={platform} />
                      <span>{label} <small>(coming soon)</small></span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : null}
        {publicWebsite ? <Link className={footerStyles.footerBrand} href="/" aria-label="Hallelujah General Hospital home">
          <span className={footerStyles.footerEmblem} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/hallelujah-emblem.png" width="280" height="252" alt="" />
          </span><span className={footerStyles.footerBrandCopy}><strong>Hallelujah<span>General Hospital</span></strong><span>Bringing Quality Care Home</span></span>
        </Link> : <strong>{brandName}</strong>}
        <div>
          {contact ? <address className={footerStyles.footerContact}>
            <span>{contact.address}</span>
            <a href={contact.phoneHref}>{contact.phone}</a>
          </address> : null}
          <a href="#site-top">Back to top <span aria-hidden="true">↑</span></a>
        </div>
      </div>
    </footer></InterfaceCopy>
  )
}

function SocialIcon({ platform }: { readonly platform: 'facebook' | 'instagram' | 'linkedin' | 'tiktok' | 'telegram' }) {
  return (
    <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      {platform === 'tiktok' ? <path d="M16.6 2c.3 2.2 1.5 3.6 3.7 3.8v3.5a8.1 8.1 0 0 1-3.7-1.1v7.2a6.5 6.5 0 1 1-5.6-6.4v3.6a3 3 0 1 0 2.1 2.8V2z" /> : null}
      {platform === 'telegram' ? <path d="m21.5 3.5-3.2 17c-.2 1-1 1.2-1.8.6l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.3L5.9 13.9l-4.8-1.5c-1-.3-1-1 .2-1.5L20 3.6c.9-.3 1.7.2 1.5-.1z" /> : null}
      {platform === 'facebook' ? <path d="M14 21v-8h3l.5-4H14V7c0-1.2.4-2 2-2h2V1.4A24 24 0 0 0 15 1c-3 0-5 1.8-5 5v3H7v4h3v8z" /> : null}
      {platform === 'instagram' ? <>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.2" />
      </> : null}
      {platform === 'linkedin' ? <>
        <path d="M3 9h4v12H3zM9 9h4v1.7C14 9.3 15.1 9 16.5 9c3 0 4.5 1.9 4.5 5v7h-4v-6.5c0-1.6-.5-2.5-1.8-2.5-1.4 0-2.2 1-2.2 2.5V21H9z" />
        <circle cx="5" cy="5" r="2.2" />
      </> : null}
    </svg>
  )
}

export function SiteShell({
  breadcrumbs,
  children,
  footer,
  header,
  mainId = 'main-content',
  notice,
  showCallAction = true,
  skipLinkLabel,
}: SiteShellProps) {
  return (
    <>
      <div id="site-top" tabIndex={-1} />
      <SkipLink label={skipLinkLabel} targetId={mainId} />
      {notice ? (
        <div data-ui-part="review" className={styles.reviewNotice} data-shell-review-notice>
          <div className={styles.noticeInner}>{notice}</div>
        </div>
      ) : null}
      <SiteHeader {...header} />
      {breadcrumbs ? (
        <div className={styles.breadcrumbFrame}>
          <Breadcrumbs {...breadcrumbs} />
        </div>
      ) : null}
      <main id={mainId} tabIndex={-1}>
        {children}
      </main>
      <SiteFooter {...footer} publicWebsite={header.homeHref === '/'} />
      {showCallAction && header.homeHref === '/' ? <CallWidget phoneHref={hospitalContact.hotlineHref} phone={hospitalContact.hotline} /> : null}
    </>
  )
}

function slugify(value: string) {
  return value.toLowerCase().replaceAll(/[^a-z0-9]+/gu, '-').replaceAll(/^-|-$/gu, '')
}
