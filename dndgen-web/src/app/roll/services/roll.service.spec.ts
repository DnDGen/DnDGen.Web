import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RollService } from './roll.service'
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { RollGenViewModel } from '../models/rollgen-view-model.model';
import { TestHelper } from '../../test-helper';

describe('Roll Service', () => {
    describe('unit', () => {
        let rollService: RollService;
        let httpClientSpy: { get: ReturnType<typeof vi.fn> };
    
        beforeEach(() => {
            httpClientSpy = { get: vi.fn() };
    
            rollService = new RollService(httpClientSpy as unknown as HttpClient);
        });

        it('gets the roll view model', () => new Promise<void>(resolve => {
            let model = new RollGenViewModel(9266, 90210, 42, 600);
            httpClientSpy.get.mockReturnValue(of(model));
    
            rollService.getViewModel().subscribe((viewmodel) => {
                expect(viewmodel).toBe(model);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://web.dndgen.com/api/v1/roll/viewmodel');
                resolve();
            });
        }));
    
        it('gets a roll', () => new Promise<void>(resolve => {
            httpClientSpy.get.mockReturnValue(of(42));
    
            rollService.getRoll(9266, 90210).subscribe((roll) => {
                expect(roll).toBe(42);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/9266/d/90210/roll');
                resolve();
            });
        }));
    
        it('validates a valid roll', () => new Promise<void>(resolve => {
            httpClientSpy.get.mockReturnValue(of(true));
    
            rollService.validateRoll(9266, 90210).subscribe((validity) => {
                expect(validity).toBe(true);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/9266/d/90210/validate');
                resolve();
            });
        }));
    
        it('validates an invalid roll', () => new Promise<void>(resolve => {
            httpClientSpy.get.mockReturnValue(of(false));
    
            rollService.validateRoll(9266, 90210).subscribe((validity) => {
                expect(validity).toBe(false);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/9266/d/90210/validate');
                resolve();
            });
        }));
    
        it('gets an expression roll', () => new Promise<void>(resolve => {
            httpClientSpy.get.mockReturnValue(of(42));
            let params = new HttpParams().set('expression', "my expression");
    
            rollService.getExpressionRoll("my expression").subscribe((roll) => {
                expect(roll).toBe(42);
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://roll.dndgen.com/api/v2/expression/roll',
                    { params: params });
                resolve();
            });
        }));
    
        it('validates a valid expression', () => new Promise<void>(resolve => {
            httpClientSpy.get.mockReturnValue(of(true));
            let params = new HttpParams().set('expression', "my expression");
    
            rollService.validateExpression("my expression").subscribe((validity) => {
                expect(validity).toBe(true);
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://roll.dndgen.com/api/v2/expression/validate',
                    { params: params });
                resolve();
            });
        }));
    
        it('validates an invalid expression', () => new Promise<void>(resolve => {
            httpClientSpy.get.mockReturnValue(of(false));
            let params = new HttpParams().set('expression', "my expression");
    
            rollService.validateExpression("my expression").subscribe((validity) => {
                expect(validity).toBe(false);
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://roll.dndgen.com/api/v2/expression/validate',
                    { params: params });
                resolve();
            });
        }));
    });
    
    describe('integration', () => {
        let rollService: RollService;
    
        beforeEach(async () => {
            await TestHelper.configureTestBed();
        
            rollService = TestBed.inject(RollService);
        });

        it('gets the roll view model', () => new Promise<void>(resolve => {
            rollService.getViewModel().subscribe((viewmodel) => {
                expect(viewmodel).toBeDefined();
                expect(viewmodel.quantityLimit_Lower).toBe(1);
                expect(viewmodel.quantityLimit_Upper).toBe(10000);
                expect(viewmodel.dieLimit_Lower).toBe(1);
                expect(viewmodel.dieLimit_Upper).toBe(10000);
                resolve();
            });
        }));
    
        it('gets a roll', () => new Promise<void>(resolve => {
            rollService.getRoll(9266, 42).subscribe((roll) => {
                expect(roll).toBeGreaterThanOrEqual(9266);
                expect(roll).toBeLessThanOrEqual(9266 * 42);
                resolve();
            });
        }));
    
        it('validates a valid roll', () => new Promise<void>(resolve => {
            rollService.validateRoll(9266, 42).subscribe((validity) => {
                expect(validity).toBe(true);
                resolve();
            });
        }));
    
        it('validates an invalid roll', () => new Promise<void>(resolve => {
            rollService.validateRoll(9266, 90210).subscribe((validity) => {
                expect(validity).toBe(false);
                resolve();
            });
        }));
    
        it('gets an expression roll', () => new Promise<void>(resolve => {
            rollService.getExpressionRoll("3d6t1").subscribe((roll) => {
                expect(roll).toBeGreaterThanOrEqual(6);
                expect(roll).toBeLessThanOrEqual(18);
                resolve();
            });
        }));
    
        it('validates a valid expression', () => new Promise<void>(resolve => {
            rollService.validateExpression("3d6t1").subscribe((validity) => {
                expect(validity).toBe(true);
                resolve();
            });
        }));
    
        it('validates an invalid expression', () => new Promise<void>(resolve => {
            rollService.validateExpression("invalid expression").subscribe((validity) => {
                expect(validity).toBe(false);
                resolve();
            });
        }));
    });
});
