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

                var formattedTreasure = prefix + 'formatted treasure ' + treasure.coin.quantity + '\r\n';

                return formattedTreasure;
            }
        }

        characterFormatterServiceMock = {
            formatCharacter: function (character, prefix) {
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

    describe('Web Encounters', function () {
        beforeEach(function () {
            characterCount = 0;
            creatureCount = 0;

            encounter = createWebEncounter();
        });

        function createWebEncounter() {
            var encounter = getMock('encounter.web');
            encounter.creatures.push(createWebCreature());
            encounter.creatures.push(createWebCreature());
            encounter.treasures.push(createTreasure('first currency', 1));
            encounter.treasures.push(createTreasure('second currency', 2));
            encounter.targetEncounterLevel = 1337;
            encounter.averageEncounterLevel = 42;
            encounter.averageDifficulty = 'super easy';
            encounter.actualEncounterLevel = 600;
            encounter.actualDifficulty = 'nigh impossible';

            return encounter;
        }

        function createWebCreature() {
            creatureCount++;
            var creature = getMock('creature.web');

            creature.type.name = 'creature ' + creatureCount;
            creature.quantity = 9266 + creatureCount;
            creature.challengeRating = 90210 + creatureCount;

            return creature;
        }

        function createTreasure(currency, quantity) {
            var treasure = getMock('treasure');

            treasure.coin.currency = currency;
            treasure.coin.quantity = quantity;
            treasure.isAny = true;

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

        it('formats encounter basics', function () {
            var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
            var lines = formattedEncounter.split('\r\n');
            var expected = [
                'Target Encounter Level: 1337',
                'Average Encounter Level: 42 (super easy)',
                'Actual Encounter Level: 600 (nigh impossible)',
                'Creatures:',
                '\t' + 'creature 1',
                '\t\t' + 'Challenge Rating: 90211',
                '\t\t' + 'Quantity: 9267',
                '\t' + 'creature 2',
                '\t\t' + 'Challenge Rating: 90212',
                '\t\t' + 'Quantity: 9268',
                'Treasure:',
                '\t' + 'formatted treasure 1',
                '\t' + 'formatted treasure 2',
                '',
            ];

            for (var i = 0; i < lines.length; i++) {
                expect(lines[i]).toBe(expected[i]);
            }

            expect(lines.length).toBe(expected.length);
        });

        it('formats creature descriptions', function () {
            encounter.creatures[0].type.description = 'description'

            var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
            var lines = formattedEncounter.split('\r\n');
            var expected = [
                'Target Encounter Level: 1337',
                'Average Encounter Level: 42 (super easy)',
                'Actual Encounter Level: 600 (nigh impossible)',
                'Creatures:',
                '\t' + 'creature 1 (description)',
                '\t\t' + 'Challenge Rating: 90211',
                '\t\t' + 'Quantity: 9267',
                '\t' + 'creature 2',
                '\t\t' + 'Challenge Rating: 90212',
                '\t\t' + 'Quantity: 9268',
                'Treasure:',
                '\t' + 'formatted treasure 1',
                '\t' + 'formatted treasure 2',
                '',
            ];

            for (var i = 0; i < lines.length; i++) {
                expect(lines[i]).toBe(expected[i]);
            }

            expect(lines.length).toBe(expected.length);
        });

        it('formats creature subtypes', function () {
            encounter.creatures[0].type.description = 'description'
            encounter.creatures[0].type.subType = {
                name: 'subtype',
                description: 'subtype description',
                subType: null
            };

            var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
            var lines = formattedEncounter.split('\r\n');
            var expected = [
                'Target Encounter Level: 1337',
                'Average Encounter Level: 42 (super easy)',
                'Actual Encounter Level: 600 (nigh impossible)',
                'Creatures:',
                '\t' + 'creature 1 (description)',
                '\t\t' + 'Subtype: subtype (subtype description)',
                '\t\t' + 'Challenge Rating: 90211',
                '\t\t' + 'Quantity: 9267',
                '\t' + 'creature 2',
                '\t\t' + 'Challenge Rating: 90212',
                '\t\t' + 'Quantity: 9268',
                'Treasure:',
                '\t' + 'formatted treasure 1',
                '\t' + 'formatted treasure 2',
                '',
            ];

            for (var i = 0; i < lines.length; i++) {
                expect(lines[i]).toBe(expected[i]);
            }

            expect(lines.length).toBe(expected.length);
        });

        it('formats further creature subtypes', function () {
            encounter.creatures[0].type.description = 'description'
            encounter.creatures[0].type.subType = {
                name: 'subtype',
                description: 'subtype description',
                subType: {
                    name: 'further subtype',
                    description: 'further subtype description',
                    subType: null
                }
            };

            var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
            var lines = formattedEncounter.split('\r\n');
            var expected = [
                'Target Encounter Level: 1337',
                'Average Encounter Level: 42 (super easy)',
                'Actual Encounter Level: 600 (nigh impossible)',
                'Creatures:',
                '\t' + 'creature 1 (description)',
                '\t\t' + 'Subtype: subtype (subtype description)',
                '\t\t\t' + 'Subtype: further subtype (further subtype description)',
                '\t\t' + 'Challenge Rating: 90211',
                '\t\t' + 'Quantity: 9267',
                '\t' + 'creature 2',
                '\t\t' + 'Challenge Rating: 90212',
                '\t\t' + 'Quantity: 9268',
                'Treasure:',
                '\t' + 'formatted treasure 1',
                '\t' + 'formatted treasure 2',
                '',
            ];

            for (var i = 0; i < lines.length; i++) {
                expect(lines[i]).toBe(expected[i]);
            }

            expect(lines.length).toBe(expected.length);
        });

        it('formats further creature subtypes without descriptions', function () {
            encounter.creatures[0].type.subType = {
                name: 'subtype',
                subType: {
                    name: 'further subtype',
                    subType: null
                }
            };

            var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
            var lines = formattedEncounter.split('\r\n');
            var expected = [
                'Target Encounter Level: 1337',
                'Average Encounter Level: 42 (super easy)',
                'Actual Encounter Level: 600 (nigh impossible)',
                'Creatures:',
                '\t' + 'creature 1',
                '\t\t' + 'Subtype: subtype',
                '\t\t\t' + 'Subtype: further subtype',
                '\t\t' + 'Challenge Rating: 90211',
                '\t\t' + 'Quantity: 9267',
                '\t' + 'creature 2',
                '\t\t' + 'Challenge Rating: 90212',
                '\t\t' + 'Quantity: 9268',
                'Treasure:',
                '\t' + 'formatted treasure 1',
                '\t' + 'formatted treasure 2',
                '',
            ];

            for (var i = 0; i < lines.length; i++) {
                expect(lines[i]).toBe(expected[i]);
            }

            expect(lines.length).toBe(expected.length);
        });

        it('formats characters', function () {
            encounter.characters.push(createCharacter());
            encounter.characters.push(createCharacter());

            var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
            var lines = formattedEncounter.split('\r\n');
            var expected = [
                'Target Encounter Level: 1337',
                'Average Encounter Level: 42 (super easy)',
                'Actual Encounter Level: 600 (nigh impossible)',
                'Creatures:',
                '\t' + 'creature 1',
                '\t\t' + 'Challenge Rating: 90211',
                '\t\t' + 'Quantity: 9267',
                '\t' + 'creature 2',
                '\t\t' + 'Challenge Rating: 90212',
                '\t\t' + 'Quantity: 9268',
                'Treasure:',
                '\t' + 'formatted treasure 1',
                '\t' + 'formatted treasure 2',
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
            encounter.treasures[0].isAny = false;
            encounter.treasures[1].isAny = false;

            var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
            var lines = formattedEncounter.split('\r\n');
            var expected = [
                'Target Encounter Level: 1337',
                'Average Encounter Level: 42 (super easy)',
                'Actual Encounter Level: 600 (nigh impossible)',
                'Creatures:',
                '\t' + 'creature 1',
                '\t\t' + 'Challenge Rating: 90211',
                '\t\t' + 'Quantity: 9267',
                '\t' + 'creature 2',
                '\t\t' + 'Challenge Rating: 90212',
                '\t\t' + 'Quantity: 9268',
                'Treasure: None',
                '',
            ];

            for (var i = 0; i < lines.length; i++) {
                expect(lines[i]).toBe(expected[i]);
            }

            expect(lines.length).toBe(expected.length);
        });

        it('formats treasure if there is some', function () {
            encounter.treasures[0].isAny = false;

            var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
            var lines = formattedEncounter.split('\r\n');
            var expected = [
                'Target Encounter Level: 1337',
                'Average Encounter Level: 42 (super easy)',
                'Actual Encounter Level: 600 (nigh impossible)',
                'Creatures:',
                '\t' + 'creature 1',
                '\t\t' + 'Challenge Rating: 90211',
                '\t\t' + 'Quantity: 9267',
                '\t' + 'creature 2',
                '\t\t' + 'Challenge Rating: 90212',
                '\t\t' + 'Quantity: 9268',
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
            encounter.creatures[0].type.description = 'description';
            encounter.creatures[0].type.subType = {
                name: 'subtype',
                description: 'subtype description',
                subType: {
                    name: 'further subtype',
                    description: 'further subtype description',
                    subType: null
                }
            };
            encounter.characters.push(createCharacter());
            encounter.characters.push(createCharacter());

            var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
            var lines = formattedEncounter.split('\r\n');
            var expected = [
                'Target Encounter Level: 1337',
                'Average Encounter Level: 42 (super easy)',
                'Actual Encounter Level: 600 (nigh impossible)',
                'Creatures:',
                '\t' + 'creature 1 (description)',
                '\t\t' + 'Subtype: subtype (subtype description)',
                '\t\t\t' + 'Subtype: further subtype (further subtype description)',
                '\t\t' + 'Challenge Rating: 90211',
                '\t\t' + 'Quantity: 9267',
                '\t' + 'creature 2',
                '\t\t' + 'Challenge Rating: 90212',
                '\t\t' + 'Quantity: 9268',
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
            encounter.creatures[0].type.description = 'description';
            encounter.creatures[0].type.subType = {
                name: 'subtype',
                description: 'subtype description',
                subType: {
                    name: 'further subtype',
                    description: 'further subtype description',
                    subType: null
                }
            };
            encounter.characters.push(createCharacter());
            encounter.characters.push(createCharacter());

            var formattedEncounter = encounterFormatterService.formatEncounter(encounter, '\t');
            var lines = formattedEncounter.split('\r\n');
            var expected = [
                '\t' + 'Target Encounter Level: 1337',
                '\t' + 'Average Encounter Level: 42 (super easy)',
                '\t' + 'Actual Encounter Level: 600 (nigh impossible)',
                '\t' + 'Creatures:',
                '\t\t' + 'creature 1 (description)',
                '\t\t\t' + 'Subtype: subtype (subtype description)',
                '\t\t\t\t' + 'Subtype: further subtype (further subtype description)',
                '\t\t\t' + 'Challenge Rating: 90211',
                '\t\t\t' + 'Quantity: 9267',
                '\t\t' + 'creature 2',
                '\t\t\t' + 'Challenge Rating: 90212',
                '\t\t\t' + 'Quantity: 9268',
                '\t' + 'Treasure:',
                '\t\t' + 'formatted treasure 1',
                '\t\t' + 'formatted treasure 2',
                '\t' + 'Characters:',
                '\t\t' + 'formatted character',
                '\t\t\t' + 'name: character 1',
                '\t\t\t' + 'level: 1',
                '',
                '\t\t' + 'formatted character',
                '\t\t\t' + 'name: character 2',
                '\t\t\t' + 'level: 2',
                '',
                '',
            ];

            for (var i = 0; i < lines.length; i++) {
                expect(lines[i]).toBe(expected[i]);
            }

            expect(lines.length).toBe(expected.length);
        });
    });

    describe('API Encounters', function () {

        beforeEach(function () {
            characterCount = 0;
            creatureCount = 0;

            encounter = createApiEncounter();
        });

        function createApiEncounter() {
            var encounter = getMock('encounter.api');
            encounter.description = "An API Encounter";
            encounter.creatures.push(createApiCreature());
            encounter.creatures.push(createApiCreature());
            encounter.treasures.push(createTreasure('first currency', 1));
            encounter.treasures.push(createTreasure('second currency', 2));
            encounter.targetEncounterLevel = 1337;
            encounter.averageEncounterLevel = 42;
            encounter.averageDifficulty = 'super easy';
            encounter.actualEncounterLevel = 600;
            encounter.actualDifficulty = 'nigh impossible';

            return encounter;
        }

        function createApiCreature() {
            creatureCount++;
            var creature = getMock('creature.api');

            creature.creature.name = 'creature ' + creatureCount;
            creature.quantity = 9266 + creatureCount;
            creature.challengeRating = 90210 + creatureCount;

            return creature;
        }

        function createTreasure(currency, quantity) {
            var treasure = getMock('treasure');

            treasure.coin.currency = currency;
            treasure.coin.quantity = quantity;
            treasure.isAny = true;

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

        it('formats encounter basics', function () {
            var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
            var lines = formattedEncounter.split('\r\n');
            var expected = [
                'An API Encounter',
                'Target Encounter Level: 1337',
                'Average Encounter Level: 42 (super easy)',
                'Actual Encounter Level: 600 (nigh impossible)',
                'Creatures:',
                '\t' + 'creature 1',
                '\t\t' + 'Challenge Rating: 90211',
                '\t\t' + 'Quantity: 9267',
                '\t' + 'creature 2',
                '\t\t' + 'Challenge Rating: 90212',
                '\t\t' + 'Quantity: 9268',
                'Treasure:',
                '\t' + 'formatted treasure 1',
                '\t' + 'formatted treasure 2',
                '',
            ];

            for (var i = 0; i < lines.length; i++) {
                expect(lines[i]).toBe(expected[i]);
            }

            expect(lines.length).toBe(expected.length);
        });

        it('formats creature descriptions', function () {
            encounter.creatures[0].creature.description = 'description'

            var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
            var lines = formattedEncounter.split('\r\n');
            var expected = [
                'An API Encounter',
                'Target Encounter Level: 1337',
                'Average Encounter Level: 42 (super easy)',
                'Actual Encounter Level: 600 (nigh impossible)',
                'Creatures:',
                '\t' + 'creature 1 (description)',
                '\t\t' + 'Challenge Rating: 90211',
                '\t\t' + 'Quantity: 9267',
                '\t' + 'creature 2',
                '\t\t' + 'Challenge Rating: 90212',
                '\t\t' + 'Quantity: 9268',
                'Treasure:',
                '\t' + 'formatted treasure 1',
                '\t' + 'formatted treasure 2',
                '',
            ];

            for (var i = 0; i < lines.length; i++) {
                expect(lines[i]).toBe(expected[i]);
            }

            expect(lines.length).toBe(expected.length);
        });

        it('formats creature sub-creatures', function () {
            encounter.creatures[0].creature.description = 'description'
            encounter.creatures[0].creature.subCreature = {
                name: 'sub-creature',
                description: 'sub-creature description',
                subCreature: null
            };

            var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
            var lines = formattedEncounter.split('\r\n');
            var expected = [
                'An API Encounter',
                'Target Encounter Level: 1337',
                'Average Encounter Level: 42 (super easy)',
                'Actual Encounter Level: 600 (nigh impossible)',
                'Creatures:',
                '\t' + 'creature 1 (description)',
                '\t\t' + 'Sub-creature: sub-creature (sub-creature description)',
                '\t\t' + 'Challenge Rating: 90211',
                '\t\t' + 'Quantity: 9267',
                '\t' + 'creature 2',
                '\t\t' + 'Challenge Rating: 90212',
                '\t\t' + 'Quantity: 9268',
                'Treasure:',
                '\t' + 'formatted treasure 1',
                '\t' + 'formatted treasure 2',
                '',
            ];

            for (var i = 0; i < lines.length; i++) {
                expect(lines[i]).toBe(expected[i]);
            }

            expect(lines.length).toBe(expected.length);
        });

        it('formats further creature sub-creatures', function () {
            encounter.creatures[0].creature.description = 'description'
            encounter.creatures[0].creature.subCreature = {
                name: 'sub-creature',
                description: 'sub-creature description',
                subCreature: {
                    name: 'further sub-creature',
                    description: 'further sub-creature description',
                    subCreature: null
                }
            };

            var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
            var lines = formattedEncounter.split('\r\n');
            var expected = [
                'An API Encounter',
                'Target Encounter Level: 1337',
                'Average Encounter Level: 42 (super easy)',
                'Actual Encounter Level: 600 (nigh impossible)',
                'Creatures:',
                '\t' + 'creature 1 (description)',
                '\t\t' + 'Sub-creature: sub-creature (sub-creature description)',
                '\t\t\t' + 'Sub-creature: further sub-creature (further sub-creature description)',
                '\t\t' + 'Challenge Rating: 90211',
                '\t\t' + 'Quantity: 9267',
                '\t' + 'creature 2',
                '\t\t' + 'Challenge Rating: 90212',
                '\t\t' + 'Quantity: 9268',
                'Treasure:',
                '\t' + 'formatted treasure 1',
                '\t' + 'formatted treasure 2',
                '',
            ];

            for (var i = 0; i < lines.length; i++) {
                expect(lines[i]).toBe(expected[i]);
            }

            expect(lines.length).toBe(expected.length);
        });

        it('formats further creature sub-creatures without descriptions', function () {
            encounter.creatures[0].creature.subCreature = {
                name: 'sub-creature',
                subCreature: {
                    name: 'further sub-creature',
                    subCreature: null
                }
            };

            var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
            var lines = formattedEncounter.split('\r\n');
            var expected = [
                'An API Encounter',
                'Target Encounter Level: 1337',
                'Average Encounter Level: 42 (super easy)',
                'Actual Encounter Level: 600 (nigh impossible)',
                'Creatures:',
                '\t' + 'creature 1',
                '\t\t' + 'Sub-creature: sub-creature',
                '\t\t\t' + 'Sub-creature: further sub-creature',
                '\t\t' + 'Challenge Rating: 90211',
                '\t\t' + 'Quantity: 9267',
                '\t' + 'creature 2',
                '\t\t' + 'Challenge Rating: 90212',
                '\t\t' + 'Quantity: 9268',
                'Treasure:',
                '\t' + 'formatted treasure 1',
                '\t' + 'formatted treasure 2',
                '',
            ];

            for (var i = 0; i < lines.length; i++) {
                expect(lines[i]).toBe(expected[i]);
            }

            expect(lines.length).toBe(expected.length);
        });

        it('formats characters', function () {
            encounter.characters.push(createCharacter());
            encounter.characters.push(createCharacter());

            var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
            var lines = formattedEncounter.split('\r\n');
            var expected = [
                'An API Encounter',
                'Target Encounter Level: 1337',
                'Average Encounter Level: 42 (super easy)',
                'Actual Encounter Level: 600 (nigh impossible)',
                'Creatures:',
                '\t' + 'creature 1',
                '\t\t' + 'Challenge Rating: 90211',
                '\t\t' + 'Quantity: 9267',
                '\t' + 'creature 2',
                '\t\t' + 'Challenge Rating: 90212',
                '\t\t' + 'Quantity: 9268',
                'Treasure:',
                '\t' + 'formatted treasure 1',
                '\t' + 'formatted treasure 2',
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
            encounter.treasures[0].isAny = false;
            encounter.treasures[1].isAny = false;

            var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
            var lines = formattedEncounter.split('\r\n');
            var expected = [
                'An API Encounter',
                'Target Encounter Level: 1337',
                'Average Encounter Level: 42 (super easy)',
                'Actual Encounter Level: 600 (nigh impossible)',
                'Creatures:',
                '\t' + 'creature 1',
                '\t\t' + 'Challenge Rating: 90211',
                '\t\t' + 'Quantity: 9267',
                '\t' + 'creature 2',
                '\t\t' + 'Challenge Rating: 90212',
                '\t\t' + 'Quantity: 9268',
                'Treasure: None',
                '',
            ];

            for (var i = 0; i < lines.length; i++) {
                expect(lines[i]).toBe(expected[i]);
            }

            expect(lines.length).toBe(expected.length);
        });

        it('formats treasure if there is some', function () {
            encounter.treasures[0].isAny = false;

            var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
            var lines = formattedEncounter.split('\r\n');
            var expected = [
                'An API Encounter',
                'Target Encounter Level: 1337',
                'Average Encounter Level: 42 (super easy)',
                'Actual Encounter Level: 600 (nigh impossible)',
                'Creatures:',
                '\t' + 'creature 1',
                '\t\t' + 'Challenge Rating: 90211',
                '\t\t' + 'Quantity: 9267',
                '\t' + 'creature 2',
                '\t\t' + 'Challenge Rating: 90212',
                '\t\t' + 'Quantity: 9268',
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
            encounter.creatures[0].creature.description = 'description';
            encounter.creatures[0].creature.subCreature = {
                name: 'sub-creature',
                description: 'sub-creature description',
                subCreature: {
                    name: 'further sub-creature',
                    description: 'further sub-creature description',
                    subCreature: null
                }
            };
            encounter.characters.push(createCharacter());
            encounter.characters.push(createCharacter());

            var formattedEncounter = encounterFormatterService.formatEncounter(encounter);
            var lines = formattedEncounter.split('\r\n');
            var expected = [
                'An API Encounter',
                'Target Encounter Level: 1337',
                'Average Encounter Level: 42 (super easy)',
                'Actual Encounter Level: 600 (nigh impossible)',
                'Creatures:',
                '\t' + 'creature 1 (description)',
                '\t\t' + 'Sub-creature: sub-creature (sub-creature description)',
                '\t\t\t' + 'Sub-creature: further sub-creature (further sub-creature description)',
                '\t\t' + 'Challenge Rating: 90211',
                '\t\t' + 'Quantity: 9267',
                '\t' + 'creature 2',
                '\t\t' + 'Challenge Rating: 90212',
                '\t\t' + 'Quantity: 9268',
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
            encounter.creatures[0].creature.description = 'description';
            encounter.creatures[0].creature.subCreature = {
                name: 'sub-creature',
                description: 'sub-creature description',
                subCreature: {
                    name: 'further sub-creature',
                    description: 'further sub-creature description',
                    subCreature: null
                }
            };
            encounter.characters.push(createCharacter());
            encounter.characters.push(createCharacter());

            var formattedEncounter = encounterFormatterService.formatEncounter(encounter, '\t');
            var lines = formattedEncounter.split('\r\n');
            var expected = [
                '\t' + 'An API Encounter',
                '\t' + 'Target Encounter Level: 1337',
                '\t' + 'Average Encounter Level: 42 (super easy)',
                '\t' + 'Actual Encounter Level: 600 (nigh impossible)',
                '\t' + 'Creatures:',
                '\t\t' + 'creature 1 (description)',
                '\t\t\t' + 'Sub-creature: sub-creature (sub-creature description)',
                '\t\t\t\t' + 'Sub-creature: further sub-creature (further sub-creature description)',
                '\t\t\t' + 'Challenge Rating: 90211',
                '\t\t\t' + 'Quantity: 9267',
                '\t\t' + 'creature 2',
                '\t\t\t' + 'Challenge Rating: 90212',
                '\t\t\t' + 'Quantity: 9268',
                '\t' + 'Treasure:',
                '\t\t' + 'formatted treasure 1',
                '\t\t' + 'formatted treasure 2',
                '\t' + 'Characters:',
                '\t\t' + 'formatted character',
                '\t\t\t' + 'name: character 1',
                '\t\t\t' + 'level: 1',
                '',
                '\t\t' + 'formatted character',
                '\t\t\t' + 'name: character 2',
                '\t\t\t' + 'level: 2',
                '',
                '',
            ];

            for (var i = 0; i < lines.length; i++) {
                expect(lines[i]).toBe(expected[i]);
            }

            expect(lines.length).toBe(expected.length);
        });
    });
});