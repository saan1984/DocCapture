'use strict';
var documentModule= angular.module('careApp.service', [
	"ngResource"
]);

documentModule.factory('DocumentService',
	['$http', '$log','$q',function($http,  Log, $q) {
		return {
			saveDocument: function(documentId,conentImageArray ) {
				var deferred = $q.defer();
				$http({
					method: "POST",
					url: "/track1/saveDocument",
					body: {
						documentId: "doc1234",
						documentContent: conentImageArray
					}
				}).then(function(res){
					deferred.resolve(res);
				});
				return deferred.promise;
			}
		}
	}]);