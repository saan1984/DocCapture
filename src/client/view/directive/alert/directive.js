'use strict';

var alertDirectives = angular.module('careApp.alert.directives', []);

alertDirectives.directive("careAlert", function() {
    return {
        scope: {
            //For Alert document ID is: ,WEB12462:INQUIRA
            locale: '@docLocale',
            raw: '=docRaw',
            pretty: '=docPretty',
            transformlinks: '@docTransformlinks',
            productName: '@',
            productVersion: '@'
        },
        restrict: 'E',
        replace: 'false',
        templateUrl: '/directive/alert/template.html',
        controller: ['$scope', "AlertService", '$log', '$timeout','ErrorService',
            function($scope, AlertService, Log, $timeout,  ErrorService) {
                $scope.alertContent = null;
                $scope.isAlertLoaded = false;
                $scope.document = {
                    locale: $scope.locale,
                    raw: $scope.raw,
                    pretty: $scope.pretty,
                    transformlinks: $scope.transformlinks,
                    productName: $scope.productName,
                    productVersion: $scope.productVersion
                };
                $timeout(function() {
                    var alertRequest= AlertService.requestAlert($scope.document);
                    alertRequest.then(function(response) {
                        Log.info("Alert Response arrived...");
                        $scope.alertContent = response.data;
                        $scope.isAlertLoaded = true;
                        if($scope.alertContent.error){
                            ErrorService.requestErrorDisplay("Error in Alert module.");
                        }
                    });
                },0);
            }]
        };
    });