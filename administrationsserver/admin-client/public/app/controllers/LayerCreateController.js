var app = angular.module("admin");

app.controller("LayerCreateController", function($scope, $http, $location){

	$scope.layer = {};

	$scope.url = $location.absUrl().split(":")[0] + ":" + $location.absUrl().split(":")[1] + ":3000/layers";

    $scope.createLayer = function(){
    	console.log($scope.url);
        $http.post($scope.url, $scope.layer)
            .success(function(response){
            	$scope.addLayer(response);
                //$location.url("/layers")
            });
    }

    $scope.addLayer = function(response){
    	if($scope.layer.type == "WMS"){
			console.log("WMS hinzugefügt");
			var goTo = "/addWms/" + response._id;
			$location.url(goTo);
			//Capabilities abfragen
			//Layerliste anzeigen
			//Ausgewählten Layer hinzufügen
		} 
		else if($scope.layer.type == "CSV"){
			console.log("CSV hinzugefügt");
		} 
		else if($scope.layer.type == "GeoJSON"){
			console.log("GeoJSON hinzugefügt");
		} 
		else if($scope.layer.type == "Shapefile"){
			console.log("Shapefile hinzugefügt");
		}
		else {
			console.log("fehler!");
		}
    }

});