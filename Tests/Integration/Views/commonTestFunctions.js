(function () {
    'use strict'

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

        app.selectItemInDropdown = function (element, value) {
            element.element(by.cssContainingText('option', value)).click();
        };
    };

    module.exports = function () {
        return new CommonTestFunctions();
    };
}());