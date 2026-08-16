const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(
    '/static-stats-v1',
    createProxyMiddleware({
        target: 'https://aspxstats.cetteup.com/v2/',
        changeOrigin: true,
        secure: false,
        followRedirects: true,
        pathRewrite: { '^/static-stats-v1': '' },
    })
);

app.use(
    '/static-stats-v2',
    createProxyMiddleware({
        target: 'https://aspxstats.cetteup.com/v2/',
        changeOrigin: true,
        secure: false,
        followRedirects: true,
        pathRewrite: { '^/static-stats-v2': '' },
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