angular.module('meanTrialApp').controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [
        {
            'title': 'Home',
            'link': '/'
        }, {
            'title': 'OSS',
            'link': '/oss'
        }, {
            'title': 'License',
            'link': '/license'
        }, {
            'title': 'Package',
            'link': '/package'
        }, {
            'title': 'Project',
            'link': '/project'
        }, {
            'title': 'Settings',
            'link': '/settings'
        }];

    $scope.logout = function () {
        Auth.logout().then(function () {
            $location.path('/login');
        });
    };

    $scope.isActive = function (route) {
        return route === $location.path();
    };
});
