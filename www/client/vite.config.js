
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default {
  plugins: [vue()],
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
