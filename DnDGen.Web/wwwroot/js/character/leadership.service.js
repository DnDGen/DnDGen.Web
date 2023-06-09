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

        function generate(clientId, leaderLevel, leaderCharismaBonus, leaderAnimal)
        {
            var url = "/Characters/Leadership/Generate";

            var parameters = {
                clientId: clientId,
                leaderLevel: leaderLevel,
                leaderCharismaBonus: leaderCharismaBonus,
                leaderAnimal: leaderAnimal,
            };

            return promiseService.getPromise(url, parameters);
        }

        function generateCohort(clientId, leaderLevel, cohortScore, leaderAlignment, leaderClass) {
            var url = "/Characters/Leadership/Cohort";

            var parameters = {
                clientId: clientId,
                leaderLevel: leaderLevel,
                cohortScore: cohortScore,
                leaderAlignment: leaderAlignment,
                leaderClass: leaderClass,
            };

            return promiseService.getPromise(url, parameters);
        }

        function generateFollower(clientId, followerLevel, leaderAlignment, leaderClass) {
            var url = "/Characters/Leadership/Follower";

            var parameters = {
                clientId: clientId,
                followerLevel: followerLevel,
                leaderAlignment: leaderAlignment,
                leaderClass: leaderClass,
            };

            return promiseService.getPromise(url, parameters);
        }
    };
})();
