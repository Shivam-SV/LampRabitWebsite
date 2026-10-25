import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from a sub-path on GitHub Pages; set VITE_PUBLIC_PATH=/ for a custom domain.
export default defineConfig({
  base: process.env.VITE_PUBLIC_PATH || '/LampRabitWebsite/',
  plugins: [react()],
})
