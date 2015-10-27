/*global module:false*/
module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    project: {
      src: 'src/app',
      js: '<%= project.src %>/**.*.js',
      main: 'main.js',
      dest: './public/javascripts/browserify',
      bundle: '<%= project.dest %>/thrust-engine.js'
    },
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
    '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
    '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
    ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    uglify: {
      options: {
        compress: {
          drop_console: true
        },
        sourceMap: true,
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= project.bundle %>',
        dest: '<%= project.dest %>/<%= pkg.name %>.min.js'
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
        src: ['./src/test/tests.js'],
        dest: './public/javascripts/test/tests.js',
        options: {
          watch: true,
          transform: ['browserify-shim']
        }
      },
      app: {
        src: ['<%= project.src %>/<%= project.main %>'],
        dest: '<%= project.bundle %>',
        options: {
          keepAlive: true,
          transform: ['browserify-shim'],
          watch: true,
          postBundleCB: function (err, src, next) {
            grunt.log.writeln('app created successfully at: ' + new Date());
            next(err, src);
          },
          browserifyOptions: {
            debug: true
          }
        }
      },
      prod: {
        src: ['<%= project.src %>/<%= project.main %>'],
        dest: '<%= project.bundle %>',
        options: {
          keepAlive: false,
          transform: ['browserify-shim'],
          watch: false,
          postBundleCB: function (err, src, next) {
            grunt.log.writeln('prod build created successfully at: ' + new Date());
            next(err, src);
          },
          browserifyOptions: {
            debug: true
          }
        }
      }
    },

    mocha: {
      test: {
        src: ['./public/javascripts/test/index.html'],
        options: {
          run: true,
          bail: false,
          reporter: 'Spec'
        }
      }
    },

    mocha_phantomjs: {
      all: ['./public/javascripts/test/*.html'],
      options: {
        reporter: 'html',
        file: './coverage/test.html',
        growlOnSuccess: true
      }
    },

    smoothie: {
      default_task: {
        options: {
          prompt: true,
          src: "src/app/",
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

    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          paths: ['./src/app'],
          outdir: './public/yuidoc'
        }
      }
    },

    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        regExp: false
      }
    }

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
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-bump');

  // Default task.
  grunt.registerTask('default', ['browserify']);
  grunt.registerTask('add', ['smoothie']);
  grunt.registerTask('build', ['browserify:prod', 'uglify']);
  grunt.registerTask('test', ['mocha']);

};
