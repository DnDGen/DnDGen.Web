(function () {
    'use strict';

    angular
        .module('app.character')
        .factory('leadershipService', leadershipService);

    leadershipService.$inject = ['promiseService'];

    function leadershipService(promiseService) {

        return {
            generate: generate,
            generateCohort: generateCohort,
            generateFollower: generateFollower
        };

        function generate(leaderLevel, leaderCharismaBonus, leaderAnimal)
        {
            var url = "https://character.dndgen.com/api/v1/leadership/level/" + leaderLevel + "/generate";

            var parameters = {
                leaderCharismaBonus: leaderCharismaBonus,
                leaderAnimal: leaderAnimal,
            };

            return promiseService.getPromise(url, parameters);
        }

        function generateCohort(cohortScore, leaderLevel, leaderAlignment, leaderClass)
        {
            var url = "https://character.dndgen.com/api/v1/cohort/score/" + cohortScore + "/generate";

            var parameters = {
                leaderLevel: leaderLevel,
                leaderAlignment: leaderAlignment,
                leaderClass: leaderClass,
            };

            return promiseService.getPromise(url, parameters);
        }

        function generateFollower(followerLevel, leaderAlignment, leaderClass)
        {
            var url = "https://character.dndgen.com/api/v1/follower/level/" + followerLevel + "/generate";

            var parameters = {
                leaderAlignment: leaderAlignment,
                leaderClass: leaderClass,
            };

            return promiseService.getPromise(url, parameters);
        }
    };
})();
