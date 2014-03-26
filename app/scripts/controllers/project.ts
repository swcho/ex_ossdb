
/// <reference path="../../../typings/angularjs/angular.d.ts" />

angular.module('meanTrialApp')
    .controller('ProjectCtrl', function ($scope, $http) {
        $http.get('/api/project').success(function(projectList) {
            console.log(projectList);
            $scope.projectList = projectList;
        });
    });
