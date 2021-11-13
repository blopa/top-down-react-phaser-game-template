const {
    addBeforeLoader,
    loaderByName,
} = require('@craco/craco');

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

            const { isAdded } = addBeforeLoader(
                webpackConfig,
                loaderByName('url-loader'),
                imageLoader
            );

            return webpackConfig;
        },
    },
};
