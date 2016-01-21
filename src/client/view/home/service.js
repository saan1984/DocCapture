'use strict';
var documentModule= angular.module('careApp.service', [
	"ngResource"
]);

documentModule.factory('DocumentService',
	['$http', '$log','$q',function($http,  Log, $q) {
		return {
			saveDocument: function(documentId,conentImageArray ) {
				var deferred = $q.defer();
				var dataContent = {
					"documentId":documentId,
					"conentImageArray":conentImageArray
				};
				$http.post("/track1/saveDocument", dataContent).success(function(response) {
					deferred.resolve(response);
				});
				return deferred.promise;
			}
		}
	}]);