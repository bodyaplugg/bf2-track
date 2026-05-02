const webpack = require('webpack');

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.resolve.fallback = {
                ...webpackConfig.resolve.fallback,
                "fs": false,
                "path": false,
                "stream": false,
                "util": false,
                "http": false,
                "https": false,
                "zlib": false,
                "url": false,
                "net": false,
                "tls": false,
                "buffer": require.resolve("buffer/"),
                "process": require.resolve("process/browser.js"),
            };

            webpackConfig.plugins.push(
                new webpack.ProvidePlugin({
                    Buffer: ['buffer', 'Buffer'],
                    process: 'process/browser.js',
                })
            );

            return webpackConfig;
        },
    },
};