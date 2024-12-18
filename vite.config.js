export default {
  server: {
    proxy: {
      '/riot-api/na1': {
        target: 'https://na1.api.riotgames.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/riot-api\/na1/, ''),
        secure: false
      },
      '/riot-api/americas': {
        target: 'https://americas.api.riotgames.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/riot-api\/americas/, ''),
        secure: false
      }
    }
  }
}