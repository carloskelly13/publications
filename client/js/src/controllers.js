(function(){
  'use strict';

  var pub = angular.module('pub.controllers', []);

  pub.controller('AppController', [
    '$scope',
    '$location',
    'authentication',
    function($scope, $location, authentication) {
      $scope.userModalVisible = false;
      $scope.userModalBacksideVisible = false;

      $scope.updateAuthenticationStatus = function() {
        authentication.requestSecurityContext().then(function(securityContext) {
          $scope.authenticated = securityContext.authenticated;
          $scope.user = securityContext.user;
        });
      };

      $scope.aboutModalVisible = false;

      $scope.aboutModal = function() {
        $scope.aboutModalVisible = !$scope.aboutModalVisible;
      };
      
      $scope.userModalFlip = function() {
        $scope.userModalBacksideVisible = !$scope.userModalBacksideVisible;
      }

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