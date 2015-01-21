describe('the DiceController', function () {
    var vm;
    var diceServiceMock;
    var q;
    var scope;

    beforeEach(module('app.dice'));

    beforeEach(function () {
        diceServiceMock = {
            getRoll: function (quantity, die) {
                return getMockedPromise(quantity, 1);
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
        expect(vm.standardQuantity).toBe(1);
        expect(vm.customQuantity).toBe(1);
    });

    it('has custom die of 1 at beginning', function () {
        expect(vm.customDie).toBe(1);
    });

    it('has roll of 0 at beginning', function () {
        expect(vm.roll).toBe(0);
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

        expect(vm.standardDice[0].die).toBe('d2');
        expect(vm.standardDice[1].die).toBe('d3');
        expect(vm.standardDice[2].die).toBe('d4');
        expect(vm.standardDice[3].die).toBe('d6');
        expect(vm.standardDice[4].die).toBe('d8');
        expect(vm.standardDice[5].die).toBe('d10');
        expect(vm.standardDice[6].die).toBe('d12');
        expect(vm.standardDice[7].die).toBe('d20');
        expect(vm.standardDice[8].die).toBe('d100');
    });

    it('has selected d20 as a standard dice on load', function () {
        expect(vm.standardDie).toEqual(vm.standardDice[7]);
    });

    it('rolls a standard die', function () {
        vm.standardQuantity = 9266;
        vm.standardDie = vm.standardDice[2];

        spyOn(diceServiceMock, 'getRoll').andCallThrough();

        vm.rollStandard();
        scope.$apply();

        expect(vm.roll).toBe(9266);
        expect(diceServiceMock.getRoll).toHaveBeenCalledWith(9266, 'd4');
    });

    it('rolls a custom roll', function () {
        vm.customQuantity = 9266;
        vm.customDie = 42;

        spyOn(diceServiceMock, 'getCustomRoll').andCallThrough();

        vm.rollCustom();
        scope.$apply();

        expect(vm.roll).toBe(9266 * 42);
        expect(diceServiceMock.getCustomRoll).toHaveBeenCalledWith(9266, 42);
    });
})