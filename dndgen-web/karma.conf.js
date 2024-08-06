// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-firefox-launcher'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    files: [
      { pattern: './src/assets/**', watched: false, included:false, nocache:false, served:true }
    ],
    proxies: {
      '/assets/': '/base/src/assets/'
    },
    client: {
      jasmine: {
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        oneFailurePerSpec: true,
        stopSpecOnExpectationFailure: true
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    reporters: ['progress'],
    browsers: ['FirefoxHeadless'],
    customLaunchers: {
      'FirefoxHeadless': {
          base: 'Firefox',
          flags: [
              '-headless',
          ],
      }
    },
    singleRun: true
  });
};
