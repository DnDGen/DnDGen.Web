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
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Treasure/Generate', { treasureType: 'Treasure', level: 9266 });
    });

    it('gets kind of treasure', function () {
        var promise = treasureService.getTreasure('treasure type', 9266);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Treasure/Generate', { treasureType: 'treasure type', level: 9266 });
    });

    it('gets a mundane item', function () {
        var promise = treasureService.getItem('item type', 'Mundane');
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Treasure/GenerateItem', { itemType: 'item type', power: 'Mundane' });
    });

    it('gets a powered item', function () {
        var promise = treasureService.getItem('item type', 'item power');
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Treasure/GenerateItem', { itemType: 'item type', power: 'item power' });
    });
});