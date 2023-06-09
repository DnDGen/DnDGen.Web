(function () {
    'use strict';

    angular
    .module('app.shared')
    .filter('inchesToFeet', filter);

    function filter() {
        return computeFeet;
    }

    function computeFeet(input) {
        var feet = Math.floor(input / 12);
        var inches = input % 12;

        var output = "";

        if (feet > 0)
            output += feet + "'";

        if (inches > 0 || feet == 0) {
            if (output.length > 0)
                output += " ";

            output += inches + '"';
        }

        return output;
    }
})();