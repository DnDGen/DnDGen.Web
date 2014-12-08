'use strict';

(function () {
    var Stopwatch = require('./stopwatch.js');

    var CommonTestFunctions = function () {
        var app = this;
        var stopwatch = new Stopwatch();

        app.clickButtonAndWaitForResolution = function (button) {
            button.click();
            browser.waitForAngular();
        };

        app.sendInput = function (input, keys) {
            input.clear();
            input.sendKeys(keys);
        };

        app.runInLoopToEliminateChance = function (functionToLoop, escapeFunction) {
            stopwatch.start();

            while (!escapeFunction() && stopwatch.getElapsed().seconds <= 1) {
                functionToLoop();
            }

            stopwatch.stop();
            stopwatch.reset();
        };
    };

    module.exports = function () {
        return new CommonTestFunctions();
    };
}());