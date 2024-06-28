'use strict'

describe('Character Service Integration', function () {
    var characterService;

    beforeEach(module('app.character'));

    beforeEach(inject(function (_characterService_) {
        characterService = _characterService_;
    }));

    it('generates a character DUMMY', function () {
        var promise = characterService.generate(
            "any alignment",
            "set alignment",
            "any class",
            "set class",
            "any level",
            1,
            false,
            "any base race",
            "set base race",
            "any metarace",
            true,
            "set metarace",
            "raw abilities",
            2,
            3,
            4,
            5,
            6,
            7,
            false);

        expect(promise).not.toBeNull();
        expect('this is the dummy test case').toBeEmpty();
    });

    //it('generates a character', function (done) {
    //    //var response = await characterService.generate(
    //    //    "any alignment",
    //    //    "set alignment",
    //    //    "any class",
    //    //    "set class",
    //    //    "any level",
    //    //    1,
    //    //    false,
    //    //    "any base race",
    //    //    "set base race",
    //    //    "any metarace",
    //    //    true,
    //    //    "set metarace",
    //    //    "raw abilities",
    //    //    2,
    //    //    3,
    //    //    4,
    //    //    5,
    //    //    6,
    //    //    7,
    //    //    false);

    //    //var character = response.data;

    //    //expect(character).not.toBeNull();
    //    //expect(character.summary).not.toBeEmpty();

    //    //characterService.generate(
    //    //        "any alignment",
    //    //        "set alignment",
    //    //        "any class",
    //    //        "set class",
    //    //        "any level",
    //    //        1,
    //    //        false,
    //    //        "any base race",
    //    //        "set base race",
    //    //        "any metarace",
    //    //        true,
    //    //        "set metarace",
    //    //        "raw abilities",
    //    //        2,
    //    //        3,
    //    //        4,
    //    //        5,
    //    //        6,
    //    //        7,
    //    //        false)
    //    //    .then(function (response) {
    //    //        var character = response.data;

    //    //        expect(character).not.toBeNull();
    //    //        expect(character.summary).not.toBeEmpty();
    //    //        done();
    //    //    })
    //    //    .catch(err => fail(err));

    //    var promise = characterService.generate(
    //        "any alignment",
    //        "set alignment",
    //        "any class",
    //        "set class",
    //        "any level",
    //        1,
    //        false,
    //        "any base race",
    //        "set base race",
    //        "any metarace",
    //        true,
    //        "set metarace",
    //        "raw abilities",
    //        2,
    //        3,
    //        4,
    //        5,
    //        6,
    //        7,
    //        false);

    //    expect(promise).not.toBeNull();

    //    promise.then(function (response) {
    //            var character = response.data;

    //            expect(character).not.toBeNull();
    //            expect(character.summary).not.toBeEmpty();
    //            done();
    //        })
    //        .catch(err => fail(err))
    //});
});