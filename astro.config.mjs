import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  site: 'https://cheezcyj.github.io',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        picomatch: fileURLToPath(
          new URL('./scripts/picomatch-interop.mjs', import.meta.url),
        ),
      },
    },
  },
})
