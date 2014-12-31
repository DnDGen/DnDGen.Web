'use strict';

var CommonTestFunctions = require('./Common/commonTestFunctions.js');

describe('Equipment Page', function () {
    browser.ignoreSynchronization = true;
    var commonTestFunctions = new CommonTestFunctions();

    var levels = {
        treasure: element(by.model('vm.selectedLevels.treasure')),
        coin: element(by.model('vm.selectedLevels.coin')),
        goods: element(by.model('vm.selectedLevels.goods')),
        items: element(by.model('vm.selectedLevels.items'))
    };

    var powers = {
        armor: element(by.model('vm.selectedPowers.armor')),
        potion: element(by.model('vm.selectedPowers.potion')),
        ring: element(by.model('vm.selectedPowers.ring')),
        rod: element(by.model('vm.selectedPowers.rod')),
        scroll: element(by.model('vm.selectedPowers.scroll')),
        staff: element(by.model('vm.selectedPowers.staff')),
        wand: element(by.model('vm.selectedPowers.wand')),
        weapon: element(by.model('vm.selectedPowers.weapon')),
        wondrousItem: element(by.model('vm.selectedPowers.wondrousItem'))
    };

    var selectedPowers = {
        armor: powers.armor.$('option:checked'),
        potion: powers.potion.$('option:checked'),
        ring: powers.ring.$('option:checked'),
        rod: powers.rod.$('option:checked'),
        scroll: powers.scroll.$('option:checked'),
        staff: powers.staff.$('option:checked'),
        wand: powers.wand.$('option:checked'),
        weapon: powers.weapon.$('option:checked'),
        wondrousItem: powers.wondrousItem.$('option:checked')
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
        coin: element(by.binding('vm.treasure.Coin.Currency')),
        goods: element.all(by.repeater('good in vm.treasure.Goods')),
        items: element.all(by.repeater('item in vm.treasure.Items')),
        goodsWrapper: element(by.id('goodsWrapper')),
        itemsWrapper: element(by.id('itemsWrapper')),
        noTreasure: element(by.id('noTreasure')),
        itemProperties: {
            name: element(by.binding('item.Name')),
            contents: element.all(by.repeater('content in item.Contents')),
            charges: element(by.binding('item.Magic.Charges')),
            traits: element.all(by.repeater('trait in item.Traits'))
        }
    };

    beforeEach(function () {
        browser.get(browser.baseUrl + '/Equipment');
    });

    //#region page load tests

    it('should have a title', function () {
        expect(browser.driver.getTitle()).toEqual('DNDGen');
    });

    it('should have a header', function () {
        expect(element(by.css('h1')).getText()).toBe('EquipmentGen');
    });

    it('should set levels to 1', function () {
        expect(levels.treasure.getAttribute('value')).toBe('1');
        expect(levels.coin.getAttribute('value')).toBe('1');
        expect(levels.goods.getAttribute('value')).toBe('1');
        expect(levels.items.getAttribute('value')).toBe('1');
    });

    it('should set powers to first option', function () {
        expect(selectedPowers.armor.getText()).toBe('Mundane');
        expect(selectedPowers.potion.getText()).toBe('Minor');
        expect(selectedPowers.ring.getText()).toBe('Minor');
        expect(selectedPowers.rod.getText()).toBe('Medium');
        expect(selectedPowers.scroll.getText()).toBe('Minor');
        expect(selectedPowers.staff.getText()).toBe('Medium');
        expect(selectedPowers.wand.getText()).toBe('Minor');
        expect(selectedPowers.weapon.getText()).toBe('Mundane');
        expect(selectedPowers.wondrousItem.getText()).toBe('Minor');
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
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('should not show items if none', function () {
        expect(treasure.itemsWrapper.isDisplayed()).toBeFalsy();
    });

    it('should show a label saying no treasure was generated if no treasure is generated', function () {
        expect(treasure.noTreasure.getText()).toBe('No treasure was generated');
    });

    //#endregion

    //#region treaure tests

    //INFO: Wanted to have tests that verified treasure is generated, but since it is chance,
    //and nothing coming back is a legitimate response, the tests cannot be guaranteed
    //to always pass

    it('should allow level between 1 and 20 for treasure', function () {
        for (var i = 20; i > 0; i--) {
            commonTestFunctions.sendInput(levels.treasure, i);
            expect(buttons.treasure.isEnabled()).toBeTruthy();
        }
    });

    it('should not allow decimal levels for treasure', function () {
        commonTestFunctions.sendInput(levels.treasure, 1.5);
        expect(buttons.treasure.isEnabled()).toBeFalsy();
    });

    it('should not allow level of 0 for treasure', function () {
        commonTestFunctions.sendInput(levels.treasure, 0);
        expect(buttons.treasure.isEnabled()).toBeFalsy();
    });

    it('should not allow level less than 0 for treasure', function () {
        commonTestFunctions.sendInput(levels.treasure, -1);
        expect(buttons.treasure.isEnabled()).toBeFalsy();
    });

    it('should not allow non-numeric level for treasure', function () {
        commonTestFunctions.sendInput(levels.treasure, 'two');
        expect(buttons.treasure.isEnabled()).toBeFalsy();
    });

    it('should not allow level greater than 20 for treasure', function () {
        commonTestFunctions.sendInput(levels.treasure, 21);
        expect(buttons.treasure.isEnabled()).toBeFalsy();
    });

    it('should not allow empty level for treasure', function () {
        commonTestFunctions.sendInput(levels.treasure, '');
        expect(buttons.treasure.isEnabled()).toBeFalsy();
    });

    it('increments treasure level by 1 when up is pressed', function () {
        levels.treasure.sendKeys(protractor.Key.UP);
        expect(levels.treasure.getAttribute('value')).toBe('2');
    });

    it('decrements treasure level by 1 when down is pressed', function () {
        commonTestFunctions.sendInput(levels.treasure, 3);
        levels.treasure.sendKeys(protractor.Key.DOWN);
        expect(levels.treasure.getAttribute('value')).toBe('2');
    });

    it('cannot key up treasure level beyond 20', function () {
        commonTestFunctions.sendInput(levels.treasure, 20);
        levels.treasure.sendKeys(protractor.Key.UP);
        expect(levels.treasure.getAttribute('value')).toBe('20');
    });

    it('cannot key down treasure level below 1', function () {
        commonTestFunctions.sendInput(levels.treasure, 1);
        levels.treasure.sendKeys(protractor.Key.DOWN);
        expect(levels.treasure.getAttribute('value')).toBe('1');
    });

    it('should format coin from treasure', function () {
        commonTestFunctions.sendInput(levels.treasure, 20);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.treasure);
        expect(treasure.coin.getText()).toMatch(/(\d|,)+ [a-zA-z]+/);
    });

    it('should format goods from treasure', function () {
        commonTestFunctions.sendInput(levels.treasure, 20);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.treasure);

        treasure.goods.each(function (element) {
            expect(element.getText()).toMatch(/.+ \((\d|,)+gp\)/);
        });
    });

    it('should at least show item names from treasure', function () {
        commonTestFunctions.sendInput(levels.treasure, 20);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.treasure);

        treasure.items.each(function (element) {
            expect(element.element(by.binding('item.Name')).getText()).toMatch(/[a-zA-z]+/);
        });
    });

    //#endregion

    //#region coin tests

    //INFO: Wanted to have tests that verified coin is generated, but since it is chance,
    //and nothing coming back is a legitimate response, the tests cannot be guaranteed
    //to always pass

    it('should generate only coin', function () {
        commonTestFunctions.sendInput(levels.coin, 20);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.coin);

        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
        expect(treasure.itemsWrapper.isDisplayed()).toBeFalsy();
    });

    it('should allow level between 1 and 20 for coin', function () {
        for (var i = 20; i > 0; i--) {
            commonTestFunctions.sendInput(levels.coin, i);
            expect(buttons.coin.isEnabled()).toBeTruthy();
        }
    });

    it('should not allow decimal levels for coin', function () {
        commonTestFunctions.sendInput(levels.coin, 1.5);
        expect(buttons.coin.isEnabled()).toBeFalsy();
    });

    it('should not allow level of 0 for coin', function () {
        commonTestFunctions.sendInput(levels.coin, 0);
        expect(buttons.coin.isEnabled()).toBeFalsy();
    });

    it('should not allow level less than 0 for coin', function () {
        commonTestFunctions.sendInput(levels.coin, -1);
        expect(buttons.coin.isEnabled()).toBeFalsy();
    });

    it('should not allow non-numeric level for coin', function () {
        commonTestFunctions.sendInput(levels.coin, 'two');
        expect(buttons.coin.isEnabled()).toBeFalsy();
    });

    it('should not allow level greater than 20 for coin', function () {
        commonTestFunctions.sendInput(levels.coin, 21);
        expect(buttons.coin.isEnabled()).toBeFalsy();
    });

    it('should not allow empty level for coin', function () {
        commonTestFunctions.sendInput(levels.coin, '');
        expect(buttons.coin.isEnabled()).toBeFalsy();
    });

    it('increments coin level by 1 when up is pressed', function () {
        levels.coin.sendKeys(protractor.Key.UP);
        expect(levels.coin.getAttribute('value')).toBe('2');
    });

    it('decrements coin level by 1 when down is pressed', function () {
        commonTestFunctions.sendInput(levels.coin, 3);
        levels.coin.sendKeys(protractor.Key.DOWN);
        expect(levels.coin.getAttribute('value')).toBe('2');
    });

    it('cannot key up coin level beyond 20', function () {
        commonTestFunctions.sendInput(levels.coin, 20);
        levels.coin.sendKeys(protractor.Key.UP);
        expect(levels.coin.getAttribute('value')).toBe('20');
    });

    it('cannot key down coin level below 1', function () {
        commonTestFunctions.sendInput(levels.coin, 1);
        levels.coin.sendKeys(protractor.Key.DOWN);
        expect(levels.coin.getAttribute('value')).toBe('1');
    });

    //INFO: Wanted to have tests that verified the format of the coin, but since it is chance,
    //and nothing coming back is a legitimate response, the tests cannot be guaranteed
    //to always pass

    //#endregion

    //#region goods tests

    //INFO: Wanted to have tests that verified goods are generated, but since it is chance,
    //and nothing coming back is a legitimate response, the tests cannot be guaranteed
    //to always pass

    it('should generate only goods', function () {
        commonTestFunctions.sendInput(levels.goods, 20);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.goods);

        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.itemsWrapper.isDisplayed()).toBeFalsy();
    });

    it('should allow level between 1 and 20 for goods', function () {
        for (var i = 20; i > 0; i--) {
            commonTestFunctions.sendInput(levels.goods, i);
            expect(buttons.goods.isEnabled()).toBeTruthy();
        }
    });

    it('should not allow decimal levels for goods', function () {
        commonTestFunctions.sendInput(levels.goods, 1.5);
        expect(buttons.goods.isEnabled()).toBeFalsy();
    });

    it('should not allow level of 0 for goods', function () {
        commonTestFunctions.sendInput(levels.goods, 0);
        expect(buttons.goods.isEnabled()).toBeFalsy();
    });

    it('should not allow level less than 0 for goods', function () {
        commonTestFunctions.sendInput(levels.goods, -1);
        expect(buttons.goods.isEnabled()).toBeFalsy();
    });

    it('should not allow non-numeric level for goods', function () {
        commonTestFunctions.sendInput(levels.goods, 'two');
        expect(buttons.goods.isEnabled()).toBeFalsy();
    });

    it('should not allow level greater than 20 for goods', function () {
        commonTestFunctions.sendInput(levels.goods, 21);
        expect(buttons.goods.isEnabled()).toBeFalsy();
    });

    it('should not allow empty level for goods', function () {
        commonTestFunctions.sendInput(levels.goods, '');
        expect(buttons.goods.isEnabled()).toBeFalsy();
    });

    it('increments goods level by 1 when up is pressed', function () {
        levels.goods.sendKeys(protractor.Key.UP);
        expect(levels.goods.getAttribute('value')).toEqual('2');
    });

    it('decrements goods level by 1 when down is pressed', function () {
        commonTestFunctions.sendInput(levels.goods, 3);
        levels.goods.sendKeys(protractor.Key.DOWN);
        expect(levels.goods.getAttribute('value')).toEqual('2');
    });

    it('cannot key up goods level beyond 20', function () {
        commonTestFunctions.sendInput(levels.goods, 20);
        levels.goods.sendKeys(protractor.Key.UP);
        expect(levels.goods.getAttribute('value')).toBe('20');
    });

    it('cannot key down goods level below 1', function () {
        commonTestFunctions.sendInput(levels.goods, 1);
        levels.goods.sendKeys(protractor.Key.DOWN);
        expect(levels.goods.getAttribute('value')).toBe('1');
    });

    it('should format goods', function () {
        commonTestFunctions.sendInput(levels.goods, 20);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.goods);

        treasure.goods.each(function (element) {
            expect(element.getText()).toMatch(/.* \((\d|,)+gp\)/);
        });
    });

    //#endregion

    //#region items tests

    //INFO: Wanted to have tests that verified items are generated, but since it is chance,
    //and nothing coming back is a legitimate response, the tests cannot be guaranteed
    //to always pass

    it('should generate only items', function () {
        commonTestFunctions.sendInput(levels.items, 20);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.items);

        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('should allow level between 1 and 20 for items', function () {
        for (var i = 20; i > 0; i--) {
            commonTestFunctions.sendInput(levels.items, i);
            expect(buttons.items.isEnabled()).toBeTruthy();
        }
    });

    it('should not allow decimal levels for items', function () {
        commonTestFunctions.sendInput(levels.items, 1.5);
        expect(buttons.items.isEnabled()).toBeFalsy();
    });

    it('should not allow level of 0 for items', function () {
        commonTestFunctions.sendInput(levels.items, 0);
        expect(buttons.items.isEnabled()).toBeFalsy();
    });

    it('should not allow level less than 0 for items', function () {
        commonTestFunctions.sendInput(levels.items, -1);
        expect(buttons.items.isEnabled()).toBeFalsy();
    });

    it('should not allow non-numeric level for items', function () {
        commonTestFunctions.sendInput(levels.items, 'two');
        expect(buttons.items.isEnabled()).toBeFalsy();
    });

    it('should not allow level greater than 20 for items', function () {
        commonTestFunctions.sendInput(levels.items, 21);
        expect(buttons.items.isEnabled()).toBeFalsy();
    });

    it('should not allow empty level for items', function () {
        commonTestFunctions.sendInput(levels.items, '');
        expect(buttons.items.isEnabled()).toBeFalsy();
    });

    it('increments items level by 1 when up is pressed', function () {
        levels.items.sendKeys(protractor.Key.UP);
        expect(levels.items.getAttribute('value')).toEqual('2');
    });

    it('decrements items level by 1 when down is pressed', function () {
        commonTestFunctions.sendInput(levels.items, 3);
        levels.items.sendKeys(protractor.Key.DOWN);
        expect(levels.items.getAttribute('value')).toEqual('2');
    });

    it('cannot key up items level beyond 20', function () {
        commonTestFunctions.sendInput(levels.items, 20);
        levels.items.sendKeys(protractor.Key.UP);
        expect(levels.items.getAttribute('value')).toBe('20');
    });

    it('cannot key down items level below 1', function () {
        commonTestFunctions.sendInput(levels.items, 1);
        levels.items.sendKeys(protractor.Key.DOWN);
        expect(levels.items.getAttribute('value')).toBe('1');
    });

    it('should at least show item names', function () {
        commonTestFunctions.sendInput(levels.items, 20);
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.items);

        treasure.items.each(function (element) {
            expect(element.element(by.binding('item.Name')).getText()).toMatch(/[a-zA-z]+/);
        });
    });

    //#endregion

    //#region alchemical item tests

    it('should generate alchemical item', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.alchemicalItem);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate only alchemical items', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.alchemicalItem);
        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('should generate 1 alchemical item', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.alchemicalItem);
        expect(treasure.items.count()).toBe(1);
    });

    it('should show alchemical item name', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.alchemicalItem);
        expect(treasure.itemProperties.name.getText()).toMatch(/[a-zA-z]+/);
    });

    //#endregion

    //#region armor tests

    it('should generate armor', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.armor);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate only armor', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.armor);
        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('should generate 1 armor', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.armor);
        expect(treasure.items.count()).toBe(1);
    });

    it('should generate major armor', function () {
        commonTestFunctions.selectItemInDropdown(powers.armor, 'Major');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.armor);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate medium armor', function () {
        commonTestFunctions.selectItemInDropdown(powers.armor, 'Medium');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.armor);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate minor armor', function () {
        commonTestFunctions.selectItemInDropdown(powers.armor, 'Minor');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.armor);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate mundane armor', function () {
        commonTestFunctions.selectItemInDropdown(powers.armor, 'Mundane');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.armor);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should show armor name', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.armor);
        expect(treasure.itemProperties.name.getText()).toMatch(/[a-zA-z]+/);
    });

    //#endregion

    //#region potion tests

    it('should generate potion', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.potion);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate only potion', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.potion);
        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('should generate 1 potion', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.potion);
        expect(treasure.items.count()).toBe(1);
    });

    it('should generate major potion', function () {
        commonTestFunctions.selectItemInDropdown(powers.potion, 'Major');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.potion);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate medium potion', function () {
        commonTestFunctions.selectItemInDropdown(powers.potion, 'Medium');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.potion);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate minor potion', function () {
        commonTestFunctions.selectItemInDropdown(powers.potion, 'Minor');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.potion);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should show potion name', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.potion);
        expect(treasure.itemProperties.name.getText()).toMatch(/[a-zA-z]+/);
    });

    //#endregion

    //#region ring tests

    it('should generate ring', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.ring);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate only ring', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.ring);
        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('should generate 1 ring', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.ring);
        expect(treasure.items.count()).toBe(1);
    });

    it('should generate major ring', function () {
        commonTestFunctions.selectItemInDropdown(powers.ring, 'Major');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.ring);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate medium ring', function () {
        commonTestFunctions.selectItemInDropdown(powers.ring, 'Medium');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.ring);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate minor ring', function () {
        commonTestFunctions.selectItemInDropdown(powers.ring, 'Minor');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.ring);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should show ring name', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.ring);
        expect(treasure.itemProperties.name.getText()).toMatch(/[a-zA-z]+/);
    });

    //#endregion

    //#region rod tests

    it('should generate rod', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.rod);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate only rod', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.rod);
        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('should generate 1 rod', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.rod);
        expect(treasure.items.count()).toBe(1);
    });

    it('should generate major rod', function () {
        commonTestFunctions.selectItemInDropdown(powers.rod, 'Major');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.rod);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate medium rod', function () {
        commonTestFunctions.selectItemInDropdown(powers.rod, 'Medium');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.rod);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should show rod name', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.rod);
        expect(treasure.itemProperties.name.getText()).toMatch(/[a-zA-z]+/);
    });

    //#endregion

    //#region scroll tests

    it('should generate scroll', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.scroll);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate only scroll', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.scroll);
        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('should generate 1 scroll', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.scroll);
        expect(treasure.items.count()).toBe(1);
    });

    it('should generate major scroll', function () {
        commonTestFunctions.selectItemInDropdown(powers.scroll, 'Major');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.scroll);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate medium scroll', function () {
        commonTestFunctions.selectItemInDropdown(powers.scroll, 'Medium');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.scroll);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate minor scroll', function () {
        commonTestFunctions.selectItemInDropdown(powers.scroll, 'Minor');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.scroll);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should show scroll contents', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.scroll);
        expect(treasure.itemProperties.contents.count()).toBeGreaterThan(0);
    });

    it('should show scroll name', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.scroll);
        expect(treasure.itemProperties.name.getText()).toBe('Scroll');
    });

    it('should show scroll traits that are exclusively divine or arcane', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.scroll);
        expect(treasure.itemProperties.traits.count()).toBe(1);

        treasure.itemProperties.traits.each(function (element) {
            expect(element.getText()).toMatch(/(Divine|Arcane)/);
        });
    });

    //#endregion

    //#region staff tests

    it('should generate staff', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.staff);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate only staff', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.staff);
        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('should generate 1 staff', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.staff);
        expect(treasure.items.count()).toBe(1);
    });

    it('should generate major staff', function () {
        commonTestFunctions.selectItemInDropdown(powers.staff, 'Major');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.staff);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate medium staff', function () {
        commonTestFunctions.selectItemInDropdown(powers.staff, 'Medium');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.staff);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should show staff charges', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.staff);
        expect(treasure.itemProperties.charges.getText()).toMatch(/Charges: \d+/);
    });

    it('should show staff name', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.staff);
        expect(treasure.itemProperties.name.getText()).toMatch(/[a-zA-z]+/);
    });

    //#endregion

    //#region tool tests

    it('should generate tool', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.tool);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate only tools', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.tool);
        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('should generate 1 tool', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.tool);
        expect(treasure.items.count()).toBe(1);
    });

    it('should show tool name', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.tool);
        expect(treasure.itemProperties.name.getText()).toMatch(/[a-zA-z]+/);
    });

    //#endregion

    //#region wand tests

    it('should generate wand', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.wand);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate only wand', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.wand);
        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('should generate 1 wand', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.wand);
        expect(treasure.items.count()).toBe(1);
    });

    it('should generate major wand', function () {
        commonTestFunctions.selectItemInDropdown(powers.wand, 'Major');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.wand);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate medium wand', function () {
        commonTestFunctions.selectItemInDropdown(powers.wand, 'Medium');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.wand);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate minor wand', function () {
        commonTestFunctions.selectItemInDropdown(powers.wand, 'Minor');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.wand);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should show wand charges', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.wand);
        expect(treasure.itemProperties.charges.getText()).toMatch(/Charges: \d+/);
    });

    it('should show wand name', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.wand);
        expect(treasure.itemProperties.name.getText()).toMatch(/[a-zA-z]+/);
    });

    //#endregion

    //#region weapon tests

    it('should generate weapon', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.weapon);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate only weapon', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.weapon);
        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('should generate 1 weapon', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.weapon);
        expect(treasure.items.count()).toBe(1);
    });

    it('should generate major weapon', function () {
        commonTestFunctions.selectItemInDropdown(powers.weapon, 'Major');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.weapon);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate medium weapon', function () {
        commonTestFunctions.selectItemInDropdown(powers.weapon, 'Medium');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.weapon);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate minor weapon', function () {
        commonTestFunctions.selectItemInDropdown(powers.weapon, 'Minor');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.weapon);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate mundane weapon', function () {
        commonTestFunctions.selectItemInDropdown(powers.weapon, 'Mundane');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.weapon);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should show weapon name', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.weapon);
        expect(treasure.itemProperties.name.getText()).toMatch(/[a-zA-z]+/);
    });

    //#endregion

    //#region wondrous item tests

    it('should generate wondrous item', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.wondrousItem);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate only wondrous item', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.wondrousItem);
        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('should generate 1 wondrous item', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.wondrousItem);
        expect(treasure.items.count()).toBe(1);
    });

    it('should generate major wondrous item', function () {
        commonTestFunctions.selectItemInDropdown(powers.wondrousItem, 'Major');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.wondrousItem);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate medium wondrous item', function () {
        commonTestFunctions.selectItemInDropdown(powers.wondrousItem, 'Medium');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.wondrousItem);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should generate minor wondrous item', function () {
        commonTestFunctions.selectItemInDropdown(powers.wondrousItem, 'Minor');
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.wondrousItem);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('should show wondrous item name', function () {
        commonTestFunctions.clickButtonAndWaitForResolution(buttons.wondrousItem);
        expect(treasure.itemProperties.name.getText()).toMatch(/[a-zA-z]+/);
    });

    //#endregion
});