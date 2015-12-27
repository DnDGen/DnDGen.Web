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
            var url = "/Characters/Leadership/Generate?leaderLevel=" + leaderLevel;
            url += "&leaderCharismaBonus=" + leaderCharismaBonus;
            url += "&leaderAnimal=" + encodeURI(leaderAnimal);

            return promiseService.getPromise(url);
        }

        function generateCohort(leaderLevel, cohortScore, leaderAlignment, leaderClass) {
            var url = "/Characters/Leadership/Cohort?leaderLevel=" + leaderLevel;
            url += "&cohortScore=" + cohortScore;
            url += "&leaderAlignment=" + encodeURI(leaderAlignment);
            url += "&leaderClass=" + encodeURI(leaderClass);

            return promiseService.getPromise(url);
        }

        function generateFollower(followerLevel, leaderAlignment, leaderClass) {
            var url = "/Characters/Leadership/Follower?followerLevel=" + followerLevel;
            url += "&leaderAlignment=" + encodeURI(leaderAlignment);
            url += "&leaderClass=" + encodeURI(leaderClass);

            return promiseService.getPromise(url);
        }
    };
})();
