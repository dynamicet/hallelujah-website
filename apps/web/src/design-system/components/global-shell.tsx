import Link from 'next/link'
import type { ReactNode } from 'react'

import styles from './global-shell.module.css'

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

export interface SiteHeaderProps {
  readonly brandMark?: ReactNode
  readonly brandName: string
  readonly emergencyAction: ReactNode
  readonly homeHref: string
  readonly languageSwitcher: ReactNode
  readonly menuLabel: string
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
  readonly brandName: string
  readonly description: string
  readonly groups: readonly FooterLinkGroup[]
  readonly navigationLabel: string
}

export interface SiteShellProps {
  readonly breadcrumbs?: BreadcrumbsProps
  readonly children: ReactNode
  readonly footer: SiteFooterProps
  readonly header: SiteHeaderProps
  readonly mainId?: string
  readonly skipLinkLabel: string
}

export function SkipLink({ label, targetId }: { readonly label: string; readonly targetId: string }) {
  return (
    <a className={styles.skipLink} data-skip-link href={`#${targetId}`}>
      {label}
    </a>
  )
}

export function PrimaryNavigation({
  items,
  label,
}: {
  readonly items: readonly NavigationItem[]
  readonly label: string
}) {
  return (
    <nav aria-label={label} className={styles.primaryNavigation} data-primary-navigation>
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
    </nav>
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
    <div aria-label={label} className={styles.languageSwitcher} data-language-switcher role="group">
      <span aria-current="true" className={styles.currentLanguage} lang={currentLang}>
        {currentLabel}
      </span>
      {alternate.available ? (
        <Link href={alternate.href} hrefLang={alternate.hrefLang} lang={alternate.lang}>
          {alternate.label}
        </Link>
      ) : (
        <>
          <span aria-describedby={reasonId} aria-disabled="true" lang={alternate.lang}>
            {alternate.label}
          </span>
          <span className={styles.languageReason} id={reasonId}>
            {alternate.reason}
          </span>
        </>
      )}
    </div>
  )
}

export function SiteHeader({
  brandMark,
  brandName,
  emergencyAction,
  homeHref,
  languageSwitcher,
  menuLabel,
  navigationItems,
  primaryNavigationLabel,
  routineAction,
  searchItem,
}: SiteHeaderProps) {
  return (
    <header className={styles.header} data-site-header>
      <div className={styles.headerInner}>
        <Link aria-label={`${brandName} home`} className={styles.identity} href={homeHref}>
          {brandMark ? (
            <span aria-hidden="true" className={styles.brandMark}>
              {brandMark}
            </span>
          ) : null}
          <span>{brandName}</span>
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
          <span>{menuLabel}</span>
        </button>
        <div
          className={styles.navigationPanel}
          data-navigation-panel
          id="primary-navigation-panel"
          popover="auto"
          tabIndex={-1}
        >
          <PrimaryNavigation items={navigationItems} label={primaryNavigationLabel} />
        </div>

        <div className={styles.headerUtilities}>
          <Link
            aria-current={searchItem.current ? 'page' : undefined}
            className={styles.utilityLink}
            href={searchItem.href}
          >
            {searchItem.label}
          </Link>
          {languageSwitcher}
        </div>

        <div className={styles.headerActions} data-shell-actions>
          {emergencyAction}
          {routineAction}
        </div>
      </div>
    </header>
  )
}

export function Breadcrumbs({ items, label }: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className={styles.breadcrumbs} data-breadcrumbs>
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
    </nav>
  )
}

export function SiteFooter({
  brandName,
  description,
  groups,
  navigationLabel,
}: SiteFooterProps) {
  return (
    <footer className={styles.footer} data-site-footer>
      <div className={styles.footerInner}>
        <div className={styles.footerIdentity}>
          <strong>{brandName}</strong>
          <p>{description}</p>
        </div>
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
    </footer>
  )
}

export function SiteShell({
  breadcrumbs,
  children,
  footer,
  header,
  mainId = 'main-content',
  skipLinkLabel,
}: SiteShellProps) {
  return (
    <>
      <SkipLink label={skipLinkLabel} targetId={mainId} />
      <SiteHeader {...header} />
      {breadcrumbs ? (
        <div className={styles.breadcrumbFrame}>
          <Breadcrumbs {...breadcrumbs} />
        </div>
      ) : null}
      <main id={mainId} tabIndex={-1}>
        {children}
      </main>
      <SiteFooter {...footer} />
      <script data-shell-navigation-script defer src="/shell-navigation.js" />
    </>
  )
}

function slugify(value: string) {
  return value.toLowerCase().replaceAll(/[^a-z0-9]+/gu, '-').replaceAll(/^-|-$/gu, '')
}
