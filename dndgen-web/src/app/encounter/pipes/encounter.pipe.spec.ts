import { Character } from "../../character/models/character.model";
import { CharacterPipe } from "../../character/pipes/character.pipe";
import { TestHelper } from "../../testHelper.spec";
import { Treasure } from "../../treasure/models/treasure.model";
import { TreasurePipe } from "../../treasure/pipes/treasure.pipe";
import { Creature } from "../models/creature.model";
import { Encounter } from "../models/encounter.model";
import { EncounterCreature } from "../models/encounterCreature.model";
import { EncounterPipe } from "./encounter.pipe";

describe('Encounter Pipe', () => {
    describe('unit', () => {
        let pipe: EncounterPipe;
        let characterPipeSpy: jasmine.SpyObj<CharacterPipe>;
        let treasurePipeSpy: jasmine.SpyObj<TreasurePipe>;
        let characterCount: number;
        let creatureCount: number;

        beforeEach(() => {
            treasurePipeSpy = jasmine.createSpyObj('TreasurePipe', ['transform']);
            characterPipeSpy = jasmine.createSpyObj('CharacterPipe', ['transform']);
            pipe = new EncounterPipe(characterPipeSpy, treasurePipeSpy);

            treasurePipeSpy.transform.and.callFake((treasure, prefix) => {
                if (!prefix)
                    prefix = '';

                var formattedTreasure = `${prefix}formatted treasure:\r\n`;
                formattedTreasure += `${prefix}\tcoins: ${treasure.coin.quantity} ${treasure.coin.currency}\r\n`;

                return formattedTreasure;
            });

            characterPipeSpy.transform.and.callFake((character, prefix) => {
                if (!prefix)
                    prefix = '';

                let formattedCharacter = `${prefix}formatted character:\r\n`;
                formattedCharacter += `${prefix}\tsummary: ${character.summary}\r\n`;

                return formattedCharacter;
            });
            
            characterCount = 0;
            creatureCount = 0;
        });

        function createEncounter() {
            var encounter = new Encounter("An API Encounter");
            encounter.creatures.push(createCreature());
            encounter.creatures.push(createCreature());
            encounter.treasures.push(createTreasure('first currency', 1));
            encounter.treasures.push(createTreasure('second currency', 2));
            encounter.targetEncounterLevel = 1337;
            encounter.averageEncounterLevel = 42;
            encounter.averageDifficulty = 'super easy';
            encounter.actualEncounterLevel = 600;
            encounter.actualDifficulty = 'nigh impossible';

            return encounter;
        }

        function createCreature(): EncounterCreature {
            creatureCount++;
            var creature = new EncounterCreature(
                new Creature(
                    `creature ${creatureCount}`, 
                    ''),
                9266 + creatureCount,
                `${90210 + creatureCount}`
            );

            return creature;
        }

        function createTreasure(currency: string, quantity: number): Treasure {
            var treasure = new Treasure();

            treasure.coin.currency = currency;
            treasure.coin.quantity = quantity;
            treasure.isAny = true;

            return treasure;
        }

        function createCharacter(): Character {
            characterCount++;

            return new Character(`summary ${characterCount}`);
        }

        it('formats encounter basics', () => {
            const encounter = createEncounter();

            var formattedEncounter = pipe.transform(encounter);
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
                "\tformatted treasure:",
                "\t\tcoins: 1 first currency",
                "\tformatted treasure:",
                "\t\tcoins: 2 second currency",
                '',
            ];

            TestHelper.expectLines(lines, expected);
        });

        it('formats creature descriptions', () => {
            const encounter = createEncounter();
            encounter.creatures[0].creature.description = 'description'

            var formattedEncounter = pipe.transform(encounter);
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
                "\tformatted treasure:",
                "\t\tcoins: 1 first currency",
                "\tformatted treasure:",
                "\t\tcoins: 2 second currency",
                '',
            ];

            TestHelper.expectLines(lines, expected);
        });

        it('formats creature sub-creatures', () => {
            const encounter = createEncounter();
            encounter.creatures[0].creature.description = 'description'
            encounter.creatures[0].creature.subCreature = {
                name: 'sub-creature',
                description: 'sub-creature description',
                subCreature: null
            };

            var formattedEncounter = pipe.transform(encounter);
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
                "\tformatted treasure:",
                "\t\tcoins: 1 first currency",
                "\tformatted treasure:",
                "\t\tcoins: 2 second currency",
                '',
            ];

            TestHelper.expectLines(lines, expected);
        });

        it('formats further creature sub-creatures', () => {
            const encounter = createEncounter();
            encounter.creatures[0].creature.subCreature = {
                name: 'sub-creature',
                description: '',
                subCreature: {
                    name: 'further sub-creature',
                    description: '',
                    subCreature: null
                }
            };

            var formattedEncounter = pipe.transform(encounter);
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
                "\tformatted treasure:",
                "\t\tcoins: 1 first currency",
                "\tformatted treasure:",
                "\t\tcoins: 2 second currency",
                '',
            ];

            TestHelper.expectLines(lines, expected);
        });

        it('formats further creature sub-creatures with descriptions', () => {
            const encounter = createEncounter();
            encounter.creatures[0].creature.subCreature = new Creature(
                'sub-creature', 
                'sub-description',
                new Creature(
                    'further sub-creature',
                    'further sub-description',
                )
            );

            var formattedEncounter = pipe.transform(encounter);
            var lines = formattedEncounter.split('\r\n');
            var expected = [
                'An API Encounter',
                'Target Encounter Level: 1337',
                'Average Encounter Level: 42 (super easy)',
                'Actual Encounter Level: 600 (nigh impossible)',
                'Creatures:',
                '\t' + 'creature 1',
                '\t\t' + 'Sub-creature: sub-creature (sub-description)',
                '\t\t\t' + 'Sub-creature: further sub-creature (further sub-description)',
                '\t\t' + 'Challenge Rating: 90211',
                '\t\t' + 'Quantity: 9267',
                '\t' + 'creature 2',
                '\t\t' + 'Challenge Rating: 90212',
                '\t\t' + 'Quantity: 9268',
                'Treasure:',
                "\tformatted treasure:",
                "\t\tcoins: 1 first currency",
                "\tformatted treasure:",
                "\t\tcoins: 2 second currency",
                '',
            ];

            TestHelper.expectLines(lines, expected);
        });

        it('formats characters', () => {
            const encounter = createEncounter();
            encounter.characters.push(createCharacter());
            encounter.characters.push(createCharacter());

            var formattedEncounter = pipe.transform(encounter);
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
                "\tformatted treasure:",
                "\t\tcoins: 1 first currency",
                "\tformatted treasure:",
                "\t\tcoins: 2 second currency",
                'Characters:',
                '\tformatted character:',
                '\t\tsummary: summary 1',
                '',
                '\tformatted character:',
                '\t\tsummary: summary 2',
                '',
                '',
            ];

            TestHelper.expectLines(lines, expected);
        });

        it('formats treasure if there is not any', () => {
            const encounter = createEncounter();
            encounter.treasures[0].isAny = false;
            encounter.treasures[1].isAny = false;

            var formattedEncounter = pipe.transform(encounter);
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

            TestHelper.expectLines(lines, expected);
        });

        it('formats treasure if there is some', () => {
            const encounter = createEncounter();
            encounter.treasures[0].isAny = false;

            var formattedEncounter = pipe.transform(encounter);
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
                "\tformatted treasure:",
                "\t\tcoins: 2 second currency",
                '',
            ];

            TestHelper.expectLines(lines, expected);
        });

        it('formats full encounter', () => {
            const encounter = createEncounter();
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

            var formattedEncounter = pipe.transform(encounter);
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
                "\tformatted treasure:",
                "\t\tcoins: 1 first currency",
                "\tformatted treasure:",
                "\t\tcoins: 2 second currency",
                'Characters:',
                '\tformatted character:',
                '\t\tsummary: summary 1',
                '',
                '\tformatted character:',
                '\t\tsummary: summary 2',
                '',
                '',
            ];

            TestHelper.expectLines(lines, expected);
        });

        it('formats full encounter with prefix', () => {
            const encounter = createEncounter();
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

            var formattedEncounter = pipe.transform(encounter, '\t');
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
                '\t\t' + 'formatted treasure:',
                '\t\t\t' + 'coins: 1 first currency',
                '\t\t' + 'formatted treasure:',
                '\t\t\t' + 'coins: 2 second currency',
                '\t' + 'Characters:',
                '\t\t' + 'formatted character:',
                '\t\t\t' + 'summary: summary 1',
                '',
                '\t\t' + 'formatted character:',
                '\t\t\t' + 'summary: summary 2',
                '',
                '',
            ];

            TestHelper.expectLines(lines, expected);
        });
    });
});