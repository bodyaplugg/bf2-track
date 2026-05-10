const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(
    '/api-hub',
    createProxyMiddleware({
        target: 'http://official.ranking.bf2hub.com',
        changeOrigin: true,
        pathRewrite: { '^/api-hub': '/ASP' },
        on: {
            proxyReq: (proxyReq) => {
                proxyReq.setHeader('Host', 'BF2web.gamespy.com');
                proxyReq.setHeader('User-Agent', 'GameSpyHTTP/1.0');
            },
            error: (err, req, res) => {
                console.error('[Proxy Error]:', err);
            }
        }
    })
);

app.use(
    '/api-play',
    createProxyMiddleware({
        target: 'http://bf2web.playbf2.ru',
        changeOrigin: true,
        secure: false,
        followRedirects: true,
        pathRewrite: { '^/api-play': '/ASP' },
        on: {
            proxyReq: (proxyReq) => {
                proxyReq.setHeader('User-Agent', 'GameSpyHTTP/1.0');
            },
            error: (err, req, res) => {
                console.error('[Proxy Error]:', err);
            }
        }
    })
);

app.use(
    '/api-phoenix',
    createProxyMiddleware({
        target: 'http://bf2.phoenixnetwork.net/ASP/',
        changeOrigin: true,
        secure: false,
        followRedirects: true,
        pathRewrite: { '^/api-phoenix': '/ASP' },
    })
);

app.use(
    '/live-stats',
    createProxyMiddleware({
        target: 'https://api.bflist.io/v2/bf2/',
        changeOrigin: true,
        secure: false,
        followRedirects: true,
        pathRewrite: { '^/live-stats': '' },
    })
);

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));