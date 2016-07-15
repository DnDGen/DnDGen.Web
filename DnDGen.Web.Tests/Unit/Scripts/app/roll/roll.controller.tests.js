'use strict'

describe('Roll Controller', function () {
    var vm;
    var rollServiceMock;
    var q;
    var scope;
    var sweetAlertServiceMock;

    beforeEach(module('app.roll'));

    beforeEach(function () {
        rollServiceMock = {
            getRoll: function (quantity, die) {
                var shouldFail = die === 666 || quantity === 666;
                return getMockedPromise({ "roll": quantity * die }, shouldFail);
            },
            getExpressionRoll: function (expression) {
                var shouldFail = expression === 'FAIL';
                return getMockedPromise({ "roll": 42 * 600 }, shouldFail);
            },
            validateRoll: function (quantity, die) {
                var shouldFail = die === 666;
                var isValid = quantity !== 666;

                return getMockedPromise({ "isValid": isValid }, shouldFail);
            },
            validateExpression: function (expression) {
                var shouldFail = expression === 'FAIL';
                var isValid = expression !== 'invalid';

                return getMockedPromise({ "isValid": isValid }, shouldFail);
            }
        };

        sweetAlertServiceMock = {};
        sweetAlertServiceMock.showError = jasmine.createSpy();
    });

    function getMockedPromise(body, shouldFail) {
        var deferred = q.defer();

        if (shouldFail)
            deferred.reject();
        else
            deferred.resolve(body);

        return deferred.promise;
    }

    beforeEach(inject(function ($rootScope, $controller, $q) {
        q = $q;
        scope = $rootScope.$new();

        vm = $controller('Roll as vm', {
            $scope: scope,
            rollService: rollServiceMock,
            sweetAlertService: sweetAlertServiceMock
        });
    }));

    it('has quantities of 1 at beginning', function () {
        expect(vm.standardQuantity).toBe(1);
        expect(vm.customQuantity).toBe(1);
    });

    it('has custom die of 1 at beginning', function () {
        expect(vm.customDie).toBe(1);
    });

    it('has sample expression at beginning', function () {
        expect(vm.expression).toBe('3d6+2');
    });

    it('has roll of 0 at beginning', function () {
        expect(vm.roll).toBe(0);
    });

    it('is not rolling on load', function () {
        expect(vm.rolling).toBeFalsy();
    });

    it('is not validating on load', function () {
        expect(vm.validating).toBeFalsy();
    });

    it('has standard dice', function () {
        expect(vm.standardDice[0].name).toBe('2');
        expect(vm.standardDice[1].name).toBe('3');
        expect(vm.standardDice[2].name).toBe('4');
        expect(vm.standardDice[3].name).toBe('6');
        expect(vm.standardDice[4].name).toBe('8');
        expect(vm.standardDice[5].name).toBe('10');
        expect(vm.standardDice[6].name).toBe('12');
        expect(vm.standardDice[7].name).toBe('20');
        expect(vm.standardDice[8].name).toBe('Percentile');

        expect(vm.standardDice[0].die).toBe(2);
        expect(vm.standardDice[1].die).toBe(3);
        expect(vm.standardDice[2].die).toBe(4);
        expect(vm.standardDice[3].die).toBe(6);
        expect(vm.standardDice[4].die).toBe(8);
        expect(vm.standardDice[5].die).toBe(10);
        expect(vm.standardDice[6].die).toBe(12);
        expect(vm.standardDice[7].die).toBe(20);
        expect(vm.standardDice[8].die).toBe(100);
    });

    it('has selected d20 as a standard dice on load', function () {
        expect(vm.standardDie).toEqual(vm.standardDice[7]);
    });

    it('rolls a standard die', function () {
        vm.standardQuantity = 9266;
        vm.standardDie = vm.standardDice[2];

        spyOn(rollServiceMock, 'getRoll').and.callThrough();

        vm.rollStandard();
        scope.$apply();

        expect(vm.roll).toBe(9266 * 4);
        expect(rollServiceMock.getRoll).toHaveBeenCalledWith(9266, 4);
    });

    it('rolls a custom roll', function () {
        vm.customQuantity = 9266;
        vm.customDie = 42;

        spyOn(rollServiceMock, 'getRoll').and.callThrough();

        vm.rollCustom();
        scope.$apply();

        expect(vm.roll).toBe(9266 * 42);
        expect(rollServiceMock.getRoll).toHaveBeenCalledWith(9266, 42);
    });

    it('rolls an expression', function () {
        vm.expression = 'expression';

        spyOn(rollServiceMock, 'getExpressionRoll').and.callThrough();

        vm.rollExpression();
        scope.$apply();

        expect(vm.roll).toBe(42 * 600);
        expect(rollServiceMock.getExpressionRoll).toHaveBeenCalledWith('expression');
    });

    it('says it is rolling while fetching a standard roll', function () {
        vm.standardQuantity = 9266;
        vm.standardDie = vm.standardDice[2];

        vm.rollStandard();

        expect(vm.rolling).toBeTruthy();
    });

    it('says it is done rolling while fetching a standard roll', function () {
        vm.standardQuantity = 9266;
        vm.standardDie = vm.standardDice[2];

        vm.rollStandard();
        scope.$apply();

        expect(vm.rolling).toBeFalsy();
    });

    it('says it is rolling while fetching a custom roll', function () {
        vm.customQuantity = 9266;
        vm.customDie = 42;

        vm.rollCustom();

        expect(vm.rolling).toBeTruthy();
    });

    it('says it is done rolling while fetching a custom roll', function () {
        vm.customQuantity = 9266;
        vm.customDie = 42;

        vm.rollCustom();
        scope.$apply();

        expect(vm.rolling).toBeFalsy();
    });

    it('says it is rolling while fetching an expression roll', function () {
        vm.expression = 'expression';
        vm.rollExpression();
        expect(vm.rolling).toBeTruthy();
    });

    it('says it is done rolling while fetching an expression roll', function () {
        vm.expression = 'expression';

        vm.rollExpression();
        scope.$apply();

        expect(vm.rolling).toBeFalsy();
    });

    it('shows an alert if an error is thrown when fetching a standard roll', function () {
        vm.standardQuantity = 666;
        vm.standardDie = vm.standardDice[2];

        vm.rollStandard();
        scope.$apply();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
    });

    it('is done rolling if an error is thrown when fetching a standard roll', function () {
        vm.standardQuantity = 666;
        vm.standardDie = vm.standardDice[2];

        vm.rollStandard();
        scope.$apply();

        expect(vm.rolling).toBeFalsy();
    });

    it('clears the roll if an error is thrown when fetching a standard roll', function () {
        vm.standardQuantity = 9266;
        vm.standardDie = vm.standardDice[2];

        vm.rollStandard();
        scope.$apply();

        vm.standardQuantity = 666;

        vm.rollStandard();
        scope.$apply();

        expect(vm.roll).toBe(0);
    });

    it('shows an alert if an error is thrown when fetching a custom roll', function () {
        vm.customQuantity = 666;
        vm.customDie = 42;

        vm.rollCustom();
        scope.$apply();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
    });

    it('is done rolling if an error is thrown when fetching a custom roll', function () {
        vm.customQuantity = 666;
        vm.customDie = 42;

        vm.rollCustom();
        scope.$apply();

        expect(vm.rolling).toBeFalsy();
    });

    it('clears the roll if an error is thrown when fetching a custom roll', function () {
        vm.customQuantity = 9266;
        vm.customDie = 42;

        vm.rollCustom();
        scope.$apply();

        vm.customQuantity = 666;

        vm.rollCustom();
        scope.$apply();

        expect(vm.roll).toBe(0);
    });

    it('shows an alert if an error is thrown when fetching an expression roll', function () {
        vm.expression = 'FAIL';

        vm.rollExpression();
        scope.$apply();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
    });

    it('is done rolling if an error is thrown when fetching an expression roll', function () {
        vm.expression = 'FAIL';

        vm.rollExpression();
        scope.$apply();

        expect(vm.rolling).toBeFalsy();
    });

    it('clears the roll if an error is thrown when fetching an expression roll', function () {
        vm.expression = 'expression';

        vm.rollExpression();
        scope.$apply();

        vm.expression = 'FAIL';

        vm.rollExpression();
        scope.$apply();

        expect(vm.roll).toBe(0);
    });

    it('validates a valid expression', function () {
        scope.$digest();
        expect(vm.rollIsValid).toBeTruthy();

        vm.expression = 'expression';
        scope.$digest();

        expect(vm.rollIsValid).toBeTruthy();
        expect(vm.validating).toBeFalsy();
    });

    it('validates an invalid expression', function () {
        scope.$digest();
        expect(vm.rollIsValid).toBeTruthy();

        vm.expression = 'invalid';
        scope.$digest();

        expect(vm.rollIsValid).toBeFalsy();
        expect(vm.validating).toBeFalsy();
    });

    it('shows an alert if an error is thrown when validating an expression roll', function () {
        vm.expression = 'FAIL';
        scope.$digest();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
        expect(vm.validating).toBeFalsy();
    });

    it('says the expression is not valid if error is thrown', function () {
        vm.expression = 'expression';
        scope.$digest();

        vm.expression = 'FAIL';
        scope.$digest();

        expect(vm.rollIsValid).toBeFalsy();
        expect(vm.validating).toBeFalsy();
    });

    it('validates standard rolls on quantity change', function () {
        scope.$digest();
        expect(vm.rollIsValid).toBeTruthy();

        vm.standardQuantity = 666;
        scope.$digest();

        expect(vm.rollIsValid).toBeFalsy();
        expect(vm.validating).toBeFalsy();
    });

    it('validates standard rolls on die change', function () {
        scope.$digest();
        expect(vm.rollIsValid).toBeTruthy();

        vm.standardDie = { name: 'fail dice', die: 666 };
        scope.$digest();

        expect(vm.rollIsValid).toBeFalsy();
        expect(vm.validating).toBeFalsy();
    });

    it('validates custom rolls on quantity change', function () {
        scope.$digest();
        expect(vm.rollIsValid).toBeTruthy();

        vm.customQuantity = 666;
        scope.$digest();

        expect(vm.rollIsValid).toBeFalsy();
        expect(vm.validating).toBeFalsy();
    });

    it('validates custom rolls on die change', function () {
        scope.$digest();
        expect(vm.rollIsValid).toBeTruthy();

        vm.customDie = 666;
        scope.$digest();

        expect(vm.rollIsValid).toBeFalsy();
        expect(vm.validating).toBeFalsy();
    });
})