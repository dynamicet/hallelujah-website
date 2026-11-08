import { InterfaceCopy, InterfaceLanguageSwitcher, InterfaceLink as Link } from '@/website/interface-language'
import type { ReactNode } from 'react'
import type { GuideCatalog } from '@/patient-guide/types'

import { HelpWidget } from './help-widget'
import { GuideLauncher } from './guide-launcher'
import { HeaderContacts, type HeaderContactTargets } from './header-contacts'
import controlledStyles from './global-shell.module.css'
import publicStyles from './hospital-shell.module.css'
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
  readonly contact?: { readonly address: string; readonly phone: string; readonly phoneHref: string }
  readonly variant?: 'full' | 'compact'
  readonly brandName: string
  readonly description?: string
  readonly groups: readonly FooterLinkGroup[]
  readonly navigationLabel: string
}

export interface SiteShellProps {
  readonly showHelp?: boolean
  readonly patientGuide?: GuideCatalog
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
              className={styles.navigationLink}
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
  contactTargets,
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
  showGuide = true,
}: SiteHeaderProps & { readonly showGuide?: boolean }) {
  if (!homeLabel.trim()) throw new Error('SiteHeader homeLabel must not be empty')
  const publicWebsite = homeHref === '/'
  const styles = publicWebsite ? publicStyles : controlledStyles
  const primaryNavigationItems = navigationItems
    .filter((item) => !(publicWebsite ? [searchItem.href, '/', '/appointment'] : [searchItem.href]).includes(item.href))
    .map((item) => publicWebsite ? { ...item, label: ({ Doctors: 'Find a doctor', Directions: 'Your visit' } as Record<string, string>)[item.label] ?? item.label } : item)

  return (
    <InterfaceCopy><header
      className={styles.header}
      data-navigation-mode={navigationMode}
      data-site-header
      data-public-shell={publicWebsite || undefined}
    >
      {publicWebsite ? (
        <div className={styles.utilityBar} data-top-bar>
          <div className={styles.utilityInner}>
            <HeaderContacts targets={contactTargets} />
            <div className={styles.utilityLinks}>
              <div className={styles.utilityContext}>
                <div className={styles.utilityResources}><Link href="/health-topics">Health topics</Link>{showGuide ? <GuideLauncher /> : null}</div>
                <Link className={styles.contactDirections} href="/#home-directions">Contact & directions</Link>
              </div>
              <div className={styles.utilityEssentials}>
                <InterfaceLanguageSwitcher fallback={languageSwitcher} enabled={publicWebsite} />
                {previewEmergencyNumber ? (
                  <div aria-label="Emergency help" className={styles.emergencyActions} role="group">
                    <button aria-disabled="true" aria-label={`Call emergency hotline ${previewEmergencyNumber}. Preview only; not connected.`} className={styles.emergencyCall} title="Mock hotline. Calling is not connected." type="button">
                      <span className={styles.emergencyLabel}>Emergency <span aria-hidden="true">·</span></span>
                      <strong>{previewEmergencyNumber}</strong>
                    </button>
                    <Link aria-label="Emergency information" className={styles.emergencyInfoLink} href="/emergency">Emergency information<span aria-hidden="true"> →</span></Link>
                  </div>
                ) : (
                  <Link className={styles.urgentLink} href="/emergency">Emergency<span className={styles.emergencyDetail}>&nbsp;information</span> <span aria-hidden="true">→</span></Link>
                )}
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
          <span className={styles.wordmark}>{brandName === 'Hallelujah Hospital' ? <>Hallelujah<span>General Hospital</span></> : brandName}</span>
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
          <span aria-hidden="true" className={styles.menuGlyph}>
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
          {publicWebsite ? <Link className={styles.mobileAppointment} href="/appointment">Request an appointment <span aria-hidden="true">→</span></Link> : null}
          <PrimaryNavigation items={primaryNavigationItems} label={primaryNavigationLabel} publicWebsite={publicWebsite} />
          {publicWebsite ? <Link className={styles.aboutLink} href="/#about-hallelujah">About Hallelujah</Link> : null}
          {publicWebsite ? <div className={styles.menuResources}>
            <Link href="/emergency">Emergency information →</Link>
            <Link href="/health-topics">Health &amp; care topics →</Link>
            {showGuide ? <GuideLauncher /> : null}
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
            {/* Native fragment navigation transfers keyboard focus to the arrival section. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/#home-directions">Contact &amp; directions <span aria-hidden="true">→</span></a>
          </div> : null}
          {routineAction ? (
            <div className={styles.headerRoutine} data-shell-routine>
              {routineAction}
            </div>
          ) : null}
        </div>

        <div className={styles.headerEmergency} data-shell-emergency>
          {publicWebsite ? <Link className={styles.appointmentLink} href="/appointment">Request an appointment <span aria-hidden="true">→</span></Link> : emergencyAction}
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

export function SiteFooter({
  contact,
  publicWebsite = false,
  variant = 'full',
  brandName,
  description,
  groups,
  navigationLabel,
}: SiteFooterProps) {
  const styles = publicWebsite ? publicStyles : controlledStyles
  const careLinks = groups.flatMap((group) => group.links)
  const careLink = careLinks.find((link) => link.href === '/appointment') ?? careLinks.find((link) => link.href === '/doctors')
  return (
    <InterfaceCopy><footer className={styles.footer} data-site-footer data-footer-variant={variant}>
      <div className={styles.footerInner}>
        {variant === 'full' ? (
          <div className={styles.footerIdentity}>
            <h2>Your care.<br />Your visit.</h2>
            {description ? <p>{description}</p> : null}
            {careLink ? <Link className={styles.footerAction} href={careLink.href}>{careLink.href === '/appointment' ? 'Request an appointment' : 'Find a doctor'} <span aria-hidden="true">→</span></Link> : null}
          </div>
        ) : null}
        <nav aria-label={navigationLabel} className={styles.footerNavigation}>
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
      <div className={styles.footerClose}>
        {publicWebsite && brandName === 'Hallelujah Hospital' ? (
          <Link className={styles.footerBrand} href="/" aria-label="Hallelujah General Hospital home">
            <span className={styles.footerEmblem} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/hallelujah-emblem.png" width="280" height="252" alt="" />
            </span>
            <span className={styles.footerBrandCopy}>
              <strong>Hallelujah<span>General Hospital</span></strong>
              <span className={styles.footerTagline}>Bringing Quality Care Home</span>
            </span>
          </Link>
        ) : <strong>{variant === 'compact' ? brandName : brandName.replace(' Hospital', '')}</strong>}
        <div>
          {contact ? <address className={styles.footerContact}>
            <span>{contact.address}</span>
            <a href={contact.phoneHref}>{contact.phone}</a>
          </address> : null}
          {publicWebsite ? <a href="#">Back to top ↑</a> : null}
        </div>
      </div>
    </footer></InterfaceCopy>
  )
}

export function SiteShell({
  breadcrumbs,
  children,
  footer,
  header,
  mainId = 'main-content',
  notice,
  patientGuide,
  showHelp = true,
  skipLinkLabel,
}: SiteShellProps) {
  return (
    <>
      <SkipLink label={skipLinkLabel} targetId={mainId} />
      {notice ? (
        <div className={styles.reviewNotice} data-shell-review-notice>
          <div className={styles.noticeInner}>{notice}</div>
        </div>
      ) : null}
      <SiteHeader {...header} showGuide={showHelp} />
      {breadcrumbs ? (
        <div className={styles.breadcrumbFrame}>
          <Breadcrumbs {...breadcrumbs} />
        </div>
      ) : null}
      <main id={mainId} tabIndex={-1}>
        {children}
      </main>
      <SiteFooter {...footer} publicWebsite={header.homeHref === '/'} />
      {showHelp && header.homeHref === '/' ? <HelpWidget guide={patientGuide} /> : null}
    </>
  )
}

function slugify(value: string) {
  return value.toLowerCase().replaceAll(/[^a-z0-9]+/gu, '-').replaceAll(/^-|-$/gu, '')
}
