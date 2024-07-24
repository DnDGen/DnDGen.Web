import { RollService } from '../../../src/app/roll/services/roll.service'
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import '@angular/compiler';
import { describe, it, beforeEach, expect } from '@jest/globals';

describe('Roll Service', () => {
    let rollService: RollService;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

        rollService = new RollService(httpClientSpy);
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

        rollService.getExpressionRoll("my expression").subscribe((roll) => {
            expect(roll).toBe(42);
            expect(httpClientSpy.get).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/expression/roll', {expression: 'my expression'});
            done();
        });
    });

    it('validates a valid expression', done => {
        httpClientSpy.get.and.returnValue(of(true));

        rollService.validateExpression("my expression").subscribe((validity) => {
            expect(validity).toBe(true);
            expect(httpClientSpy.get).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/expression/validate', { expression: 'my expression' });
            done();
        });
    });

    it('validates an invalid expression', done => {
        httpClientSpy.get.and.returnValue(of(false));

        rollService.validateExpression("my expression").subscribe((validity) => {
            expect(validity).toBe(false);
            expect(httpClientSpy.get).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/expression/validate', { expression: 'my expression' });
            done();
        });
    });
});