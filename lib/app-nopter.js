'use strict';

var pkg = require('../package.json');
var path = require('path');
var nopter = new (require("nopter"))(); 
 
nopter.config({
    title: pkg.name,
    name: "swagger-editor",
    version: pkg.version,
    options: {
        "help": {
          short: 'h',
          info: 'Show this help text',
          type: Boolean
        },
        "version": {
          info: 'Print current version and exit',
          type: Boolean  
        },
        "config-file": {
            short: 'c',
            info: 'Custom swagger-editor defaults.json config file'
        },
        "spec-file": {
            info: 'The spec file to edit (yaml or json)',
            type: path
        },
        "listen-port": {
            info: 'bind backend server to this host (default is random)',
            type: Number,
            default: 0
        },
        "listen-host": {
            info: 'bind backend server to this address',
            type: String,
            default: 'localhost'
        }
    },
    aliases: ['spec-file']
});

module.exports = nopter;
