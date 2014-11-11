module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: ['gruntfile.js', 'Tests/Unit/Scripts/*/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    protractor: {
      options: { keepAlive: false },
      integration: { configFile: "protractor.config.js" },
    },
    karma: {
      unit: { configFile: 'karma.config.js' }
	},
	msbuild: {
	  src: ['DNDGenSite/DNDGenSite.csproj'],
	  options: {
	    projectConfiguration: 'Debug',
	    targets: ['Build'],
	    stdout: true
	  }
    },
  	iisexpress: {
      server: {
        options: {
            port: 9266,
            path: 'DNDGenSite'
        }
      }
    },
	rename: {
      publishResults: {
        src: 'e2e-results-temp.xml',
        dest:'e2e-results.xml'
      }
    }
  });


  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-msbuild');
  grunt.loadNpmTasks('grunt-iisexpress');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-rename');

  grunt.registerTask('e2e', ['protractor']);
  grunt.registerTask('unit', ['karma']);
  grunt.registerTask('serve-dev', ['msbuild', 'iisexpress']);
};