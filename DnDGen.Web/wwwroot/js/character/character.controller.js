(function () {
    'use strict';

    angular
        .module('app.character')
        .controller('Character', Character);

    Character.$inject = ['$scope', 'bootstrapData', 'randomizerService', 'characterService', 'sweetAlertService', 'leadershipService', 'fileSaverService', 'characterFormatterService', 'eventService'];

    function Character($scope, bootstrapData, randomizerService, characterService, sweetAlertService, leadershipService, fileSaverService, characterFormatterService, eventService) {
        var vm = this;
        vm.characterModel = bootstrapData.characterModel;
        vm.alignmentRandomizerType = vm.characterModel.AlignmentRandomizerTypes[0];
        vm.setAlignment = vm.characterModel.Alignments[0];
        vm.classNameRandomizerType = vm.characterModel.ClassNameRandomizerTypes[0];
        vm.setClassName = vm.characterModel.ClassNames[0];
        vm.levelRandomizerType = vm.characterModel.LevelRandomizerTypes[0];
        vm.setLevel = 0;
        vm.allowLevelAdjustments = true;
        vm.baseRaceRandomizerType = vm.characterModel.BaseRaceRandomizerTypes[0];
        vm.setBaseRace = vm.characterModel.BaseRaces[0];
        vm.metaraceRandomizerType = vm.characterModel.MetaraceRandomizerTypes[0];
        vm.forceMetarace = false;
        vm.setMetarace = vm.characterModel.Metaraces[0];
        vm.abilitiesRandomizerType = vm.characterModel.AbilitiesRandomizerTypes[0];
        vm.setStrength = 0;
        vm.setConstitution = 0;
        vm.setDexterity = 0;
        vm.setIntelligence = 0;
        vm.setWisdom = 0;
        vm.setCharisma = 0;
        vm.allowAbilitiesAdjustments = true;
        vm.character = null;
        vm.compatible = false;
        vm.verifying = false;
        vm.generating = false;
        vm.leadership = null;
        vm.cohort = null;
        vm.followers = [];
        vm.generatingMessage = '';
        vm.clientId = '';

        function verifyRandomizers() {
            vm.verifying = true;

            if (vm.levelRandomizerType === 'Set' && vm.setLevel === 0) {
                vm.compatible = false;
                vm.verifying = false;
            }

            if (vm.abilitiesRandomizerType === 'Set' && vm.setStrength === 0) {
                vm.compatible = false;
                vm.verifying = false;
            }

            if (vm.abilitiesRandomizerType === 'Set' && vm.setConstitution === 0) {
                vm.compatible = false;
                vm.verifying = false;
            }

            if (vm.abilitiesRandomizerType === 'Set' && vm.setDexterity === 0) {
                vm.compatible = false;
                vm.verifying = false;
            }

            if (vm.abilitiesRandomizerType === 'Set' && vm.setIntelligence === 0) {
                vm.compatible = false;
                vm.verifying = false;
            }

            if (vm.abilitiesRandomizerType === 'Set' && vm.setWisdom === 0) {
                vm.compatible = false;
                vm.verifying = false;
            }

            if (vm.abilitiesRandomizerType === 'Set' && vm.setCharisma === 0) {
                vm.compatible = false;
                vm.verifying = false;
            }

            if (vm.verifying) {
                eventService.getClientId().then(function (response) {
                    vm.clientId = response.data.clientId;

                    randomizerService.verify(vm.clientId, vm.alignmentRandomizerType, vm.setAlignment, vm.classNameRandomizerType, vm.setClassName, vm.levelRandomizerType, vm.setLevel, vm.allowLevelAdjustments, vm.baseRaceRandomizerType, vm.setBaseRace, vm.metaraceRandomizerType, vm.forceMetarace, vm.setMetarace)
                        .then(function (response) {
                            vm.compatible = response.data.compatible;
                        }, function () {
                            sweetAlertService.showError();
                            vm.compatible = false;
                        }).then(function () {
                            vm.verifying = false;
                            eventService.clearEvents(vm.clientId);
                        });
                });
            }
        }

        verifyRandomizers();

        vm.generate = function () {
            vm.generating = true;
            vm.character = null;
            vm.leadership = null;
            vm.cohort = null;
            vm.followers = [];

            vm.generatingMessage = 'Generating character...';

            eventService.getClientId().then(function (response) {
                vm.clientId = response.data.clientId;

                characterService.generate(vm.clientId, vm.alignmentRandomizerType, vm.setAlignment, vm.classNameRandomizerType, vm.setClassName, vm.levelRandomizerType, vm.setLevel, vm.allowLevelAdjustments, vm.baseRaceRandomizerType, vm.setBaseRace, vm.metaraceRandomizerType, vm.forceMetarace, vm.setMetarace, vm.abilitiesRandomizerType, vm.setStrength, vm.setConstitution, vm.setDexterity, vm.setIntelligence, vm.setWisdom, vm.setCharisma, vm.allowAbilitiesAdjustments)
                .then(function (response) {
                    if (typeof response.data === 'string')
                        console.log(data);

                    vm.character = response.data.character;
                }, sweetAlertService.showError).then(function () {
                    if (vm.character && vm.character.IsLeader) {
                        vm.generatingMessage = 'Generating leadership...';

                        leadershipService.generate(vm.clientId, vm.character.Class.Level, vm.character.Abilities.Charisma.Bonus, vm.character.Magic.Animal)
                            .then(function (response) {
                                vm.leadership = response.data.leadership;
                            }).then(function () {
                                vm.generatingMessage = 'Generating cohort...';
                                return leadershipService.generateCohort(vm.clientId, vm.character.Class.Level, vm.leadership.CohortScore, vm.character.Alignment.Full, vm.character.Class.Name)
                            }).then(function (response) {
                                vm.cohort = response.data.cohort;
                            }, function () {
                                sweetAlertService.showError();
                            }).then(function () {
                                if (vm.leadership.FollowerQuantities.Level1 === 0) {
                                    vm.generating = false;
                                    return;
                                }

                                generateFollowers(1, vm.leadership.FollowerQuantities.Level1);
                                generateFollowers(2, vm.leadership.FollowerQuantities.Level2);
                                generateFollowers(3, vm.leadership.FollowerQuantities.Level3);
                                generateFollowers(4, vm.leadership.FollowerQuantities.Level4);
                                generateFollowers(5, vm.leadership.FollowerQuantities.Level5);
                                generateFollowers(6, vm.leadership.FollowerQuantities.Level6);
                            });
                    } else {
                        noLongerGenerating();
                    }
                });
            });
        };

        function noLongerGenerating() {
            vm.generating = false;
            vm.generatingMessage = '';
        }

        function generateFollowers(level, amount) {
            for (var i = amount; i > 0; i--) {
                leadershipService.generateFollower(vm.clientId, level, vm.character.Alignment.Full, vm.character.Class.Name)
                    .then(function (response) {
                        vm.followers.push(response.data.follower);
                    }, function () {
                        sweetAlertService.showError();
                    });
            }
        }

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

        $scope.$watch('vm.allowLevelAdjustments', function (newValue, oldValue) {
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

        $scope.$watch('vm.abilitiesRandomizerType', function (newValue, oldValue) {
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

        $scope.$watch('vm.followers', function (newValue, oldValue) {
            if (vm.followers.length === 0)
                return;
            
            var expectedTotal = vm.leadership.FollowerQuantities.Level1 +
                                vm.leadership.FollowerQuantities.Level2 +
                                vm.leadership.FollowerQuantities.Level3 +
                                vm.leadership.FollowerQuantities.Level4 +
                                vm.leadership.FollowerQuantities.Level5 +
                                vm.leadership.FollowerQuantities.Level6;

            if (vm.followers.length >= expectedTotal) {
                noLongerGenerating();
            }
            else {
                vm.generating = true;
                vm.generatingMessage = 'Generating follower ' + (vm.followers.length + 1) + ' of ' + expectedTotal + '...';
            }
        }, true);

        vm.download = function () {
            var formattedCharacter = characterFormatterService.formatCharacter(vm.character, vm.leadership, vm.cohort, vm.followers);
            fileSaverService.save(formattedCharacter, vm.character.Summary);
        };
    };
})();