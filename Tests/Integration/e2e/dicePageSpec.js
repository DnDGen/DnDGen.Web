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
        expect(element(by.model('quantities.d2')).getAttribute('value')).toEqual('1');
        expect(element(by.model('quantities.d3')).getAttribute('value')).toEqual('1');
        expect(element(by.model('quantities.d4')).getAttribute('value')).toEqual('1');
        expect(element(by.model('quantities.d6')).getAttribute('value')).toEqual('1');
        expect(element(by.model('quantities.d8')).getAttribute('value')).toEqual('1');
        expect(element(by.model('quantities.d10')).getAttribute('value')).toEqual('1');
        expect(element(by.model('quantities.d12')).getAttribute('value')).toEqual('1');
        expect(element(by.model('quantities.d20')).getAttribute('value')).toEqual('1');
        expect(element(by.model('quantities.percentile')).getAttribute('value')).toEqual('1');
        expect(element(by.model('quantities.custom')).getAttribute('value')).toEqual('1');
    });

    it('has custom die starting at 1', function () {
        expect(element(by.model('customDie')).getAttribute('value')).toEqual('1');
    });

    it('should roll a d2', function () {
        element(by.id('d2Button')).click();
        
        expect(element(by.binding('rolls.d2')).getText()).not.toEqual('0');
    });
});
