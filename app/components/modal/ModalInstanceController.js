(function () {
    'use strict';

    angular
        .module('modalDialog')
        .controller('ModalInstanceController', function ($scope, $modalInstance) {
            // Please note that $modalInstance represents a modal window (instance) dependency.
            // It is not the same as the $modal service used above.
            angular.extend($scope, {
                ok: ok,
                cancel: cancel
            });

            function ok() {
                $modalInstance.close($scope.flower);
            }

            function cancel() {
                $modalInstance.dismiss('cancel');
            }
        });
})();