(function() {
  'use strict';

  var pub = angular.module('pub.security', [
    'pub.security.controllers',
    'pub.security.authentication',
    'pub.security.context'
  ]);

  pub.config([
    '$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('pub.login', {
          url: '/login',
          templateUrl: 'views/login/login.html',
          controller: 'LoginController'
        });
    }
  ]);
}());