'use strict'

describe('Encounter Formatter Service', function () {
    var encounterFormatterService;
    var encounter;
    var characterFormatterServiceMock;
    var treasureFormatterServiceMock;
    var characterCount;
    var creatureCount;

    beforeEach(module('app.encounter', function ($provide) {
        treasureFormatterServiceMock = {
            formatTreasure: function (treasure, prefix) {
                if (!prefix)
                    prefix = '';

                var formattedTreasure = prefix + 'formatted treasure ' + treasure.Coin.Quantity + '\r\n';

                return formattedTreasure;
            }
        }

        characterFormatterServiceMock = {
            formatCharacter: function (character, leadership, cohort, followers, prefix) {
                if (!prefix)
                    prefix = '';

                var formattedCharacter = prefix + 'formatted character\r\n';
                formattedCharacter += prefix + '\tname: ' + character.name + '\r\n';
                formattedCharacter += prefix + '\tlevel: ' + character.level + '\r\n';

                return formattedCharacter;
            }
        }

        $provide.value('treasureFormatterService', treasureFormatterServiceMock);
        $provide.value('characterFormatterService', characterFormatterServiceMock);
    }));

    beforeEach(function () {
        characterCount = 0;
        creatureCount = 0;

        encounter = getMock('encounter');
        encounter.Creatures.push(createCreature());
        encounter.Creatures.push(createCreature());
        encounter.Treasures.push(createTreasure('first currency', 1));
        encounter.Treasures.push(createTreasure('second currency', 2));
        encounter.AverageEncounterLevel = 42;
        encounter.AverageDifficulty = 'super easy';
        encounter.ActualEncounterLevel = 600;
        encounter.ActualDifficulty = 'nigh impossible';
    });

    function createCreature() {
        creatureCount++;
        var creature = getMock('creature');

        creature.Name = 'creature ' + creatureCount;
        creature.Quantity = 9266 + creatureCount;
        creature.ChallengeRating = 90210 + creatureCount;

        return creature;
    }

    function createTreasure(currency, quantity) {
        var treasure = getMock('treasure');

        treasure.Coin.Currency = currency;
        treasure.Coin.Quantity = quantity;
        treasure.IsAny = true;

        return treasure;
    }

    beforeEach(inject(function (_encounterFormatterService_) {
        encounterFormatterService = _encounterFormatterService_;
    }));

    function createCharacter() {
        characterCount++;

        return {
            name: 'character ' + characterCount,
            level: characterCount
        };
    }

    function createItem(itemName) {
        return {
            Name: itemName,
            Attributes: ['item attribute']
        };
    }

    it('formats encounter basics', function () {
        var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
        var lines = formattedEncounter.split('\r\n');
        var expected = [
            'Average Encounter Level: 42 (super easy)',
            'Actual Encounter Level: 600 (nigh impossible)',
            'Creatures:',
            '\tcreature 1 (CR 90211) x9267',
            '\tcreature 2 (CR 90212) x9268',
            'Treasure:',
            "\tformatted treasure 1",
            "\tformatted treasure 2",
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats creature subtypes', function () {
        encounter.Creatures[0].Description = 'description'

        var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
        var lines = formattedEncounter.split('\r\n');
        var expected = [
            'Average Encounter Level: 42 (super easy)',
            'Actual Encounter Level: 600 (nigh impossible)',
            'Creatures:',
            '\tcreature 1 (description) (CR 90211) x9267',
            '\tcreature 2 (CR 90212) x9268',
            'Treasure:',
            "\tformatted treasure 1",
            "\tformatted treasure 2",
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats characters', function () {
        encounter.Characters.push(createCharacter());
        encounter.Characters.push(createCharacter());

        var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
        var lines = formattedEncounter.split('\r\n');
        var expected = [
            'Average Encounter Level: 42 (super easy)',
            'Actual Encounter Level: 600 (nigh impossible)',
            'Creatures:',
            '\tcreature 1 (CR 90211) x9267',
            '\tcreature 2 (CR 90212) x9268',
            'Treasure:',
            "\tformatted treasure 1",
            "\tformatted treasure 2",
            'Characters:',
            '\tformatted character',
            '\t\tname: character 1',
            '\t\tlevel: 1',
            '',
            '\tformatted character',
            '\t\tname: character 2',
            '\t\tlevel: 2',
            '',
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats treasure if there is not any', function () {
        encounter.Treasures[0].IsAny = false;
        encounter.Treasures[1].IsAny = false;

        var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
        var lines = formattedEncounter.split('\r\n');
        var expected = [
            'Average Encounter Level: 42 (super easy)',
            'Actual Encounter Level: 600 (nigh impossible)',
            'Creatures:',
            '\tcreature 1 (CR 90211) x9267',
            '\tcreature 2 (CR 90212) x9268',
            'Treasure: None',
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats treasure if there is some', function () {
        encounter.Treasures[0].IsAny = false;

        var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
        var lines = formattedEncounter.split('\r\n');
        var expected = [
            'Average Encounter Level: 42 (super easy)',
            'Actual Encounter Level: 600 (nigh impossible)',
            'Creatures:',
            '\tcreature 1 (CR 90211) x9267',
            '\tcreature 2 (CR 90212) x9268',
            'Treasure:',
            "\tformatted treasure 2",
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats full encounter', function () {
        encounter.Creatures[0].Description = 'description'
        encounter.Characters.push(createCharacter());
        encounter.Characters.push(createCharacter());

        var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
        var lines = formattedEncounter.split('\r\n');
        var expected = [
            'Average Encounter Level: 42 (super easy)',
            'Actual Encounter Level: 600 (nigh impossible)',
            'Creatures:',
            '\tcreature 1 (description) (CR 90211) x9267',
            '\tcreature 2 (CR 90212) x9268',
            'Treasure:',
            "\tformatted treasure 1",
            "\tformatted treasure 2",
            'Characters:',
            '\tformatted character',
            '\t\tname: character 1',
            '\t\tlevel: 1',
            '',
            '\tformatted character',
            '\t\tname: character 2',
            '\t\tlevel: 2',
            '',
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats full encounter with prefix', function () {
        encounter.Creatures[0].Description = 'description'
        encounter.Characters.push(createCharacter());
        encounter.Characters.push(createCharacter());

        var formattedEncounter = encounterFormatterService.formatEncounter(encounter, '\t');
        var lines = formattedEncounter.split('\r\n');
        var expected = [
            '\tAverage Encounter Level: 42 (super easy)',
            '\tActual Encounter Level: 600 (nigh impossible)',
            '\tCreatures:',
            '\t\tcreature 1 (description) (CR 90211) x9267',
            '\t\tcreature 2 (CR 90212) x9268',
            '\tTreasure:',
            "\t\tformatted treasure 1",
            "\t\tformatted treasure 2",
            '\tCharacters:',
            '\t\tformatted character',
            '\t\t\tname: character 1',
            '\t\t\tlevel: 1',
            '',
            '\t\tformatted character',
            '\t\t\tname: character 2',
            '\t\t\tlevel: 2',
            '',
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });
});