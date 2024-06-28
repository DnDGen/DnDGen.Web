'use strict'

describe('Encounter Service Integration', function () {
    var encounterService;

    beforeEach(module('app.encounter'));

    beforeEach(inject(function (_encounterService_) {
        encounterService = _encounterService_;
    }));

    it('gets encounter', function () {
        var promise = encounterService.getEncounter("environment", "temperature", "time of day", 9266, [], false, false);
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });

    it('gets aquatic encounter', function () {
        var promise = encounterService.getEncounter("environment", "temperature", "time of day", 9266, [], true, false);
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });

    it('gets underground encounter', function () {
        var promise = encounterService.getEncounter("environment", "temperature", "time of day", 9266, [], false, true);
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });

    it('gets encounter with filters', function () {
        var promise = encounterService.getEncounter("environment", "temperature", "time of day", 9266, ['heffalump', 'woozle'], false, false);
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });

    it('gets encounter with all parameters', function () {
        var promise = encounterService.getEncounter("environment", "temperature", "time of day", 9266, ['heffalump', 'woozle'], true, true);
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });

    it('validates', function () {
        var promise = encounterService.getEncounter("environment", "temperature", "time of day", 9266, [], false, false);
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });

    it('validates aquatic', function () {
        var promise = encounterService.getEncounter("environment", "temperature", "time of day", 9266, [], true, false);
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });

    it('validates underground', function () {
        var promise = encounterService.getEncounter("environment", "temperature", "time of day", 9266, [], false, true);
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });

    it('validates filters', function () {
        var promise = encounterService.validateFilters("environment", "temperature", "time of day", 9266, ['heffalump', 'woozle'], false, false);
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });

    it('validates all parameters', function () {
        var promise = encounterService.getEncounter("environment", "temperature", "time of day", 9266, ['heffalump', 'woozle'], true, true);
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });
});