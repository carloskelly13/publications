(function() {
  'use strict';

  var pub = angular.module('pub.documents.controllers', []);
  
  pub.value('zoomLevels', [ 0.5, 1, 1.5, 2, 2.5, 3 ]);
  pub.value('objAnchors', { 
    size: 10, 
    points: [
      { coordinate: 'nw', x: 0, y: 0 },
      { coordinate: 'n', x: 0.5, y: 0 },
      { coordinate: 'ne', x: 1, y: 0 },
      { coordinate: 'w', x: 0, y: 0.5 },
      { coordinate: 'e', x: 1, y: 0.5 },
      { coordinate: 'sw', x: 0, y: 1 },
      { coordinate: 's', x: 0.5, y: 1 },
      { coordinate: 'se', x: 1, y: 1 }
    ]
  });

  pub.controller('DocumentsController', [
    '$scope',
    '$state',
    '$location',
    'documentServices',
    'authentication',
    'documents',
    'Restangular',
    function($scope, $state, $location, documentServices, authentication, documents, Restangular) {
      var documentsApi = Restangular.all('documents');
      $scope.updateAuthenticationStatus();
      $scope.documents = documents;
      $scope.dpi = 72;
      $scope.newDocumentWindowVisible = false;
      $scope.selectedDoc = null;
      
      $scope.docSelected = function(obj) {
        if (obj === $scope.selectedDoc && obj !== null) {
          $state.go('pub.documents.document.views', { documentId: $scope.selectedDoc._id });
          $scope.selectedDoc = null;
        } else {
          $scope.selectedDoc = obj; 
        }        
      };

      $scope.newDocument = function() {
        documentsApi.post({
          _user: $scope.user._id,
          name: $scope.name,
          width: $scope.width,
          height: $scope.height,
          shapes: []
        }).then(function(res) {
          $scope.newDocumentWindowVisible = false;
          $scope.documents.push(res);
        });
      };
      

      $scope.deleteDocument = function() {
        $scope.selectedDoc.remove();
        $scope.documents.splice(_.indexOf($scope.documents, $scope.selectedDoc), 1);
        $scope.selectedDoc = null;
      };
      
      $scope.newDocumentWindow = function() {
        $scope.newDocumentWindowVisible = !$scope.newDocumentWindowVisible;
      };
      
      $scope.documentIconSize = function(doc) {
        var iconDpi = 15,
          iconWidth = Math.max(Math.min(doc.width * iconDpi, 200), 30),
          iconHeight = (iconWidth / doc.width) * doc.height;
        return 'width: ' + iconWidth + 'px; height: ' + iconHeight + 'px';
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
      $scope.showCanvasGrid = true;
      $scope.snapToGrid = true;
      $scope.currentInspector = null;

      $scope.svgObjectSelected = function(obj) {
        $scope.selectedObj = obj;
      };
      
      $scope.updateDocument = function() {
        $scope.doc.put();
      };
      
      $scope.setZoomLevel = function(zoomLevel) {
        $scope.zoomLevel = zoomLevel;
        $scope.toggleInspector(null);
      };
      
      $scope.toggleCanvasGrid = function() {
        $scope.showCanvasGrid = !$scope.showCanvasGrid;
      };
      
      $scope.toggleSnapToGrid = function() {
        $scope.snapToGrid = !$scope.snapToGrid;
      };
      
      $scope.toggleInspector = function(inspector) {
        if (inspector === $scope.currentInspector) {
          $scope.currentInspector = null;
        } else {
          $scope.currentInspector = inspector;
        }
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
        $scope.toggleInspector(null);
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
    'objAnchors',
    function($scope, $state, documentServices, objAnchors) {
      $scope.objAnchors = objAnchors;
        
      $scope.xAxisRange = function() {
        return _.range($scope.doc.width / 0.25);
      };
      
      $scope.yAxisRange = function() {
        return _.range($scope.doc.height / 0.25);
      };
      
      $scope.unitDivider = function() {
        if ($scope.zoomLevel > 1) {
          return 0.5;
        } else {
          return 1;
        }
      }
    }
  ]);
}());