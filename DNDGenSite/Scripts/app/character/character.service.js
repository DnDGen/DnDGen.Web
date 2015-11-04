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

        function generate(alignmentRandomizerType, setAlignment, classNameRandomizerType, setClassName, levelRandomizerType, setLevel, baseRaceRandomizerType, setBaseRace, metaraceRandomizerType, forceMetarace, setMetarace, statsRandomizerType, setStrength, setConstitution, setDexterity, setIntelligence, setWisdom, setCharisma)
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

            if (setBaseRace.length > 0)
                url += "&setBaseRace=" + encodeURI(setBaseRace);

            if (forceMetarace)
                url += "&forceMetarace=" + forceMetarace;

            if (setMetarace.length > 0)
                url += "&setMetarace=" + encodeURI(setMetarace);

            if (setStrength > 0)
                url += "&setStrength=" + encodeURI(setStrength);

            if (setConstitution > 0)
                url += "&setConstitution=" + encodeURI(setConstitution);

            if (setDexterity > 0)
                url += "&setDexterity=" + encodeURI(setDexterity);

            if (setIntelligence > 0)
                url += "&setIntelligence=" + encodeURI(setIntelligence);

            if (setWisdom > 0)
                url += "&setWisdom=" + encodeURI(setWisdom);

            if (setCharisma > 0)
                url += "&setCharisma=" + encodeURI(setCharisma);

            return promiseService.getPromise(url);
        }
    };
})();
