(function() {
  'use strict';

  angular.module('pub.security', [
    'pub.security.controllers',
    'pub.security.authentication',
    'pub.security.context'
  ])

    .config([
      '$stateProvider',
      function($stateProvider) {
        $stateProvider
          .state('pub.home', {
            url: '/home',
            templateUrl: 'views/login/home.html',
            controller: 'HomeController'
          })

          .state('pub.login', {
            url: '/login',
            templateUrl: 'views/login/login.html',
            controller: 'LoginController'
          })

          .state('pub.user', {
            url: '/user',
            templateUrl: 'views/login/user.html',
            controller: 'UserController',
            resolve: {
              securityContext: [
                'authentication',
                function(authentication) {
                  return authentication.requestSecurityContext()
                }
              ]
            }
          })
      }
    ])
}());
