(function(){
  var pub = angular.module('pub.documents', [
    'pub.documents.controllers',
    'pub.documents.services',
    'pub.documents.directives'
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
                return Restangular.all('documents').getList();
              }
            ]
          }
        })
          .state('pub.documents.index', {
            url: '/all',
            controller: 'DocumentsIndexController',
            templateUrl: 'views/documents/list.html'
          })
        
          .state('pub.documents.document', {
            url: '/:documentId',
            controller: 'DocumentController',
            parent: 'pub.documents',
            abstract: true,
            templateUrl: '/views/documents/document.html',
            resolve: {
              doc: [
                'Restangular',
                '$stateParams',
                function(Restangular, $stateParams) {
                  return Restangular.one('documents', $stateParams.documentId).get();
                }
              ]
            }
          })
            .state('pub.documents.document.views', {
              url: '/view',
              views: {
                'document-canvas' : {
                  controller: 'DocumentCanvasController',
                  templateUrl: '/views/documents/canvas.html',
                }
              }
            });
    }
  ]);
}());
