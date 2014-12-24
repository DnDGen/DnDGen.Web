'use strict';

var CommonTestFunctions = require('./Common/commonTestFunctions.js');

describe('Dice Page', function () {
    browser.ignoreSynchronization = true;
    var commonTestFunctions = new CommonTestFunctions();

    var rolls = {
        d2: element(by.binding('vm.rolls.d2')),
        d3: element(by.binding('vm.rolls.d3')),
        d4: element(by.binding('vm.rolls.d4')),
        d6: element(by.binding('vm.rolls.d6')),
        d8: element(by.binding('vm.rolls.d8')),
        d10: element(by.binding('vm.rolls.d10')),
        d12: element(by.binding('vm.rolls.d12')),
        d20: element(by.binding('vm.rolls.d20')),
        percentile: element(by.binding('vm.rolls.percentile')),
        custom: element(by.binding('vm.rolls.custom'))
    };

    var quantities = {
        d2: element(by.model('vm.quantities.d2')),
        d3: element(by.model('vm.quantities.d3')),
        d4: element(by.model('vm.quantities.d4')),
        d6: element(by.model('vm.quantities.d6')),
        d8: element(by.model('vm.quantities.d8')),
        d10: element(by.model('vm.quantities.d10')),
        d12: element(by.model('vm.quantities.d12')),
        d20: element(by.model('vm.quantities.d20')),
        percentile: element(by.model('vm.quantities.percentile')),
        custom: element(by.model('vm.quantities.custom'))
    };

    var buttons = {
        d2: element(by.id('d2Button')),
        d3: element(by.id('d3Button')),
        d4: element(by.id('d4Button')),
        d6: element(by.id('d6Button')),
        d8: element(by.id('d8Button')),
        d10: element(by.id('d10Button')),
        d12: element(by.id('d12Button')),
        d20: element(by.id('d20Button')),
        percentile: element(by.id('percentileButton')),
        custom: element(by.id('customButton'))
    };

    var customDie = element(by.model('vm.customDie'));

    beforeEach(function () {
        browser.get(browser.baseUrl + '/Dice');
    });

    //#region page load tests

    it('should have a title', function () {
        expect(browser.driver.getTitle()).toEqual('DNDGen');
    });

    it('has all rolls starting at 0', function () {
        expect(rolls.d2.getText()).toEqual('0');
        expect(rolls.d3.getText()).toEqual('0');
        expect(rolls.d4.getText()).toEqual('0');
        expect(rolls.d6.getText()).toEqual('0');
        expect(rolls.d8.getText()).toEqual('0');
        expect(rolls.d10.getText()).toEqual('0');
        expect(rolls.d12.getText()).toEqual('0');
        expect(rolls.d20.getText()).toEqual('0');
        expect(rolls.percentile.getText()).toEqual('0');
        expect(rolls.custom.getText()).toEqual('0');
    });

    it('has all quantities starting at 1', function () {
        expect(quantities.d2.getAttribute('value')).toEqual('1');
        expect(quantities.d3.getAttribute('value')).toEqual('1');
        expect(quantities.d4.getAttribute('value')).toEqual('1');
        expect(quantities.d6.getAttribute('value')).toEqual('1');
        expect(quantities.d8.getAttribute('value')).toEqual('1');
        expect(quantities.d10.getAttribute('value')).toEqual('1');
        expect(quantities.d12.getAttribute('value')).toEqual('1');
        expect(quantities.d20.getAttribute('value')).toEqual('1');
        expect(quantities.percentile.getAttribute('value')).toEqual('1');
        expect(quantities.custom.getAttribute('value')).toEqual('1');
    });

    it('has custom die starting at 1', function () {
        expect(customDie.getAttribute('value')).toEqual('1');
    });

    //#endregion

    //#region d2 tests

    it('should roll a d2', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d2);
        expect(rolls.d2.getText()).toBeGreaterThan(0);
    });

    it('should only roll a d2', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d2);

        expect(rolls.d3.getText()).toEqual('0');
        expect(rolls.d4.getText()).toEqual('0');
        expect(rolls.d6.getText()).toEqual('0');
        expect(rolls.d8.getText()).toEqual('0');
        expect(rolls.d10.getText()).toEqual('0');
        expect(rolls.d12.getText()).toEqual('0');
        expect(rolls.d20.getText()).toEqual('0');
        expect(rolls.percentile.getText()).toEqual('0');
        expect(rolls.custom.getText()).toEqual('0');
    });

    it('should roll 3d2', function () {
        commonTestFunctions.sendInput(quantities.d2, 3);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d2);
        expect(rolls.d2.getText()).toBeGreaterThan(2);
    });

    it('should format the roll of d2', function () {
        commonTestFunctions.sendInput(quantities.d2, 1000);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d2);
        expect(rolls.d2.getText()).toContain(',');
    });

    it('should allow quantity of 1 for d2', function () {
        expect(buttons.d2.isEnabled()).toBeTruthy();
    });

    it('should allow quantities greater than 1 for d2', function () {
        commonTestFunctions.sendInput(quantities.d2, 2);
        expect(buttons.d2.isEnabled()).toBeTruthy();
    });

    it('should not allow decimal quantities for d2', function () {
        commonTestFunctions.sendInput(quantities.d2, 1.5);
        expect(buttons.d2.isEnabled()).toBeFalsy();
    });

    it('should not allow quantity of 0 for d2', function () {
        commonTestFunctions.sendInput(quantities.d2, 0);
        expect(buttons.d2.isEnabled()).toBeFalsy();
    });

    it('should not allow negative quantities for d2', function () {
        commonTestFunctions.sendInput(quantities.d2, -1);
        expect(buttons.d2.isEnabled()).toBeFalsy();
    });

    it('should not allow non-numeric quantites for d2', function () {
        commonTestFunctions.sendInput(quantities.d2, 'two');
        expect(buttons.d2.isEnabled()).toBeFalsy();
    });

    it('should not allow empty quantites for d2', function () {
        commonTestFunctions.sendInput(quantities.d2, '');
        expect(buttons.d2.isEnabled()).toBeFalsy();
    });

    it('increments d2 quantity by 1 when up is pressed', function () {
        quantities.d2.sendKeys(protractor.Key.UP);
        expect(quantities.d2.getAttribute('value')).toBe('2');
    });

    it('decrements d2 quantity by 1 when down is pressed', function () {
        commonTestFunctions.sendInput(quantities.d2, 3);
        quantities.d2.sendKeys(protractor.Key.DOWN);
        expect(quantities.d2.getAttribute('value')).toBe('2');
    });

    it('cannot key down d2 quantity below 1', function () {
        commonTestFunctions.sendInput(quantities.d2, 1);
        quantities.d2.sendKeys(protractor.Key.DOWN);
        expect(quantities.d2.getAttribute('value')).toBe('1');
    });

    //#endregion

    //#region d3 tests

    it('should roll a d3', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d3);
        expect(rolls.d3.getText()).toBeGreaterThan(0);
    });

    it('should only roll a d3', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d3);

        expect(rolls.d2.getText()).toEqual('0');
        expect(rolls.d4.getText()).toEqual('0');
        expect(rolls.d6.getText()).toEqual('0');
        expect(rolls.d8.getText()).toEqual('0');
        expect(rolls.d10.getText()).toEqual('0');
        expect(rolls.d12.getText()).toEqual('0');
        expect(rolls.d20.getText()).toEqual('0');
        expect(rolls.percentile.getText()).toEqual('0');
        expect(rolls.custom.getText()).toEqual('0');
    });

    it('should roll 4d3', function () {
        commonTestFunctions.sendInput(quantities.d3, 4);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d3);
        expect(rolls.d3.getText()).toBeGreaterThan(3);
    });

    it('should format the roll of d3', function () {
        commonTestFunctions.sendInput(quantities.d3, 1000);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d3);
        expect(rolls.d3.getText()).toContain(',');
    });

    it('should allow quantity of 1 for d3', function () {
        expect(buttons.d3.isEnabled()).toBeTruthy();
    });

    it('should allow quantities greater than 1 for d3', function () {
        commonTestFunctions.sendInput(quantities.d3, 2);
        expect(buttons.d3.isEnabled()).toBeTruthy();
    });

    it('should not allow decimal quantities for d3', function () {
        commonTestFunctions.sendInput(quantities.d3, 1.5);
        expect(buttons.d3.isEnabled()).toBeFalsy();
    });

    it('should not allow quantity of 0 for d3', function () {
        commonTestFunctions.sendInput(quantities.d3, 0);
        expect(buttons.d3.isEnabled()).toBeFalsy();
    });

    it('should not allow negative quantities for d3', function () {
        commonTestFunctions.sendInput(quantities.d3, -1);
        expect(buttons.d3.isEnabled()).toBeFalsy();
    });

    it('should not allow non-numeric quantites for d3', function () {
        commonTestFunctions.sendInput(quantities.d3, 'two');
        expect(buttons.d3.isEnabled()).toBeFalsy();
    });

    it('should not allow empty quantites for d3', function () {
        commonTestFunctions.sendInput(quantities.d3, '');
        expect(buttons.d3.isEnabled()).toBeFalsy();
    });

    it('increments d3 quantity by 1 when up is pressed', function () {
        quantities.d3.sendKeys(protractor.Key.UP);
        expect(quantities.d3.getAttribute('value')).toBe('2');
    });

    it('decrements d3 quantity by 1 when down is pressed', function () {
        commonTestFunctions.sendInput(quantities.d3, 3);
        quantities.d3.sendKeys(protractor.Key.DOWN);
        expect(quantities.d3.getAttribute('value')).toBe('2');
    });

    it('cannot key down d3 quantity below 1', function () {
        commonTestFunctions.sendInput(quantities.d3, 1);
        quantities.d3.sendKeys(protractor.Key.DOWN);
        expect(quantities.d3.getAttribute('value')).toBe('1');
    });

    //#endregion

    //#region d4 tests

    it('should roll a d4', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d4);
        expect(rolls.d4.getText()).toBeGreaterThan(0);
    });

    it('should only roll a d4', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d4);

        expect(rolls.d2.getText()).toEqual('0');
        expect(rolls.d3.getText()).toEqual('0');
        expect(rolls.d6.getText()).toEqual('0');
        expect(rolls.d8.getText()).toEqual('0');
        expect(rolls.d10.getText()).toEqual('0');
        expect(rolls.d12.getText()).toEqual('0');
        expect(rolls.d20.getText()).toEqual('0');
        expect(rolls.percentile.getText()).toEqual('0');
        expect(rolls.custom.getText()).toEqual('0');
    });

    it('should roll 5d4', function () {
        commonTestFunctions.sendInput(quantities.d4, 5);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d4);
        expect(rolls.d4.getText()).toBeGreaterThan(4);
    });

    it('should format the roll of d4', function () {
        commonTestFunctions.sendInput(quantities.d4, 1000);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d4);
        expect(rolls.d4.getText()).toContain(',');
    });

    it('should allow quantity of 1 for d4', function () {
        expect(buttons.d4.isEnabled()).toBeTruthy();
    });

    it('should allow quantities greater than 1 for d4', function () {
        commonTestFunctions.sendInput(quantities.d4, 2);
        expect(buttons.d4.isEnabled()).toBeTruthy();
    });

    it('should not allow decimal quantities for d4', function () {
        commonTestFunctions.sendInput(quantities.d4, 1.5);
        expect(buttons.d4.isEnabled()).toBeFalsy();
    });

    it('should not allow quantity of 0 for d4', function () {
        commonTestFunctions.sendInput(quantities.d4, 0);
        expect(buttons.d4.isEnabled()).toBeFalsy();
    });

    it('should not allow negative quantities for d4', function () {
        commonTestFunctions.sendInput(quantities.d4, -1);
        expect(buttons.d4.isEnabled()).toBeFalsy();
    });

    it('should not allow non-numeric quantites for d4', function () {
        commonTestFunctions.sendInput(quantities.d4, 'two');
        expect(buttons.d4.isEnabled()).toBeFalsy();
    });

    it('should not allow empty quantites for d4', function () {
        commonTestFunctions.sendInput(quantities.d4, '');
        expect(buttons.d4.isEnabled()).toBeFalsy();
    });

    it('increments d4 quantity by 1 when up is pressed', function () {
        quantities.d4.sendKeys(protractor.Key.UP);
        expect(quantities.d4.getAttribute('value')).toBe('2');
    });

    it('decrements d4 quantity by 1 when down is pressed', function () {
        commonTestFunctions.sendInput(quantities.d4, 3);
        quantities.d4.sendKeys(protractor.Key.DOWN);
        expect(quantities.d4.getAttribute('value')).toBe('2');
    });

    it('cannot key down d4 quantity below 1', function () {
        commonTestFunctions.sendInput(quantities.d4, 1);
        quantities.d4.sendKeys(protractor.Key.DOWN);
        expect(quantities.d4.getAttribute('value')).toBe('1');
    });

    //#endregion

    //#region d6 tests

    it('should roll a d6', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d6);
        expect(rolls.d6.getText()).toBeGreaterThan(0);
    });

    it('should only roll a d6', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d6);

        expect(rolls.d2.getText()).toEqual('0');
        expect(rolls.d3.getText()).toEqual('0');
        expect(rolls.d4.getText()).toEqual('0');
        expect(rolls.d8.getText()).toEqual('0');
        expect(rolls.d10.getText()).toEqual('0');
        expect(rolls.d12.getText()).toEqual('0');
        expect(rolls.d20.getText()).toEqual('0');
        expect(rolls.percentile.getText()).toEqual('0');
        expect(rolls.custom.getText()).toEqual('0');
    });

    it('should roll 7d6', function () {
        commonTestFunctions.sendInput(quantities.d6, 7);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d6);
        expect(rolls.d6.getText()).toBeGreaterThan(6);
    });

    it('should format the roll of d6', function () {
        commonTestFunctions.sendInput(quantities.d6, 1000);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d6);
        expect(rolls.d6.getText()).toContain(',');
    });

    it('should allow quantity of 1 for d6', function () {
        expect(buttons.d6.isEnabled()).toBeTruthy();
    });

    it('should allow quantities greater than 1 for d6', function () {
        commonTestFunctions.sendInput(quantities.d6, 2);
        expect(buttons.d6.isEnabled()).toBeTruthy();
    });

    it('should not allow decimal quantities for d6', function () {
        commonTestFunctions.sendInput(quantities.d6, 1.5);
        expect(buttons.d6.isEnabled()).toBeFalsy();
    });

    it('should not allow quantity of 0 for d6', function () {
        commonTestFunctions.sendInput(quantities.d6, 0);
        expect(buttons.d6.isEnabled()).toBeFalsy();
    });

    it('should not allow negative quantities for d6', function () {
        commonTestFunctions.sendInput(quantities.d6, -1);
        expect(buttons.d6.isEnabled()).toBeFalsy();
    });

    it('should not allow non-numeric quantites for d6', function () {
        commonTestFunctions.sendInput(quantities.d6, 'two');
        expect(buttons.d6.isEnabled()).toBeFalsy();
    });

    it('should not allow empty quantites for d6', function () {
        commonTestFunctions.sendInput(quantities.d6, '');
        expect(buttons.d6.isEnabled()).toBeFalsy();
    });

    it('increments d6 quantity by 1 when up is pressed', function () {
        quantities.d6.sendKeys(protractor.Key.UP);
        expect(quantities.d6.getAttribute('value')).toBe('2');
    });

    it('decrements d6 quantity by 1 when down is pressed', function () {
        commonTestFunctions.sendInput(quantities.d6, 3);
        quantities.d6.sendKeys(protractor.Key.DOWN);
        expect(quantities.d6.getAttribute('value')).toBe('2');
    });

    it('cannot key down d6 quantity below 1', function () {
        commonTestFunctions.sendInput(quantities.d6, 1);
        quantities.d6.sendKeys(protractor.Key.DOWN);
        expect(quantities.d6.getAttribute('value')).toBe('1');
    });

    //#endregion

    //#region d8 tests

    it('should roll a d8', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d8);
        expect(rolls.d8.getText()).toBeGreaterThan(0);
    });

    it('should only roll a d8', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d8);

        expect(rolls.d2.getText()).toEqual('0');
        expect(rolls.d3.getText()).toEqual('0');
        expect(rolls.d4.getText()).toEqual('0');
        expect(rolls.d6.getText()).toEqual('0');
        expect(rolls.d10.getText()).toEqual('0');
        expect(rolls.d12.getText()).toEqual('0');
        expect(rolls.d20.getText()).toEqual('0');
        expect(rolls.percentile.getText()).toEqual('0');
        expect(rolls.custom.getText()).toEqual('0');
    });

    it('should roll 9d8', function () {
        commonTestFunctions.sendInput(quantities.d8, 9);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d8);
        expect(rolls.d8.getText()).toBeGreaterThan(8);
    });

    it('should format the roll of d8', function () {
        commonTestFunctions.sendInput(quantities.d8, 1000);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d8);
        expect(rolls.d8.getText()).toContain(',');
    });

    it('should allow quantity of 1 for d8', function () {
        expect(buttons.d8.isEnabled()).toBeTruthy();
    });

    it('should allow quantities greater than 1 for d8', function () {
        commonTestFunctions.sendInput(quantities.d8, 2);
        expect(buttons.d8.isEnabled()).toBeTruthy();
    });

    it('should not allow decimal quantities for d8', function () {
        commonTestFunctions.sendInput(quantities.d8, 1.5);
        expect(buttons.d8.isEnabled()).toBeFalsy();
    });

    it('should not allow quantity of 0 for d8', function () {
        commonTestFunctions.sendInput(quantities.d8, 0);
        expect(buttons.d8.isEnabled()).toBeFalsy();
    });

    it('should not allow negative quantities for d8', function () {
        commonTestFunctions.sendInput(quantities.d8, -1);
        expect(buttons.d8.isEnabled()).toBeFalsy();
    });

    it('should not allow non-numeric quantites for d8', function () {
        commonTestFunctions.sendInput(quantities.d8, 'two');
        expect(buttons.d8.isEnabled()).toBeFalsy();
    });

    it('should not allow empty quantites for d8', function () {
        commonTestFunctions.sendInput(quantities.d8, '');
        expect(buttons.d8.isEnabled()).toBeFalsy();
    });

    it('increments d8 quantity by 1 when up is pressed', function () {
        quantities.d8.sendKeys(protractor.Key.UP);
        expect(quantities.d8.getAttribute('value')).toBe('2');
    });

    it('decrements d8 quantity by 1 when down is pressed', function () {
        commonTestFunctions.sendInput(quantities.d8, 3);
        quantities.d8.sendKeys(protractor.Key.DOWN);
        expect(quantities.d8.getAttribute('value')).toBe('2');
    });

    it('cannot key down d8 quantity below 1', function () {
        commonTestFunctions.sendInput(quantities.d8, 1);
        quantities.d8.sendKeys(protractor.Key.DOWN);
        expect(quantities.d8.getAttribute('value')).toBe('1');
    });

    //#endregion

    //#region d10 tests

    it('should roll a d10', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d10);
        expect(rolls.d10.getText()).toBeGreaterThan(0);
    });

    it('should only roll a d10', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d10);

        expect(rolls.d2.getText()).toEqual('0');
        expect(rolls.d3.getText()).toEqual('0');
        expect(rolls.d4.getText()).toEqual('0');
        expect(rolls.d6.getText()).toEqual('0');
        expect(rolls.d8.getText()).toEqual('0');
        expect(rolls.d12.getText()).toEqual('0');
        expect(rolls.d20.getText()).toEqual('0');
        expect(rolls.percentile.getText()).toEqual('0');
        expect(rolls.custom.getText()).toEqual('0');
    });

    it('should roll 11d10', function () {
        commonTestFunctions.sendInput(quantities.d10, 11);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d10);
        expect(rolls.d10.getText()).toBeGreaterThan(10);
    });

    it('should format the roll of d10', function () {
        commonTestFunctions.sendInput(quantities.d10, 1000);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d10);
        expect(rolls.d10.getText()).toContain(',');
    });

    it('should allow quantity of 1 for d10', function () {
        expect(buttons.d10.isEnabled()).toBeTruthy();
    });

    it('should allow quantities greater than 1 for d10', function () {
        commonTestFunctions.sendInput(quantities.d10, 2);
        expect(buttons.d10.isEnabled()).toBeTruthy();
    });

    it('should not allow decimal quantities for d10', function () {
        commonTestFunctions.sendInput(quantities.d10, 1.5);
        expect(buttons.d10.isEnabled()).toBeFalsy();
    });

    it('should not allow quantity of 0 for d10', function () {
        commonTestFunctions.sendInput(quantities.d10, 0);
        expect(buttons.d10.isEnabled()).toBeFalsy();
    });

    it('should not allow negative quantities for d10', function () {
        commonTestFunctions.sendInput(quantities.d10, -1);
        expect(buttons.d10.isEnabled()).toBeFalsy();
    });

    it('should not allow non-numeric quantites for d10', function () {
        commonTestFunctions.sendInput(quantities.d10, 'two');
        expect(buttons.d10.isEnabled()).toBeFalsy();
    });

    it('should not allow empty quantites for d10', function () {
        commonTestFunctions.sendInput(quantities.d10, '');
        expect(buttons.d10.isEnabled()).toBeFalsy();
    });

    it('increments d10 quantity by 1 when up is pressed', function () {
        quantities.d10.sendKeys(protractor.Key.UP);
        expect(quantities.d10.getAttribute('value')).toBe('2');
    });

    it('decrements d10 quantity by 1 when down is pressed', function () {
        commonTestFunctions.sendInput(quantities.d10, 3);
        quantities.d10.sendKeys(protractor.Key.DOWN);
        expect(quantities.d10.getAttribute('value')).toBe('2');
    });

    it('cannot key down d10 quantity below 1', function () {
        commonTestFunctions.sendInput(quantities.d10, 1);
        quantities.d10.sendKeys(protractor.Key.DOWN);
        expect(quantities.d10.getAttribute('value')).toBe('1');
    });

    //#endregion

    //#region d12 tests

    it('should roll a d12', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d12);
        expect(rolls.d12.getText()).toBeGreaterThan(0);
    });

    it('should only roll a d12', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d12);

        expect(rolls.d2.getText()).toEqual('0');
        expect(rolls.d3.getText()).toEqual('0');
        expect(rolls.d4.getText()).toEqual('0');
        expect(rolls.d6.getText()).toEqual('0');
        expect(rolls.d8.getText()).toEqual('0');
        expect(rolls.d10.getText()).toEqual('0');
        expect(rolls.d20.getText()).toEqual('0');
        expect(rolls.percentile.getText()).toEqual('0');
        expect(rolls.custom.getText()).toEqual('0');
    });

    it('should roll 13d12', function () {
        commonTestFunctions.sendInput(quantities.d12, 13);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d12);
        expect(rolls.d12.getText()).toBeGreaterThan(12);
    });

    it('should format the roll of d12', function () {
        commonTestFunctions.sendInput(quantities.d12, 1000);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d12);
        expect(rolls.d12.getText()).toContain(',');
    });

    it('should allow quantity of 1 for d12', function () {
        expect(buttons.d12.isEnabled()).toBeTruthy();
    });

    it('should allow quantities greater than 1 for d12', function () {
        commonTestFunctions.sendInput(quantities.d12, 2);
        expect(buttons.d12.isEnabled()).toBeTruthy();
    });

    it('should not allow decimal quantities for d12', function () {
        commonTestFunctions.sendInput(quantities.d12, 1.5);
        expect(buttons.d12.isEnabled()).toBeFalsy();
    });

    it('should not allow quantity of 0 for d12', function () {
        commonTestFunctions.sendInput(quantities.d12, 0);
        expect(buttons.d12.isEnabled()).toBeFalsy();
    });

    it('should not allow negative quantities for d12', function () {
        commonTestFunctions.sendInput(quantities.d12, -1);
        expect(buttons.d12.isEnabled()).toBeFalsy();
    });

    it('should not allow non-numeric quantites for d12', function () {
        commonTestFunctions.sendInput(quantities.d12, 'two');
        expect(buttons.d12.isEnabled()).toBeFalsy();
    });

    it('should not allow empty quantites for d12', function () {
        commonTestFunctions.sendInput(quantities.d12, '');
        expect(buttons.d12.isEnabled()).toBeFalsy();
    });

    it('increments d12 quantity by 1 when up is pressed', function () {
        quantities.d12.sendKeys(protractor.Key.UP);
        expect(quantities.d12.getAttribute('value')).toBe('2');
    });

    it('decrements d12 quantity by 1 when down is pressed', function () {
        commonTestFunctions.sendInput(quantities.d12, 3);
        quantities.d12.sendKeys(protractor.Key.DOWN);
        expect(quantities.d12.getAttribute('value')).toBe('2');
    });

    it('cannot key down d12 quantity below 1', function () {
        commonTestFunctions.sendInput(quantities.d12, 1);
        quantities.d12.sendKeys(protractor.Key.DOWN);
        expect(quantities.d12.getAttribute('value')).toBe('1');
    });

    //#endregion

    //#region d20 tests

    it('should roll a d20', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d20);
        expect(rolls.d20.getText()).toBeGreaterThan(0);
    });

    it('should only roll a d20', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d20);

        expect(rolls.d2.getText()).toEqual('0');
        expect(rolls.d3.getText()).toEqual('0');
        expect(rolls.d4.getText()).toEqual('0');
        expect(rolls.d6.getText()).toEqual('0');
        expect(rolls.d8.getText()).toEqual('0');
        expect(rolls.d10.getText()).toEqual('0');
        expect(rolls.d12.getText()).toEqual('0');
        expect(rolls.percentile.getText()).toEqual('0');
        expect(rolls.custom.getText()).toEqual('0');
    });

    it('should roll 21d20', function () {
        commonTestFunctions.sendInput(quantities.d20, 21);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d20);
        expect(rolls.d20.getText()).toBeGreaterThan(20);
    });

    it('should format the roll of d20', function () {
        commonTestFunctions.sendInput(quantities.d20, 1000);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.d20);
        expect(rolls.d20.getText()).toContain(',');
    });

    it('should allow quantity of 1 for d20', function () {
        expect(buttons.d20.isEnabled()).toBeTruthy();
    });

    it('should allow quantities greater than 1 for d20', function () {
        commonTestFunctions.sendInput(quantities.d20, 2);
        expect(buttons.d20.isEnabled()).toBeTruthy();
    });

    it('should not allow decimal quantities for d20', function () {
        commonTestFunctions.sendInput(quantities.d20, 1.5);
        expect(buttons.d20.isEnabled()).toBeFalsy();
    });

    it('should not allow quantity of 0 for d20', function () {
        commonTestFunctions.sendInput(quantities.d20, 0);
        expect(buttons.d20.isEnabled()).toBeFalsy();
    });

    it('should not allow negative quantities for d20', function () {
        commonTestFunctions.sendInput(quantities.d20, -1);
        expect(buttons.d20.isEnabled()).toBeFalsy();
    });

    it('should not allow non-numeric quantites for d20', function () {
        commonTestFunctions.sendInput(quantities.d20, 'two');
        expect(buttons.d20.isEnabled()).toBeFalsy();
    });

    it('should not allow empty quantites for d20', function () {
        commonTestFunctions.sendInput(quantities.d20, '');
        expect(buttons.d20.isEnabled()).toBeFalsy();
    });

    it('increments d20 quantity by 1 when up is pressed', function () {
        quantities.d20.sendKeys(protractor.Key.UP);
        expect(quantities.d20.getAttribute('value')).toBe('2');
    });

    it('decrements d20 quantity by 1 when down is pressed', function () {
        commonTestFunctions.sendInput(quantities.d20, 3);
        quantities.d20.sendKeys(protractor.Key.DOWN);
        expect(quantities.d20.getAttribute('value')).toBe('2');
    });

    it('cannot key down d20 quantity below 1', function () {
        commonTestFunctions.sendInput(quantities.d20, 1);
        quantities.d20.sendKeys(protractor.Key.DOWN);
        expect(quantities.d20.getAttribute('value')).toBe('1');
    });

    //#endregion

    //#region percentile tests

    it('should roll a percentile', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.percentile);
        expect(rolls.percentile.getText()).toBeGreaterThan(0);
    });

    it('should only roll a percentile', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.percentile);

        expect(rolls.d2.getText()).toEqual('0');
        expect(rolls.d3.getText()).toEqual('0');
        expect(rolls.d4.getText()).toEqual('0');
        expect(rolls.d6.getText()).toEqual('0');
        expect(rolls.d8.getText()).toEqual('0');
        expect(rolls.d10.getText()).toEqual('0');
        expect(rolls.d12.getText()).toEqual('0');
        expect(rolls.d20.getText()).toEqual('0');
        expect(rolls.custom.getText()).toEqual('0');
    });

    it('should roll 101d100', function () {
        commonTestFunctions.sendInput(quantities.percentile, 101);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.percentile);

        //HACK: This verifies that it is at least 1000, when the min is 100
        //No good way I have found so far to extract the formatted number from the element
        //to do an actual comparison
        expect(rolls.percentile.getText()).toContain(',');
    });

    it('should format the roll of percentile', function () {
        commonTestFunctions.sendInput(quantities.percentile, 1000);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.percentile);
        expect(rolls.percentile.getText()).toContain(',');
    });

    it('should allow quantity of 1 for percentile', function () {
        expect(buttons.percentile.isEnabled()).toBeTruthy();
    });

    it('should allow quantities greater than 1 for percentile', function () {
        commonTestFunctions.sendInput(quantities.percentile, 2);
        expect(buttons.percentile.isEnabled()).toBeTruthy();
    });

    it('should not allow decimal quantities for percentile', function () {
        commonTestFunctions.sendInput(quantities.percentile, 1.5);
        expect(buttons.percentile.isEnabled()).toBeFalsy();
    });

    it('should not allow quantity of 0 for percentile', function () {
        commonTestFunctions.sendInput(quantities.percentile, 0);
        expect(buttons.percentile.isEnabled()).toBeFalsy();
    });

    it('should not allow negative quantities for percentile', function () {
        commonTestFunctions.sendInput(quantities.percentile, -1);
        expect(buttons.percentile.isEnabled()).toBeFalsy();
    });

    it('should not allow non-numeric quantites for percentile', function () {
        commonTestFunctions.sendInput(quantities.percentile, 'two');
        expect(buttons.percentile.isEnabled()).toBeFalsy();
    });

    it('should not allow empty quantites for percentile', function () {
        commonTestFunctions.sendInput(quantities.percentile, '');
        expect(buttons.percentile.isEnabled()).toBeFalsy();
    });

    it('increments percentile quantity by 1 when up is pressed', function () {
        quantities.percentile.sendKeys(protractor.Key.UP);
        expect(quantities.percentile.getAttribute('value')).toBe('2');
    });

    it('decrements percentile quantity by 1 when down is pressed', function () {
        commonTestFunctions.sendInput(quantities.percentile, 3);
        quantities.percentile.sendKeys(protractor.Key.DOWN);
        expect(quantities.percentile.getAttribute('value')).toBe('2');
    });

    it('cannot key down percentile quantity below 1', function () {
        commonTestFunctions.sendInput(quantities.percentile, 1);
        quantities.percentile.sendKeys(protractor.Key.DOWN);
        expect(quantities.percentile.getAttribute('value')).toBe('1');
    });

    //#endregion

    //#region custom tests

    it('should roll a custom roll', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.custom);
        expect(rolls.custom.getText()).toBeGreaterThan(0);
    });

    it('should only roll a custom roll', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.custom);

        expect(rolls.d2.getText()).toEqual('0');
        expect(rolls.d3.getText()).toEqual('0');
        expect(rolls.d4.getText()).toEqual('0');
        expect(rolls.d6.getText()).toEqual('0');
        expect(rolls.d8.getText()).toEqual('0');
        expect(rolls.d10.getText()).toEqual('0');
        expect(rolls.d12.getText()).toEqual('0');
        expect(rolls.d20.getText()).toEqual('0');
        expect(rolls.percentile.getText()).toEqual('0');
    });

    it('should roll 6d5', function () {
        commonTestFunctions.sendInput(quantities.custom, 6);
        commonTestFunctions.sendInput(customDie, 5);

        commonTestFunctions.clickButtonAndWaitForResolution(buttons.custom);
        expect(rolls.custom.getText()).toBeGreaterThan(5);
    });

    it('should format the custom roll', function () {
        commonTestFunctions.sendInput(quantities.custom, 1000);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.custom);
        expect(rolls.custom.getText()).toContain(',');
    });

    it('should allow quantity of 1 for custom', function () {
        expect(buttons.custom.isEnabled()).toBeTruthy();
    });

    it('should allow quantities greater than 1 for custom', function () {
        commonTestFunctions.sendInput(quantities.custom, 2);
        expect(buttons.custom.isEnabled()).toBeTruthy();
    });

    it('should not allow decimal quantities for custom', function () {
        commonTestFunctions.sendInput(quantities.custom, 1.5);
        expect(buttons.custom.isEnabled()).toBeFalsy();
    });

    it('should not allow quantity of 0 for custom', function () {
        commonTestFunctions.sendInput(quantities.custom, 0);
        expect(buttons.custom.isEnabled()).toBeFalsy();
    });

    it('should not allow negative quantities for custom', function () {
        commonTestFunctions.sendInput(quantities.custom, -1);
        expect(buttons.custom.isEnabled()).toBeFalsy();
    });

    it('should not allow non-numeric quantites for custom', function () {
        commonTestFunctions.sendInput(quantities.custom, 'two');
        expect(buttons.custom.isEnabled()).toBeFalsy();
    });

    it('should not allow empty quantites for custom', function () {
        commonTestFunctions.sendInput(quantities.custom, '');
        expect(buttons.custom.isEnabled()).toBeFalsy();
    });

    it('increments custom quantity by 1 when up is pressed', function () {
        quantities.custom.sendKeys(protractor.Key.UP);
        expect(quantities.custom.getAttribute('value')).toBe('2');
    });

    it('decrements custom quantity by 1 when down is pressed', function () {
        commonTestFunctions.sendInput(quantities.custom, 3);
        quantities.custom.sendKeys(protractor.Key.DOWN);
        expect(quantities.custom.getAttribute('value')).toBe('2');
    });

    it('cannot key down custom quantity below 1', function () {
        commonTestFunctions.sendInput(quantities.custom, 1);
        quantities.custom.sendKeys(protractor.Key.DOWN);
        expect(quantities.custom.getAttribute('value')).toBe('1');
    });

    it('should allow die of 1 for custom', function () {
        expect(buttons.custom.isEnabled()).toBeTruthy();
    });

    it('should allow die greater than 1 for custom', function () {
        commonTestFunctions.sendInput(customDie, 2);
        expect(buttons.custom.isEnabled()).toBeTruthy();
    });

    it('should not allow decimal die for custom', function () {
        commonTestFunctions.sendInput(customDie, 1.5);
        expect(buttons.custom.isEnabled()).toBeFalsy();
    });

    it('should not allow die of 0 for custom', function () {
        commonTestFunctions.sendInput(customDie, 0);
        expect(buttons.custom.isEnabled()).toBeFalsy();
    });

    it('should not allow negative die for custom', function () {
        commonTestFunctions.sendInput(customDie, -1);
        expect(buttons.custom.isEnabled()).toBeFalsy();
    });

    it('should not allow non-numeric die for custom', function () {
        commonTestFunctions.sendInput(customDie, 'two');
        expect(buttons.custom.isEnabled()).toBeFalsy();
    });

    it('should not allow empty die for custom', function () {
        commonTestFunctions.sendInput(customDie, '');
        expect(buttons.custom.isEnabled()).toBeFalsy();
    });

    it('increments custom die by 1 when up is pressed', function () {
        customDie.sendKeys(protractor.Key.UP);
        expect(customDie.getAttribute('value')).toBe('2');
    });

    it('decrements custom die by 1 when down is pressed', function () {
        commonTestFunctions.sendInput(customDie, 3);
        customDie.sendKeys(protractor.Key.DOWN);
        expect(customDie.getAttribute('value')).toBe('2');
    });

    it('cannot key down custom die below 1', function () {
        commonTestFunctions.sendInput(customDie, 1);
        customDie.sendKeys(protractor.Key.DOWN);
        expect(customDie.getAttribute('value')).toBe('1');
    });

    //#endregion
});