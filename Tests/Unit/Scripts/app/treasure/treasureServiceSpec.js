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
        treasureService.getTreasure(9266);
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Treasure/Generate/9266');
    });

    it('gets kind of treasure', function () {
        treasureService.getTreasureType('treasure type', 9266);
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Treasures/treasure type/Generate/9266');
    });

    it('gets a mundane item', function () {
        treasureService.getMundaneItem('item type');
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Treasures/item type/Generate');
    });

    it('gets a powered item', function () {
        treasureService.getPoweredItem('item type', 'item power');
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Treasures/item type/Generate/item power');
    });
});