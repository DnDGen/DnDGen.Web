describe('Navigation', function () {
    browser.ignoreSynchronization = true;

    beforeEach(function () {
        browser.get(browser.baseUrl);
    });

    it('should navigate to the home page', function () {
        browser.get(browser.baseUrl + '/Dice');
        element(by.css('.navbar-brand')).click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/');
    });

    it('should navigate to the dice page', function () {
        element(by.id('diceLink')).click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/Dice');
    });

    it('should navigate to the equipment page', function () {
        element(by.id('equipmentLink')).click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/Equipment');
    });

    it('should navigate to the character page', function () {
        element(by.id('characterLink')).click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/Character');
    });

    it('should navigate to the dungeon page', function () {
        element(by.id('dungeonLink')).click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/Dungeon');
    });
});