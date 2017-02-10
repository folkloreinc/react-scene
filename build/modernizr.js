#!/usr/bin/env node
const program = require('commander');
const modernizr = require('customizr');
const settings = require('./config').modernizr;

program
    .option('-p, --prod', 'Production build')
    .parse(process.argv);

if (program.prod) {
    settings.dest = 'dist/modernizr.js';
    settings.uglify = true;
    settings.cache = false;
}

modernizr(settings, () => {

});
