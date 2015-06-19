'use strict';

var CommonTestFunctions = require('./../commonTestFunctions.js');

describe('Encounter Page', function () {
    beforeEach(function () {
        browser.get(browser.baseUrl + '/Encounter');
    });

    it('should have a title', function () {
        expect(browser.driver.getTitle()).toEqual('DNDGen');
    });

    it('should have a header', function () {
        expect(element(by.css('h1')).getText()).toBe('EncounterGen');
    });
});