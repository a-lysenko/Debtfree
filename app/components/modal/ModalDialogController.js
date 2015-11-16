(function () {
    'use strict';

    angular
        .module('modalDialog')
        .controller('ModalDialogController', ModalDialogController);

    function ModalDialogController($scope, $modal, $log, DateManipulationService) {
        angular.extend($scope, {
            flower: {},

            open: open
        });

        function open() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'components/modal/modalInstance.html',
                controller: 'ModalInstanceController'
            });

            modalInstance.result.then(function (addedFlower) {
                DateManipulationService.actualizeItemDateOfNextWatering(addedFlower);
                $scope.$parent.pourFlowerData.push(addedFlower);

                $scope.$emit('update-data-in-storage');
            }, function (text) {
                $log.info('Modal dismissed reason: ' + text);
            });
        }
    }

})();