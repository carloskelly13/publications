(function() {
  'use strict';

  angular.module('pub.security.controllers', [])

    .controller('HomeController', [
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
        })

        $scope.loginModalVisible = false;

        $scope.loginModal = function() {
          $scope.loginModalVisible = !$scope.loginModalVisible
        }
        
        $scope.createAccount = function() {
          console.log('hi')
          $http.post('/users', {}, null).success(function(user) {
            authentication.login({
              username: user.name,
              password: 'password'
            },
            function() {
              $state.go('pub.documents')
            })
          })
        }
      }
    ])

    .controller('LoginController', [
      '$scope',
      '$state',
      '$http',
      'authentication',
      function($scope, $state, $http, authentication) {
        $scope.submitted = false
        $scope.authSuccess = null

        $scope.submit = function() {
          authentication.login({
            username: $scope.username,
            password: $scope.password
          },
          function() {
            $state.go('pub.documents')
          },
          function(err) {
            $scope.password = null
            $scope.authSuccess = false
          })
        }
      }
    ])

    .controller('UserController', [
      '$scope',
      '$state',
      '$http',
      'securityContext',
      'authentication',
      function($scope, $state, $http, securityContext, authentication) {
        $scope.user = securityContext.user
        $scope.userErrorModalVisible = false
        $scope.currentUserTab = 'account'

        var clearUserForm = function() {
          $scope.userAccountForm.emailAddress = null
          $scope.userAccountForm.newPassword = null
          $scope.userAccountForm.confirmPassword = null

          $scope.changePasswordForm.newPassword = null
          $scope.changePasswordForm.currentPassword = null
          $scope.changePasswordForm.confirmPassword = null
        }

        $scope.toggleUserTab = function(newTab) {
          $scope.currentUserTab = newTab
        }

        $scope.viewDocuments = function() {
          $state.go('pub.documents')
        }

        $scope.closeUserErrorModal = function() {
          $scope.userErrorModalVisible = false
        }

        $scope.updateUserAccount = function(sender) {
          $scope.user.name = sender.emailAddress || $scope.user.name
          $scope.user.currentPassword = sender.currentPassword || 'password'
          $scope.user.password = sender.newPassword
          $scope.user.temporary = false

          $http.put('/users/' + $scope.user._id, $scope.user, null)
            .success(function(user) {
              authentication.requestSecurityContext().then(function(securityContext) {
                clearUserForm()
                securityContext.setAuthentication(user)
              })
            })
            .error(function(data, status, headers, config) {
              clearUserForm()
              $scope.userErrorModalVisible = true
            })
        }
      }
    ])
}());
