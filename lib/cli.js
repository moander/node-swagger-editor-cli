/// <reference path="../typings/node/node.d.ts"/>
'use strict';

var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Promise = require("bluebird");
var fs = require('fs'); 
var http = require('http');
var path = require('path');
var open = require("open");
var serveEditor = require('serve-swagger-editor');

Promise.longStackTraces();
Promise.promisifyAll(fs);

module.exports = async(function swagger_editor_cli(nopter, args, basedir, cancellationToken) {	
	var argerr = function (msg) {
		console.log(nopter.help());
		console.log(nopter.error.fatal(msg));
		return 2;
	};

	if (args.help) {
		console.log(nopter.help());
		return 0;
	}
	
	if (args.version) {
		var pkg = require('../package.json');
		console.log(pkg.name + ' v' + pkg.version);
		return 0;
	}
	
	var editorConfig = {
	    disableNewUserIntro: true,
	    useBackendForStorage: true,
		useYamlBackend: true
	};
	if (args.configFile) {
		try {
			var fdata = await(fs.readFileAsync(args.configFile));
			editorConfig = JSON.parse(fdata);			
		} catch (e) {
			return argerr('Unable to read config file');
		}
	}

	if (!args.specFile) {
		return argerr('spec-file argument is required');
	} 
	else if (path.parse(args.specFile).ext !== '.yaml') {
		return argerr('spec-file must have .yaml extension');
	} 
		
	var app = serveEditor(editorConfig, args.specFile);
	
	var server = http.createServer(app);
	Promise.promisifyAll(server);

	server.on('request', function (req, res) {
		res.on('finish', function () {
			console.log(res.statusCode, req.method, req.originalUrl);			
		});
	});
	
	// Start backend http server
	await(server.listenAsync(args.listenPort, args.listenHost));

	var url = 'http://' + args.listenHost + ':' + server.address().port + '/';
	console.log('Server is running.. ', url);
	open(url);
	
	// Wait for ctrl-c or something
	await(cancellationToken);
	
	// Shut down the http server 
	console.log('Close server');
	await(server.closeAsync());
	return 0;	
});

