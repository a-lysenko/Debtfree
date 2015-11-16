angular.module('common')
    .factory('LocalStorageService', function ($window, KEY_POUR_FLOWER_DATA) {
        var _localStorage = $window.localStorage;

        function getAppData() {
            return getValue(KEY_POUR_FLOWER_DATA) || [];
        }

        function setAppData(value) {
            setValue(KEY_POUR_FLOWER_DATA, value);
        }

        function getValue(key) {
            return JSON.parse(_localStorage.getItem(key));
        }

        function setValue(key, value) {
            _localStorage.setItem(key, JSON.stringify(value));
        }

        return {
            getValue: getValue,
            setValue: setValue,
            getAppData: getAppData,
            setAppData: setAppData
        }
    });
