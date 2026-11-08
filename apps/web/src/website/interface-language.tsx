'use client'

import Link from 'next/link'
import { Children, Fragment, cloneElement, isValidElement, useSyncExternalStore, type ComponentProps, type ReactNode, type ReactElement } from 'react'
import { translateInterface, type InterfaceLanguage } from './interface-messages'
import styles from '@/design-system/components/hospital-shell.module.css'

const storageKey = 'hh-interface-language'
export const interfaceLanguageChangeEvent = 'hh-interface-language-change'

export function getInterfaceLanguage(): InterfaceLanguage {
  if (storageWriteFailed) return memoryLanguage
  try { return localStorage.getItem(storageKey) === 'am' ? 'am' : 'en' } catch { return memoryLanguage }
}
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  window.addEventListener(interfaceLanguageChangeEvent, callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(interfaceLanguageChangeEvent, callback)
  }
}
const serverLanguage = (): InterfaceLanguage => 'en'

export function useInterfaceLanguage() {
  const language = useSyncExternalStore(subscribe, getInterfaceLanguage, serverLanguage)
  return { language, t: (text: string) => translateInterface(text, language) }
}

/** Only used by shared controls. Never translates editorial content or field values. */
function localize(nodes: ReactNode, language: InterfaceLanguage): ReactNode {
  return Children.map(nodes, (node) => {
    if (typeof node === 'string') return translateInterface(node, language)
    if (!isValidElement(node)) return node
    const element = node as ReactElement<Record<string, unknown>>
    if (typeof element.type !== 'string' && element.type !== Fragment) return element
    if (element.props['data-interface-content'] !== undefined) return element
    const props: Record<string, unknown> = {}
    for (const name of ['aria-label', 'title', 'placeholder']) {
      if (typeof element.props[name] === 'string') props[name] = translateInterface(element.props[name] as string, language)
    }
    if (Object.entries(props).some(([name, value]) => value !== element.props[name])) props.lang = language
    if ('children' in element.props) {
      props.children = localize(element.props.children as ReactNode, language)
      // Mark translated controls for pronunciation, retaining English for pending page copy.
      if (typeof element.type === 'string') {
        const texts = Children.toArray(element.props.children as ReactNode).filter((child): child is string => typeof child === 'string')
        if (texts.some((text) => translateInterface(text, language) !== text)) props.lang = language
      }
    }
    if (element.type === Fragment) return cloneElement(element, { children: props.children })
    return cloneElement(element, props)
  })
}

export function InterfaceCopy({ children }: { readonly children: ReactNode }) {
  const { language } = useInterfaceLanguage()
  return localize(children, language)
}

export function InterfaceText({ children }: { readonly children: string }) {
  const { language, t } = useInterfaceLanguage()
  const translated = t(children)
  return <span lang={translated === children ? 'en' : language}>{translated}</span>
}

/** Used for repeated action links while their surrounding page copy remains English. */
export function InterfaceLink(props: ComponentProps<typeof Link>) {
  const { language, t } = useInterfaceLanguage()
  const directText = Children.toArray(props.children).filter((child): child is string => typeof child === 'string')
  const translated = directText.some(text => t(text) !== text) || !!(props['aria-label'] && t(props['aria-label']) !== props['aria-label'])
  return <Link {...props} lang={translated ? language : props.lang} aria-label={props['aria-label'] ? t(props['aria-label']) : undefined} title={props.title ? t(props.title) : undefined}>{localize(props.children, language)}</Link>
}

export function InterfaceLanguageSwitcher({ enabled, fallback }: { readonly enabled: boolean; readonly fallback: ReactNode }) {
  const { language, t } = useInterfaceLanguage()
  if (!enabled) return fallback
  const alternate = language === 'en' ? 'am' : 'en'
  return <details className={styles.languageSwitcher} data-language-switcher>
    <summary aria-label={`${t('Language')}: ${language === 'en' ? 'English' : 'አማርኛ'}`} className={styles.languageTrigger} lang={language}>
      <span aria-current="true"><span className={styles.languageFull}>{language === 'en' ? 'English' : 'አማርኛ'}</span><span aria-hidden="true" className={styles.languageShort}>{language === 'en' ? 'Eng' : 'አማ'}</span></span>
      <svg aria-hidden="true" className={styles.languageChevron} focusable="false" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
    </summary>
    <div aria-label={t('Language')} className={styles.languageOptions} role="group">
      <button type="button" lang={alternate} data-select-interface-language={alternate} onClick={(event) => {
        // Keep the choice usable in memory even when persistent storage is blocked.
        try { localStorage.setItem(storageKey, alternate) } catch { storageWriteFailed = true }
        memoryLanguage = alternate
        window.dispatchEvent(new Event(interfaceLanguageChangeEvent))
        const details = event.currentTarget.closest('details')
        if (details) { details.open = false; details.querySelector('summary')?.focus({ preventScroll: true }) }
      }}>{alternate === 'en' ? 'English' : 'አማርኛ'}</button>
    </div>
  </details>
}

let memoryLanguage: InterfaceLanguage = 'en'
let storageWriteFailed = false
