import { execFile } from 'node:child_process'
import { readFile, writeFile, chmod, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import sharp from 'sharp'
import { assetHash, type AssetInput, type AssetOutput } from './asset-record.ts'

const execute = promisify(execFile)
const worker = fileURLToPath(new URL('../../scripts/lib/asset-format-worker.py', import.meta.url))
const limit = 32 * 1024 * 1024
export const escapeAssetText = (text: string) => text.replace(/[&<>"']/g, (character) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!)
const normalize = (text: string) => text.normalize('NFC').replace(/\s+/gu, ' ').trim()

async function command(binary: string, args: string[]) {
  return execute(binary, args, { timeout: 60000, maxBuffer: 1024 * 1024,
    env: { NODE_ENV: 'production', LC_ALL: 'C', OMP_NUM_THREADS: '1' } })
}

/** Rebuild each format into bounded derivatives; never deliver the submitted original. */
export async function localAssetFormats(file: string, mime: string, input: AssetInput, token: string, python = 'python3'): Promise<AssetOutput[]> {
  const directory = path.dirname(file)
  const outputs: AssetOutput[] = []
  async function output(name: string, outputMime: string, purpose: NonNullable<AssetOutput['purpose']>,
    details: Partial<AssetOutput> = {}) {
    if (!/^(?:font-(?:en|am)\.woff2|vector\.svg|document-(?:en|am)\.html|page-[1-5]\.png|video\.mp4|poster\.png|captions-(?:en|am)\.vtt)$/.test(name)) throw new Error('Unsafe processor output name')
    const destination = path.join(directory, name)
    await chmod(destination, 0o600)
    const bytes = await readFile(destination)
    if (!bytes.length || bytes.length > limit) throw new Error('Format derivative exceeds byte policy')
    const record: AssetOutput = { ...details, key: `${token}/${name}`, sha256: assetHash(bytes),
      mime: outputMime, bytes: bytes.length, width: details.width ?? 0, height: details.height ?? 0,
      ratio: null, colorProfile: outputMime === 'image/png' ? 'sRGB' : null, metadata: 'stripped', purpose }
    outputs.push(record)
  }
  async function image(source: string, name: string, purpose: 'poster' | 'document-preview') {
    const result = await sharp(source, { limitInputPixels: 16000000, failOn: 'warning' }).rotate()
      .resize({ width: 1280, height: 1280, fit: 'inside', withoutEnlargement: true })
      .toColourspace('srgb').png().timeout({ seconds: 10 }).toBuffer({ resolveWithObject: true })
    await writeFile(path.join(directory, name), result.data, { mode: 0o600, flag: 'wx' })
    await output(name, 'image/png', purpose, { width: result.info.width, height: result.info.height })
  }
  if (mime === 'font/woff2' || mime === 'image/svg+xml') {
    const { stdout } = await command(python, [worker, mime === 'font/woff2' ? 'font' : 'svg', file, directory, JSON.stringify(input)])
    const report = JSON.parse(stdout) as { name: string; mime: string; purpose: 'font' | 'vector';
      width?: number; height?: number; locale?: 'en' | 'am'; coverage?: number[]; weight?: number }[]
    if (!Array.isArray(report) || !report.length || report.length > 2) throw new Error('Invalid local format report')
    for (const entry of report) await output(entry.name, entry.mime, entry.purpose,
      { width: entry.width, height: entry.height, locale: entry.locale, coverage: entry.coverage, weight: entry.weight })
    if (mime === 'image/svg+xml') {
      // Force a real decode before allowing even the sanitized vector into review.
      await image(path.join(directory, 'vector.svg'), 'poster.png', 'poster')
    }
  } else if (mime === 'application/pdf') {
    const { stdout: info } = await command('pdfinfo', [file])
    const pages = Number(/^Pages:\s+(\d+)$/m.exec(info)?.[1])
    if (!Number.isInteger(pages) || pages < 1 || pages > 5 || !/^Encrypted:\s+no$/m.test(info)) throw new Error('Document pages/encryption violate policy')
    const { stdout: extracted } = await command('pdftotext', ['-enc', 'UTF-8', '-layout', file, '-'])
    const originalText = normalize(extracted)
    if (!originalText || originalText.length > 65536 || /[\u0000-\u0008\u000b\u000e-\u001f]/u.test(originalText)) throw new Error('Document has no bounded readable text equivalent')
    for (const [locale, alternative] of Object.entries(input.localized)) {
      // Translation is never invented by a processor. Each ingested source must match its
      // authored complete transcript; translated documents require their own reviewed version.
      if (alternative.purpose !== 'informative' || !alternative.transcript || normalize(alternative.transcript) !== originalText) throw new Error('Document requires a complete matching accessible transcript')
      const name = `document-${locale}.html`
      const html = `<!doctype html><html lang="${locale}"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; base-uri 'none'; form-action 'none'"><title>${escapeAssetText(alternative.alt)}</title><main><h1>${escapeAssetText(alternative.alt)}</h1><p>${escapeAssetText(alternative.transcript)}</p></main></html>\n`
      await writeFile(path.join(directory, name), html, { flag: 'wx', mode: 0o600 })
      await output(name, 'text/html', 'document-text', { locale: locale as 'en' | 'am' })
    }
    for (let page = 1; page <= pages; page++) {
      const prefix = path.join(directory, `decoded-page-${page}`)
      await command('pdftoppm', ['-f', String(page), '-l', String(page), '-singlefile', '-scale-to', '1280', '-png', file, prefix])
      await image(`${prefix}.png`, `page-${page}.png`, 'document-preview')
      await rm(`${prefix}.png`)
    }
  } else if (mime === 'video/mp4') {
    const probeArgs = ['-v', 'error', '-protocol_whitelist', 'file', '-f', 'mov', '-show_streams', '-show_format', '-of', 'json']
    const { stdout } = await command('ffprobe', [...probeArgs, file])
    const probe = JSON.parse(stdout) as { streams: { codec_type: string; width?: number; height?: number }[]; format: { duration: string } }
    const videos = probe.streams.filter((stream) => stream.codec_type === 'video')
    const duration = Number(probe.format.duration)
    const video = videos[0]
    if (videos.length !== 1 || !video.width || !video.height || video.width * video.height > 16000000
      || !Number.isFinite(duration) || duration <= 0 || duration > 120
      || probe.streams.some((stream) => !['video', 'audio'].includes(stream.codec_type))) throw new Error('Video stream/duration bounds violated')
    const common = ['-v', 'error', '-nostdin', '-protocol_whitelist', 'file', '-f', 'mov', '-i', file]
    const target = path.join(directory, 'video.mp4')
    await command('ffmpeg', [...common, '-map', '0:v:0', '-map', '0:a:0?', '-map_metadata', '-1', '-map_chapters', '-1',
      '-vf', "scale=w='min(1280,iw)':h='min(720,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,setsar=1,fps=24",
      '-c:v', 'libx264', '-preset', 'fast', '-crf', '24', '-pix_fmt', 'yuv420p', '-threads', '1',
      '-c:a', 'aac', '-ac', '2', '-b:a', '96k', '-t', '120', '-fs', String(limit), '-movflags', '+faststart', target])
    const { stdout: measured } = await command('ffprobe', [...probeArgs, target])
    const actual = JSON.parse(measured) as typeof probe
    const derived = actual.streams.find((stream) => stream.codec_type === 'video')!
    const measuredDuration = Number(actual.format.duration)
    if (!derived?.width || !derived.height || !Number.isFinite(measuredDuration)
      || Math.abs(measuredDuration - duration) > 0.15 || derived.width > video.width || derived.height > video.height) throw new Error('Video output was truncated or enlarged')
    await output('video.mp4', 'video/mp4', 'video', { width: derived.width, height: derived.height, duration: measuredDuration })
    const decoded = path.join(directory, 'decoded-poster.png')
    await command('ffmpeg', ['-v', 'error', '-nostdin', '-protocol_whitelist', 'file', '-f', 'mov', '-i', target,
      '-map', '0:v:0', '-frames:v', '1', '-threads', '1', decoded])
    await image(decoded, 'poster.png', 'poster')
    await rm(decoded)
    for (const [locale, alternative] of Object.entries(input.localized)) {
      if (alternative.purpose === 'decorative') continue
      const caption = requireAssetCaptions(alternative.caption!, measuredDuration)
      const name = `captions-${locale}.vtt`
      await writeFile(path.join(directory, name), caption, { flag: 'wx', mode: 0o600 })
      await output(name, 'text/vtt', 'captions', { locale: locale as 'en' | 'am', duration: measuredDuration })
    }
  } else throw new Error('No local processor for this MIME')
  return outputs
}

/** A bounded plain-text WebVTT subset. Cue markup, remote references and settings are refused. */
export function requireAssetCaptions(value: string, duration: number): string {
  if (!value.startsWith('WEBVTT\n\n') || value.includes('\r') || value.length > 4096) throw new Error('Video captions require bounded WebVTT')
  const blocks = value.trim().slice(8).split(/\n\n+/)
  let previous = 0
  const output: string[] = []
  const seconds = (time: string) => Number(time.slice(0, 2)) * 3600 + Number(time.slice(3, 5)) * 60 + Number(time.slice(6))
  for (const block of blocks) {
    const [timing, ...lines] = block.split('\n')
    const cue = /^(\d{2}:[0-5]\d:[0-5]\d\.\d{3}) --> (\d{2}:[0-5]\d:[0-5]\d\.\d{3})$/.exec(timing)
    if (!cue || !lines.length || !lines.every((line) => line.trim() && !/[<>\u0000-\u001f]/u.test(line))) throw new Error('Invalid or marked-up video caption cue')
    const start = seconds(cue[1]); const end = seconds(cue[2])
    if (start < previous || end <= start || end > duration + 0.05) throw new Error('Video caption timing exceeds output')
    previous = end
    output.push(`${timing}\n${lines.join('\n').replace(/&/g, '&amp;')}`)
  }
  if (!output.length || output.length > 100) throw new Error('Video requires caption cues')
  return `WEBVTT\n\n${output.join('\n\n')}\n`
}
