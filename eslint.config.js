// @ts-check
import { defineConfig, globalIgnores } from 'eslint/config'
import { tanstackConfig } from '@tanstack/eslint-config'

export default defineConfig([
  globalIgnores([
    '.output/',
    'dist/',
    'node_modules/',
    '.nitro/',
    '.generated/',
  ]),

  ...tanstackConfig,

  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      'sort-imports': 'off',
      'import/order': 'off',
      'import/consistent-type-specifier-style': 'off',
    },
  },
])
