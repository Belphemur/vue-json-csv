import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  server: {
    open: true
  },
  root: 'example',
  base: './',
  build: {
    outDir: '../docs'
  }
})
