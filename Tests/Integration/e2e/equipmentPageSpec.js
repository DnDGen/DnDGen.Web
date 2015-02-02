'use strict';

var CommonTestFunctions = require('./Common/commonTestFunctions.js');

describe('Equipment Page', function () {
    var commonTestFunctions = new CommonTestFunctions();
    var treasureLevel = element(by.model('vm.treasureLevel'));
    var treasureTypes = element(by.model('vm.treasureType'));
    var treasureType = treasureTypes.$('option:checked');
    var treasureButton = element(by.id('treasureButton'));

    var mundaneItemTypes = element(by.model('vm.mundaneItemType'));
    var mundaneItemType = mundaneItemTypes.$('option:checked');
    var mundaneItemButton = element(by.id('mundaneItemButton'));

    var poweredItemTypes = element(by.model('vm.poweredItemType'));
    var poweredItemType = poweredItemTypes.$('option:checked');
    var itemPowers = element(by.model('vm.itemPower'));
    var itemPower = itemPowers.$('option:checked');
    var poweredItemButton = element(by.id('poweredItemButton'));

    var treasure = {
        coin: element(by.binding('vm.treasure.Coin.Currency')),
        goods: element.all(by.repeater('good in vm.treasure.Goods')),
        items: element.all(by.repeater('item in vm.treasure.Items')),
        goodsWrapper: element(by.id('goodsWrapper')),
        itemsWrapper: element(by.id('itemsWrapper')),
        noTreasure: element(by.id('noTreasure'))
    };

    beforeEach(function () {
        browser.get(browser.baseUrl + '/Equipment');
    });

    it('has a title', function () {
        expect(browser.driver.getTitle()).toEqual('DNDGen');
    });

    it('has a header', function () {
        expect(element(by.css('h1')).getText()).toBe('EquipmentGen');
    });

    it('loads initial values', function () {
        expect(treasureType.getText()).toBe('Treasure');
        expect(treasureLevel.getAttribute('value')).toBe('1');
        expect(mundaneItemType.getText()).toBe('AlchemicalItem');
        expect(poweredItemType.getText()).toBe('Armor');
        expect(itemPower.getText()).toBe('Mundane');

        expect(treasure.noTreasure.getText()).toBe('No treasure was generated');
        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
        expect(treasure.itemsWrapper.isDisplayed()).toBeFalsy();
    });

    it('allows level between 1 and 20 for treasure', function () {
        for (var i = 20; i > 0; i--) {
            commonTestFunctions.sendInput(treasureLevel, i);
            expect(treasureButton.isEnabled()).toBeTruthy();
        }
    });

    it('does not allow decimal levels for treasure', function () {
        commonTestFunctions.sendInput(treasureLevel, 1.5);
        expect(treasureButton.isEnabled()).toBeFalsy();
    });

    it('does not allow level of 0 for treasure', function () {
        commonTestFunctions.sendInput(treasureLevel, 0);
        expect(treasureButton.isEnabled()).toBeFalsy();
    });

    it('does not allow level less than 0 for treasure', function () {
        commonTestFunctions.sendInput(treasureLevel, -1);
        expect(treasureButton.isEnabled()).toBeFalsy();
    });

    it('does not allow non-numeric level for treasure', function () {
        commonTestFunctions.sendInput(treasureLevel, 'two');
        expect(treasureButton.isEnabled()).toBeFalsy();
    });

    it('does not allow level greater than 20 for treasure', function () {
        commonTestFunctions.sendInput(treasureLevel, 21);
        expect(treasureButton.isEnabled()).toBeFalsy();
    });

    it('does not allow empty level for treasure', function () {
        commonTestFunctions.sendInput(treasureLevel, '');
        expect(treasureButton.isEnabled()).toBeFalsy();
    });

    it('increments treasure level by 1 when up is pressed', function () {
        treasureLevel.sendKeys(protractor.Key.UP);
        expect(treasureLevel.getAttribute('value')).toBe('2');
    });

    it('decrements treasure level by 1 when down is pressed', function () {
        commonTestFunctions.sendInput(treasureLevel, 3);
        treasureLevel.sendKeys(protractor.Key.DOWN);
        expect(treasureLevel.getAttribute('value')).toBe('2');
    });

    it('cannot key up treasure level beyond 20', function () {
        commonTestFunctions.sendInput(treasureLevel, 20);
        treasureLevel.sendKeys(protractor.Key.UP);
        expect(treasureLevel.getAttribute('value')).toBe('20');
    });

    it('cannot key down treasure level below 1', function () {
        commonTestFunctions.sendInput(treasureLevel, 1);
        treasureLevel.sendKeys(protractor.Key.DOWN);
        expect(treasureLevel.getAttribute('value')).toBe('1');
    });

    it('generates alchemical items', function () {
        commonTestFunctions.selectItemInDropdown(mundaneItemTypes, 'AlchemicalItem');
        commonTestFunctions.clickButtonAndWaitForResolution(mundaneItemButton);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates only alchemical items', function () {
        commonTestFunctions.selectItemInDropdown(mundaneItemTypes, 'AlchemicalItem');
        commonTestFunctions.clickButtonAndWaitForResolution(mundaneItemButton);

        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('generates 1 alchemical item', function () {
        commonTestFunctions.selectItemInDropdown(mundaneItemTypes, 'AlchemicalItem');
        commonTestFunctions.clickButtonAndWaitForResolution(mundaneItemButton);
        expect(treasure.items.count()).toBe(1);
    });

    it('generates armor', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Armor');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates only armor', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Armor');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('generates 1 armor', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Armor');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);
        expect(treasure.items.count()).toBe(1);
    });

    it('generates major armor', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Major');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Armor');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates medium armor', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Medium');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Armor');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates minor armor', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Minor');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Armor');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates mundane armor', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Mundane');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Armor');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates potion', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Potion');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates only potion', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Potion');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('generates 1 potion', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Potion');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);
        expect(treasure.items.count()).toBe(1);
    });

    it('generates major potion', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Major');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Potion');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates medium potion', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Medium');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Potion');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates minor potion', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Minor');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Potion');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates ring', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Ring');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates only ring', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Ring');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('generates 1 ring', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Ring');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);
        expect(treasure.items.count()).toBe(1);
    });

    it('generates major ring', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Major');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Ring');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates medium ring', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Medium');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Ring');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates minor ring', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Minor');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Ring');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates rod', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Rod');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates only rod', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Rod');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('generates 1 rod', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Rod');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.items.count()).toBe(1);
    });

    it('generates major rod', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Major');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Rod');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates medium rod', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Medium');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Rod');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates scroll', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Scroll');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates only scroll', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Scroll');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('generates 1 scroll', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Scroll');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);
        expect(treasure.items.count()).toBe(1);
    });

    it('generates major scroll', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Major');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Scroll');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates medium scroll', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Medium');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Scroll');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates minor scroll', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Minor');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Scroll');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates staff', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Staff');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates only staff', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Staff');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('generates 1 staff', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Staff');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);
        expect(treasure.items.count()).toBe(1);
    });

    it('generates major staff', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Major');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Staff');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates medium staff', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Medium');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Staff');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates tool', function () {
        commonTestFunctions.selectItemInDropdown(mundaneItemTypes, 'Tool');
        commonTestFunctions.clickButtonAndWaitForResolution(mundaneItemButton);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates only tools', function () {
        commonTestFunctions.selectItemInDropdown(mundaneItemTypes, 'Tool');
        commonTestFunctions.clickButtonAndWaitForResolution(mundaneItemButton);

        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('generates 1 tool', function () {
        commonTestFunctions.selectItemInDropdown(mundaneItemTypes, 'Tool');
        commonTestFunctions.clickButtonAndWaitForResolution(mundaneItemButton);
        expect(treasure.items.count()).toBe(1);
    });

    it('generates wand', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Wand');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates only wand', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Wand');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('generates 1 wand', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Wand');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);
        expect(treasure.items.count()).toBe(1);
    });

    it('generates major wand', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Major');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Wand');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates medium wand', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Medium');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Wand');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates minor wand', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Minor');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Wand');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates weapon', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Weapon');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates only weapon', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Weapon');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('generates 1 weapon', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Weapon');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);
        expect(treasure.items.count()).toBe(1);
    });

    it('generates major weapon', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Major');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Weapon');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates medium weapon', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Medium');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Weapon');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates minor weapon', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Minor');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Weapon');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates mundane weapon', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Mundane');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'Weapon');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates wondrous item', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'WondrousItem');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);
        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates only wondrous item', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'WondrousItem');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.coin.isDisplayed()).toBeFalsy();
        expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
    });

    it('generates 1 wondrous item', function () {
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'WondrousItem');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);
        expect(treasure.items.count()).toBe(1);
    });

    it('generates major wondrous item', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Major');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'WondrousItem');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates medium wondrous item', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Medium');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'WondrousItem');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('generates minor wondrous item', function () {
        commonTestFunctions.selectItemInDropdown(itemPowers, 'Minor');
        commonTestFunctions.selectItemInDropdown(poweredItemTypes, 'WondrousItem');
        commonTestFunctions.clickButtonAndWaitForResolution(poweredItemButton);

        expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();
    });

    it('shows nothing if there is nothing', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Coin: { Currency: '', Quantity: 0 },
                Goods: [],
                Items: []
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(treasure.noTreasure.isDisplayed()).toBeTruthy();
            expect(treasure.noTreasure.getText()).toBe('No treasure was generated');

            expect(treasure.coin.isDisplayed()).toBeFalsy();
            expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
            expect(treasure.itemsWrapper.isDisplayed()).toBeFalsy();
        });
    });

    it('does not show nothing if there is coin', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Coin: { Currency: 'munny', Quantity: 1 },
                Goods: [],
                Items: []
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(treasure.noTreasure.isDisplayed()).toBeFalsy();
        });
    });

    it('does not show nothing if there are goods', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Coin: { Currency: 'munny', Quantity: 0 },
                Goods: [{ Description: 'goody goody', ValueInGold: 1 }],
                Items: []
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(treasure.noTreasure.isDisplayed()).toBeFalsy();
        });
    });

    it('does not show nothing if there are items', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Coin: { Currency: 'munny', Quantity: 0 },
                Goods: [],
                Items: [{ Name: "Karl's item" }]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(treasure.noTreasure.isDisplayed()).toBeFalsy();
        });
    });

    it('does not show coin if quantity is 0', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Coin: { Currency: 'munny', Quantity: 0 }
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(treasure.coin.isDisplayed()).toBeFalsy();
        });
    });

    it('shows coin', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Coin: { Currency: 'munny', Quantity: 1 }
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(treasure.coin.isDisplayed()).toBeTruthy();
            expect(treasure.coin.getText()).toBe('1 munny');
        });
    });

    it('formats coin', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Coin: { Currency: 'munny', Quantity: 9266 }
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(treasure.coin.isDisplayed()).toBeTruthy();
            expect(treasure.coin.getText()).toBe('9,266 munny');
        });
    });

    it('does not show goods if none', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Goods: []
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(treasure.goodsWrapper.isDisplayed()).toBeFalsy();
        });
    });

    it('shows goods', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Goods: [{ Description: 'goody goody', ValueInGold: 1 }]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(treasure.goodsWrapper.isDisplayed()).toBeTruthy();

            element.all(by.repeater('good in vm.treasure.Goods'))
                .then(function (goods) {
                    expect(treasure.goods.count()).toBe(1);
                    expect(goods.length).toBe(1);
                    expect(goods[0].getText()).toBe("goody goody (1gp)");
                });
        });
    });

    it('shows multiple goods', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Goods: [
                    { Description: 'goody goody', ValueInGold: 1 },
                    { Description: 'other goody', ValueInGold: 2 }
                ]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(treasure.goodsWrapper.isDisplayed()).toBeTruthy();

            element.all(by.repeater('good in vm.treasure.Goods'))
                .then(function (goods) {
                    expect(treasure.goods.count()).toBe(2);
                    expect(goods.length).toBe(2);
                    expect(goods[0].getText()).toBe("goody goody (1gp)");
                    expect(goods[1].getText()).toBe("other goody (2gp)");
                });
        });
    });

    it('shows duplicate goods', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Goods: [
                    { Description: 'goody goody', ValueInGold: 1 },
                    { Description: 'goody goody', ValueInGold: 1 }
                ]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(treasure.goodsWrapper.isDisplayed()).toBeTruthy();

            element.all(by.repeater('good in vm.treasure.Goods'))
                .then(function (goods) {
                    expect(treasure.goods.count()).toBe(2);
                    expect(goods.length).toBe(2);
                    expect(goods[0].getText()).toBe("goody goody (1gp)");
                    expect(goods[1].getText()).toBe("goody goody (1gp)");
                });
        });
    });

    it('formats goods', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Goods: [{ Description: 'goody goody', ValueInGold: 9266 }]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(treasure.goodsWrapper.isDisplayed()).toBeTruthy();

            element.all(by.repeater('good in vm.treasure.Goods'))
                .then(function (goods) {
                    expect(treasure.goods.count()).toBe(1);
                    expect(goods.length).toBe(1);
                    expect(goods[0].getText()).toBe("goody goody (9,266gp)");
                });
        });
    });

    it('does not show items if none', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: []
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(treasure.itemsWrapper.isDisplayed()).toBeFalsy();
        });
    });

    it('shows items', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [{ Name: "Karl's item" }]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();

            element.all(by.repeater('item in vm.treasure.Items'))
                .then(function (items) {
                    expect(treasure.items.count()).toBe(1);
                    expect(items.length).toBe(1);
                });
        });
    });

    it('shows multiple items', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [{ Name: "Karl's item" }, { Name: "Grell's item" }]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();

            element.all(by.repeater('item in vm.treasure.Items'))
                .then(function (items) {
                    expect(treasure.items.count()).toBe(2);
                    expect(items.length).toBe(2);
                });
        });
    });

    it('shows duplicate items', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [{ Name: "Karl's item" }, { Name: "Karl's item" }]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(treasure.itemsWrapper.isDisplayed()).toBeTruthy();

            element.all(by.repeater('item in vm.treasure.Items'))
                .then(function (items) {
                    expect(treasure.items.count()).toBe(2);
                    expect(items.length).toBe(2);
                });
        });
    });

    it('shows item name', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [{ Name: "Karl's item" }]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var name = element(by.id('itemName'));
            expect(name.isDisplayed()).toBeTruthy();
            expect(name.getText()).toBe("Karl's item");
        });
    });

    it('shows only item name when quantity is 1', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [{ Name: "Karl's item", Quantity: 1 }]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var name = element(by.id('itemName'));
            expect(name.isDisplayed()).toBeTruthy();
            expect(name.getText()).toBe("Karl's item");
        });
    });

    it('shows item name and quantity when quantity is greater than 1', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [{ Name: "Karl's item", Quantity: 2 }]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var name = element(by.id('itemName'));
            expect(name.isDisplayed()).toBeTruthy();
            expect(name.getText()).toBe("Karl's item (x2)");
        });
    });

    it('does not show contents when there is none', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [{ Name: "Karl's item", Contents: [] }]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            element.all(by.repeater('content in item.Contents'))
                .then(function (contents) {
                    expect(treasure.items.count()).toBe(1);
                    expect(contents.length).toBe(0);
                });
        });
    });

    it('shows contents', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [{ Name: "Karl's item", Contents: ['thing 1', 'thing 2'] }]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            element.all(by.repeater('content in item.Contents'))
                .then(function (contents) {
                    expect(treasure.items.count()).toBe(1);
                    expect(contents.length).toBe(2);
                    expect(contents[0].getText()).toBe("thing 1");
                    expect(contents[1].getText()).toBe("thing 2");
                });
        });
    });

    it('shows duplicate contents', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [{ Name: "Karl's item", Contents: ['thing 1', 'thing 1'] }]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            element.all(by.repeater('content in item.Contents'))
                .then(function (contents) {
                    expect(treasure.items.count()).toBe(1);
                    expect(contents.length).toBe(2);
                    expect(contents[0].getText()).toBe("thing 1");
                    expect(contents[1].getText()).toBe("thing 1");
                });
        });
    });

    it('does not show traits when there is none', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [{ Name: "Karl's item", Traits: [] }]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            element.all(by.repeater('trait in item.Traits'))
                .then(function (traits) {
                    expect(treasure.items.count()).toBe(1);
                    expect(traits.length).toBe(0);
                });
        });
    });

    it('shows traits', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [{ Name: "Karl's item", Traits: ['trait 1', 'trait 2'] }]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            element.all(by.repeater('trait in item.Traits'))
                .then(function (traits) {
                    expect(treasure.items.count()).toBe(1);
                    expect(traits.length).toBe(2);
                    expect(traits[0].getText()).toBe("trait 1");
                    expect(traits[1].getText()).toBe("trait 2");
                });
        });
    });

    it('does not show magic bonus when there is none', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [{ Name: "Karl's item", Magic: { Bonus: 0 } }]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var bonus = element(by.binding('item.Magic.Bonus'));
            expect(bonus.isDisplayed()).toBeFalsy();
        });
    });

    it('shows magic bonus', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [{ Name: "Karl's item", Magic: { Bonus: 1 } }]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var bonus = element(by.binding('item.Magic.Bonus'));
            expect(bonus.isDisplayed()).toBeTruthy();
            expect(bonus.getText()).toBe('Bonus: +1');
        });
    });

    it('should not display special abilities if none', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [{ Name: "Karl's item", Magic: { SpecialAbilities: [] } }]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            element.all(by.repeater('ability in item.Magic.SpecialAbilities'))
                .then(function (abilities) {
                    expect(treasure.items.count()).toBe(1);
                    expect(abilities.length).toBe(0);
                });
        });
    });

    it('should display ability names without strengths', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [
                    {
                        Name: "Karl's item",
                        Magic: {
                            SpecialAbilities: [
                                { Name: "first special ability", Strength: 2 },
                                { Name: "second special ability", Strength: 5 },
                            ]
                        }
                    }
                ]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            element.all(by.repeater('ability in item.Magic.SpecialAbilities'))
                .then(function (abilities) {
                    expect(treasure.items.count()).toBe(1);
                    expect(abilities.length).toBe(2);
                    expect(abilities[0].getText()).toBe("first special ability");
                    expect(abilities[1].getText()).toBe("second special ability");
                });
        });
    });

    it('does not show charges when there are none', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [{
                    Name: "Karl's item",
                    Attributes: ['Other attribute'],
                    Magic: { Charges: 0 }
                }]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var charges = element(by.binding('item.Magic.Charges'));
            expect(charges.isDisplayed()).toBeFalsy();
        });
    });

    it('shows charges', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [{
                    Name: "Karl's item",
                    Attributes: ['Charged'],
                    Magic: { Charges: 1 }
                }]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var charges = element(by.binding('item.Magic.Charges'));
            expect(charges.isDisplayed()).toBeTruthy();
            expect(charges.getText()).toBe('Charges: 1');
        });
    });

    it('shows charge of 0 for charged item', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [{
                    Name: "Karl's item",
                    Attributes: ['Charged'],
                    Magic: { Charges: 0 }
                }]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var charges = element(by.binding('item.Magic.Charges'));
            expect(charges.isDisplayed()).toBeTruthy();
            expect(charges.getText()).toBe('Charges: 0');
        });
    });

    it('does not show curse when there is none', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [{ Name: "Karl's item", Magic: { Curse: '' } }]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var curse = element(by.binding('item.Magic.Curse'));
            expect(curse.isDisplayed()).toBeFalsy();
        });
    });

    it('shows curse', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [{ Name: "Karl's item", Magic: { Curse: 'A terrible curse' } }]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var curse = element(by.binding('item.Magic.Curse'));
            expect(curse.isDisplayed()).toBeTruthy();
            expect(curse.getText()).toBe('Curse: A terrible curse');
        });
    });

    it('does not display intelligence if ego is 0', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [
                    {
                        Name: "Karl's item",
                        Magic: { Intelligence: { Ego: 0 } }
                    }
                ]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var intelligence = element(by.id('intelligenceListItem'));
            expect(intelligence.isDisplayed()).toBeFalsy();
        });
    });

    it('displays intelligence if ego is greater than 0', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [
                    {
                        Name: "Karl's item",
                        Magic: { Intelligence: { Ego: 1 } }
                    }
                ]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var intelligence = element(by.id('intelligenceListItem'));
            expect(intelligence.isDisplayed()).toBeTruthy();
        });
    });

    it('displays intelligence ego', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [
                    {
                        Name: "Karl's item",
                        Magic: { Intelligence: { Ego: 1 } }
                    }
                ]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var intelligence = element(by.id('intelligenceListItem'));
            expect(intelligence.isDisplayed()).toBeTruthy();

            var ego = element(by.binding('item.Magic.Intelligence.Ego'));
            expect(ego.getText()).toBe('Ego: 1');
        });
    });

    it('displays intelligence stats', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [
                    {
                        Name: "Karl's item",
                        Magic: {
                            Intelligence: {
                                Ego: 1,
                                IntelligenceStat: 92,
                                WisdomStat: 66,
                                CharismaStat: 42
                            }
                        }
                    }
                ]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var intelligence = element(by.id('intelligenceListItem'));
            expect(intelligence.isDisplayed()).toBeTruthy();

            var intelligenceStat = element(by.binding('item.Magic.Intelligence.IntelligenceStat'));
            expect(intelligenceStat.getText()).toBe('Intelligence: 92');

            var wisdomStat = element(by.binding('item.Magic.Intelligence.WisdomStat'));
            expect(wisdomStat.getText()).toBe('Wisdom: 66');

            var charismaStat = element(by.binding('item.Magic.Intelligence.CharismaStat'));
            expect(charismaStat.getText()).toBe('Charisma: 42');
        });
    });

    it('displays intelligence alignment', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [
                    {
                        Name: "Karl's item",
                        Magic: {
                            Intelligence: {
                                Ego: 1,
                                Alignment: 'my alignment'
                            }
                        }
                    }
                ]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var intelligence = element(by.id('intelligenceListItem'));
            expect(intelligence.isDisplayed()).toBeTruthy();

            var alignment = element(by.binding('item.Magic.Intelligence.Alignment'));
            expect(alignment.getText()).toBe('Alignment: my alignment');
        });
    });

    it('shows intelligence communication', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [
                    {
                        Name: "Karl's item",
                        Magic: {
                            Intelligence: {
                                Ego: 1,
                                Communication: ['form 1', 'form 2']
                            }
                        }
                    }
                ]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var intelligence = element(by.id('intelligenceListItem'));
            expect(intelligence.isDisplayed()).toBeTruthy();

            element.all(by.repeater('method in item.Magic.Intelligence.Communication'))
                .then(function (methods) {
                    expect(treasure.items.count()).toBe(1);
                    expect(methods.length).toBe(2);
                    expect(methods[0].getText()).toBe('form 1');
                    expect(methods[1].getText()).toBe('form 2');
                });
        });
    });

    it('does not show intelligence languages if there are none', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [
                    {
                        Name: "Karl's item",
                        Magic: {
                            Intelligence: {
                                Ego: 1,
                                Communication: ['form 1', 'form 2'],
                                Languages: []
                            }
                        }
                    }
                ]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var intelligence = element(by.id('intelligenceListItem'));
            expect(intelligence.isDisplayed()).toBeTruthy();

            element.all(by.repeater('method in item.Magic.Intelligence.Communication'))
                .then(function (methods) {
                    expect(treasure.items.count()).toBe(1);
                    expect(methods.length).toBe(2);
                    expect(methods[0].getText()).toBe('form 1');
                    expect(methods[1].getText()).toBe('form 2');
                });

            element.all(by.repeater('language in item.Magic.Intelligence.Languages'))
                .then(function (languages) {
                    expect(treasure.items.count()).toBe(1);
                    expect(languages.length).toBe(0);
                });
        });
    });

    it('shows intelligence languages', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [
                    {
                        Name: "Karl's item",
                        Magic: {
                            Intelligence: {
                                Ego: 1,
                                Communication: ['form 1', 'form 2'],
                                Languages: ['English', 'Klingon']
                            }
                        }
                    }
                ]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var intelligence = element(by.id('intelligenceListItem'));
            expect(intelligence.isDisplayed()).toBeTruthy();

            element.all(by.repeater('language in item.Magic.Intelligence.Languages'))
                .then(function (languages) {
                    expect(treasure.items.count()).toBe(1);
                    expect(languages.length).toBe(2);
                    expect(languages[0].getText()).toBe('English');
                    expect(languages[1].getText()).toBe('Klingon');
                });
        });
    });

    it('shows intelligence senses', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [
                    {
                        Name: "Karl's item",
                        Magic: {
                            Intelligence: {
                                Ego: 1,
                                Senses: 'ALL THE SENSES'
                            }
                        }
                    }
                ]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var intelligence = element(by.id('intelligenceListItem'));
            expect(intelligence.isDisplayed()).toBeTruthy();

            var senses = element(by.binding('item.Magic.Intelligence.Senses'));
            expect(senses.getText()).toBe('Senses: ALL THE SENSES');
        });
    });

    it('shows intelligence powers', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [
                    {
                        Name: "Karl's item",
                        Magic: {
                            Intelligence: {
                                Ego: 1,
                                Powers: ['power 1', 'power 2']
                            }
                        }
                    }
                ]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var intelligence = element(by.id('intelligenceListItem'));
            expect(intelligence.isDisplayed()).toBeTruthy();

            element.all(by.repeater('power in item.Magic.Intelligence.Powers'))
                .then(function (powers) {
                    expect(treasure.items.count()).toBe(1);
                    expect(powers.length).toBe(2);
                    expect(powers[0].getText()).toBe('power 1');
                    expect(powers[1].getText()).toBe('power 2');
                });
        });
    });

    it('shows personality when there is none', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [
                    {
                        Name: "Karl's item",
                        Magic: {
                            Intelligence: {
                                Ego: 1,
                                Personality: ''
                            }
                        }
                    }
                ]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var personality = element(by.binding('item.Magic.Intelligence.Personality'));
            expect(personality.isDisplayed()).toBeTruthy();
            expect(personality.getText()).toBe('Personality: None');
        });
    });

    it('shows personality', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [
                    {
                        Name: "Karl's item",
                        Magic: {
                            Intelligence: {
                                Ego: 1,
                                Personality: 'interesting!'
                            }
                        }
                    }
                ]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var personality = element(by.binding('item.Magic.Intelligence.Personality'));
            expect(personality.isDisplayed()).toBeTruthy();
            expect(personality.getText()).toBe('Personality: interesting!');
        });
    });

    it('does not display intelligence special purpose if none', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [
                    {
                        Name: "Karl's item",
                        Magic: { Intelligence: { Ego: 1, SpecialPurpose: '' } }
                    }
                ]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var specialPurpose = element(by.binding('item.Magic.Intelligence.SpecialPurpose'));
            expect(specialPurpose.isDisplayed()).toBeFalsy();
        });
    });

    it('displays intelligence special purpose if there is one', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [
                    {
                        Name: "Karl's item",
                        Magic: { Intelligence: { Ego: 1, SpecialPurpose: 'special purpose' } }
                    }
                ]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var specialPurpose = element(by.binding('item.Magic.Intelligence.SpecialPurpose'));
            expect(specialPurpose.isDisplayed()).toBeTruthy();
            expect(specialPurpose.getText()).toBe('Special Purpose: special purpose');
        });
    });

    it('does not display intelligence dedicated power if no special purpose', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [
                    {
                        Name: "Karl's item",
                        Magic: {
                            Intelligence: {
                                Ego: 1,
                                SpecialPurpose: '',
                                DedicatedPower: 'dedicated power'
                            }
                        }
                    }
                ]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var dedicatedPower = element(by.binding('item.Magic.Intelligence.DedicatedPower'));
            expect(dedicatedPower.isDisplayed()).toBeFalsy();
        });
    });

    it('displays intelligence dedicated power if there is a special purpose', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [
                    {
                        Name: "Karl's item",
                        Magic: {
                            Intelligence: {
                                Ego: 1,
                                SpecialPurpose: 'special purpose',
                                DedicatedPower: 'dedicated power'
                            }
                        }
                    }
                ]
            };

            controllerElement.scope().$apply();
        }).then(function () {
            var dedicatedPower = element(by.binding('item.Magic.Intelligence.DedicatedPower'));
            expect(dedicatedPower.isDisplayed()).toBeTruthy();
            expect(dedicatedPower.getText()).toBe('Dedicated Power: dedicated power');
        });
    });
});