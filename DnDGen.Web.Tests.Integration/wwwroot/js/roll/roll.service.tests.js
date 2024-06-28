'use strict'

describe('Roll Service Integration', function () {
    var rollService;

    beforeEach(module('app.roll'));

    beforeEach(inject(function (_rollService_) {
        rollService = _rollService_;
    }));

    it('gets a roll', function () {
        var promise = rollService.getRoll(9266, 90210);
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });

    it('validates a roll', function () {
        var promise = rollService.validateRoll(9266, 90210);
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });

    it('gets an expression roll', function () {
        var promise = rollService.getExpressionRoll("expression");
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });

    it('validates an expression', function () {
        var promise = rollService.validateExpression("expression");
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });
});