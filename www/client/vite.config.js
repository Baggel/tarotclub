
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default {
  plugins: [vue()],
  // alias
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')// Set alias
    }
  },
  server: {
    proxy: {
      '^/api': {
        target: 'https://localhost:5000',
        ws: true,
        changeOrigin: true,
        logLevel: "debug",
        onProxyReq: function(request) {
          request.setHeader("origin", "https://localhost:5000");
        },
      },
    }
  }
  
}
