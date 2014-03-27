/// <reference path="../../../typings/angularjs/angular.d.ts" />
angular.module('meanTrialApp').controller('PackageCtrl', function ($scope, $http) {
    $http.get('/api/package').success(function (packageList) {
        console.log(packageList);
        $scope.packageList = packageList;
    });
}).controller('PackageDetailCtrl', function ($scope, $http, $routeParams) {
    $http.get('/api/package/' + $routeParams.id).success(function (package) {
        console.log(package);
        $scope.packageList = package;
    });
});
//# sourceMappingURL=package.js.map
