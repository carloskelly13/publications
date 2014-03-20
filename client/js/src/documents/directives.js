(function() {
  'use strict';

  var pub = angular.module('pub.documents.directives', []);

  pub.directive('pubDraggable', function($document) {
    return function(scope, element, attr) {
      var eX = 0, eY = 0, oX = 0, oY = 0;
      
      element.on('mousedown', function(event) {
        $document.on('mousemove', updatePosition);
        $document.on('mouseup', mouseup);
        eX = event.x;
        eY = event.y;
        oX = scope.selectedObj.x;
        oY = scope.selectedObj.y;
      });
      
      
      function updatePosition(event) {
        scope.$apply(function() {
          scope.selectedObj.x = oX + ((event.x - eX) / scope.dpi / scope.zoomLevel);
          scope.selectedObj.y = oY + ((event.y - eY) / scope.dpi / scope.zoomLevel);          
        });
      };
      
      function mouseup() {
        $document.unbind('mousemove', updatePosition);
        $document.unbind('mouseup', mouseup);
        scope.$apply(function() {
          if (scope.snapToGrid) {
            scope.selectedObj.x = parseFloat((Math.round(scope.selectedObj.x * 4) / 4).toFixed(2));
            scope.selectedObj.y = parseFloat((Math.round(scope.selectedObj.y * 4) / 4).toFixed(2)); 
          } else {
            scope.selectedObj.x = parseFloat(scope.selectedObj.x.toFixed(2));
            scope.selectedObj.y = parseFloat(scope.selectedObj.y.toFixed(2));
          }
        });
        eX = 0;
        eY = 0;
        oX = 0;
        oY = 0;
      }
    }
  });
  
  pub.directive('pubResizable', function($document) {
    return function(scope, element, attr) {
      var coordinate = scope.objAnchor.coodrinate,
        selectedObj = scope.selectedObj;
    }
  });
}());