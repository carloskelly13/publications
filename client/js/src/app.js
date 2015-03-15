(function(){
  'use strict';

  angular.module('pub', [
    'ui.router',
    'pub.controllers',
    'pub.documents',
    'pub.security',
    'pub.services',
    'pub.directives',
    'restangular',
    'ui.bootstrap',
    'ngMaterial'
  ])

  .config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    '$injector',
    '$httpProvider',
    'RestangularProvider',
    function($stateProvider,
             $urlRouterProvider,
             $locationProvider,
             $injector,
             $httpProvider,
             RestangularProvider) {
      
      $urlRouterProvider.otherwise('/documents/all');
      
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

      $httpProvider.interceptors.push(function($q, $location, $injector) {
        return {
          responseError: function(response) {
            if (response.status === 401 || response.status === 403) {
              $injector.get('$state').transitionTo('pub.home');
              return $q.reject(response);
            } else {
              $injector.get('$state').transitionTo('pub.documents.all');
              return $q.then(response);
            }
          }
        }
      });
    }
  ])

  .run([
    '$state',
    '$rootScope',
    '$stateParams',
    function($state, $rootScope, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  ]);
}());
