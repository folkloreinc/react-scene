/**
 * Require Browsersync along with webpack and middleware for it
 */
var browserSync = require('browser-sync').create();
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var proxyMiddleware = require('proxy-middleware');
var servestaticMiddleware = require('serve-static');
var stripAnsi = require('strip-ansi');
var url = require('url');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var buildConfig = require('./config');
var browserSyncConfig = _.get(buildConfig, 'browsersync', {});
var webpackMiddlewareConfig = _.get(buildConfig, 'webpackMiddleware', {});

/**
 * Require ./webpack.config.js and make a bundler from it
 */
var webpackConfig = require('./webpack.config.browsersync');
var bundler = webpack(webpackConfig);

/**
 * Reload all devices when bundle is complete
 * or send a fullscreen error message to the browser instead
 */
bundler.plugin('done', function (stats)
{
    if (stats.hasErrors() || stats.hasWarnings())
    {
        return browserSync.sockets.emit('fullscreen:message', {
            title: 'Webpack Error:',
            body:  stripAnsi(stats.toString()),
            timeout: 100000
        });
    }
    
    browserSync.reload();
});

/**
 * Browser sync options
 */
var browserSyncOptions = {
    logFileChanges: false,
    
    middleware: [],
    
    plugins: [
        'bs-fullscreen-message'
    ]
};
browserSyncOptions = _.merge(browserSyncOptions, browserSyncConfig);

/**
 * Webpack middleware options
 */
var webpackMiddlewareOptions = {
   publicPath: webpackConfig.output.publicPath
};
webpackMiddlewareOptions = _.merge(webpackMiddlewareOptions, webpackMiddlewareConfig);

/**
 * Webpack middleware
 */
var webpackMiddleware = webpackDevMiddleware(bundler, webpackMiddlewareOptions);
browserSyncOptions.middleware.push(webpackMiddleware);

/**
 * Proxy
 */
if(browserSyncOptions.proxy)
{
    var proxyHost = url.parse(browserSyncOptions.proxy);
    browserSyncOptions.proxy = null;
    delete browserSyncOptions.proxy;
    browserSyncOptions = _.merge({
        host: proxyHost.host,
        open: 'external'
    }, browserSyncOptions);
    
    /**
     * Static middleware
     */
    var baseDirs = _.get(browserSyncOptions, 'server.baseDir', []);
    var serveStaticMiddlewares = {};
    _.each(baseDirs, function(dir)
    {
        serveStaticMiddlewares[dir] = servestaticMiddleware(dir);
    });
    var staticMiddleware = function(req,res,next) {
        
        var requestUrl = url.parse(req.url);
        var urlPath = requestUrl.pathname;
        
        var middleware;
        for(var key in serveStaticMiddlewares)
        {
            middleware = serveStaticMiddlewares[key];
            try {
                stats = fs.lstatSync(path.join(key, urlPath));
                if(stats.isFile())
                {
                    return middleware(req, res, next);
                }
            } catch(e) {}
        }
        
        return next();
    };
    browserSyncOptions.middleware.push(staticMiddleware);

    /**
     * Proxy middleware
     */
    var proxyMiddlewareOptions = url.parse('http://'+proxyHost.host);
    proxyMiddlewareOptions.preserveHost = true;
    proxyMiddlewareOptions.via = 'browserSync';
    browserSyncOptions.middleware.push(proxyMiddleware(proxyMiddlewareOptions));
}

/**
 * Start webpack
 */
browserSync.init(browserSyncOptions);
