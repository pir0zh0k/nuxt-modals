// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import prettierConfig from 'eslint-config-prettier'

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
  features: {
    // Rules for module authors
    tooling: true,
    // Disable stylistic rules - Prettier will handle formatting
    stylistic: false,
  },
  dirs: {
    src: ['./playground'],
  },
}).append(
  // Disable all ESLint rules that conflict with Prettier
  prettierConfig
  )
