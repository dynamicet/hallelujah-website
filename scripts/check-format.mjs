import { readFile } from 'node:fs/promises'
import path from 'node:path'

import {
  collectRepositoryFiles,
  repositoryRelative,
} from './lib/repository-files.mjs'

const textExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mjs',
  '.ts',
  '.tsx',
  '.txt',
  '.yaml',
  '.yml',
])
const textNames = new Set(['.gitignore', '.npmrc', '.nvmrc'])
const files = await collectRepositoryFiles({
  include: (file) => textExtensions.has(path.extname(file)) || textNames.has(path.basename(file)),
})
const failures = []

for (const file of files) {
  const relative = repositoryRelative(file)
  const contents = await readFile(file, 'utf8')

  if (contents.startsWith('\uFEFF')) failures.push(`${relative}: UTF-8 byte-order mark is not allowed`)
  if (contents.includes('\r')) failures.push(`${relative}: use LF line endings`)
  if (contents.length > 0 && !contents.endsWith('\n')) failures.push(`${relative}: final newline is required`)

  const lines = contents.split('\n')
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const trailingWhitespace = line.match(/[ \t]+$/u)?.[0] ?? ''
    const allowedMarkdownBreak = path.extname(file) === '.md' && trailingWhitespace === '  ' && line.trim()
    if (trailingWhitespace && !allowedMarkdownBreak) {
      failures.push(`${relative}:${index + 1}: trailing whitespace is not allowed`)
    }
  }

  if (path.extname(file) === '.json') {
    try {
      JSON.parse(contents)
    } catch {
      failures.push(`${relative}: invalid JSON`)
    }
  }
}

if (failures.length > 0) {
  console.error('Repository format policy failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log(`Repository format policy passed (${files.length} text files inspected).`)
}
