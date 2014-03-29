angular.module('meanTrialApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
    'ngGrid',
    'ui.bootstrap'
]).config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider.when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
    }).when('/login', {
        templateUrl: 'partials/login',
        controller: 'LoginCtrl'
    }).when('/signup', {
        templateUrl: 'partials/signup',
        controller: 'SignupCtrl'
    }).when('/settings', {
        templateUrl: 'partials/settings',
        controller: 'SettingsCtrl',
        authenticate: true
    }).when('/oss', {
        templateUrl: 'partials/oss',
        controller: 'OssCtrl'
    }).when('/oss/:id', {
        templateUrl: 'partials/oss_detail',
        controller: 'OssDetailCtrl'
    }).when('/license', {
        templateUrl: 'partials/license',
        controller: 'LicenseCtrl'
    }).when('/license/:id', {
        templateUrl: 'partials/license_detail',
        controller: 'LicenseDetailCtrl'
    }).when('/package', {
        templateUrl: 'partials/package',
        controller: 'PackageCtrl'
    }).when('/package/:id', {
        templateUrl: 'partials/package_detail',
        controller: 'PackageDetailCtrl'
    }).when('/project', {
        templateUrl: 'partials/project',
        controller: 'ProjectCtrl'
    }).when('/project/:id', {
        templateUrl: 'partials/project_detail',
        controller: 'ProjectDetailCtrl'
    }).otherwise({
        redirectTo: '/'
    });

    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push([
        '$q', '$location', function ($q, $location) {
            return {
                'responseError': function (response) {
                    if (response.status === 401) {
                        $location.path('/login');
                        return $q.reject(response);
                    } else {
                        return $q.reject(response);
                    }
                }
            };
        }]);
}).run(function ($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function (event, next) {
        if (next.authenticate && !Auth.isLoggedIn()) {
            $location.path('/login');
        }
    });
});
