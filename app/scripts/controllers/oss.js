angular.module('meanTrialApp').controller('OssCtrl', function ($scope, $http) {
    $http.get('/api/oss').success(function (ossList) {
        console.log(ossList);
        $scope.ossList = ossList;
    });
}).controller('OssDetailCtrl', function ($scope, $http, $routeParams) {
    $http.get('/api/oss/' + $routeParams.id).success(function (oss) {
        console.log(oss);
        $scope._oss = oss;
        $scope._name = oss.name;
        $scope._home = oss.projectUrl;
        $scope._changed = false;
        $scope._nameChanged = function () {
            console.log($scope._name);
            $scope._changed = $scope._name != oss.name || $scope._home != oss.projectUrl;
        };
        $scope._homeChanged = function () {
            console.log($scope._home);
            $scope._changed = $scope._name != oss.name || $scope._home != oss.projectUrl;
        };
    });
    $http.get('/api/license').success(function (licenseList) {
        console.log(licenseList);
        $scope._licenseList = licenseList;
        $scope._gridOptions = {
            data: '_licenseList'
        };
        $scope.$apply();
    });
    $scope._gridOptions = {
        data: '_oss.packages',
        enableCellSelection: false,
        enableRowSelection: true,
        enableCellEditOnFocus: false,
        multiSelect: false,
        columnDefs: [
            { field: 'id', displayName: 'ID' },
            { field: 'name', displayName: 'Name' },
            { field: 'licenseId', displayName: 'License', cellTemplate: '{{_licenseList[licenseId]}}' }]
    };
});
