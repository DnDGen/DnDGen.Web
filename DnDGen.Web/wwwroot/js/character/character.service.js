(function () {
    'use strict';

    angular
        .module('app.character')
        .factory('characterService', characterService);

    characterService.$inject = ['promiseService'];

    function characterService(promiseService) {

        return {
            generate: generate
        };

        function generate(clientId, alignmentRandomizerType, setAlignment, classNameRandomizerType, setClassName, levelRandomizerType, setLevel, allowLevelAdjustments, baseRaceRandomizerType, setBaseRace, metaraceRandomizerType, forceMetarace, setMetarace, statsRandomizerType, setStrength, setConstitution, setDexterity, setIntelligence, setWisdom, setCharisma, allowStatsAdjustments)
        {
            var url = "/Character/Generate";

            var parameters = {
                clientId: clientId,
                AlignmentRandomizerType: alignmentRandomizerType,
                ClassNameRandomizerType: classNameRandomizerType,
                LevelRandomizerType: levelRandomizerType,
                BaseRaceRandomizerType: baseRaceRandomizerType,
                MetaraceRandomizerType: metaraceRandomizerType,
                AbilitiesRandomizerType: statsRandomizerType,
                SetAlignment: setAlignment,
                SetClassName: setClassName,
                SetLevel: setLevel,
                AllowLevelAdjustments: allowLevelAdjustments,
                SetBaseRace: setBaseRace,
                ForceMetarace: forceMetarace,
                SetMetarace: setMetarace,
                SetStrength: setStrength,
                SetConstitution: setConstitution,
                SetDexterity: setDexterity,
                SetIntelligence: setIntelligence,
                SetWisdom: setWisdom,
                SetCharisma: setCharisma,
                AllowAbilityAdjustments: allowStatsAdjustments,
            };

            return promiseService.getPromise(url, parameters);
        }
    };
})();
