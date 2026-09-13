// @ts-check
import { defineConfig } from 'astro/config'
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.medium.com"
      }
    ]
  },
  vite: {
    optimizeDeps: {
      exclude: ["@iconify/svelte"]
    }
  }
})
