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
        var promise = encounterService.getEncounter('client', "environment", "temperature", "time of day", 9266, [], false, false);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Encounter/Generate', {
            clientId: 'client',
            environment: 'environment',
            level: 9266,
            temperature: "temperature",
            timeOfDay: "time of day",
            creatureTypeFilters: [],
            allowAquatic: false,
            allowUnderground: false,
        });
    });

    it('gets aquatic encounter', function () {
        var promise = encounterService.getEncounter('client', "environment", "temperature", "time of day", 9266, [], true, false);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Encounter/Generate', {
            clientId: 'client',
            environment: 'environment',
            level: 9266,
            temperature: "temperature",
            timeOfDay: "time of day",
            creatureTypeFilters: [],
            allowAquatic: true,
            allowUnderground: false,
        });
    });

    it('gets underground encounter', function () {
        var promise = encounterService.getEncounter('client', "environment", "temperature", "time of day", 9266, [], false, true);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Encounter/Generate', {
            clientId: 'client',
            environment: 'environment',
            level: 9266,
            temperature: "temperature",
            timeOfDay: "time of day",
            creatureTypeFilters: [],
            allowAquatic: false,
            allowUnderground: true,
        });
    });

    it('gets encounter with filters', function () {
        var promise = encounterService.getEncounter('client', "environment", "temperature", "time of day", 9266, ['heffalump', 'woozle'], false, false);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Encounter/Generate', {
            clientId: 'client',
            environment: 'environment',
            level: 9266,
            temperature: "temperature",
            timeOfDay: "time of day",
            creatureTypeFilters: ['heffalump', 'woozle'],
            allowAquatic: false,
            allowUnderground: false,
        });
    });

    it('validates filters', function () {
        var promise = encounterService.validateFilters('client', "environment", "temperature", "time of day", 9266, ['heffalump', 'woozle'], false, false);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Encounter/Validate', {
            clientId: 'client',
            environment: 'environment',
            level: 9266,
            temperature: "temperature",
            timeOfDay: "time of day",
            creatureTypeFilters: ['heffalump', 'woozle'],
            allowAquatic: false,
            allowUnderground: false,
        });
    });
});