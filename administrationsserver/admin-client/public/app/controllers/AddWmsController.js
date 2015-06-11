var app = angular.module("admin");

app.controller("AddWmsController", function($scope, $http, $routeParams, $location){

	$scope.url = $location.absUrl().split(":")[0] + ":" + $location.absUrl().split(":")[1] + ":3000/";

	//var id = $routeParams.id;
	var id = $scope.$parent.datasetInfo._id;

	$scope.WMSoptions = {
		"name": "",
		"url": "",
		"bbox": {"xmin":7.5967, "xmax":7.6465, "ymin":51.9418, "ymax":51.9708},
		"zoom": {
			"min": 12,
			"max": 14
		},
		"layer": "",
		"EPSG": 4326
	};

	//console.log(id);

	$scope.getLayerCapabilities = function(){
		$scope.capabilities = "";
		//getCapabilities:
		console.log(id);
		$http.get($scope.url + "WMS/" + id).success(function(response){
			$scope.capabilities = response;
			$scope.getLayerNames();
		});
	};

	$scope.getLayerNames = function(){
		$http.get($scope.url + "layers/" + id).success(function(response){
			$scope.layer = response;
			$scope.layers = new Array();
			if($scope.capabilities.WMS_Capabilities.Capability.Layer.Layer.length > 0){
				for (var i = 0; i < $scope.capabilities.WMS_Capabilities.Capability.Layer.Layer.length; i++) {
					var currentLayer = $scope.capabilities.WMS_Capabilities.Capability.Layer.Layer[i];
					$scope.layers.push({
						"titles":  currentLayer.Title,
						"names": currentLayer.Name
					});
				};
			}
			else {
				$scope.layers.push({
					"titles":  $scope.capabilities.WMS_Capabilities.Capability.Layer.Layer.Title,
					"names": $scope.capabilities.WMS_Capabilities.Capability.Layer.Layer.Name
				});
			}
			console.log($scope.layers.titles);
			console.log($scope.layer.info);
			
		});
	};

	$scope.addLayer = function(name){
		//addLayer(name, $scope.layer.url);
		$scope.WMSoptions.layer = name;
		$scope.WMSoptions.url = $scope.layer.url;
		$scope.WMSoptions.name = $scope.layer.name;
	};

	$scope.downloadWms = function(){
		/*$http.post("http://localhost:3000/WMS", $scope.WMSoptions)
			.success(function(response){
				console.log("WMS download erfolgreich");
			});
		*/
		console.log($scope.WMSoptions);
	};

	$scope.updateZoom = function(){
		map1.setZoom($scope.WMSoptions.zoom.min);
		map2.setZoom($scope.WMSoptions.zoom.max);
	};
	$scope.updateBbox = function(minmax){
		if (minmax == 'min') {
			if ($scope.WMSoptions.bbox.xmin > $scope.WMSoptions.bbox.xmax) {
				$scope.WMSoptions.bbox.xmax = $scope.WMSoptions.bbox.xmin;
			};
			if ($scope.WMSoptions.bbox.ymin > $scope.WMSoptions.bbox.ymax) {
				$scope.WMSoptions.bbox.ymax = $scope.WMSoptions.bbox.ymin;
			};
		};
		if (minmax == 'max') {
			if ($scope.WMSoptions.bbox.xmin > $scope.WMSoptions.bbox.xmax) {
				$scope.WMSoptions.bbox.xmin = $scope.WMSoptions.bbox.xmax;
			};
			if ($scope.WMSoptions.bbox.ymin > $scope.WMSoptions.bbox.ymax) {
				$scope.WMSoptions.bbox.ymin = $scope.WMSoptions.bbox.ymax;
			};
		};
		insertRectangle(
			$scope.WMSoptions.bbox.ymax,
			$scope.WMSoptions.bbox.xmax,
			$scope.WMSoptions.bbox.ymin,
			$scope.WMSoptions.bbox.xmin
			);
	};

});