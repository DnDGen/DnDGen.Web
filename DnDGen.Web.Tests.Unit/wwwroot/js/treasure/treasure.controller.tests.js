'use strict'

describe('Treasure Controller', function () {
    var vm;
    var treasureServiceMock;
    var q;
    var model;
    var scope;
    var sweetAlertServiceMock;
    var fileSaverServiceMock;
    var treasureFormatterServiceMock;

    beforeEach(module('app.treasure'));

    beforeEach(function () {
        model = {
            treasureTypes: ["first treasure", "second treasure"],
            itemTypeViewModels: [
                { itemType: "firstItemType", displayName: "first item type" },
                { itemType: "secondItemType", displayName: "second item type" }
            ],
            powers: ["low power", "high power"],
            itemNames: {
                'firstItemType': ["item 1-1", "item 1-2"],
                'secondItemType': ["item 2-1", "item 2-2"]
            }
        };

        treasureServiceMock = {
            getTreasure: function (treasureType, level) {
                var treasure = { description: treasureType + ' ' + level };
                var shouldFail = level === 666;
                return getMockedPromise(treasure, shouldFail);
            },
            validateTreasure: function (treasureType, level) {
                var valid = treasureType.indexOf('invalid') === -1 && level >= 0;
                var shouldFail = level === 666;
                return getMockedPromise(valid, shouldFail);
            },
            getItem: function (itemType, power, name) {
                var item = { description: power + ' ' + itemType };
                if (name)
                    item.name = name;

                var shouldFail = power.indexOf('fail') > -1;
                return getMockedPromise(item, shouldFail);
            },
            validateItem: function (itemType, power, name) {
                var valid = itemType.indexOf('invalid') === -1 && power.indexOf('invalid') === -1 && (!name || name.indexOf('invalid') === -1);
                var shouldFail = power.indexOf('fail') > -1;
                return getMockedPromise(valid, shouldFail);
            }
        };

        sweetAlertServiceMock = {};
        sweetAlertServiceMock.showError = jasmine.createSpy();

        fileSaverServiceMock = {};
        fileSaverServiceMock.save = jasmine.createSpy();

        treasureFormatterServiceMock = {
            formatTreasure: function (treasure) {
                return treasure.description;
            },
            formatItem: function (item) {
                return item.description;
            }
        };
    });

    function getMockedPromise(data, shouldFail) {
        var deferred = q.defer();

        if (shouldFail)
            deferred.reject();
        else
            deferred.resolve({ data: data });

        return deferred.promise;
    }

    beforeEach(inject(function ($rootScope, $controller, $q) {
        q = $q;
        scope = $rootScope.$new();
        vm = $controller('Treasure as vm', {
            $scope: scope,
            model: model,
            treasureService: treasureServiceMock,
            sweetAlertService: sweetAlertServiceMock,
            fileSaverService: fileSaverServiceMock,
            treasureFormatterService: treasureFormatterServiceMock
        });
    }));

    it('has a model', function () {
        expect(vm.treasureModel).toBe(model);
    });

    it('has initial values for inputs on load', function () {
        expect(vm.level).toBe(1);
        expect(vm.treasureType).toBe('first treasure');
        expect(vm.itemType).toBeDefined();
        expect(vm.itemType).toBe(model.itemTypeViewModels[0]);
        expect(vm.itemType.itemType).toBe('firstItemType');
        expect(vm.itemType.displayName).toBe('first item type');
        expect(vm.power).toBe('low power');
        expect(vm.itemNames).toBe(model.itemNames['firstItemType']);
        expect(vm.itemName).toBeNull();
        expect(vm.validTreasure).toBeFalsy();
        expect(vm.validItem).toBeFalsy();
    });

    it('has an empty treasure on load', function () {
        expect(vm.treasure).toBeNull();
        expect(vm.item).toBeNull();
    });

    it('is not generating on load', function () {
        expect(vm.generating).toBeFalsy();
        expect(vm.validating).toBeFalsy();
    });

    it('generates treasure', function () {
        vm.treasureType = 'Treasure';
        vm.level = 9266;

        vm.generateTreasure();
        scope.$apply();

        expect(vm.treasure.description).toBe('Treasure 9266');
        expect(vm.item).toBeNull();
    });

    it('generates treasure of type', function () {
        vm.treasureType = 'treasure type';
        vm.level = 9266;

        vm.generateTreasure();
        scope.$apply();

        expect(vm.treasure.description).toBe('treasure type 9266');
        expect(vm.item).toBeNull();
    });

    it('validates treasure of type - valid', function () {
        vm.treasureType = 'treasure type';
        vm.level = 9266;

        scope.$apply();

        expect(vm.validTreasure).toBeTruthy();
    });

    it('validates treasure of type - invalid (treasure type)', function () {
        vm.treasureType = 'invalid treasure type';
        vm.level = 9266;

        scope.$apply();

        expect(vm.validTreasure).toBeFalsy();
    });

    it('validates treasure of type - invalid (level)', function () {
        vm.treasureType = 'treasure type';
        vm.level = 666;

        scope.$apply();

        expect(vm.validTreasure).toBeFalsy();
    });

    it('generates random mundane item', function () {
        vm.power = 'mundane';
        vm.itemType = { itemType: 'myItemType', displayName: 'my item type' };

        vm.generateItem();
        scope.$apply();

        expect(vm.item.name).toBeFalsy(); //This checks if not null or undefined
        expect(vm.item.description).toBe('mundane myItemType');
        expect(vm.treasure).toBeNull();
    });

    it('generates random powered item', function () {
        vm.power = 'power';
        vm.itemType = { itemType: 'myItemType', displayName: 'my item type' };

        vm.generateItem();
        scope.$apply();

        expect(vm.item.name).toBeFalsy(); //This checks if not null or undefined
        expect(vm.item.description).toBe('power myItemType');
        expect(vm.treasure).toBeNull();
    });

    it('validates random mundane item - valid', function () {
        vm.power = 'Mundane';
        vm.itemType = { itemType: 'myItemType', displayName: 'my item type' };

        scope.$apply();

        expect(vm.validItem).toBeTruthy();
    });

    it('validates random mundane item - invalid (item type)', function () {
        vm.power = 'Mundane';
        vm.itemType = { itemType: 'invalidItemType', displayName: 'invalid item type' };

        scope.$apply();

        expect(vm.validItem).toBeFalsy();
    });

    it('validates random powered item - valid', function () {
        vm.power = 'power';
        vm.itemType = { itemType: 'myItemType', displayName: 'my item type' };

        scope.$apply();

        expect(vm.validItem).toBeTruthy();
    });

    it('validates random powered item - invalid (power)', function () {
        vm.power = 'invalid power';
        vm.itemType = { itemType: 'myItemType', displayName: 'my item type' };

        scope.$apply();

        expect(vm.validItem).toBeFalsy();
    });

    it('validates random powered item - invalid (item type)', function () {
        vm.power = 'power';
        vm.itemType = { itemType: 'invalidItemType', displayName: 'invalid item type' };

        scope.$apply();

        expect(vm.validItem).toBeFalsy();
    });

    it('generates mundane item', function () {
        vm.power = 'mundane';
        vm.itemType = { itemType: 'myItemType', displayName: 'my item type' };
        vm.itemName = 'my mundane item';

        vm.generateItem();
        scope.$apply();

        expect(vm.item.name).toBe('my mundane item');
        expect(vm.item.description).toBe('mundane myItemType');
        expect(vm.treasure).toBeNull();
    });

    it('generates powered item', function () {
        vm.power = 'power';
        vm.itemType = { itemType: 'myItemType', displayName: 'my item type' };
        vm.itemName = 'my powered item';

        vm.generateItem();
        scope.$apply();

        expect(vm.item.name).toBe('my powered item');
        expect(vm.item.description).toBe('power myItemType');
        expect(vm.treasure).toBeNull();
    });

    it('validates mundane item - valid', function () {
        vm.power = 'Mundane';
        vm.itemType = { itemType: 'myItemType', displayName: 'my item type' };
        vm.itemName = 'my mundane item';

        scope.$apply();

        expect(vm.validItem).toBeTruthy();
    });

    it('validates mundane item - invalid (item type)', function () {
        vm.power = 'Mundane';
        vm.itemType = { itemType: 'invalidItemType', displayName: 'invalid item type' };
        vm.itemName = 'my mundane item';

        scope.$apply();

        expect(vm.validItem).toBeFalsy();
    });

    it('validates mundane item - invalid (item name)', function () {
        vm.power = 'Mundane';
        vm.itemType = { itemType: 'myItemType', displayName: 'my item type' };
        scope.$apply();

        expect(vm.validItem).toBeTruthy();

        vm.itemName = 'my invalid mundane item';
        scope.$apply();

        expect(vm.validItem).toBeFalsy();
    });

    it('validates powered item - valid', function () {
        vm.power = 'power';
        vm.itemType = { itemType: 'myItemType', displayName: 'my item type' };
        vm.itemName = 'my powered item';

        scope.$apply();

        expect(vm.validItem).toBeTruthy();
    });

    it('validates powered item - invalid (power)', function () {
        vm.power = 'invalid power';
        vm.itemType = { itemType: 'myItemType', displayName: 'my item type' };
        vm.itemName = 'my powered item';

        scope.$apply();

        expect(vm.validItem).toBeFalsy();
    });

    it('validates powered item - invalid (item type)', function () {
        vm.power = 'power';
        vm.itemType = { itemType: 'invalidItemType', displayName: 'invalid item type' };
        vm.itemName = 'my powered item';

        scope.$apply();

        expect(vm.validItem).toBeFalsy();
    });

    it('validates powered item - invalid (item name)', function () {
        vm.power = 'power';
        vm.itemType = { itemType: 'myItemType', displayName: 'my item type' };
        scope.$apply();

        expect(vm.validItem).toBeTruthy();

        vm.itemName = 'my invalid powered item';
        scope.$apply();

        expect(vm.validItem).toBeFalsy();
    });

    it('validates the treasure when the treasure type is changed - valid', function () {
        scope.$digest();

        vm.treasureType = vm.treasureModel.itemTypeViewModels[1];
        scope.$digest();

        expect(vm.validTreasure).toBeTruthy();
    });

    it('validates the treasure when the treasure type is changed - invalid', function () {
        scope.$digest();

        vm.treasureType = 'my invalid treasure type';
        scope.$digest();

        expect(vm.validTreasure).toBeFalsy();
    });

    it('validates the treasure when the level is changed - valid', function () {
        scope.$digest();

        vm.level = 90120;
        scope.$digest();

        expect(vm.validTreasure).toBeTruthy();
    });

    it('validates the treasure when the level is changed - invalid', function () {
        scope.$digest();

        vm.level = -42;
        scope.$digest();

        expect(vm.validTreasure).toBeFalsy();
    });

    it('validates the item when the item type is changed - valid', function () {
        scope.$digest();

        vm.itemType = vm.treasureModel.itemTypeViewModels[1];
        scope.$digest();

        expect(vm.validItem).toBeTruthy();
    });

    it('validates the item when the item type is changed - invalid', function () {
        scope.$digest();

        vm.itemType.itemType = 'my invalid item type';
        scope.$digest();

        expect(vm.validItem).toBeFalsy();
    });

    it('validates the item when the power is changed - valid', function () {
        scope.$digest();

        vm.power = vm.treasureModel.powers[1];
        scope.$digest();

        expect(vm.validItem).toBeTruthy();
    });

    it('validates the item when the power is changed - invalid', function () {
        scope.$digest();

        vm.power = 'my invalid power';
        scope.$digest();

        expect(vm.validItem).toBeFalsy();
    });

    it('validates the item when the name is entered - valid', function () {
        vm.itemName = null;
        scope.$digest();

        vm.itemName = vm.treasureModel.itemNames['firstItemType'][1];
        scope.$digest();

        expect(vm.validItem).toBeTruthy();
    });

    it('validates the item when the name is entered - invalid', function () {
        vm.itemName = null;
        scope.$digest();

        vm.itemName = 'my invalid item name';
        scope.$digest();

        expect(vm.validItem).toBeFalsy();
    });

    it('validates the item when the name is changed - valid', function () {
        vm.itemName = 'my item name';
        scope.$digest();

        vm.itemName = vm.treasureModel.itemNames['firstItemType'][1];
        scope.$digest();

        expect(vm.validItem).toBeTruthy();
    });

    it('validates the item when the name is changed - invalid', function () {
        vm.itemName = 'my item name';
        scope.$digest();

        vm.itemName = 'my invalid item name';
        scope.$digest();

        expect(vm.validItem).toBeFalsy();
    });

    it('validates the item when the name is removed - valid', function () {
        vm.itemName = 'my item name';
        scope.$digest();

        vm.itemName = null;
        scope.$digest();

        expect(vm.validItem).toBeTruthy();
    });

    it('validates the item when the name is removed - invalid', function () {
        vm.itemName = 'my item name';
        scope.$digest();

        vm.itemType.itemType = 'my invalid item type'
        vm.itemName = null;
        scope.$digest();

        expect(vm.validItem).toBeFalsy();
    });

    it('updates the item names when the item type is changed', function () {
        vm.itemName = 'my item name';
        scope.$digest();

        vm.itemType = vm.treasureModel.itemTypeViewModels[1];
        scope.$digest();

        expect(vm.itemNames[0]).toBe('item 2-1');
        expect(vm.itemNames[1]).toBe('item 2-2');
        expect(vm.itemNames.length).toBe(2);
        expect(vm.itemName).toBeNull();
    });

    //IGNORE: the validating variable is set and unset in the span of the $digest, so we can't catch it truthy in the test
    xit('says it is validating while validating treasure', function () {
        vm.treasureType = 'treasure type';
        vm.level = 9266;

        scope.$digest();

        expect(vm.validating).toBeTruthy();
    });

    it('says it is done validating while validating treasure', function () {
        vm.treasureType = 'treasure type';
        vm.level = 9266;

        scope.$apply();

        expect(vm.validating).toBeFalsy();
    });

    it('says it is generating while fetching treasure', function () {
        vm.treasureType = 'treasure type';
        vm.level = 9266;

        vm.generateTreasure();

        expect(vm.generating).toBeTruthy();
    });

    it('says it is done generating while fetching treasure', function () {
        vm.treasureType = 'treasure type';
        vm.level = 9266;

        vm.generateTreasure();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    //IGNORE: the validating variable is set and unset in the span of the $digest, so we can't catch it truthy in the test
    xit('says it is validating while validating a random item', function () {
        vm.itemType = vm.treasureModel.itemTypeViewModels[1];
        vm.power = 'power';

        scope.$digest();

        expect(vm.validating).toBeTruthy();
    });

    it('says it is done validating while validating a random item', function () {
        vm.itemType = vm.treasureModel.itemTypeViewModels[1];
        vm.power = 'power';

        scope.$apply();

        expect(vm.validating).toBeFalsy();
    });

    it('says it is generating while fetching a random item', function () {
        vm.itemType = vm.treasureModel.itemTypeViewModels[1];
        vm.power = 'power';

        vm.generateItem();

        expect(vm.generating).toBeTruthy();
    });

    it('says it is done generating while fetching a random item', function () {
        vm.itemType = vm.treasureModel.itemTypeViewModels[1];
        vm.power = 'power';

        vm.generateItem();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    //IGNORE: the validating variable is set and unset in the span of the $digest, so we can't catch it truthy in the test
    xit('says it is validating while validating an item', function () {
        vm.itemType = vm.treasureModel.itemTypeViewModels[1];
        vm.power = 'power';
        vm.itemName = 'my item';

        scope.$digest();

        expect(vm.validating).toBeTruthy();
    });

    it('says it is done validating while validating an item', function () {
        vm.itemType = vm.treasureModel.itemTypeViewModels[1];
        vm.power = 'power';
        vm.itemName = 'my item';

        scope.$apply();

        expect(vm.validating).toBeFalsy();
    });

    it('says it is generating while fetching an item', function () {
        vm.itemType = vm.treasureModel.itemTypeViewModels[1];
        vm.power = 'power';
        vm.itemName = 'my item';

        vm.generateItem();

        expect(vm.generating).toBeTruthy();
    });

    it('says it is done generating while fetching an item', function () {
        vm.itemType = vm.treasureModel.itemTypeViewModels[1];
        vm.power = 'power';
        vm.itemName = 'my item';

        vm.generateItem();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
        expect(vm.validating).toBeFalsy();
    });

    it('says it is done validating if an error is thrown while validating treasure', function () {
        vm.treasureType = 'my treasure type';
        vm.level = 666;

        vm.validTreasure = true;

        scope.$apply();

        expect(vm.generating).toBeFalsy();
        expect(vm.validating).toBeFalsy();
        expect(vm.validTreasure).toBeFalsy();
    });

    it('do not show an alert if an error is thrown while validating treasure', function () {
        vm.treasureType = 'treasure type';
        vm.level = 666;

        vm.validTreasure = true;

        scope.$apply();

        expect(vm.validTreasure).toBeFalsy();
        expect(sweetAlertServiceMock.showError).not.toHaveBeenCalled();
    });

    it('says it is done generating if an error is thrown while fetching treasure', function () {
        vm.treasureType = 'treasure type';
        vm.level = 666;

        vm.generateTreasure();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
        expect(vm.validating).toBeFalsy();
    });

    it('shows an alert if an error is thrown while fetching treasure', function () {
        vm.treasureType = 'treasure type';
        vm.level = 666;

        vm.generateTreasure();
        scope.$apply();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
    });

    it('says it is done validating if an error is thrown while validating random item', function () {
        vm.power = 'fail power';

        vm.validTreasure = true;
        vm.validItem = true;

        scope.$apply();

        expect(vm.generating).toBeFalsy();
        expect(vm.validating).toBeFalsy();
        expect(vm.validTreasure).toBeFalsy();
        expect(vm.validItem).toBeFalsy();
    });

    it('do not show an alert if an error is thrown while validating random item', function () {
        vm.power = 'fail power';

        scope.$apply();

        expect(sweetAlertServiceMock.showError).not.toHaveBeenCalled();
    });

    it('says it is done generating if an error is thrown while fetching random item', function () {
        vm.power = 'fail power';

        vm.generateItem();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
        expect(vm.validating).toBeFalsy();
    });

    it('shows an alert if an error is thrown while fetching random item', function () {
        vm.power = 'fail power';

        vm.generateItem();
        scope.$apply();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
    });

    it('says it is done validating if an error is thrown while validating item', function () {
        vm.power = 'fail power';
        vm.itemName = 'my item';

        vm.validTreasure = true;
        vm.validItem = true;

        scope.$apply();

        expect(vm.generating).toBeFalsy();
        expect(vm.validating).toBeFalsy();
        expect(vm.validTreasure).toBeFalsy();
        expect(vm.validItem).toBeFalsy();
    });

    it('do not show an alert if an error is thrown while validating item', function () {
        vm.power = 'fail power';
        vm.itemName = 'my item';

        scope.$apply();

        expect(sweetAlertServiceMock.showError).not.toHaveBeenCalled();
    });

    it('says it is done generating if an error is thrown while fetching item', function () {
        vm.power = 'fail power';
        vm.itemName = 'my item';

        vm.generateItem();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
        expect(vm.validating).toBeFalsy();
    });

    it('shows an alert if an error is thrown while fetching item', function () {
        vm.power = 'fail power';
        vm.itemName = 'my item';

        vm.generateItem();
        scope.$apply();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
    });

    it('clears the treasure if an error is thrown while fetching treasure', function () {
        vm.treasureType = 'treasure type';
        vm.level = 9266;

        vm.generateTreasure();
        scope.$apply();

        vm.level = 666;

        vm.generateTreasure();
        scope.$apply();

        expect(vm.treasure).toBeNull();
    });

    it('clears the item if an error is thrown while fetching random item', function () {
        vm.generateItem();
        scope.$apply();

        vm.power = 'fail power';

        vm.generateItem();
        scope.$apply();

        expect(vm.item).toBeNull();
    });

    it('clears the item if an error is thrown while fetching item', function () {
        vm.generateItem();
        scope.$apply();

        vm.power = 'fail power';
        vm.itemName = "my item";

        vm.generateItem();
        scope.$apply();

        expect(vm.item).toBeNull();
    });

    it('downloads treasure', function () {
        vm.treasure = {
            description: 'Treasure 9266'
        };

        vm.downloadTreasure();
        scope.$apply();

        var fileName = 'Treasure ' + new Date().toString();
        expect(fileSaverServiceMock.save).toHaveBeenCalledWith('Treasure 9266', fileName);
    });

    it('downloads item', function () {
        vm.item = {
            name: 'My Item',
            description: 'Item 9266'
        };

        vm.downloadItem();
        scope.$apply();

        var fileName = 'Item (My Item) ' + new Date().toString();
        expect(fileSaverServiceMock.save).toHaveBeenCalledWith('Item 9266', fileName);
    });
})