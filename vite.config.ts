import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Mendengarkan pada semua alamat IP
    port: 4545,      // Port yang ingin Anda gunakan
  },
})