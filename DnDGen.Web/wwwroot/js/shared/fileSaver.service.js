﻿(function () {
    'use strict';

    angular
        .module('app.shared')
        .factory('fileSaverService', fileSaverService);

    function fileSaverService() {
        return {
            save: save
        };

        function save(text, fileNameWithoutExtension) {
            var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, fileNameWithoutExtension + ".txt");
        }
    };
})();
