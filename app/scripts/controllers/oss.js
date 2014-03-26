/// <reference path="../../../typings/angularjs/angular.d.ts" />
angular.module('meanTrialApp').controller('OssCtrl', function ($scope, $http) {
    $http.get('/api/oss').success(function (ossList) {
        console.log(ossList);
        $scope.ossList = ossList;
    });
});
//# sourceMappingURL=oss.js.map
