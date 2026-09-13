import { gzipSync } from 'node:zlib'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { collectFilesUnder, repositoryRelative, repositoryRoot } from './lib/repository-files.mjs'

const appRoot = path.join(repositoryRoot, 'apps/web')
const outputRoot = path.join(appRoot, '.next/server/app')
const pages = (await collectFilesUnder(outputRoot, (file) => file.endsWith('.html')))
  .filter((file) => !file.endsWith('_global-error.html') && !file.endsWith('_not-found.html'))
const limits = {
  javascript: 150 * 1024,
  requests: 50,
  transfer: 1024 * 1024,
}
const failures = []

for (const page of pages) {
  const html = await readFile(page, 'utf8')
  const modernScripts = [...html.matchAll(/<script\b(?![^>]*\bnoModule\b)[^>]*\bsrc=["']([^"']+)["'][^>]*>/giu)]
    .map((match) => match[1])
  const stylesheets = [...html.matchAll(/<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["']([^"']+)["'][^>]*>/giu)]
    .map((match) => match[1])
  const assets = [...new Set([...modernScripts, ...stylesheets])]
  const externalAssets = assets.filter((asset) => /^(?:https?:)?\/\//iu.test(asset))
  const localAssets = assets.filter((asset) => asset.startsWith('/_next/'))
  let javascriptBytes = 0
  let transferBytes = gzipSync(html).byteLength

  for (const asset of localAssets) {
    const absolutePath = path.join(appRoot, '.next', asset.slice('/_next/'.length))
    const compressedBytes = gzipSync(await readFile(absolutePath)).byteLength
    transferBytes += compressedBytes
    if (asset.endsWith('.js')) javascriptBytes += compressedBytes
  }

  const requestCount = 1 + assets.length
  const label = repositoryRelative(page)
  if (externalAssets.length > 0) failures.push(`${label}: external initial assets ${externalAssets.length}`)
  if (javascriptBytes > limits.javascript) failures.push(`${label}: modern JavaScript ${javascriptBytes} > ${limits.javascript}`)
  if (transferBytes > limits.transfer) failures.push(`${label}: compressed transfer ${transferBytes} > ${limits.transfer}`)
  if (requestCount > limits.requests) failures.push(`${label}: initial requests ${requestCount} > ${limits.requests}`)

  console.log(
    `${label}: ${javascriptBytes} compressed JS bytes; ${transferBytes} initial compressed bytes; ${requestCount} requests; ${externalAssets.length} external origins.`,
  )
}

if (pages.length === 0) failures.push('no built application HTML pages were found')

if (failures.length > 0) {
  console.error('Built asset budget smoke failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log(`Built asset budget smoke passed (${pages.length} implemented static template).`)
}
