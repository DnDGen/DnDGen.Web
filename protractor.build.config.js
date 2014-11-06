exports.config = {

    seleniumServerJar: 'node_modules/protractor/selenium/selenium-server-standalone-2.43.1.jar',
    seleniumPort: null,
    chromeDriver: 'node_modules/protractor/selenium/chromedriver',
    seleniumArgs: [],

    specs: [
      'Tests/Integration/e2e/*.js'
    ],

    multiCapabilities: [
        { browserName: 'firefox' },
        { browserName: 'chrome' },
        { browserName: 'safari' },
        { browserName: 'ie' }
    ],

    onPrepare: function () {
        require('jasmine-reporters');
        jasmine.getEnv().addReporter(
          new jasmine.JUnitXmlReporter('.', true, true, 'e2e-results-temp', true));
    },

    rootElement: 'body',

    jasmineNodeOpts: {
        onComplete: null,
        isVerbose: false,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 20000
    }
};