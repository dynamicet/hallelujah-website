import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const execute = promisify(execFile)
export function assetPdf(text = 'Synthetic complete readable document') {
  const stream = `BT /F1 12 Tf 20 100 Td (${text.replace(/[\\()]/g, (value) => '\\' + value)}) Tj ET`
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R /OpenAction 6 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 400 200] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
    '<< /S /JavaScript /JS (app.alert\(\"synthetic-private-action\"\)) >>',
  ]
  let pdf = '%PDF-1.7\n'
  const offsets = [0]
  for (const [index, object] of objects.entries()) {
    offsets.push(Buffer.byteLength(pdf))
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  }
  const start = Buffer.byteLength(pdf)
  pdf += `xref\n0 ${offsets.length}\n0000000000 65535 f \n`
  for (const offset of offsets.slice(1)) pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
  pdf += `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF\n`
  return Buffer.from(pdf)
}
export async function assetFont(directory, latinOnly = false) {
  const worker = new URL('asset-format-worker.py', import.meta.url).pathname
  await execute(process.env.ASSET_FORMAT_PYTHON ?? 'python3', [worker, latinOnly ? 'fixture-latin' : 'fixture-font', directory, directory], { timeout: 30000 })
  return readFile(path.join(directory, 'fixture.woff2'))
}
export async function assetVideo(directory) {
  const destination = path.join(directory, 'fixture.mp4')
  await execute('ffmpeg', ['-v', 'error', '-nostdin', '-f', 'lavfi', '-i', 'color=c=blue:s=160x90:r=24:d=1',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-threads', '1', '-metadata', 'title=synthetic-private-video-title', '-y', destination], { timeout: 30000 })
  return readFile(destination)
}
export const assetSvg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><metadata>synthetic-private-source</metadata><path d="M 2 12 L 22 12 M 12 2 L 12 22" stroke="#07565d" stroke-width="2" fill="none"/></svg>')
export const assetVtt = 'WEBVTT\n\n00:00:00.000 --> 00:00:00.900\nSynthetic silent blue frame\n'
