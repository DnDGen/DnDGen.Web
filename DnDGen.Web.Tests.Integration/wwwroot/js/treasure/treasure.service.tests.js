'use strict'

describe('Treasure Service Integration', function () {
    var treasureService;

    beforeEach(module('app.treasure'));

    beforeEach(inject(function (_treasureService_) {
        treasureService = _treasureService_;
    }));

    it('gets treasure', function () {
        var promise = treasureService.getTreasure("Treasure", 9266);
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });

    it('gets kind of treasure', function () {
        var promise = treasureService.getTreasure('myTreasure', 9266);
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });

    it('validates the treasure parameters', function () {
        var promise = treasureService.validateTreasure('myTreasure', 9266);
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });

    it('gets a random mundane item', function () {
        var promise = treasureService.getItem('myItemType', 'Mundane');
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });

    it('gets a random powered item', function () {
        var promise = treasureService.getItem('myItemType', 'myPower');
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });

    it('validates the random item parameters', function () {
        var promise = treasureService.validateItem('myItemType', 'myPower');
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });

    it('gets a mundane item', function () {
        var promise = treasureService.getItem('myItemType', 'Mundane', 'my item');
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });

    it('gets a powered item', function () {
        var promise = treasureService.getItem('myItemType', 'myPower', 'my item');
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });

    it('validates the item parameters', function () {
        var promise = treasureService.validateItem('myItemType', 'myPower', 'my item');
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });
});