(function() {
  'use strict';

  angular.module('pub.security.controllers', [])

    .controller('HomeController', [
      '$scope',
      '$state',
      '$http',
      '$location',
      '$mdToast',
      'pub.progressModal',
      'Restangular',
      'appConfig',
      'authentication',
      'uuid4',
      function($scope, $state, $http, $location, $mdToast, progressModal, Restangular, appConfig, authentication, uuid4) {
        $scope.submitted = false;
        $scope.authSuccess = null;

        authentication.requestSecurityContext().then(function(securityContext) {
          if (securityContext.authenticated) {
            $state.go('pub.documents.index');
          }
        });

        $scope.submit = function($event) {
          progressModal.showProgressModal($event);

          authentication.login({
            name: $scope.username,
            password: $scope.password
          },
          function onSuccess() {
            progressModal.hideProgressModal();
            $state.go('pub.documents.index');
          },
          function onError() {
            progressModal.hideProgressModal();
            $scope.password = null;

            $mdToast.show($mdToast.simple()
              .content('Incorrect email address or password. Try again.')
              .hideDelay(2000)
              .highlightAction(false)
              .position('top right')
            );
          });
        };

        $scope.createAccount = function($event) {
          progressModal.showProgressModal($event);

          var request = {
            method: 'POST',
            url: appConfig.apiUrl + '/users',
            data: {
              name: uuid4.generate() + '@publicationsapp.com',
              password: 'password',
              temporary: true
            }
          };

          $http(request).success(function(user) {
            console.log(user);
            authentication.login({
                name: user.name,
                password: 'password'
              },
              function onSuccess() {
                progressModal.hideProgressModal();
                $state.go('pub.documents.index');
              },
              function onError() {
                progressModal.hideProgressModal();
                console.log('Could not log in with new temporary user.');
              }
            );
          });
        };
      }
    ])

    .controller('UserController', [
      '$scope',
      '$state',
      '$mdDialog',
      '$http',
      'pub.progressModal',
      'appConfig',
      'securityContext',
      'authentication',
      function($scope, $state, $mdDialog, $http, progressModal, appConfig, securityContext, authentication) {
        $scope.user = securityContext.user;
        $scope.userErrorModalVisible = false;
        $scope.currentUserTab = 'account';

        $scope.toggleUserTab = function(newTab) {
          $scope.currentUserTab = newTab;
        };

        $scope.viewDocuments = function() {
          $state.go('pub.documents.index');
        };

        $scope.closeUserErrorModal = function() {
          $scope.userErrorModalVisible = false;
        };

        $scope.updateUserAccount = function(sender, $event) {
          progressModal.showProgressModal($event);

          var request = {
            method: 'PATCH',
            url: appConfig.apiUrl + '/users',
            headers: {
              'Authorization': 'Bearer ' + securityContext.token()
            },
            data: {
              name: sender.emailAddress || $scope.user.name,
              currentPassword: sender.currentPassword || 'password',
              password: sender.newPassword,
              temporary: false
            }
          };

          $http(request).success(function(updatedUser) {
            progressModal.hideProgressModal();

            authentication.requestSecurityContext().then(function(updatedSecurityContext) {
              updatedSecurityContext.setAuthentication(updatedUser);
              $state.transitionTo('pub.documents.index');
            });

          }).error(function(error) {
            progressModal.hideProgressModal();

            $mdDialog.show({
              clickOutsideToClose: true,
              locals: {
                errorMessage: error.message || ''
              },
              template: '<md-dialog>' +
                        ' <md-dialog-content>' +
                        '   <h2>Could not update user account.</h2>' +
                        '   <p>{{errorMessage}}</p>' +
                        '   <button class="btn frame" ng-click="okSelected()">OK</button>' +
                        ' </md-dialog-content>' +
                        '</md-dialog>',
              controller: [
                '$scope',
                'errorMessage',
                function SaveDialogController($dialogScope, errorMessage) {
                  $dialogScope.errorMessage = errorMessage;

                  $dialogScope.okSelected = function() {
                    $mdDialog.cancel();
                  };
                }
              ]
            });
          });
        };
      }
    ]);
}());
