import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
    tsconfigPaths()
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    css: false,
    restoreMocks: true,
    // HeroUI's first render in a worker is slow enough that the 5s default
    // trips when every suite starts at once.
    testTimeout: 20000,
    hookTimeout: 20000,
    include: ['src/**/*.test.{js,jsx}'],
    env: {
      // Keeps request assertions independent of whatever .env holds locally.
      VITE_API_ENDPOINT: 'https://api.test.local/',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/test/**', 'src/**/*.test.{js,jsx}'],
    },
  },
})
