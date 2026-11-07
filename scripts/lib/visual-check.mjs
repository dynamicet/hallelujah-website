import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Browser } from './visual-browser.mjs'

const repository = fileURLToPath(new URL('../../', import.meta.url))
function git(...args) {
  try { return execFileSync('git', args, { cwd: repository, encoding: 'utf8' }).trim() }
  catch { return null }
}

export async function runVisualCheck(name, baseUrl, check, { launchBrowser = () => Browser.launch() } = {}) {
  const root = path.join(repository, 'artifacts/visual-checks')
  await mkdir(root, { recursive: true })
  const output = await mkdtemp(path.join(root, `${new Date().toISOString().replaceAll(':', '-')}-${name}-`))
  const report = {
    check: name, baseUrl, startedAt: new Date().toISOString(),
    commit: git('rev-parse', 'HEAD'), workingTreeDirty: Boolean(git('status', '--porcelain', '--untracked-files=no')),
    status: 'running', visualInspection: 'pending',
  }
  const save = () => writeFile(path.join(output, 'run.json'), `${JSON.stringify(report, null, 2)}\n`)
  await save()
  console.log(`Fresh evidence: ${output}`)
  let browser
  try {
    browser = await launchBrowser()
    await check({ browser, output })
    report.status = 'passed'
  } catch (error) {
    report.status = 'failed'
    report.error = error.message
    throw error
  } finally {
    try { await browser?.close() }
    catch (error) {
      report.status = 'failed'
      report.cleanupError = error.message
      throw error
    }
    finally {
      report.finishedAt = new Date().toISOString()
      await save()
    }
  }
}
