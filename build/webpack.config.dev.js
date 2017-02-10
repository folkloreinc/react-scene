const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const path = require('path');
const webpackConfig = require('./webpack.config.base');

module.exports = () => {
    const contextPath = path.join(process.env.PWD, 'examples/js');
    const outputPath = path.join(process.env.PWD, '.tmp/js');
    const publicPath = '/js';

    return webpackMerge(webpackConfig, {

        context: contextPath,

        entry: {
            main: './index',
        },

        output: {
            path: outputPath,
            publicPath,
            filename: '[name].js',
            chunkFilename: '[name].chunk.js',
            jsonpFunction: 'flklrJsonp',
        },

        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('development'),
                },
            }),
        ],

        externals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            jquery: 'jQuery',
            lodash: '_',
        },

    })
};
