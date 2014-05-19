(function() {
  'use strict';

  var pub = angular.module('pub.security.controllers', []);

  pub.controller('LoginController', [
    '$scope',
    '$state',
    '$http',
    '$location',
    'Restangular',
    'authentication',
    function($scope, $state, $http, $location, Restangular, authentication) {

      authentication.requestSecurityContext().then(function(securityContext) {
        if (securityContext.authenticated) {
          $state.go('pub.documents');
        }
      });

      $scope.loginModalVisible = false;

      $scope.loginModal = function() {
        $scope.loginModalVisible = !$scope.loginModalVisible;
      };
      
      $scope.createAccount = function() {
        $http.post('/users', {}, null).success(function(user) {
          authentication.login({
            username: user.name,
            password: 'password'
          },
          function() {
            $state.go('pub.documents');
          });
        });
      }

      $scope.login = function() {
        authentication.login({
          username: $scope.username,
          password: $scope.password
        },
        function() {
          $state.go('pub.documents');
        },
        function(err) {
          console.log(err);
        });
      };
    }
  ]);
}());