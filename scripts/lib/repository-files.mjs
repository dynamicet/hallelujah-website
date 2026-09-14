import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

const excludedDirectories = new Set([
  '.git',
  '.next',
  '.pnpm-store',
  'build',
  'coverage',
  'dist',
  'node_modules',
  'tmp',
  'vendor',
])

export async function collectRepositoryFiles(options = {}) {
  const files = []
  const include = options.include ?? (() => true)

  async function visit(directory) {
    const entries = await readdir(directory, { withFileTypes: true })

    for (const entry of entries) {
      if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue

      const absolutePath = path.join(directory, entry.name)
      if (entry.isDirectory()) await visit(absolutePath)
      else if (entry.isFile() && include(absolutePath)) files.push(absolutePath)
    }
  }

  await visit(repositoryRoot)
  return files.sort()
}

export async function collectFilesUnder(directory, include = () => true) {
  const files = []

  async function visit(currentDirectory) {
    const entries = await readdir(currentDirectory, { withFileTypes: true })
    for (const entry of entries) {
      const absolutePath = path.join(currentDirectory, entry.name)
      if (entry.isDirectory()) await visit(absolutePath)
      else if (entry.isFile() && include(absolutePath)) files.push(absolutePath)
    }
  }

  await visit(directory)
  return files.sort()
}

export function repositoryRelative(absolutePath) {
  return path.relative(repositoryRoot, absolutePath).split(path.sep).join('/')
}
