
/// <reference path="../../../typings/angularjs/angular.d.ts" />

angular.module('meanTrialApp')
    .controller('PackageCtrl', function ($scope, $http) {
        $http.get('/api/package').success(function(packageList) {
            console.log(packageList)
            $scope.packageList = packageList;
        });
    });