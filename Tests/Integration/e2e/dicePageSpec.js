describe('Dice Page', function () {
    browser.ignoreSynchronization = true;
    var rolls = {
        d2: element(by.binding('rolls.d2')),
        d3: element(by.binding('rolls.d3')),
        d4: element(by.binding('rolls.d4')),
        d6: element(by.binding('rolls.d6')),
        d8: element(by.binding('rolls.d8')),
        d10: element(by.binding('rolls.d10')),
        d12: element(by.binding('rolls.d12')),
        d20: element(by.binding('rolls.d20')),
        percentile: element(by.binding('rolls.percentile')),
        custom: element(by.binding('rolls.custom'))
    };

    var quantities = {
        d2: element(by.model('quantities.d2')),
        d3: element(by.model('quantities.d3')),
        d4: element(by.model('quantities.d4')),
        d6: element(by.model('quantities.d6')),
        d8: element(by.model('quantities.d8')),
        d10: element(by.model('quantities.d10')),
        d12: element(by.model('quantities.d12')),
        d20: element(by.model('quantities.d20')),
        percentile: element(by.model('quantities.percentile')),
        custom: element(by.model('quantities.custom'))
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

    var customDie = element(by.model('customDie'));

    beforeEach(function () {
        browser.get(browser.baseUrl + '/Dice');
    });

    //page load tests

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

    //d2 tests

    it('should roll a d2', function () {
        buttons.d2.click();
        expect(rolls.d2.getText()).toBeGreaterThan(0);
    });

    it('should only roll a d2', function () {
        buttons.d2.click();

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
        setQuantity(quantities.d2, 3);
        buttons.d2.click();
        expect(rolls.d2.getText()).toBeGreaterThan(2);
    });

    function setQuantity(input, quantity) {
        input.clear();
        input.sendKeys(quantity);
    }

    it('should format the roll of d2', function () {
        setQuantity(quantities.d2, 1000);
        buttons.d2.click();
        expect(rolls.d2.getText()).toContain(',');
    });

    it('should re-roll 9266d2', function () {
        setQuantity(quantities.d2, 9266);

        buttons.d2.click();
        var first = rolls.d2.getText();

        buttons.d2.click();
        var second = rolls.d2.getText();

        expect(first).not.toEqual(second);
    });

    it('should allow quantity of 1 for d2', function () {
        expect(buttons.d2.isEnabled()).toEqual(true);
    });

    it('should allow quantities greater than 1 for d2', function () {
        setQuantity(quantities.d2, 2);
        expect(buttons.d2.isEnabled()).toEqual(true);
    });

    it('should not allow quantity of 0 for d2', function () {
        setQuantity(quantities.d2, 0);
        expect(buttons.d2.isEnabled()).toEqual(false);
    });

    it('should not allow negative quantities for d2', function () {
        setQuantity(quantities.d2, -1);
        expect(buttons.d2.isEnabled()).toEqual(false);
    });

    it('should not allow non-numeric quantites for d2', function () {
        setQuantity(quantities.d2, 'two');
        expect(buttons.d2.isEnabled()).toEqual(false);
    });

    //d3 tests

    it('should roll a d3', function () {
        buttons.d3.click();
        expect(rolls.d3.getText()).toBeGreaterThan(0);
    });

    it('should only roll a d3', function () {
        buttons.d3.click();

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
        setQuantity(quantities.d3, 4);
        buttons.d3.click();
        expect(rolls.d3.getText()).toBeGreaterThan(3);
    });

    it('should format the roll of d3', function () {
        setQuantity(quantities.d3, 1000);
        buttons.d3.click();
        expect(rolls.d3.getText()).toContain(',');
    });

    it('should re-roll 9266d3', function () {
        setQuantity(quantities.d3, 9266);

        buttons.d3.click();
        var first = rolls.d3.getText();

        buttons.d3.click();
        var second = rolls.d3.getText();

        expect(first).not.toEqual(second);
    });

    it('should allow quantity of 1 for d3', function () {
        expect(buttons.d3.isEnabled()).toEqual(true);
    });

    it('should allow quantities greater than 1 for d3', function () {
        setQuantity(quantities.d3, 2);
        expect(buttons.d3.isEnabled()).toEqual(true);
    });

    it('should not allow quantity of 0 for d3', function () {
        setQuantity(quantities.d3, 0);
        expect(buttons.d3.isEnabled()).toEqual(false);
    });

    it('should not allow negative quantities for d3', function () {
        setQuantity(quantities.d3, -1);
        expect(buttons.d3.isEnabled()).toEqual(false);
    });

    it('should not allow non-numeric quantites for d3', function () {
        setQuantity(quantities.d3, 'two');
        expect(buttons.d3.isEnabled()).toEqual(false);
    });

    //d4 tests

    it('should roll a d4', function () {
        buttons.d4.click();
        expect(rolls.d4.getText()).toBeGreaterThan(0);
    });

    it('should only roll a d4', function () {
        buttons.d4.click();

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
        setQuantity(quantities.d4, 5);
        buttons.d4.click();
        expect(rolls.d4.getText()).toBeGreaterThan(4);
    });

    it('should format the roll of d4', function () {
        setQuantity(quantities.d4, 1000);
        buttons.d4.click();
        expect(rolls.d4.getText()).toContain(',');
    });

    it('should re-roll 9266d4', function () {
        setQuantity(quantities.d4, 9266);

        buttons.d4.click();
        var first = rolls.d4.getText();

        buttons.d4.click();
        var second = rolls.d4.getText();

        expect(first).not.toEqual(second);
    });

    it('should allow quantity of 1 for d4', function () {
        expect(buttons.d4.isEnabled()).toEqual(true);
    });

    it('should allow quantities greater than 1 for d4', function () {
        setQuantity(quantities.d4, 2);
        expect(buttons.d4.isEnabled()).toEqual(true);
    });

    it('should not allow quantity of 0 for d4', function () {
        setQuantity(quantities.d4, 0);
        expect(buttons.d4.isEnabled()).toEqual(false);
    });

    it('should not allow negative quantities for d4', function () {
        setQuantity(quantities.d4, -1);
        expect(buttons.d4.isEnabled()).toEqual(false);
    });

    it('should not allow non-numeric quantites for d4', function () {
        setQuantity(quantities.d4, 'two');
        expect(buttons.d4.isEnabled()).toEqual(false);
    });

    //d6 tests

    it('should roll a d6', function () {
        buttons.d6.click();
        expect(rolls.d6.getText()).toBeGreaterThan(0);
    });

    it('should only roll a d6', function () {
        buttons.d6.click();

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
        setQuantity(quantities.d6, 7);
        buttons.d6.click();
        expect(rolls.d6.getText()).toBeGreaterThan(6);
    });

    it('should format the roll of d6', function () {
        setQuantity(quantities.d6, 1000);
        buttons.d6.click();
        expect(rolls.d6.getText()).toContain(',');
    });

    it('should re-roll 9266d6', function () {
        setQuantity(quantities.d6, 9266);

        buttons.d6.click();
        var first = rolls.d6.getText();

        buttons.d6.click();
        var second = rolls.d6.getText();

        expect(first).not.toEqual(second);
    });

    it('should allow quantity of 1 for d6', function () {
        expect(buttons.d6.isEnabled()).toEqual(true);
    });

    it('should allow quantities greater than 1 for d6', function () {
        setQuantity(quantities.d6, 2);
        expect(buttons.d6.isEnabled()).toEqual(true);
    });

    it('should not allow quantity of 0 for d6', function () {
        setQuantity(quantities.d6, 0);
        expect(buttons.d6.isEnabled()).toEqual(false);
    });

    it('should not allow negative quantities for d6', function () {
        setQuantity(quantities.d6, -1);
        expect(buttons.d6.isEnabled()).toEqual(false);
    });

    it('should not allow non-numeric quantites for d6', function () {
        setQuantity(quantities.d6, 'two');
        expect(buttons.d6.isEnabled()).toEqual(false);
    });

    //d8 tests

    it('should roll a d8', function () {
        buttons.d8.click();
        expect(rolls.d8.getText()).toBeGreaterThan(0);
    });

    it('should only roll a d8', function () {
        buttons.d8.click();

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
        setQuantity(quantities.d8, 9);
        buttons.d8.click();
        expect(rolls.d8.getText()).toBeGreaterThan(8);
    });

    it('should format the roll of d8', function () {
        setQuantity(quantities.d8, 1000);
        buttons.d8.click();
        expect(rolls.d8.getText()).toContain(',');
    });

    it('should re-roll 9266d8', function () {
        setQuantity(quantities.d8, 9266);

        buttons.d8.click();
        var first = rolls.d8.getText();

        buttons.d8.click();
        var second = rolls.d8.getText();

        expect(first).not.toEqual(second);
    });

    it('should allow quantity of 1 for d8', function () {
        expect(buttons.d8.isEnabled()).toEqual(true);
    });

    it('should allow quantities greater than 1 for d8', function () {
        setQuantity(quantities.d8, 2);
        expect(buttons.d8.isEnabled()).toEqual(true);
    });

    it('should not allow quantity of 0 for d8', function () {
        setQuantity(quantities.d8, 0);
        expect(buttons.d8.isEnabled()).toEqual(false);
    });

    it('should not allow negative quantities for d8', function () {
        setQuantity(quantities.d8, -1);
        expect(buttons.d8.isEnabled()).toEqual(false);
    });

    it('should not allow non-numeric quantites for d8', function () {
        setQuantity(quantities.d8, 'two');
        expect(buttons.d8.isEnabled()).toEqual(false);
    });

    //d10 tests

    it('should roll a d10', function () {
        buttons.d10.click();
        expect(rolls.d10.getText()).toBeGreaterThan(0);
    });

    it('should only roll a d10', function () {
        buttons.d10.click();

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
        setQuantity(quantities.d10, 11);
        buttons.d10.click();
        expect(rolls.d10.getText()).toBeGreaterThan(10);
    });

    it('should format the roll of d10', function () {
        setQuantity(quantities.d10, 1000);
        buttons.d10.click();
        expect(rolls.d10.getText()).toContain(',');
    });

    it('should re-roll 9266d10', function () {
        setQuantity(quantities.d10, 9266);

        buttons.d10.click();
        var first = rolls.d10.getText();

        buttons.d10.click();
        var second = rolls.d10.getText();

        expect(first).not.toEqual(second);
    });

    it('should allow quantity of 1 for d10', function () {
        expect(buttons.d10.isEnabled()).toEqual(true);
    });

    it('should allow quantities greater than 1 for d10', function () {
        setQuantity(quantities.d10, 2);
        expect(buttons.d10.isEnabled()).toEqual(true);
    });

    it('should not allow quantity of 0 for d10', function () {
        setQuantity(quantities.d10, 0);
        expect(buttons.d10.isEnabled()).toEqual(false);
    });

    it('should not allow negative quantities for d10', function () {
        setQuantity(quantities.d10, -1);
        expect(buttons.d10.isEnabled()).toEqual(false);
    });

    it('should not allow non-numeric quantites for d10', function () {
        setQuantity(quantities.d10, 'two');
        expect(buttons.d10.isEnabled()).toEqual(false);
    });

    //d12 tests

    it('should roll a d12', function () {
        buttons.d12.click();
        expect(rolls.d12.getText()).toBeGreaterThan(0);
    });

    it('should only roll a d12', function () {
        buttons.d12.click();

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
        setQuantity(quantities.d12, 13);
        buttons.d12.click();
        expect(rolls.d12.getText()).toBeGreaterThan(12);
    });

    it('should format the roll of d12', function () {
        setQuantity(quantities.d12, 1000);
        buttons.d12.click();
        expect(rolls.d12.getText()).toContain(',');
    });

    it('should re-roll 9266d12', function () {
        setQuantity(quantities.d12, 9266);

        buttons.d12.click();
        var first = rolls.d12.getText();

        buttons.d12.click();
        var second = rolls.d12.getText();

        expect(first).not.toEqual(second);
    });

    it('should allow quantity of 1 for d12', function () {
        expect(buttons.d12.isEnabled()).toEqual(true);
    });

    it('should allow quantities greater than 1 for d12', function () {
        setQuantity(quantities.d12, 2);
        expect(buttons.d12.isEnabled()).toEqual(true);
    });

    it('should not allow quantity of 0 for d12', function () {
        setQuantity(quantities.d12, 0);
        expect(buttons.d12.isEnabled()).toEqual(false);
    });

    it('should not allow negative quantities for d12', function () {
        setQuantity(quantities.d12, -1);
        expect(buttons.d12.isEnabled()).toEqual(false);
    });

    it('should not allow non-numeric quantites for d12', function () {
        setQuantity(quantities.d12, 'two');
        expect(buttons.d12.isEnabled()).toEqual(false);
    });

    //d20 tests

    it('should roll a d20', function () {
        buttons.d20.click();
        expect(rolls.d20.getText()).toBeGreaterThan(0);
    });

    it('should only roll a d20', function () {
        buttons.d20.click();

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
        setQuantity(quantities.d20, 21);
        buttons.d20.click();
        expect(rolls.d20.getText()).toBeGreaterThan(20);
    });

    it('should format the roll of d20', function () {
        setQuantity(quantities.d20, 1000);
        buttons.d20.click();
        expect(rolls.d20.getText()).toContain(',');
    });

    it('should re-roll 9266d20', function () {
        setQuantity(quantities.d20, 9266);

        buttons.d20.click();
        var first = rolls.d20.getText();

        buttons.d20.click();
        var second = rolls.d20.getText();

        expect(first).not.toEqual(second);
    });

    it('should allow quantity of 1 for d20', function () {
        expect(buttons.d20.isEnabled()).toEqual(true);
    });

    it('should allow quantities greater than 1 for d20', function () {
        setQuantity(quantities.d20, 2);
        expect(buttons.d20.isEnabled()).toEqual(true);
    });

    it('should not allow quantity of 0 for d20', function () {
        setQuantity(quantities.d20, 0);
        expect(buttons.d20.isEnabled()).toEqual(false);
    });

    it('should not allow negative quantities for d20', function () {
        setQuantity(quantities.d20, -1);
        expect(buttons.d20.isEnabled()).toEqual(false);
    });

    it('should not allow non-numeric quantites for d20', function () {
        setQuantity(quantities.d20, 'two');
        expect(buttons.d20.isEnabled()).toEqual(false);
    });

    //percentile tests

    it('should roll a percentile', function () {
        buttons.percentile.click();
        expect(rolls.percentile.getText()).toBeGreaterThan(0);
    });

    it('should only roll a percentile', function () {
        buttons.percentile.click();

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
        setQuantity(quantities.percentile, 101);
        buttons.percentile.click();

        //HACK: This verifies that it is at least 1000, when the min is 100
        //No good way I have found so far to extract the formatted number from the element
        //to do an actual comparison
        expect(rolls.percentile.getText()).toContain(',');
    });

    it('should format the roll of percentile', function () {
        setQuantity(quantities.percentile, 1000);
        buttons.percentile.click();
        expect(rolls.percentile.getText()).toContain(',');
    });

    it('should re-roll 9266d100', function () {
        setQuantity(quantities.percentile, 9266);

        buttons.percentile.click();
        var first = rolls.percentile.getText();

        buttons.percentile.click();
        var second = rolls.percentile.getText();

        expect(first).not.toEqual(second);
    });

    it('should allow quantity of 1 for percentile', function () {
        expect(buttons.percentile.isEnabled()).toEqual(true);
    });

    it('should allow quantities greater than 1 for percentile', function () {
        setQuantity(quantities.percentile, 2);
        expect(buttons.percentile.isEnabled()).toEqual(true);
    });

    it('should not allow quantity of 0 for percentile', function () {
        setQuantity(quantities.percentile, 0);
        expect(buttons.percentile.isEnabled()).toEqual(false);
    });

    it('should not allow negative quantities for percentile', function () {
        setQuantity(quantities.percentile, -1);
        expect(buttons.percentile.isEnabled()).toEqual(false);
    });

    it('should not allow non-numeric quantites for percentile', function () {
        setQuantity(quantities.percentile, 'two');
        expect(buttons.percentile.isEnabled()).toEqual(false);
    });

    //custom tests

    it('should roll a custom roll', function () {
        buttons.custom.click();
        expect(rolls.custom.getText()).toBeGreaterThan(0);
    });

    it('should only roll a custom roll', function () {
        buttons.custom.click();

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
        setQuantity(quantities.custom, 6);
        setQuantity(customDie, 5);

        buttons.custom.click();
        expect(rolls.custom.getText()).toBeGreaterThan(5);
    });

    it('should format the custom roll', function () {
        setQuantity(quantities.custom, 1000);
        buttons.custom.click();
        expect(rolls.custom.getText()).toContain(',');
    });

    it('should re-roll 9266d5', function () {
        setQuantity(quantities.custom, 9266);
        setQuantity(customDie, 5);

        buttons.custom.click();
        var first = rolls.custom.getText();

        buttons.custom.click();
        var second = rolls.custom.getText();

        expect(first).not.toEqual(second);
    });

    it('should allow quantity of 1 for custom', function () {
        expect(buttons.custom.isEnabled()).toEqual(true);
    });

    it('should allow quantities greater than 1 for custom', function () {
        setQuantity(quantities.custom, 2);
        expect(buttons.custom.isEnabled()).toEqual(true);
    });

    it('should not allow quantity of 0 for custom', function () {
        setQuantity(quantities.custom, 0);
        expect(buttons.custom.isEnabled()).toEqual(false);
    });

    it('should not allow negative quantities for custom', function () {
        setQuantity(quantities.custom, -1);
        expect(buttons.custom.isEnabled()).toEqual(false);
    });

    it('should not allow non-numeric quantites for custom', function () {
        setQuantity(quantities.custom, 'two');
        expect(buttons.custom.isEnabled()).toEqual(false);
    });

    it('should allow die of 1 for custom', function () {
        expect(buttons.custom.isEnabled()).toEqual(true);
    });

    it('should allow die greater than 1 for custom', function () {
        setQuantity(customDie, 2);
        expect(buttons.custom.isEnabled()).toEqual(true);
    });

    it('should not allow die of 0 for custom', function () {
        setQuantity(customDie, 0);
        expect(buttons.custom.isEnabled()).toEqual(false);
    });

    it('should not allow negative die for custom', function () {
        setQuantity(customDie, -1);
        expect(buttons.custom.isEnabled()).toEqual(false);
    });

    it('should not allow non-numeric die for custom', function () {
        setQuantity(customDie, 'two');
        expect(buttons.custom.isEnabled()).toEqual(false);
    });
});