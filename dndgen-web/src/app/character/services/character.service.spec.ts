// import { CharacterService } from './character.service'
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { of } from 'rxjs';
// import '@angular/compiler';
// import { TestBed, waitForAsync } from '@angular/core/testing';
// import { AppModule } from '../../app.module';
// import { CharacterGenViewModel } from '../models/charactergenViewModel.model';
// import { Character } from '../models/character.model';

// describe('Character Service', () => {
//     describe('unit', () => {
//         let characterService: CharacterService;
//         let httpClientSpy: jasmine.SpyObj<HttpClient>;
    
//         beforeEach(() => {
//             httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    
//             characterService = new CharacterService(httpClientSpy);
//         });

//         it('gets the character view model', done => {
//             const model = new CharacterGenViewModel(
//                 ['alignment randomizer 1', 'alignment randomizer 2'],
//                 ['alignment 1', 'alignment 2'],
//                 ['class name randomizer 1', 'class name randomizer 2'],
//                 ['class name 1', 'class name 2'],
//                 ['level randomizer 1', 'level randomizer 2'],
//                 ['base race randomizer 1', 'base race randomizer 2'],
//                 ['base race 1', 'base race 2'],
//                 ['metarace randomizer 1', 'metarace randomizer 2'],
//                 ['metarace 1', 'metarace 2'],
//                 ['abilities randomizer 1', 'abilities randomizer 2'],
//             );
//             httpClientSpy.get.and.returnValue(of(model));
    
//             characterService.getViewModel().subscribe((viewmodel) => {
//                 expect(viewmodel).toBe(model);
//                 expect(httpClientSpy.get).toHaveBeenCalledWith('https://web.dndgen.com/api/v1/character/viewmodel');
//                 done();
//             });
//         });
    
//         let booleanCombos = [
//             {l: true, m: true, a: true},
//             {l: true, m: true, a: false},
//             {l: true, m: false, a: true},
//             {l: true, m: false, a: false},
//             {l: false, m: true, a: true},
//             {l: false, m: true, a: false},
//             {l: false, m: false, a: true},
//             {l: false, m: false, a: false},
//         ];

//         booleanCombos.forEach(test => {
//             it(`generates character - level ${test.l}, metarace ${test.m}, abilities ${test.a}`, done => {
//                 const expected = new Character('my character summary');
//                 httpClientSpy.get.and.returnValue(of(expected));
//                 let params = new HttpParams()
//                     .set('aligmentRandomizerType', 'my alignment randomizer')
//                     .set('setAlignment', 'my alignment')
//                     .set('classNameRandomizerType', 'my class name randomizer')
//                     .set('setClassName', 'my class name')
//                     .set('levelRandomizerType', 'my level randomizer')
//                     .set('setLevel', 9266)
//                     .set('allowLevelAdjustments', test.l)
//                     .set('baseRaceRandomizerType', 'my base race randomizer')
//                     .set('setBaseRace', 'my base race')
//                     .set('metaraceRandomizerType', 'my metarace randomizer')
//                     .set('setMetarace', 'my metarace')
//                     .set('forceMetarace', test.m)
//                     .set('abilitiesRandomizerType', 'my abilities randomizer')
//                     .set('setStrength', 90210)
//                     .set('setConstitution', 42)
//                     .set('setDexterity', 600)
//                     .set('setIntelligence', 1337)
//                     .set('setWisdom', 1336)
//                     .set('setCharisma', 96)
//                     .set('allowAbilityAdjustments', test.a);
        
