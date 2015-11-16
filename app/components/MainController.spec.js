describe('MainController', function() {
    var $controller, $scope, sut,
        mockLocalStorageService, mockDateManipulationService,
        localStorageData, KEY_POUR_FLOWER_DATA, mockDate, $rootScope, mockPourActionsService,
        basicPourData;

    beforeEach(function () {
        module('appPourFlower');

        KEY_POUR_FLOWER_DATA = 'POUR_FLOWER_DATA';

        mockDate = new Date();
        mockDate.setFullYear(mockDate.getFullYear() - 10);
        localStorageData = [
            {dateOfLastWatering: mockDate, interval: 12, dateOfNextWatering: mockDate},
            {dateOfLastWatering: mockDate, interval: 7, dateOfNextWatering: mockDate}
        ];
        basicPourData = {name: 'red', dateOfLastWatering: mockDate, interval: 12};
        mockLocalStorageService = {
            getAppData: jasmine.createSpy('getAppData').andReturn(localStorageData),
            setAppData: jasmine.createSpy('setAppData')
        };
        mockDateManipulationService = {
            actualizeDateOfNextWatering: jasmine.createSpy('actualizeDateOfNextWatering').andReturn(localStorageData)
        };
        mockPourActionsService = {
            pourFlower: jasmine.createSpy('pourFlower'),
            getBasicPourData: jasmine.createSpy('getBasicPourData').andReturn(basicPourData),
            removeFlower: jasmine.createSpy('removeFlower')
        };
    });

    beforeEach(inject(function(_$controller_, _$rootScope_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        spyOn($rootScope, '$on').andCallThrough();

        executeController();
    }));

    function executeController() {
        sut = $controller('MainController', {
            $scope: $scope,
            LocalStorageService : mockLocalStorageService,
            DateManipulationService: mockDateManipulationService,
            PourActionsService: mockPourActionsService
        });
    }

    describe('On init', function() {
        it('should subscribe on event update-data-in-storage', function () {
            expect($scope.$on).toHaveBeenCalledWith('update-data-in-storage', jasmine.any(Function));
        });

        it('should get data from local storage', function() {
            expect(mockLocalStorageService.getAppData).toHaveBeenCalled();

            expect(mockDateManipulationService.actualizeDateOfNextWatering).toHaveBeenCalledWith(localStorageData);
            expect($scope.pourFlowerData).toEqual(localStorageData);
        });

        it('should be set in scope handler to set date of last action to current', function () {
            expect($scope.onPourFlower).toEqual(jasmine.any(Function));
        });

        it('should be set in scope handler to remove item', function () {
            expect($scope.onRemoveFlower).toEqual(jasmine.any(Function));
        });
    });

    describe('On pour flower handler', function () {
        it('should provide action', function () {
            $scope.onPourFlower('item');
            expect(mockPourActionsService.pourFlower).toHaveBeenCalledWith('item')
        });
    });

    describe('On event to update data in storage', function () {
        beforeEach(function () {
            $rootScope.$emit('update-data-in-storage');
        });
        it('should get basic data before it will be stored', function () {
            expect(mockPourActionsService.getBasicPourData).toHaveBeenCalledWith($scope.pourFlowerData);
        });

        it('should set app data to local storage', function () {
            expect(mockLocalStorageService.setAppData).toHaveBeenCalledWith(basicPourData);
        });
    });

    describe('On remove flower handler', function () {
        it('should provide action', function () {
            $scope.onRemoveFlower('flower-to-remove');
            expect(mockPourActionsService.removeFlower).toHaveBeenCalledWith('flower-to-remove', $scope.pourFlowerData)
        });
    });
});