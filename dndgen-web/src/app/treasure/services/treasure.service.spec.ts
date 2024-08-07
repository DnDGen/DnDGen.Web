import { TreasureService } from './treasure.service'
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { AppModule } from '../../app.module';
import { TreasureGenViewModel } from '../models/treasuregenViewModel.model';
import { ItemTypeViewModel } from '../models/itemTypeViewModel.model';
import { Treasure } from '../models/treasure.model';
import { Coin } from '../models/coin.model';
import { Good } from '../models/good.model';
import { Item } from '../models/item.model';

describe('Roll Service', () => {
    describe('unit', () => {
        let treasureService: TreasureService;
        let httpClientSpy: jasmine.SpyObj<HttpClient>;
    
        beforeEach(() => {
            httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    
            treasureService = new TreasureService(httpClientSpy);
        });

        it('gets the treasure view model', done => {
            let model = new TreasureGenViewModel(
                ['treasure type 1', 'treasure type 2'],
                9266,
                [
                    new ItemTypeViewModel('myItemType', 'My Item Type'),
                    new ItemTypeViewModel('myOtherItemType', 'My Other Item Type'),
                ],
                ['power 1', 'power 2'],
                new Map<string, string[]>([
                    ["myItemType", ['item 1', 'item 2']],
                    ["myOtherItemType", ['item 3', 'item 4']]
                ])
            );
            httpClientSpy.get.and.returnValue(of(model));
    
            treasureService.getViewModel().subscribe((viewmodel) => {
                expect(viewmodel).toBe(model);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://web.dndgen.com/api/v1/treasure/viewmodel');
                done();
            });
        });
    
        it('gets treasure', done => {
            const treasure = new Treasure(
                new Coin('munny', 42),
                [
                    new Good('good 1', 600),
                    new Good('good 2', 1337),
                ],
                [
                    new Item('item 1'),
                    new Item('item 2'),
                ],
                true
            );
            httpClientSpy.get.and.returnValue(of(treasure));
    
            treasureService.getTreasure('myTreasureType', 90210).subscribe((treasure) => {
                expect(treasure).toBe(42);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/9266/d/90210/roll');
                done();
            });
        });
    
        it('validates a valid roll', done => {
            httpClientSpy.get.and.returnValue(of(true));
    
            treasureService.validateRoll(9266, 90210).subscribe((validity) => {
                expect(validity).toBe(true);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/9266/d/90210/validate');
                done();
            });
        });
    
        it('validates an invalid roll', done => {
            httpClientSpy.get.and.returnValue(of(false));
    
            treasureService.validateRoll(9266, 90210).subscribe((validity) => {
                expect(validity).toBe(false);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/9266/d/90210/validate');
                done();
            });
        });
    
        it('gets an expression roll', done => {
            httpClientSpy.get.and.returnValue(of(42));
            let params = new HttpParams().set('expression', "my expression");
    
            treasureService.getExpressionRoll("my expression").subscribe((roll) => {
                expect(roll).toBe(42);
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://roll.dndgen.com/api/v2/expression/roll',
                    { params: params });
                done();
            });
        });
    
        it('validates a valid expression', done => {
            httpClientSpy.get.and.returnValue(of(true));
            let params = new HttpParams().set('expression', "my expression");
    
            treasureService.validateExpression("my expression").subscribe((validity) => {
                expect(validity).toBe(true);
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://roll.dndgen.com/api/v2/expression/validate',
                    { params: params });
                done();
            });
        });
    
        it('validates an invalid expression', done => {
            httpClientSpy.get.and.returnValue(of(false));
            let params = new HttpParams().set('expression', "my expression");
    
            treasureService.validateExpression("my expression").subscribe((validity) => {
                expect(validity).toBe(false);
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://roll.dndgen.com/api/v2/expression/validate',
                    { params: params });
                done();
            });
        });
    });
    
    describe('integration', () => {
        let rollService: RollService;
    
        beforeEach(async () => {
            await TestBed.configureTestingModule({
              imports: [
                AppModule
              ],
            }).compileComponents();
        
            rollService = TestBed.inject(RollService);
        });

        it('gets the roll view model', done => {
            rollService.getViewModel().subscribe((viewmodel) => {
                expect(viewmodel).toBeDefined();
                expect(viewmodel.quantityLimit_Lower).toBe(1);
                expect(viewmodel.quantityLimit_Upper).toBe(10000);
                expect(viewmodel.dieLimit_Lower).toBe(1);
                expect(viewmodel.dieLimit_Upper).toBe(10000);
                done();
            });
        });
    
        it('gets a roll', done => {
            rollService.getRoll(9266, 42).subscribe((roll) => {
                expect(roll).toBeGreaterThanOrEqual(9266);
                expect(roll).toBeLessThanOrEqual(9266 * 42);
                done();
            });
        });
    
        it('validates a valid roll', done => {
            rollService.validateRoll(9266, 42).subscribe((validity) => {
                expect(validity).toBe(true);
                done();
            });
        });
    
        it('validates an invalid roll', done => {
            rollService.validateRoll(9266, 90210).subscribe((validity) => {
                expect(validity).toBe(false);
                done();
            });
        });
    
        it('gets an expression roll', done => {
            rollService.getExpressionRoll("3d6t1").subscribe((roll) => {
                expect(roll).toBeGreaterThanOrEqual(6);
                expect(roll).toBeLessThanOrEqual(18);
                done();
            });
        });
    
        it('validates a valid expression', done => {
            rollService.validateExpression("3d6t1").subscribe((validity) => {
                expect(validity).toBe(true);
                done();
            });
        });
    
        it('validates an invalid expression', done => {
            rollService.validateExpression("invalid expression").subscribe((validity) => {
                expect(validity).toBe(false);
                done();
            });
        });
    });
});