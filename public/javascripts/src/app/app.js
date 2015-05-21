// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
	baseUrl: 'javascripts/src/',
	paths: {
		app: 'app',
		lodash: '../vendor/lodash/lodash',
		states: 'app/states',
		stats: '../vendor/stats.js/stats.min',
		game: 'app/game'
	},

	shim: {
		stats: 'stats'
	}
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['app/main']);