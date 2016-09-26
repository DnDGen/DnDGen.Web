'use strict'

describe('Encounter Formatter Service', function () {
    var encounterFormatterService;
    var encounter;
    var characterFormatterServiceMock;
    var treasureFormatterServiceMock;
    var characterCount;

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

        encounter = {
            Creatures: [
                { Name: 'creature 1', Description: '', Quantity: 9266 },
                { Name: 'creature 2', Description: '', Quantity: 90210 },
            ],
            Characters: [],
            Treasures: [
                { Coin: { Currency: 'first currency', Quantity: 1 }, Goods: [], Items: [], IsAny: true },
                { Coin: { Currency: 'second currency', Quantity: 2 }, Goods: [], Items: [], IsAny: true }
            ]
        };
    });

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

        expect(lines[0]).toBe('Creatures:');
        expect(lines[1]).toBe('\tcreature 1 x9266');
        expect(lines[2]).toBe('\tcreature 2 x90210');
        expect(lines[3]).toBe('Treasure:');
        expect(lines[4]).toBe("\tformatted treasure 1");
        expect(lines[5]).toBe("\tformatted treasure 2");
        expect(lines[6]).toBe('');
        expect(lines.length).toBe(7);
    });

    it('formats creature subtypes', function () {
        encounter.Creatures[0].Description = 'description'

        var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
        var lines = formattedEncounter.split('\r\n');

        expect(lines[0]).toBe('Creatures:');
        expect(lines[1]).toBe('\tcreature 1 (description) x9266');
        expect(lines[2]).toBe('\tcreature 2 x90210');
        expect(lines[3]).toBe('Treasure:');
        expect(lines[4]).toBe("\tformatted treasure 1");
        expect(lines[5]).toBe("\tformatted treasure 2");
        expect(lines[6]).toBe('');
        expect(lines.length).toBe(7);
    });

    it('formats characters', function () {
        encounter.Characters.push(createCharacter());
        encounter.Characters.push(createCharacter());

        var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
        var lines = formattedEncounter.split('\r\n');

        expect(lines[0]).toBe('Creatures:');
        expect(lines[1]).toBe('\tcreature 1 x9266');
        expect(lines[2]).toBe('\tcreature 2 x90210');
        expect(lines[3]).toBe('Treasure:');
        expect(lines[4]).toBe("\tformatted treasure 1");
        expect(lines[5]).toBe("\tformatted treasure 2");
        expect(lines[6]).toBe('Characters:');
        expect(lines[7]).toBe('\tformatted character');
        expect(lines[8]).toBe('\t\tname: character 1');
        expect(lines[9]).toBe('\t\tlevel: 1');
        expect(lines[10]).toBe('');
        expect(lines[11]).toBe('\tformatted character');
        expect(lines[12]).toBe('\t\tname: character 2');
        expect(lines[13]).toBe('\t\tlevel: 2');
        expect(lines[14]).toBe('');
        expect(lines[15]).toBe('');
        expect(lines.length).toBe(16);
    });

    it('formats treasure if there is not any', function () {
        encounter.Treasures[0].IsAny = false;
        encounter.Treasures[1].IsAny = false;

        var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
        var lines = formattedEncounter.split('\r\n');

        expect(lines[0]).toBe('Creatures:');
        expect(lines[1]).toBe('\tcreature 1 x9266');
        expect(lines[2]).toBe('\tcreature 2 x90210');
        expect(lines[3]).toBe("Treasure: None");
        expect(lines[4]).toBe('');
        expect(lines.length).toBe(5);
    });

    it('formats treasure if there is some', function () {
        encounter.Treasures[0].IsAny = false;

        var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
        var lines = formattedEncounter.split('\r\n');

        expect(lines[0]).toBe('Creatures:');
        expect(lines[1]).toBe('\tcreature 1 x9266');
        expect(lines[2]).toBe('\tcreature 2 x90210');
        expect(lines[3]).toBe("Treasure:");
        expect(lines[4]).toBe("\tformatted treasure 2");
        expect(lines[5]).toBe('');
        expect(lines.length).toBe(6);
    });

    it('formats full encounter', function () {
        encounter.Creatures[0].Description = 'description'
        encounter.Characters.push(createCharacter());
        encounter.Characters.push(createCharacter());

        var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
        var lines = formattedEncounter.split('\r\n');

        expect(lines[0]).toBe('Creatures:');
        expect(lines[1]).toBe('\tcreature 1 (description) x9266');
        expect(lines[2]).toBe('\tcreature 2 x90210');
        expect(lines[3]).toBe('Treasure:');
        expect(lines[4]).toBe("\tformatted treasure 1");
        expect(lines[5]).toBe("\tformatted treasure 2");
        expect(lines[6]).toBe('Characters:');
        expect(lines[7]).toBe('\tformatted character');
        expect(lines[8]).toBe('\t\tname: character 1');
        expect(lines[9]).toBe('\t\tlevel: 1');
        expect(lines[10]).toBe('');
        expect(lines[11]).toBe('\tformatted character');
        expect(lines[12]).toBe('\t\tname: character 2');
        expect(lines[13]).toBe('\t\tlevel: 2');
        expect(lines[14]).toBe('');
        expect(lines[15]).toBe('');
        expect(lines.length).toBe(16);
    });

    it('formats full encounter with prefix', function () {
        encounter.Creatures[0].Description = 'description'
        encounter.Characters.push(createCharacter());
        encounter.Characters.push(createCharacter());

        var formattedEncounter = encounterFormatterService.formatEncounter(encounter, '\t');
        var lines = formattedEncounter.split('\r\n');

        expect(lines[0]).toBe('\tCreatures:');
        expect(lines[1]).toBe('\t\tcreature 1 (description) x9266');
        expect(lines[2]).toBe('\t\tcreature 2 x90210');
        expect(lines[3]).toBe('\tTreasure:');
        expect(lines[4]).toBe("\t\tformatted treasure 1");
        expect(lines[5]).toBe("\t\tformatted treasure 2");
        expect(lines[6]).toBe('\tCharacters:');
        expect(lines[7]).toBe('\t\tformatted character');
        expect(lines[8]).toBe('\t\t\tname: character 1');
        expect(lines[9]).toBe('\t\t\tlevel: 1');
        expect(lines[10]).toBe('');
        expect(lines[11]).toBe('\t\tformatted character');
        expect(lines[12]).toBe('\t\t\tname: character 2');
        expect(lines[13]).toBe('\t\t\tlevel: 2');
        expect(lines[14]).toBe('');
        expect(lines[15]).toBe('');
        expect(lines.length).toBe(16);
    });
});