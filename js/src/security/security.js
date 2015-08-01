(function() {
  angular.module('pub.security', ['pub.security.controllers', 'pub.security.authentication', 'pub.security.context', 'pub.security.services'])
    .config(pubSecurityConfig);

  function pubSecurityConfig($stateProvider) {
    $stateProvider
      .state('pub.home', {
        url: '/home',
        templateUrl: 'views/login/home.html',
        controller: 'HomeController',
        controllerAs: 'homeController'
      })

      .state('pub.user', {
        url: '/user',
        templateUrl: 'views/login/user.html',
        controller: 'UserController',
        controllerAs: 'userController',
        resolve: {
          securityContext: (authentication) => {
            return authentication.requestSecurityContext();
          }
        }
      });
  }

}());
