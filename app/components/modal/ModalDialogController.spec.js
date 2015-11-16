describe('ModalDialogController', function() {
    var $controller, $scope, sut, $log, $modal, mockModal, flower, mockDateManipulationService;

    beforeEach(function () {
        module('modalDialog');

        mockModal = {
            result: {
                then: function(confirmCallback, cancelCallback) {
                    //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                }
            },
            close: function(flower) {
                //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
                this.result.confirmCallBack( flower );
            },
            dismiss: function(reason) {
                //The user clicked cancel on the modal dialog, call the stored cancel callback
                this.result.cancelCallback( reason );
            }
        };

        mockDateManipulationService = {
            actualizeItemDateOfNextWatering: jasmine.createSpy('actualizeItemDateOfNextWatering')
        }
    });

    beforeEach(inject(function(_$controller_, $rootScope, _$modal_, _$log_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $scope = $rootScope.$new();
        $modal = _$modal_;
        $log = _$log_;

        $scope.$parent = {
            pourFlowerData: []
        };
        spyOn($scope, '$emit');
        spyOn($modal, 'open').andReturn(mockModal);
        spyOn($log, 'info');

        sut = $controller('ModalDialogController', {
            $scope: $scope,
            $modal: $modal,
            $log: $log,
            DateManipulationService: mockDateManipulationService
        });
    }));

    describe('On init', function() {
        it('should initialize object for new flower', function () {
            expect($scope.flower).toEqual(jasmine.any(Object));
        });

        it('should initialize handler to open modal dialog', function () {
            expect($scope.open).toEqual(jasmine.any(Function));
        });
    });

    describe('On open modal dialog handler', function () {
        beforeEach(function () {
            flower = {name: 'flower', interval: 10};
            $scope.open();

            mockModal.close(flower);
        });

        it('should open specific modal', function () {
            expect($modal.open).toHaveBeenCalledWith({
                animation: true,
                templateUrl: 'components/modal/modalInstance.html',
                controller: 'ModalInstanceController'
            });
        });

        describe('On success', function () {
            it('actualize date of next watering at added item', function () {
                expect(mockDateManipulationService.actualizeItemDateOfNextWatering).toHaveBeenCalledWith(flower);
            });

            it("should close the dialog when ok is called, and add a flower to collection", function () {
                expect($scope.$parent.pourFlowerData.indexOf(flower)).not.toBe(-1);
            });

            it('should emit to update data in storage', function () {

                expect($scope.$emit).toHaveBeenCalledWith('update-data-in-storage');
            });
        });

        describe('On cancel', function () {
            it("should cancel the dialog when dismiss is called, and log with reason", function () {
                mockModal.dismiss('cancel');
                expect($log.info).toHaveBeenCalledWith('Modal dismissed reason: cancel');
            });
        });
    })
});