var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var _ = require('lodash');
var path = require('path');

var outputPath = path.join(process.env.PWD, '/dist');

module.exports = _.merge({}, webpackConfig, {
    
    output: {
        path: outputPath
    },
    
    plugins: [
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
    
});
