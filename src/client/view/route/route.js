var careAppRoute = angular.module('careApp.route', ['ngRoute']);

careAppRoute.config(['$routeProvider', function($routeProvider) {
    //Angular Routing for search, example, /ptg/lacerte/search
    $routeProvider.when('/track1/support', {
        templateUrl: '/support/page.html',
        controller: 'PageCtrl'
    });
    $routeProvider.when('/home', {
        templateUrl: '/home/page.html',
        controller: 'DetectionCtrl'
    });
   $routeProvider.otherwise({redirectTo: '/home'});
}]);