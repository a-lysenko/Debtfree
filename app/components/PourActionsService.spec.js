describe('PourActionsService', function () {
    var sut, itemFlower, $rootScope, pourFlowerData;
    beforeEach(function () {
        module("appPourFlower");
    });

    beforeEach(inject(function (PourActionsService, _$rootScope_) {
        sut = PourActionsService;
        $rootScope = _$rootScope_;

        spyOn($rootScope, '$emit').andCallThrough();
    }));

    describe('Pour flower', function () {
        beforeEach(function () {
            itemFlower = {
                dateOfLastWatering: new Date(2000, 10, 10),
                interval: 10,
                dateOfNextWatering: undefined
            };

            sut.pourFlower(itemFlower);
        });
        it('should set date of last watering in item to current', function () {
            var startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);
            var endOfToday = new Date();
            endOfToday.setHours(23, 59, 59, 999);

            expect(itemFlower.dateOfLastWatering).toBeGreaterThan(startOfToday);
            expect(itemFlower.dateOfLastWatering).toBeLessThan(endOfToday);
        });

        it('should set date of next action in item to (date of last action + interval)', function () {
            var calculatedDateOfNexWatering = new Date(itemFlower.dateOfLastWatering);
            calculatedDateOfNexWatering.setDate(calculatedDateOfNexWatering.getDate() + itemFlower.interval);

            expect(itemFlower.dateOfNextWatering).toEqual(calculatedDateOfNexWatering);
        });

        it('should notify to update data in local storage', function () {
            expect($rootScope.$emit).toHaveBeenCalledWith('update-data-in-storage');
        });
    });

    describe('Get basic pour data', function () {
        it('should create copy of data with basic props only ' +
            '(name, interval and date of the last watering', function () {
            var fullPourData = [
                {
                    name: 'red',
                    interval: 100,
                    dateOfLastWatering: new Date(),
                    unnecessaryProp: 'unnecessary property'
                },
                {
                    name: 'green',
                    interval: 100,
                    dateOfLastWatering: new Date(),
                    unnecessaryProp: 'unnecessary property',
                    otherUnnecessaryProp: 'other unnecessary property'

                }];
            var basicPourData = sut.getBasicPourData(fullPourData);

            expect(Object.keys(basicPourData[0])).toEqual(Object.keys(basicPourData[1]));
            expect(Object.keys(basicPourData[0]).sort()).toEqual(['name', 'interval', 'dateOfLastWatering'].sort());
        })
    });

    describe('Remove flower', function () {
        beforeEach(function () {
            itemFlower = {
                dateOfLastWatering: new Date(2000, 10, 10),
                interval: 10,
                dateOfNextWatering: undefined
            };
            pourFlowerData = [itemFlower, {name: 'item 2'}];

            sut.removeFlower(itemFlower, pourFlowerData);
        });
        it('should remove flower from given collection', function () {
            expect(pourFlowerData.indexOf(itemFlower)).toBe(-1);
            expect(pourFlowerData.length).toBe(1);
        });

        it('should notify to update data in local storage', function () {
            expect($rootScope.$emit).toHaveBeenCalledWith('update-data-in-storage');
        });
    });
});