import { isDevelopment, isLocalDemo } from './src/server/environment.ts'
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.resolve(currentDirectory, '../..')

const homeExperience = isLocalDemo() ? './src/demo/home-experience.tsx' : './src/demo/disabled-home-experience.tsx'

const developmentScripts = isLocalDemo()
  ? "; script-src 'self' 'unsafe-inline'" + (isDevelopment() ? " 'unsafe-eval'" : '')
    + "; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'"
    + (isDevelopment() ? ' ws://localhost:* ws://127.0.0.1:*' : '')
  : ''

const securityHeaders = [
  { key: 'Content-Security-Policy', value: "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'" + developmentScripts },
  { key: 'Referrer-Policy', value: 'no-referrer' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
]

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    useTypeScriptCli: false,
  },
  poweredByHeader: false,
  async headers() {
    return [{ headers: securityHeaders, source: '/:path*' }]
  },
  turbopack: {
    root: workspaceRoot,
    resolveAlias: { '@home-experience': homeExperience },
  },
  webpack(webpackConfig) {
    webpackConfig.resolve.alias['@home-experience'] = path.join(currentDirectory, homeExperience)
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
