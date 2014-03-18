(function(){
  'use strict';

  var pub = angular.module('pub', [
    'ui.router',
    'pub.controllers',
    'pub.documents',
    'pub.security',
    'pub.services',
    'pub.directives',
    'restangular'
  ]);

  pub.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    '$httpProvider',
    'RestangularProvider',
    'authenticationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, RestangularProvider, authenticationProvider) {
      $urlRouterProvider.otherwise('/documents');

      RestangularProvider.addElementTransformer('users', true, function(user) {
        user.addRestangularMethod('current', 'get', 'current');
        return user;
      });

      RestangularProvider.setRestangularFields({
        id: '_id'
      });

      $stateProvider
        .state('pub', {
          url: '',
          controller: 'AppController',
          templateUrl: '/views/app.html',
          abstract: true
        });

      $httpProvider.interceptors.push(function($q, $location) {
        return {
          responseError: function(response) {
            if (response.status === 401 || response.status === 403) {
              $location.path('/login');
              return $q.reject(response);
            } else {
              return $q.reject(response);
            }
          }
        }
      });
    }
  ]);

  pub.run([
    '$state',
    '$rootScope',
    '$stateParams',
    function($state, $rootScope, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  ]);
}());