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
      { browserName: 'ie' }
    ],

    onPrepare: function () {
        browser.driver.get('http://localhost:3000/');
    },

    baseUrl: 'http://localhost:3000',
    rootElement: 'body',

    jasmineNodeOpts: {
        onComplete: null,
        isVerbose: false,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 20000
    }
};