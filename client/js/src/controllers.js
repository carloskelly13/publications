(function(){
  'use strict';

  var pub = angular.module('pub.controllers', []);

  pub.controller('AppController', [
    '$scope',
    '$location',
    'authentication',
    function($scope, $location, authentication) {

      $scope.updateAuthenticationStatus = function() {
        authentication.requestSecurityContext().then(function(securityContext) {
          $scope.authenticated = securityContext.authenticated;
          $scope.user = securityContext.user;
        });
      };

      $scope.aboutAppVisible = false;

      $scope.aboutApp = function() {
        $scope.aboutAppVisible = !$scope.aboutAppVisible;
      };

      $scope.logout = function() {
        $scope.updateAuthenticationStatus();

        authentication.logout(function() {
          $location.path('/login');
        },
        function(err) {
          console.log(err);
        });
      };
    }
  ]);

}());