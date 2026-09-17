import { execFile } from 'node:child_process'
import { constants } from 'node:fs'
import { mkdtemp, mkdir, open, readFile, realpath, rm, writeFile, stat, readdir } from 'node:fs/promises'
import path from 'node:path'
import { randomBytes } from 'node:crypto'
import { promisify } from 'node:util'
import sharp from 'sharp'
import { localAssetFormats } from './asset-formats.ts'
import { assetHash, requireAssetInput, type AssetInput, type AssetOutput, type AssetRecord } from './asset-record.ts'

const execute = promisify(execFile)
const maxBytes = 32 * 1024 * 1024
export type AssetScanner = (file: string, sha256: string) => Promise<AssetRecord['scan']>

/** No signature downloads/provider calls. Missing engine or stale signatures are a hard failure. */
export function createClamAvScanner(database?: string): AssetScanner {
  if (database && (!path.isAbsolute(database) || /[\u0000-\u001f]/u.test(database))) throw new Error('Invalid server-owned ClamAV database location')
  const databaseArgs = database ? [`--database=${database}`] : []
  return async (file, sha256) => {
    const { stdout } = await execute('clamscan', [...databaseArgs, '--version'], { timeout: 10000, maxBuffer: 65536 })
    const version = /^ClamAV ([\d.]+)\/(\d+)\/(.+)\s*$/.exec(stdout.trim())
    const signatureAt = version ? Date.parse(version[3]) : NaN
    if (!version || !Number.isFinite(signatureAt) || signatureAt > Date.now()
      || Date.now() - signatureAt > 48 * 3600000) throw new Error('ClamAV signatures are absent, future or stale')
    // execFile rejects nonzero exits (including infection/engine errors); never shell-expand paths.
    await execute('clamscan', [...databaseArgs, '--no-summary', '--alert-encrypted=yes', '--alert-exceeds-max=yes',
      '--max-filesize=100M', '--max-scansize=200M', '--', file], { timeout: 60000, maxBuffer: 65536 })
    return { sha256, engine: `ClamAV ${version[1]}`, signatures: version[2], at: new Date().toISOString(), fixtureOnly: false }
  }
}
export const clamAvScanner: AssetScanner = createClamAvScanner()

