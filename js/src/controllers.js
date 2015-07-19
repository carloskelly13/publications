(function(){
  'use strict';

  angular.module('pub.controllers', [])
    .controller('AppController', AppController);
    
  function AppController($scope, $state, authentication) {
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

}());