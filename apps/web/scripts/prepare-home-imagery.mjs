import sharp from 'sharp'
import path from 'node:path'

const editorial = path.resolve(import.meta.dirname, '../public/editorial')
const generated = process.argv[2]
if (!generated) throw new Error('Pass the directory containing the original generated PNG files (see docs/visual-design/home-enhancement.md).')
const scenes = [
  ['general', 'exec-da234b7a-cf1e-41c4-aa56-7db319f8cb3f.png'],
  ['heart', 'exec-b15ebd8d-f0b8-4606-bd07-1d3e78c94628.png'],
  ['recovery', 'exec-7121493b-1b93-459f-9199-a6faa126582e.png'],
]
for (const [id, source] of scenes) {
  for (const width of [640, 1100]) {
    for (const format of ['webp', 'avif']) {
      await sharp(path.join(generated, source)).resize(width, Math.round(width * .75), { fit: 'cover' }).toFormat(format, { quality: format === 'webp' ? 78 : 55 }).toFile(path.join(editorial, `specialty-${id}-${width}.${format}`))
    }
  }
}
for (const width of [960, 1600]) {
  for (const format of ['webp', 'avif']) {
    await sharp(path.join(editorial, 'together-care.webp')).resize(width, Math.round(width * .625), { fit: 'cover' }).toFormat(format, { quality: format === 'webp' ? 80 : 55 }).toFile(path.join(editorial, `human-care-${width}.${format}`))
  }
}
for (const width of [640, 1100]) {
  for (const format of ['webp', 'avif']) {
    await sharp(path.join(generated, 'exec-6fca0e43-8b97-47f3-9f45-48e0bda1b267.png')).resize(width, Math.round(width * 2 / 3), { fit: 'cover' }).toFormat(format, { quality: format === 'webp' ? 78 : 55 }).toFile(path.join(editorial, `arrival-${width}.${format}`))
  }
}
for (const width of [640, 960, 1536]) {
  for (const format of ['webp', 'avif']) {
    await sharp(path.join(editorial, 'hope-care.webp')).resize(width).toFormat(format, { quality: format === 'webp' ? 80 : 55 }).toFile(path.join(editorial, `hero-care-${width}.${format}`))
  }
}
