(function() {
  'use strict';

  var pub = angular.module('pub.documents.controllers', []);
  
  pub.value('zoomLevels', [0.5, 1, 1.5, 2, 2.5, 3]);

  pub.controller('DocumentsController', [
    '$scope',
    '$location',
    'documentServices',
    'authentication',
    'documents',
    'Restangular',
    function($scope, $location, documentServices, authentication, documents, Restangular) {
      var documentsApi = Restangular.all('documents');
      $scope.updateAuthenticationStatus();
      $scope.documents = documents;
      $scope.dpi = 72;

      $scope.newDocument = function() {
        documentsApi.post(documentServices.newDocument($scope.user)).then(function(res) {
          $scope.documents.push(res);
        });
      };

      $scope.deleteDocument = function(doc) {
        doc.remove();
        $scope.documents.splice(_.indexOf($scope.documents, doc), 1);
      };

    }
  ]);

  pub.controller('DocumentController', [
    '$scope',
    '$state',
    'documentServices',
    'document',
    function($scope, $state, documentServices, document) {
      $scope.zoomLevel = 1;
      $scope.doc = document;
      $scope.selectedObj = null;

      $scope.svgObjectSelected = function(obj) {
        $scope.selectedObj = obj;
      };
      
      $scope.updateDocument = function() {
        $scope.doc.put();
      };
      
      $scope.setZoomLevel = function(zoomLevel) {
        $scope.zoomLevel = zoomLevel;
      };
    }
  ]);
  
  pub.controller('DocumentToolbarController', [
    '$scope',
    '$state',
    'documentServices',
    'zoomLevels',
    function($scope, $state, documentServices, zoomLevels) {
      $scope.zoomLevels = zoomLevels;
      
      $scope.addObject = function(objType) {
        $scope.doc.shapes.push(documentServices.newShape(objType));
      };

      $scope.showAllDocuments = function() {
        $state.go('pub.documents');
      };
    }
  ]);
  
  pub.controller('DocumentCanvasController', [
    '$scope',
    '$state',
    'documentServices',
    function($scope, $state, documentServices) {
      
      $scope.xAxisRange = function() {
        return _.range($scope.doc.width / 0.25);
      };
      
      $scope.yAxisRange = function() {
        return _.range($scope.doc.height / 0.25);
      };
    }
  ]);
}());