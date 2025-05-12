import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { crx } from 'vite-plugin-chrome-extension';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue(),
    crx({ manifest: resolve(__dirname, 'src/manifest.json') })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background/index.ts'),
        content: resolve(__dirname, 'src/content/index.ts'),
        popup: resolve(__dirname, 'src/popup/index.html'),
        options: resolve(__dirname, 'src/options/index.html')
      }
    }
  }
});