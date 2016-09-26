'use strict'

describe('Dungeon Service', function () {
    var dungeonService;
    var promiseServiceMock;

    beforeEach(module('app.dungeon', function ($provide) {
        promiseServiceMock = {};
        promiseServiceMock.getPromise = jasmine.createSpy();

        $provide.value('promiseService', promiseServiceMock);
    }));

    beforeEach(inject(function (_dungeonService_) {
        dungeonService = _dungeonService_;
    }));

    it('gets dungeon areas from hall', function () {
        var promise = dungeonService.getDungeonAreasFromHall(9266, 90210, "temperature");
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Dungeon/GenerateFromHall', {
            dungeonLevel: 9266,
            partyLevel: 90210,
            temperature: "temperature"
        });
    });

    it('gets dungeon areas from door', function () {
        var promise = dungeonService.getDungeonAreasFromDoor(9266, 90210, "temperature");
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Dungeon/GenerateFromDoor', {
            dungeonLevel: 9266,
            partyLevel: 90210,
            temperature: "temperature"
        });
    });
});