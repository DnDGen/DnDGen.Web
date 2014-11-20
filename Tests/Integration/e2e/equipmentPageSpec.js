describe('Equipment Page', function () {
    browser.ignoreSynchronization = true;

    var levels = {
        treasure: element(by.model('selectedLevels.treasure')),
        coin: element(by.model('selectedLevels.coin')),
        goods: element(by.model('selectedLevels.goods')),
        items: element(by.model('selectedLevels.items'))
    };

    var powers = {
        armor: element(by.model('selectedPowers.armor')).$('option:checked'),
        potion: element(by.model('selectedPowers.potion')).$('option:checked'),
        ring: element(by.model('selectedPowers.ring')).$('option:checked'),
        rod: element(by.model('selectedPowers.rod')).$('option:checked'),
        scroll: element(by.model('selectedPowers.scroll')).$('option:checked'),
        staff: element(by.model('selectedPowers.staff')).$('option:checked'),
        wand: element(by.model('selectedPowers.wand')).$('option:checked'),
        weapon: element(by.model('selectedPowers.weapon')).$('option:checked'),
        wondrousItem: element(by.model('selectedPowers.wondrousItem')).$('option:checked')
    };

    var buttons = {
        treasure: element(by.id('treasureButton')),
        coin: element(by.id('coinButton')),
        goods: element(by.id('goodsButton')),
        items: element(by.id('itemsButton')),
        alchemicalItem: element(by.id('alchemicalItemButton')),
        armor: element(by.id('armorButton')),
        potion: element(by.id('potionButton')),
        ring: element(by.id('ringButton')),
        rod: element(by.id('rodButton')),
        scroll: element(by.id('scrollButton')),
        staff: element(by.id('staffButton')),
        tool: element(by.id('toolButton')),
        wand: element(by.id('wandButton')),
        weapon: element(by.id('weaponButton')),
        wondrousItem: element(by.id('wondrousItemButton'))
    };

    var treasure = {
        coin: element(by.binding('treasure.Coin.Currency')),
        goods: element.all(by.repeater('good in treasure.Goods')),
        items: element.all(by.repeater('item in treasure.Items'))
    };

    beforeEach(function () {
        browser.get(browser.baseUrl + '/Equipment');
    });

    //page load tests

    it('should have a title', function () {
        expect(browser.driver.getTitle()).toEqual('DNDGen');
    });

    it('should set levels to 1', function () {
        expect(levels.treasure.getAttribute('value')).toBe('1');
        expect(levels.coin.getAttribute('value')).toBe('1');
        expect(levels.goods.getAttribute('value')).toBe('1');
        expect(levels.items.getAttribute('value')).toBe('1');
    });

    it('should set powers to first option', function () {
        expect(powers.armor.getText()).toBe('Mundane');
        expect(powers.potion.getText()).toBe('Minor');
        expect(powers.ring.getText()).toBe('Minor');
        expect(powers.rod.getText()).toBe('Medium');
        expect(powers.scroll.getText()).toBe('Minor');
        expect(powers.staff.getText()).toBe('Medium');
        expect(powers.wand.getText()).toBe('Minor');
        expect(powers.weapon.getText()).toBe('Mundane');
        expect(powers.wondrousItem.getText()).toBe('Minor');
    });

    it('should have no treasure', function () {
        expect(treasure.coin.getText()).toBe('');
        expect(treasure.goods.count()).toBe(0);
        expect(treasure.items.count()).toBe(0);
    });

    it('should not show coin if none', function () {
        expect(treasure.coin.isDisplayed()).toBeFalsy();
    });

    it('should not show goods if none', function () {
        expect(element(by.id('goodsDiv')).isDisplayed()).toBeFalsy();
    });

    it('should not show items if none', function () {
        expect(element(by.id('itemsDiv')).isDisplayed()).toBeFalsy();
    });

    //treaure tests

    it('should generate treasure', function () {
        sendInput(levels.treasure, 20);

        buttons.treasure.click();
        var coinGenerated = treasure.coin.getText().length > 0;
        var goodsGenerated = treasure.goods.count() > 0;
        var itemsGenerated = treasure.items.count() > 0;
        var treasureGenerated = coinGenerated || goodsGenerated || itemsGenerated;

        expect(treasureGenerated).toBeTruthy();
    });

    function sendInput(input, keys) {
        input.clear();
        input.sendKeys(keys);
    }

    it('should re-generate treasure', function () {
        sendInput(levels.treasure, 20);

        buttons.treasure.click();
        var coin = treasure.coin.getText();
        var goods = treasure.goods.map(function (element, index) {
            return { text: element.getText() };
        });

        var items = treasure.items.map(function (element, index) {
            return { text: element.element(by.binding('item.Name')).getText() };
        });

        buttons.treasure.click();
        var coinDifferent = coin != treasure.coin.getText();
        var goodsDifferent = goods != treasure.goods.map(function (element, index) {
            return { text: element.getText() };
        });

        var itemsDifferent = items != treasure.items.map(function (element, index) {
            return { text: element.element(by.binding('item.Name')).getText() };
        });

        var treasureDifferent = coinDifferent || goodsDifferent || itemsDifferent;
        expect(treasureDifferent).toBeTruthy();
    });

    it('should show coin', function () {
        sendInput(levels.treasure, 20);
        buttons.treasure.click();
        expect(treasure.coin.isDisplayed()).toBeTruthy();
    });

    it('should show goods', function () {
        sendInput(levels.treasure, 20);
        buttons.treasure.click();
        expect(element(by.id('goodsDiv')).isDisplayed()).toBeTruthy();
    });

    it('should show items', function () {
        sendInput(levels.treasure, 20);
        buttons.treasure.click();
        expect(element(by.id('itemsDiv')).isDisplayed()).toBeTruthy();
    });

    it('should allow level between 1 and 20', function () {
        for (var i = 20; i > 0; i--) {
            sendInput(levels.treasure, i);
            expect(buttons.treasure.isEnabled()).toBeTruthy();
        }
    });

    it('should not allow decimal levels', function () {
        sendInput(levels.treasure, 1.5);
        expect(buttons.treasure.isEnabled()).toBeFalsy();
    });

    it('should not allow level of 0', function () {
        sendInput(levels.treasure, 0);
        expect(buttons.treasure.isEnabled()).toBeFalsy();
    });

    it('should not allow level less than 0', function () {
        sendInput(levels.treasure, -1);
        expect(buttons.treasure.isEnabled()).toBeFalsy();
    });

    it('should not allow non-numeric level', function () {
        sendInput(levels.treasure, 'two');
        expect(buttons.treasure.isEnabled()).toBeFalsy();
    });

    it('should not allow level greater than 20', function () {
        sendInput(levels.treasure, 21);
        expect(buttons.treasure.isEnabled()).toBeFalsy();
    });

    it('should format coin', function () {
        sendInput(levels.treasure, 20);
        buttons.treasure.click();
        expect(treasure.coin.getText()).toMatch(/(\d|,)+ [a-zA-z]+/);
    });

    it('should format goods', function () {
        sendInput(levels.treasure, 20);
        buttons.treasure.click();

        treasure.goods.each(function (element) {
            expect(element.getText()).toMatch(/.* \((\d|,)+gp\)/);
        });
    });
});