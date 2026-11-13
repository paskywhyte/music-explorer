import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base is relative so the build works on GitHub Pages under any repo name
export default defineConfig({
  plugins: [react()],
  base: './',
})
