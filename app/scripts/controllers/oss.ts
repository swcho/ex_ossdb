
/// <reference path="../../../typings/angularjs/angular.d.ts" />

angular.module('meanTrialApp')
    .controller('OssCtrl', function ($scope, $http) {
        $http.get('/api/awesomeThings').success(function(awesomeThings) {
            console.log(awesomeThings)
            $scope.awesomeThings = awesomeThings;
            $scope.test = "This is test";
        });
    });
