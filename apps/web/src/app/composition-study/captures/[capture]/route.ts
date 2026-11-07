import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { isLocalDemo } from '@/server/environment'

export async function GET(_request: Request, { params }: { params: Promise<{ capture: string }> }) {
  if (!isLocalDemo()) return new Response(null, { status: 404 })
  const { capture } = await params
  if (!/^(before|after)-[a-z-]+-(1440|390)\.jpg$/.test(capture)) {
    return new Response(null, { status: 404 })
  }
  try {
    const file = resolve(process.cwd(), '../../docs/brand/evidence/composition-revision/captures', capture)
    const bytes = await readFile(file)
    return new Response(new Uint8Array(bytes), {
      headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return new Response(null, { status: 404 })
    throw error
  }
}
