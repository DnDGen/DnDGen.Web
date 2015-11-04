(function () {
    'use strict';

    angular
        .module('app.character')
        .controller('Character', Character);

    Character.$inject = ['$scope', 'bootstrapData', 'randomizerService', 'characterService', 'sweetAlertService'];

    function Character($scope, bootstrapData, randomizerService, characterService, sweetAlertService) {
        var vm = this;
        vm.characterModel = bootstrapData.characterModel;
        vm.alignmentRandomizerType = vm.characterModel.AlignmentRandomizerTypes[0];
        vm.setAlignment = vm.characterModel.Alignments[0];
        vm.classNameRandomizerType = vm.characterModel.ClassNameRandomizerTypes[0];
        vm.setClassName = vm.characterModel.ClassNames[0];
        vm.levelRandomizerType = vm.characterModel.LevelRandomizerTypes[0];
        vm.setLevel = 0;
        vm.baseRaceRandomizerType = vm.characterModel.BaseRaceRandomizerTypes[0];
        vm.setBaseRace = vm.characterModel.BaseRaces[0];
        vm.metaraceRandomizerType = vm.characterModel.MetaraceRandomizerTypes[0];
        vm.forceMetarace = false;
        vm.setMetarace = vm.characterModel.Metaraces[0];
        vm.statsRandomizerType = vm.characterModel.StatsRandomizerTypes[0];
        vm.setStrength = 0;
        vm.setConstitution = 0;
        vm.setDexterity = 0;
        vm.setIntelligence = 0;
        vm.setWisdom = 0;
        vm.setCharisma = 0;
        vm.character = null;
        vm.compatible = false;
        vm.verifying = false;
        vm.generating = false;

        function verifyRandomizers() {
            vm.verifying = true;

            if (vm.levelRandomizerType == 'Set' && vm.setLevel == 0) {
                vm.compatible = false;
                vm.verifying = false;
            }

            if (vm.statsRandomizerType == 'Set' && vm.setStrength == 0) {
                vm.compatible = false;
                vm.verifying = false;
            }

            if (vm.statsRandomizerType == 'Set' && vm.setConstitution == 0) {
                vm.compatible = false;
                vm.verifying = false;
            }

            if (vm.statsRandomizerType == 'Set' && vm.setDexterity == 0) {
                vm.compatible = false;
                vm.verifying = false;
            }

            if (vm.statsRandomizerType == 'Set' && vm.setIntelligence == 0) {
                vm.compatible = false;
                vm.verifying = false;
            }

            if (vm.statsRandomizerType == 'Set' && vm.setWisdom == 0) {
                vm.compatible = false;
                vm.verifying = false;
            }

            if (vm.statsRandomizerType == 'Set' && vm.setCharisma == 0) {
                vm.compatible = false;
                vm.verifying = false;
            }

            if (vm.verifying) {
                randomizerService.verify(vm.alignmentRandomizerType, vm.setAlignment, vm.classNameRandomizerType, vm.setClassName, vm.levelRandomizerType, vm.setLevel, vm.baseRaceRandomizerType, vm.setBaseRace, vm.metaraceRandomizerType, vm.forceMetarace, vm.setMetarace)
                    .then(function (data) {
                        vm.compatible = data.compatible;
                        vm.verifying = false;
                    }, function () {
                        sweetAlertService.showError();
                        vm.verifying = false;
                        vm.compatible = false;
                    });
            }
        }

        verifyRandomizers();

        vm.generate = function () {
            vm.generating = true;

            characterService.generate(vm.alignmentRandomizerType, vm.setAlignment, vm.classNameRandomizerType, vm.setClassName, vm.levelRandomizerType, vm.setLevel, vm.baseRaceRandomizerType, vm.setBaseRace, vm.metaraceRandomizerType, vm.forceMetarace, vm.setMetarace, vm.statsRandomizerType, vm.setStrength, vm.setConstitution, vm.setDexterity, vm.setIntelligence, vm.setWisdom, vm.setCharisma)
                .then(function (data) {
                    if (typeof data == 'string')
                        console.log(data);

                    vm.character = data.character;
                    vm.generating = false;
                }, function () {
                    sweetAlertService.showError();
                    vm.generating = false;
                    vm.character = null;
                });
        };

        $scope.$watch('vm.alignmentRandomizerType', function (newValue, oldValue) {
            verifyRandomizers();
        });

        $scope.$watch('vm.setAlignment', function (newValue, oldValue) {
            verifyRandomizers();
        });

        $scope.$watch('vm.classNameRandomizerType', function (newValue, oldValue) {
            verifyRandomizers();
        });

        $scope.$watch('vm.setClassName', function (newValue, oldValue) {
            verifyRandomizers();
        });

        $scope.$watch('vm.levelRandomizerType', function (newValue, oldValue) {
            verifyRandomizers();
        });

        $scope.$watch('vm.setLevel', function (newValue, oldValue) {
            verifyRandomizers();
        });

        $scope.$watch('vm.baseRaceRandomizerType', function (newValue, oldValue) {
            verifyRandomizers();
        });

        $scope.$watch('vm.setBaseRace', function (newValue, oldValue) {
            verifyRandomizers();
        });

        $scope.$watch('vm.metaraceRandomizerType', function (newValue, oldValue) {
            verifyRandomizers();
        });

        $scope.$watch('vm.forceMetarace', function (newValue, oldValue) {
            verifyRandomizers();
        });

        $scope.$watch('vm.setMetarace', function (newValue, oldValue) {
            verifyRandomizers();
        });

        $scope.$watch('vm.statsRandomizerType', function (newValue, oldValue) {
            verifyRandomizers();
        });

        $scope.$watch('vm.setStrength', function (newValue, oldValue) {
            verifyRandomizers();
        });

        $scope.$watch('vm.setConstitution', function (newValue, oldValue) {
            verifyRandomizers();
        });

        $scope.$watch('vm.setDexterity', function (newValue, oldValue) {
            verifyRandomizers();
        });

        $scope.$watch('vm.setIntelligence', function (newValue, oldValue) {
            verifyRandomizers();
        });

        $scope.$watch('vm.setWisdom', function (newValue, oldValue) {
            verifyRandomizers();
        });

        $scope.$watch('vm.setCharisma', function (newValue, oldValue) {
            verifyRandomizers();
        });
    };
})();