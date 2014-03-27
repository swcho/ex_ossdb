angular.module('meanTrialApp').controller('ProjectCtrl', function ($scope, $http) {
    $http.get('/api/project').success(function (projectList) {
        console.log(projectList);
        $scope.projectList = projectList;
    });
}).controller('ProjectDetailCtrl', function ($scope, $http, $routeParams) {
    $http.get('/api/project/' + $routeParams.id).success(function (project) {
        console.log(project);
        $scope.projectList = project;
    });
});
