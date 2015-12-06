'use strict'

/// <reference path="../../_resources.js" />

describe('Roll Service', function () {
    var rollService;
    var promiseServiceMock;

    beforeEach(module('app.roll', function($provide) {
        promiseServiceMock = {};
        promiseServiceMock.getPromise = jasmine.createSpy();

        $provide.value('promiseService', promiseServiceMock);
    }));

    beforeEach(inject(function (_rollService_) {
        rollService = _rollService_;
    }));

    it('gets a standard roll', function () {
        rollService.getRoll(9266, 90210);
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Roll/90210/9266');
    });

    it('gets a custom roll', function () {
        rollService.getCustomRoll(9266, 90210);
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Roll/Custom/9266/90210');
    });
});