'use strict';

var CommonTestFunctions = require('./../commonTestFunctions.js');

describe('Dice Page', function () {
    var commonTestFunctions = new CommonTestFunctions();

    var roll = element(by.binding('vm.roll'));
    var standardQuantity = element(by.model('vm.standardQuantity'));
    var standardDice = element(by.model('vm.standardDie'));
    var standardDie = standardDice.$('option:checked');
    var customQuantity = element(by.model('vm.customQuantity'));
    var customDie = element(by.model('vm.customDie'));
    var standardRollButton = element(by.id('standardRollButton'));
    var customRollButton = element(by.id('customRollButton'));
    var rollingSection = element(by.id('rollingSection'));

    beforeEach(function () {
        browser.get(browser.baseUrl + '/Dice');
    });

    it('should have a title', function () {
        expect(browser.driver.getTitle()).toBe('DNDGen');
    });

    it('should have a header', function () {
        expect(element(by.css('h1')).getText()).toBe('D20 Dice');
    });

    it('has roll starting at 0', function () {
        expect(roll.getText()).toBe('0');
    });

    it('has all quantities starting at 1', function () {
        expect(standardQuantity.getAttribute('value')).toBe('1');
        expect(customQuantity.getAttribute('value')).toBe('1');
    });

    it('has custom die starting at 1', function () {
        expect(customDie.getAttribute('value')).toBe('1');
    });

    it('has a standard die starting at d20', function () {
        expect(standardDie.getText()).toBe('20');
    });

    it('allows standard quantity of 1', function () {
        expect(standardRollButton.isEnabled()).toBeTruthy();
    });

    it('allows standard quantities greater than 1', function () {
        commonTestFunctions.sendInput(standardQuantity, 2);
        expect(standardRollButton.isEnabled()).toBeTruthy();
    });

    it('does not allow decimal standard quantities', function () {
        commonTestFunctions.sendInput(standardQuantity, 1.5);
        expect(standardRollButton.isEnabled()).toBeFalsy();
    });

    it('does not allow standard quantity of 0', function () {
        commonTestFunctions.sendInput(standardQuantity, 0);
        expect(standardRollButton.isEnabled()).toBeFalsy();
    });

    it('does not allow negative standard quantities', function () {
        commonTestFunctions.sendInput(standardQuantity, -1);
        expect(standardRollButton.isEnabled()).toBeFalsy();
    });

    it('does not allow non-numeric standard quantites', function () {
        commonTestFunctions.sendInput(standardQuantity, 'two');
        expect(standardRollButton.isEnabled()).toBeFalsy();
    });

    it('does not allow empty standard quantites for d2', function () {
        commonTestFunctions.sendInput(standardQuantity, '');
        expect(standardRollButton.isEnabled()).toBeFalsy();
    });

    it('increments standard quantity by 1 when up is pressed', function () {
        commonTestFunctions.sendInput(standardQuantity, 3);
        standardQuantity.sendKeys(protractor.Key.UP);
        expect(standardQuantity.getAttribute('value')).toBe('4');
    });

    it('decrements standard quantity by 1 when down is pressed', function () {
        commonTestFunctions.sendInput(standardQuantity, 3);
        standardQuantity.sendKeys(protractor.Key.DOWN);
        expect(standardQuantity.getAttribute('value')).toBe('2');
    });

    it('cannot decrement standard quantity below 1', function () {
        commonTestFunctions.sendInput(standardQuantity, 1);
        standardQuantity.sendKeys(protractor.Key.DOWN);
        expect(standardQuantity.getAttribute('value')).toBe('1');
    });

    it('rolls 3d2', function () {
        commonTestFunctions.sendInput(standardQuantity, 3);
        commonTestFunctions.selectItemInDropdown(standardDice, '2');
        commonTestFunctions.clickWhenReadyAndWaitForResolution(standardRollButton, rollingSection);

        expect(roll.getText()).toBeGreaterThan(2);
    });

    it('rolls 4d3', function () {
        commonTestFunctions.sendInput(standardQuantity, 4);
        commonTestFunctions.selectItemInDropdown(standardDice, '3');
        commonTestFunctions.clickWhenReadyAndWaitForResolution(standardRollButton, rollingSection);

        expect(roll.getText()).toBeGreaterThan(3);
    });

    it('rolls 5d4', function () {
        commonTestFunctions.sendInput(standardQuantity, 5);
        commonTestFunctions.selectItemInDropdown(standardDice, '4');
        commonTestFunctions.clickWhenReadyAndWaitForResolution(standardRollButton, rollingSection);

        expect(roll.getText()).toBeGreaterThan(4);
    });

    it('rolls 7d6', function () {
        commonTestFunctions.sendInput(standardQuantity, 7);
        commonTestFunctions.selectItemInDropdown(standardDice, '6');
        commonTestFunctions.clickWhenReadyAndWaitForResolution(standardRollButton, rollingSection);

        expect(roll.getText()).toBeGreaterThan(6);
    });

    it('rolls 9d8', function () {
        commonTestFunctions.sendInput(standardQuantity, 9);
        commonTestFunctions.selectItemInDropdown(standardDice, '8');
        commonTestFunctions.clickWhenReadyAndWaitForResolution(standardRollButton, rollingSection);

        expect(roll.getText()).toBeGreaterThan(8);
    });

    it('rolls 11d10', function () {
        commonTestFunctions.sendInput(standardQuantity, 11);
        commonTestFunctions.selectItemInDropdown(standardDice, '10');
        commonTestFunctions.clickWhenReadyAndWaitForResolution(standardRollButton, rollingSection);

        expect(roll.getText()).toBeGreaterThan(10);
    });

    it('rolls 13d12', function () {
        commonTestFunctions.sendInput(standardQuantity, 13);
        commonTestFunctions.selectItemInDropdown(standardDice, '12');
        commonTestFunctions.clickWhenReadyAndWaitForResolution(standardRollButton, rollingSection);

        expect(roll.getText()).toBeGreaterThan(12);
    });

    it('rolls 21d20', function () {
        commonTestFunctions.sendInput(standardQuantity, 21);
        commonTestFunctions.selectItemInDropdown(standardDice, '20');
        commonTestFunctions.clickWhenReadyAndWaitForResolution(standardRollButton, rollingSection);

        expect(roll.getText()).toBeGreaterThan(20);
    });

    it('rolls 10d100', function () {
        commonTestFunctions.sendInput(standardQuantity, 10);
        commonTestFunctions.selectItemInDropdown(standardDice, 'Percentile');
        commonTestFunctions.clickWhenReadyAndWaitForResolution(standardRollButton, rollingSection);

        expect(roll.getText()).toBeGreaterThan(100);
    });

    it('rolls a custom roll', function () {
        commonTestFunctions.clickWhenReadyAndWaitForResolution(customRollButton, rollingSection);
        expect(roll.getText()).toBeGreaterThan(0);
    });

    it('rolls 6d5', function () {
        commonTestFunctions.sendInput(customQuantity, 6);
        commonTestFunctions.sendInput(customDie, 5);
        commonTestFunctions.clickWhenReadyAndWaitForResolution(customRollButton, rollingSection);

        expect(roll.getText()).toBeGreaterThan(5);
    });

    it('allows custom quantity of 1', function () {
        commonTestFunctions.sendInput(customQuantity, 1);
        expect(customRollButton.isEnabled()).toBeTruthy();
    });

    it('allows custom quantities greater than 1', function () {
        commonTestFunctions.sendInput(customQuantity, 2);
        expect(customRollButton.isEnabled()).toBeTruthy();
    });

    it('does not allow decimal quantities for custom', function () {
        commonTestFunctions.sendInput(customQuantity, 1.5);
        expect(customRollButton.isEnabled()).toBeFalsy();
    });

    it('does not allow quantity of 0 for custom', function () {
        commonTestFunctions.sendInput(customQuantity, 0);
        expect(customRollButton.isEnabled()).toBeFalsy();
    });

    it('does not allow negative quantities for custom', function () {
        commonTestFunctions.sendInput(customQuantity, -1);
        expect(customRollButton.isEnabled()).toBeFalsy();
    });

    it('does not allow non-numeric quantites for custom', function () {
        commonTestFunctions.sendInput(customQuantity, 'two');
        expect(customRollButton.isEnabled()).toBeFalsy();
    });

    it('does not allow empty quantites for custom', function () {
        commonTestFunctions.sendInput(customQuantity, '');
        expect(customRollButton.isEnabled()).toBeFalsy();
    });

    it('increments custom quantity by 1 when up is pressed', function () {
        commonTestFunctions.sendInput(customQuantity, 3);
        customQuantity.sendKeys(protractor.Key.UP);
        expect(customQuantity.getAttribute('value')).toBe('4');
    });

    it('decrements custom quantity by 1 when down is pressed', function () {
        commonTestFunctions.sendInput(customQuantity, 3);
        customQuantity.sendKeys(protractor.Key.DOWN);
        expect(customQuantity.getAttribute('value')).toBe('2');
    });

    it('cannot key down custom quantity below 1', function () {
        commonTestFunctions.sendInput(customQuantity, 1);
        customQuantity.sendKeys(protractor.Key.DOWN);
        expect(customQuantity.getAttribute('value')).toBe('1');
    });

    it('allows die of 1 for custom', function () {
        commonTestFunctions.sendInput(customDie, 1);
        expect(customRollButton.isEnabled()).toBeTruthy();
    });

    it('allows die greater than 1 for custom', function () {
        commonTestFunctions.sendInput(customDie, 2);
        expect(customRollButton.isEnabled()).toBeTruthy();
    });

    it('does not allow decimal die for custom', function () {
        commonTestFunctions.sendInput(customDie, 1.5);
        expect(customRollButton.isEnabled()).toBeFalsy();
    });

    it('does not allow die of 0 for custom', function () {
        commonTestFunctions.sendInput(customDie, 0);
        expect(customRollButton.isEnabled()).toBeFalsy();
    });

    it('does not allow negative die for custom', function () {
        commonTestFunctions.sendInput(customDie, -1);
        expect(customRollButton.isEnabled()).toBeFalsy();
    });

    it('does not allow non-numeric die for custom', function () {
        commonTestFunctions.sendInput(customDie, 'two');
        expect(customRollButton.isEnabled()).toBeFalsy();
    });

    it('does not allow empty die for custom', function () {
        commonTestFunctions.sendInput(customDie, '');
        expect(customRollButton.isEnabled()).toBeFalsy();
    });

    it('increments custom die by 1 when up is pressed', function () {
        commonTestFunctions.sendInput(customDie, 3);
        customDie.sendKeys(protractor.Key.UP);
        expect(customDie.getAttribute('value')).toBe('4');
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

    it('formats the roll as a number', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Dice as vm"]');
            var vm = controllerElement.controller();
            vm.roll = 9266;

            controllerElement.scope().$apply();
        }).then(function () {
            expect(roll.getText()).toBe('9,266');
        });
    });

    it('notifies user while rolling', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Dice as vm"]');
            var vm = controllerElement.controller();
            vm.rolling = true;

            controllerElement.scope().$apply();
        }).then(function () {
            expect(customRollButton.isEnabled()).toBeFalsy();
            expect(standardRollButton.isEnabled()).toBeFalsy();
            expect(roll.isDisplayed()).toBeFalsy();

            expect(rollingSection.isDisplayed()).toBeTruthy();
            expect(rollingSection.getText()).toBe('Rolling...');
        });
    });
});