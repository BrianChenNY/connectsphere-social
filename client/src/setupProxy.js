const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://connectsphere.uu.sy',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: function(proxyReq, req, res) {
        console.log('代理请求:', req.method, req.url);
      },
      onProxyRes: function(proxyRes, req, res) {
        console.log('代理响应:', proxyRes.statusCode);
        proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
      }
    })
  );
}; 