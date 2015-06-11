var app = angular.module("admin");

app.controller("LayerEditController", function($scope, $http, $location, $routeParams){
	$scope.layer = {};
	var id = $routeParams.id;

	$scope.url = $location.absUrl().split(":")[0] + ":" + $location.absUrl().split(":")[1] + ":3000/layers";

	$http.get($scope.url + "/" + id).success(function(response){
		$scope.layer = response;
	});

	$scope.updateLayer = function(){
		$http.put($scope.url + "/" + $scope.layer._id, $scope.layer)
		.success(function(response){ $location.url("/layers")});
	};

	$scope.deleteLayer = function(){
		$http.delete($scope.url + '/' + $scope.layer._id)
		.success(function(response){ $location.url("/layers")});
	};
});