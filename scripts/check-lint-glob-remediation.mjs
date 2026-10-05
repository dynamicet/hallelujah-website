import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'

const webRequire = createRequire(new URL('../apps/web/package.json', import.meta.url))
const configRequire = createRequire(webRequire.resolve('eslint-config-next'))
const pluginPath = configRequire.resolve('@next/eslint-plugin-next')
const pluginRequire = createRequire(pluginPath)
const { getRootDirs } = pluginRequire('./utils/get-root-dirs.js')
const plugin = pluginRequire(pluginPath)
const { Linter } = webRequire('eslint')
const replacement = pluginRequire('fast-glob/package.json')
assert.equal(replacement.name, 'tinyglobby')
assert.equal(replacement.version, '0.2.17')

const fixture = mkdtempSync(path.join(os.tmpdir(), 'lint-glob-remediation-'))
const previousCwd = process.cwd()
try {
  for (const directory of ['apps/one/pages', 'apps/two/pages']) {
    mkdirSync(path.join(fixture, directory), { recursive: true })
    writeFileSync(path.join(fixture, directory, 'index.js'), 'export default function Page() {}\n')
  }
  writeFileSync(path.join(fixture, 'apps/file.js'), '')
  process.chdir(fixture)
  const roots = (rootDir) => getRootDirs({ cwd: fixture, settings: { next: { rootDir } } }).sort()
  assert.deepEqual(roots(undefined), [fixture])
  assert.deepEqual(roots('apps/one'), ['apps/one'])
  assert.deepEqual(roots('apps/*'), ['apps/one', 'apps/two'])
  assert.deepEqual(roots('apps/{one,two}'), ['apps/one', 'apps/two'])
  assert.deepEqual(roots(['apps/one', 'apps/two', 42]), ['apps/one', 'apps/two'])
  assert.deepEqual(roots('apps\\one'), ['apps/one'])
  assert.deepEqual(roots(path.join(fixture, 'apps/one')), [path.join(fixture, 'apps/one')])
  assert.deepEqual(roots('apps/missing'), [])
  assert.deepEqual(roots('apps/file.js'), [])
  assert.deepEqual(roots('/'), ['/'])
  const linter = new Linter({ cwd: fixture })
  const messages = linter.verify('const element = <a href="/">Home</a>', [{
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { '@next/next': plugin },
    settings: { next: { rootDir: 'apps/*' } },
    rules: { '@next/next/no-html-link-for-pages': 'error' },
  }])
  assert.equal(messages.length, 1)
  assert.equal(messages[0].ruleId, '@next/next/no-html-link-for-pages')
  assert.equal(messages[0].severity, 2)
} finally {
  process.chdir(previousCwd)
  rmSync(fixture, { recursive: true, force: true })
}

const sassRequire = createRequire(webRequire.resolve('next/package.json'))
const sass = sassRequire('sass')
assert.match(sass.compileString('$tone: #123456; .fixture { color: $tone; }').css, /color: #123456/)

const lockfile = readFileSync(new URL('../pnpm-lock.yaml', import.meta.url), 'utf8')
assert.doesNotMatch(lockfile, /^  (?:braces|micromatch|fast-glob)@/m)
console.log('Lint glob remediation passed: directory discovery, active Next.js rule, Sass compilation and vulnerable-package exclusion.')
