var app = angular.module("admin");

app.controller("LayerListController", function($scope, $http, $sce, $location){

    $scope.url = $location.absUrl().split(":")[0] + ":" + $location.absUrl().split(":")[1] + ":3000/layers";

	$http.get($scope.url).success(function(response){
        $scope.layers = response;
    }).error(function(err) {
        $scope.error = err;
    });

    $scope.boolIcon = function(bool){
        if(bool){
            return $sce.trustAsHtml('<span class="glyphicon glyphicon-ok-sign"></span>');
        }
        else {
            return $sce.trustAsHtml('<span class="glyphicon glyphicon-remove-sign"></span>');
        }
    }
/*
    $scope.privateKm = function(fahrt){
        if(fahrt.privat){
            return fahrt.kmEnde - fahrt.kmStart;
        }
        return 0;
    };

    $scope.geschaeftlicheKm = function(fahrt){
        if(fahrt.privat){
            return 0;
        }
        return fahrt.kmEnde - fahrt.kmStart;
    };

    $scope.deleteFahrt = function(fahrt){
        $http.delete("http://localhost:3000/fahrten/" + fahrt._id)
            .success(function(response){
                 $scope.fahrten.pop(fahrt);
            });
    };
*/
});