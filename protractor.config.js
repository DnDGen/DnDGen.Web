exports.config = {

    seleniumServerJar: 'node_modules/protractor/selenium/selenium-server-standalone-2.43.1.jar',
    seleniumPort: null,
    chromeDriver: 'node_modules/protractor/selenium/chromedriver',
    seleniumArgs: ['-Dwebdriver.ie.driver=<node_modules/protractor/selenium/IEDriverServer.exe>'],

    specs: [
      'Tests/Integration/e2e/*.js'
    ],

    multiCapabilities: [
        { browserName: 'firefox' },
        { browserName: 'chrome' }
    ],

    onPrepare: function () {
        browser.driver.get('http://localhost:9266/');
    },

    baseUrl: 'http://localhost:9266',
    rootElement: 'body',

    jasmineNodeOpts: {
        onComplete: null,
        isVerbose: false,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 20000
    }
};