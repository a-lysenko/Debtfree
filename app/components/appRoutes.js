angular.module('appPourFlower').config(['$routeProvider', '$locationProvider', function ($routeProvider/*, $locationProvider*/) {

    $routeProvider
        // home page
        .when('/', {
            templateUrl: 'components/main.html',
            controller: 'MainController'
        })

        .otherwise({
            redirectTo: '/'
        });

    //$locationProvider.html5Mode(true);
}]);
