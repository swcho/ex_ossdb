
/// <reference path="../../../typings/angularjs/angular.d.ts" />

angular.module('meanTrialApp')
    .controller('LicenseCtrl', function ($scope, $http) {
        $http.get('/api/license').success(function(licenseList) {
            console.log(licenseList);
            $scope.licenseList = licenseList;
        });
    })
    .controller('LicenseDetailCtrl', function ($scope, $http, $routeParams) {
        $http.get('/api/license/' + $routeParams.id).success(function(license) {
            console.log(license);
            $scope.license = license;
        });
    });
