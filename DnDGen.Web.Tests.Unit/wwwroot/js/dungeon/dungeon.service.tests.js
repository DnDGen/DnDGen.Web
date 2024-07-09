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
        var promise = dungeonService.getDungeonAreasFromHall(9266, "environment", "temperature", "time of day", 90210, [], false, false);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise)
            .toHaveBeenCalledWith('https://dungeon.dndgen.com/api/v1/dungeon/level/9266/hall/temperature/environment/time of day/level/90210/generate', {
                creatureTypeFilters: [],
                allowAquatic: false,
                allowUnderground: false,
            });
    });

    it('gets aquatic encounter from hall', function () {
        var promise = dungeonService.getDungeonAreasFromHall(9266, "environment", "temperature", "time of day", 90210, [], true, false);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise)
            .toHaveBeenCalledWith('https://dungeon.dndgen.com/api/v1/dungeon/level/9266/hall/temperature/environment/time of day/level/90210/generate', {
                creatureTypeFilters: [],
                allowAquatic: true,
                allowUnderground: false,
            });
    });

    it('gets underground encounter from hall', function () {
        var promise = dungeonService.getDungeonAreasFromHall(9266, "environment", "temperature", "time of day", 90210, [], false, true);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise)
            .toHaveBeenCalledWith('https://dungeon.dndgen.com/api/v1/dungeon/level/9266/hall/temperature/environment/time of day/level/90210/generate', {
                creatureTypeFilters: [],
                allowAquatic: false,
                allowUnderground: true,
            });
    });

    it('gets encounter with filters from hall', function () {
        var promise = dungeonService.getDungeonAreasFromHall(9266, "environment", "temperature", "time of day", 90210, ['heffalump', 'woozle'], false, false);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise)
            .toHaveBeenCalledWith('https://dungeon.dndgen.com/api/v1/dungeon/level/9266/hall/temperature/environment/time of day/level/90210/generate', {
                creatureTypeFilters: ['heffalump', 'woozle'],
                allowAquatic: false,
                allowUnderground: false,
            });
    });

    it('gets dungeon areas from door', function () {
        var promise = dungeonService.getDungeonAreasFromDoor(9266, "environment", "temperature", "time of day", 90210, [], false, false);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise)
            .toHaveBeenCalledWith('https://dungeon.dndgen.com/api/v1/dungeon/level/9266/door/temperature/environment/time of day/level/90210/generate', {
                creatureTypeFilters: [],
                allowAquatic: false,
                allowUnderground: false,
            });
    });

    it('gets aquatic encounter from door', function () {
        var promise = dungeonService.getDungeonAreasFromDoor(9266, "environment", "temperature", "time of day", 90210, [], true, false);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise)
            .toHaveBeenCalledWith('https://dungeon.dndgen.com/api/v1/dungeon/level/9266/door/temperature/environment/time of day/level/90210/generate', {
                creatureTypeFilters: [],
                allowAquatic: true,
                allowUnderground: false,
            });
    });

    it('gets underground encounter from door', function () {
        var promise = dungeonService.getDungeonAreasFromDoor(9266, "environment", "temperature", "time of day", 90210, [], false, true);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise)
            .toHaveBeenCalledWith('https://dungeon.dndgen.com/api/v1/dungeon/level/9266/door/temperature/environment/time of day/level/90210/generate', {
                creatureTypeFilters: [],
                allowAquatic: false,
                allowUnderground: true,
            });
    });

    it('gets encounter with filters from door', function () {
        var promise = dungeonService.getDungeonAreasFromDoor(9266, "environment", "temperature", "time of day", 90210, ['heffalump', 'woozle'], false, false);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise)
            .toHaveBeenCalledWith('https://dungeon.dndgen.com/api/v1/dungeon/level/9266/door/temperature/environment/time of day/level/90210/generate', {
                creatureTypeFilters: ['heffalump', 'woozle'],
                allowAquatic: false,
                allowUnderground: false,
            });
    });
});