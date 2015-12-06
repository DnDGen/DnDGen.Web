'use strict'

describe('Randomizer Service', function () {
    var randomizerService;
    var promiseServiceMock;
    var urlRegex;

    beforeEach(module('app.character', function($provide) {
        promiseServiceMock = {};
        promiseServiceMock.getPromise = jasmine.createSpy();

        $provide.value('promiseService', promiseServiceMock);
    }));

    beforeEach(inject(function (_randomizerService_) {
        randomizerService = _randomizerService_;
    }));

    beforeEach(function () {
        urlRegex = /^\/Characters\/Randomizers\/Verify\?\w+=(\w|%20)+(&\w+=(\w|%20)+)*\r?$/;
    });

    it('verifies randomizers are compatible', function () {
        randomizerService.verify("any", "set", "any", "set", "any", 1, false, "any", "set", "any", true, "set");
        var calledUrl = promiseServiceMock.getPromise.calls.mostRecent().args[0];
        expect(calledUrl).toMatch(urlRegex);
        expect(calledUrl).toMatch(/alignmentRandomizerType=any/);
        expect(calledUrl).toMatch(/classNameRandomizerType=any/);
        expect(calledUrl).toMatch(/levelRandomizerType=any/);
        expect(calledUrl).toMatch(/baseRaceRandomizerType=any/);
        expect(calledUrl).toMatch(/metaraceRandomizerType=any/);
        expect(calledUrl).toMatch(/setAlignment=set/);
        expect(calledUrl).toMatch(/setClassName=set/);
        expect(calledUrl).toMatch(/setLevel=1/);
        expect(calledUrl).toMatch(/allowLevelAdjustments=false/);
        expect(calledUrl).toMatch(/setBaseRace=set/);
        expect(calledUrl).toMatch(/forceMetarace=true/);
        expect(calledUrl).toMatch(/setMetarace=set/);
    });

    it('encodes the uri', function () {
        randomizerService.verify("alignment randomizer type", "set alignment", "class name randomizer type", "set class name", "level randomizer type", 9266, false, "base race randomizer type", "set base race", "metarace randomizer type", true, "set metarace");
        var calledUrl = promiseServiceMock.getPromise.calls.mostRecent().args[0];
        expect(calledUrl).toMatch(urlRegex);
        expect(calledUrl).toMatch(/alignmentRandomizerType=alignment%20randomizer%20type/);
        expect(calledUrl).toMatch(/classNameRandomizerType=class%20name%20randomizer%20type/);
        expect(calledUrl).toMatch(/levelRandomizerType=level%20randomizer%20type/);
        expect(calledUrl).toMatch(/baseRaceRandomizerType=base%20race%20randomizer%20type/);
        expect(calledUrl).toMatch(/metaraceRandomizerType=metarace%20randomizer%20type/);
        expect(calledUrl).toMatch(/setAlignment=set%20alignment/);
        expect(calledUrl).toMatch(/setClassName=set%20class%20name/);
        expect(calledUrl).toMatch(/setLevel=9266/);
        expect(calledUrl).toMatch(/allowLevelAdjustments=false/);
        expect(calledUrl).toMatch(/setBaseRace=set%20base%20race/);
        expect(calledUrl).toMatch(/forceMetarace=true/);
        expect(calledUrl).toMatch(/setMetarace=set%20metarace/);
    });

    it('does not send default values', function () {
        randomizerService.verify("any", "", "any", "", "any", 0, true, "any", "", "any", false, "");
        var calledUrl = promiseServiceMock.getPromise.calls.mostRecent().args[0];
        expect(calledUrl).toMatch(urlRegex);
        expect(calledUrl).toMatch(/alignmentRandomizerType=any/);
        expect(calledUrl).toMatch(/classNameRandomizerType=any/);
        expect(calledUrl).toMatch(/levelRandomizerType=any/);
        expect(calledUrl).toMatch(/baseRaceRandomizerType=any/);
        expect(calledUrl).toMatch(/metaraceRandomizerType=any/);
        expect(calledUrl).not.toMatch(/setAlignment=/);
        expect(calledUrl).not.toMatch(/setClassName=/);
        expect(calledUrl).not.toMatch(/setLevel=/);
        expect(calledUrl).not.toMatch(/allowLevelAdjustments=/);
        expect(calledUrl).not.toMatch(/setBaseRace=/);
        expect(calledUrl).not.toMatch(/forceMetarace=/);
        expect(calledUrl).not.toMatch(/setMetarace=/);
    });
});