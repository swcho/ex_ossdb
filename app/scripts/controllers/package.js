/// <reference path="../../../typings/angularjs/angular.d.ts" />
angular.module('meanTrialApp').controller('PackageCtrl', function ($scope, $http) {
    $http.get('/api/package').success(function (packageList) {
        console.log(packageList);
        $scope.packageList = packageList;
    });
}).controller('PackageDetailCtrl', function ($scope, $http, $routeParams, $location) {
    $http.get('/api/package/' + $routeParams.id).success(function (pkg) {
        $http.get('/api/oss').success(function (ossList) {
            $http.get('/api/license').success(function (licenseList) {
                $scope._package = pkg;
                $scope._name = pkg.name;
                console.log(pkg);
                var ossId = pkg.ossId;
                console.log(ossList);
                var licenseId = pkg.licenseId;
                var i, len = ossList.length, o;
                for (i = 0; i < len; i++) {
                    o = ossList[i];
                    if (o.id == ossId) {
                        console.log(o);
                        $scope._selectedOss = o;
                        break;
                    }
                }
                console.log(licenseList);
                var i, len = licenseList.length, l;
                for (i = 0; i < len; i++) {
                    l = licenseList[i];
                    if (l.id == licenseId) {
                        console.log(l);
                        $scope._selectedLicense = l;
                        break;
                    }
                }
                $scope._ossList = ossList;
                $scope._licenseList = licenseList;
                $scope._changed = false;
                $scope._checkChanged = function () {
                    console.log('_checkChanged');
                    $scope._changed = o != $scope._selectedOss || l != $scope._selectedLicense || pkg.name != $scope._name;
                };
                $scope._doUpsert = function () {
                    $http.post('/api/package/' + $routeParams.id, {
                        name: $scope._name,
                        ossId: $scope._selectedOss.id,
                        licenseId: $scope._selectedLicense.id
                    }).success(function () {
                        $location.path('/package');
                    });
                };
            });
        });
    });
}).controller('PackageNewCtrl', function ($scope, $http, $location) {
});
//# sourceMappingURL=package.js.map