export function assetMime(bytes: Buffer): string {
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'image/png'
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'image/jpeg'
  if (bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP') return 'image/webp'
  if (bytes.subarray(0, 4).toString() === 'wOF2') return 'font/woff2'
  if (bytes.subarray(0, 5).toString() === '%PDF-') return 'application/pdf'
  if (bytes.subarray(4, 8).toString() === 'ftyp' && ['isom', 'mp42', 'mp41', 'avc1'].includes(bytes.subarray(8, 12).toString())) return 'video/mp4'
  if (/^(?:<\?xml[^>]*>\s*)?<svg\b/.test(bytes.subarray(0, 1024).toString().trimStart())) return 'image/svg+xml'
  throw new Error('Unsupported or unrecognized asset MIME')
}

/** Only disposable private storage, outside public/application assets. Originals retain provenance. */
export class ControlledAssetStore {
  readonly root: string
  private readonly formats: boolean | Readonly<{ python: string }>
  private constructor(root: string, formats: boolean | Readonly<{ python: string }>) { this.root = root; this.formats = structuredClone(formats) }
  static async create(parent: '/tmp' | '/var/tmp' = '/tmp', formats: boolean | Readonly<{ python: string }> = false): Promise<ControlledAssetStore> {
    if (!['/tmp', '/var/tmp'].includes(parent) || await realpath(parent) !== parent) throw new Error('Asset store requires a real disposable local directory')
    const root = await mkdtemp(path.join(parent, 'hallelujah-assets-'))
    return new ControlledAssetStore(root, formats)
  }
  /** Reattach a private on-disk store after a worker restart. Existing CMS receipts authorize reads. */
  static async reopen(root: string, formats: boolean | Readonly<{ python: string }> = false): Promise<ControlledAssetStore> {
    if (!/^\/(?:var\/)?tmp\/hallelujah-assets-[A-Za-z0-9]{6}$/.test(root)
      || await realpath(root) !== root) throw new Error('Recovery requires an existing real private asset store')
    const info = await stat(root)
    if (!info.isDirectory() || (info.mode & 0o777) !== 0o700
      || (process.getuid && info.uid !== process.getuid())) throw new Error('Recovered asset store ownership/permissions are invalid')
    return new ControlledAssetStore(root, formats)
  }
  private location(key: string): string {
    if (!/^[a-f0-9]{24}\/(?:original|(?:native|crop-[0-3])-\d{1,4}\.(?:png|webp)|font-(?:en|am)\.woff2|vector\.svg|document-(?:en|am)\.html|page-[1-5]\.png|video\.mp4|poster\.png|captions-(?:en|am)\.vtt)$/.test(key)) throw new Error('Invalid private asset key')
    return path.join(this.root, key)
  }
  async read(key: string): Promise<Buffer> {
    const directory = path.dirname(this.location(key))
    if (await realpath(directory) !== directory) throw new Error('Private asset directory cannot be a symbolic link')
    const handle = await open(this.location(key), constants.O_RDONLY | constants.O_NOFOLLOW)
    try {
      const stat = await handle.stat()
      if (!stat.isFile() || stat.size > maxBytes) throw new Error('Asset bytes are invalid or exceed the limit')
      return await handle.readFile()
    } finally { await handle.close() }
  }
  async removeOutputs(record: AssetRecord): Promise<void> {
    const directory = path.dirname(this.location(record.original.key))
    if (await realpath(directory) !== directory) throw new Error('Private cleanup directory cannot be a symbolic link')
    for (const output of record.outputs) await rm(this.location(output.key), { force: true, maxRetries: 5, retryDelay: 100 })
  }
  async discard(record: AssetRecord): Promise<void> {
    const token = record.original.key.split('/')[0]
    this.location(`${token}/original`)
    await rm(path.join(this.root, token), { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
  }
  /** Compare recovered bytes with trusted CMS receipts; report orphan intake without deleting originals. */
  async inspectRecovery(records: readonly AssetRecord[]) {
    const referenced = new Set<string>()
    const integrity: { assetKey: string; status: 'verified' | 'unavailable' }[] = []
    for (const record of records) {
      const input = requireAssetInput(record.input)
      const token = record.original.key.split('/')[0]
      this.location(`${token}/original`)
      referenced.add(token)
      let status: 'verified' | 'unavailable' = 'verified'
      try {
        if (assetHash(await this.read(record.original.key)) !== record.original.sha256) throw new Error('Original recovery fingerprint mismatch')
        const ended = record.state === 'withdrawn' || Date.now() >= Math.min(
          Date.parse(input.reviewAt), Date.parse(input.expiresAt), Date.parse(input.rights.expiresAt))
        if (ended) { await this.removeOutputs(record); status = 'unavailable' }
        else for (const output of record.outputs) if (assetHash(await this.read(output.key)) !== output.sha256) throw new Error('Derivative recovery fingerprint mismatch')
      } catch { status = 'unavailable' }
      integrity.push({ assetKey: `${input.assetId}:${input.version}`, status })
    }
    const orphanTokens = (await readdir(this.root)).filter((token) => /^[a-f0-9]{24}$/.test(token) && !referenced.has(token)).sort()
    return { integrity, orphanTokens, activation: 'requires-fresh-cms-resolution' as const }
  }
  async destroy(): Promise<void> {
    await rm(this.root, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
  }

  async intake(value: unknown, supplied: Buffer, claimedMime: string, author: string,
    scanner: AssetScanner = clamAvScanner): Promise<AssetRecord> {
    const input = requireAssetInput(value)
    if (!/^cms:[1-9]\d*$/.test(author)) throw new Error('Asset intake requires a CMS author identity')
    if (!Buffer.isBuffer(supplied) || supplied.length === 0 || supplied.length > maxBytes) throw new Error('Asset upload exceeds the bounded byte policy')
    // Detach before the first await: the caller cannot modify scanned bytes during intake.
    const bytes = Buffer.from(supplied)
    const token = randomBytes(12).toString('hex')
    const directory = path.join(this.root, token)
    await mkdir(directory, { mode: 0o700 })
    try {
      const originalKey = `${token}/original`
      const file = this.location(originalKey)
      await writeFile(file, bytes, { flag: 'wx', mode: 0o600 })
      const sha256 = assetHash(bytes)
      const receipt = await scanner(file, sha256)
      const scanAt = Date.parse(receipt?.at)
      if (!receipt || Object.keys(receipt).sort().join(',') !== 'at,engine,fixtureOnly,sha256,signatures'
        || receipt.sha256 !== sha256 || !receipt.engine?.trim() || !receipt.signatures?.trim()
        || typeof receipt.fixtureOnly !== 'boolean' || !Number.isFinite(scanAt)
        || new Date(scanAt).toISOString() !== receipt.at || scanAt > Date.now() + 1000
        || Date.now() - scanAt > 60000 || assetHash(await readFile(file)) !== sha256) throw new Error('Asset scan receipt is invalid, stale or does not match the original bytes')
      const mime = assetMime(bytes)
      if (mime !== claimedMime) throw new Error('Claimed asset MIME does not match bytes')
      const formats: Record<string, readonly string[]> = {
        logo: ['image/png', 'image/jpeg', 'image/webp'], image: ['image/png', 'image/jpeg', 'image/webp'],
        icon: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'], font: ['font/woff2'],
        document: ['application/pdf'], video: ['video/mp4'],
      }
      if (!formats[input.kind].includes(mime)) throw new Error('Asset kind does not match its MIME')
      const outputs = ['image/png', 'image/jpeg', 'image/webp'].includes(mime)
        ? await this.rasterOutputs(bytes, input, token)
        : this.formats ? await localAssetFormats(file, mime, input, token, typeof this.formats === 'object' ? this.formats.python : 'python3') : []
      for (const key of [originalKey, ...outputs.map((output) => output.key)]) {
        const handle = await open(this.location(key), constants.O_RDONLY | constants.O_NOFOLLOW)
        try { await handle.sync() } finally { await handle.close() }
      }
      for (const syncedDirectory of [directory, this.root]) {
        const directoryHandle = await open(syncedDirectory, constants.O_RDONLY | constants.O_DIRECTORY)
        try { await directoryHandle.sync() } finally { await directoryHandle.close() }
      }
      const now = new Date().toISOString()
      return { input, revision: 1, author, state: outputs.length ? 'review' : 'quarantined',
        original: { key: originalKey, sha256, mime, bytes: bytes.length }, scan: structuredClone(receipt), outputs,
        reviews: {}, audit: [{ actor: author, at: now, action: 'intake', reason: 'Synthetic private intake; no publication authority' }] }
    } catch (error) {
      await rm(directory, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
      throw error
    }
  }

  private async rasterOutputs(bytes: Buffer, input: AssetInput, token: string): Promise<AssetOutput[]> {
    const settings = { limitInputPixels: 16000000, failOn: 'warning' as const }
    const metadata = await sharp(bytes, settings).metadata()
    if (!metadata.width || !metadata.height || (metadata.pages ?? 1) !== 1) throw new Error('Raster dimensions/animation violate asset policy')
    // Autorotate before deriving crop coordinates. Sharp strips metadata unless explicitly retained.
    const master = await sharp(bytes, settings).rotate().toColourspace('srgb').png().toBuffer({ resolveWithObject: true })
    const outputs: AssetOutput[] = []
    const ratios: (number | null)[] = [null, ...input.crop!.ratios]
    for (const [index, ratio] of ratios.entries()) {
      let width = master.info.width
      let height = master.info.height
      if (ratio !== null) {
        width = Math.min(width, Math.floor(height * ratio))
        height = Math.min(height, Math.floor(width / ratio))
      }
      if (width < 1 || height < 1) throw new Error('Crop would have empty dimensions')
      const left = Math.max(0, Math.min(master.info.width - width, Math.round(input.crop!.focalPoint.x * master.info.width - width / 2)))
      const top = Math.max(0, Math.min(master.info.height - height, Math.round(input.crop!.focalPoint.y * master.info.height - height / 2)))
      const widths = [...new Set([320, 640, 1280].map((target) => Math.min(target, width)))]
      for (const target of widths) for (const format of ['webp', 'png'] as const) {
        const result = await sharp(master.data, settings).extract({ left, top, width, height })
          .resize({ width: target, withoutEnlargement: true }).toColourspace('srgb')
          .toFormat(format, format === 'webp' ? { quality: 80 } : { compressionLevel: 9 })
          .timeout({ seconds: 10 }).toBuffer({ resolveWithObject: true })
        if (result.data.length > maxBytes) throw new Error('Derivative exceeds asset byte limit')
        const key = `${token}/${ratio === null ? 'native' : `crop-${index - 1}`}-${target}.${format}`
        await writeFile(this.location(key), result.data, { flag: 'wx', mode: 0o600 })
        outputs.push({ key, sha256: assetHash(result.data), bytes: result.data.length,
          mime: `image/${format}`, width: result.info.width, height: result.info.height,
          ratio, colorProfile: 'sRGB', metadata: 'stripped' })
      }
    }
    return outputs
  }
}