//                 characterService
//                     .generate(
//                         'my alignment randomizer',
//                         'my alignment',
//                         'my class name randomizer',
//                         'my class name',
//                         'my level randomizer',
//                         9266,
//                         test.l,
//                         'my base race randomizer',
//                         'my base race',
//                         'my metarace randomizer',
//                         test.m,
//                         'my metarace',
//                         'my abilities randomizer',
//                         90210,
//                         42,
//                         600,
//                         1337,
//                         1336,
//                         96,
//                         test.a)
//                     .subscribe((character) => {
//                         expect(character).toBe(expected);
//                         expect(httpClientSpy.get).toHaveBeenCalledWith('https://character.dndgen.com/api/v1/character/generate', { params: params });
//                         done();
//                     });
//             });
            
//             it(`validates a valid character - level ${test.l}, metarace ${test.m}, abilities ${test.a}`, done => {
//                 httpClientSpy.get.and.returnValue(of(true));
//                 let params = new HttpParams()
//                     .set('aligmentRandomizerType', 'my alignment randomizer')
//                     .set('setAlignment', 'my alignment')
//                     .set('classNameRandomizerType', 'my class name randomizer')
//                     .set('setClassName', 'my class name')
//                     .set('levelRandomizerType', 'my level randomizer')
//                     .set('setLevel', 9266)
//                     .set('allowLevelAdjustments', test.l)
//                     .set('baseRaceRandomizerType', 'my base race randomizer')
//                     .set('setBaseRace', 'my base race')
//                     .set('metaraceRandomizerType', 'my metarace randomizer')
//                     .set('setMetarace', 'my metarace')
//                     .set('forceMetarace', test.m);

//                 characterService
//                     .validate(
//                         'my alignment randomizer',
//                         'my alignment',
//                         'my class name randomizer',
//                         'my class name',
//                         'my level randomizer',
//                         9266,
//                         test.l,
//                         'my base race randomizer',
//                         'my base race',
//                         'my metarace randomizer',
//                         test.m,
//                         'my metarace')
//                     .subscribe((validity) => {
//                         expect(validity).toBe(true);
//                         expect(httpClientSpy.get).toHaveBeenCalledWith('https://character.dndgen.com/api/v1/character/validate', { params: params });
//                         done();
//                     });
//             });
        
//             it(`validates an invalid character - level ${test.l}, metarace ${test.m}, abilities ${test.a}`, done => {
//                 httpClientSpy.get.and.returnValue(of(false));
//                 let params = new HttpParams()
//                     .set('aligmentRandomizerType', 'my alignment randomizer')
//                     .set('setAlignment', 'my alignment')
//                     .set('classNameRandomizerType', 'my class name randomizer')
//                     .set('setClassName', 'my class name')
//                     .set('levelRandomizerType', 'my level randomizer')
//                     .set('setLevel', 9266)
//                     .set('allowLevelAdjustments', test.l)
//                     .set('baseRaceRandomizerType', 'my base race randomizer')
//                     .set('setBaseRace', 'my base race')
//                     .set('metaraceRandomizerType', 'my metarace randomizer')
//                     .set('setMetarace', 'my metarace')
//                     .set('forceMetarace', test.m);
        
//                 characterService
//                     .validate(
//                         'my alignment randomizer',
//                         'my alignment',
//                         'my class name randomizer',
//                         'my class name',
//                         'my level randomizer',
//                         9266,
//                         test.l,
//                         'my base race randomizer',
//                         'my base race',
//                         'my metarace randomizer',
//                         test.m,
//                         'my metarace')
//                     .subscribe((validity) => {
//                         expect(validity).toBe(false);
//                         expect(httpClientSpy.get).toHaveBeenCalledWith('https://character.dndgen.com/api/v1/character/validate', { params: params });
//                         done();
//                     });
//             });
//         });
//     });
    
//     describe('integration', () => {
//         let characterService: CharacterService;
    
//         beforeEach(async () => {
//             await TestBed.configureTestingModule({
//               imports: [
//                 AppModule
//               ],
//             }).compileComponents();
        
//             characterService = TestBed.inject(CharacterService);
//         });

