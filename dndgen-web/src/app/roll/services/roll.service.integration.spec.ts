import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RollService } from './roll.service'
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { RollGenViewModel } from '../models/rollgen-view-model.model';
import { TestHelper } from '../../test-helper';

describe('Roll Service', () => {
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