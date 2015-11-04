'use strict';

var CommonTestFunctions = require('./../commonTestFunctions.js');

describe('Roll Page', function () {
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
        browser.get(browser.baseUrl + '/Roll');
    });

    afterEach(function () {
        browser.manage().logs().get('browser').then(commonTestFunctions.assertNoErrors);
    });

    it('should have a header', function () {
        expect(element(by.css('h1')).getText()).toBe('RollGen');
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

    it('rolls a standard die', function () {
        commonTestFunctions.clickWhenReadyAndWaitForResolution(standardRollButton, rollingSection);
        expect(roll.getText()).toBeGreaterThan(0);
    });

    it('rolls a custom die', function () {
        commonTestFunctions.clickWhenReadyAndWaitForResolution(customRollButton, rollingSection);
        expect(roll.getText()).toBe('1');
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

    it('does not allow empty standard quantites', function () {
        commonTestFunctions.sendInput(standardQuantity, '');
        expect(standardRollButton.isEnabled()).toBeFalsy();
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

    it('formats the roll as a number', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Roll as vm"]');
            var vm = controllerElement.controller();
            vm.roll = 9266;

            controllerElement.scope().$apply();
        }).then(function () {
            expect(roll.getText()).toBe('9,266');
        });
    });

    it('notifies user while rolling', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Roll as vm"]');
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