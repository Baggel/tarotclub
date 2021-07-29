
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default {
  plugins: [vue()],
  server: {
    port: 6000,
    strictPort: false, // throw error if port in use
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
