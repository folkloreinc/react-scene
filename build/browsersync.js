const browserSync = require('browser-sync').create();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const proxyMiddleware = require('proxy-middleware');
const servestaticMiddleware = require('serve-static');
const stripAnsi = require('strip-ansi');
const url = require('url');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const buildConfig = require('./config');
const webpackConfig = require('./webpack.config')('dev');

const browserSyncConfig = _.get(buildConfig, 'browsersync', {});
const webpackMiddlewareConfig = _.get(buildConfig, 'webpackMiddleware', {});

/**
 * Require ./webpack.config.js and make a bundler from it
 */
const bundler = webpack(webpackConfig);

/**
 * Reload all devices when bundle is complete
 * or send a fullscreen error message to the browser instead
 */
bundler.plugin('done', (stats) => {
    if (stats.hasErrors() || stats.hasWarnings()) {
        return browserSync.sockets.emit('fullscreen:message', {
            title: 'Webpack Error:',
            body: stripAnsi(stats.toString()),
            timeout: 100000,
        });
    }
    return browserSync.reload();
});

/**
 * Browser sync options
 */
const browserSyncOptions = _.merge({
    logFileChanges: false,

    middleware: [],

    plugins: [
        'bs-fullscreen-message',
    ],
}, browserSyncConfig);

/**
 * Webpack middleware options
 */
const webpackMiddlewareOptions = _.merge({
    publicPath: webpackConfig.output.publicPath,
}, webpackMiddlewareConfig);

/**
 * Webpack middleware
 */
const webpackMiddleware = webpackDevMiddleware(bundler, webpackMiddlewareOptions);
browserSyncOptions.middleware.push(webpackMiddleware);

/**
 * Proxy
 */
if (browserSyncOptions.proxy) {
    const proxyHost = url.parse(browserSyncOptions.proxy);
    browserSyncOptions.proxy = null;
    browserSyncOptions.open = 'external';
    delete browserSyncOptions.proxy;

    /**
     * Static middleware
     */
    const baseDirs = _.get(browserSyncOptions, 'server.baseDir', []);
    const serveStaticMiddlewares = {};
    for (let i = 0, bl = baseDirs.length; i < bl; i += 1) {
        serveStaticMiddlewares[baseDirs[i]] = servestaticMiddleware(baseDirs[i]);
    }
    const staticMiddleware = (req, res, next) => {
        const requestUrl = url.parse(req.url);
        const urlPath = requestUrl.pathname;

        for (const key in serveStaticMiddlewares) {
            if (Object.prototype.hasOwnProperty.call(serveStaticMiddlewares, key)) {
                try {
                    const stats = fs.lstatSync(path.join(key, urlPath));
                    if (stats.isFile()) {
                        return serveStaticMiddlewares[key](req, res, next);
                    }
                } catch (e) {}
            }
        }

        return next();
    };
    browserSyncOptions.middleware.push(staticMiddleware);

    /**
     * Proxy middleware
     */
    const proxyMiddlewareOptions = url.parse(`http://${proxyHost.host}`);
    proxyMiddlewareOptions.preserveHost = true;
    proxyMiddlewareOptions.via = 'browserSync';
    browserSyncOptions.middleware.push(proxyMiddleware(proxyMiddlewareOptions));
}

/**
 * Start webpack
 */
browserSync.init(browserSyncOptions);
