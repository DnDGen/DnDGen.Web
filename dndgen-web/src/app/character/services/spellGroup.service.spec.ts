import { Spell } from "../models/spell.model";
import { SpellGroupService } from "./spellGroup.service";

describe('SpellGroup Service', () => {
    describe('unit', () => {
        let spellGroupService: SpellGroupService;

        beforeEach(() => {
            spellGroupService = new SpellGroupService();
        });

        it('gets spell group name', () => {
            const name = spellGroupService.getSpellGroupName(9, 'my source');
            expect(name).toEqual('my source Level 9');
        });

        it('sorts into empty group', () => {
            const spellGroups = spellGroupService.sortIntoGroups([]);
            expect(spellGroups).toEqual([]);
        });

        it('sorts into group with name of level and source', () => {
            const spells = [
                new Spell({'my source': 9}, 'my spell'),
            ];

            const spellGroups = spellGroupService.sortIntoGroups(spells);
            expect(spellGroups.length).toEqual(1);
            expect(spellGroups[0].name).toEqual('my source Level 9');
            expect(spellGroups[0].spells).toEqual(spells);
        });

        it('sorts into group with name of level and source - multiple spells different name', () => {
            const spells = [
                new Spell({'my source': 9}, 'my spell'),
                new Spell({'my source': 9}, 'my other spell'),
            ];

            const spellGroups = spellGroupService.sortIntoGroups(spells);
            expect(spellGroups.length).toEqual(1);
            expect(spellGroups[0].name).toEqual('my source Level 9');
            expect(spellGroups[0].spells).toEqual([spells[1], spells[0]]);
        });

        it('sorts into group with name of level and source - multiple spells same name', () => {
            const spells = [
                new Spell({'my source': 9}, 'my spell'),
                new Spell({'my source': 9}, 'my spell'),
            ];

            const spellGroups = spellGroupService.sortIntoGroups(spells);
            expect(spellGroups.length).toEqual(1);
            expect(spellGroups[0].name).toEqual('my source Level 9');
            expect(spellGroups[0].spells).toEqual(spells);
        });

        it('sorts into groups with name of level and source - different level', () => {
            const spells = [
                new Spell({'my source': 9}, 'my spell'),
                new Spell({'my source': 2}, 'my other spell'),
            ];

            const spellGroups = spellGroupService.sortIntoGroups(spells);
            expect(spellGroups.length).toEqual(2);
            expect(spellGroups[0].name).toEqual('my source Level 2');
            expect(spellGroups[0].spells).toEqual(spells.slice(1));
            expect(spellGroups[1].name).toEqual('my source Level 9');
            expect(spellGroups[1].spells).toEqual(spells.slice(0, 1));
        });

        it('sorts into groups with name of level and source - different source', () => {
            const spells = [
                new Spell({'my source': 9 }, 'my spell'),
                new Spell({'my other source': 9}, 'my other spell'),
            ];

            const spellGroups = spellGroupService.sortIntoGroups(spells);
            expect(spellGroups.length).toEqual(2);
            expect(spellGroups[0].name).toEqual('my other source Level 9');
            expect(spellGroups[0].spells).toEqual(spells.slice(1));
            expect(spellGroups[1].name).toEqual('my source Level 9');
            expect(spellGroups[1].spells).toEqual(spells.slice(0, 1));
        });

        it('sorts into groups with name of level and source - different level and source', () => {
            const spells = [
                new Spell({'my source': 9}, 'my spell'),
                new Spell({'my other source': 2}, 'my other spell'),
            ];

            const spellGroups = spellGroupService.sortIntoGroups(spells);
            expect(spellGroups.length).toEqual(2);
            expect(spellGroups[0].name).toEqual('my other source Level 2');
            expect(spellGroups[0].spells).toEqual(spells.slice(1));
            expect(spellGroups[1].name).toEqual('my source Level 9');
            expect(spellGroups[1].spells).toEqual(spells.slice(0, 1));
        });

        it('sorts into groups with name of level and source - different sources, same spell', () => {
            const spells = [
                new Spell({'my source': 9, 'my other source': 8}, 'my spell'),
                new Spell({'my source': 9}, 'my spell 2'),
                new Spell({'my other source': 8}, 'my other spell'),
            ];

            const spellGroups = spellGroupService.sortIntoGroups(spells);
            expect(spellGroups.length).toEqual(2);
            expect(spellGroups[0].name).toEqual('my other source Level 8');
            expect(spellGroups[0].spells).toEqual([spells[2], spells[0]]);
            expect(spellGroups[1].name).toEqual('my source Level 9');
            expect(spellGroups[1].spells).toEqual([spells[0], spells[1]]);
        });

        it('sorts into groups with name of level and source - full set', () => {
            const spells = [
                new Spell({'my source': 9}, 'my spell'),
                new Spell({'my source': 2}, 'my other spell'),
                new Spell({'my source': 2}, 'my other spell'),
                new Spell({'my other source': 4}, 'another spell'),
                new Spell({'my other source': 4}, 'another spell'),
                new Spell({'my other source': 6}, 'yet another spell'),
            ];

            const spellGroups = spellGroupService.sortIntoGroups(spells);
            expect(spellGroups.length).toEqual(4);
            expect(spellGroups[0].name).toEqual('my other source Level 4');
            expect(spellGroups[0].spells).toEqual(spells.slice(3, 5));
            expect(spellGroups[1].name).toEqual('my other source Level 6');
            expect(spellGroups[1].spells).toEqual(spells.slice(5));
            expect(spellGroups[2].name).toEqual('my source Level 2');
            expect(spellGroups[2].spells).toEqual(spells.slice(1, 3));
            expect(spellGroups[3].name).toEqual('my source Level 9');
            expect(spellGroups[3].spells).toEqual(spells.slice(0, 1));
        });

        it('sorts into sorted groups with name of level and source', () => {
            const spells = [
                new Spell({'my other source': 4}, 'spell BBB'),
                new Spell({'my source': 9}, 'spell AAA'),
                new Spell({'my other source': 4}, 'spell aaa'),
                new Spell({'my other source': 6}, 'yet another spell'),
                new Spell({'my source': 2}, 'my spell'),
                new Spell({'my source': 9}, 'spell bbb'),
            ];

            const spellGroups = spellGroupService.sortIntoGroups(spells);
            expect(spellGroups.length).toEqual(4);
            expect(spellGroups[0].name).toEqual('my other source Level 4');
            expect(spellGroups[0].spells).toEqual([spells[2], spells[0]]);
            expect(spellGroups[1].name).toEqual('my other source Level 6');
            expect(spellGroups[1].spells).toEqual([spells[3]]);
            expect(spellGroups[2].name).toEqual('my source Level 2');
            expect(spellGroups[2].spells).toEqual([spells[4]]);
            expect(spellGroups[3].name).toEqual('my source Level 9');
            expect(spellGroups[3].spells).toEqual([spells[1], spells[5]]);
        });
    });
});