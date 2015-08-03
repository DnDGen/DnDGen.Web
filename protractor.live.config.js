exports.config = {
    framework: 'jasmine2',
    specs: [
      'Tests/Integration/**/*PageSpec.js'
    ],
    multiCapabilities: [
        {
            browserName: 'chrome',
            "loggingPrefs": {
                "driver": "SEVERE",
                "server": "SEVERE",
                "browser": "SEVERE"
            }
        }, {
            browserName: 'firefox',
            "loggingPrefs": {
                "driver": "SEVERE",
                "server": "SEVERE",
                "browser": "SEVERE"
            }
        }
    ],
    onPrepare: function () {
        browser.ignoreSynchronization = true;
        browser.driver.manage().window().maximize();
        browser.driver.get('http://dndgen.com/');

        var jasmineReporters = require('jasmine-reporters');
 
        return browser.getProcessedConfig().then(function(config) {
            var browserName = config.capabilities.browserName;
 
            var junitReporter = new jasmineReporters.JUnitXmlReporter({
                consolidateAll: true,
                savePath: 'testresults',
                filePrefix: browserName + '.live',
                modifySuiteName: function(generatedSuiteName, suite) {
                    return browserName + '.' + generatedSuiteName;
                }
            });
            jasmine.getEnv().addReporter(junitReporter);
        });
    },
    baseUrl: 'http://dndgen.com',
    rootElement: 'body',
    jasmineNodeOpts: {
        onComplete: null,
        isVerbose: false,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 60000
    }
};