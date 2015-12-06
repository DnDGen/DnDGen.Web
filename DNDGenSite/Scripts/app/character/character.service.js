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
            var url = "/Character/Generate?alignmentRandomizerType=" + encodeURI(alignmentRandomizerType);
            url += "&classNameRandomizerType=" + encodeURI(classNameRandomizerType);
            url += "&levelRandomizerType=" + encodeURI(levelRandomizerType);
            url += "&baseRaceRandomizerType=" + encodeURI(baseRaceRandomizerType);
            url += "&metaraceRandomizerType=" + encodeURI(metaraceRandomizerType);
            url += "&statsRandomizerType=" + encodeURI(statsRandomizerType);

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

            if (setStrength > 0)
                url += "&setStrength=" + setStrength;

            if (setConstitution > 0)
                url += "&setConstitution=" + setConstitution;

            if (setDexterity > 0)
                url += "&setDexterity=" + setDexterity;

            if (setIntelligence > 0)
                url += "&setIntelligence=" + setIntelligence;

            if (setWisdom > 0)
                url += "&setWisdom=" + setWisdom;

            if (setCharisma > 0)
                url += "&setCharisma=" + setCharisma;

            if (allowStatsAdjustments == false)
                url += "&allowStatsAdjustments=" + allowStatsAdjustments;

            return promiseService.getPromise(url);
        }
    };
})();
