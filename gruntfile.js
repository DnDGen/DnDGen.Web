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
        options: {
            keepAlive: false,           
        },
        ci: { configFile: "protractor.build.config.js" },
        debug: { configFile: "protractor.debug.config.js" },
    },
    karma: {
      unit: {
        configFile: 'karma.config.js'
      }
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
                  port: 3000,
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

  grunt.registerTask('e2e', ['protractor:debug']);
  grunt.registerTask('e2e-ci', ['protractor:ci', 'rename:publishResults']);
  grunt.registerTask('unit', ['karma']);
  grunt.registerTask('build', ['msbuild']);
  grunt.registerTask('serve-dev', ['build', 'iisexpress']);
};