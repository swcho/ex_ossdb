angular.module('meanTrialApp').controller('LicenseCtrl', function ($scope, $http) {
    $http.get('/api/license').success(function (licenseList) {
        console.log(licenseList);
        $scope.licenseList = licenseList;
    });
}).controller('LicenseDetailCtrl', function ($scope, $http, $routeParams) {
    $http.get('/api/license/' + $routeParams.id).success(function (license) {
        console.log(license);
        $scope._name = license.name;
        $scope._type = license.type;
        $scope._license = license;
    });
    $http.get('/api/oss/').success(function (ossList) {
        $scope._ossList = ossList;
    });
});
