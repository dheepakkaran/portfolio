import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base path-la un GitHub repository name-ah podனும் (e.g., /my-portfolio/)
export default defineConfig({
  plugins: [react()],
  base: '/<YOUR_GITHUB_REPOSITORY_NAME>/', 
})