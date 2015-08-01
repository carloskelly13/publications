(function() {
  angular.module('pub.documents.directives', [])
    .directive('pubDraggable', pubDraggable)
    .directive('pubResizable', pubResizable)
    .directive('pubShapeRectangle', pubShapeRectangle)
    .directive('pubShapeEllipse', pubShapeEllipse)
    .directive('pubShapeText', pubShapeText)
    .directive('pubColorPicker', pubColorPicker)
    .directive('pubTypefacePicker', pubTypefacePicker)
    .directive('pubDocumentItem', pubDocumentItem)
    .directive('pubDocumentSvg', pubDocumentSvg);

  function pubDraggable($document) {
    return function(scope, element) {
      let eX = 0, eY = 0, oX = 0, oY = 0;

      function updatePosition(event) {
        scope.$apply(() => {
          scope.selectedObj.x = oX + ((event.pageX - eX) / scope.dpi / scope.zoomLevel);
          scope.selectedObj.y = oY + ((event.pageY - eY) / scope.dpi / scope.zoomLevel);
        });
      }

      function dragEnd() {
        $document.unbind('mousemove', updatePosition);
        $document.unbind('mouseup', dragEnd);
        $document.unbind('touchmove', updatePosition);
        $document.unbind('touchend', dragEnd);
        scope.$apply(() => {
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

      element.on('mousedown', dragStart);
      element.on('touchstart', dragStart);
    };
  }

  function pubResizable($document) {
    return function(scope, element) {
      let coordinate = scope.objAnchor.coordinate;
      let eX = 0, eY = 0, oX = 0, oY = 0, oW = 0, oH = 0;

      function updateFrame(event) {
        scope.$apply(() => {
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
        scope.$apply(() => {
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

      element.on('mousedown', resizeStart);
      element.on('touchstart', resizeStart);
    };
  }

  function pubShapeRectangle() {
    return {
      scope: {
        shape: '=',
        zoomLevel: '=',
        selectedObj: '='
      },
      restrict: 'E',
      templateNamespace: 'svg',
      replace: true,
      template: `
        <rect ng-attr-x="{{shape.x * dpi * zoomLevel}}"
              ng-attr-y="{{shape.y * dpi * zoomLevel}}"
              ng-attr-rx="{{shape.r * zoomLevel}}"
              ng-attr-ry="{{shape.r * zoomLevel}}"
              ng-attr-height="{{shape.height * dpi * zoomLevel}}"
              ng-attr-width="{{shape.width * dpi * zoomLevel}}"
              ng-attr-fill="{{shape.fill}}"
              ng-attr-stroke="{{shape.stroke}}"
              ng-attr-stroke-width="{{shape.strokeWidth * zoomLevel}}"
              ng-attr-fill-opacity="{{shape.fillOpacity}}"
              ng-attr-stroke-opacity="{{shape.strokeOpacity}}" />
      `,
      link: function(scope) {
        scope.dpi = 72;
      }
    };
  }

  function pubShapeEllipse() {
    return {
      scope: {
        shape: '=',
        zoomLevel: '=',
        selectedObj: '='
      },
      restrict: 'E',
      templateNamespace: 'svg',
      replace: true,
      template: `
        <ellipse ng-attr-cx="{{(shape.x * dpi * zoomLevel) + (shape.width / 2.0 * dpi * zoomLevel)}}"
                 ng-attr-cy="{{(shape.y * dpi * zoomLevel) + (shape.height / 2.0 * dpi * zoomLevel)}}"
                 ng-attr-rx="{{shape.width / 2.0 * dpi * zoomLevel}}"
                 ng-attr-ry="{{shape.height / 2.0 * dpi * zoomLevel}}"
                 ng-attr-fill="{{shape.fill}}"
                 ng-attr-stroke="{{shape.stroke}}"
                 ng-attr-stroke-width="{{shape.strokeWidth * zoomLevel}}"
                 ng-attr-fill-opacity="{{shape.fillOpacity}}"
                 ng-attr-stroke-opacity="{{shape.strokeOpacity}}" />
      `,
      link: function(scope) {
        scope.dpi = 72;
      }
    };
  }

  function pubShapeText() {
    return {
      scope: {
        shape: '=',
        zoomLevel: '=',
        selectedObj: '='
      },
      restrict: 'E',
      templateNamespace: 'svg',
      replace: true,
      template: `
        <foreignObject ng-attr-x="{{shape.x * dpi * zoomLevel}}"
                       ng-attr-y="{{shape.y * dpi * zoomLevel}}"
                       ng-attr-height="{{shape.height * dpi * zoomLevel}}"
                       ng-attr-width="{{shape.width * dpi * zoomLevel}}">
          <p ng-style="{color: shape.color,
             fontFamily: shape.fontFamily,
             fontStyle: shape.fontStyle,
             fontSize: (shape.fontSize * zoomLevel) + \'px\',
             fontWeight: shape.fontWeight,
             textAlign: shape.textAlign }">
            {{shape.text}}
          </p>
      </foreignObject>
      `,
      link: function(scope) {
        scope.dpi = 72;
      }
    };
  }

  function pubColorPicker() {
    return {
      scope: {
        color: '=',
        colors: '=',
        selectedObj: '=',
        property: '@'
      },
      templateUrl: '/views/directives/color-picker.html',
      link: (scope) => {
        scope.updateColor = (color) => {
          scope.selectedObj[scope.property] = color;
        };
      }
    };
  }

  function pubTypefacePicker() {
    return {
      scope: {
        typefaces: '=',
        selectedObj: '='
      },
      templateUrl: '/views/directives/typeface-picker.html',
      link: (scope) => {
        scope.updateTypeface = (typeface) => {
          scope.selectedObj.fontFamily = typeface;
        };
      }
    };
  }

  function pubDocumentItem() {
    return {
      templateUrl: '/views/directives/document-item.html'
    };
  }

  function pubDocumentSvg() {
    return {
      templateUrl: '/views/directives/svg.html'
    };
  }

}());
