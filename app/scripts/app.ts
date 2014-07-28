
/// <reference path="../../typings/angularjs/angular.d.ts" />

angular.module('meanTrialApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ngAnimate',
        'ngGrid',
        'ui.bootstrap'
    ])
    .config(function ($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/main',
                controller: 'MainCtrl'
            })
            .when('/login', {
                templateUrl: 'partials/login',
                controller: 'LoginCtrl'
            })
            .when('/signup', {
                templateUrl: 'partials/signup',
                controller: 'SignupCtrl'
            })
            .when('/settings', {
                templateUrl: 'partials/settings',
                controller: 'SettingsCtrl',
                authenticate: true
            })
            .when('/oss', {
                templateUrl: 'partials/oss',
                controller: 'OssCtrl'
//                authenticate: true
            })
            .when('/oss/new', {
                templateUrl: 'partials/oss_detail',
                controller: 'OssNewCtrl'
//                authenticate: true
            })
            .when('/oss/:id', {
                templateUrl: 'partials/oss_detail',
                controller: 'OssDetailCtrl'
//                authenticate: true
            })
            .when('/license', {
                templateUrl: 'partials/license',
                controller: 'LicenseCtrl'
//                authenticate: true
            })
            .when('/license/new', {
                templateUrl: 'partials/license_detail',
                controller: 'LicenseNewCtrl'
//                authenticate: true
            })
            .when('/license/:id', {
                templateUrl: 'partials/license_detail',
                controller: 'LicenseDetailCtrl'
//                authenticate: true
            })
            .when('/package', {
                templateUrl: 'partials/package',
                controller: 'PackageCtrl'
//                authenticate: true
            })
            .when('/package/new', {
                templateUrl: 'partials/package_detail',
                controller: 'PackageNewCtrl'
//                authenticate: true
            })
            .when('/package/:id', {
                templateUrl: 'partials/package_detail',
                controller: 'PackageDetailCtrl'
//                authenticate: true
            })
            .when('/project', {
                templateUrl: 'partials/project',
                controller: 'ProjectCtrl'
//                authenticate: true
            })
            .when('/project/new', {
                templateUrl: 'partials/project_detail',
                controller: 'ProjectNewCtrl'
//                authenticate: true
            })
            .when('/project/:id', {
                templateUrl: 'partials/project_detail',
                controller: 'ProjectDetailCtrl'
//                authenticate: true
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);

        // Intercept 401s and redirect you to login
        $httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
            return {
                'responseError': function (response) {
                    if (response.status === 401) {
                        $location.path('/login');
                        return $q.reject(response);
                    }
                    else {
                        return $q.reject(response);
                    }
                }
            };
        }]);
    })
    .run(function ($rootScope, $location, Auth) {

        // Redirect to login if route requires auth and you're not logged in
        $rootScope.$on('$routeChangeStart', function (event, next) {

            if (next.authenticate && !Auth.isLoggedIn()) {
                $location.path('/login');
            }
        });
    });