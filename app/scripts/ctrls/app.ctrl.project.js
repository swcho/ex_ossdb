angular.module('meanTrialApp').controller('ProjectCtrl', function ($scope, $http) {
    $scope.pageChanged = function (page) {
        console.log('pageChanged : ' + $scope.currentPage);
        getPage($scope.currentPage);
    };

    function getPage(aPageNo) {
        $http.get('/api/project?page=' + aPageNo).success(function (resp) {
            console.log(resp);
            $scope.projectList = resp.itemList;

            $scope.totalItems = resp.totalCount;
            $scope.currentPage = resp.page;
        });
    }

    getPage(1);
}).controller('ProjectDetailCtrl', function ($scope, $http, $routeParams) {
    $http.get('/api/project/' + $routeParams.id).success(function (project) {
        console.log(project);
        $http.get('/api/license').success(function (licenseList) {
            console.log(licenseList);
            $scope._project = project;
            $scope._licenseList = licenseList;
        });
    });
}).controller('ProjectNewCtrl', function ($scope, $http, $location) {
});
