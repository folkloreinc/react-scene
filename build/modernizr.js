#!/usr/bin/env node

var program = require('commander');
var modernizr = require('customizr');
var settings = require('./config').modernizr;

program
    .option('-p, --prod', 'Production build')
    .parse(process.argv);

if(program.prod)
{
    settings.dest = 'dist/modernizr.js';
    settings.uglify = true;
    settings.cache = false;
}

modernizr(settings, function () {
    
});
