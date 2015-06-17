/*global module:false*/
module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		project: {
			src: 'src/js/app'
			, js: '<%= project.src %>/**.*.js'
			, dest: 'public/javascripts/build/'
			, bundle: 'public/javascripts/build/thrust-engine.min.js'
		},
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
		'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
		'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
		'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
		' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				src: '<%= concat.dist.dest %>',
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				unused: true,
				boss: true,
				eqnull: true,
				browser: true,
				globals: {}
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			lib_test: {
				src: ['lib/**/*.js', 'test/**/*.js']
			}
		},

		browserify: {
			test: {
				src: ['test/tests.js'],
				dest: './public/javascripts/test/tests.js',
				options: {
					watch: true,
					transform: ['browserify-shim']
				}
			},
			app: {
				src: ['src/game.js'],
				dest: './public/javascripts/browserify/thrust-engine.js',
				options: {
					keepAlive: true,
					transform: ['browserify-shim'],
					watch: true,
					postBundleCB: function(err, src, next) {
						grunt.log.writeln('bundle created successfully at: ' + new Date());
						next(err, src);
					},
					browserifyOptions: {
						debug: true
					}
				}
			}
		},

		mocha_phantomjs: {
			all: ['./public/javascripts/test/*.html'],
			options: {
				reporter: 'html',
				file: './coverage/test.html',
				growlOnSuccess: false
			}
		},

		smoothie: {
			default_task: {
				options: {
					prompt: true,
					src: "src/",
					test: "test/",
					moduleTemplate: './node_modules/grunt-smoothie/tasks/flavours/node/CustomType.js',
					specTemplate: './node_modules/grunt-smoothie/tasks/flavours/node/CustomTypeSpec.js',
					packageMap: [
						{
							name: 'Top Level',
							value: ''
						},
						'actors',
						'environment',
						'states',
						'utils'
					]
				}
			}
		},

	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-smoothie');
	grunt.loadNpmTasks('grunt-mocha-phantomjs');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-mocha-istanbul');

	// Default task.
	grunt.registerTask('default', ['browserify']);
	grunt.registerTask('add', ['smoothie']);

};
