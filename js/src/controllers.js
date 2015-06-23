(function(){
  'use strict';

  var pub = angular.module('pub.controllers', []);

  pub.controller('AppController', [
    '$scope',
    '$state',
    '$location',
    '$resource',
    '$http',
    'authentication',
    function($scope, $state, $location, $http, $resource, authentication) {
      $scope.updateAuthenticationStatus = function() {
        authentication.requestSecurityContext().then(function(securityContext) {
          $scope.authenticated = securityContext.authenticated;
          $scope.user = securityContext.user;
        });
      };

      $scope.logout = function() {
        $scope.user = null;
        $scope.authenticated = false;
        $state.go('pub.home');
        authentication.logout();
      };
    }
  ]);

}());
