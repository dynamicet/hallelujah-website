import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { collectFilesUnder, repositoryRelative, repositoryRoot } from './lib/repository-files.mjs'

const appOutputRoot = path.join(repositoryRoot, 'apps/web/.next/server/app')
const pages = (await collectFilesUnder(appOutputRoot, (file) => file.endsWith('.html')))
  .filter((file) => !file.includes(`${path.sep}_global-error.html`) && !file.includes(`${path.sep}_not-found.html`))
const failures = []

function count(source, pattern) {
  return [...source.matchAll(pattern)].length
}

for (const page of pages) {
  const label = repositoryRelative(page)
  const html = await readFile(page, 'utf8')
  const rendered = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, '')

  if (!/^<!DOCTYPE html>/iu.test(rendered)) failures.push(`${label}: HTML5 doctype is required`)
  if (!/<html\b[^>]*\blang=["'][^"']+["']/iu.test(rendered)) failures.push(`${label}: html lang is required`)
  if (!/<title>\s*[^<]+\s*<\/title>/iu.test(rendered)) failures.push(`${label}: non-empty title is required`)
  if (!/<meta\b[^>]*name=["']viewport["']/iu.test(rendered)) failures.push(`${label}: viewport metadata is required`)
  if (count(rendered, /<main\b/giu) !== 1) failures.push(`${label}: exactly one main landmark is required`)
  if (count(rendered, /<h1\b/giu) !== 1) failures.push(`${label}: exactly one h1 is required`)
  if (/\bautofocus(?:=|\s|>)/iu.test(rendered)) failures.push(`${label}: autofocus is prohibited`)

  const ids = [...rendered.matchAll(/\bid=["']([^"']+)["']/giu)].map((match) => match[1])
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))]
  if (duplicateIds.length > 0) failures.push(`${label}: duplicate ids ${duplicateIds.join(', ')}`)

  for (const match of rendered.matchAll(/\baria-labelledby=["']([^"']+)["']/giu)) {
    for (const reference of match[1].split(/\s+/u)) {
      if (!ids.includes(reference)) failures.push(`${label}: aria-labelledby references missing id ${reference}`)
    }
  }

  for (const match of rendered.matchAll(/<img\b([^>]*)>/giu)) {
    if (!/\balt=["'][^"']*["']/iu.test(match[1])) failures.push(`${label}: image is missing alt`)
  }

  for (const match of rendered.matchAll(/<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/giu)) {
    const attributes = match[2]
    const text = match[3].replace(/<[^>]+>/gu, '').trim()
    if (!text && !/\baria-label(?:ledby)?=["'][^"']+["']/iu.test(attributes)) {
      failures.push(`${label}: ${match[1]} has no accessible name`)
    }
  }
}

if (pages.length === 0) failures.push('no built application HTML pages were found')

if (failures.length > 0) {
  console.error('Built accessibility smoke failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log(`Built accessibility smoke passed (${pages.length} implemented static template; semantic checks only, not a conformance claim).`)
}
