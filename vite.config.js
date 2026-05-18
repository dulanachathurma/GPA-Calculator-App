import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  // base: "/my-gpa-predictor/",  ← මේ line එක comment කරන්න හෝ delete කරන්න
})
