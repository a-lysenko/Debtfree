(function () {
    'use strict';

    angular
        .module('appPourFlower')
        .controller('MainController', MainController);

    //MainController.$inject = ['$rootScope', '$scope', 'LocalStorageService', 'DateManipulationService', 'PourActionsService'];

    /*@ngInject*/
    function MainController($rootScope, $scope, LocalStorageService, DateManipulationService, PourActionsService) {
        angular.extend($scope, {
            currentDate: new Date(),
            pourFlowerData: DateManipulationService.actualizeDateOfNextWatering(LocalStorageService.getAppData()),

            onPourFlower: onPourFlower,
            onRemoveFlower: onRemoveFlower
        });

        $rootScope.$on('update-data-in-storage', function () {
            var basicPourData = PourActionsService.getBasicPourData($scope.pourFlowerData);
            LocalStorageService.setAppData(basicPourData);
        });

        function onPourFlower(item) {
            PourActionsService.pourFlower(item);
        }

        function onRemoveFlower(item) {
            PourActionsService.removeFlower(item, $scope.pourFlowerData);
        }
    }
})();
