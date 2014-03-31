angular.module('meanTrialApp').controller('LicenseCtrl', function ($scope, $http) {
    $http.get('/api/license').success(function (licenseList) {
        console.log(licenseList);
        $scope.licenseList = licenseList;
    });
}).controller('LicenseDetailCtrl', function ($scope, $http, $routeParams, $location) {
    $scope._changed = false;
    $http.get('/api/license/' + $routeParams.id).success(function (license) {
        console.log(license);
        $http.get('/api/oss/').success(function (ossList) {
            $scope._name = license.name;
            $scope._type = license.type;
            $scope._license = license;
            $scope._ossList = ossList;
            $scope._checkChanged = function () {
                console.log($scope._projectUrl);
                $scope._changed = $scope._name != license.name || $scope._type != license.type;
            };
            $scope._doUpsert = function () {
                $http.post('/api/license/' + $routeParams.id, {
                    name: $scope._name,
                    type: $scope._type
                }).success(function () {
                    $location.path('/license');
                });
            };
        });
    });
}).controller('LicenseNewCtrl', function ($scope, $http, $location) {
    $scope._name = '';
    $scope._type = '';
    $scope._changed = false;
    $scope._checkChanged = function () {
        if ($scope._name.length) {
            $scope._changed = true;
        }
    };
    $scope._doUpsert = function () {
        $http.post('/api/license/new', {
            name: $scope._name,
            type: $scope._type
        }).success(function () {
            $location.path('/license');
        });
    };
});
