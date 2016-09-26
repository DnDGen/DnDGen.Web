'use strict'

describe('Dungeon Formatter Service', function () {
    var dungeonFormatterService;
    var areas;
    var encounterFormatterServiceMock;
    var treasureFormatterServiceMock;
    var encounterCount;
    var treasureCount;

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

        areas = [
            {
                Type: 'Room',
                Descriptions: ['description 1', 'description 2'],
                Length: 9266,
                Width: 90210,
                Contents: {
                    Encounters: [createEncounter(), createEncounter()],
                    Treasures: [{
                        Container: 'container 1',
                        Concealment: 'concealment 1',
                        Treasure: createTreasure()
                    }, {
                        Container: 'container 2',
                        Concealment: 'concealment 2',
                        Treasure: createTreasure()
                    }],
                    Miscellaneous: ['contents 1', 'contents 2'],
                    Traps: [],
                    Pool: {
                        Encounter: createEncounter(),
                        Treasure: {
                            Container: 'container 3',
                            Concealment: 'concealment 3',
                            Treasure: createTreasure()
                        },
                        MagicPower: 'super strength'
                    },
                    IsEmpty: false
                }
            },
            {
                Type: 'Exit',
                Descriptions: ['description 3', 'description 4'],
                Length: 0,
                Width: 0,
                Contents: {
                    Encounters: [],
                    Treasures: [],
                    Miscellaneous: ['contents 3', 'contents 4'],
                    Traps: [{
                        Name: 'trap 3',
                        ChallengeRating: 6789,
                        SearchDC: 7890,
                        DisableDeviceDC: 8901,
                        Descriptions: ['trap description 1', 'trap description 2']
                    }, {
                        Name: 'trap 4',
                        ChallengeRating: 9012,
                        SearchDC: 123,
                        DisableDeviceDC: 3210,
                        Descriptions: ['trap description 3', 'trap description 4']
                    }],
                    Pool: null,
                    IsEmpty: false
                }
            }
        ];
    });

    beforeEach(inject(function (_dungeonFormatterService_) {
        dungeonFormatterService = _dungeonFormatterService_;
    }));

    function createEncounter() {
        encounterCount++;

        return {
            monster: 'monster ' + encounterCount,
            quantity: encounterCount
        };
    }

    function createTreasure() {
        treasureCount++;

        return {
            Coin: {
                Currency: 'gold ' + treasureCount,
                Quantity: treasureCount
            },
            Goods: [
                { Description: 'goods description ' + treasureCount },
                { Description: 'other goods description ' + treasureCount }
            ],
            Items: [
                { Name: 'item ' + treasureCount },
                { Name: 'other item ' + treasureCount }
            ],
            IsAny: true
        };
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
            '\t\t\ttrap 3:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tChallenge Rating: 6789',
            '\t\t\t\tSearch DC: 7890',
            '\t\t\t\tDisable Device DC: 8901',
            '\t\t\ttrap 4:',
            '\t\t\t\ttrap description 3',
            '\t\t\t\ttrap description 4',
            '\t\t\t\tChallenge Rating: 9012',
            '\t\t\t\tSearch DC: 123',
            '\t\t\t\tDisable Device DC: 3210',
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
            '\t\t\ttrap 3:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tChallenge Rating: 6789',
            '\t\t\t\tSearch DC: 7890',
            '\t\t\t\tDisable Device DC: 8901',
            '\t\t\ttrap 4:',
            '\t\t\t\ttrap description 3',
            '\t\t\t\ttrap description 4',
            '\t\t\t\tChallenge Rating: 9012',
            '\t\t\t\tSearch DC: 123',
            '\t\t\t\tDisable Device DC: 3210',
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
            '\t\t\ttrap 3:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tChallenge Rating: 6789',
            '\t\t\t\tSearch DC: 7890',
            '\t\t\t\tDisable Device DC: 8901',
            '\t\t\ttrap 4:',
            '\t\t\t\ttrap description 3',
            '\t\t\t\ttrap description 4',
            '\t\t\t\tChallenge Rating: 9012',
            '\t\t\t\tSearch DC: 123',
            '\t\t\t\tDisable Device DC: 3210',
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
            '\t\t\ttrap 3:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tChallenge Rating: 6789',
            '\t\t\t\tSearch DC: 7890',
            '\t\t\t\tDisable Device DC: 8901',
            '\t\t\ttrap 4:',
            '\t\t\t\ttrap description 3',
            '\t\t\t\ttrap description 4',
            '\t\t\t\tChallenge Rating: 9012',
            '\t\t\t\tSearch DC: 123',
            '\t\t\t\tDisable Device DC: 3210',
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
            '\t\t\ttrap 3:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tChallenge Rating: 6789',
            '\t\t\t\tSearch DC: 7890',
            '\t\t\t\tDisable Device DC: 8901',
            '\t\t\ttrap 4:',
            '\t\t\t\ttrap description 3',
            '\t\t\t\ttrap description 4',
            '\t\t\t\tChallenge Rating: 9012',
            '\t\t\t\tSearch DC: 123',
            '\t\t\t\tDisable Device DC: 3210',
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
            '\t\t\ttrap 3:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tChallenge Rating: 6789',
            '\t\t\t\tSearch DC: 7890',
            '\t\t\t\tDisable Device DC: 8901',
            '\t\t\ttrap 4:',
            '\t\t\t\ttrap description 3',
            '\t\t\t\ttrap description 4',
            '\t\t\t\tChallenge Rating: 9012',
            '\t\t\t\tSearch DC: 123',
            '\t\t\t\tDisable Device DC: 3210',
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
            '\t\t\ttrap 3:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tChallenge Rating: 6789',
            '\t\t\t\tSearch DC: 7890',
            '\t\t\t\tDisable Device DC: 8901',
            '\t\t\ttrap 4:',
            '\t\t\t\ttrap description 3',
            '\t\t\t\ttrap description 4',
            '\t\t\t\tChallenge Rating: 9012',
            '\t\t\t\tSearch DC: 123',
            '\t\t\t\tDisable Device DC: 3210',
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
            '\t\t\ttrap 3:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tChallenge Rating: 6789',
            '\t\t\t\tSearch DC: 7890',
            '\t\t\t\tDisable Device DC: 8901',
            '\t\t\ttrap 4:',
            '\t\t\t\ttrap description 3',
            '\t\t\t\ttrap description 4',
            '\t\t\t\tChallenge Rating: 9012',
            '\t\t\t\tSearch DC: 123',
            '\t\t\t\tDisable Device DC: 3210',
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
            '\t\t\ttrap 3:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tChallenge Rating: 6789',
            '\t\t\t\tSearch DC: 7890',
            '\t\t\t\tDisable Device DC: 8901',
            '\t\t\ttrap 4:',
            '\t\t\t\ttrap description 3',
            '\t\t\t\ttrap description 4',
            '\t\t\t\tChallenge Rating: 9012',
            '\t\t\t\tSearch DC: 123',
            '\t\t\t\tDisable Device DC: 3210',
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
            '\t\t\ttrap 3:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tChallenge Rating: 6789',
            '\t\t\t\tSearch DC: 7890',
            '\t\t\t\tDisable Device DC: 8901',
            '\t\t\ttrap 4:',
            '\t\t\t\ttrap description 3',
            '\t\t\t\ttrap description 4',
            '\t\t\t\tChallenge Rating: 9012',
            '\t\t\t\tSearch DC: 123',
            '\t\t\t\tDisable Device DC: 3210',
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
            '\t\t\ttrap 3:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tChallenge Rating: 6789',
            '\t\t\t\tSearch DC: 7890',
            '\t\t\t\tDisable Device DC: 8901',
            '\t\t\ttrap 4:',
            '\t\t\t\ttrap description 3',
            '\t\t\t\ttrap description 4',
            '\t\t\t\tChallenge Rating: 9012',
            '\t\t\t\tSearch DC: 123',
            '\t\t\t\tDisable Device DC: 3210',
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
            '\t\t\ttrap 3:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tChallenge Rating: 6789',
            '\t\t\t\tSearch DC: 7890',
            '\t\t\t\tDisable Device DC: 8901',
            '\t\t\ttrap 4:',
            '\t\t\t\ttrap description 3',
            '\t\t\t\ttrap description 4',
            '\t\t\t\tChallenge Rating: 9012',
            '\t\t\t\tSearch DC: 123',
            '\t\t\t\tDisable Device DC: 3210',
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
            '\t\t\ttrap 3:',
            '\t\t\t\ttrap description 1',
            '\t\t\t\ttrap description 2',
            '\t\t\t\tChallenge Rating: 6789',
            '\t\t\t\tSearch DC: 7890',
            '\t\t\t\tDisable Device DC: 8901',
            '\t\t\ttrap 4:',
            '\t\t\t\ttrap description 3',
            '\t\t\t\ttrap description 4',
            '\t\t\t\tChallenge Rating: 9012',
            '\t\t\t\tSearch DC: 123',
            '\t\t\t\tDisable Device DC: 3210',
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