import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  define: { 'process.env': process.env },
  base: process.env.PROJECT_ID ? `/${process.env.PROJECT_ID }/spa-dev/` : '/spa-dev/',
  plugins: [react()],
    server: {
        host: true, // Needed for Docker container port mapping
        port: 5174, // You can use any port you prefer
        watch: {
            usePolling: true,
        },
    },
})


/*
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/spa-dev/01JC30KVZYGPFVD4XBYDAMEJFC/01JCH284XAP4Y79RZPK44032ZG/landing/',
  plugins: [react()],
    server: {
        host: true, // Needed for Docker container port mapping
        port: 5173, // You can use any port you prefer
        watch: {
            usePolling: true,
        },
    },

})
*/