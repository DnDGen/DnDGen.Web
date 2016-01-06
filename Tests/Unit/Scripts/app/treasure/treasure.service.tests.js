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
        var promise = treasureService.getTreasure(9266);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Treasure/Generate/9266');
    });

    it('gets kind of treasure', function () {
        var promise = treasureService.getTreasureType('treasure type', 9266);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Treasures/treasure type/Generate/9266');
    });

    it('gets a mundane item', function () {
        var promise = treasureService.getMundaneItem('item type');
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Treasures/item type/Generate');
    });

    it('gets a powered item', function () {
        var promise = treasureService.getPoweredItem('item type', 'item power');
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Treasures/item type/Generate/item power');
    });
});