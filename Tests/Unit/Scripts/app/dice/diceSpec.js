describe('the DiceController', function () {
    var vm;
    var diceServiceMock;
    var q;
    var scope;

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
        q = $q;
        scope = $rootScope.$new();

        vm = $controller('Dice as vm', {
            $scope: scope,
            diceService: diceServiceMock
        });
    }));

    it('has quantities of 1 at beginning', function () {
        expect(vm.quantities.d2).toBe(1);
        expect(vm.quantities.d3).toBe(1);
        expect(vm.quantities.d4).toBe(1);
        expect(vm.quantities.d6).toBe(1);
        expect(vm.quantities.d8).toBe(1);
        expect(vm.quantities.d10).toBe(1);
        expect(vm.quantities.d12).toBe(1);
        expect(vm.quantities.d20).toBe(1);
        expect(vm.quantities.percentile).toBe(1);
        expect(vm.quantities.custom).toBe(1);
    });

    it('has custom die of 1 at beginning', function () {
        expect(vm.customDie).toBe(1);
    });

    it('has rolls of 0 at beginning', function () {
        expect(vm.rolls.d2).toBe(0);
        expect(vm.rolls.d3).toBe(0);
        expect(vm.rolls.d4).toBe(0);
        expect(vm.rolls.d6).toBe(0);
        expect(vm.rolls.d8).toBe(0);
        expect(vm.rolls.d10).toBe(0);
        expect(vm.rolls.d12).toBe(0);
        expect(vm.rolls.d20).toBe(0);
        expect(vm.rolls.percentile).toBe(0);
        expect(vm.rolls.custom).toBe(0);
    });

    it('rolls a d2', function () {
        vm.quantities.d2 = 9266;
        vm.rollD2();
        scope.$apply();

        expect(vm.rolls.d2).toBe(9266 * 2);
        expect(vm.rolls.d3).toBe(0);
        expect(vm.rolls.d4).toBe(0);
        expect(vm.rolls.d6).toBe(0);
        expect(vm.rolls.d8).toBe(0);
        expect(vm.rolls.d10).toBe(0);
        expect(vm.rolls.d12).toBe(0);
        expect(vm.rolls.d20).toBe(0);
        expect(vm.rolls.percentile).toBe(0);
        expect(vm.rolls.custom).toBe(0);
    });

    it('rolls a d3', function () {
        vm.quantities.d3 = 9266;
        vm.rollD3();
        scope.$apply();

        expect(vm.rolls.d2).toBe(0);
        expect(vm.rolls.d3).toBe(9266 * 3);
        expect(vm.rolls.d4).toBe(0);
        expect(vm.rolls.d6).toBe(0);
        expect(vm.rolls.d8).toBe(0);
        expect(vm.rolls.d10).toBe(0);
        expect(vm.rolls.d12).toBe(0);
        expect(vm.rolls.d20).toBe(0);
        expect(vm.rolls.percentile).toBe(0);
        expect(vm.rolls.custom).toBe(0);
    });

    it('rolls a d4', function () {
        vm.quantities.d4 = 9266;
        vm.rollD4();
        scope.$apply();

        expect(vm.rolls.d2).toBe(0);
        expect(vm.rolls.d3).toBe(0);
        expect(vm.rolls.d4).toBe(9266 * 4);
        expect(vm.rolls.d6).toBe(0);
        expect(vm.rolls.d8).toBe(0);
        expect(vm.rolls.d10).toBe(0);
        expect(vm.rolls.d12).toBe(0);
        expect(vm.rolls.d20).toBe(0);
        expect(vm.rolls.percentile).toBe(0);
        expect(vm.rolls.custom).toBe(0);
    });

    it('rolls a d6', function () {
        vm.quantities.d6 = 9266;
        vm.rollD6();
        scope.$apply();

        expect(vm.rolls.d2).toBe(0);
        expect(vm.rolls.d3).toBe(0);
        expect(vm.rolls.d4).toBe(0);
        expect(vm.rolls.d6).toBe(9266 * 6);
        expect(vm.rolls.d8).toBe(0);
        expect(vm.rolls.d10).toBe(0);
        expect(vm.rolls.d12).toBe(0);
        expect(vm.rolls.d20).toBe(0);
        expect(vm.rolls.percentile).toBe(0);
        expect(vm.rolls.custom).toBe(0);
    });

    it('rolls a d8', function () {
        vm.quantities.d8 = 9266;
        vm.rollD8();
        scope.$apply();

        expect(vm.rolls.d2).toBe(0);
        expect(vm.rolls.d3).toBe(0);
        expect(vm.rolls.d4).toBe(0);
        expect(vm.rolls.d6).toBe(0);
        expect(vm.rolls.d8).toBe(9266 * 8);
        expect(vm.rolls.d10).toBe(0);
        expect(vm.rolls.d12).toBe(0);
        expect(vm.rolls.d20).toBe(0);
        expect(vm.rolls.percentile).toBe(0);
        expect(vm.rolls.custom).toBe(0);
    });

    it('rolls a d10', function () {
        vm.quantities.d10 = 9266;
        vm.rollD10();
        scope.$apply();

        expect(vm.rolls.d2).toBe(0);
        expect(vm.rolls.d3).toBe(0);
        expect(vm.rolls.d4).toBe(0);
        expect(vm.rolls.d6).toBe(0);
        expect(vm.rolls.d8).toBe(0);
        expect(vm.rolls.d10).toBe(9266 * 10);
        expect(vm.rolls.d12).toBe(0);
        expect(vm.rolls.d20).toBe(0);
        expect(vm.rolls.percentile).toBe(0);
        expect(vm.rolls.custom).toBe(0);
    });

    it('rolls a d12', function () {
        vm.quantities.d12 = 9266;
        vm.rollD12();
        scope.$apply();

        expect(vm.rolls.d2).toBe(0);
        expect(vm.rolls.d3).toBe(0);
        expect(vm.rolls.d4).toBe(0);
        expect(vm.rolls.d6).toBe(0);
        expect(vm.rolls.d8).toBe(0);
        expect(vm.rolls.d10).toBe(0);
        expect(vm.rolls.d12).toBe(9266 * 12);
        expect(vm.rolls.d20).toBe(0);
        expect(vm.rolls.percentile).toBe(0);
        expect(vm.rolls.custom).toBe(0);
    });

    it('rolls a d20', function () {
        vm.quantities.d20 = 9266;
        vm.rollD20();
        scope.$apply();

        expect(vm.rolls.d2).toBe(0);
        expect(vm.rolls.d3).toBe(0);
        expect(vm.rolls.d4).toBe(0);
        expect(vm.rolls.d6).toBe(0);
        expect(vm.rolls.d8).toBe(0);
        expect(vm.rolls.d10).toBe(0);
        expect(vm.rolls.d12).toBe(0);
        expect(vm.rolls.d20).toBe(9266 * 20);
        expect(vm.rolls.percentile).toBe(0);
        expect(vm.rolls.custom).toBe(0);
    });

    it('rolls a percentile', function () {
        vm.quantities.percentile = 9266;
        vm.rollPercentile();
        scope.$apply();

        expect(vm.rolls.d2).toBe(0);
        expect(vm.rolls.d3).toBe(0);
        expect(vm.rolls.d4).toBe(0);
        expect(vm.rolls.d6).toBe(0);
        expect(vm.rolls.d8).toBe(0);
        expect(vm.rolls.d10).toBe(0);
        expect(vm.rolls.d12).toBe(0);
        expect(vm.rolls.d20).toBe(0);
        expect(vm.rolls.percentile).toBe(9266 * 100);
        expect(vm.rolls.custom).toBe(0);
    });

    it('rolls a custom roll', function () {
        vm.quantities.custom = 9266;
        vm.customDie = 42;
        vm.rollCustom();
        scope.$apply();

        expect(vm.rolls.d2).toBe(0);
        expect(vm.rolls.d3).toBe(0);
        expect(vm.rolls.d4).toBe(0);
        expect(vm.rolls.d6).toBe(0);
        expect(vm.rolls.d8).toBe(0);
        expect(vm.rolls.d10).toBe(0);
        expect(vm.rolls.d12).toBe(0);
        expect(vm.rolls.d20).toBe(0);
        expect(vm.rolls.percentile).toBe(0);
        expect(vm.rolls.custom).toBe(9266 * 42);
    });

    it('does not reset unrelated rolls', function () {
        vm.quantities.custom = 9266;
        vm.customDie = 42;
        vm.rollCustom();
        scope.$apply();

        expect(vm.rolls.percentile).toBe(0);
        expect(vm.rolls.custom).toBe(9266 * 42);

        vm.quantities.percentile = 9266;
        vm.rollPercentile();
        scope.$apply();

        expect(vm.rolls.percentile).toBe(9266 * 100);
        expect(vm.rolls.custom).toBe(9266 * 42);
    });

    it('overwrites previous roll', function () {
        vm.quantities.custom = 9266;
        vm.customDie = 42;
        vm.rollCustom();
        scope.$apply();
        expect(vm.rolls.custom).toBe(9266 * 42);

        vm.customDie = 90210;
        vm.rollCustom();
        scope.$apply();
        expect(vm.rolls.custom).toBe(9266 * 90210);
    });
})