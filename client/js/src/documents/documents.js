(function(){
  var pub = angular.module('pub.documents', [
    'pub.documents.controllers',
    'pub.documents.services',
    'pub.documents.directives'
  ]);

  pub.config([
    '$stateProvider',
    function($stateProvider, $stateParams) {
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
          .state('pub.documents.document', {
            url: '/:documentId',
            controller: 'DocumentController',
            abstract: true,
            templateUrl: '/views/documents/document.html',
            resolve: {
              document: [
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
                'document-toolbar' : {
                  controller: 'DocumentToolbarController',
                  templateUrl: '/views/documents/toolbar.html',
                },
                'document-canvas' : {
                  controller: 'DocumentCanvasController',
                  templateUrl: '/views/documents/canvas.html',
                }
              }
            });
    }
  ])
}());
