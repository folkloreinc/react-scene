var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var _ = require('lodash');
var path = require('path');

var contextPath = path.join(process.env.PWD, 'examples/js');
var outputPath = path.join(process.env.PWD, '.tmp/js');
var publicPath = '/js';

module.exports = _.extend({}, webpackConfig, {
    
    context: contextPath,
    
    entry: {
        'main': './index'
    },
    
    output: {
        path: outputPath,
        publicPath: '/js',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
        jsonpFunction: 'flklrJsonp'
    },
    
    plugins: [
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('development')
            }
        })
    ],
    
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'jquery': 'jQuery',
        'lodash': '_'
    }
    
});
