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
        expect(treasure.goods.length).toBe(0);
        expect(treasure.items.length).toBe(0);
    });
});