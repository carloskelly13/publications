(function(){
  'use strict';

  angular.module('pub', [
    'ui.router',
    'pub.controllers',
    'pub.documents',
    'pub.security',
    'pub.directives',
    'restangular',
    'ui.bootstrap',
    'ngResource',
    'ngMaterial'
  ])

  .constant('appConfig', {
    apiUrl: 'http://api.publicationsapp.com'
  })

  .config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    '$httpProvider',
    '$windowProvider',
    'RestangularProvider',
    'appConfig',
    function($stateProvider,
             $urlRouterProvider,
             $locationProvider,
             $httpProvider,
             $windowProvider,
             RestangularProvider,
             appConfig) {

      $urlRouterProvider.otherwise('/documents/all');

      RestangularProvider.setBaseUrl(appConfig.apiUrl);

      RestangularProvider.setDefaultHeaders({
        Authorization: 'Bearer ' + $windowProvider.$get().sessionStorage.getItem('access-token')
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

      $httpProvider.interceptors.push(function($q, $injector) {
        return {
          responseError: function(response) {
            if (response.status > 399) {
              $injector.get('$state').transitionTo('pub.home');
              return $q.reject(response);
            } else {
              $injector.get('$state').transitionTo('pub.documents.index');
              return $q.then(response);
            }
          }
        };
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
