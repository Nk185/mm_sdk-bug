import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [nodePolyfills(), tsconfigPaths(), react()],
  appType: 'spa',
  build: {
    rollupOptions: {
      input: {
        popup: './src/popup/popup.html',
      },
    },
    copyPublicDir: true,
  },
})
