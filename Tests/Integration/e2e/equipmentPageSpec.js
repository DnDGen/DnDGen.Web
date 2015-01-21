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

    //INFO: Wanted to have tests that verified treasure is generated, but since it is chance,
    //and nothing coming back is a legitimate response, the tests cannot be guaranteed
    //to always pass

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
            var intelligence = element(by.id('intelligenceListItem'))
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
            var intelligence = element(by.id('intelligenceListItem'))
            expect(intelligence.isDisplayed()).toBeTruthy();
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
            var specialPurpose = element(by.binding('item.Magic.Intelligence.SpecialPurpose'))
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
            var specialPurpose = element(by.binding('item.Magic.Intelligence.SpecialPurpose'))
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
            var dedicatedPower = element(by.binding('item.Magic.Intelligence.DedicatedPower'))
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
            var dedicatedPower = element(by.binding('item.Magic.Intelligence.DedicatedPower'))
            expect(dedicatedPower.isDisplayed()).toBeTruthy();
            expect(dedicatedPower.getText()).toBe('Dedicated Power: dedicated power');
        });
    });

    it('should not display special abilities if none', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Equipment as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                Items: [ { Name: "Karl's item", Magic: { SpecialAbilities: [] } } ]
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
});