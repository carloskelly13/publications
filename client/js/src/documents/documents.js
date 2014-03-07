(function(){
  var pub = angular.module('pub.documents', [
    'pub.documents.controllers',
    'pub.documents.services'
  ]);

  pub.config([
    '$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('pub.documents', {
          url: '/documents',
          controller: 'DocumentsController',
          templateUrl: '/views/documents/documents.html',
          resolve: {
            documents: [
              'Restangular',
              function(Restangular) {
                return Restangular.all('documents');
              }
            ]
          }
        });
    }
  ])
}());
