(function(){
  'use strict';

  angular.module('pub', [
    'ui.router',
    'pub.controllers',
    'pub.documents',
    'pub.security',
    'pub.directives',
    'pub.services',
    'restangular',
    'ui.bootstrap',
    'ngResource',
    'ngMaterial',
    'uuid4'
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
        Authorization: 'Bearer ' + $windowProvider.$get().sessionStorage.getItem('access-token'),
        'Content-Type': 'application/json'
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
    }
  ])

  .run([
    '$state',
    '$rootScope',
    '$stateParams',
    function($state, $rootScope, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      $rootScope.$on('$stateChangeError', function() {
        $state.transitionTo('pub.home');
      });
    }
  ]);
}());
