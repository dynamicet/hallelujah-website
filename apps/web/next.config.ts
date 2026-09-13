import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.resolve(currentDirectory, '../..')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: "default-src 'self'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; object-src 'none'" },
  { key: 'Referrer-Policy', value: 'no-referrer' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
]

const nextConfig: NextConfig = {
  experimental: {
    useTypeScriptCli: false,
  },
  poweredByHeader: false,
  async headers() {
    return [{ headers: securityHeaders, source: '/:path*' }]
  },
  turbopack: {
    root: workspaceRoot,
  },
  webpack(webpackConfig) {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
