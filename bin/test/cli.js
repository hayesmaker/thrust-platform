#!/usr/bin/env node

var spawn = require('child_process').spawn;

var child = spawn('mocha-phantomjs', [
	'http://localhost:3099/javascripts/test/index.html',
	'--timeout', '25000',
	'--hooks', './bin/test/phantom_hooks.js'
]);

child.on('close', function (code) {
	console.log('Mocha process exited with code ' + code);
	if (code > 0) {
		process.exit(1);
	}
});