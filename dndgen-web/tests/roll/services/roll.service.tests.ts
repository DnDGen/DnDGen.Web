import 'jasmine';
import { RollService } from '../../../src/app/roll/services/roll.service'
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('Roll Service', function () {
    let rollService: RollService;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

        rollService = new RollService(httpClientSpy);
    });

    it('gets a roll', (done: DoneFn) => {
        httpClientSpy.get.and.returnValue(of(42));

        rollService.getRoll(9266, 90210).subscribe((roll) => {
            expect(roll).toBe(42);
            expect(httpClientSpy.get).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/9266/d/90210/roll');
            done();
        });
    });

    it('validates a roll', (done: DoneFn) => {
        var promise = rollService.validateRoll(9266, 90210);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/9266/d/90210/validate');
    });

    it('gets an expression roll', (done: DoneFn) => {
        var promise = rollService.getExpressionRoll("expression");
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/expression/roll', {expression: 'expression'});
    });

    it('validates an expression', (done: DoneFn) => {
        var promise = rollService.validateExpression("expression");
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/expression/validate', { expression: 'expression' });
    });
});