'use strict'

/// <reference path="../../_resources.js" />

describe('Dice Service', function () {
    var diceService;
    var promiseServiceMock;

    beforeEach(module('app.dice', function($provide) {
        promiseServiceMock = {};
        promiseServiceMock.getPromise = jasmine.createSpy();

        $provide.value('promiseService', promiseServiceMock);
    }));

    beforeEach(inject(function (_diceService_) {
        diceService = _diceService_;
    }));

    it('gets a standard roll', function () {
        diceService.getRoll(9266, 90210);
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('Dice/90210/9266');
    });

    it('gets a custom roll', function () {
        diceService.getCustomRoll(9266, 90210);
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('Dice/Custom/9266/90210');
    });
});