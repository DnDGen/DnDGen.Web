describe('Unit: DiceController', function () {
    var diceController;
    var scope;
    var diceServiceMock;
    var q;

    beforeEach(module('app.dice'));

    beforeEach(function () {
        diceServiceMock = {
            getD2Roll: function (quantity) {
                return getMockedPromise(quantity, 2);
            },
            getD3Roll: function (quantity) {
                return getMockedPromise(quantity, 3);
            },
            getD4Roll: function (quantity) {
                return getMockedPromise(quantity, 4);
            },
            getD6Roll: function (quantity) {
                return getMockedPromise(quantity, 6);
            },
            getD8Roll: function (quantity) {
                return getMockedPromise(quantity, 8);
            },
            getD10Roll: function (quantity) {
                return getMockedPromise(quantity, 10);
            },
            getD12Roll: function (quantity) {
                return getMockedPromise(quantity, 12);
            },
            getD20Roll: function (quantity) {
                return getMockedPromise(quantity, 20);
            },
            getPercentileRoll: function (quantity) {
                return getMockedPromise(quantity, 100);
            },
            getCustomRoll: function (quantity, die) {
                return getMockedPromise(quantity, die);
            },
        };
    });

    function getMockedPromise(quantity, die) {
        var deferred = q.defer();
        deferred.resolve({ "roll": quantity * die });
        return deferred.promise;
    }

    beforeEach(inject(function ($rootScope, $controller, $q) {
        scope = $rootScope.$new();
        q = $q;
        diceController = $controller('Dice', {
            $scope: scope,
            diceService: diceServiceMock
        });
    }));

    it('has quantities of 1 at beginning', function () {
        expect(scope.quantities.d2).toBe(1);
        expect(scope.quantities.d3).toBe(1);
        expect(scope.quantities.d4).toBe(1);
        expect(scope.quantities.d6).toBe(1);
        expect(scope.quantities.d8).toBe(1);
        expect(scope.quantities.d10).toBe(1);
        expect(scope.quantities.d12).toBe(1);
        expect(scope.quantities.d20).toBe(1);
        expect(scope.quantities.percentile).toBe(1);
        expect(scope.quantities.custom).toBe(1);
    });

    it('has custom die of 1 at beginning', function () {
        expect(scope.customDie).toBe(1);
    });

    it('has rolls of 0 at beginning', function () {
        expect(scope.rolls.d2).toBe(0);
        expect(scope.rolls.d3).toBe(0);
        expect(scope.rolls.d4).toBe(0);
        expect(scope.rolls.d6).toBe(0);
        expect(scope.rolls.d8).toBe(0);
        expect(scope.rolls.d10).toBe(0);
        expect(scope.rolls.d12).toBe(0);
        expect(scope.rolls.d20).toBe(0);
        expect(scope.rolls.percentile).toBe(0);
        expect(scope.rolls.custom).toBe(0);
    });

    it('rolls a d2', function () {
        scope.quantities.d2 = 9266;
        scope.rollD2();
        scope.$apply();

        expect(scope.rolls.d2).toBe(9266 * 2);
        expect(scope.rolls.d3).toBe(0);
        expect(scope.rolls.d4).toBe(0);
        expect(scope.rolls.d6).toBe(0);
        expect(scope.rolls.d8).toBe(0);
        expect(scope.rolls.d10).toBe(0);
        expect(scope.rolls.d12).toBe(0);
        expect(scope.rolls.d20).toBe(0);
        expect(scope.rolls.percentile).toBe(0);
        expect(scope.rolls.custom).toBe(0);
    });

    it('rolls a d3', function () {
        scope.quantities.d3 = 9266;
        scope.rollD3();
        scope.$apply();

        expect(scope.rolls.d2).toBe(0);
        expect(scope.rolls.d3).toBe(9266 * 3);
        expect(scope.rolls.d4).toBe(0);
        expect(scope.rolls.d6).toBe(0);
        expect(scope.rolls.d8).toBe(0);
        expect(scope.rolls.d10).toBe(0);
        expect(scope.rolls.d12).toBe(0);
        expect(scope.rolls.d20).toBe(0);
        expect(scope.rolls.percentile).toBe(0);
        expect(scope.rolls.custom).toBe(0);
    });

    it('rolls a d4', function () {
        scope.quantities.d4 = 9266;
        scope.rollD4();
        scope.$apply();

        expect(scope.rolls.d2).toBe(0);
        expect(scope.rolls.d3).toBe(0);
        expect(scope.rolls.d4).toBe(9266 * 4);
        expect(scope.rolls.d6).toBe(0);
        expect(scope.rolls.d8).toBe(0);
        expect(scope.rolls.d10).toBe(0);
        expect(scope.rolls.d12).toBe(0);
        expect(scope.rolls.d20).toBe(0);
        expect(scope.rolls.percentile).toBe(0);
        expect(scope.rolls.custom).toBe(0);
    });

    it('rolls a d6', function () {
        scope.quantities.d6 = 9266;
        scope.rollD6();
        scope.$apply();

        expect(scope.rolls.d2).toBe(0);
        expect(scope.rolls.d3).toBe(0);
        expect(scope.rolls.d4).toBe(0);
        expect(scope.rolls.d6).toBe(9266 * 6);
        expect(scope.rolls.d8).toBe(0);
        expect(scope.rolls.d10).toBe(0);
        expect(scope.rolls.d12).toBe(0);
        expect(scope.rolls.d20).toBe(0);
        expect(scope.rolls.percentile).toBe(0);
        expect(scope.rolls.custom).toBe(0);
    });

    it('rolls a d8', function () {
        scope.quantities.d8 = 9266;
        scope.rollD8();
        scope.$apply();

        expect(scope.rolls.d2).toBe(0);
        expect(scope.rolls.d3).toBe(0);
        expect(scope.rolls.d4).toBe(0);
        expect(scope.rolls.d6).toBe(0);
        expect(scope.rolls.d8).toBe(9266 * 8);
        expect(scope.rolls.d10).toBe(0);
        expect(scope.rolls.d12).toBe(0);
        expect(scope.rolls.d20).toBe(0);
        expect(scope.rolls.percentile).toBe(0);
        expect(scope.rolls.custom).toBe(0);
    });

    it('rolls a d10', function () {
        scope.quantities.d10 = 9266;
        scope.rollD10();
        scope.$apply();

        expect(scope.rolls.d2).toBe(0);
        expect(scope.rolls.d3).toBe(0);
        expect(scope.rolls.d4).toBe(0);
        expect(scope.rolls.d6).toBe(0);
        expect(scope.rolls.d8).toBe(0);
        expect(scope.rolls.d10).toBe(9266 * 10);
        expect(scope.rolls.d12).toBe(0);
        expect(scope.rolls.d20).toBe(0);
        expect(scope.rolls.percentile).toBe(0);
        expect(scope.rolls.custom).toBe(0);
    });

    it('rolls a d12', function () {
        scope.quantities.d12 = 9266;
        scope.rollD12();
        scope.$apply();

        expect(scope.rolls.d2).toBe(0);
        expect(scope.rolls.d3).toBe(0);
        expect(scope.rolls.d4).toBe(0);
        expect(scope.rolls.d6).toBe(0);
        expect(scope.rolls.d8).toBe(0);
        expect(scope.rolls.d10).toBe(0);
        expect(scope.rolls.d12).toBe(9266 * 12);
        expect(scope.rolls.d20).toBe(0);
        expect(scope.rolls.percentile).toBe(0);
        expect(scope.rolls.custom).toBe(0);
    });

    it('rolls a d20', function () {
        scope.quantities.d20 = 9266;
        scope.rollD20();
        scope.$apply();

        expect(scope.rolls.d2).toBe(0);
        expect(scope.rolls.d3).toBe(0);
        expect(scope.rolls.d4).toBe(0);
        expect(scope.rolls.d6).toBe(0);
        expect(scope.rolls.d8).toBe(0);
        expect(scope.rolls.d10).toBe(0);
        expect(scope.rolls.d12).toBe(0);
        expect(scope.rolls.d20).toBe(9266 * 20);
        expect(scope.rolls.percentile).toBe(0);
        expect(scope.rolls.custom).toBe(0);
    });

    it('rolls a percentile', function () {
        scope.quantities.percentile = 9266;
        scope.rollPercentile();
        scope.$apply();

        expect(scope.rolls.d2).toBe(0);
        expect(scope.rolls.d3).toBe(0);
        expect(scope.rolls.d4).toBe(0);
        expect(scope.rolls.d6).toBe(0);
        expect(scope.rolls.d8).toBe(0);
        expect(scope.rolls.d10).toBe(0);
        expect(scope.rolls.d12).toBe(0);
        expect(scope.rolls.d20).toBe(0);
        expect(scope.rolls.percentile).toBe(9266 * 100);
        expect(scope.rolls.custom).toBe(0);
    });

    it('rolls a custom roll', function () {
        scope.quantities.custom = 9266;
        scope.customDie = 42;
        scope.rollCustom();
        scope.$apply();

        expect(scope.rolls.d2).toBe(0);
        expect(scope.rolls.d3).toBe(0);
        expect(scope.rolls.d4).toBe(0);
        expect(scope.rolls.d6).toBe(0);
        expect(scope.rolls.d8).toBe(0);
        expect(scope.rolls.d10).toBe(0);
        expect(scope.rolls.d12).toBe(0);
        expect(scope.rolls.d20).toBe(0);
        expect(scope.rolls.percentile).toBe(0);
        expect(scope.rolls.custom).toBe(9266 * 42);
    });

    it('does not reset unrelated rolls', function () {
        scope.quantities.custom = 9266;
        scope.customDie = 42;
        scope.rollCustom();
        scope.$apply();

        expect(scope.rolls.percentile).toBe(0);
        expect(scope.rolls.custom).toBe(9266 * 42);

        scope.quantities.percentile = 9266;
        scope.rollPercentile();
        scope.$apply();

        expect(scope.rolls.percentile).toBe(9266 * 100);
        expect(scope.rolls.custom).toBe(9266 * 42);
    });

    it('overwrites previous roll', function () {
        scope.quantities.custom = 9266;
        scope.customDie = 42;
        scope.rollCustom();
        scope.$apply();
        expect(scope.rolls.custom).toBe(9266 * 42);

        scope.customDie = 90210;
        scope.rollCustom();
        scope.$apply();
        expect(scope.rolls.custom).toBe(9266 * 90210);
    });
})