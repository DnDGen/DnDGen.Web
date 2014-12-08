'use strict';

(function () {
    var CommonTestFunctions = function () {
        var app = this;

        app.clickButtonAndWaitForResolution = function (button) {
            button.click();
            browser.waitForAngular();
        };

        app.sendInput = function (input, keys) {
            input.clear();
            input.sendKeys(keys);
        };
    };

    module.exports = function () {
        return new CommonTestFunctions();
    };
}());