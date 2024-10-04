import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'whatsapp': '/src/components/whatsapp.jsx', // Adjust the path as needed
    },
  },
});