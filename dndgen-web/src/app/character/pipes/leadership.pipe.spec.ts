import { TestHelper } from "../../testHelper.spec";
import { Character } from "../models/character.model";
import { Leadership } from "../models/leadership.model";
import { CharacterPipe } from "./character.pipe";
import { LeadershipPipe } from "./leadership.pipe";

describe('Leadership Pipe', () => {
    describe('unit', () => {
        let pipe: LeadershipPipe;
        let characterPipeSpy: jasmine.SpyObj<CharacterPipe>;

        let leadership: Leadership | null;
        let cohort: Character | null;
        let followers: Character[];
        let characterCount: number;
    
        beforeEach(() => {
            characterPipeSpy = jasmine.createSpyObj('CharacterPipe', ['transform']);

            characterCount = 0;
            leadership = null;
            cohort = null;
            followers = [];

            pipe = new LeadershipPipe(characterPipeSpy);

            characterPipeSpy.transform.and.callFake((character, prefix) => {
                if (!prefix)
                    prefix = '';

                let formattedCharacter = prefix + 'formatted character:\r\n';
                formattedCharacter += prefix + `\tsummary: ${character.summary}\r\n`;

                return formattedCharacter;
            });
        });

        function createCharacter(): Character {
            characterCount++;
    
            var newCharacter = new Character(`character summary ${characterCount}`);
            return newCharacter;
        }

        it('formats missing leadership', () => {
            var formattedLeadership = pipe.transform(null, null, []);
            var lines = formattedLeadership.split('\r\n');

            var expected = [
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });

        it('formats leadership', () => {
            leadership = new Leadership(9876, ['killed a man', 'with this thumb']);
    
            var formattedLeadership = pipe.transform(leadership, cohort, followers);
            var lines = formattedLeadership.split('\r\n');

            var expected = [
                'Leadership:',
                '\tScore: 9876',
                '\tLeadership Modifiers:',
                '\t\tkilled a man',
                '\t\twith this thumb',
                '',
                'Cohort: None',
                '',
                'Followers (x0): None',
                ''
            ];
    
            TestHelper.expectLines(lines, expected);
        });

        it('formats leadership with cohort', () => {
            leadership = new Leadership(9876, ['killed a man', 'with this thumb']);
            cohort = createCharacter();
    
            var formattedLeadership = pipe.transform(leadership, cohort, followers);
            var lines = formattedLeadership.split('\r\n');

            var expected = [
                'Leadership:',
                '\tScore: 9876',
                '\tLeadership Modifiers:',
                '\t\tkilled a man',
                '\t\twith this thumb',
                '',
                'Cohort:',
                '\tformatted character:',
                '\t\tsummary: character summary 1',
                '',
                'Followers (x0): None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });

        it('formats leadership with followers', () => {
            leadership = new Leadership(9876, ['killed a man', 'with this thumb']);
            followers = [createCharacter(), createCharacter()];
    
            var formattedLeadership = pipe.transform(leadership, cohort, followers);
            var lines = formattedLeadership.split('\r\n');

            var expected = [
                'Leadership:',
                '\tScore: 9876',
                '\tLeadership Modifiers:',
                '\t\tkilled a man',
                '\t\twith this thumb',
                '',
                'Cohort: None',
                '',
                'Followers (x2):',
                '',
                '\tformatted character:',
                '\t\tsummary: character summary 1',
                '',
                '\tformatted character:',
                '\t\tsummary: character summary 2',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });

        it('formats full leadership', () => {
            leadership = new Leadership(9876, ['killed a man', 'with this thumb']);
            cohort = createCharacter();
            followers = [createCharacter(), createCharacter()];
    
            var formattedLeadership = pipe.transform(leadership, cohort, followers);
            var lines = formattedLeadership.split('\r\n');

            var expected = [
                'Leadership:',
                '\tScore: 9876',
                '\tLeadership Modifiers:',
                '\t\tkilled a man',
                '\t\twith this thumb',
                '',
                'Cohort:',
                '\tformatted character:',
                '\t\tsummary: character summary 1',
                '',
                'Followers (x2):',
                '',
                '\tformatted character:',
                '\t\tsummary: character summary 2',
                '',
                '\tformatted character:',
                '\t\tsummary: character summary 3',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });

        it('formats full leadership with prefix', () => {
            leadership = new Leadership(9876, ['killed a man', 'with this thumb']);
            cohort = createCharacter();
            followers = [createCharacter(), createCharacter()];
    
            var formattedLeadership = pipe.transform(leadership, cohort, followers, '\t');
            var lines = formattedLeadership.split('\r\n');

            var expected = [
                '\tLeadership:',
                '\t\tScore: 9876',
                '\t\tLeadership Modifiers:',
                '\t\t\tkilled a man',
                '\t\t\twith this thumb',
                '',
                '\tCohort:',
                '\t\tformatted character:',
                '\t\t\tsummary: character summary 1',
                '',
                '\tFollowers (x2):',
                '',
                '\t\tformatted character:',
                '\t\t\tsummary: character summary 2',
                '',
                '\t\tformatted character:',
                '\t\t\tsummary: character summary 3',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });
    });
});