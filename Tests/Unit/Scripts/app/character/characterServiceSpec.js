'use strict'

/// <reference path="../../_resources.js" />

describe('Character Service', function () {
    var characterService;
    var promiseServiceMock;
    var urlRegex

    beforeEach(module('app.character', function($provide) {
        promiseServiceMock = {};
        promiseServiceMock.getPromise = jasmine.createSpy();

        $provide.value('promiseService', promiseServiceMock);
    }));

    beforeEach(inject(function (_characterService_) {
        characterService = _characterService_;
    }));

    beforeEach(function () {
        urlRegex = /^\/Character\/Generate\?\w+=(\w|%20)+(&\w+=(\w|%20)+)*\r?$/;
    });

    it('verifies randomizers are compatible', function () {
        characterService.generate("any", "set", "any", "set", "any", 1, "any", "set", "any", true, "set", "raw", 2, 3, 4, 5, 6, 7);
        var calledUrl = promiseServiceMock.getPromise.calls.mostRecent().args[0];
        expect(calledUrl).toMatch(urlRegex);
        expect(calledUrl).toMatch(/alignmentRandomizerType=any/);
        expect(calledUrl).toMatch(/classNameRandomizerType=any/);
        expect(calledUrl).toMatch(/levelRandomizerType=any/);
        expect(calledUrl).toMatch(/baseRaceRandomizerType=any/);
        expect(calledUrl).toMatch(/metaraceRandomizerType=any/);
        expect(calledUrl).toMatch(/statsRandomizerType=raw/);
        expect(calledUrl).toMatch(/setAlignment=set/);
        expect(calledUrl).toMatch(/setClassName=set/);
        expect(calledUrl).toMatch(/setLevel=1/);
        expect(calledUrl).toMatch(/setBaseRace=set/);
        expect(calledUrl).toMatch(/forceMetarace=true/);
        expect(calledUrl).toMatch(/setMetarace=set/);
        expect(calledUrl).toMatch(/setStrength=2/);
        expect(calledUrl).toMatch(/setConstitution=3/);
        expect(calledUrl).toMatch(/setDexterity=4/);
        expect(calledUrl).toMatch(/setIntelligence=5/);
        expect(calledUrl).toMatch(/setWisdom=6/);
        expect(calledUrl).toMatch(/setCharisma=7/);
    });

    it('encodes the uri', function () {
        characterService.generate("alignment randomizer type", "set alignment", "class name randomizer type", "set class name", "level randomizer type", 9266, "base race randomizer type", "set base race", "metarace randomizer type", true, "set metarace", "stats randomizer type", 90210, 42, 600, 1337, 12345, 23456);
        var calledUrl = promiseServiceMock.getPromise.calls.mostRecent().args[0];
        expect(calledUrl).toMatch(urlRegex);
        expect(calledUrl).toMatch(/alignmentRandomizerType=alignment%20randomizer%20type/);
        expect(calledUrl).toMatch(/classNameRandomizerType=class%20name%20randomizer%20type/);
        expect(calledUrl).toMatch(/levelRandomizerType=level%20randomizer%20type/);
        expect(calledUrl).toMatch(/baseRaceRandomizerType=base%20race%20randomizer%20type/);
        expect(calledUrl).toMatch(/metaraceRandomizerType=metarace%20randomizer%20type/);
        expect(calledUrl).toMatch(/statsRandomizerType=stats%20randomizer%20type/);
        expect(calledUrl).toMatch(/setAlignment=set%20alignment/);
        expect(calledUrl).toMatch(/setClassName=set%20class%20name/);
        expect(calledUrl).toMatch(/setLevel=9266/);
        expect(calledUrl).toMatch(/setBaseRace=set%20base%20race/);
        expect(calledUrl).toMatch(/forceMetarace=true/);
        expect(calledUrl).toMatch(/setMetarace=set%20metarace/);
        expect(calledUrl).toMatch(/setStrength=90210/);
        expect(calledUrl).toMatch(/setConstitution=42/);
        expect(calledUrl).toMatch(/setDexterity=600/);
        expect(calledUrl).toMatch(/setIntelligence=1337/);
        expect(calledUrl).toMatch(/setWisdom=12345/);
        expect(calledUrl).toMatch(/setCharisma=23456/);
    });

    it('does not send default values', function () {
        characterService.generate("any", "", "any", "", "any", 0, "any", "", "any", false, "", "raw", 0, 0, 0, 0, 0, 0);
        var calledUrl = promiseServiceMock.getPromise.calls.mostRecent().args[0];
        expect(calledUrl).toMatch(urlRegex);
        expect(calledUrl).toMatch(/alignmentRandomizerType=any/);
        expect(calledUrl).toMatch(/classNameRandomizerType=any/);
        expect(calledUrl).toMatch(/levelRandomizerType=any/);
        expect(calledUrl).toMatch(/baseRaceRandomizerType=any/);
        expect(calledUrl).toMatch(/metaraceRandomizerType=any/);
        expect(calledUrl).toMatch(/statsRandomizerType=raw/);
        expect(calledUrl).not.toMatch(/setAlignment=/);
        expect(calledUrl).not.toMatch(/setClassName=/);
        expect(calledUrl).not.toMatch(/setLevel=/);
        expect(calledUrl).not.toMatch(/setBaseRace=/);
        expect(calledUrl).not.toMatch(/forceMetarace=/);
        expect(calledUrl).not.toMatch(/setMetarace=/);
        expect(calledUrl).not.toMatch(/setStrength=/);
        expect(calledUrl).not.toMatch(/setConstitution=/);
        expect(calledUrl).not.toMatch(/setDexterity=/);
        expect(calledUrl).not.toMatch(/setIntelligence=/);
        expect(calledUrl).not.toMatch(/setWisdom=/);
        expect(calledUrl).not.toMatch(/setCharisma=/);
    });
});