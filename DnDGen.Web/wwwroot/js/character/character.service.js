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

        function generate(alignmentRandomizerType, setAlignment, classNameRandomizerType, setClassName, levelRandomizerType, setLevel, allowLevelAdjustments, baseRaceRandomizerType, setBaseRace, metaraceRandomizerType, forceMetarace, setMetarace, statsRandomizerType, setStrength, setConstitution, setDexterity, setIntelligence, setWisdom, setCharisma, allowStatsAdjustments)
        {
            var url = "https://character.dndgen.com/api/v1/character/generate";

            var parameters = {
                alignmentRandomizerType: alignmentRandomizerType,
                classNameRandomizerType: classNameRandomizerType,
                levelRandomizerType: levelRandomizerType,
                baseRaceRandomizerType: baseRaceRandomizerType,
                metaraceRandomizerType: metaraceRandomizerType,
                abilitiesRandomizerType: statsRandomizerType,
                setAlignment: setAlignment,
                setClassName: setClassName,
                setLevel: setLevel,
                allowLevelAdjustments: allowLevelAdjustments,
                setBaseRace: setBaseRace,
                forceMetarace: forceMetarace,
                setMetarace: setMetarace,
                setStrength: setStrength,
                setConstitution: setConstitution,
                setDexterity: setDexterity,
                setIntelligence: setIntelligence,
                setWisdom: setWisdom,
                setCharisma: setCharisma,
                allowAbilityAdjustments: allowStatsAdjustments,
            };

            return promiseService.getPromise(url, parameters);
        }
    };
})();
