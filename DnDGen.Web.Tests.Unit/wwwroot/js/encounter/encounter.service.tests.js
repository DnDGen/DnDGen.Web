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
        var promise = encounterService.getEncounter("environment", "temperature", "time of day", 9266, [], false, false);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://encounter.dndgen.com/api/v1/encounter/temperature/environment/time of day/level/9266/generate', {
            creatureTypeFilters: [],
            allowAquatic: false,
            allowUnderground: false,
        });
    });

    it('gets aquatic encounter', function () {
        var promise = encounterService.getEncounter("environment", "temperature", "time of day", 9266, [], true, false);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://encounter.dndgen.com/api/v1/encounter/temperature/environment/time of day/level/9266/generate', {
            creatureTypeFilters: [],
            allowAquatic: true,
            allowUnderground: false,
        });
    });

    it('gets underground encounter', function () {
        var promise = encounterService.getEncounter("environment", "temperature", "time of day", 9266, [], false, true);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://encounter.dndgen.com/api/v1/encounter/temperature/environment/time of day/level/9266/generate', {
            creatureTypeFilters: [],
            allowAquatic: false,
            allowUnderground: true,
        });
    });

    it('gets encounter with filters', function () {
        var promise = encounterService.getEncounter("environment", "temperature", "time of day", 9266, ['heffalump', 'woozle'], false, false);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://encounter.dndgen.com/api/v1/encounter/temperature/environment/time of day/level/9266/generate', {
            creatureTypeFilters: ['heffalump', 'woozle'],
            allowAquatic: false,
            allowUnderground: false,
        });
    });

    it('gets encounter with all parameters', function () {
        var promise = encounterService.getEncounter("environment", "temperature", "time of day", 9266, ['heffalump', 'woozle'], true, true);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://encounter.dndgen.com/api/v1/encounter/temperature/environment/time of day/level/9266/generate', {
            creatureTypeFilters: ['heffalump', 'woozle'],
            allowAquatic: true,
            allowUnderground: true,
        });
    });

    it('validates', function () {
        var promise = encounterService.getEncounter("environment", "temperature", "time of day", 9266, [], false, false);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://encounter.dndgen.com/api/v1/encounter/temperature/environment/time of day/level/9266/validate', {
            creatureTypeFilters: [],
            allowAquatic: false,
            allowUnderground: false,
        });
    });

    it('validates aquatic', function () {
        var promise = encounterService.getEncounter("environment", "temperature", "time of day", 9266, [], true, false);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://encounter.dndgen.com/api/v1/encounter/temperature/environment/time of day/level/9266/validate', {
            creatureTypeFilters: [],
            allowAquatic: true,
            allowUnderground: false,
        });
    });

    it('validates underground', function () {
        var promise = encounterService.getEncounter("environment", "temperature", "time of day", 9266, [], false, true);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://encounter.dndgen.com/api/v1/encounter/temperature/environment/time of day/level/9266/validate', {
            creatureTypeFilters: [],
            allowAquatic: false,
            allowUnderground: true,
        });
    });

    it('validates filters', function () {
        var promise = encounterService.validateFilters("environment", "temperature", "time of day", 9266, ['heffalump', 'woozle'], false, false);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://encounter.dndgen.com/api/v1/encounter/temperature/environment/time of day/level/9266/validate', {
            creatureTypeFilters: ['heffalump', 'woozle'],
            allowAquatic: false,
            allowUnderground: false,
        });
    });

    it('validates all parameters', function () {
        var promise = encounterService.getEncounter("environment", "temperature", "time of day", 9266, ['heffalump', 'woozle'], true, true);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://encounter.dndgen.com/api/v1/encounter/temperature/environment/time of day/level/9266/validate', {
            creatureTypeFilters: ['heffalump', 'woozle'],
            allowAquatic: true,
            allowUnderground: true,
        });
    });
});