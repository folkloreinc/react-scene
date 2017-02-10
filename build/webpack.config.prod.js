const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackConfig = require('./webpack.config.base');
const path = require('path');

module.exports = () => {
    const outputPath = path.join(process.env.PWD, '/');

    return webpackMerge(webpackConfig, {
        output: {
            path: outputPath,
        },

        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production'),
                },
            }),
        ],
    });
};
