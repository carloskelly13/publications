(function(){
  'use strict';

  var pub = angular.module('pub.controllers', []);

  pub.controller('AppController', [
    '$scope',
    '$state',
    '$location',
    '$http',
    'authentication',
    function($scope, $state, $location, $http, authentication) {

      $scope.updateAuthenticationStatus = function() {
        authentication.requestSecurityContext().then(function(securityContext) {
          $scope.authenticated = securityContext.authenticated;
          $scope.user = securityContext.user;
        });
      };

      $scope.logout = function() {
        $scope.updateAuthenticationStatus();

        authentication.logout(function() {
          $state.go('pub.home')
        },
        function(err) {
          console.log(err);
        });
      };
    }
  ]);

}());
