describe('LocalStorageService', function() {
    var sut, localStorage, localStorageValue, localStorageKey, KEY_POUR_FLOWER_DATA, pourFlowerData, storage;
    beforeEach(function() {
        module("common");

        localStorageKey = 'localStorageKey';
        localStorageValue = {someKey:'local storage value'};
    });

    beforeEach(inject(function(LocalStorageService, $window, _KEY_POUR_FLOWER_DATA_){
        sut = LocalStorageService;
        localStorage = $window.localStorage;
        KEY_POUR_FLOWER_DATA = _KEY_POUR_FLOWER_DATA_;
        pourFlowerData = 'POUR_FLOWER_DATA';

        storage = {};
        storage[localStorageKey] = localStorageValue;
        storage[KEY_POUR_FLOWER_DATA] = pourFlowerData;

        spyOn(localStorage, "getItem").andCallFake(function (key) {
            return JSON.stringify(storage[key]) || null;
        });
        spyOn(localStorage, "setItem");

        spyOn(sut, "setValue").andCallThrough();
        spyOn(sut, "getValue").andCallThrough();

        spyOn(sut, "getAppData").andCallThrough();
    }));

    describe('Get value', function() {
        it('should return value from local storage', function() {
            expect(sut.getValue(localStorageKey)).toEqual(localStorageValue);
        });
    });

    describe('Set data', function() {
        it('should set value to local storage', function() {
            sut.setValue(localStorageKey, localStorageValue);
            expect(localStorage.setItem).toHaveBeenCalledWith(localStorageKey, JSON.stringify(localStorageValue));
        });
    });

    describe('Get app data', function() {
        it('should return app data from local storage if it is stored', function() {
            expect(sut.getAppData(KEY_POUR_FLOWER_DATA)).toEqual(KEY_POUR_FLOWER_DATA);
        });

        it('should return app data from local storage if it is NOT stored', function() {
            storage[KEY_POUR_FLOWER_DATA] = undefined;
            expect(sut.getAppData()).toEqual([]);
        });
    });

    describe('Set app data', function() {
        it('should set app data from local storage', function() {
            sut.setAppData(localStorageValue);
            expect(localStorage.setItem).toHaveBeenCalledWith(KEY_POUR_FLOWER_DATA, JSON.stringify(localStorageValue));
        });
    });
});