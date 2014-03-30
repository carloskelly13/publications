(function(){
  'use strict';

  var pub = angular.module('pub.controllers', []);

  pub.controller('AppController', [
    '$scope',
    '$location',
    'authentication',
    function($scope, $location, authentication) {
      $scope.userModalVisible = false;

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

      $scope.userModal = function() {
        $scope.userModalVisible = !$scope.userModalVisible;
      };

      $scope.logout = function() {
        $scope.updateAuthenticationStatus();
        $scope.userModal();

        authentication.logout(function() {
          $location.path('/home');
        },
        function(err) {
          console.log(err);
        });
      };
    }
  ]);

}());