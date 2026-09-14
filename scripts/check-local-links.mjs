import { access, readFile } from 'node:fs/promises'
import path from 'node:path'

import {
  collectRepositoryFiles,
  repositoryRelative,
  repositoryRoot,
} from './lib/repository-files.mjs'

const markdownFiles = await collectRepositoryFiles({ include: (file) => file.endsWith('.md') })
const failures = []
let checkedLinks = 0
let externalWorkspaceLinks = 0

function githubAnchors(markdown) {
  const anchors = new Set()
  const seen = new Map()

  for (const line of markdown.split(/\r?\n/u)) {
    const heading = line.match(/^#{1,6}\s+(.+?)\s*#*$/u)
    if (!heading) continue

    let slug = heading[1]
      .replace(/\[([^\]]+)\]\([^)]+\)/gu, '$1')
      .replace(/<[^>]+>/gu, '')
      .replace(/[`*_~]/gu, '')
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}\s_-]/gu, '')
      .replace(/\s/gu, '-')
    const duplicateIndex = seen.get(slug) ?? 0
    seen.set(slug, duplicateIndex + 1)
    if (duplicateIndex > 0) slug = `${slug}-${duplicateIndex}`
    anchors.add(slug)
  }

  for (const match of markdown.matchAll(/<(?:a\s+[^>]*name|[^>]+id)=["']([^"']+)["']/giu)) {
    anchors.add(match[1])
  }

  return anchors
}

async function exists(target) {
  try {
    await access(target)
    return true
  } catch {
    return false
  }
}

for (const file of markdownFiles) {
  const contents = await readFile(file, 'utf8')

  for (const match of contents.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/gu)) {
    const href = match[1].trim().replace(/^<|>$/gu, '')
    if (!href || /^(?:https?:|mailto:|tel:|data:)/iu.test(href)) continue

    const hashIndex = href.indexOf('#')
    const rawFilePart = hashIndex < 0 ? href : href.slice(0, hashIndex)
    const fragment = hashIndex < 0 ? '' : decodeURIComponent(href.slice(hashIndex + 1))
    const filePart = decodeURIComponent(rawFilePart)
    const target = filePart ? path.resolve(path.dirname(file), filePart) : file
    const relativeTarget = path.relative(repositoryRoot, target)

    if (relativeTarget === '..' || relativeTarget.startsWith(`..${path.sep}`)) {
      externalWorkspaceLinks += 1
      continue
    }

    checkedLinks += 1
    if (!(await exists(target))) {
      failures.push(`${repositoryRelative(file)}: missing ${href}`)
      continue
    }

    if (fragment && target.endsWith('.md')) {
      const targetContents = await readFile(target, 'utf8')
      if (!githubAnchors(targetContents).has(fragment.toLowerCase())) {
        failures.push(`${repositoryRelative(file)}: missing anchor ${href}`)
      }
    }
  }
}

if (failures.length > 0) {
  console.error('Local-link check failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log(
    `Local-link check passed (${checkedLinks} repository links checked; ${externalWorkspaceLinks} inherited workspace links left outside this repository boundary).`,
  )
}
