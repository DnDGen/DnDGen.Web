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
            var url = "/Characters/Randomizers/Verify?alignmentRandomizerType=" + encodeURI(alignmentRandomizerType);
            url += "&classNameRandomizerType=" + encodeURI(classNameRandomizerType);
            url += "&levelRandomizerType=" + encodeURI(levelRandomizerType);
            url += "&baseRaceRandomizerType=" + encodeURI(baseRaceRandomizerType);
            url += "&metaraceRandomizerType=" + encodeURI(metaraceRandomizerType);

            if (setAlignment.length > 0)
                url += "&setAlignment=" + encodeURI(setAlignment);

            if (setClassName.length > 0)
                url += "&setClassName=" + encodeURI(setClassName);

            if (setLevel > 0)
                url += "&setLevel=" + setLevel;

            if (allowLevelAdjustments == false)
                url += "&allowLevelAdjustments=" + allowLevelAdjustments;

            if (setBaseRace.length > 0)
                url += "&setBaseRace=" + encodeURI(setBaseRace);

            if (forceMetarace)
                url += "&forceMetarace=" + forceMetarace;

            if (setMetarace.length > 0)
                url += "&setMetarace=" + encodeURI(setMetarace);

            return promiseService.getPromise(url);
        }
    };
})();
