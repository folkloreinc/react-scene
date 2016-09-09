var webpack = require('webpack');
var path = require('path');

var contextPath = path.join(process.env.PWD, './src');
var outputPath = path.join(process.env.PWD, './.tmp');

module.exports = {
    
    context: contextPath,
    
    entry: {
        'react-scene': './index'
    },
    
    output: {
        path: outputPath,
        filename: '[name].js',
        jsonpFunction: 'flklrJsonp',
        libraryTarget: 'umd',
        library: 'ReactScene'
    },
    
    plugins: [
        
    ],
    
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react', 'stage-0']
                }
            },
            {
                test: /.json$/,
                loader: 'json',
                exclude: /node_modules/,
            },
            {
                test: /.html$/,
                loader: 'html',
                exclude: /node_modules/,
            },
            {
                test: /\.svg$/,
                exclude: /(node_modules|bower_components|\.tmp)/,
                loader: 'babel?presets[]=es2015&presets[]=react!svg-react'
            },
            {
                test: /\.scss$/,
                loader: 'style!css?modules&importLoaders=1&sourceMap&localIdentName=[local]___[hash:base64:5]!sass'
            }
        ]
     },
    
    externals: {
        'react': {
            'commonjs': 'react',
            'commonjs2': 'react',
            'amd': 'react',
            'root': 'React'
        },
        'react-dom': {
            'commonjs': 'react-dom',
            'commonjs2': 'react-dom',
            'amd': 'react-dom',
            'root': 'ReactDOM'
        },
        'lodash': {
            'commonjs': 'lodash',
            'commonjs2': 'lodash',
            'amd': 'lodash',
            'root': '_'
        }
    },
    
    resolve: {
        extensions: ['', '.js', '.jsx', '.es6'],
        alias: {
            underscore: 'lodash'
        },
        modulesDirectories: [
            path.join(process.env.PWD, './node_modules'),
            path.join(process.env.PWD, './web_modules'),
            path.join(process.env.PWD, './bower_components')
        ]
    },

    stats: {
        colors: true,
        modules: true,
        reasons: true
    },

    storeStatsTo: 'webpack',

    progress: true,

    devtool: 'source-map',
    cache: false,
    watch: false
    
};
