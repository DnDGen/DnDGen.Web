describe('Dice Page', function () {
    browser.ignoreSynchronization = true;

    beforeEach(function () {
        browser.get(browser.baseUrl + '/Dice');
    });

    it('should have a title', function () {
        expect(browser.driver.getTitle()).toEqual('DNDGen');
    });

    it('has all rolls starting at 0', function () {
        expect(element(by.binding('rolls.d2')).getText()).toEqual('0');
        expect(element(by.binding('rolls.d3')).getText()).toEqual('0');
        expect(element(by.binding('rolls.d4')).getText()).toEqual('0');
        expect(element(by.binding('rolls.d6')).getText()).toEqual('0');
        expect(element(by.binding('rolls.d8')).getText()).toEqual('0');
        expect(element(by.binding('rolls.d10')).getText()).toEqual('0');
        expect(element(by.binding('rolls.d12')).getText()).toEqual('0');
        expect(element(by.binding('rolls.d20')).getText()).toEqual('0');
        expect(element(by.binding('rolls.percentile')).getText()).toEqual('0');
        expect(element(by.binding('rolls.custom')).getText()).toEqual('0');
    });

    it('has all quantities starting at 1', function () {
        expect(element(by.binding('quantities.d2')).getText()).toEqual('1');
        expect(element(by.binding('quantities.d3')).getText()).toEqual('1');
        expect(element(by.binding('quantities.d4')).getText()).toEqual('1');
        expect(element(by.binding('quantities.d6')).getText()).toEqual('1');
        expect(element(by.binding('quantities.d8')).getText()).toEqual('1');
        expect(element(by.binding('quantities.d10')).getText()).toEqual('1');
        expect(element(by.binding('quantities.d12')).getText()).toEqual('1');
        expect(element(by.binding('quantities.d20')).getText()).toEqual('1');
        expect(element(by.binding('quantities.percentile')).getText()).toEqual('1');
        expect(element(by.binding('quantities.custom')).getText()).toEqual('1');
    });

    it('has custom die starting at 1', function () {
        expect(element(by.model('customDie')).getText()).toEqual('1');
    });

    it('should roll a d2', function () {
        element(by.id('d2Button')).click();
        expect(element(by.binding('rolls.d2')).getText()).not.toEqual('0');
    });
});
