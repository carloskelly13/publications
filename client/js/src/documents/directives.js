(function() {
  'use strict';

  var pub = angular.module('pub.documents.directives', []);

  pub.directive('pubDraggable', function($document) {
    return function(scope, element) {
      var eX = 0, eY = 0, oX = 0, oY = 0;

      element.on('mousedown', dragStart);
      element.on('touchstart', dragStart);

      function dragStart(event) {
        $document.on('mousemove', updatePosition);
        $document.on('mouseup', dragEnd);
        $document.on('touchmove', updatePosition);
        $document.on('touchend', dragEnd);
        eX = event.pageX;
        eY = event.pageY;
        oX = scope.selectedObj.x;
        oY = scope.selectedObj.y;
      }

      function updatePosition(event) {
        scope.$apply(function() {
          scope.selectedObj.x = oX + ((event.pageX - eX) / scope.dpi / scope.zoomLevel);
          scope.selectedObj.y = oY + ((event.pageY - eY) / scope.dpi / scope.zoomLevel);
        });
      }

      function dragEnd() {
        $document.unbind('mousemove', updatePosition);
        $document.unbind('mouseup', dragEnd);
        $document.unbind('touchmove', updatePosition);
        $document.unbind('touchend', dragEnd);
        scope.$apply(function() {
          if (scope.snapToGrid) {
            scope.selectedObj.x = parseFloat((Math.round(scope.selectedObj.x * 4) / 4).toFixed(3));
            scope.selectedObj.y = parseFloat((Math.round(scope.selectedObj.y * 4) / 4).toFixed(3));
          } else {
            scope.selectedObj.x = parseFloat(scope.selectedObj.x.toFixed(3));
            scope.selectedObj.y = parseFloat(scope.selectedObj.y.toFixed(3));
          }
        });
        eX = eY = oX = oY = 0;
      }
    }
  });

  pub.directive('pubResizable', function($document) {
    return function(scope, element) {
      var coordinate = scope.objAnchor.coordinate;
      var eX = 0, eY = 0, oX = 0, oY = 0, oW = 0, oH = 0;

      element.on('mousedown', resizeStart);
      element.on('touchstart', resizeStart);

      function resizeStart(event) {
        $document.on('mousemove', updateFrame);
        $document.on('mouseup', resizeEnd);
        $document.on('touchmove', updateFrame);
        $document.on('touchend', resizeEnd);
        eX = event.pageX;
        eY = event.pageY;
        oX = scope.selectedObj.x;
        oY = scope.selectedObj.y;
        oW = scope.selectedObj.width;
        oH = scope.selectedObj.height;
      }

      function updateFrame(event) {
        scope.$apply(function() {
          if (_.contains(coordinate, 'n')) {
            scope.selectedObj.height = Math.max(oH + ((eY - event.pageY) / scope.dpi / scope.zoomLevel), 0);

            if (scope.selectedObj.height > 0) {
              scope.selectedObj.y = oY + ((event.pageY - eY) / scope.dpi / scope.zoomLevel);
            }

          } else if (_.contains(coordinate, 's')) {
            scope.selectedObj.height = Math.max(oH + ((event.pageY - eY) / scope.dpi / scope.zoomLevel), 0);
          }

          if (_.contains(coordinate, 'e')) {
            scope.selectedObj.width = Math.max(oW + ((event.pageX - eX) / scope.dpi / scope.zoomLevel), 0);

          } else if (_.contains(coordinate, 'w')) {
            scope.selectedObj.width = Math.max(oW + ((eX - event.pageX) / scope.dpi / scope.zoomLevel), 0);

            if (scope.selectedObj.width > 0) {
              scope.selectedObj.x = oX + ((event.pageX - eX) / scope.dpi / scope.zoomLevel);
            }
          }
        });
      }

      function resizeEnd() {
        $document.unbind('mousemove', updateFrame);
        $document.unbind('mouseup', resizeEnd);
        $document.unbind('touchmove', updateFrame);
        $document.unbind('touchend', resizeEnd);
        scope.$apply(function() {
          if (scope.snapToGrid) {
            scope.selectedObj.width = parseFloat((Math.round(scope.selectedObj.width * 4) / 4).toFixed(2));
            scope.selectedObj.height = parseFloat((Math.round(scope.selectedObj.height * 4) / 4).toFixed(2));
            scope.selectedObj.x = parseFloat((Math.round(scope.selectedObj.x * 4) / 4).toFixed(3));
            scope.selectedObj.y = parseFloat((Math.round(scope.selectedObj.y * 4) / 4).toFixed(3));
          } else {
            scope.selectedObj.width = parseFloat(scope.selectedObj.width.toFixed(3));
            scope.selectedObj.height = parseFloat(scope.selectedObj.height.toFixed(3));
            scope.selectedObj.x = parseFloat(scope.selectedObj.x.toFixed(3));
            scope.selectedObj.y = parseFloat(scope.selectedObj.y.toFixed(3));
          }
        });
        eX = eY = oX = oY = oW = oH = 0;
      }
    }
  });

  pub.directive('pubColorPicker', function() {
    return {
      scope: {
        color: '='
      },
      templateUrl: '/views/directives/color-picker.html'
    }
  });

  pub.directive('pubDocumentItem', function() {
    return {
      templateUrl: '/views/directives/document-item.html'
    }
  });

  pub.directive('pubDocumentSvg', function() {
    return {
      templateUrl: '/views/directives/svg.html'
    }
  });

  pub.directive('pubInspector', function() {
    return {
      templateUrl: '/views/documents/inspector.html'
    }
  });
}());
