/// <reference path="../../../typings/angularjs/angular.d.ts" />
angular.module('meanTrialApp').controller('OssCtrl', function ($scope, $http) {
    $scope.pageChanged = function (page) {
        console.log('pageChanged : ' + $scope.currentPage);
        getPage($scope.currentPage);
    };

    function getPage(aPageNo) {
        $http.get('/api/oss?page=' + aPageNo).success(function (resp) {
            console.log(resp);
            $scope.ossList = resp.itemList;

            $scope.totalItems = resp.totalCount;
            $scope.currentPage = resp.page;
        });
    }

    getPage(1);
}).controller('OssDetailCtrl', function ($scope, $http, $routeParams, $location) {
    $scope._changed = false;
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
    $http.get('/api/oss/' + $routeParams.id).success(function (oss) {
        console.log(oss);
        $http.get('/api/license').success(function (licenseList) {
            console.log(licenseList);
            $scope._oss = oss;
            $scope._name = oss.name;
            $scope._projectUrl = oss.projectUrl;
            $scope._licenseList = licenseList;
            $scope._gridOptions = {
                data: '_licenseList'
            };
            $scope.$apply();
            $scope._checkChanged = function () {
                console.log($scope._projectUrl);
                $scope._changed = $scope._name != oss.name || $scope._projectUrl != oss.projectUrl;
            };
            $scope._doUpsert = function () {
                $http.post('/api/oss/' + $routeParams.id, {
                    name: $scope._name,
                    projectUrl: $scope._projectUrl
                }).success(function () {
                    $location.path('/oss');
                });
            };
        });
    });
}).controller('OssNewCtrl', function ($scope, $http, $location) {
    $scope._name = '';
    $scope._projectUrl = '';
    $scope._changed = false;
    $scope._checkChanged = function () {
        if ($scope._name.length) {
            $scope._changed = true;
        }
    };
    $scope._doUpsert = function () {
        $http.post('/api/oss/new', {
            name: $scope._name,
            projectUrl: $scope._projectUrl
        }).success(function () {
            $location.path('/oss');
        });
    };
});
//# sourceMappingURL=app.ctrl.oss.js.map
