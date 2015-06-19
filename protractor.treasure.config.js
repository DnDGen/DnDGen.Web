exports.config = {
    framework: 'jasmine2',
    specs: [
      'Tests/Integration/**/treasurePageSpec.js'
    ],
    multiCapabilities: [
        { browserName: 'chrome' },
        { browserName: 'firefox' }
    ],
    onPrepare: function () {
        browser.ignoreSynchronization = true;
        browser.driver.manage().window().maximize();
        browser.driver.get('http://localhost:9266/');

        var jasmineReporters = require('jasmine-reporters');
 
        return browser.getProcessedConfig().then(function(config) {
            var browserName = config.capabilities.browserName;
 
            var junitReporter = new jasmineReporters.JUnitXmlReporter({
                consolidateAll: true,
                savePath: 'testresults',
                filePrefix: browserName + '.treasure',
                modifySuiteName: function(generatedSuiteName, suite) {
                    return browserName + '.' + generatedSuiteName;
                }
            });
            jasmine.getEnv().addReporter(junitReporter);
        });
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