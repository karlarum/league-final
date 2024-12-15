export default {
  server: {
    proxy: {
      '/riot-api': {
        target: 'https://na1.api.riotgames.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/riot-api/, ''),
        secure: false
      }
    }
  }
}