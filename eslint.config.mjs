import webConfig from './apps/web/eslint.config.mjs'

const config = [
  {
    ignores: [
      '**/.next/**',
      '**/node_modules/**',
      'apps/web/src/payload-generated-schema.ts',
      'apps/web/src/payload-types.ts',
    ],
  },
  ...webConfig,
  {
    settings: {
      next: {
        rootDir: 'apps/web',
      },
      react: {
        version: '19.2',
      },
    },
  },
]

export default config
