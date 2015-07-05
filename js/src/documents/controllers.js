(function() {
  'use strict';

  angular.module('pub.documents.controllers', [])

    .value('typefaces', ['Source Serif Pro', 'Source Sans Pro'])

    .value('fontWeights', [{weight: '400'}, {weight: '500'}, {weight: '600'}])

    .value('objAnchors', {
      size: 10,
      points: [
        {coordinate: 'nw', x: 0, y: 0},
        {coordinate: 'n', x: 0.5, y: 0},
        {coordinate: 'ne', x: 1, y: 0},
        {coordinate: 'w', x: 0, y: 0.5},
        {coordinate: 'e', x: 1, y: 0.5},
        {coordinate: 'sw', x: 0, y: 1},
        {coordinate: 's', x: 0.5, y: 1},
        {coordinate: 'se', x: 1, y: 1}
      ]
    })

    .value('colors', [
      '#fff', '#f5f5f5', '#e0e0e0', '#bdbdbd', '#9e9e9e', '#757575',
      '#616161', '#424242', '#212121', '#000', '#d50000', '#f44336',
      '#e91e63', '#9c27b0', '#ba68c8', '#7e57c2', '#3f51b5', '#2196f3',
      '#90caf9', '#03A9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a',
      '#aeea00', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548'
    ])

    .controller('DocumentsController', [
      '$scope',
      '$state',
      '$location',
      'Restangular',
      'authentication',
      'documents',
      'typefaces',
      function($scope, $state, $location, Restangular, authentication, documents, typefaces) {
        var documentsApi = Restangular.all('documents');
        $scope.updateAuthenticationStatus();
        $scope.documentsApi = documentsApi;
        $scope.documents = documents;
        $scope.dpi = 72;
        $scope.typefaces = typefaces;
      }
    ])

    .controller('DocumentsIndexController', [
      '$http',
      '$scope',
      '$state',
      '$location',
      'documentServices',
      'securityContext',
      function($http, $scope, $state, $location, documentServices) {
        $scope.selectedDoc = null;
        $scope.iconDpi = 15;
        $scope.newDocumentModalVisible = false;

        this.newDocument = function() {
          $scope.documentsApi.post({
            name: $scope.newName,
            width: $scope.newWidth,
            height: $scope.newHeight
          }).then(function(newDocument) {
            $scope.documents.push(newDocument);
            $scope.newDocumentModalVisible = false;
            $scope.newName = '';
            $scope.newWidth = '';
            $scope.newHeight = '';
          });
        };

        $scope.documentIconSize = function(doc) {
          var iconDpi = 15,
            iconWidth = Math.max(Math.min(doc.width * iconDpi, 160), 30),
            iconHeight = (iconWidth / doc.width) * doc.height;

          return {width: iconWidth + 'px', height: iconHeight + 'px'};
        };

        this.documentIconSelected = function(sender) {
          $scope.selectedDoc = sender;
        };

        this.openDocument = function(doc) {
          $state.go('pub.documents.document.view', {
            documentId: doc._id
          });
        };

        this.downloadPdf = function() {
          if (!!$scope.selectedDoc) {
            documentServices.downloadPdf($scope.selectedDoc._id, $scope.selectedDoc.name);
          }
        };

        this.viewUser = function() {
          $state.go('pub.user');
        };

        this.deleteDocument = function(sender) {
          sender.remove().then(function() {
            var idx = $scope.documents.indexOf(sender);
            if (idx > -1) { $scope.documents.splice(idx, 1); }
          });
        };
      }
    ])

    .controller('DocumentController', [
      '$scope',
      '$state',
      '$window',
      '$timeout',
      '$mdToast',
      '$mdDialog',
      '$animate',
      '$document',
      'documentServices',
      'doc',
      'colors',
      function($scope, $state, $window, $timeout, $mdToast, $mdDialog, $animate, $document, documentServices, doc, colors) {
        $scope.doc = doc;
        $scope.selectedObj = null;
        $scope.showCanvasGrid = true;
        $scope.snapToGrid = true;
        $scope.clipboard = null;
        $scope.showInspector = false;
        $scope.zoomLevel = 1;
        $scope.colors = colors;
        $scope.editingText = false;

        var postDocumentToServer = function(closeDocumentView) {
          $scope.doc.put();

          if (closeDocumentView) {
            var idx = _.findIndex($scope.documents, { _id: $scope.doc._id });
            $scope.documents[idx] = $scope.doc;
            $state.go('pub.documents.index');
          }
        };

        this.updateDocument = function() {
          postDocumentToServer(false);

          $mdToast.show($mdToast.simple()
            .content($scope.doc.name + ' saved.')
            .hideDelay(2000)
            .highlightAction(false)
            .position('top right')
          );
        };

        this.viewAllDocuments = function(event) {
          $mdDialog.show({
            clickOutsideToClose: true,
            locals: {
              docName: $scope.doc.name || ''
            },
            targetEvent: event,
            template: '<md-dialog>' +
                      ' <md-dialog-content>' +
                      '   <h2>Do you want to save the changes made to {{docName}}?</h2>' +
                      '   <p>Your changes will be lost if you don’t save them.</p>' +
                      '   <button class="btn frame pull-left" ng-click="cancelSelected()">Cancel</button>' +
                      '   <button class="btn frame" ng-click="saveSelected()">Save</button>' +
                      '   <button class="btn frame" ng-click="dontSaveSelected()">Donʼt Save</button>' +
                      ' </md-dialog-content>' +
                      '</md-dialog>',
            controller: [
              '$scope',
              'docName',
              function SaveDialogController($dialogScope, docName) {
                $dialogScope.docName = docName;

                $dialogScope.cancelSelected = function() {
                  $mdDialog.cancel();
                };

                $dialogScope.saveSelected = function() {
                  $mdDialog.hide();
                  postDocumentToServer(true);
                };

                $dialogScope.dontSaveSelected = function() {
                  $mdDialog.hide();
                  $state.go('pub.documents.index');
                };
              }
            ]
          });
        };

        this.shiftLayer = function(offset) {
          documentServices.offsetShape($scope.doc.shapes, $scope.selectedObj, offset);
        };

        this.toggleCanvasGrid = function() {
          $scope.showCanvasGrid = !$scope.showCanvasGrid;
        };

        this.toggleSnapToGrid = function() {
          $scope.snapToGrid = !$scope.snapToGrid;
        };

        this.cutObj = function() {
          $scope.clipboard = angular.copy($scope.selectedObj);
          var objIdx = $scope.doc.shapes.indexOf($scope.selectedObj);
          $scope.doc.shapes.splice(objIdx, 1);
          $scope.selectedObj = null;
        };

        this.deleteObj = function() {
          var objIdx = $scope.doc.shapes.indexOf($scope.selectedObj);
          $scope.doc.shapes.splice(objIdx, 1);
          $scope.selectedObj = null;
        };

        this.copyObj = function() {
          $scope.clipboard = angular.copy($scope.selectedObj);
        };

        this.pasteObj = function() {
          var duplicateObj = angular.copy($scope.clipboard);
          duplicateObj._id = undefined;
          duplicateObj.x += 0.25;
          duplicateObj.y += 0.25;
          $scope.doc.shapes.push(duplicateObj);
          $scope.svgObjectSelected(duplicateObj);
        };

        this.addObject = function(objType) {
          $scope.doc.shapes.push(documentServices.newShape(objType));
        };

        this.changeTextAlign = function(textAlign) {
          $scope.selectedObj.textAlign = textAlign;
        };

        this.setZoomLevel = function(zoomLevel) {
          $scope.zoomLevel = zoomLevel;
        };

        $scope.canMoveObjectByOffset = function(offset) {
          var objIdx = $scope.doc.shapes.indexOf($scope.selectedObj);

          if (offset === -1 && objIdx === 0) {
            return false;
          } else if (offset === 1 && objIdx === ($scope.doc.shapes.length - 1)) {
            return false;
          } else {
            return true;
          }
        };
      }
    ])

    .controller('DocumentCanvasController', [
      '$scope',
      'documentServices',
      'objAnchors',
      function($scope, documentServices, objAnchors) {
        $scope.objAnchors = objAnchors;

        this.svgObjectSelected = function(obj) {
          $scope.$parent.selectedObj = obj;
          $scope.$parent.showInspector = obj !== null;
          $scope.$parent.editingText = false;
        };

        this.selectedObjDblClick = function() {
          if ($scope.selectedObj.type === 'text') {
            $scope.$parent.editingText = true;
          }
        };

        $scope.xAxisRange = function() {
          return _.range($scope.doc.width / 0.25);
        };

        $scope.yAxisRange = function() {
          return _.range($scope.doc.height / 0.25);
        };

        $scope.unitDivider = function() {
          return ($scope.zoomLevel > 1) ? 0.5 : 1;
        };
      }
    ]);
}());
