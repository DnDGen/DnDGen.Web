'use strict'

describe('Roll Service', function () {
    var rollService;
    var promiseServiceMock;

    beforeEach(module('app.roll', function($provide) {
        promiseServiceMock = {};
        promiseServiceMock.getPromise = jasmine.createSpy();

        $provide.value('promiseService', promiseServiceMock);
    }));

    beforeEach(inject(function (_rollService_) {
        rollService = _rollService_;
    }));

    it('gets a roll', function () {
        var promise = rollService.getRoll(9266, 90210);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/9266/d/90210/roll');
    });

    it('validates a roll', function () {
        var promise = rollService.validateRoll(9266, 90210);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/9266/d/90210/validate');
    });

    it('gets an expression roll', function () {
        var promise = rollService.getExpressionRoll("expression");
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/expression/roll', {expression: 'expression'});
    });

    it('validates an expression', function () {
        var promise = rollService.validateExpression("expression");
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/expression/validate', { expression: 'expression' });
    });
});