describe('ModalInstanceController', function() {
    var $controller, $scope, sut, flower, mockModalInstance;

    beforeEach(function () {
        module('modalDialog');

        mockModalInstance = {
            close: jasmine.createSpy('close'),
            dismiss: jasmine.createSpy('dismiss')
        };
    });

    beforeEach(inject(function(_$controller_, $rootScope){
        $controller = _$controller_;
        $scope = $rootScope.$new();

        sut = $controller('ModalInstanceController', {
            $scope: $scope,
            $modalInstance: mockModalInstance
        });
    }));

    describe('On init', function() {
        it('should initialize handler to close modal window successfully', function () {
            expect($scope.ok).toEqual(jasmine.any(Function));
        });

        it('should initialize handler to close modal window with cancel', function () {
            expect($scope.cancel).toEqual(jasmine.any(Function));
        });
    });

    describe('On "Ok" event of modal window', function () {
        it('should fire close on presenter of modal window', function () {
            flower = {name: 'flower', interval: 10};
            $scope.flower = flower;
            $scope.ok();

            expect(mockModalInstance.close).toHaveBeenCalledWith(flower);
        });
    });

    describe('On "Cancel" event of modal window', function () {
        it('should fire dismiss on presenter of modal window', function () {
            $scope.cancel();

            expect(mockModalInstance.dismiss).toHaveBeenCalledWith('cancel');
        });
    })
});