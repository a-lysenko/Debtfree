angular.module('dateManipulation')
    .factory('DateManipulationService', function () {

        function getIncreasedDate(initialDate, incrementDays) {
            var increasedDate = new Date(initialDate);
            increasedDate.setDate(increasedDate.getDate() + incrementDays);
            return increasedDate;
        }

        function actualizeItemDateOfNextWatering(pourFlowerItem) {
            pourFlowerItem.dateOfNextWatering = getIncreasedDate(pourFlowerItem.dateOfLastWatering, pourFlowerItem.interval);

            return pourFlowerItem; // not necessary
        }

        function actualizeDateOfNextWatering(pourFlowerData) {
            pourFlowerData.forEach(function (item) {
                actualizeItemDateOfNextWatering(item);
            });

            return pourFlowerData; // not necessary
        }

        function setDateOfLastActionToCurrent(pourFlowerItem) {
            pourFlowerItem.dateOfLastWatering = new Date();
        }

        return {
            getIncreasedDate: getIncreasedDate,
            actualizeItemDateOfNextWatering: actualizeItemDateOfNextWatering,
            actualizeDateOfNextWatering: actualizeDateOfNextWatering,
            setDateOfLastActionToCurrent: setDateOfLastActionToCurrent
        }
    });