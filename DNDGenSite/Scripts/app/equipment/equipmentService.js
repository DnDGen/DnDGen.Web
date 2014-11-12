(function () {
    'use strict';

    angular
        .module('app.equipment')
        .factory('equipmentService', equipmentService);

    equipmentService.$inject = ['$http', '$q'];

    function equipmentService($http, $q) {
        return {
            getTreasure: getTreasure,
            getCoin: getCoin,
            getGoods: getGoods,
            getItems: getItems,
            getAlchemicalItem: getAlchemicalItem,
            getArmor: getArmor,
            getPotion: getPotion,
            getRing: getRing,
            getRod: getRod,
            getScroll: getScroll,
            getStaff: getStaff,
            getTool: getTool,
            getWand: getWand,
            getWeapon: getWeapon,
            getWondrousItem: getWondrousItem
        };

        function getTreasure(level) {
            var url = "Equipment/Treasure/Generate/" + level;
            return getPromise(url);
        };

        function getCoin(level) {
            var url = "Equipment/Coin/Generate/" + level;
            return getPromise(url);
        };

        function getGoods(level) {
            var url = "Equipment/Goods/Generate/" + level;
            return getPromise(url);
        };

        function getItems(level) {
            var url = "Equipment/Items/Generate/" + level;
            return getPromise(url);
        };

        function getAlchemicalItem() {
            var url = "Equipment/AlchemicalItem/Generate";
            return getPromise(url);
        };

        function getArmor(power) {
            var url = "Equipment/Armor/Generate/" + power;
            return getPromise(url);
        };

        function getPotion(power) {
            var url = "Equipment/Potion/Generate/" + power;
            return getPromise(url);
        };

        function getRing(power) {
            var url = "Equipment/Ring/Generate/" + power;
            return getPromise(url);
        };

        function getRod(power) {
            var url = "Equipment/Rod/Generate/" + power;
            return getPromise(url);
        };

        function getScroll(power) {
            var url = "Equipment/Scroll/Generate/" + power;
            return getPromise(url);
        };

        function getStaff(power) {
            var url = "Equipment/Staff/Generate/" + power;
            return getPromise(url);
        };

        function getTool() {
            var url = "Equipment/Tool/Generate";
            return getPromise(url);
        };

        function getWand(power) {
            var url = "Equipment/Wand/Generate/" + power;
            return getPromise(url);
        };

        function getWeapon(power) {
            var url = "Equipment/Weapon/Generate/" + power;
            return getPromise(url);
        };

        function getWondrousItem(power) {
            var url = "Equipment/WondrousItem/Generate/" + power;
            return getPromise(url);
        };

        function getPromise(url) {
            var deferred = $q.defer();
            $http.get(url).success(deferred.resolve).error(deferred.reject);

            return deferred.promise;
        }
    };
})();
