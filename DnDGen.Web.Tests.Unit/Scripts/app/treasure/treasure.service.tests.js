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
        var promise = treasureService.getTreasure('client id', "Treasure", 9266);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Treasure/Generate', { clientId: 'client id', treasureType: 'Treasure', level: 9266 });
    });

    it('gets kind of treasure', function () {
        var promise = treasureService.getTreasure('client id', 'treasure type', 9266);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Treasure/Generate', { clientId: 'client id', treasureType: 'treasure type', level: 9266 });
    });

    it('gets a mundane item', function () {
        var promise = treasureService.getItem('client id', 'item type', 'Mundane');
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Treasure/GenerateItem', { clientId: 'client id', itemType: 'item type', power: 'Mundane' });
    });

    it('gets a powered item', function () {
        var promise = treasureService.getItem('client id', 'item type', 'item power');
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Treasure/GenerateItem', { clientId: 'client id', itemType: 'item type', power: 'item power' });
    });
});