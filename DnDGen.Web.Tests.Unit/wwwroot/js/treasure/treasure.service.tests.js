'use strict'

describe('Treasure Service', function () {
    var treasureService;
    var promiseServiceMock;

    beforeEach(module('app.treasure', function ($provide) {
        promiseServiceMock = {};
        promiseServiceMock.getPromise = jasmine.createSpy();

        $provide.value('promiseService', promiseServiceMock);
    }));

    beforeEach(inject(function (_treasureService_) {
        treasureService = _treasureService_;
    }));

    it('gets treasure', function () {
        var promise = treasureService.getTreasure("Treasure", 9266);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v1/Treasure/level/9266/generate');
    });

    it('gets kind of treasure', function () {
        var promise = treasureService.getTreasure('myTreasure', 9266);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v1/myTreasure/level/9266/generate');
    });

    it('validates the treasure parameters', function () {
        var promise = treasureService.validateTreasure('myTreasure', 9266);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v1/myTreasure/level/9266/validate');
    });

    it('gets a random mundane item', function () {
        var promise = treasureService.getRandomItem('myItemType', 'Mundane');
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v1/item/myItemType/power/Mundane/generate');
    });

    it('gets a random powered item', function () {
        var promise = treasureService.getRandomItem('myItemType', 'myPower');
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v1/item/myItemType/power/myPower/generate');
    });

    it('validates the random item parameters', function () {
        var promise = treasureService.validateRandomItem('myItemType', 'myPower');
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v1/item/myItemType/power/myPower/validate');
    });

    it('gets a mundane item', function () {
        var promise = treasureService.getItem('myItemType', 'Mundane', 'my item');
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v1/item/myItemType/power/Mundane/generate', { name: 'my item' });
    });

    it('gets a powered item', function () {
        var promise = treasureService.getItem('myItemType', 'myPower', 'my item');
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v1/item/myItemType/power/myPower/generate', { name: 'my item' });
    });

    it('validates the item parameters', function () {
        var promise = treasureService.validateItem('myItemType', 'myPower', 'my item');
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v1/item/myItemType/power/myPower/validate', { name: 'my item' });
    });
});