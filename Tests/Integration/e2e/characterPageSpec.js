'use strict';

describe('Character Page', function () {
    browser.ignoreSynchronization = true;

    beforeEach(function () {
        browser.get(browser.baseUrl + '/Character');
    });

    it('should have a title', function () {
        expect(browser.driver.getTitle()).toEqual('DNDGen');
    });
});
