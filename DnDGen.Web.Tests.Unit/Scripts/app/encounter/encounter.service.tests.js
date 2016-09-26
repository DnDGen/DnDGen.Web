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
        var promise = encounterService.getEncounter("environment", "temperature", "time of day", 9266, []);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Encounter/Generate', {
            environment: 'environment',
            level: 9266,
            temperature: "temperature",
            timeOfDay: "time of day",
            filters: []
        });
    });

    it('encodes environment in the url', function () {
        var promise = encounterService.getEncounter("dungeon environment", "temperature", "time of day", 9266, []);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Encounter/Generate', {
            environment: 'dungeon environment',
            level: 9266,
            temperature: "temperature",
            timeOfDay: "time of day",
            filters: []
        });
    });

    it('gets encounter with filters', function () {
        var promise = encounterService.getEncounter("environment", "temperature", "time of day", 9266, ['heffalump', 'woozle']);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Encounter/Generate', {
            environment: 'environment',
            level: 9266,
            temperature: "temperature",
            timeOfDay: "time of day",
            filters: ['heffalump', 'woozle']
        });
    });

    it('validates filters', function () {
        var promise = encounterService.validateFilters("environment", "temperature", "time of day", 9266, ['heffalump', 'woozle']);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Encounter/Validate', {
            environment: 'environment',
            level: 9266,
            temperature: "temperature",
            timeOfDay: "time of day",
            filters: ['heffalump', 'woozle']
        });
    });
});