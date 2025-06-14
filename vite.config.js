import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // This line imports the React plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // This line uses the React plugin
  base: '/',
})