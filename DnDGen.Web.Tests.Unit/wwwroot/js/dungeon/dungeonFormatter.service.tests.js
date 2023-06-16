'use strict'

describe('Dungeon Formatter Service', function () {
    var dungeonFormatterService;
    var areas;
    var encounterFormatterServiceMock;
    var treasureFormatterServiceMock;
    var encounterCount;
    var treasureCount;
    var dungeonTreasureCount;
    var trapCount;

    beforeEach(module('app.dungeon', function ($provide) {
        treasureFormatterServiceMock = {
            formatTreasure: function (treasure, prefix) {
                if (!prefix)
                    prefix = '';

                var formattedTreasure = prefix + 'formatted treasure ' + treasure.coin.quantity + '\r\n';

                return formattedTreasure;
            }
        }

        encounterFormatterServiceMock = {
            formatEncounter: function (encounter, prefix) {
                if (!prefix)
                    prefix = '';

                var formattedEncounter = prefix + 'formatted encounter\r\n';
                formattedEncounter += prefix + '\tcreature: ' + encounter.monster + '\r\n';
                formattedEncounter += prefix + '\tquantity: ' + encounter.quantity + '\r\n';

                return formattedEncounter;
            }
        }

        $provide.value('treasureFormatterService', treasureFormatterServiceMock);
        $provide.value('encounterFormatterService', encounterFormatterServiceMock);
    }));

    beforeEach(function () {
        encounterCount = 0;
        treasureCount = 0;
        dungeonTreasureCount = 0;
        trapCount = 0;

        areas = [createArea(), createArea()];

        areas[0].type = 'Room';
        areas[0].descriptions.push('description 1');
        areas[0].descriptions.push('description 2');
        areas[0].length = 9266;
        areas[0].width = 90210;
        areas[0].contents.encounters.push(createEncounter());
        areas[0].contents.encounters.push(createEncounter());
        areas[0].contents.treasures.push(createDungeonTreasure());
        areas[0].contents.treasures.push(createDungeonTreasure());
        areas[0].contents.miscellaneous.push("contents 1");
        areas[0].contents.miscellaneous.push("contents 2");
        areas[0].contents.pool = createPool();
        areas[0].contents.pool.magicPower = 'super strength';
        areas[0].contents.isEmpty = false;

        areas[1].type = 'Exit';
        areas[1].descriptions.push('description 3');
        areas[1].descriptions.push('description 4');
        areas[1].length = 0;
        areas[1].width = 0;
        areas[1].contents.miscellaneous.push("contents 3");
        areas[1].contents.miscellaneous.push("contents 4");
        areas[1].contents.traps.push(createTrap());
        areas[1].contents.traps.push(createTrap());
        areas[1].contents.isEmpty = false;
    });

    beforeEach(inject(function (_dungeonFormatterService_) {
        dungeonFormatterService = _dungeonFormatterService_;
    }));

    function createArea() {
        var area = getMock('area');

        return area;
    }

    function createEncounter() {
        encounterCount++;

        return {
            monster: 'monster ' + encounterCount,
            quantity: encounterCount
        };
    }

    function createDungeonTreasure() {
        dungeonTreasureCount++;
        var dungeonTreasure = getMock('dungeonTreasure');

        dungeonTreasure.container = "container " + dungeonTreasureCount;
        dungeonTreasure.concealment = "concealment " + dungeonTreasureCount;
        dungeonTreasure.treasure = createTreasure();

        return dungeonTreasure;
    }

    function createPool() {
        var pool = getMock('pool');

        pool.encounter = createEncounter();
        pool.treasure = createDungeonTreasure();

        return pool;
    }

    function createTrap() {
        var trap = getMock('trap');
        trapCount++;
        
        trap.name = 'trap ' + trapCount,
        trap.challengeRating = 6789 + trapCount,
        trap.searchDC = 7890 + trapCount,
        trap.disableDeviceDC = 8901 + trapCount,
        trap.descriptions.push('trap description ' + trapCount);
        trap.descriptions.push('other trap description ' + trapCount);

        return trap;
    }

    function createTreasure() {
        treasureCount++;

        var treasure = getMock('treasure');

        treasure.coin.currency = 'gold ' + treasureCount;
        treasure.coin.quantity = treasureCount;
        treasure.goods.push(getMock('good'));
        treasure.goods.push(getMock('good'));
        treasure.goods[0].description = 'goods description ' + treasureCount;
        treasure.goods[0].ValueInGold = treasureCount * 2;
        treasure.goods[1].description = 'other goods description ' + treasureCount;
        treasure.goods[1].ValueInGold = treasureCount * 3;
        treasure.items.push(getMock('item'));
        treasure.items.push(getMock('item'));
        treasure.items[0].name = 'item ' + treasureCount;
        treasure.items[0].quantity = treasureCount * 4;
        treasure.items[1].name = "other item " + treasureCount;
        treasure.items[1].quantity = treasureCount * 5;
        treasure.isAny = true;

        return treasure;
    }

    it('formats areas', function () {
        var formattedDungeonAreas = dungeonFormatterService.formatDungeonAreas(areas);
        var lines = formattedDungeonAreas.split('\r\n');
        var expected = [
            'Room:',
            '\tDescriptions:',
            '\t\tdescription 1',
            '\t\tdescription 2',
            '\tDimensions: 9266\' x 90210\'',
            '\tContents:',
            '\t\tcontents 1',
            '\t\tcontents 2',
            '\t\tEncounters:',
            '\t\t\tEncounter 1:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 1',
            '\t\t\t\t\tquantity: 1',
            '\t\t\tEncounter 2:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 2',
            '\t\t\t\t\tquantity: 2',
            '\t\tTreasures:',
            '\t\t\tTreasure 1:',
            '\t\t\t\tContainer: container 1',
            '\t\t\t\tConcealment: concealment 1',
            '\t\t\t\tformatted treasure 1',
            '\t\t\tTreasure 2:',
            '\t\t\t\tContainer: container 2',
            '\t\t\t\tConcealment: concealment 2',
            '\t\t\t\tformatted treasure 2',
            '\t\tPool:',
            '\t\t\tEncounter:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 3',
            '\t\t\t\t\tquantity: 3',
            '\t\t\tTreasure:',
            '\t\t\t\tContainer: container 3',
            '\t\t\t\tConcealment: concealment 3',
            '\t\t\t\tformatted treasure 3',
            '\t\t\tMagic Power: super strength',
            'Exit:',
            '\tDescriptions:',
            '\t\tdescription 3',
            '\t\tdescription 4',
            '\tContents:',
            '\t\tcontents 3',
            '\t\tcontents 4',
            '\t\tTraps:',
            '\t\t\ttrap 1:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\tother trap description 1',
            '\t\t\t\tChallenge Rating: 6790',
            '\t\t\t\tSearch DC: 7891',
            '\t\t\t\tDisable Device DC: 8902',
            '\t\t\ttrap 2:',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tother trap description 2',
            '\t\t\t\tChallenge Rating: 6791',
            '\t\t\t\tSearch DC: 7892',
            '\t\t\t\tDisable Device DC: 8903',
            ''
        ];

        assertLines(expected, lines);
    });

    it('formats continuing width', function () {
        areas[0].width = 0;

        var formattedDungeonAreas = dungeonFormatterService.formatDungeonAreas(areas);
        var lines = formattedDungeonAreas.split('\r\n');
        var expected = [
            'Room:',
            '\tDescriptions:',
            '\t\tdescription 1',
            '\t\tdescription 2',
            '\tDimensions: continues 9266\'',
            '\tContents:',
            '\t\tcontents 1',
            '\t\tcontents 2',
            '\t\tEncounters:',
            '\t\t\tEncounter 1:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 1',
            '\t\t\t\t\tquantity: 1',
            '\t\t\tEncounter 2:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 2',
            '\t\t\t\t\tquantity: 2',
            '\t\tTreasures:',
            '\t\t\tTreasure 1:',
            '\t\t\t\tContainer: container 1',
            '\t\t\t\tConcealment: concealment 1',
            '\t\t\t\tformatted treasure 1',
            '\t\t\tTreasure 2:',
            '\t\t\t\tContainer: container 2',
            '\t\t\t\tConcealment: concealment 2',
            '\t\t\t\tformatted treasure 2',
            '\t\tPool:',
            '\t\t\tEncounter:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 3',
            '\t\t\t\t\tquantity: 3',
            '\t\t\tTreasure:',
            '\t\t\t\tContainer: container 3',
            '\t\t\t\tConcealment: concealment 3',
            '\t\t\t\tformatted treasure 3',
            '\t\t\tMagic Power: super strength',
            'Exit:',
            '\tDescriptions:',
            '\t\tdescription 3',
            '\t\tdescription 4',
            '\tContents:',
            '\t\tcontents 3',
            '\t\tcontents 4',
            '\t\tTraps:',
            '\t\t\ttrap 1:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\tother trap description 1',
            '\t\t\t\tChallenge Rating: 6790',
            '\t\t\t\tSearch DC: 7891',
            '\t\t\t\tDisable Device DC: 8902',
            '\t\t\ttrap 2:',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tother trap description 2',
            '\t\t\t\tChallenge Rating: 6791',
            '\t\t\t\tSearch DC: 7892',
            '\t\t\t\tDisable Device DC: 8903',
            ''
        ];

        assertLines(expected, lines);
    });

    it('formats no descriptions', function () {
        areas[0].descriptions = [];

        var formattedDungeonAreas = dungeonFormatterService.formatDungeonAreas(areas);
        var lines = formattedDungeonAreas.split('\r\n');
        var expected = [
            'Room:',
            '\tDimensions: 9266\' x 90210\'',
            '\tContents:',
            '\t\tcontents 1',
            '\t\tcontents 2',
            '\t\tEncounters:',
            '\t\t\tEncounter 1:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 1',
            '\t\t\t\t\tquantity: 1',
            '\t\t\tEncounter 2:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 2',
            '\t\t\t\t\tquantity: 2',
            '\t\tTreasures:',
            '\t\t\tTreasure 1:',
            '\t\t\t\tContainer: container 1',
            '\t\t\t\tConcealment: concealment 1',
            '\t\t\t\tformatted treasure 1',
            '\t\t\tTreasure 2:',
            '\t\t\t\tContainer: container 2',
            '\t\t\t\tConcealment: concealment 2',
            '\t\t\t\tformatted treasure 2',
            '\t\tPool:',
            '\t\t\tEncounter:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 3',
            '\t\t\t\t\tquantity: 3',
            '\t\t\tTreasure:',
            '\t\t\t\tContainer: container 3',
            '\t\t\t\tConcealment: concealment 3',
            '\t\t\t\tformatted treasure 3',
            '\t\t\tMagic Power: super strength',
            'Exit:',
            '\tDescriptions:',
            '\t\tdescription 3',
            '\t\tdescription 4',
            '\tContents:',
            '\t\tcontents 3',
            '\t\tcontents 4',
            '\t\tTraps:',
            '\t\t\ttrap 1:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\tother trap description 1',
            '\t\t\t\tChallenge Rating: 6790',
            '\t\t\t\tSearch DC: 7891',
            '\t\t\t\tDisable Device DC: 8902',
            '\t\t\ttrap 2:',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tother trap description 2',
            '\t\t\t\tChallenge Rating: 6791',
            '\t\t\t\tSearch DC: 7892',
            '\t\t\t\tDisable Device DC: 8903',
            ''
        ];

        assertLines(expected, lines);
    });

    it('formats no contents', function () {
        areas[0].contents.isEmpty = true;

        var formattedDungeonAreas = dungeonFormatterService.formatDungeonAreas(areas);
        var lines = formattedDungeonAreas.split('\r\n');
        var expected = [
            'Room:',
            '\tDescriptions:',
            '\t\tdescription 1',
            '\t\tdescription 2',
            '\tDimensions: 9266\' x 90210\'',
            'Exit:',
            '\tDescriptions:',
            '\t\tdescription 3',
            '\t\tdescription 4',
            '\tContents:',
            '\t\tcontents 3',
            '\t\tcontents 4',
            '\t\tTraps:',
            '\t\t\ttrap 1:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\tother trap description 1',
            '\t\t\t\tChallenge Rating: 6790',
            '\t\t\t\tSearch DC: 7891',
            '\t\t\t\tDisable Device DC: 8902',
            '\t\t\ttrap 2:',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tother trap description 2',
            '\t\t\t\tChallenge Rating: 6791',
            '\t\t\t\tSearch DC: 7892',
            '\t\t\t\tDisable Device DC: 8903',
            ''
        ];

        assertLines(expected, lines);
    });

    it('formats special area dimensions', function () {
        areas[0].width = 1;

        var formattedDungeonAreas = dungeonFormatterService.formatDungeonAreas(areas);
        var lines = formattedDungeonAreas.split('\r\n');
        var expected = [
            'Room:',
            '\tDescriptions:',
            '\t\tdescription 1',
            '\t\tdescription 2',
            '\tDimensions: about 9266 square feet',
            '\tContents:',
            '\t\tcontents 1',
            '\t\tcontents 2',
            '\t\tEncounters:',
            '\t\t\tEncounter 1:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 1',
            '\t\t\t\t\tquantity: 1',
            '\t\t\tEncounter 2:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 2',
            '\t\t\t\t\tquantity: 2',
            '\t\tTreasures:',
            '\t\t\tTreasure 1:',
            '\t\t\t\tContainer: container 1',
            '\t\t\t\tConcealment: concealment 1',
            '\t\t\t\tformatted treasure 1',
            '\t\t\tTreasure 2:',
            '\t\t\t\tContainer: container 2',
            '\t\t\t\tConcealment: concealment 2',
            '\t\t\t\tformatted treasure 2',
            '\t\tPool:',
            '\t\t\tEncounter:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 3',
            '\t\t\t\t\tquantity: 3',
            '\t\t\tTreasure:',
            '\t\t\t\tContainer: container 3',
            '\t\t\t\tConcealment: concealment 3',
            '\t\t\t\tformatted treasure 3',
            '\t\t\tMagic Power: super strength',
            'Exit:',
            '\tDescriptions:',
            '\t\tdescription 3',
            '\t\tdescription 4',
            '\tContents:',
            '\t\tcontents 3',
            '\t\tcontents 4',
            '\t\tTraps:',
            '\t\t\ttrap 1:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\tother trap description 1',
            '\t\t\t\tChallenge Rating: 6790',
            '\t\t\t\tSearch DC: 7891',
            '\t\t\t\tDisable Device DC: 8902',
            '\t\t\ttrap 2:',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tother trap description 2',
            '\t\t\t\tChallenge Rating: 6791',
            '\t\t\t\tSearch DC: 7892',
            '\t\t\t\tDisable Device DC: 8903',
            ''
        ];

        assertLines(expected, lines);
    });

    it('formats pool without encounter', function () {
        areas[0].contents.pool.encounter = null;

        var formattedDungeonAreas = dungeonFormatterService.formatDungeonAreas(areas);
        var lines = formattedDungeonAreas.split('\r\n');
        var expected = [
            'Room:',
            '\tDescriptions:',
            '\t\tdescription 1',
            '\t\tdescription 2',
            '\tDimensions: 9266\' x 90210\'',
            '\tContents:',
            '\t\tcontents 1',
            '\t\tcontents 2',
            '\t\tEncounters:',
            '\t\t\tEncounter 1:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 1',
            '\t\t\t\t\tquantity: 1',
            '\t\t\tEncounter 2:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 2',
            '\t\t\t\t\tquantity: 2',
            '\t\tTreasures:',
            '\t\t\tTreasure 1:',
            '\t\t\t\tContainer: container 1',
            '\t\t\t\tConcealment: concealment 1',
            '\t\t\t\tformatted treasure 1',
            '\t\t\tTreasure 2:',
            '\t\t\t\tContainer: container 2',
            '\t\t\t\tConcealment: concealment 2',
            '\t\t\t\tformatted treasure 2',
            '\t\tPool:',
            '\t\t\tTreasure:',
            '\t\t\t\tContainer: container 3',
            '\t\t\t\tConcealment: concealment 3',
            '\t\t\t\tformatted treasure 3',
            '\t\t\tMagic Power: super strength',
            'Exit:',
            '\tDescriptions:',
            '\t\tdescription 3',
            '\t\tdescription 4',
            '\tContents:',
            '\t\tcontents 3',
            '\t\tcontents 4',
            '\t\tTraps:',
            '\t\t\ttrap 1:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\tother trap description 1',
            '\t\t\t\tChallenge Rating: 6790',
            '\t\t\t\tSearch DC: 7891',
            '\t\t\t\tDisable Device DC: 8902',
            '\t\t\ttrap 2:',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tother trap description 2',
            '\t\t\t\tChallenge Rating: 6791',
            '\t\t\t\tSearch DC: 7892',
            '\t\t\t\tDisable Device DC: 8903',
            ''
        ];

        assertLines(expected, lines);
    });

    it('formats pool without treasure', function () {
        areas[0].contents.pool.treasure = null;

        var formattedDungeonAreas = dungeonFormatterService.formatDungeonAreas(areas);
        var lines = formattedDungeonAreas.split('\r\n');
        var expected = [
            'Room:',
            '\tDescriptions:',
            '\t\tdescription 1',
            '\t\tdescription 2',
            '\tDimensions: 9266\' x 90210\'',
            '\tContents:',
            '\t\tcontents 1',
            '\t\tcontents 2',
            '\t\tEncounters:',
            '\t\t\tEncounter 1:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 1',
            '\t\t\t\t\tquantity: 1',
            '\t\t\tEncounter 2:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 2',
            '\t\t\t\t\tquantity: 2',
            '\t\tTreasures:',
            '\t\t\tTreasure 1:',
            '\t\t\t\tContainer: container 1',
            '\t\t\t\tConcealment: concealment 1',
            '\t\t\t\tformatted treasure 1',
            '\t\t\tTreasure 2:',
            '\t\t\t\tContainer: container 2',
            '\t\t\t\tConcealment: concealment 2',
            '\t\t\t\tformatted treasure 2',
            '\t\tPool:',
            '\t\t\tEncounter:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 3',
            '\t\t\t\t\tquantity: 3',
            '\t\t\tMagic Power: super strength',
            'Exit:',
            '\tDescriptions:',
            '\t\tdescription 3',
            '\t\tdescription 4',
            '\tContents:',
            '\t\tcontents 3',
            '\t\tcontents 4',
            '\t\tTraps:',
            '\t\t\ttrap 1:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\tother trap description 1',
            '\t\t\t\tChallenge Rating: 6790',
            '\t\t\t\tSearch DC: 7891',
            '\t\t\t\tDisable Device DC: 8902',
            '\t\t\ttrap 2:',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tother trap description 2',
            '\t\t\t\tChallenge Rating: 6791',
            '\t\t\t\tSearch DC: 7892',
            '\t\t\t\tDisable Device DC: 8903',
            ''
        ];

        assertLines(expected, lines);
    });

    it('formats pool with only a treasure container', function () {
        areas[0].contents.pool.treasure.treasure.isAny = false;
        areas[0].contents.pool.treasure.concealment = '';

        var formattedDungeonAreas = dungeonFormatterService.formatDungeonAreas(areas);
        var lines = formattedDungeonAreas.split('\r\n');
        var expected = [
            'Room:',
            '\tDescriptions:',
            '\t\tdescription 1',
            '\t\tdescription 2',
            '\tDimensions: 9266\' x 90210\'',
            '\tContents:',
            '\t\tcontents 1',
            '\t\tcontents 2',
            '\t\tEncounters:',
            '\t\t\tEncounter 1:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 1',
            '\t\t\t\t\tquantity: 1',
            '\t\t\tEncounter 2:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 2',
            '\t\t\t\t\tquantity: 2',
            '\t\tTreasures:',
            '\t\t\tTreasure 1:',
            '\t\t\t\tContainer: container 1',
            '\t\t\t\tConcealment: concealment 1',
            '\t\t\t\tformatted treasure 1',
            '\t\t\tTreasure 2:',
            '\t\t\t\tContainer: container 2',
            '\t\t\t\tConcealment: concealment 2',
            '\t\t\t\tformatted treasure 2',
            '\t\tPool:',
            '\t\t\tEncounter:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 3',
            '\t\t\t\t\tquantity: 3',
            '\t\t\tTreasure: None',
            '\t\t\t\tContainer: container 3',
            '\t\t\tMagic Power: super strength',
            'Exit:',
            '\tDescriptions:',
            '\t\tdescription 3',
            '\t\tdescription 4',
            '\tContents:',
            '\t\tcontents 3',
            '\t\tcontents 4',
            '\t\tTraps:',
            '\t\t\ttrap 1:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\tother trap description 1',
            '\t\t\t\tChallenge Rating: 6790',
            '\t\t\t\tSearch DC: 7891',
            '\t\t\t\tDisable Device DC: 8902',
            '\t\t\ttrap 2:',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tother trap description 2',
            '\t\t\t\tChallenge Rating: 6791',
            '\t\t\t\tSearch DC: 7892',
            '\t\t\t\tDisable Device DC: 8903',
            ''
        ];

        assertLines(expected, lines);
    });

    it('formats pool without magic powers', function () {
        areas[0].contents.pool.magicPower = '';

        var formattedDungeonAreas = dungeonFormatterService.formatDungeonAreas(areas);
        var lines = formattedDungeonAreas.split('\r\n');
        var expected = [
            'Room:',
            '\tDescriptions:',
            '\t\tdescription 1',
            '\t\tdescription 2',
            '\tDimensions: 9266\' x 90210\'',
            '\tContents:',
            '\t\tcontents 1',
            '\t\tcontents 2',
            '\t\tEncounters:',
            '\t\t\tEncounter 1:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 1',
            '\t\t\t\t\tquantity: 1',
            '\t\t\tEncounter 2:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 2',
            '\t\t\t\t\tquantity: 2',
            '\t\tTreasures:',
            '\t\t\tTreasure 1:',
            '\t\t\t\tContainer: container 1',
            '\t\t\t\tConcealment: concealment 1',
            '\t\t\t\tformatted treasure 1',
            '\t\t\tTreasure 2:',
            '\t\t\t\tContainer: container 2',
            '\t\t\t\tConcealment: concealment 2',
            '\t\t\t\tformatted treasure 2',
            '\t\tPool:',
            '\t\t\tEncounter:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 3',
            '\t\t\t\t\tquantity: 3',
            '\t\t\tTreasure:',
            '\t\t\t\tContainer: container 3',
            '\t\t\t\tConcealment: concealment 3',
            '\t\t\t\tformatted treasure 3',
            'Exit:',
            '\tDescriptions:',
            '\t\tdescription 3',
            '\t\tdescription 4',
            '\tContents:',
            '\t\tcontents 3',
            '\t\tcontents 4',
            '\t\tTraps:',
            '\t\t\ttrap 1:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\tother trap description 1',
            '\t\t\t\tChallenge Rating: 6790',
            '\t\t\t\tSearch DC: 7891',
            '\t\t\t\tDisable Device DC: 8902',
            '\t\t\ttrap 2:',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tother trap description 2',
            '\t\t\t\tChallenge Rating: 6791',
            '\t\t\t\tSearch DC: 7892',
            '\t\t\t\tDisable Device DC: 8903',
            ''
        ];

        assertLines(expected, lines);
    });

    it('formats ordinary pool', function () {
        areas[0].contents.pool.magicPower = '';
        areas[0].contents.pool.encounter = null;
        areas[0].contents.pool.treasure = null;

        var formattedDungeonAreas = dungeonFormatterService.formatDungeonAreas(areas);
        var lines = formattedDungeonAreas.split('\r\n');
        var expected = [
            'Room:',
            '\tDescriptions:',
            '\t\tdescription 1',
            '\t\tdescription 2',
            '\tDimensions: 9266\' x 90210\'',
            '\tContents:',
            '\t\tcontents 1',
            '\t\tcontents 2',
            '\t\tEncounters:',
            '\t\t\tEncounter 1:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 1',
            '\t\t\t\t\tquantity: 1',
            '\t\t\tEncounter 2:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 2',
            '\t\t\t\t\tquantity: 2',
            '\t\tTreasures:',
            '\t\t\tTreasure 1:',
            '\t\t\t\tContainer: container 1',
            '\t\t\t\tConcealment: concealment 1',
            '\t\t\t\tformatted treasure 1',
            '\t\t\tTreasure 2:',
            '\t\t\t\tContainer: container 2',
            '\t\t\t\tConcealment: concealment 2',
            '\t\t\t\tformatted treasure 2',
            '\t\tPool',
            'Exit:',
            '\tDescriptions:',
            '\t\tdescription 3',
            '\t\tdescription 4',
            '\tContents:',
            '\t\tcontents 3',
            '\t\tcontents 4',
            '\t\tTraps:',
            '\t\t\ttrap 1:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\tother trap description 1',
            '\t\t\t\tChallenge Rating: 6790',
            '\t\t\t\tSearch DC: 7891',
            '\t\t\t\tDisable Device DC: 8902',
            '\t\t\ttrap 2:',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tother trap description 2',
            '\t\t\t\tChallenge Rating: 6791',
            '\t\t\t\tSearch DC: 7892',
            '\t\t\t\tDisable Device DC: 8903',
            ''
        ];

        assertLines(expected, lines);
    });

    it('formats uncontained treasure', function () {
        areas[0].contents.treasures[0].container = "";

        var formattedDungeonAreas = dungeonFormatterService.formatDungeonAreas(areas);
        var lines = formattedDungeonAreas.split('\r\n');
        var expected = [
            'Room:',
            '\tDescriptions:',
            '\t\tdescription 1',
            '\t\tdescription 2',
            '\tDimensions: 9266\' x 90210\'',
            '\tContents:',
            '\t\tcontents 1',
            '\t\tcontents 2',
            '\t\tEncounters:',
            '\t\t\tEncounter 1:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 1',
            '\t\t\t\t\tquantity: 1',
            '\t\t\tEncounter 2:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 2',
            '\t\t\t\t\tquantity: 2',
            '\t\tTreasures:',
            '\t\t\tTreasure 1:',
            '\t\t\t\tConcealment: concealment 1',
            '\t\t\t\tformatted treasure 1',
            '\t\t\tTreasure 2:',
            '\t\t\t\tContainer: container 2',
            '\t\t\t\tConcealment: concealment 2',
            '\t\t\t\tformatted treasure 2',
            '\t\tPool:',
            '\t\t\tEncounter:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 3',
            '\t\t\t\t\tquantity: 3',
            '\t\t\tTreasure:',
            '\t\t\t\tContainer: container 3',
            '\t\t\t\tConcealment: concealment 3',
            '\t\t\t\tformatted treasure 3',
            '\t\t\tMagic Power: super strength',
            'Exit:',
            '\tDescriptions:',
            '\t\tdescription 3',
            '\t\tdescription 4',
            '\tContents:',
            '\t\tcontents 3',
            '\t\tcontents 4',
            '\t\tTraps:',
            '\t\t\ttrap 1:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\tother trap description 1',
            '\t\t\t\tChallenge Rating: 6790',
            '\t\t\t\tSearch DC: 7891',
            '\t\t\t\tDisable Device DC: 8902',
            '\t\t\ttrap 2:',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tother trap description 2',
            '\t\t\t\tChallenge Rating: 6791',
            '\t\t\t\tSearch DC: 7892',
            '\t\t\t\tDisable Device DC: 8903',
            ''
        ];

        assertLines(expected, lines);
    });

    it('formats unhidden treasure', function () {
        areas[0].contents.treasures[0].concealment = "";

        var formattedDungeonAreas = dungeonFormatterService.formatDungeonAreas(areas);
        var lines = formattedDungeonAreas.split('\r\n');
        var expected = [
            'Room:',
            '\tDescriptions:',
            '\t\tdescription 1',
            '\t\tdescription 2',
            '\tDimensions: 9266\' x 90210\'',
            '\tContents:',
            '\t\tcontents 1',
            '\t\tcontents 2',
            '\t\tEncounters:',
            '\t\t\tEncounter 1:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 1',
            '\t\t\t\t\tquantity: 1',
            '\t\t\tEncounter 2:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 2',
            '\t\t\t\t\tquantity: 2',
            '\t\tTreasures:',
            '\t\t\tTreasure 1:',
            '\t\t\t\tContainer: container 1',
            '\t\t\t\tformatted treasure 1',
            '\t\t\tTreasure 2:',
            '\t\t\t\tContainer: container 2',
            '\t\t\t\tConcealment: concealment 2',
            '\t\t\t\tformatted treasure 2',
            '\t\tPool:',
            '\t\t\tEncounter:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 3',
            '\t\t\t\t\tquantity: 3',
            '\t\t\tTreasure:',
            '\t\t\t\tContainer: container 3',
            '\t\t\t\tConcealment: concealment 3',
            '\t\t\t\tformatted treasure 3',
            '\t\t\tMagic Power: super strength',
            'Exit:',
            '\tDescriptions:',
            '\t\tdescription 3',
            '\t\tdescription 4',
            '\tContents:',
            '\t\tcontents 3',
            '\t\tcontents 4',
            '\t\tTraps:',
            '\t\t\ttrap 1:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\tother trap description 1',
            '\t\t\t\tChallenge Rating: 6790',
            '\t\t\t\tSearch DC: 7891',
            '\t\t\t\tDisable Device DC: 8902',
            '\t\t\ttrap 2:',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tother trap description 2',
            '\t\t\t\tChallenge Rating: 6791',
            '\t\t\t\tSearch DC: 7892',
            '\t\t\t\tDisable Device DC: 8903',
            ''
        ];

        assertLines(expected, lines);
    });

    it('formats empty treasure', function () {
        areas[0].contents.treasures[0].treasure.isAny = false;

        var formattedDungeonAreas = dungeonFormatterService.formatDungeonAreas(areas);
        var lines = formattedDungeonAreas.split('\r\n');
        var expected = [
            'Room:',
            '\tDescriptions:',
            '\t\tdescription 1',
            '\t\tdescription 2',
            '\tDimensions: 9266\' x 90210\'',
            '\tContents:',
            '\t\tcontents 1',
            '\t\tcontents 2',
            '\t\tEncounters:',
            '\t\t\tEncounter 1:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 1',
            '\t\t\t\t\tquantity: 1',
            '\t\t\tEncounter 2:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 2',
            '\t\t\t\t\tquantity: 2',
            '\t\tTreasures:',
            '\t\t\tTreasure 1: None',
            '\t\t\t\tContainer: container 1',
            '\t\t\t\tConcealment: concealment 1',
            '\t\t\tTreasure 2:',
            '\t\t\t\tContainer: container 2',
            '\t\t\t\tConcealment: concealment 2',
            '\t\t\t\tformatted treasure 2',
            '\t\tPool:',
            '\t\t\tEncounter:',
            '\t\t\t\tformatted encounter',
            '\t\t\t\t\tcreature: monster 3',
            '\t\t\t\t\tquantity: 3',
            '\t\t\tTreasure:',
            '\t\t\t\tContainer: container 3',
            '\t\t\t\tConcealment: concealment 3',
            '\t\t\t\tformatted treasure 3',
            '\t\t\tMagic Power: super strength',
            'Exit:',
            '\tDescriptions:',
            '\t\tdescription 3',
            '\t\tdescription 4',
            '\tContents:',
            '\t\tcontents 3',
            '\t\tcontents 4',
            '\t\tTraps:',
            '\t\t\ttrap 1:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\tother trap description 1',
            '\t\t\t\tChallenge Rating: 6790',
            '\t\t\t\tSearch DC: 7891',
            '\t\t\t\tDisable Device DC: 8902',
            '\t\t\ttrap 2:',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tother trap description 2',
            '\t\t\t\tChallenge Rating: 6791',
            '\t\t\t\tSearch DC: 7892',
            '\t\t\t\tDisable Device DC: 8903',
            ''
        ];

        assertLines(expected, lines);
    });

    it('formats completely empty area', function () {
        areas = [{
            type: 'area type',
            descriptions: [],
            length: 0,
            width: 0,
            contents: {
                isEmpty: true
            }
        }];

        var formattedDungeonAreas = dungeonFormatterService.formatDungeonAreas(areas);
        var lines = formattedDungeonAreas.split('\r\n');
        var expected = [
            'area type',
            ''
        ];
        
        assertLines(expected, lines);
    });

    function assertLines(expected, actual) {
        for (var i = 0; i < expected.length; i++) {
            expect(actual[i]).toBe(expected[i]);
        }

        expect(actual.length).toBe(expected.length);
    }
});