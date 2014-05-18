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
      
      $scope.updateUserAccount = function(sender) {
        $scope.user.name = sender.emailAddress || $scope.user.name;
        $scope.user.oldPassword = sender.currentPassword || 'password';
        $scope.user.newPassword = sender.newPassword;
        $scope.user.temporary = false;
        $scope.user.put().then(function(response) {
          if (!response.invalidPassword) {
            $scope.userModal();
            $scope.userModalFlip();
          }
        });
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