(function () {
    'use strict'

    var CommonTestFunctions = function () {
        var app = this;

        function longWait() {
            browser.sleep(500);
        }

        function shortWait() {
            browser.sleep(10);
        }

        app.assertNoErrors = function (browserLog) {
            for (var i = 0; i < browserLog.length; i++)
                expect(browserLog[i].message).toBe('');

            expect(browserLog.length).toBe(0);
        };

        app.clickWhenReadyAndWaitForResolution = function (elementToClick, loadingElement) {
            while (browser.isElementPresent(elementToClick) == false)
                shortWait();

            browser.waitForAngular();
            elementToClick.click();

            while (loadingElement && loadingElement.isDisplayed() == true)
                shortWait();

            browser.waitForAngular();
            longWait();
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