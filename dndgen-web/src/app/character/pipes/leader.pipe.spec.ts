import { Character } from "../models/character.model";
import { Leadership } from "../models/leadership.model";
import { LeaderPipe } from "./leader.pipe";
import { CharacterPipe } from "./character.pipe";
import { LeadershipPipe } from "./leadership.pipe";

describe('Leader Pipe', () => {
    describe('unit', () => {
        let pipe: LeaderPipe;
        let characterPipeSpy: jasmine.SpyObj<CharacterPipe>;
        let leadershipPipeSpy: jasmine.SpyObj<LeadershipPipe>;

        let leader: Character;
        let leadership: Leadership | null;
        let cohort: Character | null;
        let followers: Character[];
        let characterCount: number;
    
        beforeEach(() => {
            characterPipeSpy = jasmine.createSpyObj('CharacterPipe', ['transform']);
            leadershipPipeSpy = jasmine.createSpyObj('LeadershipPipe', ['transform']);

            characterCount = 0;
            leader = createCharacter();
            leadership = null;
            cohort = null;
            followers = [];

            pipe = new LeaderPipe(leadershipPipeSpy, characterPipeSpy);

            characterPipeSpy.transform.and.callFake((character, prefix) => {
                if (!prefix)
                    prefix = '';

                let formattedCharacter = prefix + 'formatted character:\r\n';
                formattedCharacter += prefix + `\tsummary: ${character.summary}\r\n`;

                return formattedCharacter;
            });
            leadershipPipeSpy.transform.and.callFake((leadership, cohort, followers, prefix) => {
                if (!prefix)
                    prefix = '';

                if (!leadership)
                    return '';

                let formattedLeadership = prefix + 'formatted leadership:\r\n';
                formattedLeadership += prefix + `\tscore: ${leadership.score}\r\n`;
                formattedLeadership += prefix + `\tcohort: ${cohort?.summary ?? 'None'}\r\n`;

                if (followers.length == 0) {
                    formattedLeadership += prefix + `\tfollowers: None\r\n`;
                    return formattedLeadership;
                }

                formattedLeadership += prefix + `\tfollowers:\r\n`;

                for(var i = 0; i < followers.length; i++) {
                    formattedLeadership += prefix + `\t\t${followers[i].summary}\r\n`;
                }

                return formattedLeadership;
            });
        });

        function createCharacter(): Character {
            characterCount++;
    
            var newCharacter = new Character(`character summary ${characterCount}`);
            return newCharacter;
        }
        
        function expectLines(actual: string[], expected: string[]) {
            let badIndex = -1;
            for (var i = 0; i < actual.length && i < expected.length; i++) {
                if (actual[i] != expected[i]) {
                    badIndex = i;
                    break;
                }
            }

            if (badIndex >= 0) {
                expect(actual[badIndex].trim()).toEqual(expected[badIndex].trim());
                expect(actual[badIndex].match(/\\t/g) || []).toEqual(expected[badIndex].match(/\\t/g) || []);
                expect(actual[badIndex]).toEqual(expected[badIndex]);
            }
            
            expect(badIndex).toBe(-1);
            expect(actual.length).toBe(expected.length);
        }

        it('formats leader without leadership', () => {
            var formattedLeader = pipe.transform(leader, null, null, []);
            var lines = formattedLeader.split('\r\n');
    
            var expected = [
                'formatted character:',
                '\tsummary: character summary 1',
                '',
                '',
            ];
    
            expectLines(lines, expected);
        });

        it('formats leader without leadership but with prefix', () => {
            var formattedLeader = pipe.transform(leader, null, null, [], '\t');
            var lines = formattedLeader.split('\r\n');
    
            var expected = [
                '\tformatted character:',
                '\t\tsummary: character summary 1',
                '',
                '',
            ];
    
            expectLines(lines, expected);
        });

        it('formats leader with leadership', () => {
            leadership = new Leadership(9876, ['killed a man', 'with this thumb']);
            cohort = createCharacter();
            followers = [createCharacter(), createCharacter()];
    
            var formattedLeader = pipe.transform(leader, leadership, cohort, followers);
            var lines = formattedLeader.split('\r\n');
    
            var expected = [
                'formatted character:',
                '\tsummary: character summary 1',
                '',
                'formatted leadership:',
                '\tscore: 9876',
                '\tcohort: character summary 2',
                '\tfollowers:',
                '\t\tcharacter summary 3',
                '\t\tcharacter summary 4',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats leader with leadership and prefix', () => {
            leadership = new Leadership(9876, ['killed a man', 'with this thumb']);
            cohort = createCharacter();
            followers = [createCharacter(), createCharacter()];

            var formattedleader = pipe.transform(leader, leadership, cohort, followers, '\t');
            var lines = formattedleader.split('\r\n');
    
            var expected = [
                '\tformatted character:',
                '\t\tsummary: character summary 1',
                '',
                '\tformatted leadership:',
                '\t\tscore: 9876',
                '\t\tcohort: character summary 2',
                '\t\tfollowers:',
                '\t\t\tcharacter summary 3',
                '\t\t\tcharacter summary 4',
                '',
            ];
    
            expectLines(lines, expected);
        });
    });
});