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

        app.selectItemInDropdown = function (element, value) {
            var cssFilterString = '[value="' + value + '"]';
            element.$(cssFilterString).click();
        };
    };

    module.exports = function () {
        return new CommonTestFunctions();
    };
}());