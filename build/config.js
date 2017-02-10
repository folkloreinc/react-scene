module.exports = {

    /**
     * Browsersync
     */
    browsersync: {
        server: {
            baseDir: ['./.tmp','./examples'],
            index: 'index.html',
        },

        files: ['examples/**'],
    },

    /**
     * Webpack middleware
     */
    webpackMiddleware: {
        noInfo: false,

        quiet: false,

        lazy: false,

        watchOptions: {
            aggregateTimeout: 300,
            poll: true,
        },

        stats: {
            colors: true,
        },
    },

    /**
     * PostCSS
     */
    postcss: {
        autoprefixer: {
            browsers: '> 5%',
        },
    },

    /**
     * Modernizr
     */
    modernizr: {
        cache: true,

        devFile: false,

        dest: '.tmp/modernizr.js',

        options: [
            'setClasses',
            'addTest',
            'html5printshiv',
            'testProp',
            'fnBind',
        ],

        uglify: false,

        tests: [],

        excludeTests: [],

        crawl: true,

        useBuffers: false,

        files: {
            src: [
                '*[^(g|G)runt(file)?].{js,css,scss}',
                '**[^node_modules]/**/*.{js,css,scss}',
                '!lib/**/*',
            ],
        },

        customTests: [],
    }

};
