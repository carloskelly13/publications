(function() {
  'use strict';

  var pub = angular.module('pub.security.controllers', []);

  pub.controller('LoginController', [
    '$scope',
    '$state',
    '$location',
    'Restangular',
    'authentication',
    function($scope, $state, $location, Restangular, authentication) {

      authentication.requestSecurityContext().then(function(securityContext) {
        if (securityContext.authenticated) {
          $state.go('pub.documents');
        }
      });

      $scope.testDrive = function() {
        $scope.username = 'carlos13@icloud.com';
        $scope.password = 'carlos';
        $scope.login();
      };

      $scope.login = function() {

        authentication.login({
          username: $scope.username,
          password: $scope.password
        },
        function(res) {
          $state.go('pub.documents');
        },
        function(err) {
          console.log(err);
        });
      };
    }
  ]);
}());