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
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Roll/Roll', { quantity: 9266, die: 90210 });
    });

    it('gets an expression roll', function () {
        var promise = rollService.getExpressionRoll("expression");
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Roll/RollExpression', {expression: 'expression'});
    });

    it('URL encodes the expression roll', function () {
        var promise = rollService.getExpressionRoll("1+(2-3)*4/5d6");
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Roll/RollExpression', {expression: '1+(2-3)*4/5d6'});
    });

    it('validates an expression', function () {
        var promise = rollService.validateExpression("expression");
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Roll/ValidateExpression', { expression: 'expression' });
    });

    it('URL encodes the expression to validate', function () {
        var promise = rollService.validateExpression("1+(2-3)*4/5d6");
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Roll/ValidateExpression', { expression: '1+(2-3)*4/5d6' });
    });

    it('validates a roll', function () {
        var promise = rollService.validateRoll(9266, 90210);
        expect(promise).not.toBeNull();
        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Roll/Validate', { quantity: 9266, die: 90210 });
    });
});