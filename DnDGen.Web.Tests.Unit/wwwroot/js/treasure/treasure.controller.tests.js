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
            itemTypes: ["first item type", "second item type"],
            powers: ["low power", "high power"],
            items: {
                'first item type': ["item 1-1", "item 1-2"],
                'second item type': ["item 2-1", "item 2-2"]
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
                return item.toString();
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
        expect(vm.itemType).toBe('first item type');
        expect(vm.power).toBe('low power');
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

        vm.validateTreasure();
        scope.$apply();

        expect(vm.validTreasure).toBeTruthy();
    });

    it('validates treasure of type - invalid', function () {
        vm.treasureType = 'invalid treasure type';
        vm.level = 9266;

        vm.validateTreasure();
        scope.$apply();

        expect(vm.validTreasure).toBeFalsy();
    });

    it('generates random mundane item', function () {
        vm.power = 'mundane';
        vm.itemType = 'item type';

        vm.generateRandomItem();
        scope.$apply();


        expect(vm.item.name).toBeNull();
        expect(vm.item.description).toBe('mundane item type');
        expect(vm.treasure).toBeNull();
    });

    it('generates random powered item', function () {
        vm.power = 'power';
        vm.itemType = 'item type';

        vm.generateRandomItem();
        scope.$apply();


        expect(vm.item.name).toBeNull();
        expect(vm.item.description).toBe('power item type');
        expect(vm.treasure).toBeNull();
    });

    it('validates random powered item - valid', function () {
        vm.power = 'power';
        vm.itemType = 'invalid item type';

        vm.validateRandomItem();
        scope.$apply();

        expect(vm.validItem).toBeTruthy();
    });

    it('validates random powered item - invalid', function () {
        vm.power = 'power';
        vm.itemType = 'invalid item type';

        vm.validateRandomItem();
        scope.$apply();

        expect(vm.validItem).toBeFalsy();
    });

    it('generates mundane item', function () {
        vm.power = 'mundane';
        vm.itemType = 'item type';
        vm.itemName = 'my mundane item';

        vm.generateItem();
        scope.$apply();

        expect(vm.item.name).toBe('my mundane item');
        expect(vm.item.description).toBe('mundane item type');
        expect(vm.treasure).toBeNull();
    });

    it('generates powered item', function () {
        vm.power = 'power';
        vm.itemType = 'item type';
        vm.itemName = 'my powered item';

        vm.generateItem();
        scope.$apply();

        expect(vm.item.name).toBe('my powered item');
        expect(vm.item.description).toBe('power item type');
        expect(vm.treasure).toBeNull();
    });

    it('validates random powered item - valid', function () {
        vm.power = 'power';
        vm.itemType = 'invalid item type';
        vm.itemName = 'my powered item';

        vm.validateRandomItem();
        scope.$apply();

        expect(vm.validItem).toBeTruthy();
    });

    it('validates random powered item - invalid', function () {
        vm.power = 'power';
        vm.itemType = 'invalid item type';
        vm.itemName = 'my powered item';

        vm.validateRandomItem();
        scope.$apply();

        expect(vm.validItem).toBeFalsy();
    });

    it('validates the treasure when the treasure type is changed - valid', function () {
        scope.$digest();

        vm.treasureType = vm.treasureModel.itemTypes[1];
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

        vm.itemType = vm.treasureModel.itemTypes[1];
        scope.$digest();

        expect(vm.validItem).toBeTruthy();
    });

    it('validates the item when the item type is changed - invalid', function () {
        scope.$digest();

        vm.itemType = 'my invalid item type';
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

        vm.itemName = vm.treasureModel.items['first item type'][1];
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

        vm.itemName = vm.treasureModel.items['first item type'][1];
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

        vm.itemType = 'my invalid item type'
        vm.itemName = null;
        scope.$digest();

        expect(vm.validItem).toBeFalsy();
    });

    it('updates the item names when the item type is changed', function () {
        vm.itemName = 'my item name';
        scope.$digest();

        vm.itemType = vm.treasureModel.itemTypes[1];
        scope.$digest();

        expect(vm.itemNames[0]).toBe('item 2-1');
        expect(vm.itemNames[1]).toBe('item 2-2');
        expect(vm.itemNames.length).toBe(2);
        expect(vm.itemName).toBeNull();
    });

    it('says it is validating while validating treasure', function () {
        vm.treasureType = 'treasure type';
        vm.level = 9266;

        vm.validateTreasure();

        expect(vm.validating).toBeTruthy();
    });

    it('says it is done validating while validating treasure', function () {
        vm.treasureType = 'treasure type';
        vm.level = 9266;

        vm.validateTreasure();
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

    it('says it is validating while validating a random item', function () {
        vm.itemType = vm.treasureModel.itemTypes[1];
        vm.power = 'power';

        vm.validateItem();

        expect(vm.validating).toBeTruthy();
    });

    it('says it is done validating while validating a random item', function () {
        vm.itemType = vm.treasureModel.itemTypes[1];
        vm.power = 'power';

        vm.validateItem();
        scope.$apply();

        expect(vm.validating).toBeFalsy();
    });

    it('says it is generating while fetching a random item', function () {
        vm.itemType = vm.treasureModel.itemTypes[1];
        vm.power = 'power';

        vm.generateItem();

        expect(vm.generating).toBeTruthy();
    });

    it('says it is done generating while fetching a random item', function () {
        vm.itemType = vm.treasureModel.itemTypes[1];
        vm.power = 'power';

        vm.generateItem();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('says it is validating while validating an item', function () {
        vm.itemType = vm.treasureModel.itemTypes[1];
        vm.power = 'power';
        vm.itemName = 'my item';

        vm.validateItem();

        expect(vm.validating).toBeTruthy();
    });

    it('says it is done validating while validating an item', function () {
        vm.itemType = vm.treasureModel.itemTypes[1];
        vm.power = 'power';
        vm.itemName = 'my item';

        vm.validateItem();
        scope.$apply();

        expect(vm.validating).toBeFalsy();
    });

    it('says it is generating while fetching an item', function () {
        vm.itemType = vm.treasureModel.itemTypes[1];
        vm.power = 'power';
        vm.itemName = 'my item';

        vm.generateItem();

        expect(vm.generating).toBeTruthy();
    });

    it('says it is done generating while fetching an item', function () {
        vm.itemType = vm.treasureModel.itemTypes[1];
        vm.power = 'power';
        vm.itemName = 'my item';

        vm.generateItem();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('says it is done validating if an error is thrown while validating treasure', function () {
        vm.treasureType = 'treasure type';
        vm.level = 666;

        vm.validateTreasure();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('shows an alert if an error is thrown while validating treasure', function () {
        vm.treasureType = 'treasure type';
        vm.level = 666;

        vm.validateTreasure();
        scope.$apply();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
    });

    it('says it is done generating if an error is thrown while fetching treasure', function () {
        vm.treasureType = 'treasure type';
        vm.level = 666;

        vm.generateTreasure();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
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

        vm.validateItem();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('shows an alert if an error is thrown while validating random item', function () {
        vm.power = 'fail power';

        vm.validateItem();
        scope.$apply();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
    });

    it('says it is done generating if an error is thrown while fetching random item', function () {
        vm.power = 'fail power';

        vm.generateItem();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
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

        vm.validateItem();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('shows an alert if an error is thrown while validating item', function () {
        vm.power = 'fail power';
        vm.itemName = 'my item';

        vm.validateItem();
        scope.$apply();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
    });

    it('says it is done generating if an error is thrown while fetching item', function () {
        vm.power = 'fail power';
        vm.itemName = 'my item';

        vm.generateItem();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
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
            description: 'Item 9266'
        };

        vm.downloadItem();
        scope.$apply();

        var fileName = 'Item ' + new Date().toString();
        expect(fileSaverServiceMock.save).toHaveBeenCalledWith('Item 9266', fileName);
    });
})