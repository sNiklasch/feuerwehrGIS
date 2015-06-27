var app = angular.module("admin", ["ngRoute", "jsonFormatter"]);

app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

app.config(function($routeProvider){
	$routeProvider
		.when("/layers", {
			templateUrl: "/app/templates/admin/layerlist.html",
			controller: "LayerListController"
		})
		.when("/layers/:id/edit", {
			templateUrl: "/app/templates/admin/editLayer.html",
			controller: "LayerEditController"
		})
		.when("/datasets/new", {
			templateUrl: "/app/templates/admin/newDataset.html",
			controller: "NewDatasetController"
		})
		.otherwise({redirectTo: '/layers'});
});

