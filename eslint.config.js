import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      // ثابت يحقنه Vite وقت البناء (define في vite.config.js).
      globals: { ...globals.browser, __GEMINI_API_KEY__: 'readonly' },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
