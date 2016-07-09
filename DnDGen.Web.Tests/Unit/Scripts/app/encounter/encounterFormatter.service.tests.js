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

                var formattedTreasure = prefix + 'formatted treasure\n';

                if (treasure.Coin.Quantity > 0)
                    formattedTreasure += prefix + '\t' + treasure.Coin.Currency + '\n';

                if (treasure.Goods.length > 0)
                    formattedTreasure += prefix + '\tGood: ' + treasure.Goods[0].Description + '\n';

                if (treasure.Items.length > 0)
                    formattedTreasure += prefix + '\tItem: ' + treasure.Items[0].Name + ' formatted\n';

                return formattedTreasure;
            }
        }

        characterFormatterServiceMock = {
            formatCharacter: function (character, leadership, cohort, followers, prefix) {
                if (!prefix)
                    prefix = '';

                var formattedCharacter = prefix + 'formatted character\n';
                formattedCharacter += prefix + '\tname: ' + character.name + '\n';
                formattedCharacter += prefix + '\tlevel: ' + character.level + '\n';

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
                { Type: 'creature 1', Subtype: '', Quantity: 9266 },
                { Type: 'creature 2', Subtype: '', Quantity: 90210 },
            ],
            Characters: [],
            Treasure: { Coin: { Currency: '', Quantity: 0 }, Goods: [], Items: [] }
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
        var lines = formattedEncounter.split('\n');

        expect(lines[0]).toBe('Creatures:');
        expect(lines[1]).toBe('\tcreature 1 x9266');
        expect(lines[2]).toBe('\tcreature 2 x90210');
        expect(lines[3]).toBe('Treasure: None');
        expect(lines[4]).toBe('');
        expect(lines.length).toBe(5);
    });

    it('formats creature subtypes', function () {
        encounter.Creatures[0].Subtype = 'subtype'

        var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
        var lines = formattedEncounter.split('\n');

        expect(lines[0]).toBe('Creatures:');
        expect(lines[1]).toBe('\tcreature 1 (subtype) x9266');
        expect(lines[2]).toBe('\tcreature 2 x90210');
        expect(lines[3]).toBe('Treasure: None');
        expect(lines[4]).toBe('');
        expect(lines.length).toBe(5);
    });

    it('formats characters', function () {
        encounter.Characters.push(createCharacter());
        encounter.Characters.push(createCharacter());

        var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
        var lines = formattedEncounter.split('\n');

        expect(lines[0]).toBe('Creatures:');
        expect(lines[1]).toBe('\tcreature 1 x9266');
        expect(lines[2]).toBe('\tcreature 2 x90210');
        expect(lines[3]).toBe('Treasure: None');
        expect(lines[4]).toBe('Characters:');
        expect(lines[5]).toBe('\tformatted character');
        expect(lines[6]).toBe('\t\tname: character 1');
        expect(lines[7]).toBe('\t\tlevel: 1');
        expect(lines[8]).toBe('');
        expect(lines[9]).toBe('\tformatted character');
        expect(lines[10]).toBe('\t\tname: character 2');
        expect(lines[11]).toBe('\t\tlevel: 2');
        expect(lines[12]).toBe('');
        expect(lines[13]).toBe('');
        expect(lines.length).toBe(14);
    });

    it('formats treasure if there is coin', function () {
        encounter.Treasure.Coin.Quantity = 9266;
        encounter.Treasure.Coin.Currency = "munny";

        var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
        var lines = formattedEncounter.split('\n');

        expect(lines[0]).toBe('Creatures:');
        expect(lines[1]).toBe('\tcreature 1 x9266');
        expect(lines[2]).toBe('\tcreature 2 x90210');
        expect(lines[3]).toBe("Treasure:");
        expect(lines[4]).toBe("\tformatted treasure");
        expect(lines[5]).toBe("\t\tmunny");
        expect(lines[6]).toBe('');
        expect(lines.length).toBe(7);
    });

    it('formats treasure if there are goods', function () {
        encounter.Treasure.Goods.push({ Description: 'description', ValueInGold: 9266 });

        var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
        var lines = formattedEncounter.split('\n');

        expect(lines[0]).toBe('Creatures:');
        expect(lines[1]).toBe('\tcreature 1 x9266');
        expect(lines[2]).toBe('\tcreature 2 x90210');
        expect(lines[3]).toBe("Treasure:");
        expect(lines[4]).toBe("\tformatted treasure");
        expect(lines[5]).toBe("\t\tGood: description");
        expect(lines[6]).toBe('');
        expect(lines.length).toBe(7);
    });

    it('formats treasure if there are items', function () {
        encounter.Treasure.Items.push(createItem('item'));

        var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
        var lines = formattedEncounter.split('\n');

        expect(lines[0]).toBe('Creatures:');
        expect(lines[1]).toBe('\tcreature 1 x9266');
        expect(lines[2]).toBe('\tcreature 2 x90210');
        expect(lines[3]).toBe("Treasure:");
        expect(lines[4]).toBe("\tformatted treasure");
        expect(lines[5]).toBe('\t\tItem: item formatted');
        expect(lines[6]).toBe('');
        expect(lines.length).toBe(7);
    });

    it('formats full encounter', function () {
        encounter.Creatures[0].Subtype = 'subtype'
        encounter.Characters.push(createCharacter());
        encounter.Characters.push(createCharacter());
        encounter.Treasure.Coin.Quantity = 9266;
        encounter.Treasure.Coin.Currency = "munny";
        encounter.Treasure.Goods.push({ Description: 'description', ValueInGold: 9266 });
        encounter.Treasure.Items.push(createItem('item'));

        var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
        var lines = formattedEncounter.split('\n');

        expect(lines[0]).toBe('Creatures:');
        expect(lines[1]).toBe('\tcreature 1 (subtype) x9266');
        expect(lines[2]).toBe('\tcreature 2 x90210');
        expect(lines[3]).toBe("Treasure:");
        expect(lines[4]).toBe("\tformatted treasure");
        expect(lines[5]).toBe("\t\tmunny");
        expect(lines[6]).toBe("\t\tGood: description");
        expect(lines[7]).toBe('\t\tItem: item formatted');
        expect(lines[8]).toBe('Characters:');
        expect(lines[9]).toBe('\tformatted character');
        expect(lines[10]).toBe('\t\tname: character 1');
        expect(lines[11]).toBe('\t\tlevel: 1');
        expect(lines[12]).toBe('');
        expect(lines[13]).toBe('\tformatted character');
        expect(lines[14]).toBe('\t\tname: character 2');
        expect(lines[15]).toBe('\t\tlevel: 2');
        expect(lines[16]).toBe('');
        expect(lines[17]).toBe('');
        expect(lines.length).toBe(18);
    });

    it('formats full encounter with prefix', function () {
        encounter.Creatures[0].Subtype = 'subtype'
        encounter.Characters.push(createCharacter());
        encounter.Characters.push(createCharacter());
        encounter.Treasure.Coin.Quantity = 9266;
        encounter.Treasure.Coin.Currency = "munny";
        encounter.Treasure.Goods.push({ Description: 'description', ValueInGold: 9266 });
        encounter.Treasure.Items.push(createItem('item'));

        var formattedEncounter = encounterFormatterService.formatEncounter(encounter, '\t');
        var lines = formattedEncounter.split('\n');

        expect(lines[0]).toBe('\tCreatures:');
        expect(lines[1]).toBe('\t\tcreature 1 (subtype) x9266');
        expect(lines[2]).toBe('\t\tcreature 2 x90210');
        expect(lines[3]).toBe("\tTreasure:");
        expect(lines[4]).toBe("\t\tformatted treasure");
        expect(lines[5]).toBe("\t\t\tmunny");
        expect(lines[6]).toBe("\t\t\tGood: description");
        expect(lines[7]).toBe('\t\t\tItem: item formatted');
        expect(lines[8]).toBe('\tCharacters:');
        expect(lines[9]).toBe('\t\tformatted character');
        expect(lines[10]).toBe('\t\t\tname: character 1');
        expect(lines[11]).toBe('\t\t\tlevel: 1');
        expect(lines[12]).toBe('');
        expect(lines[13]).toBe('\t\tformatted character');
        expect(lines[14]).toBe('\t\t\tname: character 2');
        expect(lines[15]).toBe('\t\t\tlevel: 2');
        expect(lines[16]).toBe('');
        expect(lines[17]).toBe('');
        expect(lines.length).toBe(18);
    });
});