describe('DateManipulationService', function () {
    var DateManipulationService,
        currentDate, interval,
        dateOfLastWateringOutOfDate, dateOfLastWateringStillActual,
        pourFlowerData,
        itemWithDayOfLastActionStillActual, itemWithDayOfLastActionOutOfDate;

    beforeEach(function () {
        module('dateManipulation');
        currentDate = new Date();
        interval = 7;

        dateOfLastWateringOutOfDate = new Date(currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - interval - 20);

        dateOfLastWateringStillActual = new Date(currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - interval + 2);
    });

    function initPourFlowerData() {
        itemWithDayOfLastActionOutOfDate = {
            interval: interval,
            dateOfLastWatering: dateOfLastWateringOutOfDate
        };
        itemWithDayOfLastActionStillActual = {
            interval: interval,
            dateOfLastWatering: dateOfLastWateringStillActual
        };

        pourFlowerData = [
            itemWithDayOfLastActionOutOfDate,
            itemWithDayOfLastActionStillActual
        ];
    }

    beforeEach(inject(function (_DateManipulationService_) {
        DateManipulationService = _DateManipulationService_;
    }));

    describe('Get increased date', function () {
        it('should get increased up to amount of days', function () {
            var increasedDate = new Date(currentDate);
            increasedDate.setDate(increasedDate.getDate() + interval);

            expect(DateManipulationService.getIncreasedDate(currentDate, interval)).toEqual(increasedDate);
        });
    });

    describe('Actualize data of next watering to item', function () {
        beforeEach(function () {
            initPourFlowerData();
        });

        it('should set date of next watering for an item ' +
            'as dateOfLastWatering + interval', function () {
            DateManipulationService.actualizeItemDateOfNextWatering(itemWithDayOfLastActionOutOfDate);
            var increasedDate = new Date(itemWithDayOfLastActionOutOfDate.dateOfLastWatering);
            increasedDate.setDate(increasedDate.getDate() + interval);

            expect(itemWithDayOfLastActionOutOfDate.dateOfNextWatering).toEqual(increasedDate);
        })
    });

    describe('Actualize date of next watering (for all items of pour flower data)', function () {
        beforeEach(function () {
            initPourFlowerData();
            pourFlowerData = DateManipulationService.actualizeDateOfNextWatering(pourFlowerData);
        });

        it('should set date of next watering up to be equal ' +
            'date of last watering + interval', function () {
            var dateOfNextWateringStillActual = new Date(dateOfLastWateringStillActual);
            dateOfNextWateringStillActual.setDate(dateOfNextWateringStillActual.getDate() + interval);
            var dateOfNextWateringOutOfDate = new Date(dateOfLastWateringOutOfDate);
            dateOfNextWateringOutOfDate.setDate(dateOfNextWateringOutOfDate.getDate() + interval);

            expect(itemWithDayOfLastActionStillActual.dateOfNextWatering).toEqual(dateOfNextWateringStillActual);
            expect(itemWithDayOfLastActionOutOfDate.dateOfNextWatering).toEqual(dateOfNextWateringOutOfDate);
        });
    });
    
    describe('Set date of last watering', function () {
        beforeEach(initPourFlowerData);

        it('should set it up to current date', function () {
            var startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);
            var endOfToday = new Date();
            endOfToday.setHours(23, 59, 59, 999);

            DateManipulationService.setDateOfLastActionToCurrent(itemWithDayOfLastActionOutOfDate);
            expect(itemWithDayOfLastActionOutOfDate.dateOfLastWatering).toBeGreaterThan(startOfToday);
            expect(itemWithDayOfLastActionOutOfDate.dateOfLastWatering).toBeLessThan(endOfToday);
        });
    });
});