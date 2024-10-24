import { RollService } from './roll.service'
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { RollGenViewModel } from '../models/rollgenViewModel.model';
import { TestHelper } from '../../testHelper.spec';

describe('Roll Service', () => {
    describe('unit', () => {
        let rollService: RollService;
        let httpClientSpy: jasmine.SpyObj<HttpClient>;
    
        beforeEach(() => {
            httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    
            rollService = new RollService(httpClientSpy);
        });

        it('gets the roll view model', done => {
            let model = new RollGenViewModel(9266, 90210, 42, 600);
            httpClientSpy.get.and.returnValue(of(model));
    
            rollService.getViewModel().subscribe((viewmodel) => {
                expect(viewmodel).toBe(model);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://web.dndgen.com/api/v1/roll/viewmodel');
                done();
            });
        });
    
        it('gets a roll', done => {
            httpClientSpy.get.and.returnValue(of(42));
    
            rollService.getRoll(9266, 90210).subscribe((roll) => {
                expect(roll).toBe(42);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/9266/d/90210/roll');
                done();
            });
        });
    
        it('validates a valid roll', done => {
            httpClientSpy.get.and.returnValue(of(true));
    
            rollService.validateRoll(9266, 90210).subscribe((validity) => {
                expect(validity).toBe(true);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/9266/d/90210/validate');
                done();
            });
        });
    
        it('validates an invalid roll', done => {
            httpClientSpy.get.and.returnValue(of(false));
    
            rollService.validateRoll(9266, 90210).subscribe((validity) => {
                expect(validity).toBe(false);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/9266/d/90210/validate');
                done();
            });
        });
    
        it('gets an expression roll', done => {
            httpClientSpy.get.and.returnValue(of(42));
            let params = new HttpParams().set('expression', "my expression");
    
            rollService.getExpressionRoll("my expression").subscribe((roll) => {
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
    
            rollService.validateExpression("my expression").subscribe((validity) => {
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
    
            rollService.validateExpression("my expression").subscribe((validity) => {
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
            await TestHelper.configureTestBed();
        
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