//         it('gets the character view model', waitForAsync(() => {
//             characterService.getViewModel().subscribe((viewmodel) => {
//                 expect(viewmodel).toBeTruthy();
//                 expect(viewmodel.alignmentRandomizerTypes.length).toBe(4);
//                 expect(viewmodel.alignments.length).toBe(4);
//                 expect(viewmodel.classNameRandomizerTypes.length).toBe(4);
//                 expect(viewmodel.classNames.length).toBe(4);
//                 expect(viewmodel.levelRandomizerTypes.length).toBe(4);
//                 expect(viewmodel.baseRaceRandomizerTypes.length).toBe(4);
//                 expect(viewmodel.baseRaces.length).toBe(4);
//                 expect(viewmodel.metaraceRandomizerTypes.length).toBe(4);
//                 expect(viewmodel.metaraces.length).toBe(4);
//                 expect(viewmodel.abilitiesRandomizerTypes.length).toBe(4);
//             });
//         }));
    
//         it('generates character', waitForAsync(() => {
//             characterService
//                 .generate(
//                     'Any',
//                     '',
//                     'Any Player',
//                     '',
//                     'Any',
//                     0,
//                     true,
//                     'Any Base',
//                     '',
//                     'Any Meta',
//                     false,
//                     '',
//                     'Raw',
//                     0,
//                     0,
//                     0,
//                     0,
//                     0,
//                     0,
//                     true)
//                 .subscribe((character) => {
//                     expect(character).toBeTruthy();
//                     expect(character.summary).toBeTruthy();
//                 });
//         }));
    
//         it('generates character with set values', waitForAsync(() => {
//             characterService
//                 .generate(
//                     'Set',
//                     'Neutral Good',
//                     'Set',
//                     'Fighter',
//                     'Set',
//                     9,
//                     true,
//                     'Set',
//                     'Half-Orc',
//                     'Set',
//                     false,
//                     'Werewolf',
//                     'Set',
//                     26,
//                     6,
//                     9,
//                     21,
//                     4,
//                     2,
//                     true)
//                 .subscribe((character) => {
//                     expect(character).toBeTruthy();
//                     expect(character.summary).toBeTruthy();
//                 });
//         }));
    
//         it('validates a valid character', done => {
//             characterService
//                 .validate(
//                     'Set',
//                     'Neutral Good',
//                     'Set',
//                     'Fighter',
//                     'Set',
//                     9,
//                     true,
//                     'Set',
//                     'Half-Orc',
//                     'Set',
//                     false,
//                     'Werewolf')
//                 .subscribe((validity) => {
//                     expect(validity).toBe(true);
//                     done();
//                 });
//         });
    
//         it('validates an invalid character - bad alignment randomizer', done => {
//             characterService
//                 .validate(
//                     'Invalid',
//                     'Neutral Good',
//                     'Set',
//                     'Fighter',
//                     'Set',
//                     9,
//                     true,
//                     'Set',
//                     'Half-Orc',
//                     'Set',
//                     false,
//                     'Werewolf')
//                 .subscribe((validity) => {
//                     expect(validity).toBe(false);
//                     done();
//                 });
//         });
    
//         it('validates an invalid character - bad alignment', done => {
//             characterService
//                 .validate(
//                     'Set',
//                     'Bad Alignment',
//                     'Set',
//                     'Fighter',
//                     'Set',
//                     9,
//                     true,
//                     'Set',
//                     'Half-Orc',
//                     'Set',
//                     false,
//                     'Werewolf')
//                 .subscribe((validity) => {
//                     expect(validity).toBe(false);
//                     done();
//                 });
//         });
    
//         it('validates an invalid character - bad class name randomizer', done => {
//             characterService
//                 .validate(
//                     'Set',
//                     'Neutral Good',
//                     'Bad',
//                     'Fighter',
//                     'Set',
//                     9,
//                     true,
//                     'Set',
//                     'Half-Orc',
//                     'Set',
//                     false,
//                     'Werewolf')
//                 .subscribe((validity) => {
//                     expect(validity).toBe(false);
//                     done();
//                 });
//         });
    
