(function () {
    'use strict';

    angular
        .module('appPourFlower')
        .factory('PourActionsService', PourActionsService);

    function PourActionsService($rootScope, DateManipulationService) {
        function pourFlower(itemFlower) {
            DateManipulationService.setDateOfLastActionToCurrent(itemFlower);
            DateManipulationService.actualizeItemDateOfNextWatering(itemFlower);

            $rootScope.$emit('update-data-in-storage');
        }

        function getBasicPourData(fullPourdata) {
            var basicProps = ['name', 'interval', 'dateOfLastWatering'];

            return fullPourdata.map(function (fullPourDataItem) {
                var basicPourDataItem = {};
                basicProps.forEach(function (prop) {
                    basicPourDataItem[prop] = fullPourDataItem[prop];
                });
                return basicPourDataItem;
            });
        }

        function removeFlower(flowerToRemove, pourFlowerData) {
            var indexOfFlowerItem = pourFlowerData.indexOf(flowerToRemove);
            pourFlowerData.splice(indexOfFlowerItem, 1);

            $rootScope.$emit('update-data-in-storage');
        }

        return {
            pourFlower: pourFlower,
            getBasicPourData: getBasicPourData,
            removeFlower: removeFlower
        }
    }

})();