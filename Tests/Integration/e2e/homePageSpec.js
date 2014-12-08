'use strict';

describe('Home Page', function () {
    browser.ignoreSynchronization = true;

    beforeEach(function () {
        browser.get(browser.baseUrl);
    });

    it('should have a title', function () {
        expect(browser.driver.getTitle()).toEqual('DNDGen');
    });
});