
/// <reference path="../../../typings/angularjs/angular.d.ts" />

angular.module('meanTrialApp')
    .controller('OssCtrl', function ($scope, $http) {
        $http.get('/api/oss').success(function(ossList) {
            console.log(ossList);
            $scope.ossList = ossList;
        });
    })
    .controller('OssDetailCtrl', function ($scope, $http, $routeParams) {
        $http.get('/api/oss/' + $routeParams.id).success(function(oss) {
            console.log(oss);
            $scope._name = oss.name;
            $scope._changed = false;
            $scope._nameChanged = function(value) {
                console.log(value);
                $scope._changed = oss.name != $scope._name;
            };
        });
    })
;
