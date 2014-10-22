(function () {
    'use strict';

    angular
        .module('app.dice')
        .controller('Dice', Dice);

    Dice.$inject = ['$scope', 'diceService'];

    function Dice($scope, diceService) {
        $scope.d2Roll = "";
        $scope.d3Roll = "";
        $scope.d4Roll = "";
        $scope.d6Roll = "";
        $scope.d8Roll = "";
        $scope.d10Roll = "";
        $scope.d12Roll = "";
        $scope.d20Roll = "";
        $scope.percentileRoll = "";
        $scope.customRoll = "";

        $scope.rollD2 = function (quantity) {
            var model = getModelFor(documentId);
            model.Status = status;
        };

        function getModelFor(documentId) {
            if ($scope.checkInModel.MainDocument.Id === documentId)
                return $scope.checkInModel.MainDocument;

            for (var i = 0; i < $scope.checkInModel.Dependencies.length; i++)
                if ($scope.checkInModel.Dependencies[i].Id === documentId)
                    return $scope.checkInModel.Dependencies[i];
        }

        $scope.formattedDependencies = [];
        var tableRow = [];
        for (var i = 0; i < $scope.checkInModel.Dependencies.length; i++) {
            var dependency = $scope.checkInModel.Dependencies[i];
            tableRow.push(dependency);

            if (tableRow.length >= 3) {
                $scope.formattedDependencies.push(tableRow);
                tableRow = [];
            }
        }

        if (tableRow.length > 0)
            $scope.formattedDependencies.push(tableRow);

        $scope.getCorrespondingDocumentId = function (fileName) {
            if (fileNameMatches(fileName, $scope.checkInModel.MainDocument.FileName))
                return $scope.checkInModel.MainDocument.Id;

            for (var i = 0; i < $scope.checkInModel.Dependencies.length; i++)
                if (fileNameMatches(fileName, $scope.checkInModel.Dependencies[i].FileName))
                    return $scope.checkInModel.Dependencies[i].Id;

            return 0;
        };

        function fileNameMatches(fileName, fileNameModel) {
            var beginningIndex = fileName.indexOf(fileNameModel.Base);
            var endingIndex = fileName.lastIndexOf(fileNameModel.Extension);
            var expectedEndingIndex = fileName.length - fileNameModel.Extension.length;

            return beginningIndex === 0 && endingIndex === expectedEndingIndex;
        };

        $scope.getCorrespondingFileName = function (documentId) {
            var model = getModelFor(documentId);
            return model.FileName.Full;
        };

        $scope.checkInDocument = function (documentId) {
            updateIcon(documentId);
            $scope.setStatus(documentId, "checked in");
            updateProcessingButtons(documentId);
        };

        function updateProcessingButtons(documentId) {
            if ($scope.checkInModel.MainDocument.Id !== documentId)
                return;

            checkInService.getUpdatedProcessingButtons(documentId)
                .then(loadProcessingButtons).catch(showUnknownErrorInAlert);
        };

        function updateIcon(documentId) {
            var model = getModelFor(documentId);

            checkInService.getFileIconUrl(documentId).then(function (data) {
                model.FileIconUrl = data.fileIconUrl;
            });
        };
    };
})();