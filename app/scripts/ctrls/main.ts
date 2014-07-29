
/// <reference path="../../../typings/angularjs/angular.d.ts" />

angular.module('meanTrialApp')
    .controller('MainCtrl', function ($scope, $http) {
        $http.get('/api/awesomeThings').success((awesomeThings) => {
            console.log(awesomeThings);
            $scope.awesomeThings = awesomeThings;
        });

        $scope.sendSetProjectTest1 = () => {
            $http.post('/api/SetProjectWithPackages', {
                projectId: 'project_new',
                packageNames: [
                    'libcrypt-0.9.32.so',
                    'libgcc_s.so.1',
                    'libpthread-0.9.32.so',
                    'libsqlite3.so.0.8.6',
                    'libopenssl.1.0.2.so'
                ]
            })
                .success((resp) => {
                    console.log(resp);
                });
        }

        $scope.sendSetProjectTest2 = () => {
            $http.post('/api/SetProjectWithPackages', {
                projectId: 'project_new',
                packageNames: [
                    'libcrypt-0.9.32.so',
                    'libgcc_s.so.1',
                    'libpthread-0.9.32.so',
                    //'libsqlite3.so.0.8.6', // removed
                    'libopenssl.1.0.2.so',
                    'libuClibc-0.9.32.so' // added
                ]
            })
                .success((resp) => {
                    console.log(resp);
                });
        }
    });
