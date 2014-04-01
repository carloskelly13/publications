(function() {
  'use strict';

  var pub = angular.module('pub.documents.controllers', []);

  pub.value('zoomLevels', [ 0.5, 1, 1.5, 2, 2.5, 3 ]);
  pub.value('fonts', [{ name: 'Georgia' }, { name: 'Helvetica Neue' }]);
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
      $scope.newDocumentModalVisible = false;

      $scope.newDocument = function() {
        documentsApi.post({
          _user: $scope.user._id,
          name: $scope.name,
          width: $scope.width,
          height: $scope.height,
          shapes: []
        }).then(function(res) {
          $scope.newDocumentModal();
          $scope.documents.push(res);
        });
      };

      $scope.newDocumentModal = function() {
        $scope.newDocumentModalVisible = !$scope.newDocumentModalVisible;
        $scope.name = null;
        $scope.width = null;
        $scope.height = null;
      };

      $scope.documentIconSize = function(doc) {
        var iconDpi = 15,
          iconWidth = Math.max(Math.min(doc.width * iconDpi, 200), 30),
          iconHeight = (iconWidth / doc.width) * doc.height;
        return { width: iconWidth + 'px', height: iconHeight + 'px' };
      };

    }
  ]);

  pub.controller('DocumentController', [
    '$scope',
    '$state',
    'documentServices',
    'doc',
    function($scope, $state, documentServices, doc) {
      $scope.zoomLevel = 1;
      $scope.doc = doc;
      $scope.selectedObj = null;
      $scope.showCanvasGrid = true;
      $scope.snapToGrid = true;
      $scope.currentInspector = null;
      $scope.saveModalVisible = false;
      $scope.clipboard = null;
      $scope.deleteModalVisible = false;

      $scope.svgObjectSelected = function(obj) {
        $scope.selectedObj = obj;
      };

      $scope.cutObj = function() {
        $scope.clipboard = angular.copy($scope.selectedObj);
        var objIdx = $scope.doc.shapes.indexOf($scope.selectedObj);
        $scope.doc.shapes.splice(objIdx, 1);
        $scope.selectedObj = null;
      };

      $scope.copyObj = function() {
        $scope.clipboard = angular.copy($scope.selectedObj);
      };

      $scope.pasteObj = function() {
        var duplicateObj = angular.copy($scope.clipboard);
        duplicateObj._id = undefined;
        duplicateObj.x += 0.25;
        duplicateObj.y += 0.25;
        $scope.doc.shapes.push(duplicateObj);
      };

      $scope.updateDocument = function(closeDocumentView) {
        $scope.doc.put();

        if (closeDocumentView) {
          $scope.showAllDocuments();
        }
      };

      $scope.showAllDocuments = function() {
        $state.go('pub.documents');
      };
      
      $scope.downloadPdf = function() {
        $scope.doc.put().then(function(obj) {
          // console.log(obj);
          // window.open('/documents/' + obj._id + '/pdf');
        });
      };
      
      $scope.deleteModal = function() {
        $scope.deleteModalVisible = !$scope.deleteModalVisible;
      };
      
      $scope.deleteDocument = function() {
        _.remove($scope.documents, function(doc) {
          return doc._id === $scope.doc._id;
        });
        $scope.doc.remove();
        $scope.deleteModal();
        $scope.showAllDocuments();
      };

      $scope.saveModal = function() {
        $scope.saveModalVisible = !$scope.saveModalVisible;
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
    'fonts',
    function($scope, $state, documentServices, zoomLevels, fonts) {
      $scope.zoomLevels = zoomLevels;
      $scope.fonts = fonts;

      $scope.addObject = function(objType) {
        $scope.doc.shapes.push(documentServices.newShape(objType));
        $scope.toggleInspector(null);
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