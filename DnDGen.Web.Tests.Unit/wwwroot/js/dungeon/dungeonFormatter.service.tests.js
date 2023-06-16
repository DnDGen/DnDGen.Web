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

                var formattedTreasure = prefix + 'formatted treasure ' + treasure.Coin.Quantity + '\r\n';

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

        areas[0].Type = 'Room';
        areas[0].Descriptions.push('description 1');
        areas[0].Descriptions.push('description 2');
        areas[0].Length = 9266;
        areas[0].Width = 90210;
        areas[0].Contents.Encounters.push(createEncounter());
        areas[0].Contents.Encounters.push(createEncounter());
        areas[0].Contents.Treasures.push(createDungeonTreasure());
        areas[0].Contents.Treasures.push(createDungeonTreasure());
        areas[0].Contents.Miscellaneous.push("contents 1");
        areas[0].Contents.Miscellaneous.push("contents 2");
        areas[0].Contents.Pool = createPool();
        areas[0].Contents.Pool.MagicPower = 'super strength';
        areas[0].Contents.IsEmpty = false;

        areas[1].Type = 'Exit';
        areas[1].Descriptions.push('description 3');
        areas[1].Descriptions.push('description 4');
        areas[1].Length = 0;
        areas[1].Width = 0;
        areas[1].Contents.Miscellaneous.push("contents 3");
        areas[1].Contents.Miscellaneous.push("contents 4");
        areas[1].Contents.Traps.push(createTrap());
        areas[1].Contents.Traps.push(createTrap());
        areas[1].Contents.IsEmpty = false;
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

        dungeonTreasure.Container = "container " + dungeonTreasureCount;
        dungeonTreasure.Concealment = "concealment " + dungeonTreasureCount;
        dungeonTreasure.Treasure = createTreasure();

        return dungeonTreasure;
    }

    function createPool() {
        var pool = getMock('pool');

        pool.Encounter = createEncounter();
        pool.Treasure = createDungeonTreasure();

        return pool;
    }

    function createTrap() {
        var trap = getMock('trap');
        trapCount++;
        
        trap.Name = 'trap ' + trapCount,
        trap.ChallengeRating = 6789 + trapCount,
        trap.SearchDC = 7890 + trapCount,
        trap.DisableDeviceDC = 8901 + trapCount,
        trap.Descriptions.push('trap description ' + trapCount);
        trap.Descriptions.push('other trap description ' + trapCount);

        return trap;
    }

    function createTreasure() {
        treasureCount++;

        var treasure = getMock('treasure');

        treasure.Coin.Currency = 'gold ' + treasureCount;
        treasure.Coin.Quantity = treasureCount;
        treasure.Goods.push(getMock('good'));
        treasure.Goods.push(getMock('good'));
        treasure.Goods[0].Description = 'goods description ' + treasureCount;
        treasure.Goods[0].ValueInGold = treasureCount * 2;
        treasure.Goods[1].Description = 'other goods description ' + treasureCount;
        treasure.Goods[1].ValueInGold = treasureCount * 3;
        treasure.Items.push(getMock('item'));
        treasure.Items.push(getMock('item'));
        treasure.Items[0].Name = 'item ' + treasureCount;
        treasure.Items[0].Quantity = treasureCount * 4;
        treasure.Items[1].Name = "other item " + treasureCount;
        treasure.Items[1].Quantity = treasureCount * 5;
        treasure.IsAny = true;

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
        areas[0].Width = 0;

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
        areas[0].Descriptions = [];

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
        areas[0].Contents.IsEmpty = true;

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
        areas[0].Width = 1;

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
        areas[0].Contents.Pool.Encounter = null;

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
        areas[0].Contents.Pool.Treasure = null;

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
        areas[0].Contents.Pool.Treasure.Treasure.IsAny = false;
        areas[0].Contents.Pool.Treasure.Concealment = '';

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
        areas[0].Contents.Pool.MagicPower = '';

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
        areas[0].Contents.Pool.MagicPower = '';
        areas[0].Contents.Pool.Encounter = null;
        areas[0].Contents.Pool.Treasure = null;

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
        areas[0].Contents.Treasures[0].Container = "";

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
        areas[0].Contents.Treasures[0].Concealment = "";

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
        areas[0].Contents.Treasures[0].Treasure.IsAny = false;

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
            Type: 'area type',
            Descriptions: [],
            Length: 0,
            Width: 0,
            Contents: {
                IsEmpty: true
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