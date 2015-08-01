(function() {
  angular.module('pub.security.controllers', [])
    .controller('HomeController', HomeController)
    .controller('UserController', UserController);

  function HomeController($scope, $state, $http, $location, $mdToast, accountService, appConfig, authentication, pubProgressModal) {
    $scope.submitted = false;
    $scope.authSuccess = null;

    authentication.requestSecurityContext().then((securityContext) => {
      if (securityContext.authenticated) {
        $state.go('pub.documents.index');
      }
    });

    this.loginSubmit = () => {
      pubProgressModal.showProgressModal();

      authentication.login({
        name: $scope.username,
        password: $scope.password
      })
        .then(() => {
          $state.go('pub.documents.index');
        })
        .catch(() => {
          $scope.password = null;
          $mdToast.show($mdToast.simple()
            .content('Incorrect email address or password. Try again.')
            .hideDelay(2000)
            .highlightAction(false)
            .position('top right')
          );
        })
        .finally(() => {
          pubProgressModal.hideProgressModal();
        });
    };

    this.createAccount = () => {
      pubProgressModal.showProgressModal();

      accountService.createAccount()
        .success((user) => {
          authentication.login({
            name: user.name,
            password: 'password'
          })
            .then(() => {
              $state.go('pub.documents.index');
            })
            .catch((error) => {
              let message = error.message || 'An unknown error occurred.';

              $mdToast.show($mdToast.simple()
                .content(message)
                .hideDelay(2000)
                .highlightAction(false)
                .position('top right')
              );
            })
            .finally(() => {
              pubProgressModal.hideProgressModal();
            });
        });
    };
  }

  function UserController($mdDialog, $state, accountService, authentication, pubProgressModal) {
    this.updateUserAccount = (sender) => {
      pubProgressModal.showProgressModal();

      accountService.updateAccount(sender)
        .success(function(updatedUser) {
          pubProgressModal.hideProgressModal();

          authentication.requestSecurityContext().then((updatedSecurityContext) => {
            updatedSecurityContext.setAuthentication(updatedUser);
            $state.transitionTo('pub.documents.index');
          });

        })
        .error(function(error) {
          pubProgressModal.hideProgressModal();

          $mdDialog.show({
            clickOutsideToClose: true,
            template: `
              <md-dialog>
                <md-dialog-content>
                  <h2>Could not update user account.</h2>
                  <p>${error.message}</p>
                  <button class="btn frame" ng-click="okSelected()">OK</button>
                </md-dialog-content>
              </md-dialog>
            `,
            controller: ['$scope', function($dialogScope) {
              $dialogScope.okSelected = () => {
                $mdDialog.cancel();
              };
            }]
          });
        });
    };
  }
}());
