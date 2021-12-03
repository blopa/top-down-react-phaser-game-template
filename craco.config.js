const path = require('path');
const { copyFileSync } = require('fs');
const {
    loaderByName,
    addAfterLoader,
} = require('@craco/craco');

[
    'favicon.ico',
    'index.html',
    'logo192.png',
    'logo512.png',
    'manifest.json',
    'robots.txt',
].forEach((file) => {
    copyFileSync(
        path.resolve(__dirname, 'template', file),
        path.resolve(__dirname, 'public', file)
    );
});

// Use craco to force create-react-app to load images as files and not base64
module.exports = {
    webpack: {
        configure: (webpackConfig, { paths }) => {
            const imageLoader = {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve('file-loader'),
                options: {
                    // limit: imageInlineSizeLimit,
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            };

            const { isAdded } = addAfterLoader(
                webpackConfig,
                loaderByName('url-loader'),
                imageLoader
            );

            return webpackConfig;
        },
    },
};
