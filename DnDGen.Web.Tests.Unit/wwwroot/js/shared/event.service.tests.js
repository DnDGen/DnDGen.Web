'use strict'

describe('Event Service', function () {
    var eventService;
    var promiseServiceMock;

    beforeEach(module('app.shared', function ($provide) {
        promiseServiceMock = {};
        promiseServiceMock.getPromise = jasmine.createSpy();
        promiseServiceMock.postPromise = jasmine.createSpy();

        $provide.value('promiseService', promiseServiceMock);
    }));

    beforeEach(inject(function (_eventService_) {
        eventService = _eventService_;
    }));

    it('gets client ID', function () {
        var promise = eventService.getClientId();
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Event/ClientId');
    });

    it('gets all events', function () {
        var promise = eventService.getEvents('client id');
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Event/All', { clientId: 'client id' });
    });

    it('clears events', function () {
        var promise = eventService.clearEvents('client id');
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.postPromise).toHaveBeenCalledWith('/Event/Clear', { clientId: 'client id' });
    });
});