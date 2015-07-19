(function(){
  'use strict';

  angular.module('pub.documents', ['pub.documents.controllers', 'pub.documents.services', 'pub.documents.directives'])
    .config(pubDocumentsConfig);

  function pubDocumentsConfig($stateProvider) {
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
          controllerAs: 'controller',
          templateUrl: 'views/documents/index.html'
        })

        .state('pub.documents.document', {
          url: '/:documentId',
          controller: 'DocumentController',
          controllerAs: 'documentController',
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
          .state('pub.documents.document.view', {
            url: '/view',
            views: {
              'document-canvas': {
                controller: 'DocumentCanvasController',
                controllerAs: 'documentCanvasController',
                templateUrl: '/views/documents/canvas.html'
              }
            }
          });
    }
}());
