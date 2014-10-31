describe('Dice Page', function () {
    browser.ignoreSynchronization = true;

    it('should have a title', function () {
        expect(browser.driver.getTitle()).toEqual('DNDGen');
    });
});
