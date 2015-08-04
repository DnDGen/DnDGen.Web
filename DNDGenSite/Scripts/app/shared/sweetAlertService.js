(function () {
    'use strict';

    angular
        .module('app.shared')
        .factory('sweetAlertService', sweetAlertService);

    function sweetAlertService() {

        return {
            showError: showError
        };

        function showError() {
            swal("Critical Miss", "Well, this is embarassing.  DnDGen rolled a Nat 1.  We've complained loudly to the DM (the development team), and they will fix this problem as soon as they can.", "error");
        }
    };
})();
