'use strict';

var CommonTestFunctions = require('./../commonTestFunctions.js');

describe('Encounter Page', function () {
    var commonTestFunctions = new CommonTestFunctions();

    beforeEach(function () {
        browser.get(browser.baseUrl + '/Encounter');
    });

    afterEach(function () {
        browser.manage().logs().get('browser').then(commonTestFunctions.assertNoErrors);
    });

    it('should have a header', function () {
        expect(element(by.css('h1')).getText()).toBe('EncounterGen');
    });
});