//         it('validates an invalid character - bad class name', done => {
//             characterService
//                 .validate(
//                     'Set',
//                     'Neutral Good',
//                     'Set',
//                     'Bad Class Name',
//                     'Set',
//                     9,
//                     true,
//                     'Set',
//                     'Half-Orc',
//                     'Set',
//                     false,
//                     'Werewolf')
//                 .subscribe((validity) => {
//                     expect(validity).toBe(false);
//                     done();
//                 });
//         });
    
//         it('validates an invalid character - bad level randomizer', done => {
//             characterService
//                 .validate(
//                     'Set',
//                     'Neutral Good',
//                     'Set',
//                     'Fighter',
//                     'Bad',
//                     9,
//                     true,
//                     'Set',
//                     'Half-Orc',
//                     'Set',
//                     false,
//                     'Werewolf')
//                 .subscribe((validity) => {
//                     expect(validity).toBe(false);
//                     done();
//                 });
//         });
    
//         it('validates an invalid character - bad level', done => {
//             characterService
//                 .validate(
//                     'Set',
//                     'Neutral Good',
//                     'Set',
//                     'Fighter',
//                     'Set',
//                     92,
//                     true,
//                     'Set',
//                     'Half-Orc',
//                     'Set',
//                     false,
//                     'Werewolf')
//                 .subscribe((validity) => {
//                     expect(validity).toBe(false);
//                     done();
//                 });
//         });
    
//         it('validates an invalid character - bad base race randomizer', done => {
//             characterService
//                 .validate(
//                     'Set',
//                     'Neutral Good',
//                     'Set',
//                     'Fighter',
//                     'Set',
//                     9,
//                     true,
//                     'Bad',
//                     'Half-Orc',
//                     'Set',
//                     false,
//                     'Werewolf')
//                 .subscribe((validity) => {
//                     expect(validity).toBe(false);
//                     done();
//                 });
//         });
    
//         it('validates an invalid character - bad base race', done => {
//             characterService
//                 .validate(
//                     'Set',
//                     'Neutral Good',
//                     'Set',
//                     'Fighter',
//                     'Set',
//                     9,
//                     true,
//                     'Set',
//                     'Bad Race',
//                     'Set',
//                     false,
//                     'Werewolf')
//                 .subscribe((validity) => {
//                     expect(validity).toBe(false);
//                     done();
//                 });
//         });
    
//         it('validates an invalid character - bad metarace randomizer', done => {
//             characterService
//                 .validate(
//                     'Set',
//                     'Neutral Good',
//                     'Set',
//                     'Fighter',
//                     'Set',
//                     9,
//                     true,
//                     'Set',
//                     'Half-Orc',
//                     'Bad',
//                     false,
//                     'Werewolf')
//                 .subscribe((validity) => {
//                     expect(validity).toBe(false);
//                     done();
//                 });
//         });
    
//         it('validates an invalid character - bad metarace', done => {
//             characterService
//                 .validate(
//                     'Set',
//                     'Neutral Good',
//                     'Set',
//                     'Fighter',
//                     'Set',
//                     9,
//                     true,
//                     'Set',
//                     'Half-Orc',
//                     'Set',
//                     false,
//                     'Bad Metarace')
//                 .subscribe((validity) => {
//                     expect(validity).toBe(false);
//                     done();
//                 });
//         });
    
//         it('validates an invalid character - bad combo', done => {
//             characterService
//                 .validate(
//                     'Set',
//                     'Neutral Good',
//                     'Set',
//                     'Fighter',
//                     'Set',
//                     9,
//                     true,
//                     'Set',
//                     'Half-Orc',
//                     'Set',
//                     false,
//                     'Vampire')
//                 .subscribe((validity) => {
//                     expect(validity).toBe(false);
//                     done();
//                 });
//         });
//     });
// });