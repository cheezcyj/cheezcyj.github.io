import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://cheezcyj.github.io',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
})
