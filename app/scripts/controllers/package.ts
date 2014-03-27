
/// <reference path="../../../typings/angularjs/angular.d.ts" />

angular.module('meanTrialApp')
    .controller('PackageCtrl', function ($scope, $http) {
        $http.get('/api/package').success(function(packageList) {
            console.log(packageList);
            $scope.packageList = packageList;
        });
    })
    .controller('PackageDetailCtrl', function ($scope, $http, $routeParams) {
        $http.get('/api/package/' + $routeParams.id).success(function(package) {
            console.log(package);
            $scope._package = package;
            $http.get('/api/license').success(function(licenseList) {
                console.log(licenseList);
                console.log(licenseList);
                var id = package.licenseId;
                var i, len = licenseList.length, l;
                for (i=0; i<len; i++) {
                    l = licenseList[i];
                    if (l.id == id) {
                        $scope._license = licenseList;
                    }
                }
            });
        });
    });
