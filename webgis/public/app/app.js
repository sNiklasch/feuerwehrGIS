var app = angular.module("fgis", ["ngRoute"]);

app.config(function($routeProvider){
	$routeProvider
		.when("/map", {
			templateUrl: "app/templates/fgis/map.html",
			controller: "MapController"
		})
		.otherwise({redirectTo: "/map"});
});