//Contains Home View controller and directives
'use strict';

var homeView = angular.module('careApp.home', ['ngRoute']);

homeView.controller('HomePageCtrl', function($scope, $location, $window, $log) {
    $scope.pageName = "Home Page";

    $scope.openPage = function(pageName) {

        $log.debug("Page name", pageName);

        switch(pageName){

            case 'CALC':
                $window.location.href = 'https://github.intuit.com/pages/spatel10/roi-calculator-page/'
                break;

            case 'LACERTE':
                $location.path('/ptg/lacerte/support');
                break;

            case 'CONTACT':
                break;

            case 'ALERT':
                break;

            default:
                $location.path('/home');
        }
    }
});