'use strict'

describe('Encounter Service', function () {
    var encounterService;
    var promiseServiceMock;

    beforeEach(module('app.encounter', function ($provide) {
        promiseServiceMock = {};
        promiseServiceMock.getPromise = jasmine.createSpy();

        $provide.value('promiseService', promiseServiceMock);
    }));

    beforeEach(inject(function (_encounterService_) {
        encounterService = _encounterService_;
    }));

    it('gets encounter', function () {
        var promise = encounterService.getEncounter("environment", 9266);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Encounter/Generate?environment=environment&level=9266');
    });

    it('encodes environment in the url', function () {
        var promise = encounterService.getEncounter("dungeon environment", 9266);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Encounter/Generate?environment=dungeon%20environment&level=9266');
    });
});