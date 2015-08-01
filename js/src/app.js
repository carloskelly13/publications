(function(){
  const appConstants = {
    apiUrl: 'http://api.publicationsapp.com'
  };

  angular.module('pub', ['ui.router', 'pub.controllers', 'pub.documents', 'pub.security', 'pub.directives', 'pub.services', 'ui.bootstrap', 'restangular', 'ngResource', 'ngMaterial', 'uuid4'])
    .constant('appConfig', appConstants)
    .config(pubConfiguration)
    .run(pubRun);

  function pubConfiguration($stateProvider, $urlRouterProvider, $windowProvider, appConfig, RestangularProvider) {
    $urlRouterProvider.otherwise('/documents/all');

    RestangularProvider
      .setBaseUrl(appConfig.apiUrl)
      .setRestangularFields({id: '_id'})
      .setDefaultHeaders({
        Authorization: `Bearer ${$windowProvider.$get().sessionStorage.getItem('access-token')}`,
        'Content-Type': 'application/json'
      });

    $stateProvider.state('pub', {
      url: '',
      controller: 'AppController',
      templateUrl: '/views/app.html',
      abstract: true
    });
  }

  function pubRun($state, $rootScope) {
    $rootScope.$on('$stateChangeError', () => $state.transitionTo('pub.home'));
  }
}());
