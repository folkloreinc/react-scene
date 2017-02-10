const path = require('path');

const contextPath = path.join(process.env.PWD, './src');
const outputPath = path.join(process.env.PWD, './.tmp');

module.exports = {

    context: contextPath,

    entry: {
        'react-scene': './index',
    },

    output: {
        path: outputPath,
        filename: '[name].js',
        jsonpFunction: 'flklrJsonp',
        libraryTarget: 'umd',
        library: 'ReactScene',
    },

    plugins: [

    ],

    module: {
        rules: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /.json$/,
                loader: 'json-loader',
                exclude: /node_modules/,
            },
            {
                test: /.html$/,
                loader: 'html-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.svg$/,
                exclude: /(node_modules|bower_components|\.tmp)/,
                use: [
                    'babel-loader?presets[]=es2015&presets[]=react',
                    'svg-react-loader',
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader!css?modules&importLoaders=1&sourceMap&localIdentName=[local]___[hash:base64:5]',
                    'sass-loader',
                ],
            },
        ],
    },

    externals: {
        react: {
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react',
            root: 'React',
        },
        'react-dom': {
            commonjs: 'react-dom',
            commonjs2: 'react-dom',
            amd: 'react-dom',
            root: 'ReactDOM',
        },
    },

    resolve: {
        extensions: ['.js', '.jsx', '.es6'],
        alias: {
            underscore: 'lodash',
        },
        modules: [
            path.join(process.env.PWD, './node_modules'),
            path.join(process.env.PWD, './web_modules'),
            path.join(process.env.PWD, './bower_components'),
        ],
    },

    stats: {
        colors: true,
        modules: true,
        reasons: true,
    },

    devtool: 'source-map',
    cache: false,
    watch: false,

};
