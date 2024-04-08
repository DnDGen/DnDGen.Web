(function () {
    'use strict';

    angular
        .module('app.character')
        .factory('randomizerService', randomizerService);

    randomizerService.$inject = ['promiseService'];

    function randomizerService(promiseService) {

        return {
            verify: verify
        };

        function verify(alignmentRandomizerType, setAlignment, classNameRandomizerType, setClassName, levelRandomizerType, setLevel, allowLevelAdjustments, baseRaceRandomizerType, setBaseRace, metaraceRandomizerType, forceMetarace, setMetarace)
        {
            var url = "https://character.dndgen.com/api/v1/character/validate";

            var parameters = {
                alignmentRandomizerType: alignmentRandomizerType,
                classNameRandomizerType: classNameRandomizerType,
                levelRandomizerType: levelRandomizerType,
                baseRaceRandomizerType: baseRaceRandomizerType,
                metaraceRandomizerType: metaraceRandomizerType,
                setAlignment: setAlignment,
                setClassName: setClassName,
                setLevel: setLevel,
                allowLevelAdjustments: allowLevelAdjustments,
                setBaseRace: setBaseRace,
                forceMetarace: forceMetarace,
                setMetarace: setMetarace,
            };

            return promiseService.getPromise(url, parameters);
        }
    };
})();
