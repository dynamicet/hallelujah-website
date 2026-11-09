import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { repositoryRoot } from './lib/repository-files.mjs'

// Review evidence is served only by this loopback tool, outside the deployable app.
const root = path.join(repositoryRoot, 'docs/brand/evidence/composition-revision/captures')
const captures = (await Promise.all(['before', 'after'].map(async (version) =>
  JSON.parse(await readFile(path.join(root, `${version}.json`), 'utf8'))))).flat()
const files = new Set(captures.map((capture) => capture.file))
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;')
const groups = [...new Set(captures.map((capture) => capture.id))]
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Composition archive</title><style>body{font:1rem/1.5 system-ui;max-width:96rem;margin:2rem auto;padding:1rem}nav{display:flex;gap:1rem;flex-wrap:wrap}section{margin-block:3rem}ul{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,28rem),1fr));gap:1rem;padding:0;list-style:none}img{max-width:100%;height:auto}a{display:inline-block;padding:.5rem}figure{margin:0}</style><main><h1>Composition archive</h1><p>Historical before/after evidence. Missing captures are labelled unavailable. These records do not establish current verification.</p><nav aria-label="Comparison groups">${groups.map((id) => `<a href="#${escape(id)}">${escape(id)}</a>`).join('')}</nav>${(await Promise.all(groups.map(async (id) => `<section id="${escape(id)}"><h2>${escape(captures.find((capture) => capture.id === id).title)}</h2><ul>${(await Promise.all(captures.filter((capture) => capture.id === id).map(async (capture) => {
  let available = true
  try { await readFile(path.join(root, capture.file)) } catch (error) { if (error.code !== 'ENOENT') throw error; available = false }
  return `<li><figure><figcaption>${escape(capture.version)} · ${capture.width}px</figcaption>${available ? `<img src="/captures/${escape(capture.file)}" alt="${escape(capture.title)} (${escape(capture.version)}, ${capture.width}px)" loading="lazy">` : `<p>Capture unavailable: ${escape(capture.file)}</p>`}</figure></li>`
}))).join('')}</ul></section>`))).join('')}</main></html>`
const server = createServer(async (request, response) => {
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('X-Robots-Tag', 'noindex, nofollow')
  response.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; frame-ancestors 'none'")
  if (request.method !== 'GET') { response.writeHead(405); response.end(); return }
  const pathname = new URL(request.url, 'http://127.0.0.1').pathname
  if (pathname === '/') { response.setHeader('Content-Type', 'text/html; charset=utf-8'); response.end(html); return }
  const file = pathname.slice('/captures/'.length)
  if (!pathname.startsWith('/captures/') || !files.has(file)) { response.writeHead(404); response.end(); return }
  try { response.setHeader('Content-Type', 'image/jpeg'); response.end(await readFile(path.join(root, file))) }
  catch (error) { response.writeHead(error.code === 'ENOENT' ? 404 : 500); response.end() }
})
server.listen(Number(process.argv[2] ?? 3977), '127.0.0.1', () => console.log(`Composition archive: http://127.0.0.1:${server.address().port}`))
